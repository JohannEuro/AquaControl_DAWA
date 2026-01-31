USE AquaControlDB
GO

-- =============================================
-- MÓDULO 3: PARÁMETROS (Calidad del Agua)
-- =============================================

-- 1. Tabla
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Parametros]') AND type in (N'U'))
BEGIN
    CREATE TABLE Parametros(
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CultivoId INT NOT NULL,
        Fecha DATETIME,
        Ph DECIMAL(4,2),         -- Decimal para guardar "7.5"
        Temperatura DECIMAL(4,2), -- Decimal para guardar "28.3"
        Oxigeno DECIMAL(4,2),
        Salinidad DECIMAL(4,2),
        
        CONSTRAINT FK_Parametros_Cultivos FOREIGN KEY (CultivoId) REFERENCES Cultivos(Id)
    )
END
GO

-- 2. SP Gestión XML
CREATE OR ALTER PROCEDURE sp_GestionarParametro_XML
    @xmlData XML
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Accion VARCHAR(20)
    DECLARE @Id INT
    DECLARE @CultivoId INT
    DECLARE @Fecha DATETIME
    DECLARE @Ph DECIMAL(4,2)
    DECLARE @Temperatura DECIMAL(4,2)
    DECLARE @Oxigeno DECIMAL(4,2)
    DECLARE @Salinidad DECIMAL(4,2)

    SELECT 
        @Accion = T.c.value('(Accion)[1]', 'VARCHAR(20)'),
        @Id = T.c.value('(Id)[1]', 'INT'),
        @CultivoId = T.c.value('(CultivoId)[1]', 'INT'),
        @Fecha = T.c.value('(Fecha)[1]', 'DATETIME'),
        @Ph = T.c.value('(Ph)[1]', 'DECIMAL(4,2)'),
        @Temperatura = T.c.value('(Temperatura)[1]', 'DECIMAL(4,2)'),
        @Oxigeno = T.c.value('(Oxigeno)[1]', 'DECIMAL(4,2)'),
        @Salinidad = T.c.value('(Salinidad)[1]', 'DECIMAL(4,2)')
    FROM @xmlData.nodes('/Parametro') AS T(c)

    IF @Accion = 'INSERTAR'
    BEGIN
        INSERT INTO Parametros (CultivoId, Fecha, Ph, Temperatura, Oxigeno, Salinidad)
        VALUES (@CultivoId, @Fecha, @Ph, @Temperatura, @Oxigeno, @Salinidad)
        SELECT SCOPE_IDENTITY() as NuevoId
    END
    ELSE IF @Accion = 'ACTUALIZAR'
    BEGIN
        UPDATE Parametros
        SET CultivoId = @CultivoId, Fecha = @Fecha, Ph = @Ph, 
            Temperatura = @Temperatura, Oxigeno = @Oxigeno, Salinidad = @Salinidad
        WHERE Id = @Id
    END
    ELSE IF @Accion = 'ELIMINAR'
        DELETE FROM Parametros WHERE Id = @Id
END
GO

-- 3. SP Listar (Vemos el ID del Cultivo)
CREATE OR ALTER PROCEDURE sp_ListarParametros
AS
BEGIN
    SELECT p.*, c.Especie -- Traemos la especie para saber de qué cultivo es
    FROM Parametros p
    INNER JOIN Cultivos c ON p.CultivoId = c.Id
END
GO

-- =============================================
-- MÓDULO 4: ALIMENTACIÓN
-- =============================================

-- 1. Tabla
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Alimentacion]') AND type in (N'U'))
BEGIN
    CREATE TABLE Alimentacion(
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CultivoId INT NOT NULL,
        Fecha DATETIME,
        TipoAlimento VARCHAR(50),
        Cantidad DECIMAL(10,2),
        Observaciones VARCHAR(200),
        
        CONSTRAINT FK_Alimentacion_Cultivos FOREIGN KEY (CultivoId) REFERENCES Cultivos(Id)
    )
END
GO

-- 2. SP Gestión XML
CREATE OR ALTER PROCEDURE sp_GestionarAlimentacion_XML
    @xmlData XML
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Accion VARCHAR(20)
    DECLARE @Id INT
    DECLARE @CultivoId INT
    DECLARE @Fecha DATETIME
    DECLARE @TipoAlimento VARCHAR(50)
    DECLARE @Cantidad DECIMAL(10,2)
    DECLARE @Observaciones VARCHAR(200)

    SELECT 
        @Accion = T.c.value('(Accion)[1]', 'VARCHAR(20)'),
        @Id = T.c.value('(Id)[1]', 'INT'),
        @CultivoId = T.c.value('(CultivoId)[1]', 'INT'),
        @Fecha = T.c.value('(Fecha)[1]', 'DATETIME'),
        @TipoAlimento = T.c.value('(TipoAlimento)[1]', 'VARCHAR(50)'),
        @Cantidad = T.c.value('(Cantidad)[1]', 'DECIMAL(10,2)'),
        @Observaciones = T.c.value('(Observaciones)[1]', 'VARCHAR(200)')
    FROM @xmlData.nodes('/Alimentacion') AS T(c)

    IF @Accion = 'INSERTAR'
    BEGIN
        INSERT INTO Alimentacion (CultivoId, Fecha, TipoAlimento, Cantidad, Observaciones)
        VALUES (@CultivoId, @Fecha, @TipoAlimento, @Cantidad, @Observaciones)
        SELECT SCOPE_IDENTITY() as NuevoId
    END
    ELSE IF @Accion = 'ACTUALIZAR'
    BEGIN
        UPDATE Alimentacion
        SET CultivoId = @CultivoId, Fecha = @Fecha, TipoAlimento = @TipoAlimento, 
            Cantidad = @Cantidad, Observaciones = @Observaciones
        WHERE Id = @Id
    END
    ELSE IF @Accion = 'ELIMINAR'
        DELETE FROM Alimentacion WHERE Id = @Id
END
GO

-- 3. SP Listar
CREATE OR ALTER PROCEDURE sp_ListarAlimentacion
AS
BEGIN
    SELECT a.*, c.Especie
    FROM Alimentacion a
    INNER JOIN Cultivos c ON a.CultivoId = c.Id
END
GO