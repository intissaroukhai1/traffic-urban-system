# GraphQL Test Requests - Traffic Urban Microservices

GraphQL Gateway URL:

```text
http://localhost:3000/graphql
```

All GraphQL requests must be executed from the API Gateway.

---

## 1. Authentication

### 1.1 Register Admin

```graphql
mutation {
  register(input: {
    fullName: "Admin Test"
    email: "admin.test@test.com"
    password: "123456"
    role: "ADMIN"
  }) {
    accessToken
    user {
      id
      fullName
      email
      role
    }
  }
}
```

Expected result:

```text
role: ADMIN
accessToken returned
```

---

### 1.2 Register Operator

```graphql
mutation {
  register(input: {
    fullName: "Operator Test"
    email: "operator.test@test.com"
    password: "123456"
    role: "OPERATOR"
  }) {
    accessToken
    user {
      id
      fullName
      email
      role
    }
  }
}
```

Expected result:

```text
role: OPERATOR
accessToken returned
```

---

### 1.3 Login Admin

```graphql
mutation {
  login(input: {
    email: "admin.test@test.com"
    password: "123456"
  }) {
    accessToken
    user {
      email
      role
    }
  }
}
```

Copy the access token and add it in HTTP Headers:

```json
{
  "Authorization": "Bearer ADMIN_TOKEN_HERE"
}
```

---

### 1.4 Login Operator

```graphql
mutation {
  login(input: {
    email: "operator.test@test.com"
    password: "123456"
  }) {
    accessToken
    user {
      email
      role
    }
  }
}
```

Copy the access token and add it in HTTP Headers:

```json
{
  "Authorization": "Bearer OPERATOR_TOKEN_HERE"
}
```

---

## 2. Vehicle Service

### 2.1 Create Vehicle - ADMIN only

```graphql
mutation {
  createVehicle(input: {
    plateNumber: "TU-1000"
    type: "Bus"
    status: "ACTIVE"
  }) {
    id
    plateNumber
    type
    status
  }
}
```

Expected with ADMIN token:

```text
Vehicle created successfully
```

Expected with OPERATOR token:

```text
Forbidden
```

---

### 2.2 Get All Vehicles - ADMIN and OPERATOR

```graphql
query {
  vehicles {
    id
    plateNumber
    type
    status
  }
}
```

---

### 2.3 Get Vehicle By ID - ADMIN and OPERATOR

```graphql
query {
  vehicle(id: 1) {
    id
    plateNumber
    type
    status
    positions {
      id
      latitude
      longitude
      timestamp
    }
  }
}
```

---

### 2.4 Add GPS Position - ADMIN and OPERATOR

```graphql
mutation {
  addGpsPosition(input: {
    vehicleId: 1
    latitude: 36.8065
    longitude: 10.1815
  }) {
    id
    latitude
    longitude
    timestamp
  }
}
```

---

### 2.5 Get Vehicle History - ADMIN and OPERATOR

```graphql
query {
  vehicleHistory(vehicleId: 1) {
    id
    latitude
    longitude
    timestamp
  }
}
```

---

## 3. Traffic Service

### 3.1 Create Traffic Zone - ADMIN only

```graphql
mutation {
  createTrafficZone(input: {
    name: "Zone Centre Ville"
    location: "Tunis Centre"
    vehicleCount: 20
  }) {
    id
    name
    location
    vehicleCount
    density
    level
    congested
  }
}
```

Expected result:

```text
level: FAIBLE
congested: false
```

---

### 3.2 Create High Traffic Zone - ADMIN only

```graphql
mutation {
  createTrafficZone(input: {
    name: "Zone Lac 2"
    location: "Tunis Lac 2"
    vehicleCount: 95
  }) {
    id
    name
    location
    vehicleCount
    density
    level
    congested
  }
}
```

Expected result:

```text
level: ELEVE
congested: true
```

---

### 3.3 Get All Traffic Zones - ADMIN and OPERATOR

```graphql
query {
  trafficZones {
    id
    name
    location
    vehicleCount
    density
    level
    congested
  }
}
```

---

### 3.4 Get Traffic Zone By ID - ADMIN and OPERATOR

```graphql
query {
  trafficZone(id: 1) {
    id
    name
    location
    vehicleCount
    density
    level
    congested
  }
}
```

---

### 3.5 Update Traffic Density - ADMIN only

```graphql
mutation {
  updateTrafficDensity(input: {
    zoneId: 1
    vehicleCount: 25
  }) {
    id
    name
    vehicleCount
    density
    level
    congested
  }
}
```

Expected with ADMIN token:

```text
level: FAIBLE
congested: false
```

