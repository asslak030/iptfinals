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
  Search
} from "lucide-react";

interface PurchasedGame {
  id: number;
  gameName: string;
  category: string;
  price: number;
  imageUrl: string;
  platform: string;
  purchaseDate: string;
  downloadUrl?: string;
  playable: boolean;
}

export default function LibraryPage() {
  const router = useRouter();
  const [purchasedGames, setPurchasedGames] = useState<PurchasedGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<PurchasedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    const loadPurchasedGames = async () => {
      try {
        // For demo: Load from localStorage
        // In a real app, fetch from your API: /api/user/purchased-games
        const savedPurchases = localStorage.getItem('purchasedGames');
        
        if (savedPurchases) {
          const purchases = JSON.parse(savedPurchases);
          setPurchasedGames(purchases);
          setFilteredGames(purchases);
        } else {
          // If no purchases, show empty state
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

  // Apply filters
  useEffect(() => {
    let result = purchasedGames;

    // Apply search filter
    if (searchTerm.trim()) {
      result = result.filter(game =>
        game.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply platform filter
    if (platformFilter !== "all") {
      result = result.filter(game => game.platform === platformFilter);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(game => game.category === categoryFilter);
    }

    setFilteredGames(result);
  }, [purchasedGames, searchTerm, platformFilter, categoryFilter]);

  const handleDownload = (game: PurchasedGame) => {
    // In a real app, this would trigger the actual download
    alert(`Starting download for ${game.gameName}...`);
    console.log("Download URL:", game.downloadUrl);
    
    // Simulate download process
    // window.location.href = game.downloadUrl;
  };

  const handlePlay = (game: PurchasedGame) => {
    if (game.playable) {
      alert(`Launching ${game.gameName}...`);
      // In a real app, this would launch the game or redirect to play page
    } else {
      alert("This game is not currently playable. Please download it first.");
    }
  };

  const getUniquePlatforms = () => {
    return [...new Set(purchasedGames.map(game => game.platform))];
  };

  const getUniqueCategories = () => {
    return [...new Set(purchasedGames.map(game => game.category))];
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPlatformFilter("all");
    setCategoryFilter("all");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalSpent = purchasedGames.reduce((sum, game) => sum + game.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your game library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} />
                Back to Store
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Gamepad2 className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">My Game Library</h1>
                  <p className="text-gray-600">Your purchased games collection</p>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-600">{purchasedGames.length}</p>
              <p className="text-sm text-gray-600">Games Owned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{purchasedGames.length}</p>
              <p className="text-indigo-200 text-sm">Total Games</p>
            </div>
            <div>
              <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
              <p className="text-indigo-200 text-sm">Total Spent</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {purchasedGames.filter(g => g.playable).length}
              </p>
              <p className="text-indigo-200 text-sm">Ready to Play</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Games
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Platforms</option>
                {getUniquePlatforms().map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || platformFilter !== "all" || categoryFilter !== "all") && (
            <div className="flex flex-wrap gap-2 mt-4 items-center">
              <span className="text-sm text-gray-600">Active filters:</span>
              
              {searchTerm && (
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="hover:text-indigo-900">
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {platformFilter !== "all" && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Platform: {platformFilter}
                  <button onClick={() => setPlatformFilter("all")} className="hover:text-green-900">
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {categoryFilter !== "all" && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Category: {categoryFilter}
                  <button onClick={() => setCategoryFilter("all")} className="hover:text-purple-900">
                    <X size={14} />
                  </button>
                </span>
              )}
              
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1 ml-auto"
              >
                <X size={16} />
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Game Library Grid */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <Gamepad2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {purchasedGames.length === 0 ? "No Games Purchased Yet" : "No Games Match Your Filters"}
            </h3>
            <p className="text-gray-600 mb-6">
              {purchasedGames.length === 0 
                ? "Purchase some games from the store to build your library!" 
                : "Try adjusting your search or filters"}
            </p>
            {purchasedGames.length === 0 && (
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Browse Games
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-300"
              >
                <img
                  src={game.imageUrl}
                  alt={game.gameName}
                  className="w-full h-48 object-cover rounded-t-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.png";
                  }}
                />
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                      {game.gameName}
                    </h3>
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                      Purchased
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Platform:</span>
                      <span className="font-medium">{game.platform}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{game.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Purchase Date:</span>
                      <span className="font-medium">{formatDate(game.purchaseDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price Paid:</span>
                      <span className="font-bold text-indigo-600">${game.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(game)}
                      className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Download size={16} />
                      Download
                    </button>
                    <button
                      onClick={() => handlePlay(game)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Play size={16} />
                      Play
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