using AquaControl.API.Models;
using System.Data;
using System.Data.SqlClient;

namespace AquaControl.API.Data
{
    public class CultivoRepository
    {
        private readonly string _cadenaConexion;

        public CultivoRepository(IConfiguration configuration)
        {
            _cadenaConexion = configuration.GetConnectionString("CadenaSQL")!;
        }

        public async Task<int> GestionarCultivo(Cultivo cultivo, string accion)
        {
            int resultadoId = 0;
            string xmlData = $@"
                <Cultivo>
                    <Accion>{accion}</Accion>
                    <Id>{cultivo.Id}</Id>
                    <PiscinaId>{cultivo.PiscinaId}</PiscinaId>
                    <FechaSiembra>{cultivo.FechaSiembra:yyyy-MM-ddTHH:mm:ss}</FechaSiembra>
                    <Especie>{cultivo.Especie}</Especie>
                    <CantidadInicial>{cultivo.CantidadInicial}</CantidadInicial>
                    <Observaciones>{cultivo.Observaciones}</Observaciones>
                </Cultivo>";

            using (SqlConnection conexion = new SqlConnection(_cadenaConexion))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GestionarCultivo_XML", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@xmlData", SqlDbType.Xml).Value = xmlData;
                    await conexion.OpenAsync();
                    var res = await cmd.ExecuteScalarAsync();
                    if (res != null) resultadoId = Convert.ToInt32(res);
                }
            }
            return resultadoId;
        }

        public async Task<List<Cultivo>> ListarCultivos()
        {
            var lista = new List<Cultivo>();
            using (SqlConnection conexion = new SqlConnection(_cadenaConexion))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ListarCultivos", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    await conexion.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            lista.Add(new Cultivo
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                PiscinaId = Convert.ToInt32(reader["PiscinaId"]),
                                NombrePiscina = reader["NombrePiscina"].ToString(),
                                FechaSiembra = Convert.ToDateTime(reader["FechaSiembra"]),
                                Especie = reader["Especie"].ToString()!,
                                CantidadInicial = Convert.ToInt32(reader["CantidadInicial"]),
                                Observaciones = reader["Observaciones"].ToString()!
                            });
                        }
                    }
                }
            }
            return lista;
        }
    }
}