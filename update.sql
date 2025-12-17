-- Agregar columna message a la tabla services
ALTER TABLE services ADD COLUMN message TEXT DEFAULT '';

-- Actualizar servicios existentes con mensaje vacío
UPDATE services SET message = '' WHERE message IS NULL;