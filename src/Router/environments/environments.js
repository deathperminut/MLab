import { configuraciones } from "../../appConfig";

let server = configuraciones.server;

export const environment = {
  production: false,
  // API
  api: server,

  // SERVICIOS
  productos:'/end_point/here'

}