# 🎾 Ace - Beach Tennis Platform

Sistema de gerenciamento para beach tennis com cadastro de jogadores, torneios e rankings.

## 🛠️ Tecnologias

- **Backend:** .NET 10.0 + SQLite + JWT
- **Frontend:** React + Vite

## 🚀 Como rodar o projeto

### Backend

```bash
cd BackEnd
cp appsettings.Development.example.json appsettings.Development.json
```

Edite `appsettings.Development.json` e preencha:
- **Jwt:Key** - Gere com: `openssl rand -base64 64`
- **EmailSettings:SmtpPass** - Senha do e-mail

```bash
dotnet restore
dotnet run
```

API disponível em: `https://localhost:7000`

### Frontend

```bash
cd FrontEnd
npm install
npm run dev
```

Frontend disponível em: `http://localhost:5173`

## 📝 Configurações necessárias

- Gerar chave JWT: `openssl rand -base64 64`
- Configurar senha do e-mail Hostinger no `appsettings.Development.json`

## 📄 Licença

Este projeto é privado.