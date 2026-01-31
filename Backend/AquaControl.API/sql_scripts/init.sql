-- =============================================
-- 1. CREACIÓN DE LA BASE DE DATOS
-- =============================================
USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'AquaControlDB')
BEGIN
    CREATE DATABASE AquaControlDB;
END
GO

USE AquaControlDB;
GO

-- =============================================
-- 2. CREACIÓN DE TABLAS
-- =============================================

-- Tabla Piscinas
IF OBJECT_ID('dbo.Piscinas', 'U') IS NULL
BEGIN
    CREATE TABLE Piscinas (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nombre NVARCHAR(100) NOT NULL,
        Ubicacion NVARCHAR(100),
        Capacidad DECIMAL(10,2),
        Estado NVARCHAR(50) DEFAULT 'Activa'
    );
END
GO

-- Tabla Cultivos
IF OBJECT_ID('dbo.Cultivos', 'U') IS NULL
BEGIN
    CREATE TABLE Cultivos (
        Id INT IDENTITY(101,1) PRIMARY KEY,
        PiscinaId INT NOT NULL,
        FechaSiembra DATETIME DEFAULT GETDATE(),
        Especie NVARCHAR(100),
        CantidadInicial DECIMAL(10,2),
        Observaciones NVARCHAR(MAX),
        CONSTRAINT FK_Cultivos_Piscinas FOREIGN KEY (PiscinaId) REFERENCES Piscinas(Id)
    );
END
GO

-- Tabla Parametros
IF OBJECT_ID('dbo.Parametros', 'U') IS NULL
BEGIN
    CREATE TABLE Parametros (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CultivoId INT NOT NULL,
        Fecha DATETIME DEFAULT GETDATE(),
        Ph DECIMAL(4,2),
        Temperatura DECIMAL(5,2),
        Oxigeno DECIMAL(5,2),
        Salinidad DECIMAL(5,2),
        CONSTRAINT FK_Parametros_Cultivos FOREIGN KEY (CultivoId) REFERENCES Cultivos(Id)
    );
END
GO

-- Tabla Alimentacion
IF OBJECT_ID('dbo.Alimentacion', 'U') IS NULL
BEGIN
    CREATE TABLE Alimentacion (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CultivoId INT NOT NULL,
        Fecha DATETIME DEFAULT GETDATE(),
        TipoAlimento NVARCHAR(50),
        Cantidad DECIMAL(10,2),
        Observaciones NVARCHAR(200),
        CONSTRAINT FK_Alimentacion_Cultivos FOREIGN KEY (CultivoId) REFERENCES Cultivos(Id)
    );
END
GO

-- =============================================
-- 3. PROCEDIMIENTOS DE LECTURA (GET)
-- =============================================

CREATE OR ALTER PROCEDURE sp_ListarPiscinas 
AS 
BEGIN SELECT * FROM Piscinas; END
GO

CREATE OR ALTER PROCEDURE sp_ListarCultivos 
AS 
BEGIN SELECT C.*, P.Nombre as NombrePiscina FROM Cultivos C INNER JOIN Piscinas P ON C.PiscinaId = P.Id; END
GO

CREATE OR ALTER PROCEDURE sp_ListarParametros 
AS 
BEGIN SELECT P.*, C.Especie FROM Parametros P INNER JOIN Cultivos C ON P.CultivoId = C.Id; END
GO

CREATE OR ALTER PROCEDURE sp_ListarAlimentacion 
AS 
BEGIN SELECT A.*, C.Especie FROM Alimentacion A INNER JOIN Cultivos C ON A.CultivoId = C.Id; END
GO

-- =============================================
-- 4. PROCEDIMIENTOS DE ESCRITURA (XML BLINDADO)
-- Nota: Activamos SET QUOTED_IDENTIFIER ON antes de CADA uno
-- =============================================

