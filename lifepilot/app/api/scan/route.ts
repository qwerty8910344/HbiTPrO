import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        food_items: ['Avocado Toast', 'Egg', 'Tomatoes'],
        calories: 420,
        protein: 18,
        carbs: 32,
        fat: 24,
        fiber: 8,
        score: 9.2,
        advice: "Gemini Key missing - using mock data."
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    // Strip base64 prefix
    const base64Data = image.split(',')[1];

    const prompt = `Analyze this food image and return a JSON object with: 
    { 
      "food_items": ["item1", "item2"], 
      "calories": number, 
      "protein": number, 
      "carbs": number, 
      "fat": number, 
      "fiber": number, 
      "score": number (0-10 based on healthiness), 
      "advice": "Friendly Hinglish tip for an Indian user" 
    }. 
    Be accurate for common Indian food quantities and ingredients.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Gemini Scan Error:', error);
    return NextResponse.json({ error: 'Failed to analyze food with Gemini' }, { status: 500 });
  }
}
