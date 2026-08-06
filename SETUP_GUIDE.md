# Time Clock App - Complete Setup Guide

This guide will walk you through getting your time clock app live. **Total time: ~30 minutes**

---

## PHASE 1: Database Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Sign In" → "Continue with GitHub"
3. Use your existing GitHub account
4. Click "New Project"
5. Fill in:
   - **Name**: `timeclock` (or whatever you want)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you (or US East)
6. Click "Create new project"
7. Wait 2-3 minutes for the database to initialize

### Step 2: Get Your API Keys

1. Once the project is created, click the project name
2. Go to **Settings** (bottom left sidebar)
3. Click **API**
4. You'll see:
   - **Project URL** - Copy this, you need it
   - **anon public** key - Copy this, you need it
   - **service_role** key - Copy this, you need it (keep it private!)

**Save these somewhere safe.** You'll paste them into your app in a moment.

### Step 3: Create the Database Tables

1. Still in Supabase, click **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `DATABASE_SETUP.sql` (from your project folder)
4. Paste it into the SQL Editor
5. Click **"Run"** button (or press Ctrl+Enter)
6. Wait for it to complete ✓

### Step 4: Create Storage Bucket for Photos

1. In Supabase, click **Storage** (left sidebar)
2. Click **"New Bucket"**
3. Name it: `time-clock-photos`
4. Uncheck "Make it private" (so photos can be viewed)
5. Click **"Create bucket"**

✅ **Database is ready!**

---

## PHASE 2: Local Testing (10 minutes)

### Step 1: Create `.env` File

1. Open the `timeclock-app` folder on your computer
2. Create a new file named `.env` (no extension, just `.env`)
3. Copy this into it:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=super-secret-change-me-in-production
ADMIN_SETUP_KEY=setup123
PORT=3001
```

4. **Replace the values** with your actual Supabase keys from Step 2 above
5. Save the file

### Step 2: Install Dependencies

1. Open **Command Prompt** or **Terminal**
2. Navigate to your `timeclock-app` folder:
   ```
   cd path\to\timeclock-app
   ```
3. Run:
   ```
   npm install
   ```
   This installs all the code dependencies. Takes ~2 minutes.

4. Navigate to the client folder:
   ```
   cd client
   ```

5. Install client dependencies:
   ```
   npm install
   ```
   This takes ~2 minutes.

6. Go back to the root:
   ```
   cd ..
   ```

### Step 3: Start the Server

1. In Command Prompt, from the `timeclock-app` folder, run:
   ```
   npm run dev
   ```

2. Wait for:
   ```
   Server running on port 3001
   ```

3. Open your browser and go to: `http://localhost:3001`

4. You should see the **Login Choice** screen (purple gradient background with two buttons)

### Step 4: Test Employee Clock-In

1. Click **"Employee Clock In"**
2. You should see a dropdown with "John Doe" and "Jane Smith" (from the sample data)
3. Select one and click "Clock In"
4. You should see the employee dashboard with 4 buttons ✓

### Step 5: Test Admin Login

1. Go back and click **"Administrator"**
2. Click **"Don't have an account? Create one"**
3. Fill in:
   - **Setup Key**: `setup123` (from your .env file)
   - **Email**: Your email (e.g., curtis@example.com)
   - **Password**: Your password (e.g., Admin123!)
4. Click **"Create Account"**
5. Now log in with that email and password
6. You should see the Admin Dashboard with tabs for Employees and Payroll ✓

✅ **Local testing successful! Now we deploy.**

---

## PHASE 3: Deploy to Vercel (10 minutes)

### Step 1: Push Code to GitHub

1. Open **Command Prompt** in your `timeclock-app` folder
2. Run these commands one by one:

```
git init
git add .
git commit -m "Initial commit - time clock app"
git branch -M main
```

3. Now create a GitHub repository:
   - Go to [github.com/new](https://github.com/new)
   - **Repository name**: `timeclock-app`
   - Click **"Create repository"**

4. Copy the commands GitHub shows you (under "push an existing repository from the command line")
5. Paste them into your Command Prompt and run them
6. Your code is now on GitHub ✓

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find your `timeclock-app` repository and click **"Import"**
5. You'll see **"Configure Project"** screen:
   - **Project Name**: `timeclock-app` (or your choice)
   - Leave everything else as default
6. Click **"Deploy"**
7. Wait for deployment (2-3 minutes)

### Step 3: Add Environment Variables

1. Deployment will fail because we need to add environment variables
2. Go back to your Vercel project dashboard
3. Click **"Settings"** → **"Environment Variables"**
4. Add these variables (copy-paste from your `.env` file):
   - `SUPABASE_URL` = your Supabase URL
   - `SUPABASE_ANON_KEY` = your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your service role key
   - `JWT_SECRET` = your secret key
   - `ADMIN_SETUP_KEY` = `setup123`

5. Click **"Save"**
6. Go to **"Deployments"** tab
7. Click the failed deployment → **"Redeploy"**
8. Wait for redeployment (2-3 minutes)

✅ **Your app is live!**

---

## PHASE 4: Access Your App

1. In Vercel, click **"Visit"** or copy the deployment URL (looks like `timeclock-app-abc123.vercel.app`)
2. Share this URL with your employees
3. They can access it from their phones or computers

---

## Usage

### For Employees:
- Click "Employee Clock In"
- Select their name
- Use the 4 buttons to clock in/out and manage lunch
- Lunch is optional and can be taken multiple times per day
- Photos optional until you enable them in admin settings

### For Admin (You):
- Click "Administrator"
- Use the **Employees** tab to:
  - Add employees
  - Set hourly wage
  - Enable/disable overtime pay (1.5x)
- Use the **Payroll** tab to:
  - Select a week
  - See total hours, overtime, and pay due
  - View photos (if uploaded)
  - Export to CSV for payroll processing

---

## Troubleshooting

### "Failed to load employees" error
- Check that your `.env` file has the correct Supabase keys
- Make sure the database setup (DATABASE_SETUP.sql) was run successfully
- Check Supabase console to confirm tables exist

### Photos not uploading
- Make sure you created the `time-clock-photos` bucket in Supabase Storage
- Make sure it's NOT set to private

### Deployment stuck
- Check Vercel logs for errors
- Make sure all environment variables are set correctly
- Redeploy from Vercel dashboard

### "Invalid token" errors
- Clear your browser cache/cookies
- Logout and log back in
- Create a new admin account if needed

---

## Next Steps

Once you're up and running:

1. **Add your real employees** in the admin panel
2. **Set their wages** and overtime eligibility
3. **Share the employee URL** with your team
4. **Test thoroughly** with a few clock-ins/outs before using for real payroll
5. **Export weekly payroll** for your records

---

## Optional Features (Can Add Later)

- **GPS location** - Add geo-fencing to require clocking in at a specific location
- **Notifications** - Email alerts for late check-ins
- **Recurring timesheets** - Automatic weekly reports
- **Mobile app** - Native iOS/Android app instead of web

---

## Support

If you run into issues:
1. Check the troubleshooting section above
2. Check browser console for errors (F12 → Console tab)
3. Check Vercel logs in the Deployments tab
4. Check Supabase logs in their console

Good luck! Your time clock app is ready. 🎉
