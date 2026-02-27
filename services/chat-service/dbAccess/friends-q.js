import { db } from '../setup-db.js';

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

async function addFriend(userIdA, userIdB) {
    const stmt = `
        INSERT INTO friends_list (user_a, user_b)
        VALUES (?, ?)
    `;

    await db.run(stmt, [userIdA, userIdB]);
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

export { getFriendStatus, addFriend, deleteFriend, getAllFriends };