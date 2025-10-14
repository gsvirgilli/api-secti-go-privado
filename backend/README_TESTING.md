# 💻 SUKATECH - Execução Local do Sistema

Sistema de controle e gestão de cursos do Programa **SUKATECH**, com módulos de **Frontend (React)** e **Backend (Node + MySQL)**.

---

## ⚡ Como Executar o Projeto Localmente

### ✅ 1. Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- 🐳 **Docker e Docker Compose**  
  [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

- 🟢 **Node.js (v18 ou superior)**  
  [Download Node.js](https://nodejs.org/)

- 📦 **npm** (já vem com o Node)

- 💻 **Git**  
  [Download Git](https://git-scm.com/downloads)


---

### ▶️ 2. Clonar o Repositório

Abra o terminal e execute:

```bash
git clone https://github.com/Residencia-em-TIC-Turma-1/G07-SECTI.git
cd G07-SECTI
```
### 🐳 3. Executar via Docker (modo mais fácil)
Com o Docker Desktop aberto, rode o comando:

```bash
docker-compose up --build
```
Isso vai:

Criar e subir os containers do backend, frontend e MySQL

  Configurar automaticamente as portas:

  - 🌐 Frontend → http://localhost:8080

  - ⚙️ Backend → http://localhost:3333

  - 🗄️ Banco de Dados → localhost:3306

Após o build, o sistema estará rodando automaticamente.
Você poderá acessar o painel web no navegador. ✅

### 🧩 4. Testar a API Manualmente (opcional)
Para confirmar se o backend está online:

```bash
curl http://localhost:3333/api/health
```
Resposta esperada:

```bash
{
  "status": "ok",
  "message": "SUKATECH API is running!"
}
```
### 🖥️ 5. Executar o Frontend Separadamente (caso queira)
Se quiser rodar apenas o frontend, vá até a pasta e execute:

```bash
cd frontend
npm install
npm run dev
```
Depois acesse:
👉 [http://localhost:8080](http://localhost:8080)

## 🧪 Testes Rápidos
Se quiser verificar se tudo está funcionando corretamente:

- ✅ Verifique o banco MySQL subindo no Docker (container mysql_sukatech)

- ✅ Acesse o navegador e abra o endereço do frontend

- ✅ Se a tela inicial do SUKATECH aparecer, a instalação foi concluída 

## 📦 **Download do Sistema Completo**

Se preferir baixar o sistema completo (frontend + backend + banco de dados) como arquivo `.zip`, acesse o link abaixo:

👉 [Baixar SUKATECH Completo (Google Drive)][(https://drive.google.com/....](https://drive.google.com/file/d/1ZE6Kp3OJFqf_WPCPiqNxkpCwLx2BrL6e/view?usp=sharing)

## 📚 Dicas Úteis
Se algo travar, use Ctrl + C para parar e rode novamente:

```bash
docker-compose up --build
```
Para limpar containers e reconstruir tudo:

```bash
docker-compose down -v
docker-compose up --build
```
As alterações no código do frontend e backend são aplicadas automaticamente (modo hot reload)

## ✨ Pronto!
Seu ambiente SUKATECH estará rodando localmente com todos os módulos integrados 🚀
