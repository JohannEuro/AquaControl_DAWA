namespace AquaControl.API.Models
{
    public class Parametro
    {
        public int Id { get; set; }
        public int CultivoId { get; set; }
        public string? Especie { get; set; } // Solo para mostrar en la lista
        public DateTime Fecha { get; set; }
        public decimal Ph { get; set; }
        public decimal Temperatura { get; set; }
        public decimal Oxigeno { get; set; }
        public decimal Salinidad { get; set; }
    }
}