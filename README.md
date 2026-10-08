# PARAKH

### AI-Powered Monitoring & Inspection Platform

PARAKH is a centralized platform for **real-time monitoring, surprise inspections, CCTV integration, and automated inspection assignment** for projects, institutes, and NGOs under DoSJE schemes.

---

## Features

### Department Officials

* Centralized project monitoring
* Real-time inspection status
* Risk indicators and alerts
* Institute and NGO monitoring
* Inspection reports and analytics

### PMU / Inspection Teams

* Random inspection assignment
* GPS-based inspection verification
* Geo-fenced inspections
* Photo and video evidence
* Digital inspection reports

### AI & Smart Monitoring

* AI-based inspection allocation
* Anomaly detection
* Risk identification
* Multi-source verification
* Automated alerts

### Multi-Source Verification

* CCTV surveillance
* Video conferencing
* GPS / Geo-fencing
* Attendance data
* Photos and videos
* Timestamped evidence

---

## Key Highlights

| Feature                | Benefit                         |
| ---------------------- | ------------------------------- |
| **Random Inspections** | Reduces bias and predictability |
| **Geo-Fencing**        | Verifies inspection location    |
| **AI Detection**       | Identifies unusual patterns     |
| **Digital Evidence**   | Improves accountability         |
| **CCTV & VC**          | Enables remote verification     |
| **Central Dashboard**  | Simplifies monitoring           |

---

## Tech Stack

| Layer           | Technology        |
| --------------- | ----------------- |
| Frontend        | React + Vite      |
| Backend         | Node.js + Express |
| Database        | MongoDB (Mongoose)|
| Auth            | JWT + bcrypt      |
| Styling         | Tailwind CSS      |
| Charts          | Recharts          |
| Version Control | Git & GitHub      |

---

## Project Structure

```text
PARAKH/
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Route controllers
│   ├── data/           # Mock/seed data
│   ├── middleware/     # Auth & role middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── scripts/        # Utility scripts (seed admin)
│   ├── services/       # Business logic
│   ├── .env.example    # Environment variable template
│   └── server.js       # Entry point
├── frontend/
│   ├── public/         # Static assets
│   └── src/
│       ├── assets/
│       ├── components/ # Reusable UI components
│       ├── context/    # React context providers
│       ├── hooks/      # Custom hooks
│       ├── pages/      # Route-level pages
│       ├── services/   # API service calls
│       ├── App.jsx
│       └── main.jsx
├── .gitignore
└── README.md
```

---

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/aryansingh0312/PARAKH.git
cd PARAKH
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@<cluster>.mongodb.net/parakh?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
DEVELOPMENT_ADMIN_EMAIL=admin@parakh.gov
DEVELOPMENT_ADMIN_PASSWORD=replace-with-a-strong-password
```

Seed the admin user, then start the server:

```bash
npm run seed:admin
npm run dev
```

The backend runs at `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

---

## API Overview

| Method | Endpoint              | Description              | Access       |
| ------ | --------------------- | ------------------------ | ------------ |
| GET    | `/api/health`         | API health check         | Public       |
| POST   | `/api/auth/login`     | User login               | Public       |
| GET    | `/api/admin/*`        | Admin dashboard data     | Admin only   |
| GET    | `/api/projects`       | List all projects        | Authenticated|
| GET    | `/api/inspections`    | List inspections         | Authenticated|
| POST   | `/api/inspections`    | Create inspection        | Authenticated|

---

## Security

* Environment variables for all sensitive data
* JWT-based authentication with expiry
* Role-based access control middleware
* bcrypt password hashing
* CORS restricted to allowed client origins
* GPS validation for field inspections
* HTTPS enforced in production

---

## Benefits

* **Transparent Monitoring** — Live visibility into project status
* **Reduced Fake Reporting** — Evidence-based digital records
* **Faster Inspections** — Automated assignment and routing
* **Better Accountability** — Timestamped, geo-tagged evidence
* **Paperless Governance** — Fully digital workflows
* **Data-Driven Decisions** — Analytics and risk dashboards
* **Scalable Architecture** — Modular, cloud-ready design

---

## Future Scope

* Advanced AI anomaly detection
* Live CCTV analytics integration
* Random video-conferencing audits
* GIS-based project monitoring
* Real-time push notifications
* Automated report generation
* Predictive risk scoring
* Multi-state deployment

---

## Smart India Hackathon 2026

|                |                                 |
| -------------- | ------------------------------- |
| **Problem ID** | SIH26095                        |
| **Problem**    | Monitoring and Inspection Model |
| **Theme**      | Smart Automation                |
| **Category**   | Software                        |
| **Team ID**    | 148302                          |
| **Team**       | NovaByte                        |

---

## Team NovaByte

**Team ID:** 148302  
**Smart India Hackathon 2026**  
**Problem ID:** SIH26095

---

## Vision

> **Making government monitoring smarter, faster, transparent, and evidence-driven.**

---

## License

Developed as part of **Smart India Hackathon 2026**.
