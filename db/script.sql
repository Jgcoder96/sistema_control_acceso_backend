--- TRIGGER PARA LA FECHA DE ACTUALIZACIÓN ---

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
	RETURNS TRIGGER AS $$
		BEGIN
  			NEW.actualizado_el = NOW();
  			RETURN NEW;
		END;
	$$ LANGUAGE plpgsql;




--- MÓDULO USUARIOS ---

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
    actualizado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMP DEFAULT NULL 
);

CREATE TRIGGER set_timestamp_usuarios
	BEFORE UPDATE ON usuarios
	FOR EACH ROW
	EXECUTE PROCEDURE trigger_set_timestamp();




--- MÓDULO TARJETAS DE ACCESO ---

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
    eliminado_el TIMESTAMP DEFAULT NULL,
    asignada_el TIMESTAMP DEFAULT NULL
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




--- MÓDULO UBICACIONES FÍSICAS ---

CREATE TABLE ubicaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    creado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMP DEFAULT NULL 
);

CREATE TRIGGER set_timestamp_ubicaciones
    BEFORE UPDATE ON ubicaciones
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();




--- MÓDULO PUNTOS DE ACCESO ---

CREATE TABLE puntos_acceso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ubicacion_id UUID NOT NULL REFERENCES ubicaciones(id),
    nombre VARCHAR(100) NOT NULL,
    mac VARCHAR(17) NOT NULL UNIQUE,
    creado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMP DEFAULT NULL, 
    CONSTRAINT nombre_unico_por_ubicacion UNIQUE (ubicacion_id, nombre)
);

CREATE TRIGGER set_timestamp_puntos_acceso
    BEFORE UPDATE ON puntos_acceso
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

--  TRIGGER PARA ELIMINAR EN CASCADA LOS PUNTOS DE ACCESO ASOCIADOS A UNA UBICACIÓN 

CREATE OR REPLACE FUNCTION trigger_soft_delete_puntos_acceso()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.eliminado_el IS NULL AND NEW.eliminado_el IS NOT NULL) THEN
        UPDATE puntos_acceso 
        SET eliminado_el = NEW.eliminado_el 
        WHERE ubicacion_id = NEW.id AND eliminado_el IS NULL;
    END IF;
    
    IF (OLD.eliminado_el IS NOT NULL AND NEW.eliminado_el IS NULL) THEN
        UPDATE puntos_acceso 
        SET eliminado_el = NULL 
        WHERE ubicacion_id = NEW.id AND eliminado_el = OLD.eliminado_el;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER soft_delete_ubicaciones_cascade
    AFTER UPDATE ON ubicaciones
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_soft_delete_puntos_acceso();




--- MÓDULO HORARIOS ---

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
    nombre VARCHAR(100) NOT NULL UNIQUE,
    creado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMP DEFAULT NULL
);

CREATE TABLE horario_detalles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    horario_id UUID NOT NULL REFERENCES horarios(id) ON DELETE CASCADE,
    dia_semana dia_semana_enum, 
    es_festivo BOOLEAN DEFAULT FALSE,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    
    CONSTRAINT chk_dia_o_festivo CHECK (
        (es_festivo = TRUE AND dia_semana IS NULL) OR 
        (es_festivo = FALSE AND dia_semana IS NOT NULL)
    )
);

CREATE TRIGGER set_timestamp_horarios
    BEFORE UPDATE ON horarios
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();




--- MÓDULO FERIADOS ---

CREATE TABLE festivos (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	nombre VARCHAR(100) NOT NULL UNIQUE,
	dia INTEGER NOT NULL CHECK (dia >= 1 AND dia <= 31),
	mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
	anio INTEGER, 
	creado_el TIMESTAMP NOT NULL DEFAULT NOW(),
	actualizado_el TIMESTAMP NOT NULL DEFAULT NOW(),
	eliminado_el TIMESTAMP DEFAULT NULL,
	    
	CONSTRAINT unique_holiday_date UNIQUE(dia, mes, anio)
);

CREATE TRIGGER set_timestamp_festivos
    BEFORE UPDATE ON festivos
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();




--- MÓDULO PERMISOS FÍSICOS ---

CREATE TABLE permisos_fisicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    punto_acceso_id UUID NOT NULL REFERENCES puntos_acceso(id) ON DELETE CASCADE,
    horario_id UUID NOT NULL REFERENCES horarios(id),
    
    creado_el TIMESTAMP NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMP DEFAULT NULL,
    
    CONSTRAINT unique_usuario_punto UNIQUE (usuario_id, punto_acceso_id)
);

CREATE UNIQUE INDEX idx_permiso_activo_unico 
	ON permisos_fisicos (usuario_id, punto_acceso_id) 
	WHERE eliminado_el IS NULL;

CREATE TRIGGER set_timestamp_permisos_fisicos
    BEFORE UPDATE ON permisos_fisicos
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();




--- MÓDULO LOGS DE ACCESO ----

CREATE TABLE logs_acceso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarjeta_id UUID REFERENCES tarjetas(id) ON DELETE SET NULL,
    punto_acceso_id UUID NOT NULL REFERENCES puntos_acceso(id),
    fecha TIMESTAMP NOT NULL DEFAULT NOW(), 
    autorizado BOOLEAN NOT NULL
);




-- SELECT ----

SELECT jsonb_build_object(
    'ubicacion', u.nombre,
    'puntos_acceso', jsonb_agg(DISTINCT jsonb_build_object(
        'nombre_punto', pa.nombre,
        'mac', pa.mac,
        'tarjetas_autorizadas', (
            SELECT jsonb_agg(t.codigo)
            FROM permisos_fisicos pf
            JOIN usuarios usr ON pf.usuario_id = usr.id
            JOIN tarjetas t ON usr.id = t.usuario_id
            WHERE pf.punto_acceso_id = pa.id
              AND pf.eliminado_el IS NULL
              AND usr.eliminado_el IS NULL
              AND usr.estado = 'activo'
              AND t.eliminado_el IS NULL
              AND t.estado = 'activa'
        )
    ))
) as listado_jerarquico
FROM ubicaciones u
JOIN puntos_acceso pa ON u.id = pa.ubicacion_id
WHERE u.eliminado_el IS NULL 
  AND pa.eliminado_el IS NULL
GROUP BY u.nombre;


