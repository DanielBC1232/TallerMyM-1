use MYM_DB;
go

--Trigger registrar insert
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--TRG INSERT
CREATE TRIGGER  TR_PRODUCTOS_INSERT
   ON PRODUCTO_SERVICIO
   AFTER INSERT
AS 
BEGIN

	SET NOCOUNT ON;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','idProducto',NULL,INSERTED.idProducto, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','nombre',NULL,INSERTED.nombre, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','marca',NULL,INSERTED.marca, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','descripcion',NULL,INSERTED.descripcion, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','precio',NULL,INSERTED.precio, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','stock',NULL,INSERTED.stock, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','fechaIngreso',NULL,INSERTED.fechaIngreso, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','ubicacionAlmacen',NULL,INSERTED.ubicacionAlmacen, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','proveedor',NULL,INSERTED.proveedor, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','categoria',NULL,INSERTED.categoria, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','vehiculosCompatibles',NULL,INSERTED.vehiculosCompatibles, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','tipo',NULL,INSERTED.tipo, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','img',NULL,INSERTED.img, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','porcentajeDescuento',NULL,INSERTED.porcentajeDescuento, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','fechaInicio',NULL,INSERTED.fechaInicio, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

	INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO','fechaFin',NULL,INSERTED.fechaFin, SYSTEM_USER, HOST_NAME(),GETDATE(),'I',INSERTED.idProducto FROM INSERTED;

END
GO

--TRG UPDATE
CREATE TRIGGER TR_PRODUCTOS_UPDATE
   ON PRODUCTO_SERVICIO
   AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Campo idProducto
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'idProducto',
         d.idProducto,
         i.idProducto,
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.idProducto <> d.idProducto OR 
           (i.idProducto IS NULL AND d.idProducto IS NOT NULL) OR 
           (i.idProducto IS NOT NULL AND d.idProducto IS NULL));

    -- Campo nombre
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'nombre',
         d.nombre,
         i.nombre,
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.nombre <> d.nombre OR 
           (i.nombre IS NULL AND d.nombre IS NOT NULL) OR 
           (i.nombre IS NOT NULL AND d.nombre IS NULL));

    -- Campo marca
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'marca',
         d.marca,
         i.marca,
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.marca <> d.marca OR 
           (i.marca IS NULL AND d.marca IS NOT NULL) OR 
           (i.marca IS NOT NULL AND d.marca IS NULL));

    -- Campo descripcion
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'descripcion',
         d.descripcion,
         i.descripcion,
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.descripcion <> d.descripcion OR 
           (i.descripcion IS NULL AND d.descripcion IS NOT NULL) OR 
           (i.descripcion IS NOT NULL AND d.descripcion IS NULL));

    -- Campo precio
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'precio',
         CAST(d.precio AS VARCHAR(50)),
         CAST(i.precio AS VARCHAR(50)),
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.precio <> d.precio OR 
           (i.precio IS NULL AND d.precio IS NOT NULL) OR 
           (i.precio IS NOT NULL AND d.precio IS NULL));

    -- Campo stock
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'stock',
         CAST(d.stock AS VARCHAR(50)),
         CAST(i.stock AS VARCHAR(50)),
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.stock <> d.stock OR 
           (i.stock IS NULL AND d.stock IS NOT NULL) OR 
           (i.stock IS NOT NULL AND d.stock IS NULL));

    -- Campo fechaIngreso
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'fechaIngreso',
         CONVERT(VARCHAR, d.fechaIngreso, 121),
         CONVERT(VARCHAR, i.fechaIngreso, 121),
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.fechaIngreso <> d.fechaIngreso OR 
           (i.fechaIngreso IS NULL AND d.fechaIngreso IS NOT NULL) OR 
           (i.fechaIngreso IS NOT NULL AND d.fechaIngreso IS NULL));

    -- Campo ubicacionAlmacen
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'ubicacionAlmacen',
         d.ubicacionAlmacen,
         i.ubicacionAlmacen,
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.ubicacionAlmacen <> d.ubicacionAlmacen OR 
           (i.ubicacionAlmacen IS NULL AND d.ubicacionAlmacen IS NOT NULL) OR 
           (i.ubicacionAlmacen IS NOT NULL AND d.ubicacionAlmacen IS NULL));

    -- Campo proveedor
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'proveedor',
         d.proveedor,
         i.proveedor,
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.proveedor <> d.proveedor OR 
           (i.proveedor IS NULL AND d.proveedor IS NOT NULL) OR 
           (i.proveedor IS NOT NULL AND d.proveedor IS NULL));

    -- Campo categoria
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'categoria',
         d.categoria,
         i.categoria,
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.categoria <> d.categoria OR 
           (i.categoria IS NULL AND d.categoria IS NOT NULL) OR 
           (i.categoria IS NOT NULL AND d.categoria IS NULL));

    -- Campo vehiculosCompatibles
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'vehiculosCompatibles',
         d.vehiculosCompatibles,
         i.vehiculosCompatibles,
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.vehiculosCompatibles <> d.vehiculosCompatibles OR 
           (i.vehiculosCompatibles IS NULL AND d.vehiculosCompatibles IS NOT NULL) OR 
           (i.vehiculosCompatibles IS NOT NULL AND d.vehiculosCompatibles IS NULL));

    -- Campo tipo
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'tipo',
         d.tipo,
         i.tipo,
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.tipo <> d.tipo OR 
           (i.tipo IS NULL AND d.tipo IS NOT NULL) OR 
           (i.tipo IS NOT NULL AND d.tipo IS NULL));

    -- Campo img
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'img',
         d.img,
         i.img,
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.img <> d.img OR 
           (i.img IS NULL AND d.img IS NOT NULL) OR 
           (i.img IS NOT NULL AND d.img IS NULL));

    -- Campo porcentajeDescuento
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'porcentajeDescuento',
         CAST(d.porcentajeDescuento AS VARCHAR(50)),
         CAST(i.porcentajeDescuento AS VARCHAR(50)),
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.porcentajeDescuento <> d.porcentajeDescuento OR 
           (i.porcentajeDescuento IS NULL AND d.porcentajeDescuento IS NOT NULL) OR 
           (i.porcentajeDescuento IS NOT NULL AND d.porcentajeDescuento IS NULL));

    -- Campo fechaInicio
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'fechaInicio',
         CONVERT(VARCHAR, d.fechaInicio, 121),
         CONVERT(VARCHAR, i.fechaInicio, 121),
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.fechaInicio <> d.fechaInicio OR 
           (i.fechaInicio IS NULL AND d.fechaInicio IS NOT NULL) OR 
           (i.fechaInicio IS NOT NULL AND d.fechaInicio IS NULL));

    -- Campo fechaFin
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 
         'PRODUCTO_SERVICIO',
         'fechaFin',
         CONVERT(VARCHAR, d.fechaFin, 121),
         CONVERT(VARCHAR, i.fechaFin, 121),
         SYSTEM_USER,
         HOST_NAME(),
         GETDATE(),
         'U',
         i.idProducto
    FROM INSERTED i
    INNER JOIN DELETED d ON i.idProducto = d.idProducto
    WHERE (i.fechaFin <> d.fechaFin OR 
           (i.fechaFin IS NULL AND d.fechaFin IS NOT NULL) OR 
           (i.fechaFin IS NOT NULL AND d.fechaFin IS NULL));
