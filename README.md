# Kanban-UI
Kanban FrontEnd code

React + Vite + TypeScript frontend for the Kanban Task Board assignment.

## Features

- View tasks grouped by status
- Add new task
- Edit task
- Delete task
- Drag and drop tasks between To Do, In Progress and Done
- API integration with ASP.NET Core backend

Install dependencies:

```bash
npm install
```

Create an environment file:
```bash
cp .env.example .env
```

Update `.env` if your backend runs on a different port:

```txt
VITE_API_BASE_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev

Open:

```txt
http://localhost:5173
```

## Build

```bash
npm run build