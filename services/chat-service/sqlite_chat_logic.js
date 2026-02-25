import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import crypto from 'crypto';
import { setupDatabase } from './setup-db.js';

let db;
const DB_PATH = './dev.db';

async function initializeDb() {
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

async function insertUsers(id, username) {
    const insertStmt = `INSERT INTO users (id, username) VALUES (?, ?) RETURNING *`;

    return await db.get(insertStmt, [id, username])
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

async function getConversationParticipantIds(conversationId) {
    const stmt = `
        SELECT user_id
        FROM conversation_participants
        WHERE conversation_id = ?
    `;

    const rows = await db.all(stmt, [conversationId]);
    return rows.map(r => r.user_id);
}

async function blockUser(blockerId, blockedId) {
    const stmt = `
        INSERT INTO blocking_participants (blocker_id, blocked_id)
        VALUES (?, ?)
        ON CONFLICT(blocker_id, blocked_id) DO NOTHING
    `;

    await db.run(stmt, [blockerId, blockedId]);
}

async function addFriend(userIdA, userIdB) {
    const stmt = `
        INSERT INTO friends_list (user_a, user_b)
        VALUES (?, ?)
        ON CONFLICT(user_a, user_b) DO NOTHING
    `;

    await db.run(stmt, [userIdA, userIdB]);
}

async function getBlockingStatus(userIdA, userIdB) {
    const stmt = `
        SELECT blocker_id, blocked_id
        FROM blocking_participants
        WHERE (blocker_id = ? AND blocked_id = ?)
        OR (blocker_id = ? AND blocked_id = ?)
    `;

    const row = await db.get(stmt, [userIdA, userIdB, userIdB, userIdA]);

    if (!row) {
        return { blocked: false };
    }

    return {
        blocked: true,
        blockerId: row.blocker_id,
        blockedId: row.blocked_id,
        blockedBySelf: row.blocker_id === userIdA
    };
}

async function getFriendStatus(userIdA, userIdB) {
    const stmt = `
        SELECT user_a, user_b
        FROM friends_list
        WHERE (user_a = ? AND user_b = ?)
        OR (user_a = ? AND user_b = ?)
    `;

    const row = await db.get(stmt, [userIdA, userIdB, userIdB, userIdA]);

    if (!row) {
        return { friends: false };
    }

    return {
        friends: true,
        userA: row.user_a,
        userB: row.user_b
    };
} 


async function createInvitation(inviterId, inviteeId, invitationType) {
    const stmt = `
        INSERT INTO pending_invitations (inviter_id, invitee_id, invitation_type)
        VALUES (?, ?, ?)
        ON CONFLICT(inviter_id, invitee_id) DO NOTHING
    `;

    await db.run(stmt, [inviterId, inviteeId, invitationType]);
}


async function cancelInvitation(inviterId, inviteeId, invitationType) {
    const stmt = `
        DELETE FROM pending_invitations
        WHERE inviter_id = ? AND invitee_id = ? and invitation_type = ?
        OR (inviter_id = ? AND invitee_id = ? AND invitation_type = ?)

    `;

    await db.run(stmt, [inviterId, inviteeId, invitationType, inviteeId, inviterId, invitationType]);
}

async function getInvitationStatus(userIdA, userIdB, invitationType) {
    const stmt = `
        SELECT inviter_id, invitee_id, invitation_type
        FROM pending_invitations
        WHERE (inviter_id = ? AND invitee_id = ? AND invitation_type = ?)
        OR (inviter_id = ? AND invitee_id = ? AND invitation_type = ?)
    `;

    const row = await db.get(stmt, [userIdA, userIdB, invitationType, userIdB, userIdA, invitationType]);

    if (!row) {
        return { pending: false };
    }

    return {
        pending: true,
        inviterId: row.inviter_id,
        inviteeId: row.invitee_id,
        invitationType: row.invitation_type,
        invitedBySelf: row.inviter_id === userIdA
    };
}

async function unblockUser(blockerId, blockedId) {
    const stmt = `
        DELETE FROM blocking_participants
        WHERE blocker_id = ? AND blocked_id = ?
    `;

    await db.run(stmt, [blockerId, blockedId]);
}

async function deleteFriend(userIdA, userIdB) {
    const stmt = `
        DELETE FROM friends_list
        WHERE (user_a = ? AND user_b = ?)
        OR (user_a = ? AND user_b = ?)
    `;

    await db.run(stmt, [userIdA, userIdB, userIdB, userIdA]);
}

async function getAllFriends(userId) {
    const stmt = `
        SELECT CASE 
            WHEN user_a = ? THEN user_b
            ELSE user_a
        END AS friend_id
        FROM friends_list
        WHERE user_a = ? OR user_b = ?
    `;

    const friends = await db.all(stmt, [userId, userId, userId]);
    return friends.map(row => row.friend_id);
}




async function getUserByUsername(username) {
    const stmt = `
        SELECT id, username FROM users WHERE username = ?
    `;
    
    const user = await db.get(stmt, [username]);
    return user;
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

export {
    initializeDb,
    saveMessage,
    getChatHistory,
    checkIfConvExist,
    createNewConversation,
    getConversationsForUser,
    getConversationParticipantIds,
    insertUsers,
    blockUser,
    getBlockingStatus,
    getInvitationStatus,
    createInvitation,
    cancelInvitation,
    getFriendStatus,
    unblockUser,
    getUserByUsername,
    addFriend,
    deleteFriend,
    getAllFriends
};