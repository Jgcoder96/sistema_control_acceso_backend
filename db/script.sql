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
    creado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMPTZ DEFAULT NULL 
);


CREATE TRIGGER set_timestamp_usuarios
	BEFORE UPDATE ON usuarios
	FOR EACH ROW
	EXECUTE PROCEDURE trigger_set_timestamp();


CREATE OR REPLACE FUNCTION trigger_usuario_cascada()
	RETURNS TRIGGER AS $$
		BEGIN
    		IF (OLD.eliminado_el IS NULL AND NEW.eliminado_el IS NOT NULL) THEN
        		UPDATE puntos_acceso
        		SET 
            		version = version + 1,
            		esta_sincronizado = FALSE
        		WHERE id IN (
            		SELECT punto_acceso_id 
            		FROM permisos_fisicos 
            		WHERE usuario_id = NEW.id AND eliminado_el IS NULL
        		);

        		UPDATE permisos_fisicos
        		SET eliminado_el = NEW.eliminado_el
        		WHERE usuario_id = NEW.id AND eliminado_el IS NULL;

    		END IF;
    
    		IF (OLD.eliminado_el IS NOT NULL AND NEW.eliminado_el IS NULL) THEN
        		UPDATE permisos_fisicos
        		SET eliminado_el = NULL
        		WHERE usuario_id = NEW.id AND eliminado_el = OLD.eliminado_el;

        		UPDATE puntos_acceso
        		SET 
            		version = version + 1,
            		esta_sincronizado = FALSE
        		WHERE id IN (
            		SELECT punto_acceso_id 
            		FROM permisos_fisicos 
            		WHERE usuario_id = NEW.id AND eliminado_el IS NULL -- Ahora ya están en NULL
        		);

    		END IF;
    		RETURN NEW;
		END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER tr_usuario_cascada
    AFTER UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_usuario_cascada();



--- TOKEN DE AUTENTICACIÓN ---

CREATE TABLE tokens_refresco (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expira_el TIMESTAMPTZ NOT NULL,
    creado_el TIMESTAMPTZ DEFAULT NOW()
);






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
    creado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMPTZ DEFAULT NULL,
    asignada_el TIMESTAMPTZ DEFAULT NULL
);


CREATE TABLE historial_asignaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarjeta_id UUID NOT NULL REFERENCES tarjetas(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    accion tipo_accion_historial NOT NULL,
    fecha TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TRIGGER set_timestamp_tarjetas
	BEFORE UPDATE ON tarjetas
	FOR EACH ROW
	EXECUTE PROCEDURE trigger_set_timestamp();






--- MÓDULO UBICACIONES FÍSICAS ---

CREATE TABLE ubicaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mesh_id VARCHAR(17) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    creado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMPTZ DEFAULT NULL 
);


CREATE TRIGGER set_timestamp_ubicaciones
    BEFORE UPDATE ON ubicaciones
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();


--  TRIGGER PARA ELIMINAR Y RESTAURAR LOS PUNTOS DE ACCESO Y PERMISOS ASOCIADOS A UNA UBICACIÓN

CREATE OR REPLACE FUNCTION trigger_soft_delete_puntos_acceso()
	RETURNS TRIGGER AS $$
		BEGIN
    		IF (OLD.eliminado_el IS NULL AND NEW.eliminado_el IS NOT NULL) THEN
        		UPDATE puntos_acceso 
        		SET 
            		eliminado_el = NEW.eliminado_el,
            		version = version + 1,
            		esta_sincronizado = FALSE
        		WHERE ubicacion_id = NEW.id 
          		AND eliminado_el IS NULL;

        		UPDATE permisos_fisicos
        		SET eliminado_el = NEW.eliminado_el
        		WHERE punto_acceso_id IN (SELECT id FROM puntos_acceso WHERE ubicacion_id = NEW.id)
          		AND eliminado_el IS NULL;
    		END IF;
    
    		IF (OLD.eliminado_el IS NOT NULL AND NEW.eliminado_el IS NULL) THEN
        		UPDATE puntos_acceso 
        		SET 
            		eliminado_el = NULL,
            		version = version + 1,
            		esta_sincronizado = FALSE
        		WHERE ubicacion_id = NEW.id 
          		AND eliminado_el = OLD.eliminado_el;

        		UPDATE permisos_fisicos
        		SET eliminado_el = NULL
        		WHERE punto_acceso_id IN (SELECT id FROM puntos_acceso WHERE ubicacion_id = NEW.id)
          		AND eliminado_el = OLD.eliminado_el;

    		END IF;

    		RETURN NEW;
		END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER soft_delete_ubicaciones_cascade
    AFTER UPDATE ON ubicaciones
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_soft_delete_puntos_acceso();






--- MÓDULO PUNTOS DE ACCESO ---

