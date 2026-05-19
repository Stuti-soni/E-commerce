import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initMongoose } from '@/lib/mongoose';
import ProductModel from '@/models/Product';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId required' });

  await initMongoose();

  const current = await ProductModel.findById(productId).lean().exec();
  if (!current) return res.status(404).json({ error: 'Product not found' });

  const allProducts = await ProductModel.find({ _id: { $ne: productId } }).lean().exec();

  const catalog = allProducts.map((p: any) => ({
    id: p._id.toString(),
    name: p.name,
    category: p.category,
    price: p.price,
    description: p.description,
  }));

  const prompt = `You are a smart e-commerce recommendation engine for NovaBuy, an Indian online store.

A customer is viewing this product:
- Name: ${(current as any).name}
- Category: ${(current as any).category}
- Price: ₹${(current as any).price}
- Description: ${(current as any).description}

Here is the full product catalog (JSON):
${JSON.stringify(catalog, null, 2)}

Recommend exactly 3 products from the catalog that this customer would most likely want to buy next.
IMPORTANT rules:
- At least 1 recommendation MUST be from a DIFFERENT category than the current product
- Think about complementary products (e.g. phone → headphones or laptop, laptop → headphones)
- Consider similar price range or value upgrades
- Do NOT recommend products from the same category for all 3

Respond with ONLY a valid JSON array of exactly 3 product IDs, like this:
["id1", "id2", "id3"]

No explanation, no markdown, just the raw JSON array.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const ids: string[] = JSON.parse(text);
    const recommended = allProducts
      .filter((p: any) => ids.includes(p._id.toString()))
      .slice(0, 3);

    res.json(JSON.parse(JSON.stringify(recommended)));
  } catch (e) {
    // Fallback: return 3 products from same or related category
    const fallback = allProducts
      .filter((p: any) => p.category === (current as any).category)
      .slice(0, 3);
    res.json(JSON.parse(JSON.stringify(fallback)));
  }
}
