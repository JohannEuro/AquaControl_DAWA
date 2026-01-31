# 🌊 AquaControl - Sistema de Gestión Acuícola

![Status](https://img.shields.io/badge/Status-Activo-success)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![.NET](https://img.shields.io/badge/.NET-Backend-purple)
![Angular](https://img.shields.io/badge/Angular-Frontend-red)
![SQL Server](https://img.shields.io/badge/SQL%20Server-Database-lightgrey)

## 📖 Descripción del Proyecto

**AquaControl** es una solución integral diseñada para la administración y monitoreo de granjas acuícolas (camaroneras/piscícolas). Este sistema permite digitalizar el control de producción, sustituyendo registros manuales por una arquitectura moderna y escalable.

El sistema gestiona el ciclo de vida completo de la producción a través de 4 módulos interconectados, asegurando la trazabilidad desde la siembra hasta la cosecha.

### 🚀 Arquitectura y Tecnologías
El proyecto implementa una arquitectura **Full Stack** desacoplada y contenerizada:

* **Backend:** .NET Core Web API (C#).
* **Base de Datos:** SQL Server 2022 (Ejecutándose en Docker).
    * *Highlight Técnico:* Uso avanzado de **Procedimientos Almacenados con inyección XML** para transacciones masivas y seguras.
* **Frontend:** Angular (SPA - Single Page Application).
* **Infraestructura:** Docker & Docker Compose para orquestación de servicios.

---

## ⚡ Funcionalidades Principales

El sistema cuenta con 4 módulos core:

1.  **🏊 Gestión de Piscinas:** CRUD completo de infraestructura, control de ubicación, capacidad y estados (Activa/Mantenimiento).
2.  **🌱 Control de Cultivos:** Registro de siembras, especies, densidades poblacionales y fechas de inicio.
3.  **🧪 Parámetros de Calidad:** Monitoreo diario de variables críticas (pH, Oxígeno, Temperatura, Salinidad) para asegurar la salud del cultivo.
4.  **🍽️ Registro de Alimentación:** Control de dietas, tipos de alimento y cantidades suministradas por cultivo.

---

## 🛠️ Guía de Inicio (Instalación)

Sigue estos pasos para levantar el proyecto en tu máquina local.

### Prerrequisitos
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Instalado y corriendo).
* [Node.js & NPM](https://nodejs.org/).
* [Git](https://git-scm.com/).

### Paso 1: Clonar el Repositorio
```bash
git clone [https://github.com/TU_USUARIO/AquaControl_Backend.git](https://github.com/TU_USUARIO/AquaControl_Backend.git)
cd AquaControl_Backend
