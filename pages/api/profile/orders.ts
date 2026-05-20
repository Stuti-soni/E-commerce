import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import authOptions from '../auth/[...nextauth]';
import { initMongoose } from '@/lib/mongoose';
import Order from '@/models/Order';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions) as { user?: { email?: string } } | null;
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  await initMongoose();
  const orders = await Order.find({ email: session.user?.email })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  res.json(JSON.parse(JSON.stringify(orders)));
}
