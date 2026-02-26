import { db } from "./setup-db.js";    

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

async function blockUser(blockerId, blockedId) {
    const stmt = `
        INSERT INTO blocking_participants (blocker_id, blocked_id)
        VALUES (?, ?)
    `;

    await db.run(stmt, [blockerId, blockedId]);
}

async function unblockUser(blockerId, blockedId) {
    const stmt = `
        DELETE FROM blocking_participants
        WHERE blocker_id = ? AND blocked_id = ?
    `;

    await db.run(stmt, [blockerId, blockedId]);
}

export { getBlockingStatus, blockUser, unblockUser };