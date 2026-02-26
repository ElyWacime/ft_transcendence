import { db } from './setup-db.js';

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

async function createInvitation(inviterId, inviteeId, invitationType) {
    const stmt = `
        INSERT INTO pending_invitations (inviter_id, invitee_id, invitation_type)
        VALUES (?, ?, ?)
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

export { getInvitationStatus, createInvitation, cancelInvitation };