END
GO

--TRG DELETE
CREATE TRIGGER TR_PRODUCTOS_DELETE
   ON PRODUCTO_SERVICIO
   AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Campo idProducto
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'idProducto', d.idProducto, NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;

    -- Campo nombre
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'nombre', d.nombre, NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;

    -- Campo marca
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'marca', d.marca, NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;

    -- Campo descripcion
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'descripcion', d.descripcion, NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;

    -- Campo precio
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'precio', CAST(d.precio AS VARCHAR(50)), NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;

    -- Campo stock
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'stock', CAST(d.stock AS VARCHAR(50)), NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;

    -- Campo fechaIngreso
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'fechaIngreso', CONVERT(VARCHAR, d.fechaIngreso, 121), NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;

    -- Campo ubicacionAlmacen
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'ubicacionAlmacen', d.ubicacionAlmacen, NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;

    -- Campo proveedor
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'proveedor', d.proveedor, NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;

    -- Campo categoria
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'categoria', d.categoria, NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;

    -- Campo vehiculosCompatibles
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'vehiculosCompatibles', d.vehiculosCompatibles, NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;

    -- Campo tipo
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'tipo', d.tipo, NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;

    -- Campo img
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'img', d.img, NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;

    -- Campo porcentajeDescuento
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'porcentajeDescuento', CAST(d.porcentajeDescuento AS VARCHAR(50)), NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;

    -- Campo fechaInicio
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'fechaInicio', CONVERT(VARCHAR, d.fechaInicio, 121), NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;

    -- Campo fechaFin
    INSERT INTO AUDITORIA_TABLAS (tabla, campo, valorAntes, valorDespues, usuario, PC, fecha, tipo, registro)
    SELECT 'PRODUCTO_SERVICIO', 'fechaFin', CONVERT(VARCHAR, d.fechaFin, 121), NULL, SYSTEM_USER, HOST_NAME(), GETDATE(), 'D', d.idProducto
    FROM DELETED d;
END
GO

