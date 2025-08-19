--BASE DE DATOS TALLER MECANICO MYM

CREATE DATABASE MYM_DB
GO

USE MYM_DB;
GO

--CREAR USUARIO (para conexion)

CREATE LOGIN MYM_User WITH PASSWORD = 'J}q`bJ758u*x';
go

--************  TABLAS  ***********--

-- MODULO ADMINISTRATIVO --
-- Crear la tabla de Roles
CREATE TABLE ROLES (
    idRol INT PRIMARY KEY IDENTITY(1, 1), -- ID autoincremental
    nombreRol NVARCHAR(50) NOT NULL UNIQUE -- Nombre del rol (ej: "admin", "user")
);
INSERT INTO ROLES(nombreRol)VALUES('admin');
INSERT INTO ROLES(nombreRol)VALUES('user');
GO

CREATE TABLE USUARIO (
    idUsuario INT PRIMARY KEY IDENTITY(1, 1), -- ID autoincremental

    username NVARCHAR(50) NOT NULL UNIQUE, -- Nombre de usuario
    email NVARCHAR(100) NOT NULL UNIQUE, -- Correo electrónico
	cedula VARCHAR(10) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL, -- Contraseña (hash)
    idRol INT NOT NULL DEFAULT 2, -- FK al rol del usuario, DEFAULT "user"

    failedLoginAttempts INT DEFAULT 5, -- Intentos fallidos de inicio de sesión
    isLocked BIT DEFAULT 0, -- Indica si la cuenta está bloqueada (0 = no, 1 = sí)
    resetToken NVARCHAR(255) NULL, -- Token para recuperación de contraseña
    resetTokenExpiry DATETIME NULL, -- Fecha de expiración del token
    lastLogin DATETIME NULL, -- Fecha del último inicio de sesión
    lastPasswordChange DATETIME NULL, -- Fecha del último cambio de contraseña
    FOREIGN KEY (idRol) REFERENCES Roles(idRol) -- Relación con la tabla Roles
);
GO

INSERT INTO USUARIO(username, email, cedula, password, idRol)
VALUES ('admin', 'adminMYM@gmail.com', '208370479', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 1);--password:password
--select * from USUARIO
-- MODULO TRABAJADORES --
CREATE TABLE TRABAJADOR(

    idTrabajador INT IDENTITY(1,1) PRIMARY KEY,
    nombreCompleto VARCHAR(200) NOT NULL,
    cedula VARCHAR(10) NOT NULL UNIQUE,
    salario DECIMAL(10,2) NOT NULL,
    seguroSocial VARCHAR(50) NOT NULL,
	estado BIT NOT NULL DEFAULT 1
)
GO


CREATE TABLE HORARIO(

    idHorario INT IDENTITY(1,1) PRIMARY KEY,
    dias VARCHAR(100) NOT NULL,
    horaInicio VARCHAR(25) NOT NULL,
    horaFin VARCHAR(25) NOT NULL,

    --FK
    idTrabajador INT NOT NULL,
    FOREIGN KEY (idTrabajador) REFERENCES TRABAJADOR(idTrabajador) ON DELETE CASCADE

)
GO

CREATE TABLE VACACIONES(--no se modifico se uso esta misma tabla

    idVacaciones INT IDENTITY(1,1) PRIMARY KEY,
    solicitud VARCHAR(50) DEFAULT'en espera' NOT NULL,--en espera, rechazado, aceptado
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    
    motivoRechazo NVARCHAR(1000) NULL,

    idTrabajador INT NOT NULL,
    FOREIGN KEY (idTrabajador) REFERENCES TRABAJADOR(idTrabajador) ON DELETE CASCADE

)
GO

