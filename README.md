# Smart Fleet and Store Transportation Management System

Team A6 project foundation with a React frontend, Express API, and MySQL-backed trip persistence. Authentication, authorization, and real-time tracking are not implemented yet.

## Requirements and setup

Use Node.js 22.12 or newer and a running local MySQL server.

1. Run `npm install` from the project root to install both workspaces.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Create the database with `CREATE DATABASE smart_fleet_store;`, then copy `backend/.env.example` to `backend/.env` and set the MySQL connection values.
4. In one terminal at the project root, run `npm run dev:backend`.
5. In another terminal at the project root, run `npm run dev:frontend`.

Frontend: http://localhost:5173. API health check: http://localhost:5000/api/health. The backend connects to MySQL and creates the trip tables before accepting requests. Keep real credentials in local `.env` files; these files are ignored by Git. Vite environment values are public, so never put secrets in frontend variables.

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

Dependencies are recorded in package-lock.json. The trip API now creates its MySQL tables at startup; database-backed trip operations still need to be exercised against a configured MySQL server. Local `.env` files are ignored by Git.

## Frontend pages

- `/bookings/create`: Two-step delivery form with future-date and Sri Lankan mobile validation, dynamic item rows, positive integer quantities, duplicate item checks, estimated load, and local draft saving.
- `/admin/vehicles`: Searchable and filterable vehicle directory, summary cards, Add/Edit dialogs, unique registration checks, positive payload validation, and confirmed deletion.
- `/admin/items`: Searchable and filterable item catalog, Add/Edit dialogs, unique item names, unit weights, categories, and status. Items referenced by a local booking cannot be deleted; deactivate them instead.

The UI follows the supplied teal/mint reference. Navigation and a compact shared header/footer are provided for preview and can be integrated with the team's shared layout later. The admin routes are not access controlled yet.

`FleetContext` seeds sample vehicles/items once and stores changes under `fleetflow.demo.*` localStorage keys. Bookings are browser-only drafts, not transport requests. Data does not synchronize between browsers or team members. Clear these keys in browser developer tools to reset demo data. The item catalog feeds the booking item selectors. Slots and stores are examples until the schedule/store APIs are integrated.

Frontend validation and local persistence were checked through the browser, including multi-item draft saving, duplicate rejection, vehicle creation/edit/search/deletion, item creation/edit/filter/deletion, and item persistence after reload. Production build passed.

## GPS tracking API

The backend stores latest vehicle coordinates and a location history when it starts. Send GPS reports to `POST /api/tracking/locations` as JSON with `vehicleId`, `latitude`, and `longitude`; optional fields are `tripCode`, `registration`, `speedKph`, `heading`, and `recordedAt`. Read current positions from `GET /api/tracking/locations`, a vehicle’s latest position from `GET /api/tracking/locations/:vehicleId`, and its recent history from `GET /api/tracking/locations/:vehicleId/history?limit=100`. The trip planner refreshes current positions every 10 seconds. Set `VITE_GOOGLE_MAPS_API_KEY` in `frontend/.env` to enable the interactive Google map; without it the location list and static map preview remain available.

## Separate portal layouts

Store pages use `MainLayout` and admin pages use `AdminLayout` under the `/admin` route group. Store navigation does not expose admin links, and admin navigation does not expose store booking creation. Planned pages belonging to other team members appear as disabled navigation labels. Login, role-based redirects, protected routes, and backend authorization remain the authentication owner's integration work; separate layouts do not enforce access control. The store footer is excluded from the admin workspace.

## Vehicle registry reference update

The vehicle screen now uses the reference table layout with registration, vehicle name, type, payload capacity, status badges, Edit, and a per-row delete menu. Status and type filters combine with search; filtered records can be exported as CSV. Pagination displays eight records per page. The admin header search opens the vehicle directory with a search query. Help and notifications describe the local preview. Existing locally saved vehicles are preserved; older records without names display a fallback name, and On trip is displayed as In transit. Fresh browsers receive the four reference sample vehicles.

The production build passed after this update and the local development server returned HTTP 200. Browser visual and interaction checks for this revision could not be completed because the in-app browser could not connect to the local preview. Backend integration and authentication remain pending.
