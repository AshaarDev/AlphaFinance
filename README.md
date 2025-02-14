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
cd frontend
npm install
```

### 3. Install Backend Dependencies (Node.js)
```bash
cd ../backend
npm install
```

### 4. Install Python Dependencies
```bash
cd ../python-backend
pip install -r requirements.txt

# If requirements.txt is missing:
pip install flask flask-cors pandas scikit-learn yfinance
```

---

## Environment Variables
Create `backend/.env` with:
```ini
PORT=5001
```

---

## Running the Project

### 1. Python Flask Backend
```bash
cd python-backend
python app.py
```

### 2. Node.js Backend
```bash
cd ../backend
npm start
```

### 3. React Frontend
```bash
cd ../frontend
npm run dev
```

**All services should now be running!**
