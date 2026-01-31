using AquaControl.API.Models;
using System.Data;
using System.Data.SqlClient; // Usamos el "chofer" que instalamos

namespace AquaControl.API.Data
{
    public class PiscinaRepository
    {
        // Aquí guardaremos la dirección de la base de datos
        private readonly string _cadenaConexion;

        // CONSTRUCTOR: Se ejecuta apenas nace esta clase.
        // Recibe la configuración (appsettings.json) para leer la cadena de conexión.
        public PiscinaRepository(IConfiguration configuration)
        {
            _cadenaConexion = configuration.GetConnectionString("CadenaSQL")!;
        }

        // METODO 1: Gestionar (Insertar/Editar/Eliminar) usando XML
        public async Task<int> GestionarPiscina(Piscina piscina, string accion)
        {
            int resultadoId = 0;

            // --- PASO A: ARMAMOS EL XML MANUALMENTE ---
            // Usamos el signo $ para inyectar variables dentro del texto.
            // Esto cumple el requisito de la rúbrica de enviar XML.
            string xmlData = $@"
                <Piscina>
                    <Accion>{accion}</Accion>
                    <Id>{piscina.Id}</Id>
                    <Nombre>{piscina.Nombre}</Nombre>
                    <Ubicacion>{piscina.Ubicacion}</Ubicacion>
                    <Capacidad>{piscina.Capacidad}</Capacidad>
                    <Estado>{piscina.Estado}</Estado>
                </Piscina>";

            // --- PASO B: CONECTAR A SQL (ADO.NET PURO) ---

            // 1. Creamos la conexión (El cable al servidor)
            using (SqlConnection conexion = new SqlConnection(_cadenaConexion))
            {
                // 2. Preparamos la orden (El comando)
                using (SqlCommand cmd = new SqlCommand("sp_GestionarPiscina_XML", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure; // Decimos que es un SP

                    // 3. Le pasamos el XML como parámetro
                    cmd.Parameters.Add("@xmlData", SqlDbType.Xml).Value = xmlData;

                    // 4. Abrimos la puerta
                    await conexion.OpenAsync();

                    // 5. Ejecutamos la orden y esperamos si devuelve algo (el ID nuevo)
                    var result = await cmd.ExecuteScalarAsync();

                    if (result != null)
                    {
                        resultadoId = Convert.ToInt32(result);
                    }
                }
            } // Aquí se cierra la conexión automáticamente gracias al "using"

            return resultadoId;
        }

        // METODO 2: Listar todas las piscinas (Para ver la tabla)
        public async Task<List<Piscina>> ListarPiscinas()
        {
            var lista = new List<Piscina>();

            using (SqlConnection conexion = new SqlConnection(_cadenaConexion))
            {
                // Usamos el otro SP sencillo para listar
                using (SqlCommand cmd = new SqlCommand("sp_ListarPiscinas", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    await conexion.OpenAsync();

                    // ExecuteReader es como un cursor que lee fila por fila
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            // Convertimos la fila de SQL a un objeto C# Piscina
                            lista.Add(new Piscina
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Nombre = reader["Nombre"].ToString()!,
                                Ubicacion = reader["Ubicacion"].ToString()!,
                                Capacidad = Convert.ToInt32(reader["Capacidad"]),
                                Estado = reader["Estado"].ToString()!
                            });
                        }
                    }
                }
            }
            return lista;
        }
    }
}