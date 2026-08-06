-- Run this migration once against an existing MySQL/TiDB database.
-- Appointment DATETIME values remain in UTC; no three-hour data shift is required.

-- Keep the oldest active appointment and cancel any duplicate active rows that
-- already exist for the same doctor and UTC instant.
UPDATE appointments AS duplicateAppointment
JOIN appointments AS originalAppointment
  ON originalAppointment.doctorId = duplicateAppointment.doctorId
  AND originalAppointment.dateTime = duplicateAppointment.dateTime
  AND originalAppointment.id < duplicateAppointment.id
  AND originalAppointment.cancellationDate IS NULL
  AND originalAppointment.status <> 'Cancelled'
SET
  duplicateAppointment.status = 'Cancelled',
  duplicateAppointment.cancellationDate = COALESCE(
    duplicateAppointment.cancellationDate,
    UTC_TIMESTAMP()
  )
WHERE
  duplicateAppointment.cancellationDate IS NULL
  AND duplicateAppointment.status <> 'Cancelled';

-- A generated NULL value lets cancelled appointments release their slot,
-- while active Pending/Confirmed appointments must be unique per doctor/time.
ALTER TABLE appointments
  ADD COLUMN activeDateTime DATETIME
    GENERATED ALWAYS AS (
      CASE
        WHEN cancellationDate IS NULL AND status <> 'Cancelled' THEN dateTime
        ELSE NULL
      END
    ) STORED,
  ADD UNIQUE KEY uq_appointments_doctor_active_datetime (
    doctorId,
    activeDateTime
  );
