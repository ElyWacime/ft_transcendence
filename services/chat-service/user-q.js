import { db } from "./setup-db.js";

async function insertUsers(id, username) {
    const insertStmt = `INSERT INTO users (id, username) VALUES (?, ?) RETURNING *`;

    return await db.get(insertStmt, [id, username])
}

async function getUserByUsername(username) {
    const stmt = `
        SELECT id, username FROM users WHERE username = ?
    `;
    
    const user = await db.get(stmt, [username]);
    return user;
}

export { insertUsers, getUserByUsername };