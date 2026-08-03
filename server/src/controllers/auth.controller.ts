import { Request, Response } from "express";
import * as authServices from "../service/auth.service";
import { findUserByEmail } from "../repositories/auth.repo";

export const register = async (request: Request, response: Response) => {
  try {
    const { username, email, hash_password } = request.body;
    const user = await authServices.register(username, email, hash_password);
    if (!user) return response.status(300).json({ message: "smothing" });
    return response.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(400).json({ message: error.message });
    } else {
      return response.status(400).json({ message: "An unexpected error occurred" });
    }
  }
};

export const login = async (request: Request, response: Response) => {
  try {
    const { email, hash_password } = request.body;
    const login = await authServices.login(email, hash_password);

    return response.status(200).json(login);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(401).json({
        message: error.message,
      });
    } else {
      return response.status(401).json({
        message: "An unexpected error occurred",
      });
    }
  }
};

export const getCurrentUser = async (request: Request, response: Response) => {
  try {
    const email = request.user?.email as string;
    const result = await findUserByEmail(email);
    console.log(result);

    return  response.status(200).json({
      user: {
        id: result.id,
        username: result.username,
        email: result.email,
        role: result.role,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return response.status(401).json({
        message: error.message,
      });
    } else {
      return response.status(401).json({
        message: "An unexpected error occurred",
      });
    }
  }
};

export const updateName = async (request: Request, response: Response) => {
  try {
    const id = request.params.id as string;
    const { name } = request.body;

    const result = await authServices.updateName(id, name);
    return  response.status(200).json({result});
  } catch (error) {
    if (error instanceof Error) {
      return response.status(400).json({
        message: error.message,
      });
    } else {
      return response.status(400).json({
        message: "An unexpected error occurred",
      });
    }
  }
};

