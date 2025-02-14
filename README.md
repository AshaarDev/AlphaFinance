# AlphaFinance Installation Guide

This guide will walk you through the steps to set up and run the AlphaFinance project on your local machine.

---

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/your-repository/AlphaFinance.git
cd AlphaFinance
```

### 2. Install Frontend Dependencies
```bash
cd src
npm install
```

### 3. Install Backend Dependencies (Node.js)
```bash
cd /src/backend-files/node-backend/
npm install
```

### 4. Install Python Dependencies
```bash
cd /src/backend-files/python-backend
pip install flask flask-cors pandas scikit-learn yfinance
```

---

## Environment Variables
Create `backend/.env` with:
```ini
ALPHA_VANTAGE_API_KEY=YOUR-ALPHA-VANTAGE-KEY
PORT=YOUR-PORT
GOOGLE_CLIENT_ID=YOUR-GOOGLE-CLIENT-ID
GOOGLE_CLIENT_SECRET=YOUR-GOOGLE-CLIENT-SECERET
JWT_SECRET=your-jwt-secret
```

---

## API & Service Setup

### 1. Alpha Vantage API Key
1. Go to [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free API key
3. Replace `YOUR-ALPHA-VANTAGE-KEY` with your actual key

### 2. Google OAuth Credentials
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Google Sign-In" API
4. Under "Credentials", create an OAuth Client ID
5. Choose "Web Application" type
6. Add authorized redirect URIs (e.g., `http://localhost:5001/auth/google/callback`)
7. Copy the Client ID and Client Secret into your `.env` file

### 3. JWT Secret Key
You can generate a JWT secret using Node.js. Run the following command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the generated secret and add it to `JWT_SECRET` in your `.env` file.

---

## Running the Project

### 1. Python Flask Backend
```bash
cd /src/backend-files/python-backend
python app.py
```

### 2. Node.js Backend
```bash
cd /src/backend-files/node-backend/
npm start
```

### 3. React Frontend
```bash
cd /src
npm run dev
```

**All services should now be running!**
