import { useEffect, useState } from "react";

const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = import.meta.env.VITE_TWITCH_CLIENT_SECRET;
// const TWITCH_USERNAME = "furiatv";

export function useTwitchLiveStatus(nome) {
  const [status, setStatus] = useState({
    isLive: false,
    profileImage: "",
    displayName: "",
  });

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

    async function fetchTwitchData() {
      try {
        const token = await fetchAccessToken();

        // Verifica se está ao vivo
        const streamRes = await fetch(
          `https://api.twitch.tv/helix/streams?user_login=${nome}`,
          {
            headers: {
              "Client-ID": TWITCH_CLIENT_ID,
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const streamData = await streamRes.json();
        const isStreaming = streamData.data && streamData.data.length > 0;

        // Busca dados do perfil (imagem, nome)
        const userRes = await fetch(
          `https://api.twitch.tv/helix/users?login=${nome}`,
          {
            headers: {
              "Client-ID": TWITCH_CLIENT_ID,
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = await userRes.json();
        const user = userData.data?.[0];

        setStatus({
          isLive: isStreaming,
          profileImage: user?.profile_image_url || "",
          displayName: user?.display_name || nome,
        });
      } catch (err) {
        console.error("Erro ao buscar dados da Twitch:", err);
      }
    }

    fetchTwitchData();
  }, []);

  return status;
}
