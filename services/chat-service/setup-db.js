import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { promises as fs } from 'fs';    
import path from 'path';

const SCHEMA_FILE_PATH = path.join(process.cwd(), 'schema.sql');
const DB_PATH = './dev.db';
let db;

async function setupDatabase(db) {
    try {
        const schemaSql = await fs.readFile(SCHEMA_FILE_PATH, 'utf-8');
        
        if (!schemaSql) {
            throw new Error('schema.sql file is empty.');
        }

        await db.exec(schemaSql);
    } catch (error)
    {
        console.error('Failed to set up database from schema file:', error);
        throw error; 
    }
}

export default async function initializeDb() {
    try {
        db = await open({
            filename: DB_PATH,
            driver: sqlite3.Database,
        });

        await setupDatabase(db);

        console.log('Database tables are ready.');

    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
}


export { db };