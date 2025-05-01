const functions = require("firebase-functions");
const fetch = require("node-fetch");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.twitterToken = functions.https.onRequest(async (req, res) => {
  // Espera um POST com { code }
  if (req.method !== "POST") {
    return res.status(405).send("Use POST");
  }
  const { code, uid } = req.body;
  const { client_id, client_secret, redirect_uri } = functions.config().twitter;

  try {
    // 1) Troca o code pelo access_token
    const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        redirect_uri,
        code_verifier: "challenge", // mesmo de antes
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error("Erro Twitter token:", tokenData);
      return res.status(400).json({ error: tokenData });
    }

    // 2) Salva no Firestore no doc do usuário
    await db.collection("users").doc(uid).set(
      {
        twitter: {
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          scope: tokenData.scope,
        }
      },
      { merge: true }
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("Erro na Function twitterToken:", err);
    return res.status(500).json({ error: err.toString() });
  }
});
