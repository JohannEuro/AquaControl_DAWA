using AquaControl.API.Data;
using AquaControl.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace AquaControl.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlimentacionController : ControllerBase
    {
        private readonly AlimentacionRepository _repository;

        public AlimentacionController(AlimentacionRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _repository.ListarAlimentacion());
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Alimentacion alimentacion)
        {
            try
            {
                int id = await _repository.GestionarAlimentacion(alimentacion, "INSERTAR");
                return Ok(new { id = id, mensaje = "Alimentacion registrada" });
            }
            catch (SqlException ex)
            {
                if (ex.Number == 547) return BadRequest("El Cultivo especificado NO existe.");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Alimentacion alimentacion)
        {
            alimentacion.Id = id;
            await _repository.GestionarAlimentacion(alimentacion, "ACTUALIZAR");
            return Ok(new { mensaje = "Actualizado" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repository.GestionarAlimentacion(new Alimentacion { Id = id }, "ELIMINAR");
            return Ok(new { mensaje = "Eliminado" });
        }
    }
}