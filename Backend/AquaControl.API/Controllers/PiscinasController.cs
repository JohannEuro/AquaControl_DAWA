using AquaControl.API.Data;
using AquaControl.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace AquaControl.API.Controllers
{
    // Esta etiqueta define que la URL será: http://localhost:xxxx/api/Piscinas
    [Route("api/[controller]")]
    [ApiController]
    public class PiscinasController : ControllerBase
    {
        private readonly PiscinaRepository _repository;

        // El Constructor recibe el Repositorio listo para usar (Inyección de Dependencias)
        public PiscinasController(PiscinaRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Piscinas (Obtener todas)
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var lista = await _repository.ListarPiscinas();
            return Ok(lista);
        }

        // POST: api/Piscinas (Crear nueva)
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Piscina piscina)
        {
            // El Id viene 0, pero SQL lo generará. Enviamos la acción "INSERTAR" al XML
            int nuevoId = await _repository.GestionarPiscina(piscina, "INSERTAR");
            return Ok(new { id = nuevoId, mensaje = "Piscina creada exitosamente" });
        }

        // PUT: api/Piscinas/5 (Actualizar)
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Piscina piscina)
        {
            piscina.Id = id; // Aseguramos que el ID sea el de la URL
            await _repository.GestionarPiscina(piscina, "ACTUALIZAR");
            return Ok(new { mensaje = "Piscina actualizada" });
        }

        // DELETE: api/Piscinas/5 (Borrar)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var piscina = new Piscina { Id = id }; // Solo necesitamos el ID para borrar
            await _repository.GestionarPiscina(piscina, "ELIMINAR");
            return Ok(new { mensaje = "Piscina eliminada" });
        }
    }
}