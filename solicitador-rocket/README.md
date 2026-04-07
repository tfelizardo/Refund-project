# 💸 Refund Project

Um sistema de solicitação de reembolsos desenvolvido com React, TypeScript e AdonisJS para gerenciar despesas de forma simples, rápida e organizada.

👉 https://refund-project-xi.vercel.app/

---

## 🎯 Sobre o Projeto

O **Refund Project** é uma aplicação web fullstack onde o usuário pode cadastrar solicitações de reembolso, informando dados da despesa e anexando comprovantes.

O sistema permite visualizar e organizar os reembolsos enviados, simulando um fluxo real utilizado em empresas.

O projeto foi desenvolvido para praticar integração entre frontend e backend, consumo de API, manipulação de formulários e upload de arquivos.

---

## ✨ Funcionalidades

📄 **Criação de reembolsos**

* Cadastro do nome da solicitação
* Seleção de categoria
* Inserção de valor
* Upload de comprovante (imagem)
* Envio dos dados para a API

📊 **Listagem de reembolsos**

* Exibição automática dos dados cadastrados
* Atualização em tempo real

🏷️ **Categorias de despesas**

* Alimentação
* Hospedagem
* Transporte
* Outros

📎 **Upload de arquivos**

* Envio de imagens como comprovante
* Integração com backend

🚀 **Integração completa**

* Comunicação entre frontend e API
* Requisições HTTP com Axios

---

## 🚀 Tecnologias Utilizadas

### Frontend

* ⚛️ React
* 📘 TypeScript
* ⚡ Vite
* 🎨 CSS

### Backend

* 🟢 Node.js
* 🧩 AdonisJS
* 🗄️ SQLite (desenvolvimento)
* 📦 Render

### Deploy

* ☁️ Vercel (Frontend)

---

## 📁 Estrutura do Projeto

```bash
Refund-project/
├── refund-api/          # Backend (AdonisJS)
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── start/
│   └── ...
│
├── solicitador-rocket/  # Frontend (React)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── api/
│   │   ├── hooks/
│   │   └── ...
│
├── package.json
└── README.md
```

---

## 🎯 Como Funciona

1. Preencha o formulário com:

   * Nome da solicitação
   * Categoria
   * Valor

2. Faça upload do comprovante

3. Clique em **Enviar**

4. O reembolso será salvo e exibido automaticamente na lista

---

## 🧠 Conceitos Aplicados

* Integração frontend + backend
* Consumo de API REST
* Upload de arquivos
* Gerenciamento de estado no React
* Componentização
* Tipagem com TypeScript
* Manipulação de arrays:
  * map
  * filter
* Comunicação entre componentes via props

---

## 🏗️ Arquitetura

O projeto é dividido em duas partes:

### 🔹 Frontend

Responsável pela interface e interação com o usuário:

* Formulário de envio
* Listagem de reembolsos
* Comunicação com a API

### 🔹 Backend

Responsável pelo processamento dos dados:

* Criação de reembolsos
* Upload de arquivos
* Persistência no banco de dados
* Exposição de endpoints REST

---

## 💻 Instalação e Execução

git clone https://github.com/tfelizardo/Refund-project

### 💻 Frontend

```bash
cd solicitador-rocket
npm install
npm run dev
```

---

## 🌐 Projeto Online

👉 https://refund-project-xi.vercel.app/

---

