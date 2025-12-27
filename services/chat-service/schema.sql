PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversation_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    user_id CHAR(36) NOT NULL,
    last_read_message_id INTEGER,
    unread_count INTEGER DEFAULT 0,
    
    FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    
    UNIQUE(conversation_id, user_id)  
);

CREATE TABLE IF NOT EXISTS blocking_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blocker_id CHAR(36) NOT NULL,
    blocked_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (blocker_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_id) REFERENCES users (id) ON DELETE CASCADE,

    UNIQUE(blocker_id, blocked_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    sender_id CHAR(36) NOT NULL,
    body TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users (id)
);