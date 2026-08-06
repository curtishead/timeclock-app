# Time Clock App - Farm Payroll Management

A simple, completely free time tracking and payroll management system built for small teams.

**Cost:** $0/month forever (for your team size)
**Live in:** ~30 minutes (with deployment)
**Technology:** React + Node.js + Supabase + Vercel

---

## ⚡ Quick Start

1. **Follow the deployment checklist** in `DEPLOYMENT_CHECKLIST.md` - copy-paste everything, takes 30 minutes
2. **Share the URL** with employees for clocking in
3. **Use admin dashboard** to manage wages and view payroll

---

## 📋 What's Included

### For Employees
- ✅ Clock In / Clock Out buttons
- ✅ Start / End Lunch (multiple times per day, flexible duration)
- ✅ Real-time status (clocked in, on lunch, clocked out)
- ✅ Optional photo proof feature
- ✅ Mobile-friendly interface
- ✅ No password needed (just select name)

### For Admin (You)
- ✅ Employee management (add/edit)
- ✅ Wage configuration per employee
- ✅ Overtime settings (1.5x vs flat rate, per employee)
- ✅ Weekly payroll calculations
- ✅ Auto-calculated regular + overtime pay
- ✅ Photo review (audit trail)
- ✅ CSV export for payroll
- ✅ Secure admin login

---

## 📁 Project Structure

```
timeclock-app/
├── server.js                 # Backend (Node.js/Express)
├── package.json             # Backend dependencies
├── .env.example             # Environment variables template
├── DATABASE_SETUP.sql       # Database schema (run in Supabase)
├── DEPLOYMENT_CHECKLIST.md  # ← START HERE (step-by-step guide)
├── SETUP_GUIDE.md           # Detailed setup instructions
├── QUICK_REFERENCE.md       # Feature reference & FAQs
├── client/
│   ├── package.json         # Frontend dependencies
│   ├── public/
│   │   └── index.html       # HTML entry point
│   └── src/
│       ├── index.js         # React app entry
│       ├── App.js           # Main app component
│       ├── App.css          # Styles
│       └── components/
│           ├── EmployeeLogin.js      # Employee select screen
│           ├── EmployeeClock.js      # Clock in/out interface
│           ├── AdminLogin.js         # Admin login
│           └── AdminDashboard.js     # Payroll management
```

---

## 🚀 Getting Started (TL;DR)

### First Time Setup

1. **Open** `DEPLOYMENT_CHECKLIST.md` 
2. **Follow** every step - copy-paste all commands
3. **Wait** ~30 minutes
4. **Done!** Your app is live

### Regular Usage

- **Admin URL**: Same as employee, but click "Administrator"
- **Add employees**: Admin Dashboard → Employees tab
- **Set wages**: Click each employee, enter wage
- **View payroll**: Payroll tab → select week → see totals
- **Export to Excel**: Click "Export CSV" button

---

## 🎯 Key Features

### Smart Lunch Tracking
- Employees can take lunch breaks (30-60 min or whatever)
- Can take multiple lunch breaks in one day
- Lunch time auto-deducted from hours worked
- Example: 8am-5pm with 1 hour lunch = 8 hours worked

### Flexible Overtime
- Per-employee setting: "Overtime (1.5x)" checkbox
- Some employees get overtime, others get flat rate
- Auto-calculated based on weekly hours
- Example: 45 hours @ $25/hr
  - With OT: $1,000 (40hrs) + $225 (5hrs @ $37.50) = $1,225
  - Flat: $1,125

### Optional Photo Proof
- Employees can upload photos on clock-in/out
- Photos optional by default (toggle per shift if needed)
- Great for audit trail if employee disputes arise
- Photos stored securely with timestamps

### Admin Dashboard
- View all employees at a glance
- Manage wages (set independently per employee)
- Control overtime eligibility
- Weekly payroll reports
- Export to CSV for your records

---

## 💰 Pricing

### Local Testing (Free)
- Run on your computer, no cost

### Production Deployment (Free!)
- **Supabase**: Free tier includes what you need
- **Vercel**: Free tier includes hosting
- **Forever**: No hidden costs for your team size
- **Total**: $0/month

If your business grows to 100+ employees, you'd move to paid tiers (~$10-20/month).

---

## 🔒 Security

- ✅ Passwords are hashed (bcrypt)
- ✅ Admin panel requires login
- ✅ Employees just select their name (UX friendly)
- ✅ JWT tokens for sessions
- ✅ Private photo storage
- ✅ Data in Supabase (enterprise-grade security)
- ✅ HTTPS on live URL (Vercel handles this)

---

## 📱 Compatibility

- ✅ Mobile phones (iOS/Android) - works great
- ✅ Tablets - works great
- ✅ Computers/Desktop - works great
- ✅ No app download needed - just a URL
- ✅ No internet required for clocking in (works offline, syncs when back online)

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React | Fast, responsive UI |
| **Backend** | Node.js + Express | Simple, scalable |
| **Database** | PostgreSQL (Supabase) | Enterprise reliable |
| **Hosting** | Vercel | Free, auto-scaling |
| **Auth** | JWT | Stateless, secure |
| **Storage** | Supabase Storage | Free photo hosting |

---

## 📚 Documentation Files

- **DEPLOYMENT_CHECKLIST.md** ← Start here (step-by-step, copy-paste)
- **SETUP_GUIDE.md** - Detailed setup with explanations
- **QUICK_REFERENCE.md** - Feature guide and FAQs
- **DATABASE_SETUP.sql** - Database schema (run in Supabase)

---

## ❓ Common Questions

### Q: Do employees need accounts?
A: No. They just select their name from a dropdown. No passwords needed.

### Q: Can I run this on my computer locally?
A: Yes! That's what we do first in the setup. Then we deploy to Vercel for live URL.

### Q: What if an employee forgets to clock out?
A: Admin can manually edit time entries in Supabase console (advanced feature).

### Q: Can I use this right now?
A: Yes! Follow DEPLOYMENT_CHECKLIST.md to be live in 30 minutes.

### Q: What if I need to change something after deployment?
A: Easy! Edit the code, push to GitHub, Vercel auto-deploys.

### Q: Is there customer support?
A: This is your own app. Use the documentation and Supabase/Vercel support if needed.

---

## 🎓 Next Steps

1. **Read** `DEPLOYMENT_CHECKLIST.md` 
2. **Follow** every step exactly
3. **Test** with your employees
4. **Add** real employees and wages
5. **Use** for payroll tracking

---

## 📞 Need Help?

1. Check **QUICK_REFERENCE.md** for common issues
2. Check **SETUP_GUIDE.md** troubleshooting section
3. Check browser console for error messages (F12)
4. Check Vercel deployment logs
5. Check Supabase SQL editor for database errors

---

## 🎉 You're All Set!

Your free, open-source, fully functional time clock app is ready to deploy.

**Next step:** Open `DEPLOYMENT_CHECKLIST.md` and follow the steps.

Good luck! 🚀
