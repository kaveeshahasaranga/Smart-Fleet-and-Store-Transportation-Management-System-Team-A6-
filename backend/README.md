# Vehicle and item backend

Hasaranga's vehicle CRUD, item catalog CRUD, quantity/unit validation, and vehicle payload checks are implemented with Express and MongoDB. The vehicle and item frontend screens call these APIs. Booking drafts remain local until the booking API owner integrates persistence and submission.

## Run locally

From the repository root, install dependencies with `npm install`. Copy `backend/.env.example` to `backend/.env`, set `MONGODB_URI`, and start MongoDB.

For the local preview before login integration, set `NODE_ENV=development` and `DEV_MASTER_DATA_ACCESS=true` in your untracked backend `.env`. This grants admin access only to requests whose actual socket address is loopback. The committed example disables this mode, and production always ignores it. The current workstation's local `.env` enables this development preview.

Run these commands from the root in separate terminals.

```sh
npm run seed --workspace backend
npm run dev:backend
npm run dev:frontend
```

Seeding adds missing sample records and preserves existing active records. It is blocked in production. The frontend uses `VITE_API_URL`, defaulting to `http://localhost:5000/api`. `CLIENT_URL` accepts comma-separated exact frontend origins, including localhost and 127.0.0.1 for local development.

## Login integration

The login owner should set the same HS256 `JWT_SECRET` on the login service and this backend. The secret must contain at least 32 characters. Tokens must have a nonempty string `sub`, an expiration `exp`, and a lowercase `role` of `admin`, `store`, or `customer`. Requests send `Authorization: Bearer <token>`. Invalid or expired tokens return 401. Admin-only operations return 403 for store/customer accounts.

The frontend login code calls `setApiAccessToken(token)` from `frontend/src/services/api.js` after sign-in or session restoration. Calling `setApiAccessToken(null)` clears the token on sign-out. This refreshes the catalog and fleet provider. Tokens are kept in memory. Authentication pages and token issuance belong to the team's authentication module.

## Endpoints

All successful single-record responses use `{ "data": { ... } }`, and lists use `{ "data": [...] }`. Records expose MongoDB IDs as `id` and the concurrency counter as `version`.

| Method | Path under `/api` | Access | Behavior |
| --- | --- | --- | --- |
| GET | `/health` | Public | API health |
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

`calculateLoad(lines)` and `validateVehicleLoad(vehicleId, lines)` are exported from `src/validators/load.js` for booking and trip services. `validatePayloadCapacity` is Express middleware that reads `req.params.vehicleId` or `req.body.vehicleId`, validates `req.body.lines`, and attaches `req.validatedLoad`.

The load endpoint checks current availability and capacity. The trip/booking owner must call the validator in their write path and enforce atomic allocation/reservation when assigning a vehicle. Validation itself does not reserve a vehicle. Frontend draft saving already calls `/items/validate-lines` to capture server-validated item weights and units.

## Verification

```sh
npm test --workspace backend
npm run build
```

The tests create and delete a generated `fleet_test_*` database on local MongoDB. Set `MONGODB_TEST_URI` to use another MongoDB host. They never drop the configured application database. Twelve tests cover CRUD, input validation, uniqueness, role permissions, token failures, stale/concurrent updates, production development-access rejection, catalog line validation, fractional kg, and exact/over-capacity loads.

Browser checks verified vehicle and item creation, editing, deletion, reload persistence, and the booking draft's server-side item validation. Sample data was seeded locally. Temporary UI test records were soft deleted after verification.
