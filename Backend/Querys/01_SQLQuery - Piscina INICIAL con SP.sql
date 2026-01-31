-- 1. CREAMOS LA BASE DE DATOS (Si no existe)
IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'AquaControlDB')
BEGIN
    CREATE DATABASE AquaControlDB
END
GO

-- 2. NOS METEMOS DENTRO DE ELLA
USE AquaControlDB
GO

-- 3. CREAMOS LA TABLA PISCINAS
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Piscinas]') AND type in (N'U'))
BEGIN
    CREATE TABLE Piscinas(
        Id INT IDENTITY(1,1) PRIMARY KEY, -- El ID se pone solo (1, 2, 3...)
        Nombre VARCHAR(50) NOT NULL,
        Ubicacion VARCHAR(100),
        Capacidad INT,
        Estado VARCHAR(20) DEFAULT 'Activa'
    )
END
GO

-- 4. EL PROCEDIMIENTO XML (EL REQUISITO DEL PROFE)
-- Este código es el "Portero". Recibe un paquete XML, lo abre y mete los datos a la tabla.
CREATE OR ALTER PROCEDURE sp_GestionarPiscina_XML
    @xmlData XML
AS
BEGIN
    SET NOCOUNT ON;

    -- Variables para guardar lo que viene en el XML
    DECLARE @Accion VARCHAR(20)
    DECLARE @Id INT
    DECLARE @Nombre VARCHAR(50)
    DECLARE @Ubicacion VARCHAR(100)
    DECLARE @Capacidad INT
    DECLARE @Estado VARCHAR(20)

    -- Leemos el XML (Desempaquetar)
    SELECT 
        @Accion = T.c.value('(Accion)[1]', 'VARCHAR(20)'),
        @Id = T.c.value('(Id)[1]', 'INT'),
        @Nombre = T.c.value('(Nombre)[1]', 'VARCHAR(50)'),
        @Ubicacion = T.c.value('(Ubicacion)[1]', 'VARCHAR(100)'),
        @Capacidad = T.c.value('(Capacidad)[1]', 'INT'),
        @Estado = T.c.value('(Estado)[1]', 'VARCHAR(20)')
    FROM @xmlData.nodes('/Piscina') AS T(c)

    -- Lógica: ¿Qué quieres hacer?
    IF @Accion = 'INSERTAR'
    BEGIN
        INSERT INTO Piscinas (Nombre, Ubicacion, Capacidad, Estado)
        VALUES (@Nombre, @Ubicacion, @Capacidad, @Estado)
        
        -- Devolvemos el ID nuevo para que la API sepa cuál es
        SELECT SCOPE_IDENTITY() as NuevoId
    END

    ELSE IF @Accion = 'ACTUALIZAR'
    BEGIN
        UPDATE Piscinas
        SET Nombre = @Nombre, Ubicacion = @Ubicacion, Capacidad = @Capacidad, Estado = @Estado
        WHERE Id = @Id
    END

    ELSE IF @Accion = 'ELIMINAR'
    BEGIN
        DELETE FROM Piscinas WHERE Id = @Id
    END
END
GO

-- 5. PROCEDIMIENTO SIMPLE PARA VER LA LISTA
CREATE OR ALTER PROCEDURE sp_ListarPiscinas
AS
BEGIN
    SELECT Id, Nombre, Ubicacion, Capacidad, Estado FROM Piscinas
END
GO


SELECT * FROM Piscinas