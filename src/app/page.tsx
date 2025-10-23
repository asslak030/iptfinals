"use client";

import {
  SignedIn,
  SignedOut,
  useUser,
  useClerk,
} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  // Redirect to dashboard if signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

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

  
  // master games array with ALL games including descriptions and shop links
  const allGames = [
    { src: "/games/atomic_heart.jpg", title: "Atomic Heart", category: "Shooter", price: "₱2,322.00", description: "A first-person shooter set in an alternate 1950s Soviet Union, where you navigate a facility overrun by robotic enemies and conspiracies. It combines combat, exploration, and puzzle-solving in a retro-futuristic dystopian world.", shopLink: "https://www.xbox.com/en-US/games/store/atomic-heart/9p731z4bbct3/" },
    { src: "/games/sea_of_thieves.jpg", title: "Sea of Thieves", category: "Adventure", price: "₱1,742.00", description: "A multiplayer pirate adventure game where you sail the seas, hunt treasure, and engage in naval battles with other players. Focuses on cooperative exploration, combat, and emergent storytelling in a vast oceanic world.", shopLink: "https://www.xbox.com/en-US/games/store/sea-of-thieves/9nblggh42thq/" },
    { src: "/games/crackdown.jpg", title: "Crackdown 3", category: "Action", price: "₱2,322.00", description: "An open-world action game in a crime-ridden city, where you use superhuman abilities to dismantle gangs and uncover conspiracies. Emphasizes destruction, vehicle combat, and free-roaming exploration.", shopLink: "https://www.xbox.com/en-US/games/store/crackdown-3/9pp0x00pbgw0/" },
    { src: "/games/bleeding.jpg", title: "Bleeding Edge", category: "Shooter", price: "₱1,160.00", description: "A fast-paced multiplayer shooter with mech combat, where teams battle in arenas using customizable robots. Focuses on strategic team play, quick matches, and vehicular warfare.", shopLink: "https://www.xbox.com/en-US/games/store/bleeding-edge/9ndk4x4z5m1x/" },
    { src: "/games/cross_fire.jpg", title: "Crossfire", category: "Shooter", price: "₱580.00", description: "A multiplayer first-person shooter in a modern warfare setting, involving team-based battles, missions, and tactical gameplay. Focuses on competitive online matches and realistic military scenarios.", shopLink: "https://www.xbox.com/en-US/games/store/crossfire/9n9p0x9tb4x2/" },
    { src: "/games/twelve_minutes.jpg", title: "Twelve Minutes", category: "Adventure", price: "₱1,450.00", description: "An interactive thriller where you relive a time loop in a confined apartment, uncovering a mystery through dialogue and choices. Focuses on narrative tension, puzzles, and psychological depth.", shopLink: "https://www.xbox.com/en-US/games/store/twelve-minutes/9n4p13pfdg0w/" },
    { src: "/games/haven.jpg", title: "Haven", category: "Adventure", price: "₱1,742.00", description: "A narrative-driven adventure game about two sisters exploring a mysterious island, involving exploration, puzzles, and emotional storytelling. Emphasizes family bonds and supernatural elements in a realistic coastal setting.", shopLink: "https://www.xbox.com/en-US/games/store/haven/9n4j0z1v2vhx/" },
    { src: "/games/tunic.jpg", title: "Tunic", category: "Action-Adventure", price: "₱1,742.00", description: "An action-adventure game inspired by Zelda, where you explore a mysterious island, solve puzzles, and battle enemies. Focuses on exploration, combat, and uncovering lore in a retro-styled world.", shopLink: "https://www.xbox.com/en-US/games/store/tunic/9ndjc19j0t74/" },
    { src: "/games/sifu.jpg", title: "Sifu", category: "Action", price: "₱2,322.00", description: "A martial arts action game where you master kung fu through age-reversing combat and exploration. Focuses on precise fighting, environmental interactions, and narrative progression.", shopLink: "https://www.xbox.com/en-US/games/store/sifu/9p04x1m9bp63/" },
    { src: "/games/scorn.jpg", title: "Scorn", category: "Horror", price: "₱1,742.00", description: "A horror adventure game in a biomechanical world, involving puzzle-solving and exploration amidst grotesque entities. Focuses on atmospheric tension and surreal, body-horror themes.", shopLink: "https://www.xbox.com/en-US/games/store/scorn/9n4l7zz5l4m9/" },
    { src: "/games/hifi.jpg", title: "Hi-Fi Rush", category: "Action", price: "₱1,742.00", description: "A rhythm-based action game where you battle enemies with music-synced combat in a corporate dystopia. Emphasizes fast-paced gameplay, upgrades, and narrative rebellion.", shopLink: "https://www.xbox.com/en-US/games/store/hi-fi-rush/9nftc552k3gj/" },
    { src: "/games/robocop.jpg", title: "RoboCop: Rogue City", category: "Action-Adventure", price: "₱2,322.00", description: "An action-adventure game based on the RoboCop franchise, involving crime-fighting in a dystopian Detroit. Focuses on shooting, investigation, and satirical social commentary.", shopLink: "https://www.xbox.com/en-US/games/store/robocop-rogue-city/9nx0d79b7mp2/" },

    // Additional games with categories, descriptions and shop links
   { src: "/games/great_circle.jpg", title: "Indiana Jones and the Great Circle", category: "Adventure", price: "₱3,482.00", description: "An adventure game featuring archaeological exploration and puzzles in the Indiana Jones universe. Focuses on discovery, action, and historical mysteries.", shopLink: "https://www.xbox.com/en-US/games/store/indiana-jones-and-the-great-circle/9npdt2k3q8vh/" },
    { src: "/games/dark_ages.jpg", title: "Doom: The Dark Ages", category: "Shooter", price: "₱3,482.00", description: "A first-person shooter in the Doom series, involving demonic battles in a medieval setting. Emphasizes fast-paced combat, exploration, and horror elements.", shopLink: "https://www.xbox.com/en-US/games/store/doom-the-dark-ages/9n4gx2w67j98/" },
    { src: "/games/fable.jpg", title: "Fable", category: "RPG", price: "₱3,482.00", description: "An open-world RPG with moral choices and fantasy adventures in the Fable universe. Focuses on exploration, combat, and consequence-driven storytelling.", shopLink: "https://www.xbox.com/en-US/games/store/fable/9njn5rmm5k5h/" },
    { src: "/games/concord.jpg", title: "Concord", category: "Shooter", price: "₱1,742.00", description: "A multiplayer shooter with hero-based gameplay, involving team battles and strategic elements. Focuses on competitive online play and character abilities.", shopLink: "https://www.xbox.com/en-US/games/store/concord/9p3xyk5sz0lw/" },
    { src: "/games/gears_of_war.jpg", title: "Gears of War 4", category: "Shooter", price: "₱1,742.00", description: "A third-person shooter in a war-torn world, where you fight monstrous enemies with cover-based combat. Emphasizes co-op gameplay, intense battles, and survival.", shopLink: "https://www.xbox.com/en-US/games/store/gears-of-war-4/9nblggh54lp5/" },
    { src: "/games/enotria.jpg", title: "Enotria: The Last Song", category: "RPG", price: "₱2,322.00", description: "An action RPG with turn-based combat and exploration in a fantasy world, following a bard's quest. Emphasizes storytelling, music, and strategic battles.", shopLink: "https://www.xbox.com/en-US/games/store/enotria-the-last-song/9p0x6x0fs6vh/" },
    { src: "/games/sonic.jpg", title: "Sonic Racing", category: "Racing", price: "₱1,099", description: "Sonic Racing is a fun and fast-paced racing game with your favorite Sonic characters.", shopLink: "https://store.playstation.com" },
    { src: "/games/gta.jpg", title: "Grand Theft Auto: V", category: "Action", price: "₱1,499", description: "GTA V is an open-world action-adventure game set in the city of Los Santos.", shopLink: "https://store.rockstargames.com/" },
    { src: "/games/nba.webp", title: "NBA 2k25", category: "Sports", price: "₱3,499", description: "NBA 2k25 is a basketball simulation game with realistic graphics and gameplay.", shopLink: "https://store.steampowered.com/" },
    { src: "/games/evil.jpg", title: "Resident Evil 4", category: "Survival", price: "₱1,999.00", description: "Survival is just the beginning. Six years have passed since the biological disaster in Raccoon City. Leon S. Kennedy, one of the survivors, tracks the president's kidnapped daughter to a secluded European village, where there is something terribly wrong with the locals.", shopLink: "https://store.steampowered.com/app/2050650/Resident_Evil_4/" },
    { src: "/games/god.jpg", title: "God of War Ragnarök", category: "RPG", price: "₱2,499.00", description: "God of War Ragnarök is an action-adventure game where players take the role of Kratos and his son as they embark on a quest to prevent the coming of Ragnarök. Players explore the Nine Realms, battling enemies in close-up, hand-to-hand combat against human-like raiders and fantastical creatures.", shopLink: "https://store.playstation.com/en-ph/product/UP9000-PPSA_03338_00-GOWRAGNAROK00000" },
    { src: "/games/village.jpg", title: "Resident Evil Village", category: "Survival", price: "₱1,899.00", description: "Experience survival horror like never before in the eighth major instalment in the storied Resident Evil franchise. Set a few years after the horrifying events in the critically acclaimed Resident Evil 7 biohazard, the all-new storyline begins with Ethan Winters and his wife Mia living peacefully… until tragedy strikes once again.", shopLink: "https://store.steampowered.com/app/1196590/Resident_Evil_Village/" },
    { src: "/games/horizon.jpg", title: "Horizon Forbidden West", category: "RPG", price: "₱2,799.00", description: "Experience the epic Horizon Forbidden West™ in its entirety with bonus content and the Burning Shores expansion included. The Burning Shores add-on contains additional content for Aloy's adventure, including new storylines, characters, and experiences in a stunning yet hazardous new area.", shopLink: "https://store.playstation.com/en-ph/product/UP9000-PPSA_08846_00-HZFWCOMPLETEEDIT" },
    { src: "/games/us.jpg", title: "Last of Us", category: "Survival", price: "₱2,299.00", description: "Experience the winner of over 300 Game of the Year awards, now on PC. Discover Ellie and Abby's story with graphical enhancements, gameplay modes like the roguelike survival experience No Return, and more.", shopLink: "https://store.steampowered.com/app/1888930/The_Last_of_Us_Part_I/" },
    { src: "/games/spider.jpg", title: "Marvel's Spider-Man Remastered", category: "RPG", price: "₱2,499.00", description: "In Marvel's Spider-Man Remastered, the worlds of Peter Parker and Spider-Man collide in an original action-packed story. Play as an experienced Peter Parker, fighting big crime and iconic villains in Marvel's New York. Web-swing through vibrant neighborhoods and defeat villains with epic", shopLink: "https://store.steampowered.com/app/1817070/Marvels_SpiderMan_Remastered/" },
    { src: "/games/battle.jpg", title: "Battlefield™ 2042", category: "Shooter", price: "₱1,999.00", description: "Battlefield™ 2042 is a first-person shooter that marks the return to the iconic all-out warfare of the franchise.", shopLink: "https://store.steampowered.com/app/1517290/Battlefield_2042/" },
    { src: "/games/dead.jpg", title: "Red Dead Redemption 2", category: "RPG", price: "₱2,199.00", description: "Arthur Morgan and the Van der Linde Gang are outlaws on the run. With federal agents and bounty hunters massing on their heels, the gang must rob, steal, and fight their way across the rugged heartland in order to survive.", shopLink: "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/" },
    { src: "/games/noman.jpg", title: "No Man's Sky", category: "RPG", price: "₱1,799.00", description: "No Man's Sky is a game about exploration and survival in an infinite procedurally generated universe.", shopLink: "https://store.steampowered.com/app/275850/No_Mans_Sky/" },
    { src: "/games/day.jpg", title: "Dead by Daylight", category: "Survival", price: "₱799.00", description: "Trapped forever in a realm of eldritch evil where even death is not an escape, four determined Survivors face a bloodthirsty Killer in a vicious game of nerve and wits. Pick a side and step into a world of tension and terror with horror gaming's best asymmetrical multiplayer.", shopLink: "https://store.steampowered.com/app/381210/Dead_by_Daylight/" },
    { src: "/games/ground.jpg", title: "Grounded", category: "Survival", price: "₱1,299.00", description: "Grounded is a survival game set in a backyard where players are shrunk to the size of insects and must navigate a dangerous environment.", shopLink: "https://store.steampowered.com/app/962130/Grounded/" },
    { src: "/games/left4.jpg", title: "Left 4 Dead 2", category: "Shooter", price: "₱499.00", description: "Left 4 Dead 2 is a cooperative first-person shooter set in a post-apocalyptic world overrun by zombies.", shopLink: "https://store.steampowered.com/app/550/Left_4_Dead_2/" },
    { src: "/games/ghost.avif", title: "Ghost of Tsushima", category: "RPG", price: "₱2,199.00", description: "Ghost of Tsushima is an open-world action-adventure game set in feudal Japan, where players control a samurai fighting against Mongol invaders.", shopLink: "https://store.playstation.com/en-ph/product/UP9000-PPSA_08473_00-GHOSTOFFTSUHIMAD0" },
    { src: "/games/zomb.jpg", title: "Project Zomboid", category: "Survival", price: "₱499.00", description: "Project Zomboid is an open-world survival horror game set in a post-apocalyptic world overrun by zombies.", shopLink: "https://store.steampowered.com/app/108600/Project_Zomboid/" },
    { src: "/games/cors.jpg", title: "Assetto Corsa", category: "Racing", price: "₱599.00", description: "Assetto Corsa is a racing simulation game known for its realistic driving physics and extensive car customization options.", shopLink: "https://store.steampowered.com/app/244210/Assetto_Corsa/" },
    { src: "/games/hotshot.jpg", title: "Hotshot Racing", category: "Racing", price: "₱799.00", description: "Hotshot Racing is a blisteringly fast arcade-style racing game fusing drift handling, razor-sharp retro visuals and an incredible sense of speed to create an exhilarating driving experience.", shopLink: "https://store.steampowered.com/app/609920/Hotshot_Racing/" },
    { src: "/games/rise.jpg", title: "Rise: Race The Future", category: "Racing", price: "₱999.00", description: "Experience the most addictive racing gameplay! Drift and slide like never before thanks to an exceptional fluid and precise physics-based slippery handling. Unique futuristic cars, smooth powerslides, jumps and water zones take old-school rally arcade games to the next level of fun!", shopLink: "https://store.steampowered.com/app/1353850/Rise_Race_The_Future/" },
    { src: "/games/cyber.jpg", title: "Cyberpunk SFX", category: "RPG", price: "₱2,499.00", description: "What can be more spectacular than a girl armed with rockets and a sense of humor? Yes, she is about to start solving the problems of the 21st century. And if you want to make sure she doesn't create a few new ones, you'll have to show her the way.", shopLink: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/" },
    { src: "/games/libre.jpg", title: "Calibre 10 Racing", category: "Racing", price: "₱899.00", description: "Hit the starting grid in C10 Racing. An online competitive title that merges intense wheel-to-wheel racing action with first person shooter gameplay. 4 teams of 2, one driver & one shooter, go head-to-head using teamwork & strategy to capture the checkered flag.", shopLink: "https://store.steampowered.com/app/1191460/Calibre_10_Racing/" },
    { src: "/games/project.jpg", title: "Project Cars", category: "Racing", price: "₱1,199.00", description: "A fast-paced, arcade-style combat racing game featuring vehicles with weapons.", shopLink: "https://store.steampowered.com/app/234630/Project_CARS/" },
    { src: "/games/motor.jpg", title: "Mini Motor Racing X", category: "Racing", price: "₱699.00", description: "Welcome to the world of Mini Motor Racing X! Strap yourself in, or strap on your VR headset, and jump into a nitro fueled world where little cars mean BIG fun!", shopLink: "https://store.steampowered.com/app/1139900/Mini_Motor_Racing_X/" },
    { src: "/games/lift.jpg", title: "Liftoff®: FPV Drone Racing", category: "Racing", price: "₱1,099.00", description: "Liftoff® is a drone simulator that translates the rush of first-person view drone flight to the digital world. Join the biggest community for virtual FPV racing and freestyle!", shopLink: "https://store.steampowered.com/app/410340/Liftoff_FPV_Drone_Racing/" },
    { src: "/games/witch.jpg", title: "The Witcher 3", category: "RPG", price: "₱1,499.00", description: "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will. Your current contract? Tracking down Ciri — the Child of Prophecy, a living weapon that can alter the shape of the world.", shopLink: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/" },
    { src: "/games/mon.jpg", title: "Monster Racing League", category: "Racing", price: "₱599.00", description: "Monster Racing League is a multiplayer combat racing game where you don't have to steer. Harness the power of your monsters to attack and defend your way to the finish line. It's chaos, mayhem, and non-stop fun all rolled into one!", shopLink: "https://store.steampowered.com/app/1287080/Monster_Racing_League/" },
    { src: "/games/legend.jpg", title: "The Legend of Zelda: Breath of the Wild", category: "RPG", price: "₱3,299.00", description: "Zelda games have been a staple of the best Nintendo Switch RPGs, but the 2017 game of the year was a true masterpiece. You step into the shoes of Link, a royal knight with no memories who must recuse Princess Zelda.", shopLink: "https://www.nintendo.com/store/products/the-legend-of-zelda-breath-of-the-wild-switch/" },
    { src: "/games/scroll.jpg", title: "The Elder Scrolls V", category: "RPG", price: "₱2,299.00", description: "The Elder Scrolls V: Skyrim is one of the most popular and recognizable RPG of the 2010s. Released all the way back in 2011, the game still holds regard and honor in gaming circles even today.", shopLink: "https://store.steampowered.com/app/489830/The_Elder_Scrolls_V_Skyrim_Special_Edition/" },
    { src: "/games/proto.jpg", title: "The Callisto Protocol", category: "Survival", price: "₱2,099.00", description: "Survive to escape the horrors of Callisto and uncover the dark secrets of Jupiter's dead moon.", shopLink: "https://store.steampowered.com/app/1544020/The_Callisto_Protocol/" },
    { src: "/games/final.jpg", title: "Final Fantasy 7 Remake", category: "RPG", price: "₱3,099.00", description: "Cloud Strife, an ex-SOLDIER operative, descends on the mako-powered city of Midgar. The world of the timeless classic FINAL FANTASY VII is reborn, using cutting-edge graphics technology, a new battle system and an additional adventure featuring Yuffie Kisaragi.", shopLink: "https://store.steampowered.com/app/1462040/FINAL_FANTASY_VII_REMAKE_INTERGRADE/" },
    { src: "/games/poke.jpg", title: "Pokemon Sword and Shield", category: "RPG", price: "₱2,899.00", description: "Ever since then, thanks to the mass popularity of the games and the TV show, the Pokemon series has garnered a huge fan following.", shopLink: "https://www.nintendo.com/store/products/pokemon-sword-switch/" },
    { src: "/games/fall.jpg", title: "Fallout New Vegas", category: "RPG", price: "₱1,199.00", description: "While Fallout 3 was the game that forever changed the Fallout series, Fallout New Vegas that came out two years later was truly unforgettable.", shopLink: "https://store.steampowered.com/app/22380/Fallout_New_Vegas/" },
    { src: "/games/car.jpg", title: "CarX Drift Racing Online", category: "Racing", price: "₱799.00", description: "A realistic driving simulator focused specifically on the art and competition of drifting.", shopLink: "https://store.steampowered.com/app/635260/CarX_Drift_Racing_Online/" },
    { src: "/games/star.avif", title: "Star Wars: Old Republic", category: "Strategy", price: "₱1,499.00", description: "Star Wars: Knights of the Old Republic was the first RPG that allowed you to take on your dreams of living in the Star Wars universe.", shopLink: "https://store.steampowered.com/app/32370/STAR_WARS_Knights_of_the_Old_Republic/" },
    { src: "/games/starve.jpg", title: "Don't Starve Together", category: "Survival", price: "₱699.00", description: "A multiplayer survival video game where players work together to stay alive in a hostile, gothic-style world.", shopLink: "https://store.steampowered.com/app/322330/Dont_Starve_Together/" },
    { src: "/games/hades.jpg", title: "Hades II", category: "RPG", price: "₱2,199.00", description: "Battle beyond the Underworld using dark sorcery to take on the Titan of Time in this bewitching sequel to the award-winning rogue-like dungeon crawler.", shopLink: "https://store.steampowered.com/app/1145350/Hades_II/" },
    { src: "/games/silent.avif", title: "Silent Hill f", category: "Survival", price: "₱2,399.00", description: "Hinako's hometown is engulfed in fog, driving her to fight grotesque monsters and solve eerie puzzles. Uncover the disturbing beauty hidden in terror.", shopLink: "https://store.steampowered.com/app/1945690/Silent_Hill_f/" },
    { src: "/games/digi.jpg", title: "Digimon Story Time Stranger", category: "RPG", price: "₱2,099.00", description: "The latest in the Digimon Story series is finally here! In this RPG, unravel a mystery that spans across the human world and the Digital World, collecting and raising a wide variety of Digimon to save the world.", shopLink: "https://store.steampowered.com/app/2427830/Digimon_Story_Cyber_Sleuth_Complete_Edition/" },
    { src: "/games/hell.jpg", title: "HELLDIVERS™ 2", category: "Shooter", price: "₱2,299.00", description: "The Galaxy's Last Line of Offence. Enlist in the Helldivers and join the fight for freedom across a hostile galaxy in a fast, frantic, and ferocious third-person shooter.", shopLink: "https://store.steampowered.com/app/553850/HELLDIVERS_2/" },
    { src: "/games/diablo.jpg", title: "Diablo IV", category: "RPG", price: "₱3,499.00", description: "Join the fight for Sanctuary in Diablo® IV, the ultimate action RPG adventure. Experience the critically acclaimed campaign and new seasonal content.", shopLink: "https://store.steampowered.com/app/2344520/Diablo_IV/" },
    { src: "/games/forgotten_city.jpg", title: "The Forgotten City", price: "₱1,450", category: "RPG", description: "A narrative-driven adventure in an ancient Roman city trapped in a time loop; solve puzzles and make moral choices.", shopLink: "https://store.steampowered.com/app/874260/The_Forgotten_City/" },
    { src: "/games/cyberpunk_2077.jpg", title: "Cyberpunk 2077", price: "₱3,482", category: "RPG", description: "Open-world action RPG in a dystopian metropolis with deep customization, branching narratives, and intense combat.", shopLink: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/" },
    { src: "/games/control.jpg", title: "Control", price: "₱1,742", category: "Shooter", description: "Third-person action-adventure in a mysterious government building; wield supernatural powers and uncover secrets.", shopLink: "https://store.steampowered.com/app/870780/Control_Ultimate_Edition/" },
    { src: "/games/death_stranding.jpg", title: "Death Stranding Director's Cut", price: "₱2,322", category: "Survival", description: "Post-apocalyptic action-adventure delivering packages across dangerous landscapes with unique online co-op elements.", shopLink: "https://store.steampowered.com/app/1850570/DEATH_STRANDING_DIRECTORS_CUT/" },
    { src: "/games/metro_exodus.jpg", title: "Metro Exodus", price: "₱1,742", category: "Shooter", description: "First-person survival shooter across a post-nuclear Russia mixing stealth, combat, and resource scavenging.", shopLink: "https://store.steampowered.com/app/412020/Metro_Exodus/" },
    { src: "/games/outer_wild.jpg", title: "Outer Wilds", price: "₱1,450", category: "RPG", description: "Exploration-based adventure in a solar system time loop; investigate ancient mysteries via space travel and puzzles.", shopLink: "https://store.steampowered.com/app/753640/Outer_Wilds/" },
    { src: "/games/subnautica.jpg", title: "Subnautica", price: "₱1,742", category: "Survival", description: "Open-world underwater survival on an alien ocean planet; build bases, explore, and uncover planetary secrets.", shopLink: "https://store.steampowered.com/app/264710/Subnautica/" },
    { src: "/games/surge.jpg", title: "The Surge", price: "₱2,322", category: "RPG", description: "Sci-fi action RPG in a dystopian industrial complex; challenging combat with strategic dismemberment upgrade mechanics.", shopLink: "https://store.steampowered.com/app/378540/The_Surge/" },
    { src: "/games/prey.jpg", title: "Prey", price: "₱1,742", category: "Shooter", description: "First-person sci-fi thriller on a space station overrun by shape-shifting aliens; mix of horror, exploration, and RPG elements.", shopLink: "https://store.steampowered.com/app/480490/Prey/" },
    { src: "/games/tomb_raider.jpg", title: "Rise of the Tomb Raider", price: "₱1,742", category: "RPG", description: "Action-adventure following Lara Croft through platforming, combat, and artifact hunts in remote dangerous locations.", shopLink: "https://store.steampowered.com/app/391220/Rise_of_the_Tomb_Raider/" },
    { src: "/games/quantum.jpg", title: "Quantum Break", price: "₱2,322", category: "Shooter", description: "Third-person action with time-manipulation powers; blend of shooting, puzzles, and cinematic storytelling.", shopLink: "https://store.steampowered.com/app/474960/Quantum_Break/" },
    { src: "/games/dishonored.jpg", title: "Dishonored 2", price: "₱1,160", category: "Shooter", description: "Stealth-action in a steampunk empire; play as an assassin with supernatural abilities and make choice-driven decisions.", shopLink: "https://store.steampowered.com/app/403640/Dishonored_2/" },
    { src: "/games/mankind.jpg", title: "Deus Ex: Mankind Divided", price: "₱1,160", category: "RPG", description: "Cyberpunk RPG as an augmented agent uncovering conspiracies with stealth, combat, and dialogue-driven choices.", shopLink: "https://store.steampowered.com/app/337000/Deus_Ex_Mankind_Divided/" },
    { src: "/games/the_division.jpg", title: "Tom Clancy's The Division", price: "₱1,742", category: "Shooter", description: "Online action RPG in a virus-devastated NYC focusing on cooperative missions, looting, and tactical combat.", shopLink: "https://store.steampowered.com/app/365590/Tom_Clancys_The_Division/" },
    { src: "/games/three_kingdoms.jpg", title: "Total War: Three Kingdoms", price: "₱3,482", category: "Strategy", description: "Strategy game combining turn-based empire management and real-time battles set in ancient China.", shopLink: "https://store.steampowered.com/app/779340/Total_War_THREE_KINGDOMS/" },
    { src: "/games/empire.jpg", title: "Empire of Sin", price: "₱2,322", category: "Strategy", description: "Strategy set in 1920s Prohibition-era Chicago; build a criminal empire through gang management and turn-based combat.", shopLink: "https://store.steampowered.com/app/604540/Empire_of_Sin/" },
    { src: "/games/rim_world.jpg", title: "RimWorld", price: "₱1,742", category: "Strategy", description: "Colony simulation on a distant planet with emergent storytelling, relationships, and complex events.", shopLink: "https://store.steampowered.com/app/294100/RimWorld/" },
    { src: "/games/star_wars.jpg", title: "Star Wars Outlaws", price: "₱4,022", category: "RPG", description: "Open-world action-adventure in the Star Wars universe as a scoundrel engaging in heists, exploration, and space combat. (Upcoming/estimated)", shopLink: "https://store.steampowered.com/app/1774580/Star_Wars_Outlaws/" },
    { src: "/games/epic_battle.jpg", title: "Ultimate Epic Battle Simulator", price: "₱870", category: "Strategy", description: "Simulation for creating and simulating large-scale battles between custom armies; experiment with epic confrontations.", shopLink: "https://store.steampowered.com/app/616570/Ultimate_Epic_Battle_Simulator/" },
    { src: "/games/torment.jpg", title: "Torment: Tides of Numenera", price: "₱2,322", category: "RPG", description: "Story-rich RPG in a surreal future world focused on philosophical quests and narrative depth.", shopLink: "https://store.steampowered.com/app/272270/Torment_Tides_of_Numenera/" },
    { src: "/games/GRID_legends.jpg", title: "GRID Legends", price: "₱3,482", category: "Racing", description: "Racing simulation with story-driven mode, realistic physics, vehicle customization, and multiplayer competition.", shopLink: "https://store.steampowered.com/app/1307710/GRID_Legends/" },
    { src: "/games/trackmania.jpg", title: "Trackmania", price: "₱3,482", category: "Racing", description: "High-speed racing with user-generated tracks, precision driving, time trials, and competitive multiplayer.", shopLink: "https://store.steampowered.com/app/2225070/Trackmania/" },
    { src: "/games/ghost_recon.jpg", title: "Tom Clancy's Ghost Recon Breakpoint", price: "₱2,322", category: "Shooter", description: "Tactical shooter against a rogue military group with survival elements, co-op gameplay, and gear customization.", shopLink: "https://store.steampowered.com/app/2231380/Tom_Clancys_Ghost_Recon_Breakpoint/" },
    { src: "/games/assasin_creed.jpg", title: "Assassin's Creed Valhalla", price: "₱3,482", category: "RPG", description: "Action-adventure RPG in the Viking Age with raids, settlement building, and historical narratives.", shopLink: "https://store.steampowered.com/app/2208920/Assassins_Creed_Valhalla/" },
    { src: "/games/hades.jpg", title: "Hades", price: "₱2,322", category: "RPG", description: "Roguelike action in the Greek underworld featuring fast-paced combat, upgrades, and mythological storytelling.", shopLink: "https://store.steampowered.com/app/1145360/Hades/" },
    { src: "/games/valheim.jpg", title: "Valheim", price: "₱1,742", category: "Survival", description: "Survival adventure in a Norse-inspired world; build bases, explore, and fight mythical creatures with cooperative play.", shopLink: "https://store.steampowered.com/app/892970/Valheim/" },
    { src: "/games/loop_hero.jpg", title: "Loop Hero", price: "₱1,160", category: "Strategy", description: "Strategy RPG with deck-building mechanics; loop through battles to build a world and defeat encroaching darkness.", shopLink: "https://store.steampowered.com/app/1282730/Loop_Hero/" },
    { src: "/games/spiritfarer.jpg", title: "Spiritfarer", price: "₱1,742", category: "RPG", description: "Management simulation as a ferrymaster for the deceased; boat upgrades, relationships, and emotional journeys.", shopLink: "https://store.steampowered.com/app/972660/Spiritfarer_Farewell_Edition/" },
    { src: "/games/stardew.jpg", title: "Stardew Valley", price: "₱580", category: "RPG", description: "Farming simulation to restore a farm, build relationships, and explore a small town with relaxed daily gameplay.", shopLink: "https://store.steampowered.com/app/413150/Stardew_Valley/" },
    { src: "/games/terraria.jpg", title: "Terraria", price: "₱290", category: "Survival", description: "2D sandbox adventure with crafting, exploration, building, and boss battles across procedurally generated worlds.", shopLink: "https://store.steampowered.com/app/105600/Terraria/" },
    { src: "/games/starbound.jpg", title: "Starbound", price: "₱580", category: "Survival", description: "2D exploration-adventure across planets; colonize, craft, and interact with alien species in a sandbox universe.", shopLink: "https://store.steampowered.com/app/211820/Starbound/" },
    { src: "/games/kingdom_newlands.jpg", title: "Kingdom: New Lands", price: "₱580", category: "Strategy", description: "Platformer-strategy defending a kingdom from invaders while exploring new lands and managing resources.", shopLink: "https://store.steampowered.com/app/496300/Kingdom_New_Lands/" },
    { src: "/games/ori.jpg", title: "Ori and the Will of the Wisps", category: "Platformer", price: "₱1,742.00", description: "A platformer adventure game following a spirit guardian's journey through a mystical forest, solving puzzles, battling enemies, and restoring balance. It emphasizes emotional storytelling and precise platforming in a beautiful, realistic world.", shopLink: "https://www.nintendo.com/store/products/ori-and-the-will-of-the-wisps-switch/" },
    { src: "/games/monster_hunter.jpg", title: "Monster Hunter Rise", category: "Action RPG", price: "₱3,482.00", description: "An action RPG where you hunt massive monsters in a feudal village, crafting gear and battling in co-op. It emphasizes strategy, customization, and epic fights in a realistic fantasy world.", shopLink: "https://www.nintendo.com/store/products/monster-hunter-rise-switch/" },
    { src: "/games/eve.jpg", title: "EVE Online", category: "MMO Space", price: "₱580.00", description: "An MMO space simulation where you pilot ships, trade, and engage in interstellar warfare in a vast universe. It focuses on economy, alliances, and strategic combat in a realistic sci-fi galaxy.", shopLink: "https://store.steampowered.com/app/8500/EVE_Online/" },
    { src: "/games/final.jpg", title: "Final Fantasy XIV", category: "MMO RPG", price: "₱1,742.00", description: "An MMO RPG set in Eorzea, where you embark on quests, craft, and fight in a rich fantasy world. It focuses on narrative, co-op, and customization in a realistic medieval-inspired setting.", shopLink: "https://store.na.square-enix-games.com/en_US/product/626234/final-fantasy-xiv-online-complete-edition-switch" },
    { src: "/games/baldurs.jpg", title: "Baldur's Gate 3", category: "RPG", price: "₱2,322.00", description: "An RPG where you control a party of adventurers infected with a parasite, making choices that shape the story through turn-based combat and exploration. It focuses on narrative depth and strategy in a dark fantasy world.", shopLink: "https://www.nintendo.com/store/products/baldurs-gate-3-switch/" },
    { src: "/games/fallout.jpg", title: "Fallout: New Vegas", category: "RPG", price: "₱1,160.00", description: "An RPG set in a post-apocalyptic Mojave Desert, where you navigate factions, quests, and combat as a courier. It focuses on choice, exploration, and survival in a gritty, realistic wasteland.", shopLink: "https://store.steampowered.com/app/22380/Fallout_New_Vegas/" },
    { src: "/games/elder.jpg", title: "The Elder Scrolls Online", category: "MMO RPG", price: "₱1,742.00", description: "An MMO RPG set in the Elder Scrolls universe, where you explore Tamriel, complete quests, and battle in groups. It focuses on exploration, crafting, and epic lore in a vast, realistic fantasy world.", shopLink: "https://www.nintendo.com/store/products/the-elder-scrolls-online-switch/" },
    { src: "/games/black_desert.jpg", title: "Black Desert Online", category: "MMO RPG", price: "₱580.00", description: "An MMO RPG with action-oriented combat, sailing, and trading in a medieval world. It emphasizes skill, customization, and social interaction in a realistic, open-world environment.", shopLink: "https://www.nintendo.com/store/products/black-desert-definitive-edition-switch/" },
    { src: "/games/exile.jpg", title: "Path of Exile", category: "MMO Action", price: "₱580.00", description: "An MMO action RPG with deep character customization, challenging dungeons, and online trading. It focuses on strategy, loot, and co-op in a dark, realistic fantasy world.", shopLink: "https://www.pathofexile.com/" },
    { src: "/games/until_down.jpg", title: "Until Dawn", category: "Interactive Horror", price: "₱1,160.00", description: "An interactive horror game where choices determine the fate of teenagers in a remote lodge, with branching narratives and quick-time events. It emphasizes tension and moral decisions in a realistic thriller setting.", shopLink: "https://www.playstation.com/en-us/games/until-dawn/" },
    { src: "/games/tales.jpg", title: "Tales from the Borderlands", category: "Interactive Story", price: "₱1,160.00", description: "An episodic interactive story where you make choices as con artists in a sci-fi world, blending humor and action. It focuses on narrative branches and dialogue in a realistic, adventurous setting.", shopLink: "https://www.nintendo.com/store/products/tales-from-the-borderlands-switch/" },
    { src: "/games/lostark.jpg", title: "Lost Ark", category: "MMO Action", price: "₱580.00", description: "An MMO action game with fast-paced combat, exploration, and raids in a fantasy world. It emphasizes skill-based fights, quests, and social features in a dynamic, realistic environment.", shopLink: "https://store.steampowered.com/app/1599340/Lost_Ark/" },
  ]; 

  // Featured games for carousel (first 12 games)
  const featuredGames = allGames.slice(0, 12);

  // helper: get details for modal
  const getGameDetails = (partial: { title?: string; src?: string; price?: string }) => {
    const byTitle = allGames.find((g) => g.title === partial.title);
    if (byTitle) return byTitle;
    // try match by src
    const bySrc = allGames.find((g) => g.src === partial.src);
    if (bySrc) return bySrc;
    // fallback to partial info
    return {
      title: partial.title ?? "Unknown Game",
      src: partial.src ?? "/games/placeholder.png",
      price: partial.price ?? "",
      description: "No description available.",
      shopLink: "https://store.steampowered.com/"
    };
  };

  // Featured carousel
  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(featuredGames.length / itemsPerSlide);
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
    { src: "/games/atomic_heart.jpg", title: "Atomic Heart", price: "₱2,322.00" },
    { src: "/games/sea_of_thieves.jpg", title: "Sea of Thieves", price: "₱1,742.00" },
    { src: "/games/crackdown.jpg", title: "Crackdown 3", price: "₱2,322.00" },
    { src: "/games/bleeding.jpg", title: "Bleeding Edge", price: "₱1,160.00" },
    { src: "/games/cross_fire.jpg", title: "Crossfire", price: "₱580.00" },
    { src: "/games/twelve_minutes.jpg", title: "Twelve Minutes", price: "₱1,450.00" },
    { src: "/games/haven.jpg", title: "Haven", price: "₱1,742.00" },
    { src: "/games/nba.webp", title: "NBA 2k25", price: "₱3,499" },
    { src: "/games/gta.jpg", title: "Grand Theft Auto: V", price: "₱1,499" },
    { src: "/games/sonic.jpg", title: "Sonic Racing", price: "₱1,099" },
  ];

  // Custom sign in handler
  const handleSignIn = () => {
    openSignIn({
      redirectUrl: "/dashboard"
    });
  };

  // If user is signed in, show loading state while redirecting
  if (isSignedIn) {
    return (
      <main className="bg-[#1b2838] text-white min-h-screen w-full px-6 py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Redirecting to Dashboard...</h1>
          <p className="text-gray-300">Please wait while we take you to your personalized dashboard.</p>
        </div>
      </main>
    );
  }

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
              <p className="text-gray-300 text-sm">You haven't add anything yet. Start exploring!</p>
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
                      {featuredGames.slice(start, end).map((game, i) => (
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
              different genres. Whether you're looking for free-to-play games or premium ones, 
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
                  desc: "Valve updates Steam's store menu for better personalized recommendations and browsing experience.",
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
          {/* Custom sign in button without SignInButton component */}
          <button 
            onClick={handleSignIn}
            className="px-6 py-2 rounded-full bg-[#1b9aaa] text-white font-medium hover:bg-[#14828a] transition shadow-sm cursor-pointer"
          >
            Sign In
          </button>
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
                      href={selectedGameModal.shopLink ?? "https://store.steampowered.com/"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2 bg-[#1b9aaa] hover:bg-[#14828a] rounded-lg font-medium transition"
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