CREATE OR REPLACE FUNCTION trigger_set_timestamp()
	RETURNS TRIGGER AS $$
		BEGIN
  			NEW.actualizado_el = NOW();
  			RETURN NEW;
		END;
	$$ LANGUAGE plpgsql;


-- MÓDULO USUARIOS

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    correo_electronico VARCHAR(255) NOT NULL UNIQUE,
    foto_url VARCHAR(255),
    estado VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    clave_hash VARCHAR(255) NOT NULL,
    creado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_usuarios
	BEFORE UPDATE ON usuarios
	FOR EACH ROW
	EXECUTE PROCEDURE trigger_set_timestamp();

-- MÓDULO TARJETAS

CREATE TYPE estado_tarjeta AS ENUM (
    'activable', 
    'activa', 
    'bloqueada', 
    'perdida', 
    'eliminada'
);

CREATE TYPE tipo_accion_historial AS ENUM (
    'asignacion', 
    'devolucion', 
    'bloqueo', 
    'perdida', 
    'eliminacion', 
    'reactivacion'
);

CREATE TABLE tarjetas (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) NOT NULL UNIQUE,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    estado estado_tarjeta NOT NULL DEFAULT 'activable',
    creado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMP,
    asignada_el TIMESTAMP
);

CREATE TABLE historial_asignaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarjeta_id UUID NOT NULL REFERENCES tarjetas(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    accion tipo_accion_historial NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_tarjetas
	BEFORE UPDATE ON tarjetas
	FOR EACH ROW
	EXECUTE PROCEDURE trigger_set_timestamp();

-- MÓDULO UBICACIONES

CREATE TABLE ubicaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    creado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMP DEFAULT NULL 
);

CREATE TRIGGER set_timestamp_ubicaciones
    BEFORE UPDATE ON ubicaciones
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();


-- MÓDULO PUNTOS DE ACCESO

CREATE TABLE puntos_acceso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ubicacion_id UUID NOT NULL REFERENCES ubicaciones(id),
    nombre VARCHAR(100) NOT NULL,
    mac VARCHAR(17) NOT NULL UNIQUE,
    creado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMP
);

CREATE TRIGGER set_timestamp_puntos_acceso
    BEFORE UPDATE ON puntos_acceso
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

-- HORARIOS

CREATE TYPE dia_semana_enum AS ENUM (
	'domingo', 
    'lunes', 
    'martes', 
    'miercoles', 
    'jueves', 
    'viernes', 
    'sabado'
);

CREATE TABLE horarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    creado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMP
);

CREATE TABLE horario_detalles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    horario_id UUID NOT NULL REFERENCES horarios(id) ON DELETE CASCADE,
    dia_semana dia_semana_enum, 
    es_festivo BOOLEAN DEFAULT FALSE,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    creado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMP,
    
    CONSTRAINT chk_dia_o_festivo CHECK (
        (es_festivo = TRUE AND dia_semana IS NULL) OR 
        (es_festivo = FALSE AND dia_semana IS NOT NULL)
    )
);

DROP TABLE horario_detalles;

CREATE TABLE festivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    dia INTEGER NOT NULL CHECK (dia >= 1 AND dia <= 31),
    mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
    anio INTEGER, 
    creado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMP,
    
    CONSTRAINT unique_holiday_date UNIQUE(dia, mes, anio)
);

CREATE TRIGGER set_timestamp_horarios
    BEFORE UPDATE ON horarios
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_horario_detalles
    BEFORE UPDATE ON horario_detalles
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_festivos
    BEFORE UPDATE ON festivos
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();



