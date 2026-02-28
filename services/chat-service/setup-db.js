import { promises as fs } from 'fs';    
import path from 'path';

const SCHEMA_FILE_PATH = path.join(process.cwd(), 'schema.sql');

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

export { setupDatabase };