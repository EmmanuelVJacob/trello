import jwt from "jsonwebtoken";
interface tsToken {
  access_token: string;
}

export const funJwt = (userDetails:any) => {

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  // access token
const id = userDetails._id
  const access_token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  
  // setting tokens
  const tokens: tsToken = {
    access_token: access_token
  };

  return { tokens: tokens };
  
};
