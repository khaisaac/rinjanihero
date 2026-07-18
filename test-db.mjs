import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 5000
    });
    
    const [rows] = await conn.query('SELECT id, price_usd FROM trekking_packages');
    
    for (const pkg of rows) {
      const base = pkg.price_usd || 200;
      const matrix = [
        { groupSize: '1 Person', minPax: 1, maxPax: 1, pricePrivate: Math.round(base * 1.5), priceStandard: base, priceMeetingPoint: Math.round(base * 0.8) },
        { groupSize: '2-3 Persons', minPax: 2, maxPax: 3, pricePrivate: Math.round(base * 1.3), priceStandard: Math.round(base * 0.9), priceMeetingPoint: Math.round(base * 0.7) },
        { groupSize: '4-6 Persons', minPax: 4, maxPax: 6, pricePrivate: Math.round(base * 1.2), priceStandard: Math.round(base * 0.8), priceMeetingPoint: Math.round(base * 0.6) },
        { groupSize: '7-10 Persons', minPax: 7, maxPax: 10, pricePrivate: Math.round(base * 1.1), priceStandard: Math.round(base * 0.75), priceMeetingPoint: Math.round(base * 0.5) },
        { groupSize: '11+ Persons', minPax: 11, maxPax: 100, pricePrivate: Math.round(base * 1.05), priceStandard: Math.round(base * 0.7), priceMeetingPoint: Math.round(base * 0.45) }
      ];
      
      await conn.query('UPDATE trekking_packages SET pricing_matrix = ? WHERE id = ?', [JSON.stringify(matrix), pkg.id]);
      console.log('Updated pricing matrix with minPax/maxPax for', pkg.id);
    }
    
    await conn.end();
  } catch (e) {
    console.error('Connection failed:', e.message);
  }
}
run();
