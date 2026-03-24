import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '2006',
  database: process.env.DB_NAME || 'ecommerce_seller',
};

async function seedData() {
  const connection = await mysql.createConnection(DB_CONFIG);
  try {
    console.log('Seeding demo data...');

    // 1. Create a Seller
    const hashedPassword = await bcrypt.hash('password123', 10);
    const [sellerResult] = await connection.query(
      'INSERT INTO sellers (name, email, password, store_name) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
      ['Demo Seller', 'seller@example.com', hashedPassword, 'Electro Store']
    );
    const sellerId = sellerResult.insertId;

    // 2. Add Products
    const products = [
      ['Wireless Headphones', 'High quality noise cancelling', 99.99, 15, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'],
      ['Smart Watch', 'Fitness tracker and notifications', 149.50, 3, 'Electronics', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'],
      ['Bluetooth Speaker', 'Portable water resistant', 45.00, 2, 'Audio', 'https://images.unsplash.com/photo-1608156639585-3400c58e0cff?w=200'],
    ];

    for (const p of products) {
      await connection.query(
        'INSERT INTO products (seller_id, name, description, price, quantity, category, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [sellerId, ...p]
      );
    }

    // 3. Add Orders & Payments
    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_name, customer_email, customer_address, total_amount) VALUES (?, ?, ?, ?)',
      ['John Doe', 'john@gmail.com', '123 Tech Lane, CA', 249.49]
    );
    const orderId = orderResult.insertId;

    // Items for this seller
    await connection.query(
      'INSERT INTO order_items (order_id, product_id, seller_id, quantity, price, status) VALUES (?, ?, ?, ?, ?, ?)',
      [orderId, 1, sellerId, 1, 99.99, 'Shipped']
    );
    await connection.query(
      'INSERT INTO order_items (order_id, product_id, seller_id, quantity, price, status) VALUES (?, ?, ?, ?, ?, ?)',
      [orderId, 2, sellerId, 1, 149.50, 'Pending']
    );

    // Payment for this seller
    await connection.query(
      'INSERT INTO payments (order_id, seller_id, amount, payment_status, payment_method, transaction_id) VALUES (?, ?, ?, ?, ?, ?)',
      [orderId, sellerId, 249.49, 'Paid', 'Card', 'TXN_987654321']
    );

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await connection.end();
    process.exit();
  }
}

seedData();
