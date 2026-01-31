using AquaControl.API.Data;

var builder = WebApplication.CreateBuilder(args);

// -------------------------------------------------------------
// 1. CONFIGURACIÓN DE SERVICIOS (La caja de herramientas)
// -------------------------------------------------------------

// Agregamos los Controladores (El Mesero)
builder.Services.AddControllers();

// Agregamos Swagger (La documentación automática - Página Azul)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Agregamos TU Repositorio (El Cocinero)
// Nota: Solo lo agregamos una vez
builder.Services.AddScoped<PiscinaRepository>();
builder.Services.AddScoped<CultivoRepository>();
builder.Services.AddScoped<ParametroRepository>();   
builder.Services.AddScoped<AlimentacionRepository>();

// Configuramos CORS (Para que Angular pueda entrar después)
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirAngular",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// -------------------------------------------------------------
// 2. CONFIGURACIÓN DEL PIPELINE (Cómo fluyen los datos)
// -------------------------------------------------------------

// Activamos Swagger para que veas la página azul

    app.UseSwagger();
    app.UseSwaggerUI();


// Usamos la política de CORS
app.UseCors("PermitirAngular");

app.UseAuthorization();

// Mapeamos los controladores para que respondan a las URL
app.MapControllers();

// ¡Arrancamos el motor!
app.Run();