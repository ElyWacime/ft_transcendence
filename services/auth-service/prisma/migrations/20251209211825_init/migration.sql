-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "loggedIn" BOOLEAN NOT NULL DEFAULT false,
    "Auto_Match" BOOLEAN NOT NULL DEFAULT false,
    "avatar" TEXT DEFAULT 'https://www.avatar.com/avatar',
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
