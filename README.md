# Traffic Urban Management System - Microservices

## Description

Traffic Urban Management System is a distributed web services project based on a microservices architecture.

The system provides an intelligent urban traffic management platform that allows users to manage vehicles, GPS positions, traffic zones, incidents, notifications, and secure access using JWT authentication with role-based authorization.

The project uses an API Gateway with GraphQL as the single entry point. The gateway communicates with independent REST microservices.

---

## Global Architecture

```text
Client / Postman / GraphQL Playground
                |
                v
        API Gateway GraphQL
        http://localhost:3000/graphql
                |
    -------------------------------------------------
    |           |            |           |           |
    v           v            v           v           v
Auth       Vehicle       Traffic     Incident   Notification
Service    Service       Service     Service    Service
:3001      :3002         :3003       :3004      :3005
    |           |            |           |           |
    v           v            v           v           v
PostgreSQL PostgreSQL    PostgreSQL  PostgreSQL PostgreSQL
Database   Database      Database    Database   Database
```

The client communicates only with the GraphQL API Gateway. The gateway calls the appropriate REST microservice internally.

---

## Services

| Service | Type | Port | Responsibility |
|---|---|---:|---|
| api-gateway | GraphQL | 3000 | Single entry point for the client |
| auth-service | REST | 3001 | Register, login, JWT generation, users |
| vehicle-service | REST | 3002 | Vehicles and GPS positions |
| traffic-service | REST | 3003 | Traffic zones, density, congestion |
| incident-service | REST | 3004 | Incidents and status updates |
| notification-service | REST | 3005 | Notifications and read status |

---

## Technologies Used

- NestJS
- GraphQL
- Apollo Server
- REST APIs
- PostgreSQL
- TypeORM
- JWT Authentication
- Passport JWT
- Role-based authorization
- Postman
- Git / GitHub
- concurrently

---

## Project Structure

```text
traffic-urban-system/
├── api-gateway/
│   └── GraphQL Gateway
├── auth-service/
│   └── Auth + Users + JWT
├── vehicle-service/
│   └── Vehicles + GPS positions
├── traffic-service/
│   └── Traffic zones + density + congestion
├── incident-service/
│   └── Incidents
├── notification-service/
│   └── Notifications
├── package.json
├── README.md
└── .gitignore
```

---

## Databases

Each microservice has its own PostgreSQL database.

```text
traffic_auth_db
traffic_vehicle_db
traffic_traffic_db
traffic_incident_db
traffic_notification_db
```

This keeps each service independent and avoids direct coupling between microservices.

---

## Create Databases

Run these SQL commands in pgAdmin or SQL Shell:

```sql
CREATE DATABASE traffic_auth_db;
CREATE DATABASE traffic_vehicle_db;
CREATE DATABASE traffic_traffic_db;
CREATE DATABASE traffic_incident_db;
CREATE DATABASE traffic_notification_db;
```

---

## Environment Variables

Each service has its own `.env` file.

Important: `.env` files must not be pushed to GitHub.

### auth-service/.env

```env
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=traffic_auth_db

JWT_SECRET=traffic_secret_key
JWT_EXPIRES_IN=1d
```

### vehicle-service/.env

```env
PORT=3002

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=traffic_vehicle_db
```

### traffic-service/.env

```env
PORT=3003

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=traffic_traffic_db
```

### incident-service/.env

```env
PORT=3004

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=traffic_incident_db
```

### notification-service/.env

```env
PORT=3005

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=traffic_notification_db
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/traffic-urban-system.git
```

Go to the project folder:

```bash
cd traffic-urban-system
```

Install the root dependencies:

```bash
npm install
```

Then install dependencies inside each service:

```bash
cd api-gateway
npm install

cd ../auth-service
npm install

cd ../vehicle-service
npm install

cd ../traffic-service
npm install

cd ../incident-service
npm install

cd ../notification-service
npm install

cd ..
```

---

## Run All Services

From the root folder:

```bash
npm run start:dev
```

This command starts all services using `concurrently`.

```text
api-gateway           http://localhost:3000/graphql
auth-service          http://localhost:3001
vehicle-service       http://localhost:3002
traffic-service       http://localhost:3003
incident-service      http://localhost:3004
notification-service  http://localhost:3005
```

---

## API Gateway GraphQL

GraphQL endpoint:

```text
http://localhost:3000/graphql
```

The API Gateway is the only entry point for the client. It forwards requests to the correct REST microservice.

---

## Authentication and Authorization

The system uses JWT authentication and role-based authorization.

Roles:

```text
ADMIN
OPERATOR
```

After login, the user receives an `accessToken`. This token must be added to GraphQL HTTP headers:

