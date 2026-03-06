import express from "express";

export const router = express.Router();

router.get("/api", (req, res) => {
  res.status(200).json({ message: "API Grená funcionando 🚀" });
});