# CampusOS — City University
> **Unified Digital Campus Hub for City University (CPCCU Hackathon 2026)**  
> *Single Source of Truth for Student Life, Academic Records, Shuttle Tracking, Club Events & QR Attendance.*

---

## 1. Problem Statement & Background

City University is a growing institution with **10+ active clubs** (cultural, technical, debate, sports, academic), multiple departments, faculty offices, and an inter-city shuttle bus network. 

Previously, campus information was fragmented across:
- **20+ Facebook Groups:** Irregular posting habits, missing notifications.
- **Unsearchable Messenger Group Chats:** Important notices and bus schedules buried under hundreds of unrelated messages and memes.
- **Ad-hoc Google Forms:** No central index of open forms or deadlines.
- **Physical Notice Boards:** Only visible to students who were in the right corridor at the right hour.

**CampusOS** solves this by unifying every student's daily lifecycle into one structured, reliably updated, and browsable web hub.

---

## 2. Real-World Usability Scenarios for a CU Student

### Scenario A: The 11:30 PM Pre-Exam Search
* **The Friction:** The night before the 5th-semester *Algorithms & Complexity Analysis (CSE-3101)* midterm, a student needs last year's question paper and lecture slides. In the old system, they post in three Messenger group chats and wait helplessly.
* **CampusOS Solution:** The student opens CampusOS **Resource Hub**, selects `CSE-3101`, and downloads the verified Fall 2024 Question Paper and Prof. Selim's lecture notes in under 10 seconds.

### Scenario B: Catching the 07:15 AM Mirpur Shuttle Bus
* **The Friction:** A commuter student wakes up at 6:45 AM wondering whether the morning shuttle bus leaves Mirpur-10 at 07:15 AM or 07:30 AM due to metro rail construction.
* **CampusOS Solution:** Opening the **CampusOS Dashboard** shows the **Next Campus Shuttle** widget with active route status ("On Time"), intermediate pickup stops (Mirpur-14, ECB Chattar), and direct driver contact.

### Scenario C: CPCCU Hackathon Entry & Door Check-In
* **The Friction:** Club events previously registered students via Google Forms. At event check-in, organizers spent 45 minutes manually searching for names on paper sheets, resulting in queues and proxy check-ins.
* **CampusOS Solution:** The student RSVPs on the **Club & Event Engine**, instantly receiving a tamper-proof **QR Code Entry Pass**. At the venue door, volunteers scan the code with the CampusOS QR validator for instant 1-second admission.

### Scenario D: Emergency Class Cancellations
* **The Friction:** A teacher reschedules a 2:00 PM lecture to another building. Notices in group chats only reach students currently online; others show up to an empty room.
* **CampusOS Solution:** Broadcast via the **CampusOS Notice Desk** flags the item as **High Priority / Room Shift** at the top of every enrolled student's feed.

---

## 3. Core Modules Built

CampusOS implements **all four (4)** hackathon modules plus comprehensive academic management:

| Module | Core Functionality | Real-World Impact |
| :--- | :--- | :--- |
| **1. Club & Event Engine** | Unified cross-club event feed, category filtering, RSVP registration, dynamic QR ticket generation, and door check-in scanner. | Replaces 20+ separate Facebook groups. |
| **2. Resource Hub** | Searchable archive for past questions, lecture notes, and lab manuals organized by Department, Course Code, and Semester. | Replaces scattered personal Google Drives. |
| **3. Smart Helpdesk & Shuttle Hub** | Full shuttle bus routes, stops, schedules, live status, plus a grounded CU AI Assistant answering university rules and queries. | Answers *"When is the next bus on my route?"* in real time. |
| **4. Lost & Found / Complaint Box** | Categorized lost & found registry with campus locations, plus an official administrative grievance tracker with ticket IDs. | Replaces lost Facebook posts and untracked complaints. |
| **5. Academic Management** | Student records, faculty directory, course catalog, attendance ledger, assignment submissions, and transcript GPA calculator. | End-to-end university operations. |

