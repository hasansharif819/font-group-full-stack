# Font Group Management System

![Font Group System](https://img.shields.io/badge/Status-Completed-brightgreen)

---

## Overview

This project is a **one-page Font Group Management System** built with **React.js** for the frontend and **Node.js** for the backend.  
The entire system operates **without page reloads**, providing a seamless user experience for managing fonts and font groups.

---

## Features

- **Upload Fonts**  
  - Upload `.ttf` font files via a clean, buttonless file input.  
  - Supports only TrueType Fonts (TTF).  
  - Automatic preview of uploaded fonts shown in their respective styles.

- **Display Fonts List**  
  - View all uploaded fonts with their names and live style previews.  

- **Create Font Groups**  
  - Dynamically add/remove font selection rows to group multiple fonts.  
  - Validation enforces selecting at least two fonts before creating a group.  
  - Create font groups on the same page without any reloads.

- **Manage Font Groups**  
  - View a list of all created font groups with their fonts displayed.  
  - Edit existing font groups, including changing group names and fonts.  
  - Delete font groups with confirmation prompt.  
  - All CRUD operations happen dynamically, without page refresh.

---

## Technologies Used

| Layer          | Technology                |
| -------------- | -------------------------|
| Frontend       | React.js, Tailwind CSS   |
| Backend        | Node.js (Express) |
| Database       | MongoDB  |
| Others         | Fetch API for async requests, FormData for uploads |

---

## Architecture & Design Principles

- **Single Page Application** - All features integrated on one page for smooth UX.  
- **SOLID Principles** - Code structure follows SOLID design principles for maintainability and scalability.  
- **Separation of Concerns** - Frontend handles UI/UX and backend manages data logic cleanly.  
- **No Page Reloads** - Utilizes asynchronous calls for all interactions.  
- **CSS Framework** - Tailwind CSS provides consistent styling and responsive design.  

---

## Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/hasansharif819/font-group-full-stack.git
   cd font-group-full-stack
   cd backend
   npm install
   npm run dev

   cd frontend
   npm install
   npm run dev


2. Create .env file on backend and then copy the code from .env.example file
3. Use your mongodb uri


