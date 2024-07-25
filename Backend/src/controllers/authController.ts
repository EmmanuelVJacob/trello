import { Request, Response } from "express";
import { User, UserOutput } from "../models/types/userModel.types";
import bcrypt from "bcrypt";
import Auth from "../services/authService";
import { funJwt } from "../utils/jwtFuc";
import jwt from "jsonwebtoken";

const signUpController = {
  // User Signup
  userSignUp: async (
    req: Request<{ email: string; password: string; username: string }>,
    res: Response<{ data: UserOutput | null; message: string }>
  ) => {
    try {
      const { email, username, password } = req.body;

      const authService = new Auth();

      // Bcrypt password before inserting into db
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userDetails: User | null = await authService.createUser(
        username,
        hashedPassword,
        email
      );

      if (userDetails) {
        return res.status(200).json({
          data: {
            username: userDetails?.username,
            email: userDetails?.email,
          },
          message: "User Signup Successful!",
        });
      } else {
        return res.status(409).json({
          data: {
            email: "",
            username: "",
          },
          message: "User already exists!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        data: {
          email: "",
          username: "",
        },
        message: "Internal server error!",
      });
    }
  },

  googleSignUp: async (
    req: Request,
    res: Response<{ data: UserOutput | null; message: string }>
  ) => {
    try {
      const { credential } = req.body.credentials;

      // Decode the JWT token
      const decodedToken = jwt.decode(credential);

      if (!decodedToken) {
        throw new Error("Failed to decode token");
      }
      const authService = new Auth();

      // Destructure the name and email from the decoded token
      const { name, email } = decodedToken as { name: string; email: string };

      // Check if the user already exists
      const existingUser = await authService.userSignin(email);

      if (existingUser) {
        // If user exists, log them in
        const { tokens } = await funJwt(existingUser);

        // Set cookies
        res.cookie("accessToken", tokens?.access_token, {
          httpOnly: true,
          maxAge: 3600000, // 1 hour
          path: "/",
        });

        return res.status(200).json({
          data: {
            username: existingUser?.username,
            email: existingUser?.email,
            accessToken: tokens?.access_token,
          },
          message: "User login successful!",
        });
      } else {
        // If user doesn't exist, create a new user
        const userDetails: User | null = await authService.googleSignUp(
          name,
          email
        );

        if (userDetails) {
          const { tokens } = await funJwt(userDetails);

          // Set cookies
          res.cookie("accessToken", tokens?.access_token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hour
            path: "/",
          });

          return res.status(200).json({
            data: {
              username: userDetails?.username,
              email: userDetails?.email,
              accessToken: tokens?.access_token,
            },
            message: "User signup successful!",
          });
        } else {
          return res.status(500).json({
            data: {
              email: "",
              username: "",
            },
            message: "Failed to sign up user!",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ data: null, message: "Failed to sign up user." });
    }
  },

  // User Login
  userSignin: async (
    req: Request<{ email: string; password: string }>,
    res: Response<{ data: UserOutput; message: string }>
  ) => {
    try {
      const { email, password } = req.body;

      const authService = new Auth();

      const userDetails = await authService.userSignin(email);

      if (!userDetails) {
        return res.status(400).json({
          data: { email: "", username: "", accessToken: "" },
          message: "Invalid user details!",
        });
      }

      if (userDetails?.password) {
        const validPassword = await bcrypt.compare(
          password,
          userDetails?.password
        );

        if (!validPassword) {
          return res.status(400).json({
            data: {
              email: "",
              username: "",
              accessToken: "",
            },
            message: "Invalid user password!",
          });
        }

        // Get tokens and give to client
        const { tokens } = await funJwt(userDetails);

        // Set cookies
        res.cookie("accessToken", tokens?.access_token, {
          httpOnly: true,
          maxAge: 3600000, // 1 hour
          path: "/",
        });

        return res.status(200).json({
          data: {
            email: userDetails?.email,
            username: userDetails?.username,
            accessToken: tokens?.access_token,
          },
          message: "Signin successful!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        data: { email: "", username: "", accessToken: "" },
        message: "Internal server error!",
      });
    }
  },

  // Logout
  logout: async (
    req: Request<{}>,
    res: Response<{ success: boolean; message: string }>
  ) => {
    try {
      res.clearCookie("accessToken", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
      });

      res.status(200).json({
        success: true,
        message: "Logout successful!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error!",
      });
    }
  },
};

export default signUpController;
