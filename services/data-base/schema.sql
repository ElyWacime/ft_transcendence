-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- =============================
-- USERS TABLE
-- =============================
CREATE TABLE IF NOT EXISTS Users (
    id CHAR(36) NOT NULL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    User_name TEXT NOT NULL UNIQUE,
    User_password TEXT NOT NULL,
    loggedIn INTEGER NOT NULL DEFAULT 0,      -- 0 = false, 1 = true
    Auto_Match INTEGER NOT NULL DEFAULT 0,
    isOnline INTEGER NOT NULL DEFAULT 0,
    avatar TEXT DEFAULT 'https://www.gravatar.com/avatar/',
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- FRIEND REQUEST TABLE
-- =============================
CREATE TABLE IF NOT EXISTS FriendRequest (
    id CHAR(36) NOT NULL PRIMARY KEY,
    senderId CHAR(36) NOT NULL,
    receiverId CHAR(36) NOT NULL,
    Request_status TEXT NOT NULL DEFAULT 'PENDING' CHECK(Request_status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (senderId, receiverId),
    FOREIGN KEY (senderId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (receiverId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- =============================
-- TOURNAMENT TABLE
-- =============================
CREATE TABLE IF NOT EXISTS Tournament (
    id CHAR(36) NOT NULL PRIMARY KEY,
    Label TEXT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    count_player INTEGER NOT NULL DEFAULT 0,
    result TEXT NOT NULL DEFAULT 'PENDING' CHECK(result IN ('PENDING','WIN','LOSE','DRAW')),
    Winner_Id CHAR(36),
    FOREIGN KEY (Winner_Id) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- =============================
-- PARTICIPATE TOURNAMENT TABLE
-- =============================
CREATE TABLE IF NOT EXISTS Participate_Tournament (
    id CHAR(36) NOT NULL PRIMARY KEY,
    P_Id CHAR(36) NOT NULL,
    T_Id CHAR(36) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (P_Id, T_Id),
    FOREIGN KEY (P_Id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (T_Id) REFERENCES Tournament(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- =============================
-- MATCH TABLE
-- =============================
CREATE TABLE IF NOT EXISTS MatchTable (
    id CHAR(36) NOT NULL PRIMARY KEY,
    P1_Id CHAR(36) NOT NULL,
    P2_Id CHAR(36) NOT NULL,
    Ball_x REAL NOT NULL,
    Ball_y REAL NOT NULL,
    Player1_x REAL NOT NULL,
    Player1_y REAL NOT NULL,
    Player2_x REAL NOT NULL,
    Player2_y REAL NOT NULL,
    score_player1 INTEGER NOT NULL DEFAULT 0,
    score_player2 INTEGER NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    result TEXT NOT NULL DEFAULT 'PENDING' CHECK(result IN ('PENDING','WIN','LOSE','DRAW')),
    Winner_Id CHAR(36),
    tournamentId CHAR(36),
    chrono INTEGER NOT NULL DEFAULT 60,
    FOREIGN KEY (P1_Id) REFERENCES Users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (P2_Id) REFERENCES Users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (Winner_Id) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (tournamentId) REFERENCES Tournament(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- =============================
-- MESSAGES TABLE
-- =============================
CREATE TABLE IF NOT EXISTS Messages (
    id CHAR(36) NOT NULL PRIMARY KEY,
    Message_Text TEXT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Sender CHAR(36) NOT NULL,
    Receiver CHAR(36) NOT NULL,
    FOREIGN KEY (Sender) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Receiver) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- =============================
-- INDEXES FOR PERFORMANCE
-- =============================
CREATE INDEX IF NOT EXISTS idx_friendrequest_sender ON FriendRequest(senderId);
CREATE INDEX IF NOT EXISTS idx_friendrequest_receiver ON FriendRequest(receiverId);
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON Messages(Sender, Receiver);
CREATE INDEX IF NOT EXISTS idx_participatetournament_tournament ON Participate_Tournament(T_Id);