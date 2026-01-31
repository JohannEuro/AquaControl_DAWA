using AquaControl.API.Data;
using AquaControl.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace AquaControl.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CultivosController : ControllerBase
    {
        private readonly CultivoRepository _repository;

        public CultivosController(CultivoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _repository.ListarCultivos());
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Cultivo cultivo)
        {
            try
            {
                int id = await _repository.GestionarCultivo(cultivo, "INSERTAR");
                return Ok(new { id = id, mensaje = "Cultivo creado" });
            }
            catch (SqlException ex)
            {
                // Aquí atrapamos el error si la piscina no existe
                if (ex.Number == 547) return BadRequest("La Piscina especificada NO existe.");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Cultivo cultivo)
        {
            cultivo.Id = id;
            await _repository.GestionarCultivo(cultivo, "ACTUALIZAR");
            return Ok(new { mensaje = "Actualizado" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repository.GestionarCultivo(new Cultivo { Id = id }, "ELIMINAR");
            return Ok(new { mensaje = "Eliminado" });
        }
    }
}