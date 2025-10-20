"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { useState, useEffect } from "react";

export default function HomePage() {
  // modal state (works site-wide)
  const [selectedGameModal, setSelectedGameModal] = useState<null | {
    title: string;
    video?: string;
    description?: string;
    src?: string;
    price?: string;
    shopLink?: string;
  }>(null);

  // local wishlist state (simple client-side toggle)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("gv_wishlist");
        return raw ? JSON.parse(raw) : [];
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("gv_wishlist", JSON.stringify(wishlist));
      }
    } catch (e) {}
  }, [wishlist]);

  // master games array (featured & used for details)
  const games = [
    { src: "/games/dota.jpg", title: "Dota 2", price: "Free to Play", description: "Dota 2 is a multiplayer online battle arena game where two teams of five players compete to destroy the enemy's Ancient.", shopLink: "https://store.steampowered.com/app/570/Dota_2/" },
    { src: "/games/valorant.jpg", title: "Valorant", price: "Free to Play", description: "Valorant is a tactical 5v5 shooter with unique agent abilities and precise gunplay.", shopLink: "https://playvalorant.com/" },
    { src: "/games/blood.jpg", title: "Blood Strike", price: "Free to Play", description: "Blood Strike is a fast-paced FPS with action-packed rounds.", shopLink: "https://store.steampowered.com/" },
    { src: "/games/sonic.jpg", title: "Sonic Racing", price: "₱1,099", description: "Sonic Racing is a fun and fast-paced racing game with your favorite Sonic characters.", shopLink: "https://store.playstation.com" },
    { src: "/games/pubg.jpg", title: "PUBG: BattleGrounds", price: "Free to Play", description: "PUBG is a battle royale game where 100 players fight to be the last one standing.", shopLink: "https://store.steampowered.com/" },
    { src: "/games/apex.jpg", title: "Apex Legends", price: "Free to Play", description: "Apex Legends is a battle royale game with fast-paced combat and character abilities.", shopLink: "https://www.ea.com/games/apex-legends" },
    { src: "/games/gta.jpg", title: "Grand Theft Auto: V", price: "₱1,499", description: "GTA V is an open-world action-adventure game set in the city of Los Santos.", shopLink: "https://store.rockstargames.com/" },
    { src: "/games/marvel.jpg", title: "Marvel Rivals", price: "Free to Play", description: "Marvel Rivals is an action fighting game featuring Marvel superheroes and villains.", shopLink: "https://www.epicgames.com/store/" },
    { src: "/games/cs.jpg", title: "Counter Strike 2", price: "Free to Play", description: "Counter Strike 2 is a team-based tactical shooter focusing on skill and strategy.", shopLink: "https://store.steampowered.com/app/730/CounterStrike_2/" },
    { src: "/games/nba.webp", title: "NBA 2k25", price: "₱3,499", description: "NBA 2k25 is a basketball simulation game with realistic graphics and gameplay.", shopLink: "https://store.steampowered.com/" },
    { src: "/games/genshin.jpg", title: "Genshin Impact", price: "Free to Play", description: "Genshin Impact is an open-world RPG with elemental combat and co-op play.", shopLink: "https://genshin.hoyoverse.com/" },
    { src: "/games/cod.png", title: "Call of Duty: WarZone", price: "Free to Play", description: "Call of Duty: WarZone is a modern battle royale with fast-paced combat." },
  ];

  // 40+ games for categories (some items might not have video/description; modal will fallback)
  const allGames = [
    { src: "/games/valorant.jpg", title: "Valorant", category: "Shooter", price: "FREE TO PLAY" },
    { src: "/games/dota.jpg", title: "Dota 2", category: "Strategy", price: "FREE TO PLAY" },
    { src: "/games/apex.jpg", title: "Apex Legends", category: "Shooter", price: "FREE TO PLAY" },
    { src: "/games/evil.jpg", title: "Resident Evil 4", category: "Survival", price: "₱1,999.00" },
    { src: "/games/god.jpg", title: "God of War: Ragnarok", category: "RPG", price: "₱2,499.00" },
    { src: "/games/village.jpg", title: "Resident Evil Village", category: "Survival", price: "₱1,899.00" },
    { src: "/games/horizon.jpg", title: "Horizon Forbidden West", category: "RPG", price: "₱2,799.00" },
    { src: "/games/us.jpg", title: "Last of Us", category: "Survival", price: "₱2,299.00" },
    { src: "/games/spider.jpg", title: "Marvel’s Spider-Man Remastered", category: "RPG", price: "₱2,499.00" },
    { src: "/games/battle.jpg", title: "Battlefield™ 2042", category: "Shooter", price: "₱1,999.00" },
    { src: "/games/dead.jpg", title: "Red Dead Redemption 2", category: "RPG", price: "₱2,199.00" },
    { src: "/games/human.jpg", title: "Once Human", category: "Survival", price: "FREE TO PLAY" },
    { src: "/games/noman.jpg", title: "No Man's Sky", category: "RPG", price: "₱1,799.00" },
    { src: "/games/day.jpg", title: "Dead By Deadlight", category: "Survival", price: "₱799.00" },
    { src: "/games/ground.jpg", title: "Grounded", category: "Survival", price: "₱1,299.00" },
    { src: "/games/nara.jpg", title: "Naraka Bladepoint", category: "Strategy", price: "FREE TO PLAY" },
    { src: "/games/left4.jpg", title: "Left 4 Dead 2", category: "Shooter", price: "₱499.00" },
    { src: "/games/ghost.avif", title: "Ghost of Tsushima", category: "RPG", price: "₱2,199.00" },
    { src: "/games/zomb.jpg", title: "Project Zomboid", category: "Survival", price: "₱499.00" },
    { src: "/games/cors.jpg", title: "Assetto Corsa", category: "Racing", price: "₱599.00" },
    { src: "/games/hotshot.jpg", title: "Hotshot Racing", category: "Racing", price: "₱799.00" },
    { src: "/games/rise.jpg", title: "Rise: Race The Future", category: "Racing", price: "₱999.00" },
    { src: "/games/cyber.jpg", title: "Cyberpunk SFX", category: "RPG", price: "₱2,499.00" },
    { src: "/games/libre.jpg", title: "Calibre 10 Racing", category: "Racing", price: "₱899.00" },
    { src: "/games/project.jpg", title: "Project Cars", category: "Racing", price: "₱1,199.00" },
    { src: "/games/pro.jpg", title: "GPRO - Classic racing manager", category: "Strategy", price: "FREE TO PLAY" },
    { src: "/games/motor.jpg", title: "Mini Motor Racing X", category: "Racing", price: "₱699.00" },
    { src: "/games/race.jpg", title: "RaceRoom Racing Experience", category: "Racing", price: "FREE TO PLAY" },
    { src: "/games/lift.jpg", title: "Liftoff®: FPV Drone Racing", category: "Racing", price: "₱1,099.00" },
    { src: "/games/witch.jpg", title: "The Witcher 3", category: "RPG", price: "₱1,499.00" },
    { src: "/games/mon.jpg", title: "Monster Racing League", category: "Racing", price: "₱599.00" },
    { src: "/games/watch.png", title: "Overwatch® 2", category: "Shooter", price: "FREE TO PLAY" },
    { src: "/games/legend.jpg", title: "The Legend of Zelda: Breath of the Wild", category: "RPG", price: "₱3,299.00" },
    { src: "/games/scroll.jpg", title: "The Elder Scrolls V", category: "RPG", price: "₱2,299.00" },
    { src: "/games/proto.jpg", title: "The Callisto Protocol", category: "Survival", price: "₱2,099.00" },
    { src: "/games/final.jpg", title: "Final Fantasy 7 Remake", category: "RPG", price: "₱3,099.00" },
    { src: "/games/poke.jpg", title: "Pokemon Sword and Shield", category: "RPG", price: "₱2,899.00" },
    { src: "/games/fall.jpg", title: "Fallout New Vegas", category: "RPG", price: "₱1,199.00" },
    { src: "/games/car.jpg", title: "CarX Drift Racing Online", category: "Racing", price: "₱799.00" },
    { src: "/games/star.avif", title: "Stars Wars: Old Republic", category: "Strategy", price: "₱1,499.00" },
    { src: "/games/starve.jpg", title: "Don't Starve Together", category: "Survival", price: "₱699.00" },
    { src: "/games/hades.jpg", title: "Hades II", category: "RPG", price: "₱2,199.00" },
    { src: "/games/silent.avif", title: "Silent Hill f", category: "Survival", price: "₱2,399.00" },
    { src: "/games/digi.jpg", title: "Digimon Story Time Stranger", category: "RPG", price: "₱2,099.00" },
    { src: "/games/hell.jpg", title: "HELLDIVERS™ 2", category: "Shooter", price: "₱2,299.00" },
    { src: "/games/mega.jpg", title: "Megabonk", category: "Strategy", price: "FREE TO PLAY" },
    { src: "/games/diablo.jpg", title: "Diablo IV", category: "RPG", price: "₱3,499.00" },
    { src: "/games/creed.jpg", title: "Assassin's Creed II", category: "RPG", price: "₱1,299.00" },
  ];

  // helper: get details for modal (merge info from games[] master)
  const getGameDetails = (partial: { title?: string; src?: string; price?: string }) => {
    const byTitle = games.find((g) => g.title === partial.title);
    if (byTitle) return byTitle;
    // try match by src
    const bySrc = games.find((g) => g.src === partial.src);
    if (bySrc) return bySrc;
    // fallback to partial info
    return {
      title: partial.title ?? "Unknown Game",
      src: partial.src ?? "/games/placeholder.png",
      price: partial.price ?? "",
      description: "No description available.",
    };
  };

  // Featured carousel
  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(games.length / itemsPerSlide);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  // Category filtering state
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredGames =
    selectedCategory === "All"
      ? allGames
      : allGames.filter((g) => g.category === selectedCategory);

  // Pagination for filtered games
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  const currentGames = filteredGames.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  // open modal with merged details; autoplay requested
  const openGameModal = (partial: { title?: string; src?: string; price?: string }) => {
    const details = getGameDetails(partial);
    setSelectedGameModal(details);
  };

  const closeModal = () => setSelectedGameModal(null);

  // close modal on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // wishlist toggle
  const toggleWishlist = (title: string) => {
    setWishlist((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  // Sample Most Played list
  const mostPlayedList = [
    { src: "/games/dota.jpg", title: "Dota 2", price: "Free to Play" },
    { src: "/games/valorant.jpg", title: "Valorant", price: "Free to Play" },
    { src: "/games/apex.jpg", title: "Apex Legends", price: "Free to Play" },
    { src: "/games/cs.jpg", title: "Counter Strike 2", price: "Free to Play" },
    { src: "/games/pubg.jpg", title: "PUBG: BattleGrounds", price: "Free to Play" },
    { src: "/games/genshin.jpg", title: "Genshin Impact", price: "Free to Play" },
    { src: "/games/marvel.jpg", title: "Marvel Rivals", price: "Free to Play" },
    { src: "/games/nba.webp", title: "NBA 2k25", price: "₱3,499" },
    { src: "/games/gta.jpg", title: "Grand Theft Auto: V", price: "₱1,499" },
    { src: "/games/sonic.jpg", title: "Sonic Racing", price: "₱1,099" },
  ];

  return (
    <main className="bg-[#1b2838] text-white min-h-screen w-full px-6 py-12">
      {/* Signed In → Personalized Dashboard */}
      <SignedIn>
        <div className="w-full px-6 py-12">
          <h1 className="text-4xl font-bold mb-6">
            Welcome back to GameVault
          </h1>
          <p className="text-lg text-gray-300 mb-10">
            Access your library, track your progress, and explore new games tailored just for you.
          </p>
          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#2a475e] rounded-xl shadow-md p-6 hover:bg-[#324d63] transition">
              <h2 className="text-xl font-semibold mb-3">Recently Add</h2>
              <p className="text-gray-300 text-sm">You haven’t add anything yet. Start exploring!</p>
            </div>
            <div className="bg-[#2a475e] rounded-xl shadow-md p-6 hover:bg-[#324d63] transition">
              <h2 className="text-xl font-semibold mb-3">Recommended For You</h2>
              <p className="text-gray-300 text-sm">Personalized Recommendations.</p>
            </div>
            <div className="bg-[#2a475e] rounded-xl shadow-md p-6 hover:bg-[#324d63] transition">
              <h2 className="text-xl font-semibold mb-3">Wishlist</h2>
              <p className="text-gray-300 text-sm">Your wishlist is {wishlist.length} item(s).</p>
            </div>
          </div>
        </div>
      </SignedIn>

      {/* Signed Out → Landing Page */}
      <SignedOut>
        {/* Hero Banner */}
        <section className="relative w-full bg-gradient-to-r from-[#0e141b] to-[#1b2838]">
          <div className="w-full">
            <video autoPlay loop muted playsInline className="w-full h-[400px] object-cover shadow-2xl">
              <source src="/videos/minecraft.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        {/* Featured Games Carousel (now edge-to-edge) */}
        <section className="w-full mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Games</h2>
          <div className="relative w-full">
            <Carousel className="w-full overflow-hidden">
              <CarouselContent
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: "transform 0.7s ease-in-out",
                  display: "flex",
                  width: "100%",
                }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                  const start = slideIndex * itemsPerSlide;
                  const end = start + itemsPerSlide;
                  return (
                    <div key={slideIndex} className="flex w-full flex-shrink-0 gap-6 px-6">
                      {games.slice(start, end).map((game, i) => (
                        <CarouselItem key={i} className="basis-full md:basis-1/3 flex-shrink-0">
                          <div
                            className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg cursor-pointer"
                            onClick={() => openGameModal({ title: game.title })}
                          >
                            <Image
                              src={game.src}
                              alt={game.title}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <p className="mt-3 text-center font-medium">{game.title}</p>
                          <p className={`text-center text-sm ${
                            game.price === "Free to Play" ? "text-green-400" : "text-yellow-300"
                          }`}>
                            {game.price}
                          </p>
                        </CarouselItem>
                      ))}
                    </div>
                  );
                })}
              </CarouselContent>
            </Carousel>
            <div className="absolute inset-y-0 left-2 flex items-center">
              <button onClick={handlePrev} className="bg-[#1b9aaa] px-4 py-2 rounded-full hover:bg-[#14828a] transition">‹</button>
            </div>
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button onClick={handleNext} className="bg-[#1b9aaa] px-4 py-2 rounded-full hover:bg-[#14828a] transition">›</button>
            </div>
            <div className="flex justify-center mt-6 space-x-3">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === currentIndex ? "bg-[#1b9aaa] scale-125 shadow-md" : "bg-gray-500 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured & Recommended */}
        <section className="w-full px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Recommended Top Free Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {allGames.slice(0, 3).map((game, i) => {
              const details = getGameDetails(game);
              return (
                <div key={i} className="bg-[#2a475e] rounded-xl shadow-md overflow-hidden hover:scale-[1.02] transition cursor-pointer" onClick={() => openGameModal({ title: details.title, src: details.src })}>
                  <Image src={details.src} alt={details.title} className="w-full h-44 object-cover" width={400} height={220} />
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-lg">{details.title}</h3>
                    <p className={`text-sm ${ game.price === "FREE TO PLAY" ? "text-green-400" : "text-yellow-300" }`}>
                      {game.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full bg-[#0e141b] py-20 px-6 text-center border-t border-gray-800">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">About GameVault</h2>
            <p className="text-gray-400 leading-relaxed">
              GameVault is built to help gamers explore and discover the latest titles across 
              different genres. Whether you’re looking for free-to-play games or premium ones, 
              we provide details and guidance to make your search easier. Our goal is to help 
              you not only discover new games but also find where to buy them online at the best 
              price.  
            </p>
          </div>
        </section>

        {/* Browse by Category */}
        <section id="games" className="w-full px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {["All", "Survival", "Racing", "RPG", "Strategy", "Shooter"].map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setCurrentPage(0); }}
                className={`px-5 py-2 text-sm font-medium rounded-full border transition-all duration-300
                  ${
                    selectedCategory === cat
                      ? "bg-[#1b9aaa] text-white border-[#1b9aaa] shadow-md"
                      : "border-gray-500 text-gray-300 hover:border-[#1b9aaa] hover:text-[#1b9aaa]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 40 Games Paginated Grid */}
          <h2 className="text-2xl font-bold mb-4">{selectedCategory} Games</h2>

          {/* Page indicators */}
          <div className="flex justify-center mb-4 space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  i === currentPage ? "bg-[#1b9aaa] text-white" : "bg-gray-500 text-gray-200 hover:bg-gray-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {currentGames.map((game, i) => {
              const details = getGameDetails(game);
              return (
                <div
                  key={i}
                  className="bg-[#2a475e] rounded-xl shadow-md overflow-hidden hover:scale-[1.02] transition cursor-pointer"
                  onClick={() => openGameModal({ title: details.title, src: details.src, price: game.price })}
                >
                  <div className="relative aspect-[16/9]">
                    <Image src={details.src} alt={details.title} fill className="object-cover" />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-semibold text-sm">{details.title}</h3>
                    <p
                      className={`text-xs mt-1 ${
                        game.price === "FREE TO PLAY" ? "text-green-400" : "text-yellow-300"
                      }`}
                    >
                      {game.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Most Played Section */}
        <section className="w-full bg-[#0e141b] py-16 px-4 border-t border-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Most Played Games</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {mostPlayedList.map((game, i) => (
              <div
                key={i}
                className="relative flex flex-col bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:bg-[#1b2838] transition cursor-pointer shadow-lg group"
                onClick={() => openGameModal({ title: game.title, src: game.src })}
              >
                {/* Rank number */}
                <div
                  className={`absolute top-2 left-2 text-white font-bold px-2 py-1 rounded-full text-sm z-10
                    ${i === 0 ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 animate-pulse-fire' : 'bg-red-600'}
                  `}
                >
                  #{i + 1}
                </div>

                <img
                  src={game.src}
                  alt={game.title}
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex flex-col justify-center px-4 py-2">
                  <h3 className="text-white font-semibold">{game.title}</h3>
                  <p className="text-gray-400 text-sm">{game.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <style jsx>{`
          @keyframes pulse-fire {
            0%, 100% { transform: scale(0.8); opacity: 0.7; }
            50% { transform: scale(1.2); opacity: 1; }
          }
          @keyframes fire-flicker {
            0%, 100% { transform: translateY(0); opacity: 0.8; }
            25% { transform: translateY(-2px) scale(1.1); opacity: 1; }
            50% { transform: translateY(-1px) scale(1); opacity: 0.9; }
            75% { transform: translateY(-3px) scale(1.05); opacity: 1; }
          }
          .animate-pulse-fire {
            animation: pulse-fire 1s infinite;
          }
          .animate-fire-flicker {
            animation: fire-flicker 0.8s infinite;
          }
        `}</style>

        {/* News Section */}
        <section id="news" className="w-full bg-[#0e141b] py-16 px-6 border-t border-gray-800">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-10 text-center">Latest Game News</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Soulmask Leaves Early Access with New DLC",
                  date: "Sept 30, 2025",
                  link: "https://www.pcgamer.com/games/survival-crafting/soulmask-the-survival-game-thats-basically-palworld-but-with-people-is-finally-leaving-early-access-and-its-coming-with-an-ancient-egyptian-dlc/?utm_source=chatgpt.com",
                  desc: "Soulmask launches full version with 'Shifting Sands' DLC featuring ancient Egyptian theme.",
                  imgSrc: "/games/soul.avif"
                },
                {
                  title: "Slime Rancher 2 Achieves Full Release",
                  date: "Sept 29, 2025",
                  link: "https://www.gamesradar.com/games/simulation/after-3-years-slime-rancher-2-finally-hits-full-release-at-94-percent-positive-steam-reviews-and-the-cozy-farming-sim-sequel-has-arrived-right-on-time-to-tide-me-over-until-stardew-valley-1-7/?utm_source=chatgpt.com",
                  desc: "The cozy farming sim Slime Rancher 2 is now fully released on Steam with new slimes and gadgets.",
                  imgSrc: "/games/slime.jpg"
                },
                {
                  title: "Steam's Redesigned Store Menu",
                  date: "Sept 28, 2025",
                  link: "https://www.theverge.com/news/785110/valve-steam-redesigned-store-menu-personalized-recommendations?utm_source=chatgpt.com",
                  desc: "Valve updates Steam’s store menu for better personalized recommendations and browsing experience.",
                  imgSrc: "/games/steam.webp"
                },
              ].map((news, i) => (
                <div
                  key={i}
                  className="bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition hover:scale-[1.02]"
                >
                  <div className="relative w-full h-48">
                    <img
                      src={news.imgSrc}
                      alt={news.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-1 hover:text-[#1b9aaa] transition">{news.title}</h3>
                    <p className="text-xs text-gray-400 mb-2">{news.date}</p>
                    <p className="text-sm text-gray-300 mb-3">{news.desc}</p>
                    <a
                      href={news.link}
                      target="_blank"
                      className="text-[#1b9aaa] text-sm font-medium hover:underline hover:text-[#14b0c2] transition"
                    >
                      Read more →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Store Section */}
        <section id="store" className="w-full bg-[#0e141b] py-16 px-6 text-center border-t border-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-3">Where to Buy & Download</h2>
            <p className="text-gray-400 text-sm mb-8">
              Explore these trusted platforms to buy or download your favorite games.
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
              <a href="https://store.steampowered.com" target="_blank" className="flex flex-col items-center hover:text-[#1b9aaa] transition">
                <img src="/stores/steam.png" alt="Steam" className="h-10 mb-2" />
                <p className="text-gray-300 text-sm">Steam</p>
              </a>

              <a href="https://www.epicgames.com/store" target="_blank" className="flex flex-col items-center hover:text-[#1b9aaa] transition">
                <img src="/stores/epic.png" alt="Epic Games" className="h-10 mb-2" />
                <p className="text-gray-300 text-sm">Epic Games</p>
              </a>

              <a href="https://store.ubisoft.com" target="_blank" className="flex flex-col items-center hover:text-[#1b9aaa] transition">
                <img src="/stores/ubi.png" alt="Ubisoft" className="h-10 mb-2" />
                <p className="text-gray-300 text-sm">Ubisoft</p>
              </a>

              <a href="https://store.playstation.com" target="_blank" className="flex flex-col items-center hover:text-[#1b9aaa] transition">
                <img src="/stores/ps.png" alt="PlayStation" className="h-10 mb-2" />
                <p className="text-gray-300 text-sm">PlayStation</p>
              </a>

              <a href="https://www.xbox.com/en-PH/microsoft-store" target="_blank" className="flex flex-col items-center hover:text-[#1b9aaa] transition">
                <img src="/stores/x.png" alt="Xbox" className="h-10 mb-2" />
                <p className="text-gray-300 text-sm">Xbox</p>
              </a>

              <a href="https://www.nintendo.com/store/" target="_blank" className="flex flex-col items-center hover:text-[#1b9aaa] transition">
                <img src="/stores/nin.png" alt="Nintendo" className="h-10 mb-2" />
                <p className="text-gray-300 text-sm">Nintendo</p>
              </a>
            </div>
          </div>
        </section>

        {/* Footer / Call to Action */}
        <footer className="w-full bg-[#0e141b] py-12 text-center border-t border-gray-800">
          <h2 className="text-sm text-gray-400 mb-2">Looking for recommendations?</h2>
          <p className="text-lg md:text-xl font-semibold text-white mb-6">
            Sign in to view personalized picks
          </p>
          <SignInButton mode="modal">
            <button className="px-6 py-2 rounded-full bg-[#1b9aaa] text-white font-medium hover:bg-[#14828a] transition shadow-sm">
              Sign In
            </button>
          </SignInButton>
          <p className="mt-4 text-sm text-gray-400"></p>
        </footer>

        {/* Bottom legal footer */}
        <footer className="w-full bg-[#1b2838] py-10 border-t border-gray-700">
          <div className="flex flex-col items-center space-y-4 text-sm text-gray-400">
            <div className="flex space-x-6">
              <Link href="#about">About</Link>
              <Link href="#games">Games</Link>
              <Link href="#news">News</Link>
              <Link href="#store">Stores</Link>
            </div>
            <p className="text-xs text-gray-500 text-center max-w-xl">
              © 2025 GameVerse. All rights reserved. All trademarks are property of their respective owners.
            </p>
          </div>
        </footer>
      </SignedOut>

      {/* ---------- GAME MODAL (site-wide) ---------- */}
      {selectedGameModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => closeModal()}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="max-w-4xl w-full bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()} // prevent backdrop click from closing when interacting inside
          >
            <button
              onClick={() => closeModal()}
              className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl z-20"
              aria-label="Close"
            >
              ×
            </button>

            {/* Video + content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Video area (left two-thirds on md) */}
              <div className="md:col-span-2 bg-black">
                {selectedGameModal.video ? (
                  <video
                    src={selectedGameModal.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls={false}
                    className="w-full h-64 md:h-full object-cover"
                  />
                ) : (
                  // If no video, show image fallback
                  <div className="w-full h-64 md:h-full relative">
                    <Image src={selectedGameModal.src ?? "/games/placeholder.png"} alt={selectedGameModal.title} fill className="object-cover" />
                  </div>
                )}
              </div>

              {/* Details area */}
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{selectedGameModal.title}</h3>
                  {selectedGameModal.price && <p className="text-sm text-gray-400 mb-3">{selectedGameModal.price}</p>}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{selectedGameModal.description ?? "No description available."}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <a
                      href={selectedGameModal.shopLink ?? "#"}
                      target={selectedGameModal.shopLink ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className={`flex-1 text-center px-4 py-2 rounded-lg font-medium transition ${
                        selectedGameModal.shopLink ? "bg-[#1b9aaa] hover:bg-[#14828a]" : "bg-gray-700 cursor-not-allowed opacity-80"
                      }`}
                      onClick={() => {
                        if (!selectedGameModal.shopLink) {
                          // no-op or show a small client-side message, but avoid window.open to "#"
                        }
                      }}
                    >
                      Buy Now
                    </a>

                    <button
                      onClick={() => selectedGameModal.title && toggleWishlist(selectedGameModal.title)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                        wishlist.includes(selectedGameModal.title) ? "bg-yellow-500 text-black" : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {wishlist.includes(selectedGameModal.title) ? "In Wishlist" : "Add to Wishlist"}
                    </button>
                  </div>

                  <div className="text-xs text-gray-400">
                    <p>🛒 Available on:</p>
                    <p className="mt-1">
                      {selectedGameModal.shopLink ? (
                        <a href={selectedGameModal.shopLink} target="_blank" rel="noopener noreferrer" className="text-[#1b9aaa] hover:underline">
                          {new URL(selectedGameModal.shopLink).host.replace("www.", "")}
                        </a>
                      ) : (
                        <span className="text-gray-500">Multiple stores</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
