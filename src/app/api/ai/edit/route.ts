import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { database, schema, eq, desc, getUserId } from "@/lib/db";
import OpenAI from "openai";

interface EditRequestBody {
  mode: "full" | "caption" | "hashtags" | "all";
  topic: string;
  platform: string;
  contentType: string;
  hasMedia: boolean;
  mediaType?: string;
  existingCaption?: string;
  existingHashtags?: string;
}

interface AIEditResponse {
  caption: string;
  hashtags: string;
  suggestions: string[];
  tone: string;
  platform_notes: string;
}

// Platform-specific guidelines
const platformGuidelines: Record<string, { charLimit: number; guidelines: string[] }> = {
  Instagram: {
    charLimit: 2200,
    guidelines: [
      "Use 20-30 hashtags for maximum reach",
      "Include call-to-action (CTA)",
      "First line is critical (shows before 'more')",
      "Break text into readable chunks",
      "Add line breaks for visual appeal",
    ],
  },
  TikTok: {
    charLimit: 150,
    guidelines: [
      "Keep caption short and snappy",
      "Focus on trending sounds and hashtags",
      "Use popular TikTok hashtags (#foryou, #fyp)",
      "Create curiosity or urgency",
      "Mention the main hook upfront",
    ],
  },
  Facebook: {
    charLimit: 63206,
    guidelines: [
      "Conversational tone works best",
      "Use questions to encourage engagement",
      "Keep first 250 characters impactful",
      "Use emojis sparingly but effectively",
      "Include relevant hashtags (3-5)",
    ],
  },
  LinkedIn: {
    charLimit: 3000,
    guidelines: [
      "Professional and thought-provoking tone",
      "Share insights or lessons learned",
      "Include relevant industry hashtags",
      "Encourage conversation and comments",
      "Use line breaks for readability",
    ],
  },
  X: {
    charLimit: 280,
    guidelines: [
      "Keep it concise and punchy",
      "Use relevant hashtags (1-3)",
      "Include compelling hook at the start",
      "Consider thread format for longer content",
      "Add emojis for visual break-up",
    ],
  },
};

