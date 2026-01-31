using AquaControl.API.Data;
using AquaControl.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace AquaControl.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParametrosController : ControllerBase
    {
        private readonly ParametroRepository _repository;

        public ParametrosController(ParametroRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _repository.ListarParametros());
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Parametro parametro)
        {
            try
            {
                int id = await _repository.GestionarParametro(parametro, "INSERTAR");
                return Ok(new { id = id, mensaje = "Parametro registrado" });
            }
            catch (SqlException ex)
            {
                if (ex.Number == 547) return BadRequest("El Cultivo especificado NO existe.");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Parametro parametro)
        {
            parametro.Id = id;
            await _repository.GestionarParametro(parametro, "ACTUALIZAR");
            return Ok(new { mensaje = "Actualizado" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repository.GestionarParametro(new Parametro { Id = id }, "ELIMINAR");
            return Ok(new { mensaje = "Eliminado" });
        }
    }
}