# Research Archive — QNAP NAS Production Deployment Guide

This guide provides step-by-step instructions for deploying the **Research Archive** web application to a QNAP NAS using **Container Station** and **Docker Compose**.

---

## 1. Architecture Overview

The production architecture consists of two isolated containers running on an internal Docker bridge network:

```
                      ┌────────────────────────────────────────┐
                      │              QNAP NAS Host             │
                      │                                        │
                      │  Port 3000 (or custom via APP_PORT)    │
                      └───────────────────▲────────────────────┘
                                          │
                                          │ HTTP Traffic
                                          ▼
                      ┌────────────────────────────────────────┐
                      │          research_archive_app          │
                      │      (Node.js 22 + Express + SPA)      │
                      └───────┬────────────────────────▲───────┘
                              │                        │
       Stores Uploads & JSON  │                        │ MongoDB Query Protocol
       Fallback Backups       │                        │ (Internal Docker Network)
                              ▼                        │
         ┌───────────────────────────────┐             │
         │   NAS Host Shared Storage:    │             │
         │  /share/.../app-data          │             │
         └───────────────────────────────┘             ▼
                                        ┌──────────────────────────────┐
                                        │    research_archive_mongo    │
                                        │        (MongoDB 7.x)         │
                                        └──────────────┬───────────────┘
                                                       │
                                  Stores B-Tree Engine │
                                  Collections & Indexes│
                                                       ▼
                                        ┌──────────────────────────────┐
                                        │   NAS Host Shared Storage:   │
                                        │  /share/.../mongo-data       │
                                        └──────────────────────────────┘
```

### Persistent Data Volumes
1. **Application Data (`app-data`)**:
   - `uploads/`: Stores all publication PDFs, student research papers, thesis files, and cover photos uploaded through multipart form requests.
   - `archive-database.json`: Automatic local backup snapshot.
2. **Database Storage (`mongo-data`)**:
   - Stores the high-performance MongoDB persistent database files (users, papers, projects, tickets, chats, topics, researchers).

---

## 2. Prerequisites

1. **QNAP NAS** running QTS 5.0+ or QuTS hero with **Container Station 3.x** installed from the App Center.
2. An accessible Shared Folder on your Storage Pool (e.g. `Container` or `Public`).
3. (Optional but recommended) SSH access enabled under *Control Panel > Network & File Services > SSH / Telnet*.

---

## 3. Directory Setup on QNAP

Create the dedicated project folders on your NAS shared volume.

### Example Paths
Assuming your shared folder is `/share/Container`:

```bash
# Create project folder hierarchy
mkdir -p /share/Container/research-archive/app-data/uploads
mkdir -p /share/Container/research-archive/mongo-data

# Ensure write permissions for container processes
chmod -R 777 /share/Container/research-archive/app-data
chmod -R 777 /share/Container/research-archive/mongo-data
```

---

## 4. Configuration (`.env`)

Copy `.env.example` to `.env` in your project folder:

```bash
cp .env.example .env
```

Open `.env` and configure your production credentials:

```ini
# Application Configuration
NODE_ENV=production
PORT=3000
APP_PORT=3000

# Security - Generate a random 32+ character key (e.g., openssl rand -hex 32)
JWT_SECRET=b8d7a469e32f1059f9c73e04918ef9a0937a4e610368b753a992bc804fa3e990

# Enforce MongoDB Database
REQUIRE_MONGODB=true

# MongoDB Root Authentication
MONGO_INITDB_ROOT_USERNAME=archive_admin
MONGO_INITDB_ROOT_PASSWORD=YourStrongDatabasePassword123!

# QNAP Shared Folder Host Mounts
NAS_APP_DATA_PATH=/share/Container/research-archive/app-data
NAS_MONGO_DATA_PATH=/share/Container/research-archive/mongo-data

# Optional: Set fixed initial admin password (or leave blank to auto-generate)
ADMIN_DEFAULT_PASSWORD=AdminSecurePassword2026!
```

---

## 5. Deployment Methods

### Method A: Using Docker Compose via SSH (Recommended)

1. Connect to your QNAP NAS via SSH:
   ```bash
   ssh admin@<NAS-IP-ADDRESS>
   ```
2. Navigate to your project directory:
   ```bash
   cd /share/Container/research-archive
   ```
3. Build and launch the containers in the background:
   ```bash
   docker compose up -d --build
   ```
4. Verify both containers are running and healthy:
   ```bash
   docker compose ps
   ```

---

### Method B: Using QNAP Container Station UI

1. Open **Container Station** in QTS / QuTS hero.
2. Click on **Applications** (or **Stacks**) in the left sidebar.
3. Click **Create Application** / **Create Stack**.
4. Name the application: `research-archive`.
5. Paste the contents of `docker-compose.yml` into the YAML editor.
6. Click **Environment Variables** or provide the variables from your `.env` file.
7. Click **Create** / **Deploy**.

---

## 6. Verifying Deployment & Health Checks

### Check System Status
You can verify application health directly using the built-in health endpoint:

```bash
curl http://<NAS-IP-ADDRESS>:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "environment": "production",
  "storage": {
    "uploads": "ready",
    "dataDir": "ready"
  }
}
```

### Inspect Container Logs
```bash
# App logs
docker logs -f research_archive_app

# MongoDB logs
docker logs -f research_archive_mongo
```

---

## 7. Maintenance & Updates

### Non-Destructive Container Updates
Because all user uploads and database records live in the host-mounted folders (`NAS_APP_DATA_PATH` and `NAS_MONGO_DATA_PATH`), updating the application container will never lose your documents or database entries.

To pull latest changes and update:
```bash
cd /share/Container/research-archive
git pull origin main
docker compose up -d --build
```

### Backups

1. **MongoDB Database Backup**:
   ```bash
   docker exec -it research_archive_mongo mongodump \
     --username archive_admin \
     --password YourStrongDatabasePassword123! \
     --authenticationDatabase admin \
     --db research_archive \
     --out /data/db/backup_$(date +%Y%m%d)
   ```

2. **Uploaded Documents Backup**:
   Use QNAP's **Hybrid Backup Sync (HBS 3)** or `rsync` to back up the `/share/Container/research-archive/app-data` directory to another NAS volume, external USB drive, or cloud storage (Google Cloud / AWS S3 / Backblaze).

---

## 8. Troubleshooting

| Symptom | Cause | Solution |
|---|---|---|
| App container exits immediately on startup | `JWT_SECRET` is missing, short, or set to placeholder value | Set a 32+ character `JWT_SECRET` in `.env` |
| `database: "disconnected"` in `/api/health` | MongoDB container not started or invalid credentials | Check `docker logs research_archive_mongo` and verify `MONGO_INITDB_ROOT_PASSWORD` matches `MONGODB_URI` |
| File uploads fail with 500 error | Permissions issue on host shared folder | Run `chmod -R 777 /share/Container/research-archive/app-data` |
| Port conflict on 3000 | Another QNAP application is using port 3000 | Change `APP_PORT=3080` in `.env` and access at `http://<NAS-IP>:3080` |
