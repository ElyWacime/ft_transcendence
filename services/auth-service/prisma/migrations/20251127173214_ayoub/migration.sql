/*
  Warnings:

  - You are about to drop the `FriendRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[P_Id,T_Id]` on the table `Participate_Tournament` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FriendRequest_senderId_receiverId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FriendRequest";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Message";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "P1_Id" TEXT NOT NULL,
    "P2_Id" TEXT NOT NULL,
    "Ball_x" REAL NOT NULL,
    "Ball_y" REAL NOT NULL,
    "Player1_x" REAL NOT NULL,
    "Player1_y" REAL NOT NULL,
    "Player2_x" REAL NOT NULL,
    "Player2_y" REAL NOT NULL,
    "score_player1" INTEGER NOT NULL DEFAULT 0,
    "score_player2" INTEGER NOT NULL DEFAULT 0,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL,
    "result" TEXT NOT NULL DEFAULT 'PENDING',
    "Winner_Id" TEXT NOT NULL,
    "tournamentId" TEXT,
    "match_start" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chrono" INTEGER NOT NULL DEFAULT 60,
    CONSTRAINT "Match_P1_Id_fkey" FOREIGN KEY ("P1_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_P2_Id_fkey" FOREIGN KEY ("P2_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_Winner_Id_fkey" FOREIGN KEY ("Winner_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("Ball_x", "Ball_y", "CreatedAt", "P1_Id", "P2_Id", "Player1_x", "Player1_y", "Player2_x", "Player2_y", "UpdatedAt", "Winner_Id", "chrono", "id", "match_start", "result", "score_player1", "score_player2", "tournamentId") SELECT "Ball_x", "Ball_y", "CreatedAt", "P1_Id", "P2_Id", "Player1_x", "Player1_y", "Player2_x", "Player2_y", "UpdatedAt", "Winner_Id", "chrono", "id", "match_start", "result", "score_player1", "score_player2", "tournamentId" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "loggedIn" BOOLEAN NOT NULL DEFAULT false,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "avatar" TEXT DEFAULT 'https://www.gravatar.com/avatar/',
    "Auto_Match" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("Auto_Match", "avatar", "email", "id", "isOnline", "loggedIn", "name", "password") SELECT "Auto_Match", "avatar", "email", "id", "isOnline", "loggedIn", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Participate_Tournament_P_Id_T_Id_key" ON "Participate_Tournament"("P_Id", "T_Id");
