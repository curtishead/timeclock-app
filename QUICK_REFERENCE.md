# Time Clock App - Quick Reference

## Features Overview

### ✅ Employee Features
- **Clock In/Out** - Start and end your shift with one tap
- **Lunch Tracking** - Start/end lunch breaks (taken multiple times per day)
- **Optional Photos** - Admin can require photo proof on clock-in/out
- **Status Display** - Always see if you're clocked in, on lunch, or clocked out
- **Time Display** - See how long you've been clocked in with lunch time deducted

### ✅ Admin Features
- **Employee Management** - Add employees and manage their settings
- **Wage Configuration** - Set hourly wage for each employee
- **Overtime Settings** - Choose which employees get 1.5x pay after 40 hours
- **Weekly Payroll** - View total hours, regular pay, overtime pay
- **Pay Calculation** - Auto-calculates based on hours worked and wage settings
- **Export to CSV** - Download payroll data for record keeping
- **Photo Review** - View photos employees took during clock-in/out
- **Photo Requirements** - Toggle photo requirements on/off for audit trail

---

## How Overtime Works

### Flat Rate Employee:
- Works 45 hours @ $25/hr = $1,125
- All hours paid at regular rate

### Overtime Eligible Employee:
- Works 45 hours @ $25/hr = $1,000 (40 hrs) + $225 (5 hrs @ $37.50) = $1,225
- First 40 hours at regular rate
- Hours after 40 at 1.5x rate

---

## Lunch Deduction Rules

- Employees can clock "Start Lunch" and "End Lunch" multiple times per day
- Lunch minutes are automatically deducted from total hours worked
- Example:
  - Clock in: 8:00 AM
  - Start lunch: 12:00 PM
  - End lunch: 1:00 PM (60 minutes deducted)
  - Start lunch: 3:00 PM  
  - End lunch: 3:30 PM (30 minutes deducted)
  - Clock out: 5:00 PM
  - **Total work: 8.5 hours (9 hours - 30 min - 60 min)**

---

## Photo Feature Usage

### When Photos are Optional:
- Employees can still take photos, but they're not required
- Great for optional records or building a history

### When Photos are Required:
- Employees MUST take a photo when clocking in/out
- Can see preview before submitting
- Photos stored for audit trail and verification
- Photos have timestamps from the server

### Reviewing Photos:
1. Go to Admin Dashboard
2. Click "Payroll" tab
3. Select the week you want to review
4. Click "📷 View Photos" under an employee
5. Popup window shows all their photos for that week

---

## Data Storage & Retention

- **Employees**: Unlimited (stored forever)
- **Time Entries**: Kept for 1 year (as requested)
- **Photos**: Kept with time entries (1 year)
- **Admin Accounts**: Unlimited

To delete old data, contact support or manually delete via Supabase console.

---

## Mobile vs Desktop

- **Fully responsive** - Works great on phones and tablets
- **Mobile optimized** - Touch-friendly buttons, camera integration
- **Desktop optimized** - Better for admin dashboard and payroll review
- **No app download** - Just a URL, no installation needed

---

## Security Features

- **Password protected admin access** - Only authorized admins can see payroll
- **JWT tokens** - Secure session management
- **Encrypted passwords** - Bcrypt hashing for admin passwords
- **No password for employees** - They just select their name (simple UX)
- **Photo storage** - Private storage with access control

---

## Common Tasks

### Add a New Employee
1. Admin Dashboard → Employees tab
2. Enter employee name
3. Click "Add Employee"
4. Set hourly wage and overtime settings

### View Weekly Payroll
1. Admin Dashboard → Payroll tab
2. Select the week (use date picker)
3. Click "Load"
4. See breakdown for each employee

### Export Payroll to Excel
1. Admin Dashboard → Payroll tab
2. Load the week you want
3. Click "📥 Export CSV"
4. Open the file in Excel/Sheets
5. Format as needed and print

### Enable Photo Requirements
1. Add setting in admin dashboard (feature coming soon)
2. When enabled, employees must take photo for all clock-ins
3. Great for audit trail if issues come up

### View Employee Photos
1. Payroll tab
2. Find the employee
3. Click "📷 View Photos"
4. See all photos for that week with timestamps

---

## Verification Checklist Before Using for Real Payroll

- [ ] All employees added with correct names
- [ ] Hourly wages set correctly for each employee
- [ ] Overtime eligibility correct (1.5x vs flat rate)
- [ ] Test clock-in/out works smoothly
- [ ] Test lunch deductions
- [ ] Admin can calculate payroll without errors
- [ ] CSV export works and opens in Excel
- [ ] Photos optional feature works (if enabled)
- [ ] Employees can access via public URL

---

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Employee not showing up | Add them in Admin → Employees first |
| Payroll shows 0 hours | Make sure employee clocked in/out |
| Photo won't upload | Check internet connection, try again |
| Wrong pay amount | Verify hourly wage and overtime setting |
| Can't log in as admin | Check email/password, or create new account |
| Missing lunch deduction | Make sure "End Lunch" was clicked |

---

## Contact & Support

For issues or feature requests, check the SETUP_GUIDE.md troubleshooting section first.
