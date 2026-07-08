-- Prevent two active bookings from overlapping on the same room unit,
-- enforced at the DB level (not just in application code).
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_no_overlap_excl"
  EXCLUDE USING gist (
    "roomUnitId" WITH =,
    daterange("checkIn", "checkOut", '[)') WITH &&
  )
  WHERE (status IN ('PENDING', 'CONFIRMED'));
