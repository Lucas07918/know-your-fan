Furias Fan App

Um aplicativo web para fãs de esports, especialmente da FURIA, para interagir com conteúdo personalizado, conectar perfis sociais e gerenciar preferências. Coleta dados de usuários, valida documentos e exibe conteúdos dinâmicos como partidas, notícias e streams.
 
📝 Sumário

Visão Geral
Funcionalidades
Tecnologias
Pré-requisitos
Configuração
Variáveis de Ambiente
Instalação
Estrutura do Projeto
Executando Localmente
Fluxo de Páginas
Testes
Deploy
Solução de Problemas
Contribuindo
Próximos Passos
Changelog
Licença
Contato

Visão Geral
O Furias Fan App é um protótipo full-stack voltado para fãs de esports, com foco nos torcedores da FURIA. Ele oferece um painel personalizado com notícias, partidas futuras, status de streams e informações de jogadores, além de permitir a conexão de contas sociais e validação de perfis. O aplicativo coleta preferências dos usuários e usa IA para personalizar a experiência.
Propósito: Criar uma plataforma que engaje fãs de esports com conteúdo relevante e valide identidades para uma comunidade confiável.
Público-alvo: Fãs de esports, especialmente da FURIA, interessados em CS:GO e Valorant.
Demonstração: fan-app.vercel.app (substitua pela URL real).
Funcionalidades

Cadastro Multi-etapas: Coleta nome, endereço, CPF, interesses (e.g., FURIA, LOUD), eventos e preferências de produtos.
Upload de Documentos: Validação simulada de documentos de identidade usando AWS Rekognition.
Login Social: Autenticação via Google (Firebase) e Twitter/X OAuth2.
Hub Personalizado:
Card de Notícias: Artigos de esports via NewsAPI.
Card de Partidas: Partidas futuras via PandaScore (CS:GO: FURIA, G2, paiN; Valorant: LOUD).
Status de Streams: Streams ao vivo no Twitch baseados nos interesses.
Informações de Jogadores: Detalhes de jogadores como FalleN (via PandaScore).
Produtos Recomendados: Sugestões baseadas em interesses.


Perfil de Esports: Adiciona e valida perfis de HLTV, Liquipedia, FACEIT ou Steam.
Validação com IA: Usa Cohere para classificar relevância de perfis.

Tecnologias

Frontend: React 18, Vite 4, Chakra UI, React Router DOM
Backend: Node.js 18, Express
Banco de Dados e Autenticação: Firebase (Firestore, Authentication)
APIs:
NewsAPI (artigos de notícias)
PandaScore (dados de partidas e jogadores)
Twitch API (status de streams)
Cohere (classificação de texto)
AWS Rekognition (validação de documentos)


Deploy: Vercel (frontend), Heroku/Render (backend)

Pré-requisitos

Node.js: v18.x (Instale via nvm)
npm: v8+ (incluso com Node.js)
Conta Firebase: Para autenticação e Firestore
Chaves de API:
Firebase (console.firebase.google.com)
Twitter/X (developer.twitter.com)
Twitch (dev.twitch.tv)
NewsAPI (newsapi.org)
PandaScore (pandascore.co) – Plano gratuito: 1000 requisições/mês
Cohere (dashboard.cohere.ai)
AWS (aws.amazon.com) – Para Rekognition



Configuração

Clone o Repositório:
git clone https://github.com/Lucas07918/know-your-fan.git
cd fan-app


Configure o Firebase:

Crie um projeto no Firebase Console.
Ative Authentication (provedor Google) e Firestore Database.
Copie a configuração do Firebase para o .env do frontend (veja Variáveis de Ambiente).


Obtenha Chaves de API:

Twitter/X: Crie um aplicativo no Portal do Desenvolvedor para VITE_TWITTER_CLIENT_ID e VITE_TWITTER_CLIENT_SECRET.
Twitch: Registre um aplicativo para VITE_TWITCH_CLIENT_ID e VITE_TWITCH_CLIENT_SECRET.
NewsAPI: Inscreva-se para uma chave gratuita.
PandaScore: Obtenha um token bearer (plano gratuito disponível).
Cohere: Registre-se para uma chave de API.
AWS: Crie um usuário IAM com permissões para Rekognition para AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY.



Variáveis de Ambiente
Crie arquivos .env com base nos arquivos .env.example (inclusos no repositório).
Frontend (frontend/.env):
VITE_FIREBASE_API_KEY=sua-chave-firebase
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-id-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-id-remetente
VITE_FIREBASE_APP_ID=seu-id-aplicativo

VITE_TWITTER_CLIENT_ID=seu-client-id-twitter
VITE_TWITTER_CLIENT_SECRET=seu-client-secret-twitter
VITE_TWITCH_CLIENT_ID=seu-client-id-twitch
VITE_TWITCH_CLIENT_SECRET=seu-client-secret-twitch
VITE_NEWSAPI_KEY=sua-chave-newsapi
VITE_PANDASCORE_TOKEN=Bearer seu-token-pandascore
VITE_COHERE_API_KEY=sua-chave-cohere

