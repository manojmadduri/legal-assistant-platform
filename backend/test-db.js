const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'legal_assistant',
  password: 'password',
  port: 5432,
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL!');
    const result = await client.query('SELECT NOW()');
    console.log('Query result:', result.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err);
  }
}

testConnection();
