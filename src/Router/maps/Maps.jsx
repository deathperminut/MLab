import React from 'react'
import './Maps.css'
import { useRef } from 'react';
import Navigationbar from '../../Components/Navbar/Navbar';
import Fondo from '../../img/Langing_2.png';
import { TiCancelOutline } from "react-icons/ti";
import '../../index.css';
import {useNavigate} from 'react-router-dom';
import { GiColombia } from 'react-icons/gi';
import Swal from 'sweetalert2';
import { Tooltip } from 'react-tooltip';
import axios from 'axios';
import { CiCircleMore } from "react-icons/ci";
import Municipios from '../../data/Municipios.json'
import { useState } from 'react';
import { MapContainer, GeoJSON,TileLayer ,Polygon ,Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import departaments from '../../data/colombia.geo.json';
import cauca  from '../../data/cauca.geo.json';
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import Preloader from '../../Components/Loading/Loading';
import { MdOutlineCancel } from "react-icons/md";
/* GRAFICAS*/
import "bootstrap/dist/css/bootstrap.min.css";
import * as echarts from 'echarts';
import $ from "jquery";
import { cliente_historial, getDepartamentsData, getMunicipios_data, inferencia_rango } from '../../services/services';



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
  fontSize: 15,
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
    fontSize: 15,
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
    fontSize: 14,
    color:'var(--color-black-)',
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
    fontSize: state.hasValue || state.selectProps.inputValue ? 14 : "15px",
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
    fontSize: 15,
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
    fontSize: 15,
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
    //loading_screen()
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
    height: '750px',
    width:'100%',
    background:'#F5F5F5'
  };


  function elementoRandom(arreglo) {
    const indice = Math.floor(Math.random() * arreglo.length);
    return arreglo[indice];
  }

  

  let tipo_muestra =[
    {value:"ph",label:"pH",'unidad':''},
    {value:"n",label:"N",'unidad':'%'},
    {value:"mo",label:"MO",'unidad':'%'},
    {value:"k",label:"K",'unidad':'cmol(c)kg^-1'},
    {value:"ca",label:"Ca",'unidad':'cmol(c)kg^-1'},
    {value:"mg",label:"Mg",'unidad':'cmol(c)kg^-1'},
    {value:"al",label:"Al",'unidad':'cmol(c)kg^-1'},
    {value:"cic",label:"CIC",'unidad':'cmol(c)kg^-1'},
    {value:"p",label:"P",'unidad':'mgkg^-1'},
    {value:"fe",label:"Fe",'unidad':'mgkg^-1'},
    {value:"mn",label:"Mn",'unidad':'mgkg^-1'},
    {value:"zn",label:"Zn",'unidad':'mgkg^-1'},
    {value:"cu",label:"Cu",'unidad':'mgkg^-1'},
    {value:"s",label:"S",'unidad':'mgkg^-1'},
    {value:"b",label:"B",'unidad':'mgkg^-1'},
    {value:"ar",label:"Ar",'unidad':'%'},
    {value:"l",label:"L",'unidad':'%'},
    {value:"a",label:"A",'unidad':'%'},
  ]

  const years = [
    {value:"2010",label:"2010"},
    {value:"2011",label:"2011"},
    {value:"2012",label:"2012"},
    {value:"2013",label:"2013"},
    {value:"2014",label:"2014"},
    {value:"2015",label:"2015"},
    {value:"2016",label:"2016"},
    {value:"2017",label:"2017"},
    {value:"2018",label:"2018"},
    {value:"2019",label:"2019"},
    {value:"2020",label:"2020"},
    {value:"2021",label:"2021"},
    {value:"2022",label:"2022"},
    {value:"2023",label:"2023"},
  ]

  const type_cultivo = [
    {value:'General',label:'General'},
    {value:'Café',label:'Café'},
    {value:'Citricos',label:'Citricos'},
    {value:'Aguacates',label:'Aguacates'},
    {value:'Pasto',label:'Pasto'},
  ]

  const colorScale = {
    low: 'green',
    medium: 'yellow',
    high: 'red',
    // Puedes agregar más categorías y colores según tus rangos de valores
  };

  const mapRef = useRef(null);
  let lastScrollTop = 0;
  /* use States*/
  
  let [departament,setDepartament] = React.useState("");
  let [result,setResult] = React.useState(null);
  let [dataMuni,setDataMuni] = React.useState([]);

  let [departamentsForm,setDepartamentsForm] = React.useState({
    "year": [],
    "variable": "",
    "tipo_cultivo": "",
    "variable_mostrar":"",
    "unidad":""
  })

  let [arrayDepartaments,setArrayDepartaments] = React.useState([]);

  /* read inputs */

  const readSelectDepartamentForm = (event,type) =>{
    
    if(type == 'year'){
      setDepartamentsForm({...departamentsForm,[type]:event})
    }else{
      if (event){
        
        if(type =='variable'){
          setDepartamentsForm({...departamentsForm,[type]:event.value,['variable_mostrar']:event.label,['unidad']:event.unidad})
        }else{
          setDepartamentsForm({...departamentsForm,[type]:event.value})
        }
      }else{
        setDepartamentsForm({...departamentsForm,[type]:""})
      }
    }
    

  }


  let findResults =async()=>{

    if(departamentsForm.tipo_cultivo == "" || departamentsForm.variable == ""){

      Swal.fire({
        icon: 'info',
        text:"Todos los campos son obligatorios para la consulta",
      })

    }else{

      setPreloader(true);
      let result =  undefined
      result =  await getDepartamentsData(departamentsForm).catch((error)=>{
        console.log(error);
        setPreloader(false);
        Swal.fire({
          icon: 'info',
          text:"Problemas al generar la consulta.",
        })
        setArrayDepartaments([])
      })

      if(result){
        setPreloader(false);
        Swal.fire({
          icon: 'success',
          text:"Consulta realizada correctamente.",
        })
        console.log(result.data)
        setArrayDepartaments(result.data);
      }

    }
    
  }

  let [arrayMunicipios,setArrayMunicipios] = React.useState([])

  let findResults_municipios =async(departament)=>{

    let object  = getDepartamentObject(departament);
    setPreloader(true);
      let result =  undefined
      result =  await getMunicipios_data(object,departamentsForm).catch((error)=>{
        console.log(error);
        setPreloader(false);
        Swal.fire({
          icon: 'info',
          text:"Problemas al generar la consulta, registra todos los campos.",
        })
        setArrayMunicipios([])
      })

      if(result){
        setPreloader(false);
        Swal.fire({
          icon: 'success',
          text:"Consulta realizada correctamente.",
        })
        console.log(result.data)
        setArrayMunicipios(result.data);
      }
    
  }

  let findData = ()=>{
    setPreloader(false);
    setResult('results');
  }

  const handleScroll = () => {
    const map = mapRef.current;
    
    if (map != null) {
      const currentScrollTop = map._container.scrollTop || document.documentElement.scrollTop;

      // Calcula la distancia recorrida durante el scroll
      const scrollDistance = Math.abs(currentScrollTop - lastScrollTop);

      // Define la distancia mínima para activar un evento (en pixeles)
      const threshold = 100;
      console.log("scrollDistance: ",scrollDistance)
      // Si la distancia recorrida supera el umbral, activa tu evento
      if (scrollDistance > threshold) {
        // Aquí puedes ejecutar la lógica que desees al alcanzar la distancia específica durante el scroll
        console.log('Se ha alcanzado la distancia de scroll deseada');
        // Puedes llamar a una función o activar cualquier otra acción aquí
      }

      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }
  };

  const resetData = () => {
        setDepartament("");
  }

  let [data_departaments,setData_departaments] = React.useState([]);

  function eliminarTildes(cadena) {
    // Reemplaza las letras con tilde por las equivalentes sin tilde
    return cadena.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  }

  const getColorforRange = (departament) =>{

    let dictionary_color = {
      'Bajo':'#F11F1F ',
      'Mod. bajo':'#F07B7B',
      'Medio':'#9FF784',
      'Mod. alto':'#EBF781 ',
      'Alto':'#FFE001 ',
    }
    // ESCALA DE COLOR
    let object =  arrayDepartaments.filter((obj)=> eliminarTildes(obj.name).toUpperCase() === eliminarTildes(departament).toUpperCase())

    if (object.length === 0){
      return 'gray'
    }else{
      if(object[0]['Rango_media'] == 'No hay datos'){
        return 'gray'
      }
      return dictionary_color[object[0]['Rango_media']]
    }

  }

  const getDepartamentObject=(departament)=>{

    let object =  arrayDepartaments.filter((obj)=> eliminarTildes(obj.name).toUpperCase() === eliminarTildes(departament).toUpperCase())
    if(object.length === 0){
      return {'media':'No hay registro','Bajo':'No hay registro','Mod. bajo':'No hay registro','Medio':'No hay registro','Mod. alto':'No hay registro','Alto':'No hay registro','name':departament,'cantidad registros':'No hay registro','Rango_media':'No hay registro'}
    }else{
      return object[0]
    }

  }




  const getColorforRange_muni = (departament) =>{

    let dictionary_color = {
      'Bajo':'#F11F1F ',
      'Mod. bajo':'#F07B7B',
      'Medio':'#9FF784',
      'Mod. alto':'#EBF781 ',
      'Alto':'#FFE001 ',
    }
    // ESCALA DE COLOR
    let object =  arrayMunicipios.filter((obj)=> eliminarTildes(obj.name).toUpperCase() === eliminarTildes(departament).toUpperCase())

    if (object.length === 0){
      return 'gray'
    }else{
      if(object[0]['Rango_media'] == 'No hay datos'){
        return 'gray'
      }
      return dictionary_color[object[0]['Rango_media']]
    }

  }

  const getDepartamentObject_muni=(departament)=>{

    let object =  arrayMunicipios.filter((obj)=> eliminarTildes(obj.name).toUpperCase() === eliminarTildes(departament).toUpperCase())
    if(object.length === 0){
      return {'media':'No hay registro','Bajo':'No hay registro','Mod. bajo':'No hay registro','Medio':'No hay registro','Mod. alto':'No hay registro','Alto':'No hay registro','name':departament,'cantidad registros':'No hay registro','Rango_media':'No hay registro'}
    }else{
      return object[0]
    }

  }

  /* form services */

  /* CARGAMOS GRAFICAS */

  React.useEffect(()=>{
    
    if(arrayDepartaments.length!==0){
      /**
     * GRAFICA OPPORTUNITY 1 (DOUBLE BAR CHART)
     */

    let chartOpportunityOne = echarts.init(document.getElementById('chart-opportunity-one-'));
    let lista = [...arrayDepartaments]

    // Función de comparación para ordenar por el atributo 'valor'
    function comparar(a, b) {
      let A = a.media == 'No hay datos' ? 0 : a.media;
      let B = b.media == 'No hay datos' ? 0 : b.media;
      if (A < B) {
        return -1;
      }
      if (A > B) {
        return 1;
      }
      return 0;
    }

    // Ordenar la lista utilizando la función de comparación
    lista.sort(comparar);
    lista = lista.slice(-6);
    const dataOpportunityOne = lista.map((obj)=>{
      return(
        {department:obj.name,bajo:obj['Bajo'],m_bajo:obj['Mod. bajo'],medio:obj['Medio'],m_alto:obj['Mod. alto'],alto:obj['Alto']}
      )
    })



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
          fontSize: 15,
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
        data: ['bajo','m_bajo','medio','m_alto','alto']
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
          name: 'bajo',
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
            color: "   rgb(189, 46, 45)  ",
            shadowBlur: 0,
            shadowOffsetY: 0,
          },
          emphasis: {
            focus: 'series'
          },
          data: dataOpportunityOne.map(item => item.bajo),
          animationDelay: function (idx) {
            return idx * 15;
          }
        },
        {
          type: 'bar',
          name: 'm_bajo',
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
            color: "   rgb(165, 69, 53)  ",
            shadowBlur: 0,
            shadowOffsetY: 0,
          },
          emphasis: {
            focus: 'series'
          },
          data: dataOpportunityOne.map(item => item.m_bajo),
          animationDelay: function (idx) {
            return idx * 15;
          }
        },
        {
          type: 'bar',
          name: 'medio',
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
            color: "   rgb(77, 182, 100)  ",
            shadowBlur: 0,
            shadowOffsetY: 0,
          },
          emphasis: {
            focus: 'series'
          },
          data: dataOpportunityOne.map(item => item.medio),
          animationDelay: function (idx) {
            return idx * 15;
          }
        },
        {
          type: 'bar',
          name: 'm_alto',
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
            color: "   rgb(177, 225, 57)  ",
            shadowBlur: 0,
            shadowOffsetY: 0,
          },
          emphasis: {
            focus: 'series'
          },
          data: dataOpportunityOne.map(item => item.m_alto),
          animationDelay: function (idx) {
            return idx * 15;
          }
        },
        {
          type: 'bar',
          name: 'alto',
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
            color: "  rgb(251, 247, 25)  ",
            shadowBlur: 0,
            shadowOffsetY: 0,
          },
          emphasis: {
            focus: 'series'
          },
          data: dataOpportunityOne.map(item => item.alto),
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

    }

    
    

    

    

  },[arrayDepartaments])


  let [see,setSee] = React.useState(false);
  

  function getColor(valor, colorInicio, colorFin) {
    // Obtener los componentes RGB de los colores de inicio y fin
    const regex = /rgb\((\d+), (\d+), (\d+)\)/;
    const inicioMatch = colorInicio.match(regex);
    const finMatch = colorFin.match(regex);
  
    if (!inicioMatch || !finMatch) {
      throw new Error('Los colores deben estar en formato rgb(r, g, b)');
    }
  
    const [, rInicio, gInicio, bInicio] = inicioMatch.map(Number);
    const [, rFin, gFin, bFin] = finMatch.map(Number);
  
    // Calcular los componentes RGB del color interpolado
    const rInterpolado = Math.round(rInicio + (rFin - rInicio) * valor);
    const gInterpolado = Math.round(gInicio + (gFin - gInicio) * valor);
    const bInterpolado = Math.round(bInicio + (bFin - bInicio) * valor);
  
    // Construir el string para el color interpolado en formato 'rgb(r, g, b)'
    const colorInterpolado = `rgb(${rInterpolado}, ${gInterpolado}, ${bInterpolado})`;
    
    return colorInterpolado;
  }


  const getColorData_depa = (departament) =>{

    let dictionary_color = {
      'Bajo':['rgb(189, 46, 45)','rgb(165, 69, 53)'],
      'Mod. bajo':['rgb(165, 69, 53)','rgb(101, 125, 87)'],
      'Medio':['rgb(101, 125, 87)','rgb(77, 182, 100)'],
      'Mod. alto':['rgb(77, 182, 100)','rgb(177, 225, 57)'],
      'Alto':['rgb(177, 225, 57)','rgb(251, 247, 25)'],
    }
    // ESCALA DE COLOR
    let object =  arrayDepartaments.filter((obj)=> eliminarTildes(obj.name).toUpperCase() === eliminarTildes(departament).toUpperCase())

    if (object.length === 0){
      return 'gray'
    }else{
      if(object[0]['Rango_media'] == 'No hay datos'){
        return 'gray'
      }
      return getColor(object[0]['value'],dictionary_color[object[0]['Rango_media']][0],dictionary_color[object[0]['Rango_media']][1])
    }

  }


  const getColorData_muni = (departament) =>{

    let dictionary_color = {
      'Bajo':['rgb(189, 46, 45)','rgb(165, 69, 53)'],
      'Mod. bajo':['rgb(165, 69, 53)','rgb(101, 125, 87)'],
      'Medio':['rgb(101, 125, 87)','rgb(77, 182, 100)'],
      'Mod. alto':['rgb(77, 182, 100)','rgb(177, 225, 57)'],
      'Alto':['rgb(177, 225, 57)','rgb(251, 247, 25)'],
    }
    // ESCALA DE COLOR
    let object =  arrayMunicipios.filter((obj)=> eliminarTildes(obj.name).toUpperCase() === eliminarTildes(departament).toUpperCase())

    if (object.length === 0){
      return 'gray'
    }else{
      if(object[0]['Rango_media'] == 'No hay datos'){
        return 'gray'
      }
      return getColor(object[0]['value'],dictionary_color[object[0]['Rango_media']][0],dictionary_color[object[0]['Rango_media']][1])
    }

  }


  function formato(numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  let [selectCity,setSelectCity] = React.useState(null);

  

  
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
                      <p className='description_map_text nova'>Conocimiento técnico y científico para la toma de decisiones agrícolas con base en el análisis fisicoquímico de suelos.</p>
                  </div>
                  
                  <div className='description_map_2'>
                      <p className='description_map_text_2 nova'>Mapa de fertilidad de suelos</p>
                  </div> 
                  <form className='formulario'>
                          <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                    <div className='form-floating inner-addon- left-addon-'>
                                      <Select options={type_cultivo}  onChange={(event)=>readSelectDepartamentForm(event,'tipo_cultivo')} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Cultivo:" styles={selectStyles} isClearable={true} />
                                    </div>
                              </div>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                    <div className='form-floating inner-addon- left-addon-'>
                                      <Select options={tipo_muestra} onChange={(event)=>readSelectDepartamentForm(event,'variable')}  components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Determinación:" styles={selectStyles} isClearable={true} />
                                    </div>
                              </div>
                          </div>
                          <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                    <div className='form-floating inner-addon- left-addon-'>
                                      <Select isMulti={true} options={years} onChange={(event)=>readSelectDepartamentForm(event,'year')} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Año:" styles={selectStyles} isClearable={true} />
                                    </div>
                              </div>
                          </div>
                          <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                              <div className='col-auto' style={{width:'100%',display:'flex','justifyContent':'end','marginBottom':'30px'}}>
                                  <button onClick={findResults} className='buttonProduct btn btn-dark-purple- rounded-pill ps-5 pe-5 d-flex flex-row justify-content-center align-items-center align-self-center h-45-' type="button" >
                                    <span className='textButton lh-1 fs-6- ff-monse-regular- fw-semibold' >Buscar</span>
                                  </button>
                              </div>
                          </div>
                          
                          <div>
                            <div className="boxRange" onClick={()=>setSee(!see)} style={{cursor:'pointer',
                              background: `linear-gradient(to right, ${'#bd2e2d'} 0%, ${'#aa3f32'} 15%, ${'#aa3f32'} 15%, ${'#83634a'} 30%, ${'#83634a'} 30%, ${'#48ac66'} 45%, ${'#48ac66'} 45%, ${'#81d350'} 60%, ${'#81d350'} 60%, ${'#c1e634'} 80%, ${'#c1e634'} 80%, ${'#eff320'} 90%, ${'#eff320'} 90%, ${'#f9f622'} 100%)`,width:'100%','height':'50px',borderRadius:'20px'
                            }}></div>
                          </div>

                          {
                            see ?  
                            <>
                            <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                    <div className = "boxRange_2">
                                      <div style={{width:'15px',height:'15px',background:'rgb(189, 46, 45)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                      <span style={{marginLeft:'5px',position:'relative','bottom':'2px'}}><b>Rango: </b>{' Bajo'}</span>
                                    </div>
                              </div>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                    <div className = "boxRange_2">
                                      <div style={{width:'15px',height:'15px',background:'rgb(165, 69, 53)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                      <span style={{marginLeft:'5px',position:'relative','bottom':'2px'}}><b>Rango: </b>{' Moderadamente bajo'}</span>
                                    </div>
                              </div>
                              
                          </div>
                          <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                    <div className = "boxRange_2">
                                      <div style={{width:'15px',height:'15px',background:'rgb(77, 182, 100)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                      <span style={{marginLeft:'5px',position:'relative','bottom':'2px'}}><b>Rango:</b>{' Medio'}</span>
                                    </div>
                              </div>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                    <div className = "boxRange_2">
                                      <div style={{width:'15px',height:'15px',background:'rgb(177, 225, 57)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                      <span style={{marginLeft:'5px',position:'relative','bottom':'2px'}}><b>Rango:</b>{' Moderadamente alto'}</span>
                                    </div>
                              </div>
                              
                          </div>
                          <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                              <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                      <div className = "boxRange_2">
                                        <div style={{width:'15px',height:'15px',background:'rgb(251, 247, 25)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                        <span style={{marginLeft:'5px',position:'relative','bottom':'2px'}}><b>Rango:</b>{' Alto'}</span>
                                      </div>
                              </div>
                          </div>
                            </>
                            :
                            <></>
                          }
                          
                          {departament !== ""  ? 
                          <>
                          <div className='description_map_2'>
                              <p className='description_map_text_2 nova'>{departament}</p>
                          </div> 
                          <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                              <div className='col-auto' style={{width:'100%',display:'flex','justifyContent':'end'}}>
                                  <button onClick={resetData} className='buttonProduct btn btn-dark-purple- rounded-pill ps-5 pe-5 d-flex flex-row justify-content-center align-items-center align-self-center h-45-' type="button" >
                                    <span className='textButton lh-1 fs-6- ff-monse-regular- fw-semibold' >Volver</span>
                                  </button>
                              </div>
                          </div>
                          </>
                          :
                          <></>
                          }
                  </form>
                  <div className='container_data'>
                    <div className='container_pc'>
                        <MapContainer
                          ref = {mapRef} 
                          onScroll={handleScroll}                         className='mapstyles'
                          center={[4.5709, -74.2973]} // Centro de Colombia
                          zoom={6} // Zoom inicial
                          style={mapStyles}
                        > 
 
                          {departament === "" ? 
                          <TileLayer
                            url ="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=HXpSPxolOD99vBzDBreA"
                            attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                            >
                          </TileLayer>
                          :
                          <></>
                          }
                          
                          {arrayDepartaments.length !== 0 && departament ===""  ?
                          <>
                          <GeoJSON
                              data={cauca}
                              style={(feature) => ({
                                fillColor:getColorData_depa('CAUCA'),
                                weight: 2,
                                color: 'white',
                                fillOpacity: 1,
                              })}
                              eventHandlers={{
                              mouseover:(e) =>{
                                  const layer = e.target;
                                  layer.setStyle({
                                    fillOpacity:0.2
                                  })
                              },
                              dblclick:(e)=>{
                                setDataMuni(Municipios?.features.filter((obj)=>obj?.properties?.dpt === 'CAUCA'))
                                setDepartament('CAUCA');
                                findResults_municipios('CAUCA')
                              },
                              mouseout:(e)=>{
                                const layer = e.target;
                                  layer.setStyle({
                                    fillOpacity:1
                                  })
                              },

                            }}
                             
                            >
                            <Popup>
                            <div style={{width:'100%',height:'100%','display':'flex','flexDirection':'column','alignItems':'center',justifyContent:'start'}}>
                                        <span style={{fontWeight:'600'}}>{getDepartamentObject('CAUCA').name+': ('+getDepartamentObject('CAUCA').media+')'}</span>
                                        <span style={{fontWeight:'600'}}>{departamentsForm.variable_mostrar+' '+departamentsForm.unidad}</span>
                                        <div style={{width:'100%','display':'flex',flexDirection:'row','alignItems':'center'}}>
                                              <div style={{width:'7px',height:'7px',backgroundColor:'rgb(189, 46, 45)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                              <span style={{marginLeft:'5px'}}>{getDepartamentObject('CAUCA').Bajo == 0 ?  '0%' :  (parseInt(getDepartamentObject('CAUCA').Bajo) / parseInt(getDepartamentObject('CAUCA')['cantidad registros'])*100).toFixed(1).toString()+'%'}</span>
                                        </div>
                                        <div style={{width:'100%','display':'flex',flexDirection:'row','alignItems':'center'}}>
                                              <div style={{width:'7px',height:'7px',backgroundColor:'rgb(165, 69, 53)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                              <span style={{marginLeft:'5px'}}>{getDepartamentObject('CAUCA')['Mod. bajo'] == 0 ?  '0%' :  (parseInt(getDepartamentObject('CAUCA')['Mod. bajo']) / parseInt(getDepartamentObject('CAUCA')['cantidad registros'])*100).toFixed(1).toString()+'%'}</span>
                                        </div>
                                        <div style={{width:'100%','display':'flex',flexDirection:'row','alignItems':'center'}}>
                                              <div style={{width:'7px',height:'7px',backgroundColor:'rgb(77, 182, 100)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                              <span style={{marginLeft:'5px'}}>{getDepartamentObject('CAUCA')['Medio'] == 0 ?  '0%' :  (parseInt(getDepartamentObject('CAUCA')['Medio']) / parseInt(getDepartamentObject('CAUCA')['cantidad registros'])*100).toFixed(1).toString()+'%'}</span>
                                        </div>
                                        <div style={{width:'100%','display':'flex',flexDirection:'row','alignItems':'center'}}>
                                              <div style={{width:'7px',height:'7px',backgroundColor:'rgb(177, 225, 57)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                              <span style={{marginLeft:'5px'}}>{getDepartamentObject('CAUCA')['Mod. alto'] == 0 ?  '0%' :  (parseInt(getDepartamentObject('CAUCA')['Mod. alto']) / parseInt(getDepartamentObject('CAUCA')['cantidad registros'])*100).toFixed(1).toString()+'%'}</span>
                                        </div>
                                        <div style={{width:'100%','display':'flex',flexDirection:'row','alignItems':'center'}}>
                                              <div style={{width:'7px',height:'7px',background:'rgb(251, 247, 25)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                              <span style={{marginLeft:'5px'}}>{getDepartamentObject('CAUCA')['Alto'] == 0 ?  '0%' :  (parseInt(getDepartamentObject('CAUCA')['Alto']) / parseInt(getDepartamentObject('CAUCA')['cantidad registros'])*100).toFixed(1).toString()+'%'}</span>
                                        </div>

                                  </div>
                            </Popup>
                          </GeoJSON>
                          {
                            departaments?.features.map((depa,index)=>{
                              const coordinates = depa.geometry.coordinates[0].map((item)=>[item[1],item[0]])
                              return (
                                <Polygon
                                key={index}
                                pathOptions={{
                                  fillColor:getColorData_depa(depa?.properties?.NOMBRE_DPT),
                                  fillOpacity:1,
                                  weight:2,
                                  opacity:1,
                                  dashArray:3,
                                  color:'white'
                                }}
                                positions={coordinates}
                                eventHandlers={{
                              mouseover:(e) =>{
                                  const layer = e.target;
                                  layer.setStyle({
                                    fillOpacity:0.2
                                  })
                              },
                              dblclick:(e)=>{

                                setDataMuni(Municipios?.features.filter((obj)=>obj?.properties?.dpt === depa?.properties?.NOMBRE_DPT))
                                setDepartament(depa?.properties?.NOMBRE_DPT)
                                findResults_municipios(depa?.properties?.NOMBRE_DPT)
                              },
                              mouseout:(e)=>{
                                const layer = e.target;
                                  layer.setStyle({
                                    fillOpacity:1
                                  })
                              },
                              

                            }}
                            
                                
                                >
                                <Popup>
                                   
                                   <div style={{width:'100%',height:'100%','display':'flex','flexDirection':'column','alignItems':'center',justifyContent:'start'}}>
                                        <span style={{fontWeight:'600'}}>{getDepartamentObject(depa?.properties?.NOMBRE_DPT).name+': ('+getDepartamentObject(depa?.properties?.NOMBRE_DPT).media+')' }</span>
                                        <span style={{fontWeight:'600'}}>{departamentsForm.variable_mostrar+' '+departamentsForm.unidad}</span>
                                        <div style={{width:'100%','display':'flex',flexDirection:'row','alignItems':'center'}}>
                                              <div style={{width:'7px',height:'7px',background:'rgb(189, 46, 45)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                              <span style={{marginLeft:'5px'}}>{getDepartamentObject(depa?.properties?.NOMBRE_DPT)['Bajo'] == 0 ?  '0%' :  (parseInt(getDepartamentObject(depa?.properties?.NOMBRE_DPT)['Bajo']) / parseInt(getDepartamentObject(depa?.properties?.NOMBRE_DPT)['cantidad registros'])*100).toFixed(1).toString()+'%'}</span>
                                        </div>
                                        <div style={{width:'100%','display':'flex',flexDirection:'row','alignItems':'center'}}>
                                              <div style={{width:'7px',height:'7px',background:'rgb(165, 69, 53)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                              <span style={{marginLeft:'5px'}}>{getDepartamentObject(depa?.properties?.NOMBRE_DPT)['Mod. bajo'] == 0 ?  '0%' :  (parseInt(getDepartamentObject(depa?.properties?.NOMBRE_DPT)['Mod. bajo']) / parseInt(getDepartamentObject(depa?.properties?.NOMBRE_DPT)['cantidad registros'])*100).toFixed(1).toString()+'%'}</span>
                                        </div>
                                        <div style={{width:'100%','display':'flex',flexDirection:'row','alignItems':'center'}}>
                                              <div style={{width:'7px',height:'7px',background:'rgb(77, 182, 100)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                              <span style={{marginLeft:'5px'}}>{getDepartamentObject(depa?.properties?.NOMBRE_DPT)['Medio'] == 0 ?  '0%' :  (parseInt(getDepartamentObject(depa?.properties?.NOMBRE_DPT)['Medio']) / parseInt(getDepartamentObject(depa?.properties?.NOMBRE_DPT)['cantidad registros'])*100).toFixed(1).toString()+'%'}</span>
                                        </div>
                                        <div style={{width:'100%','display':'flex',flexDirection:'row','alignItems':'center'}}>
                                              <div style={{width:'7px',height:'7px',background:'rgb(177, 225, 57)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                              <span style={{marginLeft:'5px'}}>{getDepartamentObject(depa?.properties?.NOMBRE_DPT)['Mod. alto'] == 0 ?  '0%' :  (parseInt(getDepartamentObject(depa?.properties?.NOMBRE_DPT)['Mod. alto']) / parseInt(getDepartamentObject(depa?.properties?.NOMBRE_DPT)['cantidad registros'])*100).toFixed(1).toString()+'%'}</span>
                                        </div>
                                        <div style={{width:'100%','display':'flex',flexDirection:'row','alignItems':'center'}}>
                                              <div style={{width:'7px',height:'7px',background:'rgb(251, 247, 25)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                              <span style={{marginLeft:'5px'}}>{getDepartamentObject(depa?.properties?.NOMBRE_DPT)['Alto'] == 0 ?  '0%' :  (parseInt(getDepartamentObject(depa?.properties?.NOMBRE_DPT)['Alto']) / parseInt(getDepartamentObject(depa?.properties?.NOMBRE_DPT)['cantidad registros'])*100).toFixed(1).toString()+'%'}</span>
                                        </div>
                                   </div>
                                  
                                  
                                </Popup>
                                </Polygon>
                              )
                            })
                          }
                          </>
                          :
                          <></>
                          }
                          
                          {
                            departament !== "" ? 
                            <>
                            {
                            dataMuni.map((muni,index)=>{
                              const x = -12.0;
                              const Y = -37.7;
                              const coordinates = muni.geometry.coordinates[0].map((item)=>[item[1] + Y,item[0] + x])
                              return (
                                <>
                                {muni?.properties?.name !== undefined ?
                                <Polygon
                                key={index}
                                pathOptions={{
                                  fillColor:getColorData_muni(muni?.properties?.name),
                                  fillOpacity:0.7,
                                  weight:2,
                                  opacity:1,
                                  dashArray:3,
                                  color:'white'
                                }}
                                positions={coordinates}
                                eventHandlers={{
                              mouseover:(e) =>{
                                  const layer = e.target;
                                  layer.setStyle({
                                    fillOpacity:0.2
                                  })
                              },
                              mouseout:(e)=>{
                                const layer = e.target;
                                  layer.setStyle({
                                    fillOpacity:0.7
                                  })
                              },

                            }}
                                
                                >
                                <Popup>
                                   
                                   <div style={{width:'100%',height:'100%','display':'flex','flexDirection':'column','alignItems':'center',justifyContent:'start'}}>
                                        <span style={{fontWeight:'600'}}>{getDepartamentObject_muni(muni?.properties?.name).name+': ('+getDepartamentObject_muni(muni?.properties?.name).media+')'}</span>
                                        <span style={{fontWeight:'600'}}>{departamentsForm.variable_mostrar+' '+departamentsForm.unidad}</span>
                                        <div style={{width:'100%','display':'flex',flexDirection:'row','alignItems':'center'}}>
                                              <div style={{width:'7px',height:'7px',background:'rgb(189, 46, 45)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                              <span style={{marginLeft:'5px'}}>{getDepartamentObject_muni(muni?.properties?.name)['Bajo'] == 0 ?  '0%' :  (parseInt(getDepartamentObject_muni(muni?.properties?.name)['Bajo']) / parseInt(getDepartamentObject_muni(muni?.properties?.name)['cantidad registros'])*100).toFixed(1).toString()+'%'}</span>
                                        </div>
                                        <div style={{width:'100%','display':'flex',flexDirection:'row','alignItems':'center'}}>
                                              <div style={{width:'7px',height:'7px',background:'rgb(165, 69, 53)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                              <span style={{marginLeft:'5px'}}>{getDepartamentObject_muni(muni?.properties?.name)['Mod. bajo'] == 0 ?  '0%' :  (parseInt(getDepartamentObject_muni(muni?.properties?.name)['Mod. bajo']) / parseInt(getDepartamentObject_muni(muni?.properties?.name)['cantidad registros'])*100).toFixed(1).toString()+'%'}</span>
                                        </div>
                                        <div style={{width:'100%','display':'flex',flexDirection:'row','alignItems':'center'}}>
                                              <div style={{width:'7px',height:'7px',background:'rgb(77, 182, 100)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                              <span style={{marginLeft:'5px'}}>{getDepartamentObject_muni(muni?.properties?.name)['Medio'] == 0 ?  '0%' :  (parseInt(getDepartamentObject_muni(muni?.properties?.name)['Medio']) / parseInt(getDepartamentObject_muni(muni?.properties?.name)['cantidad registros'])*100).toFixed(1).toString()+'%'}</span>
                                        </div>
                                        <div style={{width:'100%','display':'flex',flexDirection:'row','alignItems':'center'}}>
                                              <div style={{width:'7px',height:'7px',background:'rgb(177, 225, 57)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                              <span style={{marginLeft:'5px'}}>{getDepartamentObject_muni(muni?.properties?.name)['Mod. alto'] == 0 ?  '0%' :  (parseInt(getDepartamentObject_muni(muni?.properties?.name)['Mod. alto']) / parseInt(getDepartamentObject_muni(muni?.properties?.name)['cantidad registros'])*100).toFixed(1).toString()+'%'}</span>
                                        </div>
                                        <div style={{width:'100%','display':'flex',flexDirection:'row','alignItems':'center'}}>
                                              <div style={{width:'7px',height:'7px',background:'rgb(251, 247, 25)','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                              <span style={{marginLeft:'5px'}}>{getDepartamentObject_muni(muni?.properties?.name)['Alto'] == 0 ?  '0%' :  (parseInt(getDepartamentObject_muni(muni?.properties?.name)['Alto']) / parseInt(getDepartamentObject_muni(muni?.properties?.name)['cantidad registros'])*100).toFixed(1).toString()+'%'}</span>
                                        </div>
                                  </div>
                                  
                                  
                                </Popup>
                                </Polygon>
                                :
                                <></>
                                }
                                
                                </>
                                
                              )
                            })
                          }
                            </>
                            :
                            <>
                            </>
                          }
                          
                          
                        </MapContainer>
                    </div>
                  </div>
                  <div className='container_data__' style={{visibility:arrayDepartaments.length !== 0 ? 'visible':'hidden'}}>
                          <div id='card-indicator-large-' className='card border-0 rounded-3 w-100 bs-2- position-relative overflow-hidden'>
                            <div className='card-header border-0 bg-transparent p-4 pb-0'>
                              <div className='d-flex flex-row justify-content-between align-items-center align-self-center mb-1'>
                                <h1 className='m-0 p-0 lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple- description_map_text_2 nova'>
                                {'Valores registrados '+departamentsForm.variable_mostrar}
                                </h1>
                                <button className='btn rounded-pill p-2 d-flex flex-row justify-content-center align-items-center align-self-center button-open- btn-dark-purple- bs-1- ms-2'  onClick={() => toggleOverlay('card1')}>
                                  <CiCircleMore style={{width:'90',height:'90'}} width={90} height={90} color='black'/>
                                </button>
                              </div>
                              <div className='w-75'>
                                <p className='m-0 p-0 lh-sm fs-5- ff-monse-regular- fw-normal tx-black-'>
                                  {'Se muestran los 6 departamentos con mayor media dependiendo de la determinación seleccionada '} 
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
                                        <h1 className='m-0 p-0 lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple- description_map_text_2 nova'>
                                            {'Tabla de datos '+departamentsForm.variable_mostrar}
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
                                                  <span className='fs-5- ff-monse-regular- fw-bold tx-dark-purple- nova'>Departamento</span>
                                                </div>
                                              </th>
                                              <th scope="col" className='th-width-sm-'>
                                                <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                                  <span className='fs-5- ff-monse-regular- fw-bold tx-dark-purple- nova'>Promedio</span>
                                                </div>
                                              </th>
                                              <th scope="col" className='th-width-sm-'>
                                                <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                                  <span className='fs-5- ff-monse-regular- fw-bold tx-dark-purple- nova'>Bajo</span>
                                                </div>
                                              </th>
                                              <th scope="col" className='th-width-sm-'>
                                                <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                                  <span className='fs-5- ff-monse-regular- fw-bold tx-dark-purple- nova'>Mod. bajo</span>
                                                </div>
                                              </th>
                                              <th scope="col" className='th-width-sm-'>
                                                <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                                  <span className='fs-5- ff-monse-regular- fw-bold tx-dark-purple- nova'>Medio</span>
                                                </div>
                                              </th>
                                              <th scope="col" className='th-width-sm-'>
                                                <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                                  <span className='fs-5- ff-monse-regular- fw-bold tx-dark-purple- nova'>Mod. alto</span>
                                                </div>
                                              </th>
                                              <th scope="col" className='th-width-sm-'>
                                                <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                                                  <span className='fs-5- ff-monse-regular- fw-bold tx-dark-purple- nova'>Alto</span>
                                                </div>
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {arrayDepartaments.map((obj,index)=>{
                                              return(
                                              <tr key={index}>
                                                <td className='align-middle'>
                                                  <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{obj.name}</p>
                                                </td>
                                                <td className='align-middle'>
                                                  <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{obj['media']}</p>
                                                </td>
                                                <td className='align-middle'>
                                                  <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{formato(obj['Bajo'])}</p>
                                                </td>
                                                <td className='align-middle'>
                                                  <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{formato(obj['Mod. bajo'])}</p>
                                                </td>
                                                <td className='align-middle'>
                                                  <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{formato(obj['Medio'])}</p>
                                                </td>
                                                <td className='align-middle'>
                                                  <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{formato(obj['Mod. alto'])}</p>
                                                </td>
                                                <td className='align-middle'>
                                                  <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{formato(obj['Alto'])}</p>
                                                </td>
                                              </tr>
                                              )
                                            })}
                                            
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
