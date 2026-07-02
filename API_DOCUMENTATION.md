# ERP System API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints (except login) require JWT token in httpOnly cookie named `erp_token`.

## Endpoints

### Authentication

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

Response: 200 OK
{
  "ok": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": {
      "id": "role_id",
      "name": "Admin"
    }
  }
}
```

#### Logout
```
GET /auth/logout

Response: 200 OK
{
  "ok": true
}
```

### Demands

#### List Demands
```
GET /demands
Authorization: Required

Response: 200 OK
[
  {
    "id": "demand_id",
    "status": "pending",
    "requester": { "id": "user_id", "name": "John" },
    "lines": [
      {
        "id": "line_id",
        "item": { "id": "item_id", "name": "Fertilizer", "sku": "ITEM001" },
        "qty": 100
      }
    ],
    "createdAt": "2026-07-02T12:00:00Z"
  }
]
```

#### Create Demand
```
POST /demands
Authorization: Required
Content-Type: application/json

{
  "lines": [
    { "itemId": "item_id_1", "qty": 50 },
    { "itemId": "item_id_2", "qty": 30 }
  ]
}

Response: 201 Created
{
  "id": "demand_id",
  "status": "draft",
  "lines": [ ... ]
}
```

#### Get Demand Details
```
GET /demands/{id}
Authorization: Required

Response: 200 OK
{
  "id": "demand_id",
  "status": "pending",
  "requester": { ... },
  "lines": [ ... ],
  "approvals": [
    {
      "id": "approval_id",
      "level": 1,
      "approver": { ... },
      "decision": "approved",
      "comment": "OK",
      "decidedAt": "2026-07-02T13:00:00Z"
    }
  ]
}
```

#### Update Demand Status
```
PATCH /demands/{id}
Authorization: Required
Content-Type: application/json

{
  "status": "submitted"
}

Response: 200 OK
{ ... }
```

### Approvals

#### Get Pending Approvals
```
GET /approvals/pending
Authorization: Required

Response: 200 OK
[
  {
    "id": "approval_id",
    "level": 1,
    "demand": {
      "id": "demand_id",
      "lines": [ ... ],
      "requester": { ... }
    }
  }
]
```

#### Make Approval Decision
```
POST /approvals/{id}
Authorization: Required
Content-Type: application/json

{
  "decision": "approved",
  "comment": "Approved by manager"
}

Response: 200 OK
{
  "id": "approval_id",
  "decision": "approved",
  "decidedAt": "2026-07-02T13:00:00Z"
}
```

### Stock

#### Get Current Stock
```
GET /stock
Authorization: Required

Response: 200 OK
[
  {
    "id": "stock_id",
    "item": { "id": "item_id", "sku": "ITEM001", "name": "Fertilizer" },
    "quantity": 500,
    "reserved": 100
  }
]
```

#### Get Stock Ledger
```
GET /stock/ledger
Authorization: Required

Response: 200 OK
[
  {
    "id": "ledger_id",
    "item": { ... },
    "type": "IN",
    "quantity": 100,
    "createdAt": "2026-07-02T10:00:00Z"
  }
]
```

#### Stock In/Out
```
POST /stock/ledger
Authorization: Required
Content-Type: application/json

{
  "itemId": "item_id",
  "type": "IN",
  "quantity": 50
}

Response: 200 OK
{ "ok": true }
```

### Items

#### List Items
```
GET /items
Authorization: Required

Response: 200 OK
[
  {
    "id": "item_id",
    "sku": "ITEM001",
    "name": "Fertilizer Type A",
    "unit": "kg",
    "cost": 50,
    "price": 75
  }
]
```

#### Create Item
```
POST /items
Authorization: Required (Admin role)
Content-Type: application/json

{
  "sku": "ITEM005",
  "name": "New Item",
  "unit": "kg",
  "cost": 100,
  "price": 150
}

Response: 201 Created
{ ... }
```

### Users

#### List Users
```
GET /users
Authorization: Required

Response: 200 OK
[
  {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": { "id": "role_id", "name": "Admin" },
    "office": { "id": "office_id", "name": "State Office" }
  }
]
```

### Roles

#### List Roles
```
GET /roles
Authorization: Required

Response: 200 OK
[
  {
    "id": "role_id",
    "name": "Super Admin",
    "permissions": ["*"]
  },
  {
    "id": "role_id",
    "name": "Admin",
    "permissions": ["users:read", "users:write", "items:*"]
  }
]
```

### Offices

#### List Offices
```
GET /offices
Authorization: Required

Response: 200 OK
[
  {
    "id": "office_id",
    "name": "State Office",
    "type": "STATE",
    "parent": null,
    "children": [ ... ]
  }
]
```

### Reports

#### Dashboard Stats
```
GET /reports/dashboard
Authorization: Required

Response: 200 OK
{
  "totalDemands": 42,
  "pendingDemands": 5,
  "totalItems": 12,
  "totalUsers": 8,
  "recentAuditLogs": [ ... ]
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Error Response

```json
{
  "message": "Error description"
}
```
