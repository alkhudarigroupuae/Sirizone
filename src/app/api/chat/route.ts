import { NextRequest, NextResponse } from 'next/server';

// LM Studio default endpoint (make sure LM Studio is running)
const LM_STUDIO_URL = process.env.LM_STUDIO_URL || 'http://localhost:1234/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Prepare messages for LM Studio
    const messages = [
      {
        role: 'system',
        content: `You are a helpful customer support assistant for Sirizone Marketplace. 
Your role is to:
- Answer questions about products and services
- Help with order inquiries
- Provide technical support
- Guide users through the website
- Be friendly, professional, and concise
Always respond in the same language as the customer's question.`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    // Call LM Studio API
    const response = await fetch(LM_STUDIO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        temperature: 0.7,
        max_tokens: 500,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`LM Studio API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to connect to AI service. Please make sure LM Studio is running.',
        details: error.message
      },
      { status: 500 }
    );
  }
}
