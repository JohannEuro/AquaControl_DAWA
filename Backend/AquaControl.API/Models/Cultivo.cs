namespace AquaControl.API.Models
{
    public class Cultivo
    {
        public int Id { get; set; }
        public int PiscinaId { get; set; }
        public string? NombrePiscina { get; set; } // Solo para mostrar, no se guarda
        public DateTime FechaSiembra { get; set; }
        public string Especie { get; set; } = string.Empty;
        public int CantidadInicial { get; set; }
        public string Observaciones { get; set; } = string.Empty;
    }
}