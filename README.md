# CrowdSpark
<<<<<<< HEAD
CrowdSpark is a dynamic, full-stack crowdfunding platform built using the MERN stack
=======

CrowdSpark is a modern, full-stack crowdfunding platform inspired by the best of social and fundraising apps. It enables users to create, discover, and fund impactful campaigns with a beautiful, premium UI and robust backend.

---

## 🚀 Features

- **Modern, Instagram-like UI:**
  - Stories bar, feed with posts, avatars, and floating action button
  - Responsive, premium design using Tailwind CSS, shadcn/ui, and Radix UI
  - Left-aligned, visually appealing cards and forms
- **Campaign Management:**
  - Create, view, and fund campaigns
  - Live fund tracker with real-time updates (Socket.IO)
  - Campaign discovery with search, trending, and filters
- **User Authentication & Roles:**
  - Register, login, JWT-based authentication
  - Role-based dashboards (user, admin)
- **Admin Panel:**
  - Moderate campaigns, view analytics, manage users
- **Notifications:**
  - Real-time notifications for funding, comments, and admin actions
- **Payments (Demo-ready):**
  - Stripe and Razorpay integration endpoints (can be enabled/disabled for demo)
- **Comments & Social Features:**
  - Like, comment, and share on campaigns
  - Add/view comments per post
- **Demo Data & Seeding:**
  - Seed script to populate the database with sample users, campaigns, and notifications for a lively demo

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, shadcn/ui, Radix UI, lucide-react
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Socket.IO
- **Payments:** Stripe, Razorpay (optional, can be disabled for demo)
- **Other:** JWT, bcryptjs, dotenv, CORS

---

## 📦 Project Structure

```
crowdspark/
  api/                # Express backend (models, routes, seed, server)
  CrowdFundNexus/     # Modern React frontend (Vite, shadcn/ui, etc.)
  src/                # Legacy/simple React frontend (for reference)
  public/             # Static assets
```

---

## ⚡ Getting Started

### 1. **Clone the repo**
```bash
git clone <repo-url>
cd crowdspark
```

### 2. **Install dependencies**
- Backend:
  ```bash
  cd api
  npm install
  ```
- Frontend:
  ```bash
  cd ../CrowdFundNexus
  npm install
  ```

### 3. **Environment Variables**
- Copy `.env.example` to `.env` in `api/` and fill in MongoDB URI, JWT secret, and (optionally) Stripe/Razorpay keys.
- For demo, you can leave payment keys blank or comment out payment code.

### 4. **Seed the Database**
- Populate with demo users, campaigns, and notifications:
  ```bash
  cd api
  node seed.js
  ```

### 5. **Run the Backend**
```bash
cd api
npm start
# or
npx nodemon server.js
```

### 6. **Run the Frontend**
```bash
cd CrowdFundNexus
npm run dev
```

---

## 🌱 Seeding & Demo Data
- The `api/seed.js` script creates sample users (with roles), campaigns, and notifications.
- This ensures the app looks lively and demo-ready out of the box.
- You can customize or extend the seed data as needed.

---

## 🖼️ UI/UX Highlights
- Modern, Instagram-inspired feed with stories, posts, and floating action button
- Uniform, premium forms and buttons across the app
- Responsive layouts for desktop and mobile
- Real-time updates and notifications

---

## 🔒 Authentication & Roles
- JWT-based authentication for secure API access
- Role-based access control for user/admin dashboards and endpoints
- Demo mode: authentication can be relaxed for easy testing

---

## 💳 Payments (Optional)
- Stripe and Razorpay endpoints are included but can be disabled for demo
- To enable, add your API keys to `.env` and uncomment payment code in backend

---

## 🛡️ Security & Best Practices
- Environment variables for secrets
- CORS enabled
- Passwords hashed with bcryptjs
- Modular, maintainable codebase

---

## 🤝 Contributing
Pull requests and suggestions are welcome! For major changes, please open an issue first.

---

## 📄 License
[MIT](LICENSE)
>>>>>>> b242561 (Initial push of full project)
