// app/api/games/route.ts

export async function GET() {
  try {
    const apiKey = process.env.MY_KEY;
    const url = "https://ipt-final-topaz.vercel.app/api/ping";

    const apiRes = await fetch(url, {
      headers: {
        "x-api-key": apiKey || "",
      },
      cache: "no-store",
    });

    // Check for response type
    const contentType = apiRes.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await apiRes.text();
      console.error("❌ [GET] Non-JSON response from backend:", text);
      return new Response(
        JSON.stringify({ error: "Invalid backend response" }),
        { status: 500 }
      );
    }

    const response = await apiRes.json();

    // Transform the backend data - PRESERVE ACTUAL PLATFORM VALUES
    const heroes = (response.data || []).map((hero: any) => {
      // Convert price to number safely
      let priceValue = 0;
      if (hero.price !== null && hero.price !== undefined) {
        priceValue = typeof hero.price === 'string' 
          ? parseFloat(hero.price) 
          : Number(hero.price);
      }
      
      // Handle NaN case
      if (isNaN(priceValue)) {
        priceValue = 0;
      }

      // ✅ CRITICAL FIX: Check for platform in multiple possible fields
      const platform = hero.platform || hero.platform_name || "Unknown Platform";
      
      console.log("🔍 [GET] Raw hero data:", { 
        id: hero.id, 
        gameName: hero.gameName, 
        platform: hero.platform,
        allFields: Object.keys(hero) 
      });

      return {
        id: Number(hero.id),
        gameName: hero.gameName || hero.game_name || "Untitled Game",
        category: hero.category || "Uncategorized",
        price: priceValue,
        imageUrl: hero.imageUrl || hero.image_url || "/placeholder.png",
        userId: hero.userId || hero.user_id || null,
        description: hero.description || "",
        platform: platform, // ✅ Use the actual platform value
      };
    });

    console.log("🎮 [GET] Final transformed games:", heroes.map((h: any) => ({ 
      name: h.gameName, 
      price: h.price,
      platform: h.platform,
      id: h.id
    })));

    return Response.json(heroes, { status: 200 });
  } catch (err) {
    console.error("🔥 [GET] /api/games failed:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch games" }),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.MY_KEY;
    const { keyword } = await request.json();

    const url = "https://ipt-final-topaz.vercel.app/api/echo";

    console.log("🔍 [POST] Searching for:", keyword);

    const apiRes = await fetch(url, {
      method: "POST",
      headers: {
        "x-api-key": apiKey || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postBody: keyword,
        action: "search_gameitems",
      }),
    });

    console.log("🛰️ [POST] Response status:", apiRes.status);

    // Check for valid response type
    const contentType = apiRes.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await apiRes.text();
      console.error("❌ [POST] Non-JSON response:", text);
      return new Response(
        JSON.stringify({ error: "Backend did not return JSON" }),
        { status: 500 }
      );
    }

    const response = await apiRes.json();
    console.log("✅ [POST] Backend JSON:", response);

    // Transform response - PRESERVE ACTUAL PLATFORM VALUES
    let heroes: any[] = [];

    if (response.ok && response.item) {
      const item = response.item;
      
      // Convert price to number safely
      let priceValue = 0;
      if (item.price !== null && item.price !== undefined) {
        priceValue = typeof item.price === 'string' 
          ? parseFloat(item.price) 
          : Number(item.price);
      }
      
      // Handle NaN case
      if (isNaN(priceValue)) {
        priceValue = 0;
      }

      // ✅ CRITICAL FIX: Check for platform in multiple possible fields
      const platform = item.platform || item.platform_name || "Unknown Platform";

      console.log("🔍 [POST] Raw item data:", { 
        id: item.id, 
        gameName: item.gameName, 
        platform: item.platform,
        allFields: Object.keys(item) 
      });

      heroes = [
        {
          id: Number(item.id),
          gameName: item.gameName || item.game_name || "Untitled Game",
          category: item.category || "Uncategorized",
          price: priceValue,
          imageUrl: item.imageUrl || item.image_url || "/placeholder.png",
          userId: item.userId || item.user_id || null,
          description: item.description || "",
          platform: platform, // ✅ Use the actual platform value
        },
      ];
    }

    console.log("🎮 [POST] Search results with platforms:", heroes);

    return Response.json(heroes, { status: 200 });
  } catch (err) {
    console.error("🔥 [POST] /api/games failed:", err);
    return new Response(JSON.stringify({ error: "Search failed" }), {
      status: 500,
    });
  }
}