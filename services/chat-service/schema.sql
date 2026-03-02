PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    username TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversation_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    user_id CHAR(36) NOT NULL,
    
    FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    
    UNIQUE(conversation_id, user_id)  
);

CREATE TABLE IF NOT EXISTS pending_invitations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inviter_id CHAR(36) NOT NULL,
    invitee_id CHAR(36) NOT NULL,
    invitation_type TEXT NOT NULL CHECK(invitation_type IN ('game_request', 'friend_request')),

    FOREIGN KEY (inviter_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (invitee_id) REFERENCES users (id) ON DELETE CASCADE,

    UNIQUE(inviter_id, invitee_id, invitation_type)
);

CREATE TABLE IF NOT EXISTS friends_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_a CHAR(36) NOT NULL,
    user_b CHAR(36) NOT NULL,

    FOREIGN KEY (user_a) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (user_b) REFERENCES users (id) ON DELETE CASCADE,

    UNIQUE(user_a, user_b)
);

CREATE TABLE IF NOT EXISTS blocking_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blocker_id CHAR(36) NOT NULL,
    blocked_id CHAR(36) NOT NULL,

    FOREIGN KEY (blocker_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_id) REFERENCES users (id) ON DELETE CASCADE,

    UNIQUE(blocker_id, blocked_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    sender_id CHAR(36) NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users (id)
);