Expected with OPERATOR token:

```text
Forbidden
```

---

### 3.6 Get Congested Zones - ADMIN and OPERATOR

```graphql
query {
  congestedZones {
    id
    name
    location
    vehicleCount
    level
    congested
  }
}
```

---

## 4. Incident Service

### 4.1 Create Incident - ADMIN and OPERATOR

```graphql
mutation {
  createIncident(input: {
    type: "ACCIDENT"
    description: "Accident pres du centre-ville"
    location: "Tunis Centre"
  }) {
    id
    type
    description
    location
    status
    createdAt
  }
}
```

Expected result:

```text
status: SIGNALE
```

---

### 4.2 Create Traffic Jam Incident - ADMIN and OPERATOR

```graphql
mutation {
  createIncident(input: {
    type: "EMBOUTEILLAGE"
    description: "Embouteillage signale par operator"
    location: "Ariana"
  }) {
    id
    type
    description
    location
    status
    createdAt
  }
}
```

---

### 4.3 Get All Incidents - ADMIN and OPERATOR

```graphql
query {
  incidents {
    id
    type
    description
    location
    status
    createdAt
  }
}
```

---

### 4.4 Get Incident By ID - ADMIN and OPERATOR

```graphql
query {
  incident(id: 1) {
    id
    type
    description
    location
    status
    createdAt
  }
}
```

---

### 4.5 Update Incident Status To EN_COURS - ADMIN only

```graphql
mutation {
  updateIncidentStatus(input: {
    incidentId: 1
    status: "EN_COURS"
  }) {
    id
    type
    description
    location
    status
    createdAt
  }
}
```

Expected with ADMIN token:

```text
status: EN_COURS
```

Expected with OPERATOR token:

```text
Forbidden
```

---

### 4.6 Update Incident Status To RESOLU - ADMIN only

```graphql
mutation {
  updateIncidentStatus(input: {
    incidentId: 1
    status: "RESOLU"
  }) {
    id
    type
    description
    location
    status
    createdAt
  }
}
```

---

## 5. Notification Service

### 5.1 Create Notification - ADMIN only

```graphql
mutation {
  createNotification(input: {
    title: "Nouvel incident"
    message: "Un accident a ete signale dans la zone Centre Ville."
  }) {
    id
    title
    message
    isRead
    createdAt
  }
}
```

Expected with ADMIN token:

```text
isRead: false
```

Expected with OPERATOR token:

```text
Forbidden
```

---

### 5.2 Get All Notifications - ADMIN and OPERATOR

```graphql
query {
  notifications {
    id
    title
    message
    isRead
    createdAt
  }
}
```

---

### 5.3 Get Notification By ID - ADMIN and OPERATOR

```graphql
query {
  notification(id: 1) {
    id
    title
    message
    isRead
    createdAt
  }
}
```

---

### 5.4 Mark Notification As Read - ADMIN and OPERATOR

```graphql
mutation {
  markNotificationAsRead(input: {
    notificationId: 1
  }) {
    id
    title
    message
    isRead
    createdAt
  }
}
```

Expected result:

```text
isRead: true
```

---

## 6. Security Tests

### 6.1 Request Without Token

Remove the Authorization header, then run:

```graphql
query {
  vehicles {
    id
    plateNumber
  }
}
```

Expected result:

```text
Unauthorized
```

---

### 6.2 OPERATOR Tries ADMIN Action

Use OPERATOR token.

```graphql
mutation {
  createVehicle(input: {
    plateNumber: "TU-OPERATOR-100"
    type: "Taxi"
    status: "ACTIVE"
  }) {
    id
    plateNumber
  }
}
```

Expected result:

```text
Forbidden
```

---

### 6.3 ADMIN Tries ADMIN Action

Use ADMIN token.

```graphql
mutation {
  createVehicle(input: {
    plateNumber: "TU-ADMIN-100"
    type: "Bus"
    status: "ACTIVE"
  }) {
    id
    plateNumber
    type
    status
  }
}
```

Expected result:

```text
Vehicle created successfully
```

---

## 7. Final Test Checklist

```text
[ ] API Gateway works on http://localhost:3000/graphql
[ ] Auth service works
[ ] Vehicle service works
[ ] Traffic service works
[ ] Incident service works
[ ] Notification service works
[ ] ADMIN can execute all actions
[ ] OPERATOR can consult, add GPS, and create incidents
[ ] OPERATOR cannot create vehicles
[ ] OPERATOR cannot update traffic density
[ ] OPERATOR cannot update incident status
[ ] OPERATOR cannot create notifications
[ ] No token returns Unauthorized
```
