import bcrypt from 'bcryptjs';
import { initMongoose } from '@/lib/mongoose';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields are required' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  await initMongoose();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(409).json({ error: 'Account already exists with this email' });

  const hashed = await bcrypt.hash(password, 12);
  await User.create({ name, email: email.toLowerCase(), password: hashed });

  res.status(201).json({ ok: true });
}