CREATE TABLE HISTORIAL_SALARIO(

    idHistorialSalario INT IDENTITY(1,1) PRIMARY KEY,
    fecha DATE NOT NULL,

    salarioBase DECIMAL(10,2) NOT NULL,
    bonificaciones DECIMAL(10,2) NULL,
    horasExtra DECIMAL(5,2) NULL,
    tarifaPorHoraExtra DECIMAL(10,2) NULL,

    --columnas calculadas
    totalHorasExtra AS ISNULL(tarifaPorHoraExtra * horasExtra, 0) PERSISTED,
    totalNeto AS salarioBase + ISNULL(bonificaciones, 0) + ISNULL(tarifaPorHoraExtra * horasExtra, 0) PERSISTED,

    --fk
    idTrabajador INT NOT NULL,
    FOREIGN KEY (idTrabajador) REFERENCES TRABAJADOR(idTrabajador) ON DELETE CASCADE

)
GO

CREATE TABLE ASISTENCIA_DIARIA(

    idAsistencia INT IDENTITY(1,1) PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,

    --FK
    idTrabajador INT NOT NULL,
    FOREIGN KEY (idTrabajador) REFERENCES TRABAJADOR(idTrabajador) ON DELETE CASCADE

)
GO

CREATE TABLE JUSTIFICACION_ASISTENCIA(

    idJustificacion INT IDENTITY(1,1) PRIMARY KEY,
    fecha DATE NOT NULL,
    detalles NVARCHAR(MAX)NOT NULL,

    --FK
    idTrabajador INT NOT NULL,
    FOREIGN KEY (idTrabajador) REFERENCES TRABAJADOR(idTrabajador) ON DELETE CASCADE

)
GO

-- MODULO CLIENTES --
CREATE TABLE CLIENTE(

    idCliente INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedula VARCHAR(10) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    fechaRegistro DATE NOT NULL,
	estado BIT NULL DEFAULT 1
)
GO

CREATE TABLE CLIENTE_VEHICULO(

    idVehiculo INT IDENTITY(1,1) PRIMARY KEY,
    placaVehiculo VARCHAR(20) NOT NULL UNIQUE,
    modeloVehiculo VARCHAR (100) NOT NULL,
    marcaVehiculo VARCHAR (50) NOT NULL,
    annoVehiculo INT NOT NULL,
    tipoVehiculo VARCHAR(30) NOT NULL,
	estado BIT NULL DEFAULT 1,

    idCliente INT NOT NULL
    FOREIGN KEY (idCliente) REFERENCES CLIENTE(idCliente) ON DELETE CASCADE

)
GO

-- MODULO INVENTARIO --
CREATE TABLE CATEGORIA(
    idCategoria INT IDENTITY(1,1) PRIMARY KEY,
    nombreCategoria VARCHAR(100) NOT NULL
)
GO

CREATE TABLE PROVEEDOR(
    idProveedor INT IDENTITY(1,1) PRIMARY KEY,
    nombreProveedor VARCHAR(100) NOT NULL
)
GO

CREATE TABLE MARCA_PRODUCTO(
    idMarca INT IDENTITY(1,1) PRIMARY KEY,
    nombreMarca VARCHAR(100) NOT NULL
)
GO

CREATE TABLE VEHICULOS_COMPATIBLES(
    idVehiculos INT IDENTITY(1,1) PRIMARY KEY,
    modelo VARCHAR (100) NOT NULL,
)
GO

CREATE TABLE INV_REPUESTO_SOLICITUD(
    idSolicitud INT IDENTITY(1,1) PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    cuerpo NVARCHAR(2048) NOT NULL,
    usuario VARCHAR(30) NOT NULL,
    fecha DATE DEFAULT GETDATE() NOT NULL,
    aprobado BIT NULL
);
GO

