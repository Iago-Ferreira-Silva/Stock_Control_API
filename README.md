# 📦 Stock Control API

<p align="center">
  API REST desenvolvida para <strong>gerenciamento de estoque de produtos</strong>, com autenticação JWT, middlewares personalizados e geração de relatórios em PDF.<br/>
  Desenvolvida com <code>Node.js</code>, <code>Express</code> e <code>JavaScript</code>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
  <img src="https://img.shields.io/badge/PDFKit-FF0000?style=for-the-badge"/>
</p>

---

## ✨ FUNCIONALIDADES

* 🔐 Autenticação com geração de token JWT (padrão Bearer)
* 📦 Listagem de produtos
* ➕ Cadastro de novos produtos com validação de dados
* ❌ Remoção de produtos
* 🔍 Busca de produto por ID
* 📅 Middleware que restringe acesso de segunda a sexta
* 🕒 Registro automático de logs de requisições
* 📊 Consulta de logs por data com validação de formato
* 📄 Geração de relatório em PDF formatado com lista de produtos
* ⚡ API leve com dados mockados em memória

---

## 📁 ESTRUTURA DE PASTAS

```bash
stock-control-api/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── itemController.js
│   │   └── logController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── weekdayMiddleware.js
│   │   └── loggerMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   └── logRoutes.js
│   ├── services/
│   │   └── pdfService.js
│   ├── data/
│   │   ├── items.js
│   │   └── logs.js
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ TECNOLOGIAS UTILIZADAS

* `Node.js` — Ambiente de execução JavaScript no servidor
* `Express` — Framework para construção da API REST
* `jsonwebtoken` — Geração e validação de tokens JWT
* `PDFKit` — Geração de arquivos PDF em memória
* `cors` — Permite que frontends externos acessem a API
* `Nodemon` — Reinicia automaticamente o servidor em desenvolvimento

---

## 🔐 AUTENTICAÇÃO E SEGURANÇA

* Rota de login com validação de campos obrigatórios
* Geração de token JWT com validade de 1 hora
* Middleware de autenticação com suporte ao padrão `Bearer <token>`
* Mensagens de erro distintas para token expirado vs. token inválido
* JWT_SECRET configurável via variável de ambiente (`.env`)
* Controle de acesso por dias da semana (segunda a sexta)
* Registro de logs de todas as requisições recebidas

---

## 📦 ROTAS DA API

### 🔹 Autenticação — pública

```
POST /logar
```

**Body:**
```json
{
  "email": "admin@email.com",
  "senha": "123456"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 🔹 Produtos — protegidas (requer `Authorization: Bearer <token>`)

```
GET    /itens
POST   /itens
GET    /itens/:id
DELETE /itens/:id
```

**Body para POST:**
```json
{
  "nome": "Monitor",
  "preco": 899.90
}
```

---

### 🔹 Logs — protegida

```
GET /logs?data=YYYY-MM-DD
```

---

### 🔹 Relatório — protegida

```
GET /relatorio/pdf
```

---

## ⚙️ MIDDLEWARES

### 📅 Restrição por dia da semana (`weekdayMiddleware`)
Bloqueia todas as rotas (exceto `/logar`) de sábado a domingo com status `403`.

### 🕒 Logger de requisições (`loggerMiddleware`)
Registra rota, método HTTP e data/hora de cada requisição recebida.

### 🔐 Autenticação (`authMiddleware`)
Valida o token JWT no cabeçalho `Authorization` antes de liberar o acesso às rotas protegidas.

---

## 💾 DADOS

Todos os dados são mockados em memória (arrays JavaScript), sem banco de dados. Os dados voltam ao estado inicial quando o servidor é reiniciado.

---

## 🚧 DIFICULDADES ENCONTRADAS

* 🔐 Implementação de autenticação JWT sem banco de dados
* 🧠 Criação e encadeamento de middlewares personalizados
* 🕒 Registro e filtragem de logs em memória
* 📄 Geração dinâmica de arquivos PDF com formatação monetária
* 🔄 Organização em camadas (controllers, routes, services, middlewares)
* ⚙️ Controle de acesso por dias da semana sem bloquear o login
* 🚀 Deploy da aplicação na nuvem via Render

---

## 🧠 APRENDIZADOS

* Criação de APIs REST com Node.js e Express
* Implementação e encadeamento de middlewares
* Autenticação baseada em token JWT com padrão Bearer
* Manipulação de dados em memória
* Estruturação de projetos backend em camadas
* Geração de arquivos PDF dinamicamente
* Deploy de aplicações Node.js

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
# Edite o .env e defina o JWT_SECRET
```

**4. Execute em modo desenvolvimento:**
```bash
npm run dev
```

A API estará disponível em:
```
http://localhost:3000
```

---

## 🔐 SEGURANÇA

* Nenhuma credencial sensível está no código — use `.env` para o `JWT_SECRET`
* O arquivo `.env` está listado no `.gitignore` e não deve ser commitado
* Dados são totalmente mockados — sistema de autenticação para fins acadêmicos

---

## 👤 AUTORES

- [Iago Ferreira Silva](https://github.com/Iago-Ferreira-Silva)
- [Mikael Pereira da Silva](https://github.com/Mikaelpereiradasilva)
- [Jorge Felipe](https://github.com/jorgefelipe2)

---

## 📌 STATUS DO PROJETO

![Badge Concluído](https://img.shields.io/static/v1?label=STATUS&message=CONCLU%C3%8DDO&color=brightgreen&style=for-the-badge)