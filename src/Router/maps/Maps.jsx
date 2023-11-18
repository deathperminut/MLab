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
import { CiCircleMore } from "react-icons/ci";
import { useState } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import departaments from '../../data/colombia.geo.json';
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import Preloader from '../../Components/Loading/Loading';
import { MdOutlineCancel } from "react-icons/md";
/* GRAFICAS*/
import "bootstrap/dist/css/bootstrap.min.css";
import * as echarts from 'echarts';
import $ from "jquery";



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

  const [showOverlay, setShowOverlay] = useState(false);
  const [hiddenOverlay, setHiddenOverlay] = useState(true);

  const toggleOverlay = (cardId) => {
    setShowOverlay(cardId);
    setHiddenOverlay(false);
  };

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

  /* CARGAMOS GRAFICAS */

  React.useEffect(()=>{

    /**
     * GRAFICA OPPORTUNITY 1 (DOUBLE BAR CHART)
     */

    let chartOpportunityOne = echarts.init(document.getElementById('chart-opportunity-one-'));

    const dataOpportunityOne = [
      { department: 'Cundinamarca', consultations: 120 },
      { department: 'Vichada', consultations: 90 },
      { department: 'Boyaca', consultations: 60 },
      { department: 'Meta', consultations: 80 },
      { department: 'Antioquia', consultations: 100 },
      { department: 'Casanare', consultations: 110 },
      { department: 'Valle del cauca', consultations: 70 },
      { department: 'Caldas', consultations: 50 },
      { department: 'Bolivar', consultations: 68 },
      { department: 'Magdalena', consultations: 26 },
      { department: 'La guajira', consultations: 45 },
      { department: 'Norte de santander', consultations: 34 }
    ];

    let optionOpportunityOne = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#FAFAFA',
            color: '#040E29',
            fontWeight: 'normal',
            fontFamily: 'Monserat-regular'
          }
        },
        showDelay: 0,
        transitionDuration: 0.2,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
        borderColor: '#FAFAFA',
        padding: 5,
        textStyle: {
          color: '#414D55',
          fontSize: 12,
          lineHeight:10,
          fontWeight: 'normal',
          fontFamily: 'Monserat-regular'
        },
        extraCssText: 'box-shadow: 0px 1px 8px #142E6E1A'
      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        left: 'center',
        top: 10,
        bottom: 20,
        itemGap : 25,
        width: '90%',
        inactiveColor: '#728998',
        textStyle: {
          color: '#414D55',
          fontWeight: 'normal',
          fontFamily: 'Monserat-regular, Verdana',
        },
        pageIconSize: 12,
        pageIconColor: '   #4e50b4  ',
        pageIconInactiveColor: '#414D55',
        pageTextStyle: {
          color: '#414D55',
          fontWeight: 'normal',
          fontFamily: 'Monserat-regular, Verdana',
        },
        formatter : function(params, value){
          var newParamsName = "";
          var paramsNameNumber = params.length;
          var provideNumber = 50;
          var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
          if (paramsNameNumber > provideNumber) {
              for (var p = 0; p < rowNumber; p++) {
                var tempStr = "";
                if (p === rowNumber - 1) {
                    tempStr = (params.length > 6 ? (params.slice(0,50)+"...") : '' );
                } else {}
                newParamsName += tempStr;
              }
          } else {
              newParamsName = params;
          }
          return newParamsName
        },
        data: ['Indicador 1']
      },
      toolbox: {
        show: true,
        orient: 'horizontal',
        showTitle: false,
        feature: {
          dataZoom: {
            show: true,
            iconStyle: {
              borderColor: '#414D55'
            },
            emphasis: {
              iconStyle: {
                borderColor: '#414D55'
              },
            }
          },
          restore: {
            show: true,
            iconStyle: {
              borderColor: '#414D55'
            },
            emphasis: {
              iconStyle: {
                borderColor: '#414D55'
              },
            }
          },
          saveAsImage: {
            type: 'png',
            name: 'Informe',
            backgroundColor: '#FAFAFA',
            show: true,
            iconStyle: {
              borderColor: '#414D55'
            },
            emphasis: {
              iconStyle: {
                borderColor: '#414D55'
              },
            }
          }
        },
        iconStyle: {
          borderColor: '#414D55'
        },
        emphasis: {
          iconStyle: {
            borderColor: '#414D55'
          },
        },
        bottom: 0,
        pixelRatio: 2,
      },
      grid: [
        {
          containLabel: true,
          borderColor: '#728998'
        }
      ],
      xAxis: {
        type: 'category',
        name: 'Departamentos',
        nameLocation: 'middle',
        nameGap: 40,
        nameTextStyle: {
          color: '#728998',
          fontWeight: 'normal',
          fontFamily: 'Monserat-regular'
        },
        axisLabel: {
          color: '#728998',
          fontWeight: 'normal',
          fontFamily: 'Monserat-regular'
        },
        axisLine: {
          lineStyle: {
            color: '#728998',
            width: 1,
          }
        },
        boundaryGap: true,
        data: dataOpportunityOne.map(item => item.department)
      },
      yAxis: [
        {
          type: 'value',
          name: '',
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            color: '#728998',
            fontWeight: 'normal',
            fontFamily: 'Monserat-regular'
          },
          axisLabel: {
            formatter : function(params, value){
              var newParamsName = "";
              var paramsNameNumber = params.length;
              var provideNumber = 12;
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                  for (var p = 0; p < rowNumber; p++) {
                    var tempStr = "";
                    if (p === rowNumber - 1) {
                        tempStr = (params.length > 6 ? (params.slice(0,12)+"...") : '' );
                    } else {}
                    newParamsName += tempStr;
                  }
              } else {
                newParamsName = params;
              }
              return newParamsName
            },
            color: '#728998',
            fontWeight: 'normal',
            fontFamily: 'Monserat-regular'
          },
          boundaryGap: [0, '0%'],
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#728998',
              width: 1,
            }
          },
        },
        {
          type: 'value',
          name: '',
          nameLocation: 'middle',
          nameGap: 25,
          nameTextStyle: {
            color: '#728998',
            fontWeight: 'normal',
            fontFamily: 'Monserat-regular'
          },
          axisLabel: {
            formatter : function(params, value){
              var newParamsName = "";
              var paramsNameNumber = params.length;
              var provideNumber = 12;
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                  for (var p = 0; p < rowNumber; p++) {
                    var tempStr = "";
                    if (p === rowNumber - 1) {
                        tempStr = (params.length > 6 ? (params.slice(0,12)+"...") : '' );
                    } else {}
                    newParamsName += tempStr;
                  }
              } else {
                newParamsName = params;
              }
              return newParamsName
            },
            color: '#728998',
            fontWeight: 'normal',
            fontFamily: 'Monserat-regular'
          },
          boundaryGap: [0, '0%'],
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#728998',
              width: 1,
            }
          },
        },
      ],
      series: [
        {
          type: 'bar',
          name: 'Indicador 1',
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#414D55',
              fontSize: 12,
              fontWeight: 'normal',
              fontFamily: 'Monserat-regular'
            },
            emphasis: {
              show: true,
              position: 'top',
              color: '#414D55',
              fontSize: 12,
              fontWeight: 'normal',
              fontFamily: 'Monserat-regular'
            },
          },
          itemStyle: {
            color: "   #4e50b4  ",
            shadowBlur: 0,
            shadowOffsetY: 0,
          },
          emphasis: {
            focus: 'series'
          },
          data: dataOpportunityOne.map(item => item.consultations),
          animationDelay: function (idx) {
            return idx * 15;
          }
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx) {
        return idx * 5;
      }
    };

    optionOpportunityOne && chartOpportunityOne.setOption(optionOpportunityOne);

    $(window).on('resize', function(){
      if(chartOpportunityOne != null && chartOpportunityOne !== undefined){
        chartOpportunityOne.resize();
      }
    });

    

    

  },[])

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
                  <div className='container_data__'>
                        <div id='card-indicator-large-' className='card border-0 rounded-3 w-100 bs-2- position-relative overflow-hidden'>
                          <div className='card-header border-0 bg-transparent p-4 pb-0'>
                            <div className='d-flex flex-row justify-content-between align-items-center align-self-center mb-1'>
                              <h1 className='m-0 p-0 lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple-'>
                              Tabla de mejores resultados
                              </h1>
                              <button className='btn rounded-pill p-2 d-flex flex-row justify-content-center align-items-center align-self-center button-open- btn-dark-purple- bs-1- ms-2'  onClick={() => toggleOverlay('card1')}>
                                <CiCircleMore style={{width:'90',height:'90'}} width={90} height={90} color='black'/>
                              </button>
                            </div>
                            <div className='w-75'>
                              <p className='m-0 p-0 lh-sm fs-5- ff-monse-regular- fw-normal tx-black-'>
                                se muestran los mejores 12 según la medida requerida 
                              </p>
                            </div>
                          </div>
                          <div className='card-body p-4 w-100'>
                            <div className='w-100 h-100 mx-auto' id='chart-opportunity-one-'></div>
                          </div>
                          {showOverlay === 'card1' && (
                            <div className={`overlay-wrapper${hiddenOverlay ? ' hidden' : ''}`} onAnimationEnd={() => hiddenOverlay && setHiddenOverlay(true)}>
                              <div className={`overlay-content${hiddenOverlay ? ' hidden' : ''}`} onAnimationEnd={() => hiddenOverlay && setHiddenOverlay(true)}>
                                <div id='wrapper-data-table' className='card border-0 rounded-3 w-100 position-relative'>
                                  <div className='card-header border-0 bg-transparent p-4'>
                                    <div className='d-flex flex-row justify-content-between align-items-center align-self-center'>
                                      <h1 className='m-0 p-0 lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple-'>
                                          Tabla de datos
                                      </h1>
                                      <button className='btn rounded-pill p-2 d-flex flex-row justify-content-center align-items-center align-self-center button-close- btn-bone-white- bs-1- ms-2' onClick={() => toggleOverlay(null)}>
                                          <MdOutlineCancel />
                                      </button>
                                    </div>
                                  </div>
                                  <div className='card-body p-4 pt-0 pb-0 w-100'>
                                    <div className='table-responsive table-general-'>
                                      <table className='table table-sm table-striped table-no-border- align-middle'>
                                        <thead>
                                          <tr>
                                            <th scope="col" className='th-width-sm-'>
                                              <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                                <span className='fs-5- ff-monse-regular- fw-bold tx-dark-purple-'>Departamento</span>
                                              </div>
                                            </th>
                                            <th scope="col" className='th-width-sm-'>
                                              <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                                <span className='fs-5- ff-monse-regular- fw-bold tx-dark-purple-'>Indicador 1</span>
                                              </div>
                                            </th>
                                            <th scope="col" className='th-width-sm-'>
                                              <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                                <span className='fs-5- ff-monse-regular- fw-bold tx-dark-purple-'>Indicador 2</span>
                                              </div>
                                            </th>
                                            <th scope="col" className='th-width-sm-'>
                                              <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                                <span className='fs-5- ff-monse-regular- fw-bold tx-dark-purple-'>Indicador 3</span>
                                              </div>
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>Cundinamarca</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>10</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>19</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>0.28</p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>Vichada</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>5</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>23</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>0.03</p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>Boyaca</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>4</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>20</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>0.28</p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>Meta</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>9</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>30</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>0.28</p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>Antioquia</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>10</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>29</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>0.28</p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>Casanare</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>2</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>21</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>0.28</p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>Julio</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>5</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>25</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>0.28</p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>Valle del cauca</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>18</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>20</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>0.28</p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>Caldas</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>22</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>45</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>0.28</p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>Bolivar</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>14</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>50</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>0.28</p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>Magdalena</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>30</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>35</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>0.28</p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>La guajira</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>4</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>5</p>
                                            </td>
                                            <td className='align-middle'>
                                              <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>0.28</p>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {showOverlay === 'card1' && <div className="overlay-backdrop" onClick={() => toggleOverlay(null)} />}
                        </div>
                  </div>
                </div>
                
    </div>
  )
}