--producto o servicio
CREATE TABLE PRODUCTO_SERVICIO(

    idProducto INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    descripcion NVARCHAR(MAX) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    fechaIngreso DATE NOT NULL,
    ubicacionAlmacen VARCHAR(100) NOT NULL,
    proveedor VARCHAR(50) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    vehiculosCompatibles NVARCHAR(MAX) NOT NULL,--array
	estado BIT NOT NULL DEFAULT 1,

    tipo VARCHAR(50) NOT NULL, --SERVICIO O PRODUCTO
    img NVARCHAR(255) NULL,

    -- Opcional - Descuentos
    porcentajeDescuento DECIMAL(10,2) NULL,
	stockMinimo INT NULL
)
GO

CREATE TABLE AUDITORIA_TABLAS(

    idAuditoria INT IDENTITY(1,1) PRIMARY KEY,
    tipo CHAR(1) NOT NULL,
    tabla VARCHAR(50) NOT NULL,
    registro INT,
	campo VARCHAR(50),
	valorAntes VARCHAR(100),
	valorDespues VARCHAR(100),
	fecha DATETIME,
    usuario VARCHAR(50),
	PC VARCHAR(50)
);
GO

-- MODULO CONTROL DE FLUJO --
CREATE TABLE ORDEN(

    idOrden INT IDENTITY(1,1) PRIMARY KEY,
    codigoOrden VARCHAR(9) NOT NULL UNIQUE, --Codigo unico de orden
    estadoOrden INT NOT NULL DEFAULT 1, --Cancelado 0 (Delete), Pendiente 1, En proceso 2, Listo 3, Venta 4 (no se ve en flujo)
    fechaIngreso DATE NOT NULL DEFAULT GETDATE(),--al ingresar en una nueva orden en el flujo
    tiempoEstimado DATETIME NOT NULL,
    estadoAtrasado BIT NOT NULL DEFAULT 0,
	idVehiculo INT NOT NULL,
	descripcion NVARCHAR(2048) NULL,
	estadoCorreoNotificacion INT NULL DEFAULT 1,--si este valor es diferente a estadoOrden envia correo
    --FK
    --Se puede reasignar otro trabajador (update)
    idTrabajador INT,
    FOREIGN KEY (idTrabajador) REFERENCES TRABAJADOR(idTrabajador),

    --Al crear orden se ingresa cliente, pero no se puede actualizar ni borrar
    --ya que la orden es por cliente
    idCliente INT,
    FOREIGN KEY (idCliente) REFERENCES CLIENTE(idCliente)
)
GO

-- MODULO VENTAS --
CREATE TABLE COTIZACION(

    idCotizacion INT IDENTITY(1,1) PRIMARY KEY,
    montoTotal DECIMAL(10,2) NOT NULL,
    montoManoObra DECIMAL(10,2) NOT NULL,
    tiempoEstimado VARCHAR(100) NOT NULL,
    detalles NVARCHAR(1024) NOT NULL,
    fecha DATETIME DEFAULT GETDATE(),

    idCliente INT,
    FOREIGN KEY (idCliente) REFERENCES CLIENTE(idCliente)

)
GO

CREATE TABLE VENTA(

    idVenta INT IDENTITY(1,1) PRIMARY KEY,

    fechaVenta DATE DEFAULT GETDATE(),
    montoTotal DECIMAL(10,2) DEFAULT 0 NULL,
	detalles NVARCHAR(1024) NULL,
	ventaConsumada BIT DEFAULT 0 NOT NULL,--pagado o no pagado

    idOrden INT NOT NULL,
    FOREIGN KEY (idOrden) REFERENCES ORDEN(idOrden),
)
GO

CREATE TABLE PRODUCTO_POR_VENTA(
	idProductoVenta INT IDENTITY(1,1) PRIMARY KEY,

	idVenta INT NOT NULL,
	idProducto INT NOT NULL,
	cantidad INT NOT NULL,
	monto DECIMAL(10,2) NOT NULL,

	FOREIGN KEY (idVenta) REFERENCES VENTA(idVenta),
	FOREIGN KEY (idProducto)REFERENCES PRODUCTO_SERVICIO(idProducto)

);
GO

