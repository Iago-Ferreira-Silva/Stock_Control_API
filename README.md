# 📦 Stock Control API

<p align="center">
  API REST desenvolvida para <strong>gerenciamento de estoque de produtos</strong>, com autenticação JWT, 2FA por email, upload de imagens em nuvem, eventos em tempo real, stream de vídeo, sensor virtual e geração de relatórios em PDF.<br/>
  Desenvolvida com <code>Node.js</code>, <code>Express</code> e <code>JavaScript</code>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white"/>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white"/>
  <img src="https://img.shields.io/badge/Resend-000000?style=for-the-badge&logoColor=white"/>
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white"/>
  <img src="https://img.shields.io/badge/PDFKit-FF0000?style=for-the-badge"/>
</p>

---

## ✨ FUNCIONALIDADES

- 🔐 Autenticação com geração de token JWT (padrão Bearer)
- 📧 Segundo fator de autenticação (2FA) com código enviado por email via Resend
- 🔒 Senhas criptografadas no banco com bcrypt
- 📦 Listagem de produtos com filtro por nome e faixa de preço
- ➕ Cadastro de um ou vários produtos simultaneamente
- ✏️ Atualização de produtos via rota PUT
- ❌ Remoção de produtos
- 🔍 Busca de produto por ID
- 🖼️ Upload de imagem para o Cloudinary vinculada ao produto
- 📤 Exportação de todos os itens em formato CSV
- 💾 Backup automático diário às 17h no Cloudinary em formato CSV (agendado para America/Fortaleza)
- 📊 Relatório de monitoramento em PDF com acessos por rota e horário de pico
- 🎬 Stream de vídeo com suporte a HTTP Range Requests
- ⚡ Eventos em tempo real com Socket.io (criação, atualização e remoção de itens)
- 🌡️ Dados em tempo real de sensor virtual (temperatura e umidade) via Wokwi + WebSocket
- 📅 Middleware que restringe acesso de segunda a sexta
- 🕒 Registro automático de logs de requisições no MongoDB
- 📊 Consulta de logs por data com validação de formato
- 📍 Cálculo de distância entre dois pontos geográficos pela fórmula de Haversine
- 📄 Geração de relatório em PDF com lista de produtos do banco
- ✅ Testes automatizados com Jest e Supertest para todas as rotas

---

## 📁 ESTRUTURA DE PASTAS

