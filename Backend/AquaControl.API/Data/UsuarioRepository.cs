using AquaControl.API.Models;
using System.Data;
using System.Data.SqlClient;

namespace AquaControl.API.Data
{
    public class UsuarioRepository
    {
        private readonly string _cadenaConexion;

        public UsuarioRepository(IConfiguration configuration)
        {
            _cadenaConexion = configuration.GetConnectionString("CadenaSQL")!;
        }

        // EL CRUD

        public async Task<int> GestionarUsuario(Usuario usuario, string accion)
        {
            int resultadoId = 0;

            // XML 
            string xmlData = $@"
                <Usuario>
                    <Accion>{accion}</Accion>
                    <Id>{usuario.Id}</Id>
                    <Nombre>{usuario.Nombre}</Nombre>
                    <Correo>{usuario.Correo}</Correo>
                    <Clave>{usuario.Clave}</Clave>
                </Usuario>";

            using (SqlConnection conexion = new SqlConnection(_cadenaConexion))
            {
                using (SqlCommand cmd = new SqlCommand("sp_GestionarUsuario_XML", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@xmlData", SqlDbType.Xml).Value = xmlData;

                    await conexion.OpenAsync();
                    var result = await cmd.ExecuteScalarAsync();

                    if (result != null)
                    {
                        resultadoId = Convert.ToInt32(result);
                    }
                }
            }
            return resultadoId;
        }

        public async Task<List<Usuario>> ListarUsuarios()
        {
            var lista = new List<Usuario>();
            using (SqlConnection conexion = new SqlConnection(_cadenaConexion))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ListarUsuarios", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    await conexion.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            lista.Add(new Usuario
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Nombre = reader["Nombre"].ToString()!,
                                Correo = reader["Correo"].ToString()!,
                                Clave = reader["Clave"].ToString()! // Aquí sí la leemos para poder editarla
                            });
                        }
                    }
                }
            }
            return lista;
        }


        // EL LOGIN (Simple y directo)
        public Usuario? ValidarUsuario(string correo, string clave)
        {
            Usuario? usuarioEncontrado = null;
            using (SqlConnection conexion = new SqlConnection(_cadenaConexion))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ValidarUsuario", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    // consulta de lectura simple
                    cmd.Parameters.AddWithValue("@Correo", correo);
                    cmd.Parameters.AddWithValue("@Clave", clave);

                    conexion.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            usuarioEncontrado = new Usuario
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Nombre = reader["Nombre"].ToString()!,
                                Correo = reader["Correo"].ToString()!
                            };
                        }
                    }
                }
            }
            return usuarioEncontrado;
        }
    }
}