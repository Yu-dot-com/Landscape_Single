import bcrypt from "bcrypt";
import * as authRepo from "../repositories/auth.repo";
import jwt from "jsonwebtoken";

export const register = async (
  username: string,
  email: string,
  hash_password: string,
) => {
  console.log("services");
  const existing_email = await authRepo.findUserByEmail(email);
  if (existing_email) {
    throw new Error("Email already exists");
  }
  console.log(hash_password);
  const hashed_password = await bcrypt.hash(hash_password, 10);
  const user = await authRepo.createUser(username, email, hashed_password);
  if (!user) {
    throw new Error("Can't create user");
  }
  return user;
};

const JWT_SECRET = process.env.JWT_SECRET!;
export const login = async (email: string, hash_password: string) => {
  const user = await authRepo.findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(hash_password, user.hash_password);
  if (!isMatch) {
    throw new Error("Password is incorrect");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

export const updateName = async(id:string,name:string) => {
  const result = await authRepo.updateName(id,name)
  return result
}

