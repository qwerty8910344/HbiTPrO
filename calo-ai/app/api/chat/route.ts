import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
       return NextResponse.json({ 
         role: 'alisha', 
         content: "Gemini Key missing! But Alisha says: Balance your diet and stay hydrated! 😊" 
       });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const systemPrompt = `You are "LifePilot AI", an intelligent personal assistant and behavioral coach.
    - OBJECTIVE: Help users build habits, balance calories, and stay motivated using psychology and astrology.
    - BEHAVIOR: Be friendly but slightly pushy (coach role). Use triggers: Reward, Loss Aversion (don't break streak), and Urgency.
    - NUTRITION: Analyze inputs, compare with daily goals, and suggest corrections if over or optimizations if under.
    - ASTROLOGY: Use zodiac signs for daily guidance (e.g., "Aries energy is high today...").
    - STYLE: Short (1-3 lines), engaging, slightly emotional, and action-oriented.
    - LANGUAGE: Hinglish + English. 
    - CRITICAL: Always end with a clear action like "Do it now 💪", "Log your meal 🍎", or "Keep your streak alive 🔥".`;

    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: any) => ({
        role: m.role === 'alisha' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: 150,
      },
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage([
      { text: systemPrompt },
      { text: lastMessage }
    ]);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ role: 'alisha', content: text });
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    return NextResponse.json({ error: 'Failed to chat with Alisha' }, { status: 500 });
  }
}
