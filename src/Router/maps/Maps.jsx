import React from 'react'
import './Maps.css'
import Navigationbar from '../../Components/Navbar/Navbar';
import Fondo from '../../img/Langing_2.png';
import { TiCancelOutline } from "react-icons/ti";
import '../../index.css';
import {useNavigate} from 'react-router-dom';
import { GiColombia } from 'react-icons/gi';
import Swal from 'sweetalert2';
import axios from 'axios';
import { MapContainer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Loading from 'react-loading';
import departaments from '../../data/colombia.geo.json';
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import Preloader from '../../Components/Loading/Loading';


const { NoOptionsMessage } = components;

const customNoOptionsMessage = props => (
  <NoOptionsMessage {...props} className="custom-no-options-message-auth-form-">No registrado</NoOptionsMessage>
);

const { LoadingMessage } = components;

const customLoadingMessage = props => (
  <LoadingMessage {...props} className="custom-loading-message-auth-form-">Cargando</LoadingMessage>
);

/**
 * ANIMATE DELETE MULTISELECT
 */

const animatedComponents = makeAnimated();

/**
 * Se genera componente nuevo para soportar el placeholder animado del input 
*/

const { ValueContainer, Placeholder } = components;

const CustomValueContainer = ({ children, ...props }) => {
  const { inputId, placeholder } = props.selectProps;
  return (
    <ValueContainer {...props}>
      <Placeholder htmlFor={inputId} {...props}>
        {placeholder}
      </Placeholder>
      {React.Children.map(children, child =>
        child && child.type !== Placeholder ? child : null
      )}
    </ValueContainer>
  );
};

const selectStyles = {
  /**
   * Estilos del icono del dropdown del select
   * Estilos del separador del select
   * Estilos del icono de cerrar del select
   */
  dropdownIndicator: (styles) => ({ ...styles, 
    color: "var(--color-tertiary-purple-)", 
    padding: 0, 
    paddingTop: '0.34rem !important', 
    paddingRight: '0.5rem !important',
    width: '25px',
    height: '25px',
    "&:hover": {
      color: "var(--color-tertiary-purple-)",
    }  
  }),
  indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
  clearIndicator: (styles) => ({ ...styles, 
    color: "var(--color-tertiary-purple-)", 
    padding: 0, 
    paddingTop: '0.05rem !important',
    width: '15px',
    height: '15px',
    "&:hover": {
      color: "var(--color-tertiary-purple-)",
    } 
  }),
  /**
   * ESTILOS DEL INPUT GLOBAL
   */
  control: () => ({
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    alignSelf: "start",
    justifyContent: "start",
    height: 'auto',
    minHeight: 50,
    maxHeight: 150,
    paddingLeft: '2.1rem',
    paddingTop: '0.3rem',
    width: "100%",
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderBottom: "1px solid var(--color-tertiary-purple-)",
  }),
  /**
  * ESTILOS DEL INPUT
  */
  input: (provided) => ({
  ...provided,
  color: '#d2d5d8',
  fontSize: 12,
  textTransform: 'uppercase',
  fontFamily: 'var(--font-family-regular-)',
  }),
  /**
   * ESTILOS DEL MENU DESPLEGABLE DEL SELECT
   */
  menu: (styles) => ({
    ...styles,
    border: 'none',
    backgroundColor: 'white',
    boxShadow: 'var(--box-shadow-6-)',
    borderRadius: '0.8rem',
    padding: 0,
    marginTop: 8,
    marginBottom: 0,
    height: 'auto',
    minHeight: 'auto',
    maxHeight: 300,
    overflow: "hidden",
    color: 'var(--color-purple-)',
    fontSize: 12,
    textTransform: "uppercase",
    fontFamily: 'var(--font-family-regular-)',
  }),
  menuList: () => ({
    paddingTop: 0,
    paddingBottom: 0,
    height: 'auto',
    minHeight: 'auto',
    maxHeight: 300,
    overflow: "auto",
    "::-webkit-scrollbar": {
      width: "0px !important",
      height: "0px !important",
    },
    "::-webkit-scrollbar-track": {
      background: "transparent !important"
    },
    "::-webkit-scrollbar-thumb": {
      background: "transparent !important"
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "transparent !important"
    }
  }),
  /**
   * ESTILOS DE LAS OPCIONES DESPLEGABLES
   */
  option: (provided, state) => ({
    ...provided,
    fontSize: 11,
    color:'var(--color-black-)',
    textTransform: "uppercase",
    backgroundColor: state.isSelected ? "#d2d5d8" : "white",
    fontFamily: 'var(--font-family-regular-)',
    padding: '0.5rem 0.8rem 0.5rem 0.8rem',
    borderRadius: '0.8rem',
    ":hover": {
      background: "var(--color-tert-purple-)",
      color: 'var(--color-white-)',
    }
  }),
  /**
   * ESTILOS DEL CONTENEDOR
   */
  container: (provided, state) => ({
    ...provided,
    marginTop: 0,
    width: '100%',
    position: 'relative',
    flex: '1 1 auto'
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    overflow: "visible",
    position: "relative",
    top: "4px"
  }),
  /**
   * ESTILOS PLACEHOLDER DEL INPUT
   */
  placeholder: (provided, state) => ({
    ...provided,
    width: '100%',
    position: "absolute",
    top: state.hasValue || state.selectProps.inputValue ? -20 : "22%",
    left: state.hasValue || state.selectProps.inputValue ? -32 : "0%",
    transition: "top 0.1s, font-size 0.1s",
    color: 'gray',
    fontSize: state.hasValue || state.selectProps.inputValue ? 13 : "14px",
    lineHeight: 1.25,
    fontFamily: 'var(--font-family-regular-)',
    overflow: 'hidden',
    textAlign: 'start',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }),
  /**
   * ESTILOS TEXTO EN EL INPUT
   */
  singleValue: (styles) => ({ 
    ...styles, 
    fontSize: 12,
    textTransform: 'uppercase',
    color: "black", 
    fontFamily: 'var(--font-family-regular-)', 
    paddingTop: '0.3rem',
    marginLeft: 0,
    marginRight: 0
  }),
  multiValue: (styles) => ({ 
    ...styles, 
    backgroundColor: 'var(--color-secondary-white-rgba-)',
    boxShadow: 'var(--box-shadow-2-)',
    borderRadius: '0.5rem',
    alignItems: 'center',
    alignSelf: 'center',
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    fontFamily: 'var(--font-family-regular-)',
    fontSize: 12,
    textTransform: 'uppercase',
    color: 'var(--color-quaternary-gray-)',
    paddingLeft: '0.5rem',
    paddingRight: '0.6rem',
    paddingBottom: '0.3rem'
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    borderRadius: '6rem',
    paddingLeft: '6px',
    width: '26px',
    height: '26px',
    color: 'var(--color-black-)',
    backgroundColor: 'var(--color-secondary-gray-)',
    ':hover': {
      color: 'var(--color-white-)',
      backgroundColor: 'var(--color-tertiary-purple-)',
    }
  })
}

export default function Maps() {


  React.useEffect(()=>{
    loading_screen()
    //Llamamos data del mapa
    //fetchGeoJSON('https://raw.githubusercontent.com/OpenDataColombia/geodata/master/colombia/departamentos.geojson');

  },[])
  
  let [preloader,setPreloader] = React.useState(false);
  const loading_screen=()=>{
    setPreloader(true);
    setTimeout(stopPreloader,2200);
  }
  const stopPreloader=()=>{
    setPreloader(false);
  }
  async function fetchGeoJSON(url) {
    const response = await fetch(url).catch((error)=>{
      console.log("ERROR AL TRAER datos",error)
    });

    if(response){
      const json = await response.json();
      console.log(json);
      return json;
    }

        
  }

  /*MAP STYLES*/
  const mapStyles = {
    height: '500px',
    width:'100%',
    background:'transparent'
  };


  // const geoJsonStyle = {
  //   fillColor: 'blue', // Cambia el color de relleno
  //   weight: 2,
  //   color: 'white',
  //   fillOpacity: 0.7,
  // };

  function elementoRandom(arreglo) {
    const indice = Math.floor(Math.random() * arreglo.length);
    return arreglo[indice];
  }

  const getColor = (valor) => {
    // Escoge los colores según los rangos de valores que tengas
    
    let arrayColors = ['#800026','#FC4E2A','#FFEDA0',' #86b41f ',' #161c98 ',' #9aa790 ']
    const  elemento = elementoRandom(arrayColors)
    return elemento
  };

  return (
    <div className='body' style={{display:'flex',justifyContent:'center'}}>
                {
                    preloader ?
                    <Preloader type={'spokes'}/>
                    :

                    <></>
                }
                <Navigationbar></Navigationbar>
                <div style={{width:'100%',minHeight:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <div className='description_map'>
                      <p className='description_map_text'>Visualiza tus indicadores en tiempo real, utiliza el apartado de configuraciones para editar la información a tu gusto</p>
                  </div>
                  <div className='container_data'>
                    <div className='container_pc'>
                        <MapContainer
                          className='mapstyles'
                          center={[4.5709, -74.2973]} // Centro de Colombia
                          zoom={5} // Zoom inicial
                          style={mapStyles}
                        >
                          <GeoJSON
                            data={departaments} // Datos geojson de los departamentos
                            style={()=>({
                              fillColor: getColor(),
                              weight: 2,
                              color: 'white',
                              fillOpacity: 0.7,
                            })}
                            onEachFeature={(feature, layer) => {
                              console.log(feature)
                              layer.bindPopup(feature.properties.NOMBRE_DPT); // Mostrar nombre del departamento en popup
                            }}
                          />
                        </MapContainer>
                    </div>
                    <div className='container_moviles'>
                        <MapContainer
                          className='mapstyles'
                          center={[4.5709, -74.2973]} // Centro de Colombia
                          zoom={5} // Zoom inicial
                          style={mapStyles}
                        >
                          <GeoJSON
                            data={departaments} // Datos geojson de los departamentos
                            style={()=>({
                              fillColor: getColor(),
                              weight: 2,
                              color: 'white',
                              fillOpacity: 0.7,
                            })}
                            onEachFeature={(feature, layer) => {
                              console.log(feature)
                              layer.bindPopup(feature.properties.NOMBRE_DPT); // Mostrar nombre del departamento en popup
                            }}
                          />
                        </MapContainer>
                    </div>
                    <form className='formulario'>
                          <span className='title_map'>Configuraciones</span>
                          <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                    <div className='form-floating inner-addon- left-addon-'>
                                      <Select options={[{value:"Valor 1",label:"Valor 1"},{value:"Valor 2",label:"Valor2"},{value:"Valor 3",label:"Valor3"},{value:"Valor 4",label:"Valor4"}]} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Selecciona el filtro" styles={selectStyles} isClearable={true} name='typeIdentification'/>
                                    </div>
                              </div>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                    <div className='form-floating inner-addon- left-addon-'>
                                      <Select options={[{value:"Valor 1",label:"Valor 1"},{value:"Valor 2",label:"Valor2"},{value:"Valor 3",label:"Valor3"},{value:"Valor 4",label:"Valor4"}]} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Selecciona el filtro" styles={selectStyles} isClearable={true} name='typeIdentification'/>
                                    </div>
                              </div>
                          </div>
                          <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                    <div className='form-floating inner-addon- left-addon-'>
                                      <Select options={[{value:"Valor 1",label:"Valor 1"},{value:"Valor 2",label:"Valor2"},{value:"Valor 3",label:"Valor3"},{value:"Valor 4",label:"Valor4"}]} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Selecciona el filtro" styles={selectStyles} isClearable={true} />
                                    </div>
                              </div>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                    <div className='form-floating inner-addon- left-addon-'>
                                      <Select options={[{value:"Valor 1",label:"Valor 1"},{value:"Valor 2",label:"Valor2"},{value:"Valor 3",label:"Valor3"},{value:"Valor 4",label:"Valor4"}]} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Selecciona el filtro" styles={selectStyles} isClearable={true} />
                                    </div>
                              </div>
                          </div>
                          <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                    <div className='form-floating inner-addon- left-addon-'>
                                      <Select options={[{value:"Valor 1",label:"Valor 1"},{value:"Valor 2",label:"Valor2"},{value:"Valor 3",label:"Valor3"},{value:"Valor 4",label:"Valor4"}]} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Selecciona el filtro" styles={selectStyles} isClearable={true} />
                                    </div>
                              </div>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                    <div className='form-floating inner-addon- left-addon-'>
                                      <Select options={[{value:"Valor 1",label:"Valor 1"},{value:"Valor 2",label:"Valor2"},{value:"Valor 3",label:"Valor3"},{value:"Valor 4",label:"Valor4"}]} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Selecciona el filtro" styles={selectStyles} isClearable={true} />
                                    </div>
                              </div>
                          </div>
                          <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                    <div className='form-floating inner-addon- left-addon-'>
                                      <Select options={[{value:"Valor 1",label:"Valor 1"},{value:"Valor 2",label:"Valor2"},{value:"Valor 3",label:"Valor3"},{value:"Valor 4",label:"Valor4"}]} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Selecciona el filtro" styles={selectStyles} isClearable={true} />
                                    </div>
                              </div>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                    <div className='form-floating inner-addon- left-addon-'>
                                      <Select options={[{value:"Valor 1",label:"Valor 1"},{value:"Valor 2",label:"Valor2"},{value:"Valor 3",label:"Valor3"},{value:"Valor 4",label:"Valor4"}]} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Selecciona el filtro" styles={selectStyles} isClearable={true} />
                                    </div>
                              </div>
                              <div className='col-auto' style={{width:'100%',display:'flex','justifyContent':'end'}}>
                                  <button onClick={loading_screen} className='buttonProduct btn btn-dark-purple- rounded-pill ps-5 pe-5 d-flex flex-row justify-content-center align-items-center align-self-center h-45-' type="button" >
                                    <span className='textButton lh-1 fs-6- ff-monse-regular- fw-semibold' >Buscar</span>
                                  </button>
                              </div>
                          </div>
                    </form>
                    <div>

                    </div>
                  </div>
                </div>
                
    </div>
  )
}
