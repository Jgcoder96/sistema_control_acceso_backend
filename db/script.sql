CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedula BIGINT NOT NULL UNIQUE, 
    correo_electronico VARCHAR(255) NOT NULL UNIQUE,
    foto_url VARCHAR(255),
    estado VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    clave_hash VARCHAR(255) NOT NULL,
    creado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMP NOT NULL DEFAULT NOW()
);