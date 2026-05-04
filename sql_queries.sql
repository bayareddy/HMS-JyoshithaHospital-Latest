-- SQL Queries to recreate the shifts table based on Schedule Templates

-- 1. Drop existing schedule_templates (if we are completely moving to shifts)
DROP TABLE IF EXISTS `schedule_templates`;

-- 2. Drop the old shifts table
DROP TABLE IF EXISTS `shifts`;

-- 3. Create the updated shifts table
CREATE TABLE `shifts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `opd_slot_time` INT NOT NULL,
  `schedule` JSON,
  `is_active` BOOLEAN DEFAULT 1
);

-- Note: The schedule JSON column will store the array of DaySchedule objects:
-- [
--   { "day": "Monday", "tasks": [ { "id": 1612, "taskName": "OPD", "fromTime": "09:00", "toTime": "17:00" } ] },
--   ...
-- ]
