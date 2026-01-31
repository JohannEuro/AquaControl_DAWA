USE AquaControlDB
GO

-- 1. CREAR TABLA CULTIVOS
-- Fíjate en el "FOREIGN KEY": Es el candado que conecta con Piscinas.
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Cultivos]') AND type in (N'U'))
BEGIN
    CREATE TABLE Cultivos(
        Id INT IDENTITY(1,1) PRIMARY KEY,
        PiscinaId INT NOT NULL, 
        FechaSiembra DATETIME,
        Especie VARCHAR(50),
        CantidadInicial INT,
        Observaciones VARCHAR(200),
        
        CONSTRAINT FK_Cultivos_Piscinas FOREIGN KEY (PiscinaId) REFERENCES Piscinas(Id)
    )
END
GO

-- 2. PROCEDIMIENTO XML PARA CULTIVOS (Requisito del Profe)
CREATE OR ALTER PROCEDURE sp_GestionarCultivo_XML
    @xmlData XML
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Accion VARCHAR(20)
    DECLARE @Id INT
    DECLARE @PiscinaId INT
    DECLARE @FechaSiembra DATETIME
    DECLARE @Especie VARCHAR(50)
    DECLARE @CantidadInicial INT
    DECLARE @Observaciones VARCHAR(200)

    -- Leemos el XML
    SELECT 
        @Accion = T.c.value('(Accion)[1]', 'VARCHAR(20)'),
        @Id = T.c.value('(Id)[1]', 'INT'),
        @PiscinaId = T.c.value('(PiscinaId)[1]', 'INT'),
        @FechaSiembra = T.c.value('(FechaSiembra)[1]', 'DATETIME'),
        @Especie = T.c.value('(Especie)[1]', 'VARCHAR(50)'),
        @CantidadInicial = T.c.value('(CantidadInicial)[1]', 'INT'),
        @Observaciones = T.c.value('(Observaciones)[1]', 'VARCHAR(200)')
    FROM @xmlData.nodes('/Cultivo') AS T(c)

    IF @Accion = 'INSERTAR'
    BEGIN
        INSERT INTO Cultivos (PiscinaId, FechaSiembra, Especie, CantidadInicial, Observaciones)
        VALUES (@PiscinaId, @FechaSiembra, @Especie, @CantidadInicial, @Observaciones)
        SELECT SCOPE_IDENTITY() as NuevoId
    END
    ELSE IF @Accion = 'ACTUALIZAR'
    BEGIN
        UPDATE Cultivos
        SET PiscinaId = @PiscinaId, FechaSiembra = @FechaSiembra, Especie = @Especie, 
            CantidadInicial = @CantidadInicial, Observaciones = @Observaciones
        WHERE Id = @Id
    END
    ELSE IF @Accion = 'ELIMINAR'
    BEGIN
        DELETE FROM Cultivos WHERE Id = @Id
    END
END
GO

-- 3. PROCEDIMIENTO LISTAR (Con JOIN para ver el nombre de la piscina)
CREATE OR ALTER PROCEDURE sp_ListarCultivos
AS
BEGIN
    SELECT 
        c.Id, c.PiscinaId, p.Nombre as NombrePiscina, 
        c.FechaSiembra, c.Especie, c.CantidadInicial, c.Observaciones
    FROM Cultivos c
    INNER JOIN Piscinas p ON c.PiscinaId = p.Id
END
GO