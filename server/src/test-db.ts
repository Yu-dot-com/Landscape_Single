import {pool} from "./config/db";

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("DB Connected:", result.rows[0]);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await pool.end();
  }
}

testConnection();