-- A. GESTIONAR PISCINA
SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO
CREATE OR ALTER PROCEDURE sp_GestionarPiscina_XML
    @xmlData XML
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Accion NVARCHAR(50), @Id INT, @Nombre NVARCHAR(100), @Ubicacion NVARCHAR(100), @Capacidad DECIMAL(10,2), @Estado NVARCHAR(50);
    SELECT @Accion = T.c.value('(Accion)[1]', 'NVARCHAR(50)'), @Id = T.c.value('(Id)[1]', 'INT'), @Nombre = T.c.value('(Nombre)[1]', 'NVARCHAR(100)'), @Ubicacion = T.c.value('(Ubicacion)[1]', 'NVARCHAR(100)'), @Capacidad = T.c.value('(Capacidad)[1]', 'DECIMAL(10,2)'), @Estado = T.c.value('(Estado)[1]', 'NVARCHAR(50)') FROM @xmlData.nodes('/*') AS T(c);
    IF @Accion = 'INSERTAR' BEGIN INSERT INTO Piscinas (Nombre, Ubicacion, Capacidad, Estado) VALUES (@Nombre, @Ubicacion, @Capacidad, @Estado); SELECT SCOPE_IDENTITY(); END
    ELSE IF @Accion = 'ACTUALIZAR' BEGIN UPDATE Piscinas SET Nombre = @Nombre, Ubicacion = @Ubicacion, Capacidad = @Capacidad, Estado = @Estado WHERE Id = @Id; END
    ELSE IF @Accion = 'ELIMINAR' BEGIN DELETE FROM Piscinas WHERE Id = @Id; END
END
GO

-- B. GESTIONAR CULTIVO
SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO
CREATE OR ALTER PROCEDURE sp_GestionarCultivo_XML
    @xmlData XML
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Accion NVARCHAR(50), @Id INT, @PiscinaId INT, @Fecha DATETIME, @Especie NVARCHAR(100), @Cantidad DECIMAL(10,2), @Obs NVARCHAR(MAX);
    SELECT @Accion = T.c.value('(Accion)[1]', 'NVARCHAR(50)'), @Id = T.c.value('(Id)[1]', 'INT'), @PiscinaId = T.c.value('(PiscinaId)[1]', 'INT'), @Fecha = T.c.value('(FechaSiembra)[1]', 'DATETIME'), @Especie = T.c.value('(Especie)[1]', 'NVARCHAR(100)'), @Cantidad = T.c.value('(CantidadInicial)[1]', 'DECIMAL(10,2)'), @Obs = T.c.value('(Observaciones)[1]', 'NVARCHAR(MAX)') FROM @xmlData.nodes('/*') AS T(c);
    IF @Accion = 'INSERTAR' BEGIN INSERT INTO Cultivos VALUES (@PiscinaId, @Fecha, @Especie, @Cantidad, @Obs); SELECT SCOPE_IDENTITY(); END
    ELSE IF @Accion = 'ACTUALIZAR' BEGIN UPDATE Cultivos SET PiscinaId = @PiscinaId, FechaSiembra = @Fecha, Especie = @Especie, CantidadInicial = @Cantidad, Observaciones = @Obs WHERE Id = @Id; END
    ELSE IF @Accion = 'ELIMINAR' BEGIN DELETE FROM Cultivos WHERE Id = @Id; END
END
GO

-- C. GESTIONAR PARAMETRO
SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO
CREATE OR ALTER PROCEDURE sp_GestionarParametro_XML
    @xmlData XML
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Accion NVARCHAR(50), @Id INT, @CultivoId INT, @Fecha DATETIME, @Ph DECIMAL(4,2), @Temp DECIMAL(5,2), @Oxigeno DECIMAL(5,2), @Salinidad DECIMAL(5,2);
    SELECT @Accion = T.c.value('(Accion)[1]', 'NVARCHAR(50)'), @Id = T.c.value('(Id)[1]', 'INT'), @CultivoId = T.c.value('(CultivoId)[1]', 'INT'), @Fecha = T.c.value('(Fecha)[1]', 'DATETIME'), @Ph = T.c.value('(Ph)[1]', 'DECIMAL(4,2)'), @Temp = T.c.value('(Temperatura)[1]', 'DECIMAL(5,2)'), @Oxigeno = T.c.value('(Oxigeno)[1]', 'DECIMAL(5,2)'), @Salinidad = T.c.value('(Salinidad)[1]', 'DECIMAL(5,2)') FROM @xmlData.nodes('/*') AS T(c);
    IF @Accion = 'INSERTAR' BEGIN INSERT INTO Parametros VALUES (@CultivoId, @Fecha, @Ph, @Temp, @Oxigeno, @Salinidad); SELECT SCOPE_IDENTITY(); END
    ELSE IF @Accion = 'ACTUALIZAR' BEGIN UPDATE Parametros SET CultivoId = @CultivoId, Fecha = @Fecha, Ph = @Ph, Temperatura = @Temp, Oxigeno = @Oxigeno, Salinidad = @Salinidad WHERE Id = @Id; END
    ELSE IF @Accion = 'ELIMINAR' BEGIN DELETE FROM Parametros WHERE Id = @Id; END
END
GO

