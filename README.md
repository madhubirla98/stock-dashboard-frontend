This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



# 📊 Stock Analytics Dashboard – Frontend

This is the **Next.js frontend** of the Stock Analytics Dashboard project. It enables users to securely log in via Firebase Authentication, input multiple stock tickers, select a timeframe or date range, and view interactive charts comparing stock prices. It communicates with a FastAPI backend to fetch historical stock data.

---

## 🚀 Features

- 🔐 Firebase Authentication (Email/Password login & signup)
- 🧠 JWT-based secure communication with backend
- 📈 Dynamic chart for comparing stock closing prices
- ⌛ Select timeframe (1D, 1W, 1M, 3M, 6M, 1Y) or custom dates
- 📱 Fully responsive user interface
- ⚡ Real-time API integration with backend

---

## 🛠️ Tech Stack

- **Next.js** – React framework
- **Firebase** – Authentication
- **Axios** – HTTP client
- **ECharts** – Charting library
- **Tailwind CSS** – Styling and responsiveness

---

## 📦 Installation & Setup

### 1. Clone the Repository


git clone https://github.com/your-username/stock-dashboard-frontend.git
cd stock-dashboard-frontend
2. Install Dependencies

npm install
3. Firebase Setup
Create a project in Firebase Console

Enable Email/Password sign-in method in Authentication

Go to Project Settings → General → Web App → Get Firebase config

Create a .env.local file in the project root:

env

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
4. Start Development Server

npm run dev
App will be running at http://localhost:3000

📁 Project Structure
python

stock-dashboard-frontend/
├── pages/
│   ├── index.tsx        # Redirects to login or dashboard
│   ├── login.tsx        # Login screen
│   ├── signup.tsx       # Signup screen
│   └── dashboard.tsx    # Main dashboard (charts)
├── components/
│   ├── Navbar.tsx       # App header and logout button
│   └── Chart.tsx        # ECharts rendering
├── lib/
│   └── firebase.ts      # Firebase initialization
├── styles/
│   └── globals.css      # Tailwind/global styles
└── .env.local           # Environment variables (Firebase)


🔐 Authentication Flow
Firebase handles user login/signup and issues an ID token (JWT)

Token is stored on the client

Every request to the backend includes this token:

makefile
Copy
Edit
Authorization: Bearer <firebase_id_token>
Backend validates token using Firebase Admin SDK

📊 API Integration
Endpoint: http://localhost:8000/api/stocks

Method: POST

Payload example:

json
Copy
Edit
{
  "tickers": ["AAPL", "GOOGL"],
  "timeframe": "1w",
  "start_date": "2025-05-25",
  "end_date": "2025-06-01"
}
Returns parsed stock data for rendering in chart

📉 Chart Visualization
Powered by Apache ECharts

Multiple stocks displayed on same Y-axis (closing price)

Reacts to ticker/timeframe/date inputs dynamically

Smooth zoom, hover tooltips, and mobile support

✅ Evaluation Checklist
Criteria	Status
Firebase Auth (Login/Signup)	✅
Token-based secure API calls	✅
Dynamic chart rendering	✅
Multiple ticker support	✅
Date & timeframe filters	✅
Responsive & clean UI	✅

🤖 Gen AI Tool Usage
This project was built with active help from ChatGPT, including:
https://chatgpt.com/c/683c57f8-bd64-800a-b09e-b00b266fe6b6
Firebase + Next.js integration strategies

JWT handling and frontend/backend token flow

ECharts setup and configuration

Debugging 405 CORS issues

Code cleanup, component structuring



🧪 To Do / Improvements
🌑 Add dark mode toggle

📂 Save preferred tickers per user (Firestore)

📉 Add volume and moving average overlays

🧾 Error handling and loading states UI

✅ Unit tests for form and auth flow

📄 License
This project is licensed under the MIT License

🙌 Acknowledgments
Next.js

Firebase

Apache ECharts

ChatGPT by OpenAI



