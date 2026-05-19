import {initMongoose} from "../../lib/mongoose";
import Order from "../../models/Order";
import crypto from 'crypto';

export default async function handler(req, res) {
  await initMongoose();

  if (req.method !== 'POST') {
    return res.status(405).json('method not allowed');
  }

  const {razorpay_order_id, razorpay_payment_id, razorpay_signature, db_order_id} = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json('invalid signature');
  }

  await Order.findByIdAndUpdate(db_order_id, {paid: 1});

  res.redirect(303, '/?success=true');
}
