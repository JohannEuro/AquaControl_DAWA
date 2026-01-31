namespace AquaControl.API.Models
{
    public class Alimentacion
    {
        public int Id { get; set; }
        public int CultivoId { get; set; }
        public string? Especie { get; set; } // Solo para mostrar
        public DateTime Fecha { get; set; }
        public string TipoAlimento { get; set; } = string.Empty;
        public decimal Cantidad { get; set; }
        public string Observaciones { get; set; } = string.Empty;
    }
}