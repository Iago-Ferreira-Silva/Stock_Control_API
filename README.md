# 📦 Stock Control API

<p align="center">
  API REST desenvolvida para <strong>gerenciamento de estoque de produtos</strong>, com autenticação JWT, segundo fator de autenticação por email, upload de imagens em nuvem, cálculo de distância geográfica e geração de relatórios em PDF.<br/>
  Desenvolvida com <code>Node.js</code>, <code>Express</code> e <code>JavaScript</code>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white"/>
  <img src="https://img.shields.io/badge/Resend-000000?style=for-the-badge&logoColor=white"/>
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white"/>
  <img src="https://img.shields.io/badge/PDFKit-FF0000?style=for-the-badge"/>
</p>

---

## ✨ FUNCIONALIDADES

* 🔐 Autenticação com geração de token JWT (padrão Bearer)
* 📧 Segundo fator de autenticação (2FA) com código enviado por email via Resend
* 🔒 Senhas criptografadas no banco com bcrypt
* 📦 Listagem de produtos com filtro por nome e faixa de preço
* ➕ Cadastro de um ou vários produtos simultaneamente
* ✏️ Atualização de produtos via rota PUT
* ❌ Remoção de produtos
* 🔍 Busca de produto por ID
* 🖼️ Upload de imagem para o Cloudinary vinculada ao produto
* 📅 Middleware que restringe acesso de segunda a sexta
* 🕒 Registro automático de logs de requisições no MongoDB
* 📊 Consulta de logs por data com validação de formato
* 📍 Cálculo de distância entre dois pontos geográficos pela fórmula de Haversine
* 📄 Geração de relatório em PDF com lista de produtos do banco
* ✅ Testes automatizados com Jest e Supertest para todas as rotas

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
│   │   ├── itemController.js
│   │   └── logController.js
│   ├── database/
│   │   └── conexao.js
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
│   │   ├── itemRoutes.js
│   │   └── logRoutes.js
│   ├── scripts/
│   │   ├── criarAdmin.js
│   │   └── atualizarAdmin.js
│   ├── services/
│   │   ├── emailService.js
│   │   └── pdfService.js
│   ├── app.js
│   └── server.js
├── tests/
│   ├── auth.test.js
│   ├── distancia.test.js
│   ├── items.test.js
│   ├── logs.test.js
│   └── setup.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ TECNOLOGIAS UTILIZADAS

* `Node.js` — Ambiente de execução JavaScript no servidor
* `Express` — Framework para construção da API REST
* `MongoDB + Mongoose` — Banco de dados em nuvem e ODM
* `bcrypt` — Criptografia de senhas
* `jsonwebtoken` — Geração e validação de tokens JWT
* `Resend` — Envio de emails para o segundo fator de autenticação
* `Cloudinary + Multer` — Upload e armazenamento de imagens em nuvem
* `PDFKit` — Geração de arquivos PDF em memória
* `cors` — Controle de origens permitidas
* `Jest + Supertest` — Testes automatizados das rotas
* `Nodemon` — Reinicia automaticamente o servidor em desenvolvimento

---

## 🔐 AUTENTICAÇÃO E SEGURANÇA

* Login em dois passos com segundo fator de autenticação por email (2FA)
* Código de verificação com validade de 10 minutos, descartado após o uso
* Senhas armazenadas como hash bcrypt (salt rounds: 10)
* Token JWT com validade de 1 hora no padrão `Bearer <token>`
* Mensagens de erro distintas para token expirado vs. token inválido
* `JWT_SECRET` configurável via variável de ambiente
* CORS configurado para permitir apenas origens autorizadas
* Acesso bloqueado aos finais de semana pelo `weekdayMiddleware`
* Logs de todas as requisições persistidos no MongoDB

---

## 📦 ROTAS DA API

### 🔹 Autenticação — pública

**Passo 1 — Enviar credenciais:**
```
POST /logar
```
```json
{
  "email": "admin@email.com",
  "senha": "123456"
}
```
Resposta:
```json
{ "mensagem": "Código de verificação enviado para o seu email" }
```

**Passo 2 — Verificar código recebido por email:**
```
POST /logar/verificar
```
```json
{
  "email": "admin@email.com",
  "codigo": "472831"
}
```
Resposta:
```json
{ "token": "eyJhbGciOiJIUzI1NiIs..." }
```

---

### 🔹 Produtos — protegidas (requer `Authorization: Bearer <token>`)

```
GET    /itens                    → lista todos (aceita ?nome= e ?precoMin= ?precoMax=)
POST   /itens                    → cria um ou vários itens
GET    /itens/:id                → busca por ID
PUT    /itens/:id                → atualiza nome e/ou preço
DELETE /itens/:id                → remove item
POST   /itens/:id/imagem         → upload de imagem (form-data, campo: imagem)
```

**Body para POST (item único):**
```json
{ "nome": "Monitor", "preco": 899.90 }
```

