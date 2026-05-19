const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  picture: String,
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const products = [
  // Phones — 6 products
  {name: 'iPhone 14', description: 'Apple iPhone 14, 128GB, Midnight. A15 Bionic chip, 12MP camera, 5G.', price: 79999, category: 'phones', picture: '/products/iphone.png'},
  {name: 'iPhone 13', description: 'Apple iPhone 13, 128GB, Starlight. Super Retina XDR display, Ceramic Shield.', price: 59999, category: 'phones', picture: '/products/iphone.png'},
  {name: 'Samsung Galaxy S23', description: 'Samsung Galaxy S23, 256GB, Phantom Black. Snapdragon 8 Gen 2, 50MP camera.', price: 74999, category: 'phones', picture: '/products/galaxy.png'},
  {name: 'Samsung Galaxy A54', description: 'Samsung Galaxy A54, 128GB, Awesome Violet. 6.4" Super AMOLED, 50MP triple camera.', price: 38999, category: 'phones', picture: '/products/galaxy.png'},
  {name: 'Redmi Note 12', description: 'Xiaomi Redmi Note 12, 6GB RAM, 128GB. AMOLED display, 5000mAh battery.', price: 17999, category: 'phones', picture: '/products/redmi.png'},
  {name: 'Redmi Note 12 Pro', description: 'Xiaomi Redmi Note 12 Pro, 8GB RAM, 256GB. 200MP camera, 67W fast charging.', price: 27999, category: 'phones', picture: '/products/redmi.png'},

  // Laptops — 6 products
  {name: 'MacBook Air M2', description: 'Apple MacBook Air 13", M2 chip, 8GB RAM, 256GB SSD. All-day battery life.', price: 114900, category: 'laptops', picture: '/products/macbook.png'},
  {name: 'MacBook Pro M2', description: 'Apple MacBook Pro 14", M2 Pro chip, 16GB RAM, 512GB SSD. Liquid Retina XDR.', price: 199900, category: 'laptops', picture: '/products/macbook.png'},
  {name: 'MSI GF63 Thin', description: 'MSI GF63 Thin, Intel i5-12th Gen, RTX 3050, 16GB RAM, 512GB SSD.', price: 62990, category: 'laptops', picture: '/products/msi.png'},
  {name: 'MSI Katana GF66', description: 'MSI Katana GF66, Intel i7-12th Gen, RTX 3060, 16GB RAM, 1TB SSD.', price: 89990, category: 'laptops', picture: '/products/msi.png'},
  {name: 'ROG Zephyrus G14', description: 'ASUS ROG Zephyrus G14, AMD Ryzen 9, RTX 4060, 16GB RAM, 1TB SSD.', price: 129990, category: 'laptops', picture: '/products/rog.png'},
  {name: 'ROG Strix G15', description: 'ASUS ROG Strix G15, AMD Ryzen 7, RTX 3070, 16GB RAM, 1TB SSD. 144Hz display.', price: 109990, category: 'laptops', picture: '/products/rog.png'},

  // Headphones — 6 products
  {name: 'AirPods Pro (2nd Gen)', description: 'Apple AirPods Pro, Active Noise Cancellation, Adaptive Transparency, MagSafe.', price: 24900, category: 'headphones', picture: '/products/airpods.png'},
  {name: 'AirPods (3rd Gen)', description: 'Apple AirPods with Spatial Audio, Adaptive EQ, Lightning charging case.', price: 17900, category: 'headphones', picture: '/products/airpods.png'},
  {name: 'Huawei FreeBuds 5i', description: 'Huawei FreeBuds 5i, ANC 3.0, Hi-Res Audio, 28hr total battery life.', price: 8999, category: 'headphones', picture: '/products/freebuds.png'},
  {name: 'Huawei FreeBuds Pro 2', description: 'Huawei FreeBuds Pro 2, Triple ANC, Hi-Res Audio Wireless, 6hr playback.', price: 14999, category: 'headphones', picture: '/products/freebuds.png'},
  {name: 'HyperX Cloud II', description: 'HyperX Cloud II, 7.1 Virtual Surround Sound, 53mm drivers, memory foam.', price: 6999, category: 'headphones', picture: '/products/headset.png'},
  {name: 'HyperX Cloud Alpha', description: 'HyperX Cloud Alpha, Dual Chamber Drivers, detachable mic, braided cable.', price: 8999, category: 'headphones', picture: '/products/headset.png'},

  // Clothes — 6 products
  {name: 'Classic White Shirt', description: 'Premium cotton Oxford shirt, slim fit, button-down collar. Perfect for work or casual wear.', price: 1299, category: 'clothes', picture: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'},
  {name: 'Denim Jacket', description: 'Vintage-wash denim jacket, classic blue. Rugged twill lining, chest pockets, unisex fit.', price: 2499, category: 'clothes', picture: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=400&fit=crop'},
  {name: 'Slim Fit Chinos', description: 'Stretch cotton chinos, slim fit, available in khaki. Wrinkle-resistant, all-day comfort.', price: 1799, category: 'clothes', picture: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop'},
  {name: 'Graphic Tee', description: 'Oversized graphic t-shirt, 100% cotton, pre-shrunk. Bold minimal print, unisex sizing.', price: 699, category: 'clothes', picture: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop'},
  {name: 'Hoodie Sweatshirt', description: 'Fleece-lined pullover hoodie, kangaroo pocket, ribbed cuffs. Warm and cozy for any season.', price: 1999, category: 'clothes', picture: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=400&h=400&fit=crop'},
  {name: 'Running Shorts', description: 'Lightweight polyester running shorts with mesh liner, side pockets, 5" inseam.', price: 899, category: 'clothes', picture: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'},

  // Household — 6 products
  {name: 'Air Purifier', description: 'HEPA H13 air purifier, covers 400 sq ft. Removes 99.97% of dust, pollen, and smoke particles.', price: 8999, category: 'household', picture: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop'},
  {name: 'Robot Vacuum', description: 'Smart robotic vacuum with auto-mapping, 2700Pa suction, Wi-Fi control. Works on all floor types.', price: 14999, category: 'household', picture: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'},
  {name: 'Instant Pot Duo', description: '7-in-1 electric pressure cooker, 6L. Pressure cook, slow cook, rice cooker, steamer, and more.', price: 6499, category: 'household', picture: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'},
  {name: 'LED Desk Lamp', description: 'Adjustable LED desk lamp with 5 color modes, USB charging port, touch control, foldable arm.', price: 1299, category: 'household', picture: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop'},
  {name: 'Ceramic Coffee Mug Set', description: 'Set of 4 handcrafted ceramic mugs, 350ml each. Microwave and dishwasher safe, minimalist design.', price: 799, category: 'household', picture: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop'},
  {name: 'Bamboo Cutting Board', description: 'Extra-large bamboo cutting board with juice groove, handle, and non-slip feet. Eco-friendly.', price: 599, category: 'household', picture: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?w=400&h=400&fit=crop'},
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URL);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Seeded', products.length, 'products');
  await mongoose.disconnect();
}

seed().catch(console.error);
