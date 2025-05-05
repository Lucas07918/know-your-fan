import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function CallbackPage({ setUserData }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const codeVerifier = localStorage.getItem("twitter_code_verifier");

  useEffect(() => {
    async function fetchToken() {
      const code = searchParams.get("code");

      try {
        const response = await fetch("http://localhost:5000/twitter/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            codeVerifier,
            redirectUri: "http://know-your-fan.vercel.app/callback",
          }),
        });

        const data = await response.json();
        console.log("Token recebido do backend:", data);

        if (data.access_token) {
          // Aqui você poderia usar a token para buscar dados do usuário na API do X
          setUserData(prev => ({
            ...prev,
            socialLinks: [
              ...(prev.socialLinks || []),
              { link: "https://x.com/...", status: "validado" },
            ],
          }));

          navigate("/hub");
        } else {
          alert("Erro ao conectar com o X (Twitter).");
        }
      } catch (error) {
        console.error("Erro na requisição ao backend:", error);
        alert("Erro ao conectar com o servidor.");
      }
    }

    fetchToken();
  }, [navigate, searchParams, setUserData, codeVerifier]);

  return <p>Conectando com o X...</p>;
}

export default CallbackPage;