---

## 4. Architecture & Technology Stack

```text
               ┌────────────────────────────────────────────────────────┐
               │                        FRONTEND                        │
               │   HTML5 • Modern JavaScript (ES2022) • React 19        │
               │         Tailwind CSS v4 • Lucide Icons • Motion        │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                  fetch()  │  REST API Calls
                             Bearer JWT    │  (JSON Payloads)
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │                        BACKEND                         │
               │          Python 3.10+ • FastAPI Framework              │
               │    OAuth2 Password Bearer • Pydantic v2 • SQLAlchemy   │
               └───────────────────────────┬────────────────────────────┘
                                           │
                              SQLAlchemy   │  Async Pool
                              Engine       │  (Port 5432)
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │                        DATABASE                        │
               │                       PostgreSQL                       │
               │   8 Normalized Tables: users, students, teachers,      │
               │   courses, attendance, assignments, notices, results   │
               └────────────────────────────────────────────────────────┘
```

---

## 5. PostgreSQL Database Schema (8 Tables)

Full SQL DDL is provided in `/backend/database.sql`:
1. `users`: Master credentials, email, password_hash (bcrypt), role (`student`, `teacher`, `admin`).
2. `students`: Roll ID (`CU-2023-CSE-042`), department, semester, batch, CGPA.
3. `teachers`: Faculty ID (`CU-FAC-019`), department, designation, office room, specialization.
4. `courses`: Course code (`CSE-3101`), credit hours, semester, assigned teacher.
5. `attendance`: Course ID, student ID, date, status (`present`/`late`/`absent`), verification method (`qr_scan`).
6. `assignments`: Title, description, due date, max marks, student submissions.
7. `results`: Midterm (30), final (50), assignment (10), attendance (10), total, grade, grade point.
8. `notices`: Headline, content, category (`academic`/`bus`/`urgent`), priority, author.

---

## 6. How to Run Locally

### A. Python + FastAPI Backend
```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set PostgreSQL connection (Optional: defaults to localhost)
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/campusos_db"

# 5. Start FastAPI server with live reload
uvicorn main:app --reload --port 8000
```
Interactive API docs available at: `http://localhost:8000/docs`

### B. Frontend Web App
```bash
# Install node dependencies
npm install

# Run the development server
npm run dev
```

---

## 7. Demo Credentials for Evaluation

The app contains pre-seeded, authentic City University test accounts for 1-click evaluation:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| 🎓 **Student** | `rafid.cse@cityuniversity.edu.bd` | `password123` | Rafid Ahmed, 3rd Year CSE (Roll: CU-2023-CSE-042) |
| 👨‍🏫 **Faculty** | `selim.reza@cityuniversity.edu.bd` | `password123` | Dr. Selim Reza, Assoc. Professor & Dept Head |
| 🏛️ **Admin** | `admin@cityuniversity.edu.bd` | `adminpass` | City University Registrar Administration |

---

## 8. JavaScript `fetch()` Connection Code

Located in `/backend/api_fetch_examples.js`:
```javascript
// Example: Connect login form with fetch()
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();
localStorage.setItem('campusos_auth_token', data.access_token);
```

---

## 9. Hackathon Compliance Checklist

- [x] **Live Deployed Link with Working Authentication:** Deployed on Google Cloud Run URL with instant login.
- [x] **Documentation (`README.md`):** Complete with problem, scenarios, schema, and API specs.
- [x] **All 4 Core Modules Functional:** Events with QR Passes, Resource Hub, Shuttle Bus & Grounded Helpdesk, and Lost & Found / Grievances.
- [x] **QR Code Engine:** Real cryptographic SVG/Canvas QR generation and check-in scanner.
- [x] **Clean, High-Fidelity UI:** Mobile-first, responsive design with zero placeholder text.
