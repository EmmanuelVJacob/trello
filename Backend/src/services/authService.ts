import { User } from "../models/types/userModel.types";
import userModel from "../models/userModel";

class Auth {
  async createUser(
    username: string,
    password: string,
    email: string
  ): Promise<User | null> {
    try {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return null;
      }

      await userModel.create({
        username,
        password,
        email,
      });

      const userDetails: User | null = await userModel.findOne({
        email: email,
        password: password,
      });

      return userDetails;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create user.");
    }
  }

  async googleSignUp(
    username: string,
    email: string
  ): Promise<User | null> {
    try {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return null;
      }

      await userModel.create({
        username,
        email,
        isGoogle:true
      });

      const userDetails: User | null = await userModel.findOne({
        email: email
      });

      return userDetails;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create user.");
    }
  }

  async userSignin(email: string): Promise<User | null> {
    try {
      const user = await userModel.findOne({
        email,
      });

      return user;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create user.");
    }
  }
}

export default Auth;