CREATE TABLE NOTIFICACIONES(

    idNotificacion INT IDENTITY(1,1) PRIMARY KEY,
    titulo VARCHAR(50) NOT NULL,
    cuerpo NVARCHAR(256) NOT NULL,
    fecha DATE DEFAULT GETDATE() NOT NULL,
    modulo VARCHAR(50) NOT NULL,
	tipo VARCHAR(10) NOT NULL,--error,info,warning
	estado BIT DEFAULT 1 NOT NULL ,

);
GO

-- MODULO FINANZAS --
CREATE TABLE PAGO_CLIENTE(

    idPago INT IDENTITY(1,1) PRIMARY KEY,
    monto DECIMAL(10,2) NOT NULL,
	dineroVuelto DECIMAL(10,2) NOT NULL,
    metodoPago VARCHAR(15) NOT NULL,--efectivo, transferencia
	subtotal DECIMAL(10,2) NOT NULL,
	iva DECIMAL(10,2) NOT NULL,
	total DECIMAL(10,2) NOT NULL,
    fecha DATE DEFAULT GETDATE() NOT NULL,
	--FK
    idVenta INT NOT NULL,
    FOREIGN KEY (idVenta) REFERENCES VENTA(idVenta)
);
GO

CREATE TABLE DEVOLUCION(

    idDevolucion INT IDENTITY(1,1) PRIMARY KEY,
    monto DECIMAL(10,2) NOT NULL,
    motivo VARCHAR(512) NOT NULL,
    fecha DATE DEFAULT GETDATE() NOT NULL,
	--FK
	idVenta INT NOT NULL,
    FOREIGN KEY (idVenta) REFERENCES VENTA(idVenta)
);
GO

CREATE TABLE GASTO_OPERATIVO(

    idGastoOperativo INT IDENTITY(1,1) PRIMARY KEY,
	tipoGasto VARCHAR(50) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
	detalle VARCHAR(512) NOT NULL,
    proveedor VARCHAR(50) NULL,

    fecha DATE DEFAULT GETDATE() NOT NULL
)
GO
--Ultimas tablas agregadas
CREATE TABLE AMONESTACIONES (
    idAmonestacion INT IDENTITY(1,1) PRIMARY KEY,
    idTrabajador INT NOT NULL,
    fechaAmonestacion DATE NOT NULL,
    tipoAmonestacion VARCHAR(50) NOT NULL, -- Ej: Verbal, Escrita
    motivo VARCHAR(255) NOT NULL,
    accionTomada VARCHAR(255),
    fechaRegistro DATETIME DEFAULT GETDATE(),

    CONSTRAINT fkTrabajador FOREIGN KEY (idTrabajador)
        REFERENCES Trabajador(idTrabajador) ON DELETE CASCADE
)
GO

CREATE TABLE AUSENCIAS (
    idAusencia INT IDENTITY(1,1) PRIMARY KEY,
    idTrabajador INT NOT NULL,
    fechaAusencia DATE NOT NULL,
    justificada BIT DEFAULT 0, -- 0 = No justificada, 1 = Justificada

    CONSTRAINT fkTrabajadorAusencias FOREIGN KEY (idTrabajador)
        REFERENCES TRABAJADOR(idTrabajador) ON DELETE CASCADE
);

CREATE TABLE JUSTIFICACIONES_AUSENCIA (
    idJustificacion INT IDENTITY(1,1) PRIMARY KEY,
    idAusencia INT NOT NULL UNIQUE, -- solo una justificación por ausencia
    motivo VARCHAR(255) NOT NULL,
    fechaJustificacion DATE DEFAULT GETDATE(),
    estado VARCHAR(20) DEFAULT 'Pendiente', -- Aprobada, Rechazada, etc.

    CONSTRAINT fkAusencia FOREIGN KEY (idAusencia)
        REFERENCES AUSENCIAS(idAusencia) ON DELETE CASCADE
);

--------------------------Ultimas Agregadas--------------------------------
