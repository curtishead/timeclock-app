# Time Clock App - Deployment Checklist

## ✅ STEP-BY-STEP COPY-PASTE GUIDE

This document has everything you need. Follow the steps exactly.

---

## PHASE 1: SUPABASE SETUP (5 minutes)

### 1️⃣ Create Supabase Account & Project

**Task**: Create database in the cloud

1. Open [supabase.com](https://supabase.com)
2. Click "Sign In" at top right
3. Click "Continue with GitHub" 
4. Click "Authorize Supabase" (if prompted)
5. Click "New Project"
6. Fill in:
   - **Name**: `timeclock`
   - **Database Password**: Create something like `MyTimeClock2024!` (Save this!)
   - **Region**: Pick one (doesn't matter much for your scale)
7. Click "Create new project"
8. **Wait 2-3 minutes** for initialization

✅ **When you see the project dashboard, continue**

---

### 2️⃣ Copy Your API Keys

**Task**: Get credentials your app needs

1. In Supabase, click **Settings** (left sidebar, bottom)
2. Click **API** in the menu
3. You'll see keys under "PROJECT SETTINGS"

**Copy these 3 things:**

```
SUPABASE_URL: https://xxxxx.supabase.co
SUPABASE_ANON_KEY: eyxxx...
SUPABASE_SERVICE_ROLE_KEY: eyxxx...
```

(Paste them somewhere - you need them in 10 minutes)

✅ **Keys copied**

---

### 3️⃣ Set Up Database Tables

**Task**: Create the database structure

1. In Supabase, click **SQL Editor** (left sidebar)
2. Click **"New Query"** button
3. **Copy** the entire contents of the file `DATABASE_SETUP.sql` from your project folder
4. **Paste** it into the SQL editor
5. Click **"Run"** (or Ctrl+Enter)
6. Wait for ✅ "Success!"

✅ **Database tables created**

---

### 4️⃣ Create Storage Bucket

**Task**: Set up storage for employee photos

1. In Supabase, click **Storage** (left sidebar)
2. Click **"New Bucket"**
3. Name it: `time-clock-photos`
4. **Uncheck** "Make it private"
5. Click **"Create Bucket"**

✅ **Storage ready**

---

## PHASE 2: LOCAL TESTING (10 minutes)

### 5️⃣ Create Your `.env` File

**Task**: Add your Supabase keys to your app

1. Go to your `timeclock-app` folder on your computer
2. Look for the file `.env.example` 
3. **Duplicate** it and rename to `.env` (just `.env`, no extension)
4. **Open `.env`** in a text editor
5. **Replace** these values with your actual keys from step 2️⃣:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyxxx...
SUPABASE_SERVICE_ROLE_KEY=eyxxx...
JWT_SECRET=super-secret-key-123
ADMIN_SETUP_KEY=setup123
PORT=3001
```

6. **Save** the file

✅ **.env file created**

---

### 6️⃣ Install Dependencies

**Task**: Download all the code libraries

**Open Command Prompt or Terminal**

1. Navigate to your project:
   ```
   cd path/to/timeclock-app
   ```
   (Replace `path/to` with actual path, or just drag folder into terminal)

2. Run:
   ```
   npm install
   ```
   Wait ~2 minutes

3. Navigate to client folder:
   ```
   cd client
   ```

4. Run:
   ```
   npm install
   ```
   Wait ~2 minutes

5. Go back to root:
   ```
   cd ..
   ```

✅ **Dependencies installed**

---

### 7️⃣ Start the App Locally

**Task**: Test the app on your computer before deploying

**In Command Prompt/Terminal** (in `timeclock-app` folder):

```
npm run dev
```

**Wait for:**
```
Server running on port 3001
```

Then open your browser to: `http://localhost:3001`

You should see the **login screen** with purple gradient background.

✅ **App running locally**

---

### 8️⃣ Test Employee Login

1. Click **"Employee Clock In"**
2. Select **"John Doe"** from the dropdown
3. Click **"Clock In"**
4. You should see the employee dashboard with 4 buttons ✅

---

### 9️⃣ Test Admin Login

1. Go back, click **"Administrator"**
2. Click **"Don't have an account? Create one"**
3. Fill in:
   - Setup Key: `setup123`
   - Email: `curtis@farmtest.com`
   - Password: `TestPassword123!`
4. Click **"Create Account"**
5. Log in with those credentials
6. You should see the **Admin Dashboard** ✅

---

### 🔟 Stop the Local Server

When testing is done:

**In Command Prompt/Terminal**, press: `Ctrl+C`

This stops the server.

✅ **Testing complete**

---

## PHASE 3: PUSH TO GITHUB (5 minutes)

**Task**: Upload your code to GitHub so Vercel can deploy it

**In Command Prompt/Terminal** (in `timeclock-app` folder):

```
git init
```

```
git add .
```

```
git commit -m "Initial commit - time clock app"
```

```
git branch -M main
```

Now go to [github.com/new](https://github.com/new):

1. **Repository name**: `timeclock-app`
2. Add description (optional): `Time tracking and payroll app`
3. Click **"Create repository"**

GitHub will show you some commands. Copy them and run in Terminal:

```
git remote add origin https://github.com/YOUR_USERNAME/timeclock-app.git
git push -u origin main
```

(Replace `YOUR_USERNAME` with your actual GitHub username)

✅ **Code on GitHub**

---

## PHASE 4: DEPLOY TO VERCEL (10 minutes)

**Task**: Get your app live on the internet

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Find your `timeclock-app` repo and click **"Import"**
5. On "Configure Project" screen:
   - **Project Name**: `timeclock-app` (or your choice)
   - Leave everything else as default
6. Click **"Deploy"**
7. **Wait 1-2 minutes** for deployment
8. It will fail (that's normal - we need to add env vars)

✅ **First deployment attempted**

---

## PHASE 5: ADD ENVIRONMENT VARIABLES (5 minutes)

**Task**: Add your Supabase keys to Vercel so the app can connect

1. In Vercel, find your project in the dashboard
2. Click **"Settings"** at the top
3. Click **"Environment Variables"** in the left menu
4. Add each variable:

**Variable 1:**
- Name: `SUPABASE_URL`
- Value: `https://xxxxx.supabase.co` (your URL from step 2)
- Click **"Add"**

**Variable 2:**
- Name: `SUPABASE_ANON_KEY`
- Value: Your anon key from step 2
- Click **"Add"**

**Variable 3:**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: Your service role key from step 2
- Click **"Add"**

**Variable 4:**
- Name: `JWT_SECRET`
- Value: `super-secret-key-123`
- Click **"Add"**

**Variable 5:**
- Name: `ADMIN_SETUP_KEY`
- Value: `setup123`
- Click **"Add"**

5. Now go to **"Deployments"** tab
6. Find your failed deployment and click **"Redeploy"**
7. Click **"Redeploy"** button to confirm
8. **Wait 2-3 minutes** for redeployment

✅ **Environment variables added and redeploying**

---

## PHASE 6: YOUR APP IS LIVE! 🎉

**When deployment shows ✅ Complete:**

1. Click **"Visit"** button (or copy the URL)
2. You should see your time clock app
3. **Test it works:**
   - Click "Employee Clock In"
   - Select "John Doe"
   - Click "Clock In" ✓
4. **Test admin:**
   - Go back, click "Administrator"
   - Log in with your admin account
   - See the dashboard ✓

---

## ✅ FINAL CHECKLIST

- [ ] Supabase account created
- [ ] Database setup SQL run
- [ ] Storage bucket created
- [ ] `.env` file created with your keys
- [ ] Local testing successful
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables added
- [ ] Redeployment complete
- [ ] Live URL working
- [ ] Employee login works
- [ ] Admin login works

---

## 🎯 YOUR LIVE APP URL

Once deployed, you'll have a URL like:

```
https://timeclock-app.vercel.app
```

**Share this with your employees!** They can clock in from this URL on their phones or computers.

---

## 📝 NEXT STEPS

1. **Add your real employees** in the admin panel
2. **Set their hourly wages**
3. **Set overtime eligibility** for each employee
4. **Share the URL** with your team
5. **Test with a real shift** before using for payroll
6. **Export weekly payroll** on Friday for processing

---

## 🆘 TROUBLESHOOTING

### Deployment still failing?
1. Check Vercel "Logs" tab for error messages
2. Make sure all 5 environment variables are added
3. Click redeploy again
4. Allow 3-5 minutes for redeployment

### App loads but shows errors?
1. Click "Inspect" in browser (F12)
2. Go to "Console" tab
3. Look for red error messages
4. Check that SUPABASE_URL and ANON_KEY are correct

### Can't log in?
1. Try creating a new admin account with setup key `setup123`
2. Make sure Supabase database is running
3. Check that DATABASE_SETUP.sql ran successfully

### Photos not working?
1. Make sure `time-clock-photos` bucket exists in Supabase Storage
2. Make sure bucket is NOT private

---

You're done! 🚀 Your time clock app is live and ready to use.
