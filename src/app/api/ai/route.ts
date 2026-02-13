import { NextRequest, NextResponse } from 'next/server';

const getMockResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('create') || lowerMessage.includes('content')) {
    return "I can help you create engaging content! Based on your recent campaign performance, I'd recommend:\n\n1. Focus on Reels - Your data shows 34% higher engagement with video Reels\n2. Post between 8-10 AM - Optimal engagement window based on your audience\n3. Use user-generated content - 2.5x higher engagement than branded content\n\nWould you like me to draft specific content ideas for Instagram, TikTok, or another channel?";
  }

  if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
    return "Here's your weekly performance summary:\n\n📊 This Week's Highlights:\n- Total Engagement: 12,450 interactions (+18% vs last week)\n- Content Published: 16 posts across 4 channels\n- Top Performer: TikTok Reel - 2,847 views\n- Growth Rate: 3.2% follower growth\n\n🎯 Key Insights:\n- Best posting time: 8 AM (UTC-5)\n- Top content type: Short-form video\n- Audience engagement peaked Tuesday-Thursday\n\nWould you like detailed analytics for any specific channel?";
  }

  if (lowerMessage.includes('competitor') || lowerMessage.includes('analysis')) {
    return "Analyzing your top competitors...\n\n🔍 Competitive Insights:\n\n**Top Competitor - BrewCo:**\n- Posting frequency: 2-3x daily (vs your 1-2x)\n- Top content: Behind-the-scenes content\n- Engagement rate: 4.2% (your rate: 3.8%)\n- Strategy: Heavy focus on community building\n\n**Opportunity Areas:**\n- Increase posting frequency during peak hours\n- More behind-the-scenes/team content\n- Interactive polls and Q&As\n- User testimonials and reviews\n\nWould you like me to draft competitive response campaigns?";
  }

  if (lowerMessage.includes('schedule') || lowerMessage.includes('optimize')) {
    return "I've analyzed your posting patterns and audience activity. Here are my optimization recommendations:\n\n⏰ Optimal Publishing Schedule:\n- Monday: 10 AM (Engagement: High)\n- Tuesday-Thursday: 8 AM & 2 PM (Peak times)\n- Friday: 5 PM (Weekend prep content)\n- Saturday: 11 AM (Leisure time)\n- Sunday: 7 PM (Evening engagement)\n\n📱 Channel-Specific Times:\n- Instagram: 8 AM, 2 PM\n- TikTok: 6 PM, 9 PM\n- LinkedIn: 8 AM, 1 PM\n- Facebook: 2 PM, 7 PM\n\nShall I reschedule your upcoming content to these optimal times?";
  }

  if (lowerMessage.includes('growth') || lowerMessage.includes('increase') || lowerMessage.includes('followers')) {
    return "Here's my growth strategy for you:\n\n🚀 Growth Acceleration Plan:\n\n1. **Content Optimization** (Est. +15% growth)\n   - Increase Reel production (34% higher engagement)\n   - Implement trending sounds and hashtags\n   - Post consistently at optimal times\n\n2. **Community Engagement** (Est. +20% growth)\n   - Respond to comments within 1 hour\n   - Host weekly Q&A sessions\n   - Feature user-generated content\n\n3. **Cross-Promotion** (Est. +25% growth)\n   - Link all social channels\n   - Share Instagram Reels on TikTok\n   - Email list promotion\n\n4. **Collaborations** (Est. +30% growth)\n   - Partner with micro-influencers (500-10k followers)\n   - Co-create content with complementary brands\n\nExpected combined growth: 50-70% in 60 days. Ready to implement?";
  }

  if (lowerMessage.includes('budget') || lowerMessage.includes('spending') || lowerMessage.includes('ads')) {
    return "Let me analyze your marketing budget allocation:\n\n💰 Current Allocation Analysis:\n- Total Monthly Budget: $5,000\n- Content Creation: $1,500 (30%)\n- Paid Ads: $2,000 (40%)\n- Tools & Software: $800 (16%)\n- Contingency: $700 (14%)\n\n📈 Recommended Reallocation:\n- Content Creation: Increase to $2,000 (+$500)\n- Paid Ads: Reduce to $1,800 (-$200)\n- Focus: Organic growth + TikTok ads\n\n💡 ROI Opportunities:\n- TikTok ads: $1/CPM (lowest cost)\n- Instagram Reels: $0.80/CPM\n- Facebook: $1.20/CPM\n\nWould you like me to set up new ad campaigns within this budget?";
  }

  if (lowerMessage.includes('email') || lowerMessage.includes('newsletter')) {
    return "I can help optimize your email marketing:\n\n📧 Email Performance Analysis:\n- Current open rate: 28% (industry avg: 21%)\n- Click-through rate: 3.2% (industry avg: 2.5%)\n- Unsubscribe rate: 0.8% (healthy)\n\n✨ Improvement Opportunities:\n1. **Subject Line Optimization**\n   - Use personalization (first name)\n   - Add urgency/curiosity\n   - Keep under 50 characters\n\n2. **Send Time Optimization**\n   - Tuesday 10 AM performs best (+18%)\n   - Segment by engagement level\n   - Test different days\n\n3. **Content Strategy**\n   - 70% value content, 30% promotional\n   - Include 2-3 CTA buttons\n   - Mobile-optimized design\n\nReady to revamp your next newsletter?";
  }

  return "I'm here to help with your marketing! I can assist with:\n\n📝 Content Creation - Draft posts and campaigns\n📊 Analytics & Reporting - Analyze your performance\n🔍 Competitor Analysis - Understand market positioning\n⏰ Schedule Optimization - Best times to post\n🚀 Growth Strategies - Increase followers and engagement\n💰 Budget Planning - Optimize marketing spend\n📧 Email Marketing - Newsletter and campaign optimization\n\nWhat would you like to work on today?";
};

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      );
    }

    const openaiKey = process.env.OPENAI_API_KEY;

    if (openaiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful marketing AI assistant for Marketing OS. Help users with content creation, analytics, strategy, and campaign management. Be concise and actionable.',
              },
              {
                role: 'user',
                content: message,
              },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error('OpenAI API error');
        }

        const data = await response.json();
        const reply = data.choices[0]?.message?.content || 'Unable to generate response';

        return NextResponse.json({ reply });
      } catch (error) {
        console.error('OpenAI API error:', error);
        const mockReply = getMockResponse(message);
        return NextResponse.json({ reply: mockReply });
      }
    }

    const mockReply = getMockResponse(message);
    return NextResponse.json({ reply: mockReply });
  } catch (error) {
    console.error('AI endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
