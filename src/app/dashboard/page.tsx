"use client";

import { useEffect, useState } from "react";
import {
  Search,
  X,
  Gamepad2,
  ChevronDown,
  ShoppingCart,
  Library,
} from "lucide-react";
import { useRouter } from "next/navigation";

type GameItem = {
  id: number;
  gameName: string;
  category: string;
  price: number;
  imageUrl: string;
  userId: string;
  description: string;
  platform: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [games, setGames] = useState<GameItem[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"games" | "categories">("games");

  // === Fetch all games on mount ===
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("/api/games");
        if (!res.ok) throw new Error("Failed to fetch games");
        const data: GameItem[] = await res.json();
        console.log("🎮 Fetched games:", data); // Debug log
        setGames(data);
        setFilteredGames(data);
        const uniqueCategories = [
          ...new Set(data.map((g: GameItem) => g.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  // === Handle search ===
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      setFilteredGames(games);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setFilteredGames(data);
      setActiveTab("games");
    } catch (err) {
      console.error("❌ Search failed:", err);
    } finally {
      setSearching(false);
    }
  };

  // === Handle category filter ===
  const filterByCategory = (category: string) => {
    const filtered = games.filter((g) => g.category === category);
    setFilteredGames(filtered);
    setShowCategories(false);
    setActiveTab("games");
  };

  // === Handle purchase click ===
  const handlePurchase = (game: GameItem) => {
    // Redirect to billing page with game data
    const params = new URLSearchParams({
      gameId: game.id.toString(),
      gameName: encodeURIComponent(game.gameName),
      price: game.price.toString(),
      platform: encodeURIComponent(game.platform),
      imageUrl: encodeURIComponent(game.imageUrl || "/placeholder.png")
    });
    
    window.location.href = `/billing?${params.toString()}`;
  };

  // === Helper function to get platform display name ===
  const getPlatformDisplayName = (platform: string) => {
    if (!platform) return "Unknown Platform";
    
    // Return the platform as-is from the database
    return platform;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
        Loading games...
      </div>
    );
  }

  return (
    <main className="p-6 max-w-7xl mx-auto relative">
      {/* 🧭 Top Navigation Bar */}
      <nav className="flex justify-between items-center mb-8 bg-white/60 backdrop-blur-md rounded-xl shadow px-6 py-4 sticky top-4 z-30">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-2xl">
          <Gamepad2 size={28} />
          <span>GameHub</span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              setActiveTab("games");
              setFilteredGames(games);
            }}
            className={`font-medium transition ${
              activeTab === "games"
                ? "text-indigo-600 border-b-2 border-indigo-600 pb-1"
                : "text-gray-600 hover:text-indigo-500"
            }`}
          >
            Games ({games.length})
          </button>

          <div className="relative">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className={`flex items-center gap-1 font-medium transition ${
                activeTab === "categories"
                  ? "text-indigo-600 border-b-2 border-indigo-600 pb-1"
                  : "text-gray-600 hover:text-indigo-500"
              }`}
            >
              Categories <ChevronDown size={16} />
            </button>

            {showCategories && (
              <div className="absolute top-10 left-0 bg-white shadow-lg rounded-lg border w-48 z-40">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => filterByCategory(cat)}
                      className="block w-full text-left px-4 py-2 hover:bg-indigo-50 text-gray-700"
                    >
                      {cat}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm p-3 text-center">
                    No categories
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 🆕 Library Button */}
          <button
            onClick={() => router.push('/library')}
            className="flex items-center gap-2 font-medium text-gray-600 hover:text-indigo-500 transition"
          >
            <Library size={18} />
            My Library
          </button>
        </div>
      </nav>

      {/* 🔍 Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-3 mb-8 bg-white/70 rounded-lg px-4 py-3 shadow-sm border"
      >
        <input
          type="text"
          placeholder="Search game..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full border-none bg-transparent outline-none text-gray-700"
        />
        <button
          type="submit"
          disabled={searching}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Search size={18} />
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {/* 🎮 Game Grid */}
      <div
        className={`grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 transition-all duration-300 ${
          selectedGame ? "blur-sm scale-[0.98]" : ""
        }`}
      >
        {filteredGames.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">
            No games found.
          </p>
        ) : (
          filteredGames.map((game) => {
            const name =
              game.gameName || (game as any).game_name || "Untitled Game";
            const image =
              game.imageUrl || (game as any).image_url || "/placeholder.png";
            const platform = game.platform || "Unknown Platform";

            return (
              <div
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className="border rounded-xl shadow-sm p-4 hover:shadow-lg transition cursor-pointer bg-white/80 backdrop-blur-sm hover:-translate-y-1"
              >
                <img
                  src={image}
                  alt={name}
                  className="rounded-md w-full h-44 object-cover mb-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.png";
                  }}
                />
                <h2 className="font-semibold text-lg text-gray-800 line-clamp-1">
                  {name}
                </h2>
                <p className="text-sm text-gray-600">{game.category}</p>

                {/* 💻 Platform Display - TEXT ONLY */}
                <div className="mt-2">
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded border">
                    {getPlatformDisplayName(platform)}
                  </span>
                </div>

                <p className="text-sm mt-2 text-indigo-600 font-medium">
                  💰 ${typeof game.price === 'number' ? game.price.toFixed(2) : '0.00'}
                </p>
                
                {/* Description Preview */}
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  {game.description || "No description available"}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* 🔍 Zoom Modal */}
      {selectedGame && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 relative animate-zoomIn shadow-2xl border">
            <button
              onClick={() => setSelectedGame(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1 shadow-md"
            >
              <X size={20} />
            </button>

            <img
              src={
                selectedGame.imageUrl ||
                (selectedGame as any).image_url ||
                "/placeholder.png"
              }
              alt={selectedGame.gameName}
              className="rounded-lg w-full h-64 object-cover mb-4"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.png";
              }}
            />

            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              {selectedGame.gameName ||
                (selectedGame as any).game_name ||
                "Untitled Game"}
            </h2>

            <div className="space-y-2 mb-4">
              <p className="text-gray-600">
                <span className="font-semibold">Category:</span> {selectedGame.category}
              </p>
              
              <p className="text-gray-600">
                <span className="font-semibold">Platform:</span>{" "}
                <span className="font-medium bg-gray-100 px-2 py-1 rounded text-sm">
                  {getPlatformDisplayName(selectedGame.platform)}
                </span>
              </p>
              
              <p className="text-gray-600">
                <span className="font-semibold">Price:</span> 💰{" "}
                <span className="font-bold text-indigo-600">
                  ${typeof selectedGame.price === 'number' ? selectedGame.price.toFixed(2) : '0.00'}
                </span>
              </p>
            </div>

            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
              {selectedGame.description || "No description provided."}
            </p>

            {/* 🛒 Purchase Button */}
            <button
              onClick={() => handlePurchase(selectedGame)}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition w-full font-semibold"
            >
              <ShoppingCart size={18} />
              Purchase Now - ${typeof selectedGame.price === 'number' ? selectedGame.price.toFixed(2) : '0.00'}
            </button>
          </div>
        </div>
      )}

      {/* Animation style */}
      <style jsx>{`
        @keyframes zoomIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-zoomIn {
          animation: zoomIn 0.3s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}