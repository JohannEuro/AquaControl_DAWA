using AquaControl.API.Models;
using System.Data;
using System.Data.SqlClient;

namespace AquaControl.API.Data
{
    public class AlimentacionRepository
    {
        private readonly string _cadenaConexion;

        public AlimentacionRepository(IConfiguration configuration)
        {
            _cadenaConexion = configuration.GetConnectionString("CadenaSQL")!;
        }

        public async Task<int> GestionarAlimentacion(Alimentacion ali, string accion)
        {
            int resultadoId = 0;
            string xmlData = $@"
                <Alimentacion>
                    <Accion>{accion}</Accion>
                    <Id>{ali.Id}</Id>
                    <CultivoId>{ali.CultivoId}</CultivoId>
                    <Fecha>{ali.Fecha:yyyy-MM-ddTHH:mm:ss}</Fecha>
                    <TipoAlimento>{ali.TipoAlimento}</TipoAlimento>
                    <Cantidad>{ali.Cantidad}</Cantidad>
                    <Observaciones>{ali.Observaciones}</Observaciones>
                </Alimentacion>";

            using (SqlConnection conexion = new SqlConnection(_cadenaConexion))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GestionarAlimentacion_XML", conexion))
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

        public async Task<List<Alimentacion>> ListarAlimentacion()
        {
            var lista = new List<Alimentacion>();
            using (SqlConnection conexion = new SqlConnection(_cadenaConexion))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ListarAlimentacion", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    await conexion.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            lista.Add(new Alimentacion
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                CultivoId = Convert.ToInt32(reader["CultivoId"]),
                                Especie = reader["Especie"].ToString(),
                                Fecha = Convert.ToDateTime(reader["Fecha"]),
                                TipoAlimento = reader["TipoAlimento"].ToString()!,
                                Cantidad = Convert.ToDecimal(reader["Cantidad"]),
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