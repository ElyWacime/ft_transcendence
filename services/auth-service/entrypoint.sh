#!/bin/bash
set -e

npx prisma generate

npx prisma db push

exec npm run dev
