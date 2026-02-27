import { db } from "../setup-db.js";

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

async function updateUsername(userId, newUsername) {
    const stmt = `
        UPDATE users SET username = ? WHERE id = ? RETURNING id, username
    `;
    
    return await db.get(stmt, [newUsername, userId]);
}

export { insertUsers, getUserByUsername, updateUsername };