-- D. GESTIONAR ALIMENTACION
SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO
CREATE OR ALTER PROCEDURE sp_GestionarAlimentacion_XML
    @xmlData XML
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Accion NVARCHAR(50), @Id INT, @CultivoId INT, @Fecha DATETIME, @Tipo NVARCHAR(50), @Cant DECIMAL(10,2), @Obs NVARCHAR(200);
    SELECT @Accion = T.c.value('(Accion)[1]', 'NVARCHAR(50)'), @Id = T.c.value('(Id)[1]', 'INT'), @CultivoId = T.c.value('(CultivoId)[1]', 'INT'), @Fecha = T.c.value('(Fecha)[1]', 'DATETIME'), @Tipo = T.c.value('(TipoAlimento)[1]', 'NVARCHAR(50)'), @Cant = T.c.value('(Cantidad)[1]', 'DECIMAL(10,2)'), @Obs = T.c.value('(Observaciones)[1]', 'NVARCHAR(200)') FROM @xmlData.nodes('/*') AS T(c);
    IF @Accion = 'INSERTAR' BEGIN INSERT INTO Alimentacion VALUES (@CultivoId, @Fecha, @Tipo, @Cant, @Obs); SELECT SCOPE_IDENTITY(); END
    ELSE IF @Accion = 'ACTUALIZAR' BEGIN UPDATE Alimentacion SET CultivoId = @CultivoId, Fecha = @Fecha, TipoAlimento = @Tipo, Cantidad = @Cant, Observaciones = @Obs WHERE Id = @Id; END
    ELSE IF @Accion = 'ELIMINAR' BEGIN DELETE FROM Alimentacion WHERE Id = @Id; END
END
GO

-- =============================================
-- 5. SECCION USUARIO
-- =============================================

-- 1. Crear Tabla Usuarios (Si no existe)
IF OBJECT_ID('dbo.Usuarios', 'U') IS NULL
BEGIN
    CREATE TABLE Usuarios (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nombre NVARCHAR(100),
        Correo NVARCHAR(100) UNIQUE,
        Clave NVARCHAR(50) -- Texto plano (Requisito académico)
    );

    -- Insertar Usuario Admin por defecto
    INSERT INTO Usuarios (Nombre, Correo, Clave) 
    VALUES ('Administrador', 'admin@aqua.com', '12345');
END
GO

-- 2. Procedimiento: Login (Validar Credenciales)
SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO
CREATE OR ALTER PROCEDURE sp_ValidarUsuario
    @Correo NVARCHAR(100),
    @Clave NVARCHAR(50)
AS
BEGIN
    SELECT Id, Nombre, Correo 
    FROM Usuarios 
    WHERE Correo = @Correo AND Clave = @Clave;
END
GO

-- 3. Procedimiento: Listar Usuarios
SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO
CREATE OR ALTER PROCEDURE sp_ListarUsuarios
AS
BEGIN
    SELECT * FROM Usuarios;
END
GO

-- 4. Procedimiento: Gestión CRUD con XML
-- IMPORTANTE: Configuraciones requeridas para manipular XML
SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

CREATE OR ALTER PROCEDURE sp_GestionarUsuario_XML
    @xmlData XML
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Accion NVARCHAR(50), 
            @Id INT, 
            @Nombre NVARCHAR(100), 
            @Correo NVARCHAR(100), 
            @Clave NVARCHAR(50);

    -- Deserializar el XML
    SELECT 
        @Accion = T.c.value('(Accion)[1]', 'NVARCHAR(50)'),
        @Id = T.c.value('(Id)[1]', 'INT'),
        @Nombre = T.c.value('(Nombre)[1]', 'NVARCHAR(100)'),
        @Correo = T.c.value('(Correo)[1]', 'NVARCHAR(100)'),
        @Clave = T.c.value('(Clave)[1]', 'NVARCHAR(50)')
    FROM @xmlData.nodes('/*') AS T(c);

    -- Lógica del CRUD
    IF @Accion = 'INSERTAR'
    BEGIN
        INSERT INTO Usuarios (Nombre, Correo, Clave)
        VALUES (@Nombre, @Correo, @Clave);
        SELECT SCOPE_IDENTITY(); 
    END
    ELSE IF @Accion = 'ACTUALIZAR'
    BEGIN
        UPDATE Usuarios
        SET Nombre = @Nombre, 
            Correo = @Correo, 
            Clave = @Clave
        WHERE Id = @Id;
    END
    ELSE IF @Accion = 'ELIMINAR'
    BEGIN
        DELETE FROM Usuarios WHERE Id = @Id;
    END
END
GO