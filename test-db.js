require('dotenv').config();
const { Pool } = require('pg');

async function testConnection(name, connectionString) {
    const pool = new Pool({ connectionString, connectionTimeoutMillis: 5000 });
    try {
        const client = await pool.connect();
        console.log(`[${name}] SUCCESS! Connected to the database.`);
        client.release();
        return true;
    } catch (err) {
        console.log(`[${name}] FAILED! Error: ${err.message}`);
        return false;
    } finally {
        await pool.end();
    }
}

async function main() {
    const base = process.env.DATABASE_URL;

    if (!base) {
        console.error("DATABASE_URL is not set in .env");
        process.exit(1);
    }

    const strings = [
        { name: "Original", url: `${base}:6543/postgres` },
        { name: "With SSL", url: `${base}:6543/postgres?sslmode=require` },
        { name: "With pgBouncer", url: `${base}:6543/postgres?pgbouncer=true` },
        { name: "Session Mode 5432", url: `${base}:5432/postgres` },
        { name: "Session Mode 5432 + SSL", url: `${base}:5432/postgres?sslmode=require` },
        { name: "Environment DB URL", url: process.env.DATABASE_URL },
    ];

    for (const s of strings) {
        await testConnection(s.name, s.url);
    }
}

main();
