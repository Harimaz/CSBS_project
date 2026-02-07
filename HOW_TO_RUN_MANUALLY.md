# 📖 HOW TO RUN THE APPLICATION MANUALLY

**Complete Step-by-Step Guide**

---

## 🎯 PREREQUISITES

Before running the application, ensure you have:

- ✅ **Node.js** installed (v16 or higher)
- ✅ **MongoDB** installed and running
- ✅ **Git** (optional, for cloning)
- ✅ **Code Editor** (VS Code recommended)

---

---

## 🚀 STANDALONE RUN INSTRUCTIONS (MOCK MODE)

The application has been converted to a **purely frontend standalone application**. You no longer need a backend or MongoDB.

### **Step 1: Start Frontend Server**

**Open PowerShell/Terminal:**
```powershell
cd c:\Users\harir\Downloads\coecsbs-main\coecsbs-main
npm run dev
```

**Expected Output:**
```
➜  Local:   http://localhost:8080/
```

### **Step 2: Open the Application**
Navigate to: `http://localhost:8080`

### **Step 3: Login**
Use any email/password to login (Standlone mode accepts all credentials).


---

## 🔍 VERIFY EVERYTHING IS WORKING

### **Test 1: Backend Health Check**
Open in browser: http://localhost:5000/api/health

**Expected Response:**
```json
{
  "success": true,
  "message": "COE Portal API is running",
  "timestamp": "2025-12-08T..."
}
```

### **Test 2: Frontend Loading**
Open in browser: http://localhost:8080

**Expected:** Landing page with TCE branding loads

### **Test 3: Login Page**
Navigate to: http://localhost:8080/login

**Expected:** Login/Registration form displays

---

## 🛑 HOW TO STOP THE APPLICATION

### **Stop Backend:**
1. Go to Terminal 1 (backend)
2. Press `Ctrl + C`
3. Confirm if asked

### **Stop Frontend:**
1. Go to Terminal 2 (frontend)
2. Press `Ctrl + C`
3. Confirm if asked

### **Stop MongoDB (Optional):**
```powershell
# Run as Administrator
net stop MongoDB
```

---

## 🔄 HOW TO RESTART

### **Quick Restart (if servers are stopped):**

**Terminal 1:**
```powershell
cd c:\Users\harir\Downloads\coecsbs-main\coecsbs-main\backend
npm run dev
```

**Terminal 2:**
```powershell
cd c:\Users\harir\Downloads\coecsbs-main\coecsbs-main
npm run dev
```

---

## 📝 COMMON COMMANDS

### **Backend Commands:**
```powershell
# Navigate to backend
cd c:\Users\harir\Downloads\coecsbs-main\coecsbs-main\backend

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### **Frontend Commands:**
```powershell
# Navigate to project root
cd c:\Users\harir\Downloads\coecsbs-main\coecsbs-main

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🐛 TROUBLESHOOTING

### **Problem: Backend won't start**

**Check MongoDB:**
```powershell
Get-Service -Name MongoDB
```

**Check if port 5000 is in use:**
```powershell
netstat -ano | findstr :5000
```

**Solution:**
- Start MongoDB if stopped
- Kill process using port 5000
- Restart backend

---

### **Problem: Frontend won't start**

**Check if port 8080 is in use:**
```powershell
netstat -ano | findstr :8080
```

**Solution:**
- Kill process using port 8080
- Or change port in vite.config.ts
- Restart frontend

---

### **Problem: White screen or errors**

**Clear browser cache:**
1. Press `Ctrl + Shift + Delete`
2. Clear cached images and files
3. Refresh page (`Ctrl + F5`)

**Check browser console:**
1. Press `F12`
2. Go to Console tab
3. Look for errors
4. Share errors if you need help

---

## 📂 PROJECT STRUCTURE

```
coecsbs-main/
│
├── backend/                    # Backend server
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Backend environment variables
│   ├── config/                # Configuration files
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── controllers/           # Business logic
│   └── middleware/            # Middleware functions
│
├── src/                       # Frontend source code
│   ├── pages/                 # React pages
│   ├── components/            # React components
│   ├── contexts/              # React contexts
│   ├── api/                   # API client
│   └── App.tsx                # Main app component
│
├── package.json               # Frontend dependencies
├── .env                       # Frontend environment variables
└── vite.config.ts             # Vite configuration
```

---

## ✅ QUICK START CHECKLIST

**Before starting:**
- [ ] MongoDB is installed
- [ ] Node.js is installed
- [ ] Project files are downloaded

**To run:**
- [ ] Start MongoDB service
- [ ] Open Terminal 1 → Navigate to backend → Run `npm run dev`
- [ ] Open Terminal 2 → Navigate to project root → Run `npm run dev`
- [ ] Open browser → Go to http://localhost:8080

**To test:**
- [ ] Backend health check: http://localhost:5000/api/health
- [ ] Frontend loads: http://localhost:8080
- [ ] Login page works: http://localhost:8080/login

---

## 🎯 DAILY WORKFLOW

### **Starting Your Day:**
1. Start MongoDB (if not running)
2. Open 2 terminal windows
3. Terminal 1: `cd backend && npm run dev`
4. Terminal 2: `npm run dev`
5. Open http://localhost:8080

### **Ending Your Day:**
1. Press `Ctrl + C` in both terminals
2. Optionally stop MongoDB
3. Close terminals

---

## 🔗 IMPORTANT URLS

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:8080 | Main application |
| Backend API | http://localhost:5000 | API server |
| API Health | http://localhost:5000/api/health | Check API status |
| MongoDB | mongodb://localhost:27017 | Database connection |

---

## 📞 NEED HELP?

**Check these files for more info:**
- `APP_IS_RUNNING.md` - Current status
- `BACKEND_SETUP_COMPLETE.md` - Backend details
- `MONGODB_STATUS.md` - MongoDB setup

**Common Issues:**
1. Port already in use → Kill the process or change port
2. MongoDB not running → Start MongoDB service
3. Dependencies missing → Run `npm install`
4. White screen → Clear cache and refresh

---

## 🎉 YOU'RE READY!

**Follow the steps above and your application will be running!**

**Remember:**
- Keep both terminals open while using the app
- MongoDB must be running
- Use `Ctrl + C` to stop servers

**Happy coding! 🚀**