```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

---

## Role Permissions

| Feature | ADMIN | OPERATOR |
|---|---:|---:|
| Register / Login | Yes | Yes |
| Create vehicle | Yes | No |
| View vehicles | Yes | Yes |
| Add GPS position | Yes | Yes |
| Create traffic zone | Yes | No |
| View traffic zones | Yes | Yes |
| Update traffic density | Yes | No |
| Create incident | Yes | Yes |
| View incidents | Yes | Yes |
| Update incident status | Yes | No |
| Create notification | Yes | No |
| View notifications | Yes | Yes |
| Mark notification as read | Yes | Yes |

---

## Main Features

### 1. Authentication Service

- Register users
- Login users
- Generate JWT token
- Manage user roles: `ADMIN`, `OPERATOR`

### 2. Vehicle Service

- Create vehicles
- List vehicles
- Get vehicle details
- Add simulated GPS positions
- Get vehicle movement history

### 3. Traffic Service

- Create traffic zones
- Measure traffic density
- Detect congested zones
- Classify traffic level: `FAIBLE`, `MOYEN`, `ELEVE`

### 4. Incident Service

- Declare incidents
- View incidents
- Get incident details
- Update incident status

Incident types:

```text
ACCIDENT
TRAVAUX
ROUTE_FERMEE
EMBOUTEILLAGE
```

Incident statuses:

```text
SIGNALE
EN_COURS
RESOLU
```

### 5. Notification Service

- Create notifications
- View notifications
- Get notification details
- Mark notification as read

---

## GraphQL Examples

### Register Admin

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

### Register Operator

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

### Login

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

---

## Vehicle Service GraphQL Examples

### Create Vehicle

Only `ADMIN` can create vehicles.

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

### Get Vehicles

`ADMIN` and `OPERATOR` can view vehicles.

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

### Get Vehicle Details

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

### Add GPS Position

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

### Get Vehicle History

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

## Traffic Service GraphQL Examples

### Create Traffic Zone

Only `ADMIN` can create traffic zones.

```graphql
mutation {
  createTrafficZone(input: {
    name: "Zone Centre Ville"
    location: "Tunis Centre"
    vehicleCount: 85
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

### Get Traffic Zones

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

### Update Traffic Density

Only `ADMIN` can update traffic density.

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

### Get Congested Zones

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

Traffic classification:

```text
0 - 30 vehicles      FAIBLE
31 - 70 vehicles     MOYEN
More than 70         ELEVE
```

A zone is considered congested when its level is `ELEVE`.

---

## Incident Service GraphQL Examples

### Create Incident

`ADMIN` and `OPERATOR` can create incidents.

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

### Get Incidents

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

### Get Incident By ID

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

### Update Incident Status

Only `ADMIN` can update incident status.

```graphql
mutation {
  updateIncidentStatus(input: {
    incidentId: 1
    status: "RESOLU"
  }) {
    id
    status
  }
}
```

---

## Notification Service GraphQL Examples

### Create Notification

Only `ADMIN` can create notifications.

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

### Get Notifications

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

### Get Notification By ID

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

### Mark Notification As Read

```graphql
mutation {
  markNotificationAsRead(input: {
    notificationId: 1
  }) {
    id
    title
    isRead
  }
}
```

---

## REST Microservices Endpoints

### Auth Service

```text
POST http://localhost:3001/auth/register
POST http://localhost:3001/auth/login
GET  http://localhost:3001/users
```

### Vehicle Service

```text
POST http://localhost:3002/vehicles
GET  http://localhost:3002/vehicles
GET  http://localhost:3002/vehicles/:id
POST http://localhost:3002/vehicles/gps
GET  http://localhost:3002/vehicles/:id/history
```

### Traffic Service

```text
POST  http://localhost:3003/traffic-zones
GET   http://localhost:3003/traffic-zones
GET   http://localhost:3003/traffic-zones/:id
PATCH http://localhost:3003/traffic-zones/density
GET   http://localhost:3003/traffic-zones/congested
```

### Incident Service

```text
POST  http://localhost:3004/incidents
GET   http://localhost:3004/incidents
GET   http://localhost:3004/incidents/:id
PATCH http://localhost:3004/incidents/status
```

### Notification Service

```text
POST  http://localhost:3005/notifications
GET   http://localhost:3005/notifications
GET   http://localhost:3005/notifications/:id
PATCH http://localhost:3005/notifications/read
```

---

## Postman Collection

The project uses a Postman collection named:

```text
Traffic Urban Microservices
```

The collection contains:

```text
01 - Auth Service REST
02 - API Gateway GraphQL
03 - Vehicle Service REST
04 - Traffic Service REST
05 - Incident Service REST
06 - Notification Service REST
```

Recommended collection variables:

```text
gatewayUrl              http://localhost:3000/graphql
authServiceUrl          http://localhost:3001
vehicleServiceUrl       http://localhost:3002
trafficServiceUrl       http://localhost:3003
incidentServiceUrl      http://localhost:3004
notificationServiceUrl  http://localhost:3005
token                   YOUR_ACCESS_TOKEN
```

---

## Security Tests

### Test Without Token

Request:

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

### OPERATOR Tries to Create Vehicle

Expected result:

```text
Forbidden
```

### ADMIN Creates Vehicle

Expected result:

```text
Vehicle created successfully
```

### OPERATOR Creates Incident

Expected result:

```text
Incident created successfully
```

### OPERATOR Tries to Update Incident Status

Expected result:

```text
Forbidden
```

---

## UML Diagrams

The project includes:

```text
Use Case Diagram
Class Diagram
Architecture Diagram
Sequence Diagram
```

The architecture diagram shows:

```text
Client
  ↓
API Gateway GraphQL
  ↓
REST Microservices
  ↓
PostgreSQL Databases
```

---

## Bonus Features

Implemented:

```text
Microservices architecture
API Gateway GraphQL
JWT authentication
Role-based authorization
Postman collection
Single command start with concurrently
```

Possible future improvements:

```text
Docker Compose
WebSocket real-time notifications
React / Next.js dashboard
Interactive map
CI/CD pipeline
Unit tests
```

---

## References

- NestJS GraphQL documentation: https://docs.nestjs.com/graphql/quick-start
- NestJS Guards documentation: https://docs.nestjs.com/guards
- NestJS Authentication documentation: https://docs.nestjs.com/security/authentication
- NestJS Microservices documentation: https://docs.nestjs.com/microservices/basics
- Postman Variables documentation: https://learning.postman.com/docs/sending-requests/variables/variables/
- concurrently GitHub repository: https://github.com/open-cli-tools/concurrently

---

## Author

Sirine Messaoudi
