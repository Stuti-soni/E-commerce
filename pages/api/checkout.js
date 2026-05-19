import {initMongoose} from "../../lib/mongoose";
import Product from "../../models/Product";
import Order from "../../models/Order";
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  await initMongoose();

  if (req.method !== 'POST') {
    res.json('should be a post but its not!');
    return;
  }

  const {email, name, address, city} = req.body;
  const productsIds = (req.body.products || '').split(',').filter(Boolean);

  if (!productsIds.length) {
    return res.status(400).json('no products selected');
  }

  const uniqIds = [...new Set(productsIds)];
  const products = await Product.find({_id: {$in: uniqIds}}).exec();

  let line_items = [];
  let totalAmount = 0;
  for (let productId of uniqIds) {
    const product = products.find(p => p._id.toString() === productId);
    if (!product) continue;
    const quantity = productsIds.filter(id => id === productId).length;
    const amount = product.price * quantity;
    totalAmount += amount;
    line_items.push({quantity, name: product.name, price: product.price});
  }

  if (!line_items.length) {
    return res.status(400).json('no valid products found');
  }

  // Add delivery fee
  totalAmount += 5;

  const order = await Order.create({
    products: line_items,
    name,
    email,
    address,
    city,
    paid: 0,
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount * 100, // in paise
    currency: 'INR',
    receipt: order._id.toString(),
    notes: {orderId: order._id.toString(), email, name},
  });

  const origin = req.headers.origin;
  const checkoutUrl = `${origin}/pay?order_id=${razorpayOrder.id}&amount=${razorpayOrder.amount}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&db_order_id=${order._id.toString()}`;

  res.redirect(303, checkoutUrl);
}
