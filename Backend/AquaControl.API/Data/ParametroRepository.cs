using AquaControl.API.Models;
using System.Data;
using System.Data.SqlClient;

namespace AquaControl.API.Data
{
    public class ParametroRepository
    {
        private readonly string _cadenaConexion;

        public ParametroRepository(IConfiguration configuration)
        {
            _cadenaConexion = configuration.GetConnectionString("CadenaSQL")!;
        }

        public async Task<int> GestionarParametro(Parametro param, string accion)
        {
            int resultadoId = 0;
            // OJO: Aquí construimos el XML específico para Parametros
            string xmlData = $@"
                <Parametro>
                    <Accion>{accion}</Accion>
                    <Id>{param.Id}</Id>
                    <CultivoId>{param.CultivoId}</CultivoId>
                    <Fecha>{param.Fecha:yyyy-MM-ddTHH:mm:ss}</Fecha>
                    <Ph>{param.Ph}</Ph>
                    <Temperatura>{param.Temperatura}</Temperatura>
                    <Oxigeno>{param.Oxigeno}</Oxigeno>
                    <Salinidad>{param.Salinidad}</Salinidad>
                </Parametro>";

            using (SqlConnection conexion = new SqlConnection(_cadenaConexion))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GestionarParametro_XML", conexion))
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

        public async Task<List<Parametro>> ListarParametros()
        {
            var lista = new List<Parametro>();
            using (SqlConnection conexion = new SqlConnection(_cadenaConexion))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ListarParametros", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    await conexion.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            lista.Add(new Parametro
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                CultivoId = Convert.ToInt32(reader["CultivoId"]),
                                Especie = reader["Especie"].ToString(),
                                Fecha = Convert.ToDateTime(reader["Fecha"]),
                                Ph = Convert.ToDecimal(reader["Ph"]),
                                Temperatura = Convert.ToDecimal(reader["Temperatura"]),
                                Oxigeno = Convert.ToDecimal(reader["Oxigeno"]),
                                Salinidad = Convert.ToDecimal(reader["Salinidad"])
                            });
                        }
                    }
                }
            }
            return lista;
        }
    }
}