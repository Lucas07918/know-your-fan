import { useEffect, useState } from "react";

const TWITCH_CLIENT_ID = "noucqrcdbtthrocrqxn7lb9oc308gh";
const TWITCH_CLIENT_SECRET = "ct061tgpx1vyvqdp7af861faubhc57";
const TWITCH_USERNAME = "furiatv";

export function useFuriaLiveStatus() {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function fetchAccessToken() {
      const res = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        body: new URLSearchParams({
          client_id: TWITCH_CLIENT_ID,
          client_secret: TWITCH_CLIENT_SECRET,
          grant_type: "client_credentials",
        }),
      });

      const data = await res.json();
      return data.access_token;
    }

    async function checkIfLive() {
      try {
        const token = await fetchAccessToken();

        const res = await fetch(
          `https://api.twitch.tv/helix/streams?user_login=${TWITCH_USERNAME}`,
          {
            headers: {
              "Client-ID": TWITCH_CLIENT_ID,
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        const isStreaming = data.data && data.data.length > 0;
        setIsLive(isStreaming);
      } catch (err) {
        console.error("Erro ao checar status da Twitch:", err);
      }
    }

    checkIfLive();
  }, []);

  return isLive;
}
