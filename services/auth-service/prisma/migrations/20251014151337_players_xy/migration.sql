/*
  Warnings:

  - Added the required column `Player1_x` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Player1_y` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Player2_x` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Player2_y` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
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
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL,
    "result" TEXT NOT NULL DEFAULT 'PENDING',
    "Winner_Id" TEXT NOT NULL,
    "tournamentId" TEXT,
    "score_player1" INTEGER NOT NULL,
    "score_player2" INTEGER NOT NULL,
    "match_start" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chrono" INTEGER NOT NULL DEFAULT 60,
    CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Match_Winner_Id_fkey" FOREIGN KEY ("Winner_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_P2_Id_fkey" FOREIGN KEY ("P2_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_P1_Id_fkey" FOREIGN KEY ("P1_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("Ball_x", "Ball_y", "CreatedAt", "P1_Id", "P2_Id", "UpdatedAt", "Winner_Id", "chrono", "id", "match_start", "result", "score_player1", "score_player2", "tournamentId") SELECT "Ball_x", "Ball_y", "CreatedAt", "P1_Id", "P2_Id", "UpdatedAt", "Winner_Id", "chrono", "id", "match_start", "result", "score_player1", "score_player2", "tournamentId" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