--//Auditoria de tabla orden
CREATE TRIGGER TR_AUDIT_ORDEN_INSERT
ON ORDEN
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO AUDITORIA_TABLAS (tipo, tabla, registro, campo, valorAntes, valorDespues, fecha, usuario, PC)
    SELECT 
        'I' AS tipo,
        'ORDEN' AS tabla,
        i.idOrden AS registro,
        'NUEVO REGISTRO' AS campo,
        NULL AS valorAntes,
        CONCAT('Orden creada: ', i.codigoOrden) AS valorDespues,
        GETDATE() AS fecha,
        SUSER_NAME() AS usuario,
        HOST_NAME() AS PC
    FROM inserted i;
END;
GO

CREATE OR ALTER TRIGGER TR_AUDIT_ORDEN_UPDATE
ON ORDEN
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO AUDITORIA_TABLAS (tipo, tabla, registro, campo, valorAntes, valorDespues, fecha, usuario, PC)
    SELECT 
        'U' AS tipo,
        'ORDEN' AS tabla,
        i.idOrden AS registro,
        'codigoOrden' AS campo,
        d.codigoOrden AS valorAntes,
        i.codigoOrden AS valorDespues,
        GETDATE() AS fecha,
        SUSER_NAME() AS usuario,
        HOST_NAME() AS PC
    FROM inserted i
    INNER JOIN deleted d ON i.idOrden = d.idOrden
    WHERE i.codigoOrden <> d.codigoOrden

    UNION ALL

    SELECT 'U', 'ORDEN', i.idOrden, 'estadoOrden', d.estadoOrden, i.estadoOrden, GETDATE(), SUSER_NAME(), HOST_NAME()
    FROM inserted i
    INNER JOIN deleted d ON i.idOrden = d.idOrden
    WHERE i.estadoOrden <> d.estadoOrden 

    UNION ALL

    SELECT 'U', 'ORDEN', i.idOrden, 'idVehiculo', CAST(d.idVehiculo AS VARCHAR), CAST(i.idVehiculo AS VARCHAR), GETDATE(), SUSER_NAME(), HOST_NAME()
    FROM inserted i
    INNER JOIN deleted d ON i.idOrden = d.idOrden
    WHERE i.idVehiculo <> d.idVehiculo

    UNION ALL

    SELECT 'U', 'ORDEN', i.idOrden, 'idTrabajador', CAST(d.idTrabajador AS VARCHAR), CAST(i.idTrabajador AS VARCHAR), GETDATE(), SUSER_NAME(), HOST_NAME()
    FROM inserted i
    INNER JOIN deleted d ON i.idOrden = d.idOrden
    WHERE i.idTrabajador <> d.idTrabajador

END;
GO

CREATE TRIGGER TR_AUDIT_ORDEN_DELETE
ON ORDEN
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO AUDITORIA_TABLAS (tipo, tabla, registro, campo, valorAntes, valorDespues, fecha, usuario, PC)
    SELECT 
        'D' AS tipo,
        'ORDEN' AS tabla,
        d.idOrden AS registro,
        'codigoOrden' AS campo,
        d.codigoOrden AS valorAntes,
        NULL AS valorDespues,
        GETDATE() AS fecha,
        SUSER_NAME() AS usuario,
        HOST_NAME() AS PC
    FROM deleted d

    UNION ALL

    SELECT 'D', 'ORDEN', d.idOrden, 'estadoOrden', CAST(d.estadoOrden AS VARCHAR), NULL, GETDATE(), SUSER_NAME(), HOST_NAME()
    FROM deleted d

    UNION ALL

    SELECT 'D', 'ORDEN', d.idOrden, 'tiempoEstimado', CONVERT(VARCHAR, d.tiempoEstimado, 120), NULL, GETDATE(), SUSER_NAME(), HOST_NAME()
    FROM deleted d

    UNION ALL

    SELECT 'D', 'ORDEN', d.idOrden, 'idVehiculo', CAST(d.idVehiculo AS VARCHAR), NULL, GETDATE(), SUSER_NAME(), HOST_NAME()
    FROM deleted d

    UNION ALL

    SELECT 'D', 'ORDEN', d.idOrden, 'idTrabajador', CAST(d.idTrabajador AS VARCHAR), NULL, GETDATE(), SUSER_NAME(), HOST_NAME()
    FROM deleted d

    UNION ALL

    SELECT 'D', 'ORDEN', d.idOrden, 'descripcion', d.descripcion, NULL, GETDATE(), SUSER_NAME(), HOST_NAME()
    FROM deleted d;
END;
GO

--Trigger Ausencias
CREATE TRIGGER trg_ActualizarJustificada
ON JUSTIFICACIONES_AUSENCIA
AFTER INSERT
AS
BEGIN
    UPDATE AUSENCIAS
    SET justificada = 1
    WHERE idAusencia IN (SELECT idAusencia FROM inserted);
END;
