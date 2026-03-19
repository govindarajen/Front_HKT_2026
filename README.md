
# HACKATHON 2026 | MIA GROUPE 33 

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

### 1. **Authentication (pages/Auth)**
- Login & Registration
- JWT token management
- User state persisted to Redux
- Redux-persist integration

### 2. **Document Management (pages/Documents)**
- **List View**: Display curated, clean, and raw documents in tabs
- **Upload**: Multi-document batch upload with preview
- **Details Page**: Full document view with preview (image/PDF) + status management
  - Route: `/document/:siret`
  - Shows all documents for a SIRET
  - Status update controls (owner only)
  - Document preview (left), details (right), update controls (bottom)

### 3. **Dashboard (pages/Dashboard)**
- KPI cards: Total documents, conformity rate, anomalies, etc.
- Charts: Document types, anomalies by severity, validation status, processing status
- Tables: Top anomalies, suppliers at risk
- Bar chart: Anomaly rate by document type
- Adaptive state transformers for flexible data formats

### 4. **Enterprise Management (pages/Enterprise)**
- Enterprise creation and configuration
- Member management (invite, remove, role assignment)
- Enterprise settings and preferences
- Supplier/partner information management
- Access control based on enterprise owner rights
- Multi-enterprise support for admins



## Project Architecture

```
hkt/
├── Front_HKT_2026/          # Frontend application
├── Back_HKT_2026/           # Backend application (this folder)
```


```
src/
├── App.jsx                          # Main app component
├── index.css                        # Global styles
├── main.jsx                         # App entry point
│
├── assets/                          # Static assets
│   └── styles/
│       ├── index.scss              # Global SCSS imports
│       ├── main.scss               # Main styles
│       └── custom/
│           ├── _components.scss    # Component-specific styles
│           └── _pages.scss         # Page-specific styles
│
├── components/                      # Reusable components
│   ├── Layout/
│   │   ├── index.jsx              # Main layout wrapper
│   │   ├── Navbar.jsx             # Top navigation
│   │   ├── Footer.jsx             # Footer component
│   │   ├── ProtectedRoute.jsx     # Route protection wrapper
│   │   └── PendingEnterpriseInviteModal.jsx  # Enterprise invite modal
│   └── ui/
│       ├── tables/
│       │   └── TableList.jsx      # Reusable table component
│       └── Navbar/
│           └── profileDropDown.jsx # User profile dropdown
│
├── pages/                           # Page components (route-based)
│   ├── Index/
│   │   └── index.jsx              # Home/landing page (future feature)
│   ├── Auth/
│   │   └── index.jsx              # Login/Register page
│   ├── Dashboard/
│   │   ├── index.jsx              # Dashboard with KPIs
│   │   └── formCreateEnteprise.jsx # Enterprise creation form
│   ├── Documents/
│   │   ├── index.jsx              # Documents list view
│   │   ├── addDocument.jsx        # Document upload page
│   │   └── DocumentDetailsModal.jsx # Document details page
│   ├── Enterprise/
│   │   └── index.jsx              # Enterprise management page
│   └── AdminPanel/
│       └── index.jsx              # Admin panel page (future feature)
│
├── router/
│   └── route.jsx                  # Route definitions & AppRouter component
│
├── redux/                           # Redux state management
│   ├── store.js                   # Redux store configuration
│   ├── rootSaga.js                # Root saga combining all sagas
│   │
│   ├── admin/
│   │   └── adminReducer.js        # Admin slice (future feature)
│   │
│   ├── users/
│   │   ├── userReducer.js         # Account/user auth slice
│   │   └── userSaga.js            # User login/register/logout sagas
│   │
│   ├── documents/
│   │   ├── documentsReducer.js    # Documents slice (curated, clean, raw)
│   │   └── documentsSaga.js       # Document fetch/update sagas
│   │
│   ├── enterprise/
│   │   ├── enterpriseReducer.js   # Enterprise slice
│   │   └── enterpriseSaga.js      # Enterprise sagas
│   │
│   ├── dashboard/
│   │   ├── dashboardReducer.js    # Dashboard KPIs slice
│   │   └── dashboardSaga.js       # Dashboard data fetch sagas
│   │
│   ├── reducers/                  
│   │   └── adminReducer.js
│   │
│   └── sagas/                      
│       ├── adminSaga.js
│       └── patientsSaga.js
│
├── helpers/
│   ├── apiHelper.js               # Axios API client instance
│   └── items.jsx                  # Static data/items
│
└── locales/                         # Internationalization
    ├── index.jsx                  # i18n configuration
    ├── en/
    │   └── translation.json       # English translations
    └── fr/
        └── translation.json       # French translations
```


## Tech Stack
- **Framework**: React 18+
- **Build Tool**: Vite
- **State Management**: Redux Toolkit + Redux-Saga
- **UI Library**: Reactstrap (Bootstrap React components)
- **Styling**: SCSS
- **Internationalization**: i18next
- **HTTP Client**: Axios (via apiHelper)
- **Charts**: Chart.js + react-chartjs-2
- **Routing**: React Router v6
- **Icons**: Font Awesome


## Running in Local
```bash
cd Front_HKT_2026
```
```bash
npm install
```
```bash
npm run dev
```

## Running with Docker

Navigate to the backend:

```bash
cd Back_HKT_2026
```
```bash
docker compose up --build
```

## Stopping Services

```bash
docker compose down
```