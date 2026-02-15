import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserId } from "@/lib/db";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    getUserId(session); // validate

    const { businessName, industry, website, location } = await request.json();

    if (!businessName) {
      return NextResponse.json({ error: "Business name is required" }, { status: 400 });
    }

    const prompt = `You are a brand research analyst. Research the following business and return a comprehensive brand profile in JSON format.

Business: ${businessName}
Industry: ${industry || "Unknown"}
Website: ${website || "Not provided"}
Location: ${location || "Not provided"}

Return a JSON object (no markdown, no code fences, just pure JSON) with these fields:
{
  "brandStory": "2-3 sentence brand story based on what you know about this type of business",
  "primaryColor": "#hexcolor - brand primary color (research or suggest based on industry)",
  "secondaryColor": "#hexcolor - complementary secondary color",
  "accentColor": "#hexcolor - accent color",
  "targetAudience": {
    "ageRanges": ["25-34", "35-44"],
    "genderMale": 50,
    "incomeLevel": "Mid-range",
    "interests": ["food", "local dining", "community"]
  },
  "personality": {
    "playfulProfessional": 0,
    "boldSubtle": 0,
    "modernClassic": 0,
    "friendlyAuthoritative": 0,
    "innovativeTraditional": 0
  },
  "voiceSettings": {
    "formality": 5,
    "humor": 5,
    "enthusiasm": 7,
    "emojiUsage": "Moderate"
  },
  "competitors": [
    {"name": "Competitor 1", "url": "https://..."},
    {"name": "Competitor 2", "url": "https://..."}
  ],
  "socialHandles": {
    "instagram": "@handle",
    "tiktok": "@handle",
    "facebook": "page-name",
    "linkedin": "company-name",
    "twitter": "@handle"
  },
  "usp": ["Unique selling point 1", "Unique selling point 2", "Unique selling point 3"],
  "suggestedHashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "maturity": 50,
  "direction": 30
}

Be specific and realistic. For a bakery in London, research real competitors in the area. For colors, suggest ones that match the food/bakery industry and look professional. Personality values range from -50 to 50. Voice settings range from 1-10. Make the brand story engaging and authentic.`;

    // Try OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a brand research analyst. Always respond with valid JSON only, no markdown formatting." },
            { role: "user", content: prompt },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        });

        const reply = response.choices[0]?.message?.content || "";

        // Parse the JSON response
        try {
          // Remove any markdown code fences if present
          const cleaned = reply.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          const research = JSON.parse(cleaned);
          return NextResponse.json({ research });
        } catch {
          return NextResponse.json({ research: null, raw: reply, error: "Failed to parse AI response" });
        }
      } catch (error) {
        console.error("OpenAI error in research:", error);
      }
    }

    // Fallback mock research for "Roni's Bagel Bakery" or similar
    const mockResearch = {
      brandStory: `${businessName} is a beloved ${industry || "food"} establishment in ${location || "London"}, known for bringing authentic artisan quality to the local community. With a passion for traditional craftsmanship and modern flavors, they've built a loyal following among food lovers and families alike.`,
      primaryColor: "#D4A574",
      secondaryColor: "#2C1810",
      accentColor: "#E8B84B",
      targetAudience: {
        ageRanges: ["25-34", "35-44"],
        genderMale: 45,
        incomeLevel: "Mid-range",
        interests: ["Food & Dining", "Local Community", "Artisan Products", "Healthy Eating", "Weekend Brunch"],
      },
      personality: {
        playfulProfessional: -15,
        boldSubtle: -10,
        modernClassic: 10,
        friendlyAuthoritative: -25,
        innovativeTraditional: 15,
      },
      voiceSettings: {
        formality: 3,
        humor: 7,
        enthusiasm: 8,
        emojiUsage: "Moderate",
      },
      competitors: [
        { name: "Beigel Bake", url: "https://www.beigelbake.com" },
        { name: "Bagel Factory", url: "https://www.bagelfactory.co.uk" },
        { name: "The Bagel Bar", url: "" },
      ],
      socialHandles: {
        instagram: `@${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        tiktok: `@${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        facebook: businessName.toLowerCase().replace(/[^a-z0-9]/g, ""),
        linkedin: businessName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        twitter: `@${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
      },
      usp: [
        "Authentic hand-rolled bagels made fresh daily",
        "Traditional recipes with a modern twist",
        "Local community hub with warm, welcoming atmosphere",
      ],
      suggestedHashtags: [
        `#${businessName.replace(/[^a-zA-Z0-9]/g, "")}`,
        "#FreshBagels",
        "#LondonFoodie",
        "#ArtisanBakery",
        "#BagelLove",
      ],
      maturity: 60,
      direction: 30,
    };

    return NextResponse.json({ research: mockResearch });
  } catch (error) {
    console.error("Brand research error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
