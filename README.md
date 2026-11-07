# Smart Fleet and Store Transportation Management System

Team A6 MERN project foundation. This scaffold provides the folder structure, a React starter page, and an Express API foundation. Business features, authentication, authorization, database schemas, and real-time tracking are not implemented yet.

## Requirements and setup

Use Node.js 22.12 or newer and a running local MongoDB instance or MongoDB Atlas database.

1. Run `npm install` from the project root to install both workspaces.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`.
4. In one terminal at the project root, run `npm run dev:backend`.
5. In another terminal at the project root, run `npm run dev:frontend`.

Frontend: http://localhost:5173. API health check: http://localhost:5000/api/health. The backend connects to MongoDB before accepting requests. Keep real credentials in local `.env` files; these files are ignored by Git. Vite environment values are public, so never put secrets in frontend variables.

Run `npm run build` to build the frontend, `npm run preview --workspace frontend` to preview that build, and `npm start` to start the backend without watch mode. These are local development foundations, not deployment configuration.

## Folder structure

```text
frontend/
  public/                 Static files
  src/
    app/                  App entry and route composition
    assets/               Images and icons
    components/
      common/             Shared buttons, inputs, tables, and dialogs
      layout/             Header, footer, and navigation
    context/              Shared React state
    features/             Feature-specific pages, components, and hooks
      auth/
      dashboard/
      stores/
      vehicles/
      items/
      bookings/
      trips/
      schedules/
      tracking/
      handover/
    hooks/                Shared React hooks
    layouts/              Page wrappers (admin and store layouts later)
    pages/                General pages
    routes/               Future route guards and route helpers
    services/             API request helpers
    styles/               Global styles
    utils/                Shared utilities
backend/
  src/
    app.js                Express middleware and API mounting
    server.js             Database connection and HTTP startup
    config/               Environment and MongoDB connection
    middleware/           Error handling; future auth and permission checks
    modules/              Same feature names as frontend/features
    routes/               Central API router
    services are placed inside their feature modules
    sockets/              Future Socket.IO tracking setup
    utils/                Shared utilities
    validators/           Shared validation helpers
  tests/                  Future API and integration tests
```

Empty folders contain `.gitkeep` so Git retains them. Add files as work begins; placeholder folders do not expose APIs or enforce security.

## Team conventions

Use JavaScript ES modules. A frontend feature can contain `pages/`, `components/`, `hooks/`, and a `<feature>.api.js` file as needed. A backend feature can contain `<feature>.model.js`, `<feature>.controller.js`, `<feature>.service.js`, `<feature>.routes.js`, and `<feature>.validation.js`. Mount implemented routers in `backend/src/routes/index.js` under `/api`.

Keep HTTP handling in controllers, business rules in services, and MongoDB schemas in models. Implement authentication, admin/store permissions, and store scope checks before exposing protected endpoints. Booking quantities, vehicle capacity, and slot overlap must be validated on the server. Frontend guards are for navigation and do not replace server authorization.

## Suggested module ownership from the project document

| Member | Main areas |
| --- | --- |
| Hasaranga | Project foundation, bookings UI, vehicles, items, capacity validation |
| Binodya | Shared header/footer, stores, operating hours, schedules and slots |
| Tharaka | Dashboard, trips, allocation, maps and tracking |
| Dilrukshy | Authentication, permissions, booking APIs/history and goods handover |

Ownership overlaps across frontend and backend; coordinate shared changes in the app router and API router. The supplied planning document is reference material for module organization.

## Verification status

Dependencies have not been installed. JavaScript syntax and package manifests were checked locally. Build and API runtime verification require dependency installation; API startup also requires MongoDB configuration.
