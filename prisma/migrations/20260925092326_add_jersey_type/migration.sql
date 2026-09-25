-- CreateEnum
CREATE TYPE "JerseyType" AS ENUM ('FAN', 'PLAYER', 'RETRO');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "jerseyType" "JerseyType";
