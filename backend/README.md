# Fleet, store, and booking backend

The Express and MongoDB backend provides authenticated account, store, schedule, vehicle, item catalog, booking review, and goods receipt APIs. The frontend submits bookings to MongoDB, supports administrator review, and lets the scoped store account confirm received goods.

## Run locally

From the repository root, install dependencies with `npm install`. Copy `backend/.env.example` to `backend/.env`, set `MONGODB_URI`, and start MongoDB.

Run these commands from the root in separate terminals.

```sh
npm run seed --workspace backend
npm run dev:backend
npm run dev:frontend
```

Seeding adds missing sample records and preserves existing active records. It is blocked in production. The frontend uses `VITE_API_URL`, defaulting to `http://localhost:5000/api`. `CLIENT_URL` accepts comma-separated exact frontend origins, including localhost and 127.0.0.1 for local development.

## Account authentication

Set `JWT_SECRET` in `backend/.env` to a random secret with at least 32 characters. The auth API issues 8-hour HS256 bearer tokens. Public signup creates store staff/manager accounts (both use the `store` API permission); it never allows a client to create an administrator. Provision an admin by setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`, then running `npm run seed:admin --workspace backend`. Admin credentials are created once; this command will not overwrite an existing account. The frontend persists the token and user profile in browser local storage and sends the token to protected APIs.

| Method | Path under `/api` | Behavior |
| --- | --- | --- |
| POST | `/auth/signup` | Create a store account and return its user and access token |
| POST | `/auth/signin` | Verify email/password and issue an access token |
| POST | `/auth/forgot-password` | Send a one-time reset link; response does not disclose whether the email exists |
| POST | `/auth/reset-password` | Use the link's email and token to set a new password |
| POST | `/bookings` | Create a booking for the authenticated store |
| GET | `/bookings` | List bookings in the authenticated store's scope |
| PATCH | `/bookings/:id/review` | Administrator approves or rejects a pending booking |
| POST | `/bookings/:id/goods-confirmation` | Store records received and accepted quantities for an approved booking |

Passwords are stored as scrypt hashes. Reset links expire after 30 minutes, can only be used once, and invalidate tokens issued before the password change. In development without SMTP, the forgot-password response includes a `resetUrl` so the flow can be tested locally. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, and `SMTP_SECURE` to email links; production returns a service error if SMTP is not configured.

The frontend redirects unauthenticated visitors to `/signin`, restricts `/admin/*` to administrator accounts, and sends successful sign-ins/signups to `/`. Sessions survive reloads and new tabs; the 8-hour token expires, and an API 401 clears the saved session. API authorization remains enforced by the backend. Browser local storage is JavaScript-accessible; use secure HttpOnly cookies for stronger production protection against token theft via cross-site scripting.

Use the signup UI at `/signup`, or send JSON to `/api/auth/signup`:

```json
{
  "name": "Store Staff",
  "email": "staff@example.com",
  "phone": "+94 77 123 4567",
  "storeLocation": "nugegoda",
  "storeRole": "staff",
  "password": "FleetFlow123"
}
```

Passwords must be 8–128 characters and contain an uppercase letter and a number. The `storeRole` field accepts `staff` or `manager`; neither grants administrator access.

The signup locations map to store IDs `STR-104` (Nugegoda), `STR-305` (Colombo), and `STR-412` (Kandy). Configure matching store records in your deployment. Booking destinations use the corresponding `STR-*` store IDs.

For local setup, make sure `MONGODB_URI` has the correct MongoDB username, password, and authentication database (`authSource` when needed). The backend logs `MongoDB connected` only after a successful connection. Authentication and Mongo-backed API routes return 503 when MongoDB is unavailable. Ensure port 5000 is free or choose another `PORT`, and keep `VITE_API_URL` aligned with it.

## Endpoints

All successful single-record responses use `{ "data": { ... } }`, and lists use `{ "data": [...] }`. Records expose MongoDB IDs as `id` and the concurrency counter as `version`.

| Method | Path under `/api` | Access | Behavior |
| --- | --- | --- | --- |
| GET | `/health` | Public | API health |
| POST | `/auth/signup` | Public | Register a store account |
| POST | `/auth/signin` | Public | Authenticate an account |
| POST | `/auth/forgot-password` | Public | Request a password reset email |
| POST | `/auth/reset-password` | Public | Set a new password using a reset token |
| GET | `/stores` | Admin or scoped store | List stores; store users see only their assigned store |
| GET | `/stores/:storeId` | Admin or matching store | Read a store |
| GET | `/schedules` | Admin or scoped store | List schedules for the selected store |
| GET | `/bookings` | Admin or scoped store | List bookings, optionally filtered by `status` and admin `storeId` |
| POST | `/bookings` | Admin or store | Create a booking; store accounts are assigned their own store ID |
| GET | `/bookings/:id` | Admin or owning store | Read a booking |
| PUT/PATCH | `/bookings/:id` | Admin or owning store | Edit a booking while it is pending review |
| DELETE | `/bookings/:id` | Admin or owning store | Cancel a booking while pending review |
| GET | `/bookings/:id/handover` | Admin or owning store | Read an approved booking for goods handover |
| PATCH | `/bookings/:id/review` | Admin | Approve or reject a pending booking; rejection requires a reason |
| POST | `/bookings/:id/goods-confirmation` | Owning store | Record received/accepted counts; a discrepancy requires a note |
| GET | `/vehicles` | Admin | List vehicles, with optional `q`, `type`, `status` filters |
| GET | `/vehicles/:id` | Admin | Read vehicle |
| POST | `/vehicles` | Admin | Create vehicle |
| PUT | `/vehicles/:id` | Admin | Replace editable vehicle fields |
| PATCH | `/vehicles/:id` | Admin | Update supplied vehicle fields |
| DELETE | `/vehicles/:id` | Admin | Soft delete vehicle, return 204 |
| POST | `/vehicles/:vehicleId/validate-load` | Admin | Validate availability, quantities, units and payload |
| GET | `/items` | Signed-in | List catalog, with optional `q`, `category`, `status` filters |
| GET | `/items/:id` | Signed-in | Read catalog item |
| POST | `/items` | Admin | Create catalog item |
| PUT | `/items/:id` | Admin | Replace editable item fields |
| PATCH | `/items/:id` | Admin | Update supplied item fields |
| DELETE | `/items/:id` | Admin | Soft delete item, return 204 |
| POST | `/items/validate-lines` | Signed-in | Validate item lines and calculate their current catalog weight |

Store/customer accounts can read and validate only active catalog items. Deleted records are excluded from every read and load calculation. Deleted records are retained internally so existing booking/trip references can remain intact. In-transit vehicles cannot be deleted. Item name uniqueness is case-insensitive, and vehicle registrations are normalized to uppercase with collapsed spaces. Unique indexes enforce duplicate protection across concurrent requests.

Store and schedule reads are restricted to the store assigned to the authenticated account. Administrators can manage master data and review bookings. Store accounts can edit or cancel bookings only while pending review, and can confirm goods only for approved bookings in their own scope. Booking items preserve the catalog item ID, name, unit, and validated weight as a historical snapshot.

Editable vehicle fields are `registration`, `name`, `type`, `capacity`, `driver`, and `status`. Driver is optional. Vehicle types are Truck, Van, and Lorry. Status values are Available, In transit, Maintenance, and Inactive. Capacity is measured in kg.

Editable item fields are `name`, `category`, `unit`, `weight`, and `status`. Categories are Dry goods, Dairy, Produce, Beverages, Household, and Other. Units are bag, carton, crate, box, bottle, piece, and kg. Item status is Active or Inactive. Weight is kg per unit. An item whose unit is kg must have weight 1.

PUT requires all required editable fields. PATCH accepts a subset. Unknown fields are rejected. An optional `version` in update/delete bodies must match the latest record. The frontend sends it automatically. Model-level optimistic concurrency also rejects overlapping document saves with HTTP 409. Errors include a `message`, with optional structured `details` for capacity and missing-item errors. Invalid input returns 400, missing records 404, conflicts 409, and inactive/overweight loads 422.

## Load validation

Both validation endpoints accept only this body shape.

```json
{
  "lines": [
    { "itemId": "<MongoDB item ID>", "quantity": 4, "unit": "bag" }
  ]
}
```

A load contains 1–100 distinct item lines. Positive numeric quantities are required. Packaged units require whole numbers. kg supports three decimal places. Individual capacity, weight and quantity values are limited to 1,000,000 and three decimal places. The server calculates weights from current active MongoDB catalog items in integer grams. Client-supplied weights, duplicate items, wrong units, inactive/deleted items, and unsafe totals are rejected. A total equal to vehicle capacity is accepted.

`calculateLoad(lines)` and `validateVehicleLoad(vehicleId, lines)` are exported from `src/validators/load.js` for booking and trip services. Booking creation recalculates each line against active catalog items and stores the result in its item snapshots. `validatePayloadCapacity` is Express middleware that reads `req.params.vehicleId` or `req.body.vehicleId`, validates `req.body.lines`, and attaches `req.validatedLoad`.

The load endpoint checks current availability and capacity. It does not reserve a vehicle. Frontend booking submission sends item IDs, quantities, and units; the server recalculates authoritative weights before saving.

## Verification

```sh
npm test --workspace backend
npm run build
```

The tests create and delete a generated `fleet_test_*` database. Set `MONGODB_TEST_URI` to run them against a MongoDB host with permission to create and drop that test database. They never drop the configured application database. Tests cover authentication and password recovery, store scoping, booking lifecycle and goods receipt, CRUD, validation, uniqueness, role permissions, stale/concurrent updates, and load calculations.

Browser checks verified vehicle and item creation, editing, deletion, reload persistence, and the booking draft's server-side item validation. Sample data was seeded locally. Temporary UI test records were soft deleted after verification.
