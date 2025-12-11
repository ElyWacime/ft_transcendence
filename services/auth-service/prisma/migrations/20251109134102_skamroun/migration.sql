/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL,
    CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Label" TEXT NOT NULL,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL,
    "count_player" INTEGER NOT NULL DEFAULT 0,
    "result" TEXT NOT NULL DEFAULT 'PENDING',
    "Winner_Id" TEXT NOT NULL,
    CONSTRAINT "Tournament_Winner_Id_fkey" FOREIGN KEY ("Winner_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Participate_Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "P_Id" TEXT NOT NULL,
    "T_Id" TEXT NOT NULL,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL,
    CONSTRAINT "Participate_Tournament_T_Id_fkey" FOREIGN KEY ("T_Id") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Participate_Tournament_P_Id_fkey" FOREIGN KEY ("P_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "P1_Id" TEXT NOT NULL,
    "P2_Id" TEXT NOT NULL,
    "Ball_x" REAL NOT NULL,
    "Ball_y" REAL NOT NULL,
    "Player1_x" REAL NOT NULL,
    "Player1_y" REAL NOT NULL,
    "Player2_x" REAL NOT NULL,
    "Player2_y" REAL NOT NULL,
    "score_player1" INTEGER NOT NULL,
    "score_player2" INTEGER NOT NULL,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL,
    "result" TEXT NOT NULL DEFAULT 'PENDING',
    "Winner_Id" TEXT NOT NULL,
    "tournamentId" TEXT,
    "match_start" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chrono" INTEGER NOT NULL DEFAULT 60,
    CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Match_Winner_Id_fkey" FOREIGN KEY ("Winner_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_P2_Id_fkey" FOREIGN KEY ("P2_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_P1_Id_fkey" FOREIGN KEY ("P1_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Text" TEXT NOT NULL,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL,
    "Sender" TEXT NOT NULL,
    "Receiver" TEXT NOT NULL,
    CONSTRAINT "Message_Sender_fkey" FOREIGN KEY ("Sender") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_Receiver_fkey" FOREIGN KEY ("Receiver") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "loggedIn" BOOLEAN NOT NULL DEFAULT false,
    "Auto_Match" BOOLEAN NOT NULL DEFAULT false,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "avatar" TEXT DEFAULT 'https://www.gravatar.com/avatar/'
);
INSERT INTO "new_User" ("email", "id", "loggedIn", "name", "password") SELECT "email", "id", "loggedIn", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON "FriendRequest"("senderId", "receiverId");
