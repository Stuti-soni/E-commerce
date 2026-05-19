import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initMongoose } from '@/lib/mongoose';
import ProductModel from '@/models/Product';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });

  await initMongoose();
  const allProducts = await ProductModel.find().lean().exec();

  const catalog = (allProducts as any[]).map(p => ({
    id: p._id.toString(),
    name: p.name,
    category: p.category,
    price: p.price,
    description: p.description,
  }));

  const systemPrompt = `You are Nova, a friendly and helpful AI shopping assistant for NovaBuy — an Indian e-commerce store.

You help customers find the right products from our catalog. Be conversational, helpful, and concise.
Always respond in 2-4 sentences max unless listing products.
When recommending products, mention the name and price in ₹.
If asked about something not in the catalog, politely say it's not available but suggest something close.

Current product catalog:
${JSON.stringify(catalog, null, 2)}

Guidelines:
- Greet warmly but briefly
- Give direct product recommendations with prices
- Suggest complementary products when relevant
- If budget is mentioned, filter accordingly
- Use ₹ for prices, not $ or Rs`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: "Got it! I'm Nova, ready to help NovaBuy customers find the perfect products." }],
        },
        ...((history || []).map((h: { role: string; text: string }) => ({
          role: h.role as 'user' | 'model',
          parts: [{ text: h.text }],
        }))),
      ],
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (e: any) {
    res.status(500).json({ error: 'AI unavailable', detail: e.message });
  }
}
