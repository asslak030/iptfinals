"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Gamepad2, 
  Download, 
  Calendar, 
  ArrowLeft, 
  Play,
  Filter,
  X,
  Search,
  DollarSign,
  Monitor
} from "lucide-react";

interface PurchasedGame {
  id: number;
  gameId: number;
  gameName: string;
  category: string;
  price: number;
  imageUrl: string;
  platform: string;
  purchaseDate: string;
  downloadUrl?: string;
  playable: boolean;
  description?: string;
  rating?: number;
}

export default function LibraryPage() {
  const router = useRouter();
  const [purchasedGames, setPurchasedGames] = useState<PurchasedGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<PurchasedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  useEffect(() => {
    const loadPurchasedGames = async () => {
      try {
        const savedPurchases = localStorage.getItem('purchasedGames');
        
        if (savedPurchases) {
          const purchases = JSON.parse(savedPurchases);
          // Add mock data for demonstration
          const enhancedPurchases = purchases.map((game: PurchasedGame) => ({
            ...game,
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          }));
          setPurchasedGames(enhancedPurchases);
          setFilteredGames(enhancedPurchases);
        } else {
          setPurchasedGames([]);
          setFilteredGames([]);
        }
      } catch (error) {
        console.error("Failed to load purchased games:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPurchasedGames();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = purchasedGames;

    // Apply search filter
    if (searchTerm.trim()) {
      result = result.filter(game =>
        game.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.platform.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply platform filter
    if (platformFilter !== "all") {
      result = result.filter(game => game.platform === platformFilter);
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
        case "name":
          return a.gameName.localeCompare(b.gameName);
        case "price":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredGames(result);
  }, [purchasedGames, searchTerm, platformFilter, sortBy]);

  const handleDownload = (game: PurchasedGame) => {
    alert(`Starting download for ${game.gameName}...`);
    console.log("Download URL:", game.downloadUrl);
  };

  const handlePlay = (game: PurchasedGame) => {
    if (game.playable) {
      alert(`Launching ${game.gameName}...`);
    } else {
      alert("This game is not currently playable. Please download it first.");
    }
  };

  const getUniquePlatforms = () => {
    return [...new Set(purchasedGames.map(game => game.platform))];
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPlatformFilter("all");
    setSortBy("recent");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalSpent = purchasedGames.reduce((sum, game) => sum + game.price, 0);
  const averageRating = purchasedGames.length > 0 
    ? (purchasedGames.reduce((sum, game) => sum + (game.rating || 0), 0) / purchasedGames.length).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your game library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
              >
                <ArrowLeft size={20} />
                Back to Store
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                  <Gamepad2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">My Game Library</h1>
                  <p className="text-gray-600">Your personal collection of purchased games</p>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="text-right">
              <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {purchasedGames.length}
              </p>
              <p className="text-sm text-gray-600">Games Owned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Bar */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold">{purchasedGames.length}</p>
              <p className="text-indigo-200 text-sm">Total Games</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <DollarSign className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold">₱{totalSpent.toFixed(2)}</p>
              <p className="text-indigo-200 text-sm">Total Spent</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold">{averageRating}</p>
              <p className="text-indigo-200 text-sm">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline w-4 h-4 mr-1" />
                Search Games
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name or platform..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Monitor className="inline w-4 h-4 mr-1" />
                Platform
              </label>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Platforms</option>
                {getUniquePlatforms().map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="name">A to Z</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || platformFilter !== "all") && (
            <div className="flex flex-wrap gap-2 mt-4 items-center">
              <span className="text-sm text-gray-600 font-medium">Active filters:</span>
              
              {searchTerm && (
                <span className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-full text-sm flex items-center gap-2 border border-indigo-200">
                  <Search size={14} />
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="hover:text-indigo-900 ml-1">
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {platformFilter !== "all" && (
                <span className="bg-green-100 text-green-700 px-3 py-2 rounded-full text-sm flex items-center gap-2 border border-green-200">
                  <Monitor size={14} />
                  Platform: {platformFilter}
                  <button onClick={() => setPlatformFilter("all")} className="hover:text-green-900 ml-1">
                    <X size={14} />
                  </button>
                </span>
              )}
              
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1 ml-auto bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                <X size={16} />
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Game Library Grid */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <Gamepad2 className="h-20 w-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {purchasedGames.length === 0 ? "Your Library is Empty" : "No Games Match Your Filters"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {purchasedGames.length === 0 
                ? "Start building your collection by purchasing games from our store!" 
                : "Try adjusting your search criteria or filters to find your games."}
            </p>
            {purchasedGames.length === 0 && (
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl font-semibold"
              >
                Browse Games Store
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="relative">
                  <img
                    src={game.imageUrl}
                    alt={game.gameName}
                    className="w-full h-48 object-cover rounded-t-xl group-hover:brightness-110 transition"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.png";
                    }}
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
                      ⭐ {game.rating}/5
                    </span>
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      Owned
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition">
                      {game.gameName}
                    </h3>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Monitor size={14} />
                        Platform:
                      </span>
                      <span className="font-medium">{game.platform}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Calendar size={14} />
                        Purchased:
                      </span>
                      <span className="font-medium">{formatDate(game.purchaseDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <DollarSign size={14} />
                        Price Paid:
                      </span>
                      <span className="font-bold text-green-600">₱{game.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(game)}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl"
                    >
                      <Download size={16} />
                      Download
                    </button>
                    <button
                      onClick={() => handlePlay(game)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition flex items-center justify-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl"
                    >
                      <Play size={16} />
                      Play Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}