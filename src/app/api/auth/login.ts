import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  //const { email, password } = req.body;
  //call backend to log user in
  const user = { id: 1, email: "khanh@gmail.com", password: "123456" };
  if (user) {
    // User credentials are valid, generate JWT
    const token = jwt.sign(
      { payload: { id: user.id } },
      process.env.JWT_SECRET || "",
    );
    res.status(200).json({ token: token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
}
