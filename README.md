Eu quero que você pegue o seguinte README e adapte para esse README:

# 📦 Stock Control API

<p align="center">
  API REST desenvolvida para <strong>gerenciamento de estoque de produtos</strong>, com autenticação, middlewares personalizados e geração de relatórios em PDF.<br/>
  Desenvolvida com <code>Node.js</code>, <code>Express</code> e <code>JavaScript</code>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/PDFKit-FF0000?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/UUID-000000?style=for-the-badge"/>
</p>

---

## ✨ FUNCIONALIDADES

* 🔐 Autenticação de usuário com geração de token
* 📦 Listagem de produtos
* ➕ Cadastro de novos produtos
* ❌ Remoção de produtos
* 🔍 Busca de produto por código
* 📅 Middleware que restringe acesso de segunda a sexta
* 🕒 Registro automático de logs de requisições
* 📊 Consulta de logs por data
* 📄 Geração de relatório em PDF com lista de produtos
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
├── package.json
├── .gitignore
└── README.md
```

---

## 🛠️ PRINCIPAIS TECNOLOGIAS UTILIZADAS

* `Node.js` — Ambiente de execução JavaScript
* `Express` — Framework para construção da API
* `UUID` — Geração de identificadores únicos
* `PDFKit` — Geração de arquivos PDF
* `Nodemon` — Atualização automática no desenvolvimento
* `JavaScript` — Linguagem principal

---

## 🔐 AUTENTICAÇÃO E SEGURANÇA

* Rota de login com validação de usuário mockado
* Geração de token para acesso às rotas protegidas
* Middleware de autenticação para proteger endpoints
* Controle de acesso por dias da semana (segunda a sexta)
* Registro de logs de todas as requisições realizadas

---

## 📦 ROTAS DA API

### 🔹 Autenticação

```bash
POST /logar
```

**Exemplo:**

```json
{
  "email": "admin@email.com",
  "senha": "123456"
}
```

---

### 🔹 Produtos

```bash
GET /itens
POST /itens
GET /itens/:id
DELETE /itens/:id
```

---

### 🔹 Logs

```bash
GET /logs?data=YYYY-MM-DD
```

---

### 🔹 Relatório

```bash
GET /relatorio/pdf
```

---

## ⚙️ MIDDLEWARES

### 📅 Restrição por dia da semana

* Permite acesso apenas de segunda a sexta-feira

### 🕒 Logger de requisições

* Registra rota acessada
* Registra data e horário da requisição

### 🔐 Autenticação

* Valida token antes de acessar rotas protegidas

---

## 💾 DADOS

Todos os dados são mockados utilizando arrays no próprio código, sem uso de banco de dados.

---

## 🚧 DIFICULDADES ENCONTRADAS

Durante o desenvolvimento, alguns desafios contribuíram para o aprendizado:

* 🔐 Implementação de autenticação sem banco de dados
* 🧠 Criação de middlewares personalizados
* 🕒 Registro e armazenamento de logs em memória
* 📄 Geração dinâmica de arquivos PDF
* 🔄 Organização do projeto em camadas (controllers, routes, services)
* ⚙️ Controle de acesso baseado em dias da semana
* 🚀 Preparação da aplicação para deploy em nuvem

---

## 🧠 APRENDIZADOS

* Criação de APIs REST com Node.js e Express
* Implementação de middlewares
* Autenticação baseada em token
* Manipulação de dados em memória
* Estruturação de projetos backend
* Geração de arquivos PDF
* Deploy de aplicações backend

---

## 🌐 PROJETO ONLINE

<p>
  🔗 <a href="https://stock-control-api-f7em.onrender.com" target="_blank">
    <strong>Acessar API online</strong>
  </a>
</p>

---

## 🚀 COMO RODAR LOCALMENTE

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/stock-control-api.git
cd stock-control-api
```

2. Instale as dependências:

```bash
npm install
```

3. Execute o projeto:

```bash
npm run dev
```

A API estará disponível em:

```bash
http://localhost:3000
```

---

## 🔐 SEGURANÇA

* Nenhuma credencial sensível é utilizada
* Dados são totalmente mockados
* Sistema de autenticação apenas para fins acadêmicos

---

## 👤 AUTORES

- [Iago Ferreira Silva](https://github.com/Iago-Ferreira-Silva)
- [Mikael Pereira da Silva](https://github.com/Mikaelpereiradasilva)
- [Jorge Felipe](https://github.com/jorgefelipe2)

---

## 📌 STATUS DO PROJETO:
![Badge Concluído](https://img.shields.io/static/v1?label=STATUS&message=CONCLU%C3%8DDO&color=brightgreen&style=for-the-badge)

***