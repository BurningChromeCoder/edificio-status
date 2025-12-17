-- Tabla de servicios
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('ok', 'warning', 'error')),
    message TEXT DEFAULT '',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios admin
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos iniciales
INSERT OR REPLACE INTO services (id, name, status, message) VALUES 
    ('electricity', 'Electricidad', 'ok', ''),
    ('water', 'Agua', 'ok', ''),
    ('elevator1', 'Ascensor 1', 'ok', ''),
    ('elevator2', 'Ascensor 2', 'ok', ''),
    ('elevator3', 'Ascensor 3', 'ok', '');

-- Usuario admin por defecto (contraseña: admin123)
-- Hash generado con bcrypt
INSERT OR REPLACE INTO users (username, password_hash) VALUES 
    ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');