# Frontend - TD Inmobiliaria

Este es el repositorio del Frontend para el proyecto TD Inmobiliaria.

El frontend está haciendo uso de elementos de la librería UI de **Flowbite** para acelerar el desarrollo, además de utilizar **TypeScript** para un código más robusto y mantenible. Puedes consultar los componentes en [Flowbite Components](https://flowbite.com/#components).

## Instalación y Configuración

Sigue estos pasos para configurar el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/OsquiMenacho28/Group-C_Droca-Inmob_Frontend.git
   ```

2. **Entrar al directorio:**
   ```bash
   cd Frontend
   ```

3. **Instalar dependencias:**
   ```bash
   npm install
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

## Recomendaciones de Entorno

Antes de ejecutar el frontend, asegúrate de que los siguientes servicios estén activos:

- **MongoDB:** Verifica que el contenedor de MongoDB esté corriendo.
  ```bash
  docker ps
  ```
- **Backend:** Asegúrate de que los microservicios del backend estén en ejecución para que el frontend pueda consumir las APIs.

## Extensiones Recomendadas para VS Code

Para una mejor experiencia de desarrollo, se recomienda instalar las siguientes extensiones:

- **[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client):** Para probar las APIs directamente desde VS Code.
- **[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar):** Extensión oficial de Vue para TypeScript.
- **[Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme):** Para una mejor visualización de los iconos de archivos y carpetas.
