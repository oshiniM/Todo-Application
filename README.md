# ✅ ToDo Application – Full-Stack Productivity App

A full-featured ToDo application with user authentication, CRUD operations for tasks, and task status tracking. Designed to help users manage tasks efficiently with a modern, responsive UI.

## 🚀 Features

- 🔒 **User Authentication** – Register and login.
- ✅ **Task Management** – Create, read, update, and delete tasks.
- 📌 **Task Status Tracking** – Mark tasks as pending or completed.
- 📱 **Responsive UI** – Built with Tailwind CSS for a sleek design.

## 🛠️ Tech Stack 

- **Backend**: ASP.NET Core Web API, Entity Framework, SQL Server
- **Frontend**: React, TypeScript, Tailwind CSS, Axios, React Router
- **APIs**: RESTful endpoints for user and task management

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/oshiniM/Todo-Application.git

# Backend setup
cd todo-app/backend
dotnet restore
dotnet ef database update
dotnet run

# Frontend setup
cd ../frontend
npm install
npm run dev