// Generate mock data based on platform and topic
function generateMockResponse(
  topic: string,
  platform: string,
  mode: string,
  existingCaption?: string,
  existingHashtags?: string
): AIEditResponse {
  const guidelines = platformGuidelines[platform] || platformGuidelines.Instagram;

  let caption = "";
  let hashtags = "";
  let tone = "engaging and authentic";
  let suggestions: string[] = [];
  let platformNotes = guidelines.guidelines.join(", ");

  switch (platform) {
    case "TikTok":
      caption = existingCaption
        ? `${existingCaption} 🔥`
        : `Just dropped: ${topic}! 🚀 Don't miss out! #trending #foryou`;
      hashtags = "#FYP #ForYou #Trending #Viral #NewContent";
      tone = "fun and energetic";
      suggestions = [
        "Add trending sound to boost algorithm",
        "Include hook in first 3 seconds",
        "Use trendy transitions",
      ];
      break;

    case "LinkedIn":
      caption = existingCaption
        ? `Refined thought: ${existingCaption}`
        : `Just shared my insights on ${topic}. Looking forward to your thoughts. What's your perspective? #Leadership #Industry`;
      hashtags = "#LinkedIn #Business #Growth #Innovation";
      tone = "professional and thoughtful";
      suggestions = [
        "Add a specific insight or lesson learned",
        "End with a question to encourage discussion",
        "Include relevant industry keywords",
      ];
      break;

    case "Instagram":
      caption = existingCaption
        ? existingCaption
        : `✨ ${topic.toUpperCase()} ✨\n\nWe're excited to share this with you! Here's what makes it special...\n\n👇 Swipe to learn more\n\n#${topic.toLowerCase().replace(/\s+/g, "")}`;
      hashtags =
        "#Instagram #Content #Community #Authentic #Engagement #Brand #Creative #Inspiration";
      tone = "warm and relatable";
      suggestions = [
        "Add a call-to-action button",
        "Use carousel format for storytelling",
        "Tag relevant accounts",
      ];
      break;

    case "Facebook":
      caption = existingCaption
        ? existingCaption
        : `We're thrilled to share this amazing update about ${topic}! Have you tried this yet? Share your experience in the comments below! 👇`;
      hashtags = "#Facebook #Community #Updates #Engagement";
      tone = "conversational and friendly";
      suggestions = [
        "Ask a question to boost engagement",
        "Share a relatable story",
        "Include a specific call-to-action",
      ];
      break;

    case "X":
      caption = existingCaption
        ? existingCaption
        : `Just dropped: ${topic} 🔥 What do you think? #trending #innovation`;
      hashtags = "#X #NewIdea #Trending";
      tone = "witty and concise";
      suggestions = [
        "Keep it under 280 characters",
        "Use trending hashtags",
        "Add a thought-provoking question",
      ];
      break;

    default:
      caption = existingCaption
        ? existingCaption
        : `Check out our latest content about ${topic}!`;
      hashtags = "#Content #NewPost #Updates";
      tone = "friendly and engaging";
      suggestions = ["Tailor content to your audience", "Use relevant keywords"];
  }

  return {
    caption,
    hashtags: existingHashtags
      ? `${existingHashtags} ${hashtags}`
      : hashtags,
    suggestions,
    tone,
    platform_notes: platformNotes,
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    // Parse request body
    const body: EditRequestBody = await request.json();

    // Validate required fields
    if (!body.mode || !body.topic || !body.platform || !body.contentType) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: mode, topic, platform, contentType",
        },
        { status: 400 }
      );
    }

    // Get user ID
    const userId = getUserId(session);

    // Fetch brand profile
    const brandProfile = await database
      .select()
      .from(schema.brandProfiles)
      .where(eq(schema.brandProfiles.userId, userId))
      .limit(1);

    // Fetch recent posts for context
    const recentPosts = await database
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.userId, userId))
      .orderBy(desc(schema.posts.createdAt))
      .limit(5);

    // Extract brand information
    const brand = brandProfile[0] || {};
    const brandName = brand.name || "Your Brand";
    const brandIndustry = brand.industry || "General";
    const brandLocation = brand.location || "Global";
    const brandPersonality = typeof brand.personality === 'object' ? JSON.stringify(brand.personality) : (brand.personality || "balanced");
    const voiceSettings = (typeof brand.voiceSettings === 'object' && brand.voiceSettings) ? brand.voiceSettings as Record<string, any> : {};
    const targetAudience = typeof brand.targetAudience === 'object' ? JSON.stringify(brand.targetAudience) : (brand.targetAudience || "General audience");
    const brandColors = Array.isArray(brand.colors) ? brand.colors : (typeof brand.colors === 'object' && brand.colors) ? Object.values(brand.colors as Record<string, string>) : ["#000000", "#FFFFFF"];

    // Build context from recent posts
    const recentPostsContext = recentPosts
      .slice(0, 3)
      .map((post) => `- ${post.caption?.substring(0, 100) || ""}`)
      .join("\n");

    // Build the AI prompt
    const systemPrompt = `You are an expert social media content strategist and copywriter. Your role is to help create authentic, brand-aligned content for the "${brandName}" brand.

Brand Information:
- Name: ${brandName}
- Industry: ${brandIndustry}
- Location: ${brandLocation}
- Personality: ${brandPersonality}
- Target Audience: ${targetAudience}
- Brand Colors: ${brandColors.join(", ")}

Voice & Tone Settings:
- Formality Level: ${voiceSettings.formality || "moderate"}
- Humor Level: ${voiceSettings.humor || "light"}
- Enthusiasm Level: ${voiceSettings.enthusiasm || "high"}
- Emoji Usage: ${voiceSettings.emojiUsage || "moderate"}

Recent Content Examples:
${recentPostsContext || "No recent posts available."}

You must respond with valid JSON only, with no additional text or markdown formatting.`;

    const userPrompt = `Please help me edit/generate content for ${body.platform}.

Content Details:
- Topic/Description: ${body.topic}
- Content Type: ${body.contentType}
- Has Media: ${body.hasMedia}
${body.mediaType ? `- Media Type: ${body.mediaType}` : ""}
${body.existingCaption ? `- Existing Caption: ${body.existingCaption}` : ""}
${body.existingHashtags ? `- Existing Hashtags: ${body.existingHashtags}` : ""}
- Generation Mode: ${body.mode} (${body.mode === "full" ? "create caption + hashtags" : body.mode === "caption" ? "improve caption only" : body.mode === "hashtags" ? "create hashtags only" : "create everything"})

Please provide a JSON response with the following structure:
{
  "caption": "The generated or improved caption text, optimized for ${body.platform}",
  "hashtags": "Space-separated hashtags like #tag1 #tag2 #tag3",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "tone": "A brief description of the tone used",
  "platform_notes": "Platform-specific tips for maximum engagement"
}`;

    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY;

    let result: AIEditResponse;

    if (openaiApiKey) {
      try {
        // Call OpenAI API
        const openai = new OpenAI({ apiKey: openaiApiKey });

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
          response_format: { type: "json_object" },
        });

        // Extract and parse the response
        const content = response.choices[0].message.content;
        if (!content) {
          throw new Error("Empty response from OpenAI");
        }

        result = JSON.parse(content) as AIEditResponse;
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError);
        // Fall back to mock response
        result = generateMockResponse(
          body.topic,
          body.platform,
          body.mode,
          body.existingCaption,
          body.existingHashtags
        );
      }
    } else {
      // Use mock response when no API key
      result = generateMockResponse(
        body.topic,
        body.platform,
        body.mode,
        body.existingCaption,
        body.existingHashtags
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Edit API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      { error: `Failed to generate edit: ${errorMessage}` },
      { status: 500 }
    );
  }
}