```bash
stock-control-api/
├── src/
│   ├── config/
│   │   └── upload.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── distanciaController.js
│   │   ├── exportController.js
│   │   ├── itemController.js
│   │   ├── logController.js
│   │   ├── monitoramentoController.js
│   │   └── videoController.js
│   ├── database/
│   │   └── conexao.js
│   ├── frontend/
│   │   ├── app.js
│   │   ├── index.html
│   │   └── style.css
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── loggerMiddleware.js
│   │   └── weekdayMiddleware.js
│   ├── models/
│   │   ├── codigo.js
│   │   ├── item.js
│   │   ├── log.js
│   │   └── usuario.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── distanciaRoutes.js
│   │   ├── exportRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── logRoutes.js
│   │   ├── monitoramentoRoutes.js
│   │   └── videoRoutes.js
│   ├── scripts/
│   │   ├── criarAdmin.js
│   │   └── atualizarAdmin.js
│   ├── services/
│   │   ├── backupService.js
│   │   ├── emailService.js
│   │   └── pdfService.js
│   ├── app.js
│   ├── sensorWS.js
│   ├── server.js
│   └── socket.js
├── tests/
│   ├── auth.test.js
│   ├── distancia.test.js
│   ├── items.test.js
│   ├── logs.test.js
│   └── setup.js
├── videos/               ← pasta local para vídeos (não commitada)
├── socket-test.html
├── video-test.html
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ TECNOLOGIAS UTILIZADAS

- `Node.js` — Ambiente de execução JavaScript no servidor
- `Express` — Framework para construção da API REST
- `MongoDB + Mongoose` — Banco de dados em nuvem e ODM
- `bcrypt` — Criptografia de senhas
- `jsonwebtoken` — Geração e validação de tokens JWT
- `Resend` — Envio de emails para o segundo fator de autenticação
- `Cloudinary + Multer` — Upload e armazenamento de imagens e backups em nuvem
- `Socket.io` — Comunicação em tempo real entre servidor e navegador
- `ws` — Servidor WebSocket para receber dados do ESP32/Wokwi
- `node-cron` — Agendamento do backup automático diário
- `PDFKit` — Geração de arquivos PDF em memória
- `cors` — Controle de origens permitidas
- `Jest + Supertest` — Testes automatizados das rotas
- `Nodemon` — Reinicia automaticamente o servidor em desenvolvimento

---

## 🔐 AUTENTICAÇÃO E SEGURANÇA

- Login em dois passos com segundo fator de autenticação por email (2FA)
- Código de verificação com validade de 10 minutos, descartado após o uso
- Senhas armazenadas como hash bcrypt (salt rounds: 10)
- Token JWT com validade de 1 hora no padrão `Bearer <token>`
- Token também aceito via query string `?token=` para suporte ao player de vídeo
- Mensagens de erro genéricas para não revelar qual campo falhou no login
- `JWT_SECRET` configurável via variável de ambiente
- CORS configurado para permitir apenas origens autorizadas
- Acesso bloqueado aos finais de semana pelo `weekdayMiddleware`
- Logs de todas as requisições persistidos no MongoDB

---

## 📦 ROTAS DA API

### 🔹 Autenticação — pública

**Passo 1 — Enviar credenciais:**

```
POST /logar
```

```json
{ "email": "admin@email.com", "senha": "123456" }
```

**Passo 2 — Verificar código recebido por email:**

```
POST /logar/verificar
```

```json
{ "email": "admin@email.com", "codigo": "472831" }
```

---

### 🔹 Produtos — protegidas

```
GET    /itens                       → lista todos (?nome= ?precoMin= ?precoMax=)
POST   /itens                       → cria um ou vários itens
GET    /itens/:id                   → busca por ID
PUT    /itens/:id                   → atualiza nome e/ou preço
DELETE /itens/:id                   → remove item
POST   /itens/:id/imagem            → upload de imagem (form-data, campo: imagem)
```

---

### 🔹 Exportação e relatórios — protegidas

```
GET /exportar/csv                   → baixa todos os itens em CSV
GET /relatorio/pdf                  → relatório de produtos em PDF
GET /relatorio/monitoramento        → relatório de acessos por rota e horário de pico
```

---

### 🔹 Logs — protegida

```
GET /logs?data=YYYY-MM-DD
```

---

### 🔹 Distância geográfica — protegida

```
GET /distancia?lat1=...&lon1=...&lat2=...&lon2=...
```

---

### 🔹 Vídeo — protegidas

```
GET /video                          → lista vídeos disponíveis
GET /video/stream/:arquivo          → stream do vídeo (?token= para o player HTML)
```

---

### 🔹 Páginas de teste — públicas

```
GET /socket-test                    → página de eventos em tempo real
GET /video-test                     → player de vídeo
```

---

## ⚡ SOCKET.IO — EVENTOS EM TEMPO REAL

O servidor emite eventos via Socket.io sempre que algo muda no estoque. Para visualizar, abra `/socket-test` no navegador.

| Evento            | Quando é emitido                   |
| ----------------- | ---------------------------------- |
| `item:criado`     | Novo item adicionado               |
| `item:atualizado` | Item editado ou imagem alterada    |
| `item:deletado`   | Item removido                      |
| `sensor:dados`    | Novo dado recebido do sensor Wokwi |

---

## 🌡️ SENSOR VIRTUAL — WOKWI

O ESP32 simulado no [Wokwi](https://wokwi.com) conecta via WebSocket em `wss://seu-servidor/sensor` e envia dados de temperatura e umidade a cada 3 segundos. Os dados são repassados em tempo real para todos os navegadores conectados via Socket.io.

Para visualizar, abra `/socket-test` no navegador enquanto a simulação estiver rodando no Wokwi.

---

## 💾 BACKUP AUTOMÁTICO

Um backup CSV de todos os itens é gerado automaticamente todos os dias às **17h (horário de Fortaleza)** e salvo no Cloudinary na pasta `stock-control/backups/` com o nome `backup_YYYY-MM-DD`.

O agendamento é configurado com `node-cron` usando o timezone `America/Fortaleza`, garantindo que o backup seja disparado no horário correto mesmo se o servidor estiver em um fuso diferente.

---

## ⚙️ MIDDLEWARES

### 📅 Restrição por dia da semana (`weekdayMiddleware`)

Bloqueia todas as rotas (exceto `/logar`) de sábado a domingo. Ignorado durante os testes.

### 🕒 Logger de requisições (`loggerMiddleware`)

Registra rota, método HTTP e data/hora de cada requisição no MongoDB.

### 🔐 Autenticação (`authMiddleware`)

Valida o token JWT no cabeçalho `Authorization` ou via query string `?token=`.

---

## ✅ TESTES AUTOMATIZADOS

