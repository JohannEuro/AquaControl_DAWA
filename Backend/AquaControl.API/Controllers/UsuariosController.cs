using AquaControl.API.Data;
using AquaControl.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace AquaControl.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly UsuarioRepository _repo;

        public UsuariosController(UsuarioRepository repo)
        {
            _repo = repo;
        }

        // GET api/Usuarios (Listar todos)
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var lista = await _repo.ListarUsuarios();
            return Ok(lista);
        }

        // POST api/Usuarios (Crear o Editar)
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Usuario usuario)
        {
            if (usuario == null) return BadRequest();

            // Si el ID es 0, es INSERTAR. Si tiene ID, es ACTUALIZAR.
            string accion = usuario.Id == 0 ? "INSERTAR" : "ACTUALIZAR";

            var id = await _repo.GestionarUsuario(usuario, accion);
            return Ok(new { idGenerado = id });
        }

        // 3. DELETE api/Usuarios/5 
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Creamos un usuario "falso" solo con el ID para mandarlo al XML
            var usuarioParaBorrar = new Usuario { Id = id };
            await _repo.GestionarUsuario(usuarioParaBorrar, "ELIMINAR");
            return Ok(new { mensaje = "Eliminado" });
        }

        // 4. POST api/Usuarios/login (Entrar al sistema)
        [HttpPost("login")]
        public IActionResult Login([FromBody] Usuario loginData)
        {
            var user = _repo.ValidarUsuario(loginData.Correo, loginData.Clave);
            if (user != null) return Ok(user);
            else return Unauthorized("Datos incorrectos");
        }
    }
}