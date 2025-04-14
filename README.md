# BarberX - Backend (API RESTful) 🛠️

Este repositório contém o backend do BarberX, responsável por gerenciar os dados, autenticação de administradores e lógica de agendamentos da aplicação.

## ✨ Funcionalidades da API

### Cliente

- `POST /agendamentos` → Criar um novo agendamento
- `GET /horario-disponivel?date=YYYY-MM-DD` → Listar horários disponíveis

### Administrador

- `POST /cadastro` → Cadastrar novo admin
- `POST /login` → Login do admin
- `POST /horarios` → Criar horários para datas específicas
- `GET /agendamentos` → Listar todos os agendamentos
- `DELETE /deletar-horario` → Cancelar horário
- `PATCH /agendamento/:id/atendido` → Marcar agendamento como atendido
- `GET /agendamentos-atendidos` → Listar agendamentos concluídos

## 🧠 Regras de Negócio

- Agendamentos não podem ser no passado
- Cada serviço dura 1h
- Não permitir dois agendamentos com o mesmo email no mesmo horário
- Apenas admins autenticados podem acessar o painel

## 🛠️ Tecnologias Utilizadas

- Node.js + Express
- MongoDB (NoSQL)
- JWT para autenticação
- Controllers e middlewares personalizados

## 📦 Estrutura

- `controllers/` → Lógica de negócio
- `routes/` → Rotas da API
- `middlewares/` → Autenticação e validações
- `models/` → Modelos do MongoDB
- `config/` → Configurações do banco e variáveis de ambiente

---

> Requisitos: Node.js, MongoDB e variáveis de ambiente `.env` com a URI do banco e chave JWT.

### Screenshot fluxograma:

![screenshot](/src/assets/fluxogramaBackend.png)