```bash
npm test
```

```
Test Suites: 4 passed, 4 total
Tests:       30 passed, 30 total
```

---

## 🚧 DIFICULDADES ENCONTRADAS

- 🔐 Implementação de autenticação em dois fatores com código temporário
- 🧠 Criação e encadeamento de middlewares personalizados
- 🕒 Bug de fuso horário nos logs — resolvido com intervalo UTC para Fortaleza
- 💾 Correção do agendamento de backup diário para `America/Fortaleza`
- 📄 Geração dinâmica de relatórios PDF com tabelas e gráficos de barras
- 🔄 Organização do projeto em camadas (controllers, routes, services, middlewares, models)
- ☁️ Integração com serviços externos (MongoDB Atlas, Cloudinary, Resend)
- ⚙️ Controle de acesso por dias da semana sem bloquear o login nem os testes
- 🧪 Separação do `app.js` e `server.js` para viabilizar os testes com Jest
- ⚡ Integração do Socket.io com servidor HTTP para eventos em tempo real
- 🌡️ Comunicação entre ESP32 simulado no Wokwi e servidor Node.js via WebSocket
- 🎬 Implementação de streaming de vídeo com HTTP Range Requests
- 💾 Agendamento de backup automático com node-cron
- 🚀 Deploy e configuração de variáveis de ambiente no Render

---

## 🧠 APRENDIZADOS

- Criação de APIs REST com Node.js e Express
- Modelagem e persistência de dados com MongoDB e Mongoose
- Autenticação com JWT e segundo fator de autenticação por email
- Criptografia de senhas com bcrypt
- Upload e armazenamento de arquivos em nuvem com Cloudinary
- Envio de emails transacionais com Resend
- Comunicação em tempo real com Socket.io e WebSocket
- Integração com hardware virtual via Wokwi e ESP32
- Streaming de vídeo com HTTP Range Requests
- Backup automático agendado com node-cron
- Exportação de dados em CSV
- Geração de relatórios PDF com análise de logs
- Cálculo de distância geográfica com a fórmula de Haversine
- Testes automatizados de APIs com Jest e Supertest
- Deploy de aplicações Node.js com variáveis de ambiente no Render

---

## 🌐 PROJETO ONLINE

<p>
  🔗 <a href="https://stock-control-api-f7em.onrender.com" target="_blank">
    <strong>Acessar projeto online</strong>
  </a>
</p>

---

## 🚀 COMO RODAR LOCALMENTE

**1. Clone o repositório:**

```bash
git clone https://github.com/Iago-Ferreira-Silva/Stock_Control_API.git
cd Stock_Control_API
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Configure as variáveis de ambiente:**

```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

**4. Crie o usuário admin no banco (apenas na primeira vez):**

```bash
node src/scripts/criarAdmin.js
```

**5. Execute em modo desenvolvimento:**

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`

**6. Para rodar os testes:**

```bash
npm test
```

**7. Para testar o stream de vídeo:**

Crie a pasta `videos/` na raiz do projeto e adicione um arquivo `.mp4`:

```bash
mkdir videos
# Coloque um arquivo demo.mp4 dentro da pasta
```

> ⚠️ A pasta `videos/` está no `.gitignore` e não é commitada.

---

## 🔑 VARIÁVEIS DE AMBIENTE

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/stock_control
JWT_SECRET=chave_gerada_com_crypto
ADMIN_EMAIL=seu_email@gmail.com
ADMIN_EMAIL_OLD=email_antigo (usado apenas no script atualizarAdmin)
ADMIN_PASSWORD=sua_senha (usado apenas no script criarAdmin)
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
RESEND_API_KEY=re_sua_chave_aqui
EMAIL_REMETENTE=onboarding@resend.dev
PORT=3000
```

---

## 🔐 SEGURANÇA

- Nenhuma credencial sensível está no código — tudo via `.env`
- O arquivo `.env` está listado no `.gitignore` e não é commitado
- Senhas armazenadas como hash bcrypt, nunca em texto puro
- Token JWT com expiração de 1 hora
- CORS restrito às origens autorizadas

---

## 👤 AUTORES

- [Iago Ferreira Silva](https://github.com/Iago-Ferreira-Silva)
- [Mikael Pereira da Silva](https://github.com/Mikaelpereiradasilva)
- [Jorge Felipe](https://github.com/jorgefelipe2)

---

## 📌 STATUS DO PROJETO

![Badge Concluído](https://img.shields.io/static/v1?label=STATUS&message=CONCLU%C3%8DDO&color=brightgreen&style=for-the-badge)
