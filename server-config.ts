import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";

// Load environment variables from .env file if present
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Centralized persistent directory configuration
const defaultDataDir = path.join(process.cwd(), "data");
let DATA_DIR = process.env.DATA_DIR || defaultDataDir;
let UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(DATA_DIR, "uploads");
let DB_BACKUP_FILE = process.env.DB_BACKUP_FILE || path.join(DATA_DIR, "archive-database.json");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/research_archive";
const REQUIRE_MONGODB = process.env.REQUIRE_MONGODB === "true";

// JWT Secret validation & initialization
const rawJwtSecret = process.env.JWT_SECRET;
let JWT_SECRET = rawJwtSecret;

if (!JWT_SECRET || JWT_SECRET.trim() === "" || JWT_SECRET.includes("CHANGE_ME")) {
  if (isProduction) {
    JWT_SECRET = crypto.randomBytes(32).toString("hex");
    console.log("[Security] Notice: No persistent JWT_SECRET set in environment. Auto-generated secure 256-bit runtime JWT secret.");
  } else {
    JWT_SECRET = "dev_research_archive_secret_key_local_only_2026";
  }
}

const ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || (isProduction ? undefined : "adminpassword2026");

// Helper to mask sensitive database credentials in log outputs
function getSanitizedMongoUri(uri: string = MONGODB_URI): string {
  try {
    return uri.replace(/\/\/(.*?):(.*?)@/, (_, user) => `//${user}:******@`);
  } catch {
    return "mongodb://[sanitized-credentials]";
  }
}

// Ensure required writable storage paths exist on filesystem
function ensureStorageDirectories(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    const dbDir = path.dirname(DB_BACKUP_FILE);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
  } catch (err) {
    console.warn(`[Storage] Primary data dir (${DATA_DIR}) not writable. Falling back to local/tmp storage:`, err);
    try {
      const fallbackDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(fallbackDir)) {
        fs.mkdirSync(fallbackDir, { recursive: true });
      }
      DATA_DIR = fallbackDir;
      UPLOAD_DIR = path.join(fallbackDir, "uploads");
      DB_BACKUP_FILE = path.join(fallbackDir, "archive-database.json");
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }
    } catch (fallbackErr) {
      console.error("[Storage] Fatal: Unable to initialize any storage directories:", fallbackErr);
    }
  }
}

// Run directory verification immediately
ensureStorageDirectories();

export const config = {
  PORT,
  NODE_ENV,
  isProduction,
  DATA_DIR,
  UPLOAD_DIR,
  DB_BACKUP_FILE,
  MONGODB_URI,
  REQUIRE_MONGODB,
  JWT_SECRET: JWT_SECRET as string,
  ADMIN_DEFAULT_PASSWORD,
  getSanitizedMongoUri,
  ensureStorageDirectories,
};
