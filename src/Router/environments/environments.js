import { configuraciones } from "../../appConfig";

let server = configuraciones.server;

export const environment = {
  production: false,
  // API
  api: server,

  // SERVICIOS
  departaments_data:'/departaments_data',
  departaments:'/departaments',
  municipios:'/municipios',
  municipios_data:'/municipios_data',
  cliente_historial:'/cliente_historial',
  inferencia_rangos:'/inferencia',

}