**Body para POST (vários itens):**
```json
[
  { "nome": "Teclado", "preco": 150 },
  { "nome": "Mouse", "preco": 80 }
]
```

**Body para PUT (campos opcionais):**
```json
{ "nome": "Monitor Ultrawide", "preco": 1299.90 }
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

**Exemplo — Crato para Fortaleza:**
```
GET /distancia?lat1=-7.2306&lon1=-39.3167&lat2=-3.7172&lon2=-38.5431
```

Resposta:
```json
{
  "pontoA": { "latitude": -7.2306, "longitude": -39.3167 },
  "pontoB": { "latitude": -3.7172, "longitude": -38.5431 },
  "distancia": { "km": 399.94, "metros": 399943 }
}
```

---

### 🔹 Relatório — protegida

```
GET /relatorio/pdf
```

---

## ⚙️ MIDDLEWARES

### 📅 Restrição por dia da semana (`weekdayMiddleware`)
Bloqueia todas as rotas (exceto `/logar`) de sábado a domingo com status `403`. Ignorado automaticamente durante os testes.

### 🕒 Logger de requisições (`loggerMiddleware`)
Registra rota, método HTTP e data/hora de cada requisição no MongoDB.

### 🔐 Autenticação (`authMiddleware`)
Valida o token JWT no cabeçalho `Authorization` antes de liberar o acesso às rotas protegidas.

---

## ✅ TESTES AUTOMATIZADOS

O projeto conta com testes automatizados usando **Jest** e **Supertest**, cobrindo todas as rotas da API.

Para rodar os testes:
```bash
npm test
```

Resultado esperado:
```
Test Suites: 4 passed, 4 total
Tests:       30 passed, 30 total
```

Os testes de itens criam documentos com prefixo `TESTE_JEST` e os removem após cada teste. O envio de email do 2FA é mockado — nenhum email real é disparado durante os testes.

---

## 🚧 DIFICULDADES ENCONTRADAS

* 🔐 Implementação de autenticação em dois fatores com código temporário
* 🧠 Criação e encadeamento de middlewares personalizados
* 🕒 Registro e filtragem de logs por fuso horário no MongoDB
* 📄 Geração dinâmica de arquivos PDF com formatação monetária
* 🔄 Organização do projeto em camadas (controllers, routes, services, middlewares, models)
* ☁️ Integração com serviços externos (MongoDB Atlas, Cloudinary, Resend)
* ⚙️ Controle de acesso por dias da semana sem bloquear o login nem os testes
* 🧪 Separação do `app.js` e `server.js` para viabilizar os testes com Jest
* 🚀 Deploy e configuração de variáveis de ambiente no Render

---

## 🧠 APRENDIZADOS

* Criação de APIs REST com Node.js e Express
* Modelagem e persistência de dados com MongoDB e Mongoose
* Autenticação com JWT e segundo fator de autenticação por email
* Criptografia de senhas com bcrypt
* Upload e armazenamento de imagens em nuvem com Cloudinary
* Envio de emails transacionais com Resend
* Cálculo de distância geográfica com a fórmula de Haversine
* Implementação e encadeamento de middlewares
* Configuração de CORS para controle de origens
* Testes automatizados de APIs com Jest e Supertest
* Estruturação de projetos backend em camadas
* Deploy de aplicações Node.js com variáveis de ambiente no Render

---

## 🌐 PROJETO ONLINE

<p>
  🔗 <a href="https://stock-control-api-f7em.onrender.com" target="_blank">
    <strong>Acessar API online</strong>
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

A API estará disponível em:
```
http://localhost:3000
```

**6. Para rodar os testes:**
```bash
npm test
```

---

## 🔑 VARIÁVEIS DE AMBIENTE

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/stock_control
JWT_SECRET=chave_gerada_com_crypto
ADMIN_EMAIL=seu_email@gmail.com        # email atual do admin
ADMIN_EMAIL_OLD=email_antigo_aqui      # usado apenas no script atualizarAdmin.js
ADMIN_PASSWORD=sua_senha_aqui          # usado apenas no script criarAdmin.js
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
RESEND_API_KEY=re_sua_chave_aqui
EMAIL_REMETENTE=onboarding@resend.dev
PORT=3000
```

---

## 🔐 SEGURANÇA

* Nenhuma credencial sensível está no código — tudo via `.env`
* O arquivo `.env` está listado no `.gitignore` e não é commitado
* Senhas armazenadas como hash bcrypt, nunca em texto puro
* Token JWT com expiração de 1 hora
* CORS restrito às origens autorizadas

---

## 👤 AUTORES

- [Iago Ferreira Silva](https://github.com/Iago-Ferreira-Silva)
- [Mikael Pereira da Silva](https://github.com/Mikaelpereiradasilva)
- [Jorge Felipe](https://github.com/jorgefelipe2)

---

## 📌 STATUS DO PROJETO

![Badge Concluído](https://img.shields.io/static/v1?label=STATUS&message=CONCLU%C3%8DDO&color=brightgreen&style=for-the-badge)