// import { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { REDIRECT_URI } from "../config/env";
// import { auth } from "../firebase/config";
// import { onAuthStateChanged } from "firebase/auth";

// function CallbackPage({ setUserData }) {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function handleCallback() {
//       const code = searchParams.get("code");
//       if (!code) return;

//       // garante que o usuário esteja logado e temos seu uid
//       onAuthStateChanged(auth, async (user) => {
//         if (!user) {
//           navigate("/conectar-redes");
//           return;
//         }

//         // chama a Cloud Function
//         const resp = await fetch(
//           "http://localhost:5000/furia-fan-app/us-central1/twitterToken",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ code, uid: user.uid }),
//           }
//         );
//         const data = await resp.json();
//         if (data.success) {
//           // atualiza a lista de socialLinks no estado global
//           // aqui você pode buscar de novo do Firestore ou simplesmente:
//           setUserData((prev) => ({
//             ...prev,
//             socialLinks: [
//               ...(prev.socialLinks || []),
//               { link: "https://twitter.com/...", status: "validado" },
//             ],
//           }));
//           navigate("/hub");
//         } else {
//           console.error("Erro na função:", data.error);
//         }
//       });
//     }
//     handleCallback();
//   }, [searchParams, navigate, setUserData]);

//   return <p>Conectando com o Twitter…</p>;
// }

// export default CallbackPage;


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
            redirectUri: "http://localhost:5173/callback",
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

