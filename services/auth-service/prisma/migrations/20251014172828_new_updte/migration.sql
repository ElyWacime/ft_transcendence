/*
  Warnings:

  - You are about to drop the column `Winner_Id` on the `Participate_Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `Participate_Tournament` table. All the data in the column will be lost.
  - Added the required column `Label` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Winner_Id` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Participate_Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "P_Id" TEXT NOT NULL,
    "T_Id" TEXT NOT NULL,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL,
    CONSTRAINT "Participate_Tournament_T_Id_fkey" FOREIGN KEY ("T_Id") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Participate_Tournament_P_Id_fkey" FOREIGN KEY ("P_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Participate_Tournament" ("CreatedAt", "P_Id", "T_Id", "UpdatedAt", "id") SELECT "CreatedAt", "P_Id", "T_Id", "UpdatedAt", "id" FROM "Participate_Tournament";
DROP TABLE "Participate_Tournament";
ALTER TABLE "new_Participate_Tournament" RENAME TO "Participate_Tournament";
CREATE TABLE "new_Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Label" TEXT NOT NULL,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL,
    "count_player" INTEGER NOT NULL DEFAULT 0,
    "result" TEXT NOT NULL DEFAULT 'PENDING',
    "Winner_Id" TEXT NOT NULL,
    CONSTRAINT "Tournament_Winner_Id_fkey" FOREIGN KEY ("Winner_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tournament" ("CreatedAt", "UpdatedAt", "count_player", "id", "result") SELECT "CreatedAt", "UpdatedAt", "count_player", "id", "result" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
