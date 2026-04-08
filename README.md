# JobHunt

JobHunt is a full stack AI powered job application tracker built with a TypeScript-first architecture.
It helps users manage their application pipeline in a Kanban-style board, track role details, and stay organized while job searching.
The platform includes secure authentication with access/refresh token flow and cookie-based session handling.
It also supports AI-assisted parsing of raw job descriptions into structured, actionable data.

<img width="1920" height="1080" alt="Screenshot (217)" src="https://github.com/user-attachments/assets/5feded7b-a925-479f-8455-3d56e65705a8" />

<img width="1920" height="1080" alt="Screenshot (214)" src="https://github.com/user-attachments/assets/748785b8-68f3-4b16-b0c4-3400751e4d92" />

<img width="1920" height="1080" alt="Screenshot (215)" src="https://github.com/user-attachments/assets/464081af-5d86-4718-943b-1978eea0a74f" />


🔗 **Live Project Link:** https://jobhunt-board.vercel.app


## Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-1B1B1F?style=for-the-badge&logo=vite&logoColor=646CFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0B1120?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![React Query](https://img.shields.io/badge/TanStack_Query-111827?style=for-the-badge&logo=reactquery&logoColor=FF4154)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-20232A?style=for-the-badge&logo=node.js&logoColor=5FA04E)
![Express](https://img.shields.io/badge/Express-111827?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-0E1E16?style=for-the-badge&logo=mongodb&logoColor=47A248)
![JWT](https://img.shields.io/badge/JWT-1E1E2F?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-1E3A8A?style=for-the-badge&logo=zod&logoColor=white)
![OpenAI API](https://img.shields.io/badge/OpenAI_API-0F172A?style=for-the-badge&logo=openai&logoColor=white)

## How To Run The Project

### 1. Prerequisites

- Node.js 20+
- npm
- MongoDB connection string

### 2. Install Dependencies

Run these commands from the project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create `.env` in both `backend` and `frontend` folders

### Backend (`backend/.env`)

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
OPENAI_API_KEY=your_openrouter_or_openai_key
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:3000
```

### 4. Start Development Servers

Use two terminals:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

### 5. Open The App

- Frontend: http://localhost:5173
- Backend health check: http://localhost:3000/health (or your configured `PORT`)

## Key Engineering Decisions

1. TypeScript across frontend and backend for strong type safety and cleaner refactoring in a growing codebase.
2. JWT access + refresh token strategy, with refresh token stored in httpOnly cookie, to improve session security while maintaining good UX.
3. Axios interceptor queue for token refresh so parallel failed requests are replayed correctly and avoid duplicate refresh calls.
4. Zod-based request validation at controller boundaries to fail fast and return predictable client-facing validation errors.
5. Service-layer abstraction for AI parsing logic to keep controller code thin and make external API integration easier to replace/test.
6. Explicit CORS + credential configuration to support secure cookie auth between separate frontend and backend origins.

## Available Scripts

### Backend

- `npm run dev` - Start backend in watch mode with `.env`
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled backend

### Frontend

- `npm run dev` - Start Vite dev server
- `npm run build` - Type-check and build production bundle
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
