import axios from "axios";
import { environment } from "../Router/environments/environments";

const getDepartamentsData=async(data)=>{
    
    /* PRODUCTS */
    let path=environment.api+environment.departaments_data

    /* BODY */

    let body={
        "year": data.year,
        "variable": data.variable,
        "tipo_cultivo": data.tipo_cultivo,
    }

    return await axios.post(path,body)

}

const getDepartaments=async()=>{
    
    /* PRODUCTS */
    let path=environment.api+environment.departaments

    /* BODY */

    return await axios.get(path)

}

const getMunicipios=async(data)=>{
    
    /* PRODUCTS */
    let path=environment.api+environment.municipios

    /* BODY */
    let body = {
        id_departament:data['id_departament']
    }
    return await axios.post(path,body)

}


const getMunicipios_data=async(data)=>{
    
    /* PRODUCTS */
    let path=environment.api+environment.municipios_data

    /* BODY */
    let body = {
        id_departament:data['id_departament'],
        year:data['year'],
        variable:data['variable'],
        departament:data['tipo_cultivo']
    }
    return await axios.post(path,body)

}


const cliente_historial=async(data)=>{
    
    /* PRODUCTS */
    let path=environment.api+environment.cliente_historial

    /* BODY */

    let body={
        "cliente": data.cliente,
        "variable": data.variable,
        "tipo_cultivo": data.tipo_cultivo,
    }

    return await axios.post(path,body)

}



const inferencia_rango=async(data)=>{
    
    /* PRODUCTS */
    let path=environment.api+environment.cliente_historial

    /* BODY */

    let body={
        "tipo_cultivo": data.tipo_cultivo,
        "variable": data.variable,
        "magnitud": data.magnitud,
    }

    return await axios.post(path,body)

}

export {inferencia_rango,cliente_historial,getDepartamentsData,getDepartaments,getMunicipios,getMunicipios_data}