// src/config/env.js
export const REDIRECT_URI = import.meta.env.DEV
  ? "http://localhost:5173/callback"
  : "https://seu-app.vercel.app/callback"; // substitua pela URL da Vercel
