# NovaPay Backend

## Project Overview
NovaPay is a high-performance, microservices-based digital banking and transaction backend. It is designed for reliability, idempotency, and scalability, ensuring secure and accurate handling of transactions, FX rates, payroll, and audit logs.  

This system is divided into the following microservices:  

- Account Service – User wallets and account management  
- Transaction Service – Handles domestic and international transactions  
- Ledger Service – Double-entry bookkeeping system  
- FX Service – Locked FX rate quotes and validation  
- Payroll Service – Bulk payroll disbursement with queue  
- Admin Service – Audit logs and administrative operations  

All services communicate via internal network and are orchestrated using Docker Compose with PostgreSQL as the primary database.  

---

## Project Structure

```
nova-pay-backend/
├─ docker-compose.yml
├─ .env
├─ README.md
├─ services/
│  ├─ account-service/
│  ├─ transaction-service/
│  ├─ ledger-service/
│  ├─ fx-service/
│  ├─ payroll-service/
│  └─ admin-service/
├─ shared/
│  ├─ utils/
│  └─ dtos/
```

### Explanation:
- Each service has its own Dockerfile and source code.  
- shared contains common utilities (encryption, logging, idempotency) and DTOs.  
- .env contains environment variables for DB and service configuration.  

---

## Features

- Microservice Architecture – Each service isolated with its own database connection.  
- Idempotency & Transaction Safety – Prevent duplicate disbursements and ensure atomic transactions.  
- Double-entry Ledger – Every transaction creates a debit and a credit, ensuring money is never lost.  
- FX Rate Locking – Time-locked FX quotes for international transfers.  
- Bulk Payroll – Queue-based processing to handle high-volume salary disbursements.  
- Admin Audit Logs – Track all critical actions for compliance.  
- Security – Field-level encryption for sensitive data.  
- Dockerized – Easy deployment via Docker Compose.  

---

## Setup Instructions

```bash
git clone https://github.com/ShourovHasan07/Novopay
cd Novopay
```

### Configure Environment Variables

```env
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=shourov123
POSTGRES_DB=novapay_db

# Service ports
ADMIN_SERVICE_PORT=3007
ACCOUNT_SERVICE_PORT=3001
TRANSACTION_SERVICE_PORT=3002
LEDGER_SERVICE_PORT=3003
FX_SERVICE_PORT=3004
PAYROLL_SERVICE_PORT=3006
```

### Start Docker containers

```bash
docker-compose up -d
```

### Install dependencies for each service

```bash
cd account-service
npm install

cd ../ledger-service
npm install
# repeat for other services
```

### Run services individually (for development)

```bash
cd account-service
npm run start:dev
```

---

## API Endpoints

### 1. Account Service

**POST /accounts**

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "balance": 1000
}
```

Response:
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "balance": 1000
}
```

---

### 2. Ledger Service

**POST /ledger**

Request Body:
```json
{
  "transactionId": "txn_001",
  "amount": 100,
  "type": "credit"
}
```

Response:
```json
{
  "id": "uuid",
  "transactionId": "txn_001",
  "amount": 100,
  "type": "credit",
  "successful": true
}
```

---

### 3. FX Service

**POST /fx**

Request Body:
```json
{
  "fromCurrency": "USD",
  "toCurrency": "EUR",
  "rate": 1.05
}
```

Response:
```json
{
  "id": "uuid",
  "fromCurrency": "USD",
  "toCurrency": "EUR",
  "rate": 1.05,
  "expiresAt": "2026-04-07T10:07:22Z",
  "used": false
}
```

---

### 4. Payroll Service

**POST /payroll**

Request Body:
```json
{
  "employerId": "uuid",
  "employees": [{ "id": "emp1", "amount": 100 }],
  "idempotencyKey": "key_123"
}
```

Response:
```json
{
  "jobId": "uuid",
  "status": "queued"
}
```

---

### 5. Admin Service

**POST /admin/audit-log**

```json
{
  "id": "be070e45-7d9b-4f5d-8a10-3d1bc6aad1b8",
  "userId": "user-123",
  "action": "CREATED_TRANSACTION",
  "metadata": {
    "amount": 500,
    "currency": "USD"
  },
  "updatedAt": "2026-04-07T14:03:28.705Z",
  "createdAt": "2026-04-07T14:03:28.705Z"
}
```

---

## Idempotency Scenarios

- Duplicate request with same idempotency key → Returns previous response, does not create new job.  
- Expired idempotency key → Creates new job, previous request ignored.  
- Partial failure during processing → Job resumes from last checkpoint.  
- Concurrent requests with same key → Only one job created, race conditions prevented.  
- Invalid idempotency key → Returns 400 Bad Request.  

---

## Double-entry Ledger Invariant

Every transaction affects two accounts: debit and credit.  
Ledger invariant ensures: Σcredits = Σdebits at all times.  

Verification: a cron job or service reads ledger totals and validates equality.  

---

## FX Quote Strategy

- TTL: Each FX quote expires in 60s.  
- Single-use: A quote can only be used once.  
- Failure handling: If FX provider fails, system retries or rejects transaction gracefully.  

---

## Payroll Resumability

Uses BullMQ queue + Redis.  

Checkpoint Pattern:  
Job updates its status (queued, processing, completed) after each employee disbursement.  

On crash, job resumes from last checkpoint.  

---

## Audit Hash Chain

Each ledger entry stores a hash of previous entry.  

Tamper detection: any modification breaks hash chain → alerts generated.  
Ensures data integrity.  

---

## Tradeoffs

- Time pressure → simple synchronous FX and payroll handling instead of complex async microtransactions.  
- Logging and error handling basic; can be extended.  
- No real-time notification system yet.  
