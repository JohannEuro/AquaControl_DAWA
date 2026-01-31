namespace AquaControl.API.Models
{
    public class Piscina
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Ubicacion { get; set; } = string.Empty;
        public int Capacidad { get; set; }
        public string Estado { get; set; } = "Activa";
    }
}