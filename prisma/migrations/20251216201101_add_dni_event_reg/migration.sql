/*
  Warnings:

  - A unique constraint covering the columns `[event_id,participant_dni]` on the table `event_registrations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `participant_dni` to the `event_registrations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_registrations" ADD COLUMN     "participant_dni" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE INDEX "event_registrations_participant_dni_idx" ON "event_registrations"("participant_dni");

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_event_id_participant_dni_key" ON "event_registrations"("event_id", "participant_dni");
