import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// Path to your SQLite database file
const DB_PATH = path.resolve("../../../database.sqlite");

// Create database connection
const db = new Database(DB_PATH);

// Load your schema.sql if tables don’t exist
const schemaPath = path.resolve("data-base/schema.sql");
const schemaSQL = fs.readFileSync(schemaPath, "utf8");

// Run the schema (CREATE TABLE IF NOT EXISTS means safe to run multiple times)
db.exec(schemaSQL);

console.log("✅ SQLite database initialized from schema.sql");

export default db;
