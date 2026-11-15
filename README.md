# EcoSort — Smart Waste Segregation & Green Rewards Platform

EcoSort is a modern environmental technology platform designed to incentivize civic waste segregation. Citizens upload photographs of segregated domestic recyclables, which are analyzed through an administrative **Analyzer Pending Approvals** workspace using serverless **Hugging Face Vision Computer Vision** and quality inspection before Green Coins are credited to citizens' wallets.

---

## 1. Core Architecture & Workflow

```
   ┌──────────────────────────────────────────────────────────────┐
   │                       Citizen Portal                         │
   │  [Select Category] ──> [Upload Photo] ──> [Enter Weight kg]  │
   └──────────────────────────────┬───────────────────────────────┘
                                  │ POST /api/waste/submit
                                  ▼
   ┌──────────────────────────────────────────────────────────────┐
   │                     Submission Pipeline                      │
   │  1. Check SHA-256 image fingerprint (duplicate prevention)   │
   │  2. Save record with status PENDING                          │
   │  3. Queue in Administrative Analyzer                         │
   └──────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
   ┌──────────────────────────────────────────────────────────────┐
   │            Admin: ANALYZER PENDING APPROVALS                 │
   │  Option A: Run AI Vision Model (Hugging Face Serverless)     │
   │  Option B: Perform Manual Human Inspection                   │
   │  Adjudication Decision: APPROVE or REJECT                    │
   └──────────────────────────────┬───────────────────────────────┘
                                  │
                 ┌────────────────┴────────────────┐
                 ▼ Approved                        ▼ Rejected
   ┌──────────────────────────────┐  ┌──────────────────────────────┐
   │ Atomic Database Transaction: │  │ Status: REJECTED             │
   │ • Calculate Green Coins      │  │ • Rejection reason logged    │
   │ • Credit Citizen Wallet      │  │ • 0 Coins awarded            │
   │ • Generate ECO-TXN-XXXXX     │  │ • Citizen notified           │
   │ • Update Eco Level & Badges  │  └──────────────────────────────┘
   │ • Dispatch Notification      │
   └──────────────────────────────┘
```

---

## 2. Technology Stack

### Frontend
- **Framework:** Next.js 15 (App Router with React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom eco-palette (`#166534`, `#22C55E`, `#E8F3E9`, `#F5F7F2`, `#111827`, `#D97706`, `#DC2626`)
- **Icons:** Lucide React
- **Data Visualization:** Recharts for responsive activity & category distribution charts

### Backend & Database
- **Server:** Next.js Route Handlers
- **Database:** PostgreSQL (with Prisma ORM)
- **Authentication:** Role-Based Access Control (RBAC) with `bcryptjs` password hashing and HTTP-only signed session tokens using `jose`
- **Validation:** Server-side validation with strict guards against negative balances and duplicate hashes

### AI Vision Integration
- **Inference Service:** Hugging Face Inference Providers (Serverless Router)
- **Target Model:** `yangy50/garbage-classification` (configurable via `HF_MODEL_ID`)
- **Confidence Gate:** Configurable (Default: &ge; 80%)

---

## 3. Seeded Accounts & Credentials

The system includes pre-registered accounts for testing and evaluation:

### 1. Platform Administrator
- **Login URL:** `http://localhost:3001/auth/admin/login`
- **Email:** `admin@ecosort.com`
- **Password:** `AdminPass123!`
- **Access:** Centralized **`ANALYZER PENDING APPROVALS`**, Citizen Management, Reward Catalog, Store Locations, Redemptions, Reports & Audit Logs.

### 2. Standard Citizen
- **Login URL:** `http://localhost:3001/auth/citizen/login`
- **Email:** `citizen@ecosort.com`
- **Password:** `CitizenPass123!`
- **Citizen Name:** Sarah Jenkins
- **Access:** Waste Submission Upload, Personal Submissions History, Green Coins Wallet, Eco Challenges, Badges, and Rewards Marketplace.

---

## 4. Setup & Running Locally

1. **Clone and Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create `.env` using `.env.example`:
   ```env
   DATABASE_URL="postgresql://postgres@localhost:5433/ecosort?schema=public"
   JWT_SECRET="your-jwt-secret-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3001"
   HF_TOKEN="your_hugging_face_token"
   HF_MODEL_ID="yangy50/garbage-classification"
   ```

3. **Initialize Database:**
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

4. **Start Development Server on Port 3001:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3001` in your browser.
