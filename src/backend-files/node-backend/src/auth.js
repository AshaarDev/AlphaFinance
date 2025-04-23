import { Router } from "express";
import pkg from "jsonwebtoken"; 
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config(); 

const { sign, verify } = pkg;
const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const user = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    const jwtToken = sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax"
    });

    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during Google login:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
});

router.get("/verify-token", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    res.status(200).json({ user: decoded });
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
});

export default router;
