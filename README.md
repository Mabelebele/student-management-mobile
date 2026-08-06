# student-management-mobile

Mobile-first React app for managing students. Connects to the `student-management-api` Spring Boot backend.

## Stack
- React 18 + TypeScript
- React Router v6
- Vite (dev server with API proxy to `http://localhost:8080`)
- CSS Modules (no UI framework dependency)

## Features
- List all students with live search (name, email, major)
- View student detail
- Create / Edit student with validation
- Delete student with confirmation

## Getting started

```bash
npm install
npm run dev        # starts on http://localhost:3000
```

Make sure `student-management-api` is running on port 8080 first.

## Build for production

```bash
npm run build
npm run preview
```
React Native mobile application for the Student Management System.