Backend (api/.env):
PORT=3001
CLIENT_ID=seu-client-id-twitter
CLIENT_SECRET=seu-client-secret-twitter
PANDASCORE_TOKEN=Bearer seu-token-pandascore
AWS_ACCESS_KEY_ID=sua-chave-acesso-aws
AWS_SECRET_ACCESS_KEY=sua-chave-secreta-aws
AWS_REGION=us-east-1

Nota de Segurança: Nunca faça commit dos arquivos .env. Adicione .env ao .gitignore.
Instalação

Frontend:
cd frontend
npm install


Backend:
cd api
npm install



Estrutura do Projeto
fan-app/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis (e.g., UpcomingMatchCard.jsx)
│   │   ├── pages/               # Rotas (e.g., HubPage.jsx)
│   │   ├── firebase/            # Configuração e utilitários do Firebase
│   │   ├── data/                # Dados estáticos (e.g., esports_news_tags.json)
│   │   ├── App.jsx              # Componente principal
│   │   └── main.jsx             # Ponto de entrada
│   ├── .env.example             # Modelo para variáveis de ambiente
│   ├── vite.config.js           # Configuração do Vite (proxy)
│   └── package.json
└── api/                         # Node + Express
    ├── routes/                  # Rotas da API
    ├── server.js                # Servidor backend
    ├── .env.example             # Modelo para variáveis de ambiente
    └── package.json

Executando Localmente

Backend:
cd api
npm start


Executa em http://localhost:3001.


Frontend:
cd frontend
npm run dev


Executa em http://localhost:5173.


Verifique o Proxy (se usado):

Certifique-se de que o vite.config.js faz proxy de /api/pandascore para http://localhost:3001:server: {
  proxy: {
    '/api/pandascore': 'http://localhost:3001',
  },
}





Fluxo de Páginas
graph TD
  A[LandingPage (/)] --> B[Cadastro (/cadastro)]
  B --> C[Upload de Documento (/upload-documento)]
  C --> D[Conectar Redes (/conectar-redes)]
  D --> E[Callback OAuth (/callback)]
  E --> F[Hub (/hub)]
  F --> G[Adicionar Perfil de Esports (/add-esports-profile)]
  F --> H[Perfil (/perfil)]
  H --> I[Editar Perfil (/editar-perfil)]


LandingPage: Página inicial com visão geral do aplicativo.
Cadastro: Formulário multi-etapas (nome, endereço, CPF, interesses).
Upload de Documento: Envio de RG/selfie para validação simulada.
Conectar Redes: Vincula contas Google, Twitter/X, Twitch.
Callback OAuth: Gerencia redirecionamentos OAuth.
Hub: Painel personalizado com notícias, partidas, streams, informações de jogadores.
Adicionar Perfil de Esports: Envia links de HLTV/Liquipedia para validação.
Perfil: Exibe dados do usuário e perfis vinculados.
Editar Perfil: Atualiza preferências.
Ganhar Pontos: Gamificação (em desenvolvimento).

Testes

Testes Manuais:

Cadastre um usuário com interesses (e.g., ["FURIA", "LOUD"]).
Verifique os cards do hub:
Notícias: Exibe 3 artigos (NewsAPI).
Partidas: Mostra uma partida futura (PandaScore).
Jogador: Exibe detalhes do FalleN (PandaScore).
Streams: Mostra status do Twitch.


Envie um documento e verifique a resposta de /validate-document.
Adicione um perfil HLTV (e.g., https://www.hltv.org/player/2023/fallen).


Testes Unitários (se implementados):
cd frontend
npm test


Testes de API:

Use o Postman para testar o PandaScore:GET https://api.pandascore.co/players/17497
Authorization: Bearer seu-token-pandascore


Teste endpoints do backend:POST http://localhost:3001/validate-link
Body: { "link": "https://www.hltv.org/player/2023/fallen" }





Deploy
Frontend (Vercel)

Faça push para o GitHub.
Conecte o repositório ao Vercel em vercel.com.
Configure as variáveis de ambiente no painel do Vercel (mesmas do frontend/.env).
Configure o vercel.json:{
  "version": 2,
  "builds": [{ "src": "frontend", "use": "@vercel/static-build" }],
  "routes": [{ "src": "/(.*)", "dest": "frontend" }]
}


Faça deploy: vercel --prod.

Backend (Heroku)

Crie um aplicativo no Heroku em heroku.com.
Configure as variáveis de ambiente (mesmas do api/.env).
Faça deploy:cd api
heroku git:remote -a seu-nome-aplicativo
git push heroku main


Garanta que o CORS permita a origem do frontend:app.use(cors({ origin: 'https://fan-app.vercel.app' }));



Firebase

Ative o modo de produção no console do Firebase.
Atualize as regras de segurança do Firestore:rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

Licença
Licenciado sob a Licença MIT.
Contato

Suporte: Abra uma issue em GitHub Issues.
E-mail: lucassilva07918@gmail.com

