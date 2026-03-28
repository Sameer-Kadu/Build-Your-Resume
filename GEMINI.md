You are an expert frontend architect, React developer, and UX designer.

Always generate code in modular steps. Never generate the full project in one response. Wait for user instruction before proceeding to next module.

Build a modern, production-ready Resume Builder web application using Next.js (App Router preferred) that is fully frontend-only and deployable on Vercel.

---

### 🎯 Goal:
Create a resume builder that:
- Collects user input via a clean, step-by-step form
- Generates a professional, ATS-friendly resume (90+ ATS optimized)
- Uses human-readable, recruiter-friendly layout patterns
- Authenticates users via Google Sign-In
- Stores all resume data in the user's own Google Drive (no backend)
- Automatically fetches and syncs data on login

---

### 🔐 Authentication:
- Use Google Identity Services for OAuth login
- Allow users to sign in with their Google account
- Request Google Drive access using scope:
  https://www.googleapis.com/auth/drive.file
- Securely manage access tokens on frontend (no secret exposure)

---

### ☁️ Data Storage (CRITICAL FEATURE):
Store user resume data in their own Google Drive:

- Create a JSON file (e.g., "resume-data.json")
- Use Google Drive REST API (client-side) to:
  - Search file on login
  - If exists → fetch and load into app state
  - If not → create a new file
- On every update → overwrite/update the file

---

### 🔄 Data Flow:
1. User logs in with Google
2. App gets access token
3. App searches Drive for "resume-data.json"
4. If found → load data
5. If not → create new file
6. Auto-save updates (debounced)
7. On re-login → refetch and restore state

---

### 🧩 Core Features:

#### 1. Multi-step Resume Form UI:
- Personal Information (Name, Email, Phone, LinkedIn, GitHub)
- Summary / Objective (AI-assisted suggestions)
- Skills (tag-based input)
- Experience (role, company, duration, bullet points)
- Projects (tech stack + description)
- Education
- Certifications / Achievements (optional)

---

#### 2. Resume Preview (Live):
- Real-time preview as user types
- Clean, single-column ATS-friendly layout
- Proper spacing, headings, bullet hierarchy

---

#### 3. ATS Optimization Logic:
- Standard section titles ("Experience", "Education", "Skills")
- No tables, images, icons, or complex layouts
- Keyword matching (based on job role input)
- Suggest strong action verbs:
  (Developed, Optimized, Implemented, Designed)
- Bullet points follow STAR method
- Consistent formatting (fonts, spacing, alignment)

---

#### 4. AI Enhancements (Mock or Real):
- Improve bullet points using STAR method
- Suggest impactful resume summaries
- Keyword optimization based on job description input

---

#### 5. Auto Save + Sync:
- Debounced auto-save to Google Drive
- Prevent excessive API calls
- Sync app state with Drive file

---

#### 6. Export Options:
- Download as PDF (html2pdf or similar)
- Print-friendly layout
- Optional DOCX export

---

#### 7. Templates:
- At least 2 ATS-friendly templates
- Minimal, professional design (no graphics)

---

### 🧠 ATS Best Practices:
- Standard fonts (Arial, Calibri)
- Reverse chronological order (Experience)
- Proper keyword density
- Bullet points with action verbs
- No multi-column or complex design

---

### 🎨 UI/UX Requirements:
- Clean, modern UI using Tailwind CSS
- Fully responsive (mobile + desktop)
- Stepper progress indicator
- Smooth transitions/animations
- Minimal and distraction-free design

---

### 🛠️ Tech Stack:
- Next.js (App Router)
- React
- Tailwind CSS
- Context API or Zustand (state management)
- Google Identity Services (Auth)
- Google Drive REST API (client-side)

---

### 🔥 Bonus Features:
- Job description input → auto keyword matching
- Resume score indicator (simulate ATS score)
- Dark mode toggle
- Save/load fallback (IndexedDB or LocalStorage if Drive fails)

---

### 📁 Suggested Folder Structure:
/components  
/features/resume-form  
/features/preview  
/context/resume-context.js  
/lib/google-drive.js  
/utils/ats-optimizer.js  

---

### ⚠️ Important Constraints:
- No backend allowed
- All logic must run on frontend
- Do not expose sensitive credentials
- Ensure Google Drive API usage is efficient and rate-limited

---

### 📦 Output Requirements:
- Complete working project code
- Clean, modular, production-quality code
- Setup instructions:
  - Run locally
  - Deploy on Vercel
  - Google Cloud setup (OAuth + Drive API)

---

### 🎯 Focus On:
- ATS optimization (highest priority)
- Smooth UX and performance
- Reliable Google Drive sync
- Real-world recruiter expectations

---

### ❌ Avoid:
- Over-design or fancy UI breaking ATS parsing
- Backend usage
- Complex layouts (tables, columns, graphics)