CREATE TABLE puntos_acceso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ubicacion_id UUID NOT NULL REFERENCES ubicaciones(id),
    nombre VARCHAR(100) NOT NULL,
    mac VARCHAR(17) NOT NULL UNIQUE,
    version INTEGER NOT NULL DEFAULT 1,
    esta_sincronizado BOOLEAN NOT NULL DEFAULT FALSE,
    creado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMPTZ DEFAULT NULL, 
    CONSTRAINT nombre_unico_por_ubicacion UNIQUE (ubicacion_id, nombre)
);


CREATE TRIGGER set_timestamp_puntos_acceso
    BEFORE UPDATE ON puntos_acceso
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();


--  TRIGGER PARA ELIMINAR Y RESTAURAR PERMISOS ASOCIADOS A UN PUNTO DE ACCESO

CREATE OR REPLACE FUNCTION trigger_punto_acceso_cascada()
	RETURNS TRIGGER AS $$
		BEGIN
    		IF (OLD.eliminado_el IS DISTINCT FROM NEW.eliminado_el) THEN
        		NEW.version := OLD.version + 1;
        		NEW.esta_sincronizado := FALSE;
    		END IF;

    		IF (OLD.eliminado_el IS NULL AND NEW.eliminado_el IS NOT NULL) THEN
        		UPDATE permisos_fisicos
        		SET eliminado_el = NEW.eliminado_el
        		WHERE punto_acceso_id = NEW.id 
          		AND eliminado_el IS NULL;
    		END IF;
    
    		IF (OLD.eliminado_el IS NOT NULL AND NEW.eliminado_el IS NULL) THEN
        		UPDATE permisos_fisicos
        		SET eliminado_el = NULL
        		WHERE punto_acceso_id = NEW.id 
          		AND eliminado_el = OLD.eliminado_el;
    		END IF;

    		RETURN NEW;
		END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER tr_punto_acceso_cascada
    BEFORE UPDATE ON puntos_acceso
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_punto_acceso_cascada();



CREATE OR REPLACE FUNCTION notificar_punto_acceso_desincronizacion() 
	RETURNS TRIGGER AS $$
		DECLARE
    		v_mesh_id VARCHAR(17);
		BEGIN
    		SELECT u.mesh_id INTO v_mesh_id 
    		FROM ubicaciones u 
    		WHERE u.id = NEW.ubicacion_id;
    		IF (OLD.esta_sincronizado = TRUE AND NEW.esta_sincronizado = FALSE) THEN
        	PERFORM pg_notify(
            'device_desync', 
            json_build_object(
                'mac', NEW.mac, 
                'mesh_id', v_mesh_id
            )::text
        );
    		END IF;
    
    		RETURN NEW;
		END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER tr_puntos_acceso_mqtt_notificar
	AFTER UPDATE ON puntos_acceso
		FOR EACH ROW
		EXECUTE FUNCTION notificar_punto_acceso_desincronizacion();






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
    creado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMPTZ DEFAULT NULL
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
	creado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	actualizado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	eliminado_el TIMESTAMPTZ DEFAULT NULL,
	    
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
    
    creado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMPTZ DEFAULT NULL,
    
    CONSTRAINT unique_usuario_punto UNIQUE (usuario_id, punto_acceso_id)
);


--- MÓDULO LOGS DE ACCESO ----

CREATE TABLE logs_acceso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarjeta_id UUID REFERENCES tarjetas(id) ON DELETE SET NULL, -- Relación opcional
    punto_acceso_id UUID NOT NULL REFERENCES puntos_acceso(id) ON DELETE CASCADE,
    codigo_tarjeta VARCHAR(20) NOT NULL, -- El número que leyó el sensor (ej: "10725571")
    fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    autorizado BOOLEAN NOT NULL
);







--- MÓDULO PERMISOS DE APLICACIÓN ----

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(50) NOT NULL UNIQUE, 
    descripcion VARCHAR(255),
    creado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMPTZ DEFAULT NULL
);


CREATE TRIGGER tr_actualizar_fecha_roles
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();


CREATE TABLE app_permisos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    creado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado_el TIMESTAMPTZ DEFAULT NULL
);


CREATE TRIGGER tr_actualizar_fecha_app_permisos
    BEFORE UPDATE ON app_permisos
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();


CREATE TABLE rol_permisos (
    rol_id UUID NOT NULL,
    permiso_id UUID NOT NULL,
    creado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (rol_id, permiso_id),
    CONSTRAINT fk_rol_permiso FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_permiso FOREIGN KEY (permiso_id) REFERENCES app_permisos(id) ON DELETE CASCADE
);


CREATE TABLE usuario_roles (
    usuario_id UUID NOT NULL,
    rol_id UUID NOT NULL,
    creado_el TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usuario_id, rol_id),
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_rol FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE
);




