import crypto from 'crypto';
import { db } from '../setup-db.js';

async function getConversationsForUser(userId) {
    const stmt = `
        SELECT 
            c.id,
            c.created_at,
            u.id          AS other_user_id,
            u.username    AS other_user_username,
            m.body        AS last_message_body,
            m.created_at  AS last_message_created_at
        FROM conversations c
        JOIN conversation_participants mine 
            ON mine.conversation_id = c.id
        JOIN conversation_participants other 
            ON other.conversation_id = c.id 
            AND other.user_id != mine.user_id
        JOIN users u 
            ON u.id = other.user_id
        LEFT JOIN messages m 
            ON m.conversation_id = c.id
            AND m.id = (
                SELECT MAX(id) 
                FROM messages 
                WHERE conversation_id = c.id
            )
        WHERE mine.user_id = ?
        ORDER BY 
            m.created_at DESC,
            c.created_at DESC
    `;                          

    const conversations = await db.all(stmt, [userId]);
    return conversations;
}

async function checkIfConvExist(senderId, receipentId) 
{
    const stmt = `
        SELECT c.id
        FROM conversations c
        JOIN conversation_participants cp1 ON cp1.conversation_id = c.id
        JOIN conversation_participants cp2 ON cp2.conversation_id = c.id 
        WHERE cp1.user_id = ? AND cp2.user_id = ?
    `

    const conv = await db.get(stmt, [senderId, receipentId]);

    return conv;
}

async function createNewConversation(senderId, receipentId) {
    const now = new Date().toISOString();
    const conversationId = crypto.randomInt(1_000_000_000, 9_000_000_000);

    const insertConvStmt = `
        INSERT INTO conversations (id, created_at)
        VALUES (?, ?)
    `;
    await db.run(insertConvStmt, [conversationId, now]);

    const insertParticipantStmt = `
        INSERT INTO conversation_participants (conversation_id, user_id)
        VALUES (?, ?), (?, ?)
    `;
    await db.run(insertParticipantStmt, [conversationId, senderId, conversationId, receipentId]);

    return { id: conversationId };
}

async function getChatHistory(conversationId) {
    const stmt = `
        SELECT 
            m.id,
            m.conversation_id,
            m.sender_id,
            m.body,
            m.created_at,
            u.username as sender_username
        FROM messages m
        JOIN users u ON u.id = m.sender_id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
    `;
    
    const history = await db.all(stmt, [conversationId]);

    return history;
}


async function saveMessage(conversationId, senderId, content) {
    const stmt = `
        INSERT INTO messages (conversation_id, sender_id, body)
        VALUES (?, ?, ?)
    `;

    const result = await db.run(stmt, [conversationId, senderId, content]);
    const messageId = result.lastID;

    const row = await db.get(
        `SELECT m.id, m.conversation_id, m.sender_id, m.body, m.created_at, u.username AS sender_username
         FROM messages m
         JOIN users u ON u.id = m.sender_id
         WHERE m.id = ?`,
        [messageId]
    );

    return row;
}

async function getConversationParticipantIds(conversationId) {
    const stmt = `
        SELECT user_id
        FROM conversation_participants
        WHERE conversation_id = ?
    `;

    const rows = await db.all(stmt, [conversationId]);
    return rows.map(r => r.user_id);
}

export { getConversationsForUser, checkIfConvExist, createNewConversation, getChatHistory, saveMessage, getConversationParticipantIds };