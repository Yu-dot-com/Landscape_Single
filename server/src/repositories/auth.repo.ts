import { pool } from "../config/db";

export const findUserByEmail = async (email: string) => {
  const result = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);

  if (!result) {
    throw new Error("user not found in member.service");
  }
  return result.rows[0];
};

export const createUser = async (
  username: string,
  email: string,
  hash_password: string,
) => {
  const result = await pool.query(
    `INSERT INTO users(username,email,hash_password)
     VALUES ($1,$2,$3)
     RETURNING id,username,email`,
    [username, email, hash_password],
  );
  return result.rows[0];
};

export const updateName = async (id: string, name: string) => {
  const result = await pool.query(
    `
    UPDATE users
    SET username = $1
    WHERE id = $2
    RETURNING *
    `,
    [name, id],
  );
  return result.rows[0];
};
