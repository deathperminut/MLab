import React from 'react'
import './Forms.css'
import { useRef } from 'react';
import Navigationbar from '../../Components/Navbar/Navbar';
import Fondo from '../../img/Langing_2.png';
import { TiCancelOutline } from "react-icons/ti";
import '../../index.css';
import {useNavigate} from 'react-router-dom';
import { GiColombia } from 'react-icons/gi';
import Swal from 'sweetalert2';
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
import { cliente_historial, getClientes, getDepartaments, getDepartamentsData, getMunicipios, getMunicipios_data, inferencia_2, inferencia_rango } from '../../services/services';



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





export default function Forms() {

    let tipo_muestra =[
    {value:"ph",label:"pH"},
    {value:"n",label:"N"},
    {value:"mo",label:"MO"},
    {value:"k",label:"K"},
    {value:"ca",label:"Ca"},
    {value:"mg",label:"Mg"},
    {value:"al",label:"Al"},
    {value:"cic",label:"CIC"},
    {value:"p",label:"P"},
    {value:"fe",label:"Fe"},
    {value:"mn",label:"Mn"},
    {value:"zn",label:"Zn"},
    {value:"cu",label:"Cu"},
    {value:"s",label:"S"},
    {value:"b",label:"B"},
    {value:"ar",label:"Ar"},
    {value:"l",label:"L"},
    {value:"a",label:"A"},
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

  const [showOverlay, setShowOverlay] = useState(false);
  const [hiddenOverlay, setHiddenOverlay] = useState(true);

  const toggleOverlay = (cardId) => {
    setShowOverlay(cardId);
    setHiddenOverlay(false);
  };

  // SELECT CLIENTE
  let [Answer,setAnswer] = React.useState(null);
  let [Answer_cliente,setAnswer_cliente] = React.useState(null);
  let [cliente,setCliente] = React.useState({
    "tipo_cultivo": "",
    "variable": "",
    "cliente": "",
    "finca":""
  })
  const readCliente_input = (event,type) =>{

    setCliente({...cliente,[type]:event.target.value})

  }

  const readCliente_select = (event,type) =>{

    if (event){
      setCliente({...cliente,[type]:event.value})
    }else{
      setCliente({...cliente,[type]:""})
    }

  }
  let [preloader,setPreloader] = React.useState(false);
  const makeCliente =async()=>{
    
    if(cliente.cliente !== "" && cliente.tipo_cultivo !== "" && cliente.variable !== ""){

        let result = undefined;
        setPreloader(true);
        result =  await cliente_historial(cliente).catch((error)=>{
          console.log(error);
          setPreloader(false);
          Swal.fire({
            icon: 'info',
            text:"Error al hacer inferencia.",
          })
          
          setAnswer_cliente(null)
        })
        if(result){
          setPreloader(false);
          if(result.data.length == 0){
            Swal.fire({
              icon: 'info',
              text:"No hay un historico para el código de cliente seleccionado",
            })
            setAnswer_cliente(null)
          }else{
            Swal.fire({
              icon: 'success',
              text:"Busqueda realizada correctamente",
            })
            console.log(result.data)
            setAnswer_cliente(result.data)
          }
          
        }

    }else{
      Swal.fire({
        icon: 'info',
        text:"Debe registrar todos los campos",
      })
    }

  }

  React.useEffect(() => {
    if(Answer_cliente !== null){

    let datamap = Answer_cliente.map((obj)=>{
      return(
        [obj.year,obj.media === 'No hay datos' ? 0 :obj.media]
      )
    })

    let chartGraphInr = echarts.init(document.getElementById('chart-inr'));
    let optionGraphInr;

    optionGraphInr = {
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
          fontSize: 14,
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
        top: 'top',
        bottom: 20,
        itemGap : 50,
        width: '90%',
        inactiveColor: '#728998',
        textStyle: {
          color: '#414D55',
          fontWeight: 'normal',
          fontFamily: 'Monserat-regular'
        },
        pageIconSize: 12,
        pageIconColor: '#6149CD',
        pageIconInactiveColor: '#414D55',
        pageTextStyle: {
          color: '#414D55',
          fontWeight: 'normal',
          fontFamily: 'Monserat-regular'
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
        data: ['Media']
      },
      xAxis: {
        type: 'category',
        name: '',
        minorTick: {
          show: true
        },
        minorSplitLine: {
          show: true
        },
        axisTick: {
          show: false,
        },
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
        boundaryGap: false,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#728998',
            width: 1,
            cap: 'round'
          }
        },
      },
      yAxis: {
        type: 'value',
        nameLocation: 'middle',
        minorTick: {
          show: true
        },
        minorSplitLine: {
          show: true
        },
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
        boundaryGap: [0, '0%'],
        splitNumber: 3
      },
      grid: [
        {
          containLabel: true,
          borderColor: '#728998'
        }
      ],
      series: [
        {
          name: 'Media',
          type: 'line',
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 0,
          smooth: true,
          clip: true,
          lineStyle: {
            color: "#3c8bda",
            width: 2,
            shadowBlur: 0,
            shadowOffsetY: 0
          },
          itemStyle: {
            color: '#3c8bda'
          },
          top: 15,
          label: {
            show: false,
            color: '#414D55',
            fontSize: 12,
            fontWeight: 'normal',
            fontFamily: 'Monserat-regular',
          },
          emphasis: {
            label: {
              show: false,
              color: '#414D55',
              fontSize: 12,
              fontWeight: 'normal',
              fontFamily: 'Monserat-regular'
            }
          },
          lableLine: {
            normal: {
              show: false,
              fontSize: 12,
              fontWeight: 'normal',
              fontFamily: 'Monserat-regular'
            },
            emphasis: {
              show: true,
              fontSize: 12,
              fontWeight: 'normal',
              fontFamily: 'Monserat-regular'
            }
          },
          data:datamap,
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

    optionGraphInr && chartGraphInr.setOption(optionGraphInr);

    $(window).on('resize', function(){
      if(chartGraphInr != null && chartGraphInr !== undefined){
        chartGraphInr.resize();
      }
    });

    }
    
  }, [Answer_cliente]);

  // React.useEffect(()=>{
  //   //loadClientes()
  // },[])

  let [clientes,setClientes] = React.useState([]);
  let [clientes_short,setClientes_short] = React.useState([]);
  

  const loadClientes=async()=>{

    setPreloader(true);
    let result =  undefined;
    result =  await getClientes().catch((error)=>{
        console.log(error);
        setPreloader(false);
        Swal.fire({
            icon: 'info',
            text:"Problemas para cargar datos de clientes",
        })
    })

    if(result){
        setPreloader(false);
        setClientes(result.data);
        setClientes_short(result.data.slice(0,100))
    }

  }


  /* SEGUNDO FORMULARIO */
  let [inference,setInference] = React.useState({
    "tipo_cultivo": '',
    "variable": '',
    "magnitud": '',
    "Municipio": '',
    "departament": '',
    "year": []
  })

  let [departament,setDepartament] = React.useState([])
  let [muni,setMuni] = React.useState([])
  
  // NOS TRAEMOS LOS DEPARTAMENTOS INICIALES
  React.useEffect(()=>{
    load_departaments()
  },[])


  const load_muni=async(id_departament)=>{

    setPreloader(true);
    let result =  undefined
    result = await getMunicipios({'id_departament':id_departament}).catch((error)=>{
      console.log(error);
      setPreloader(false);
      Swal.fire({
        icon: 'info',
        text:"Problemas para cargar la información de los municipios",
      })
    })
    
    if(result){
      setPreloader(false);
      console.log("DATA : ",result.data);
      setMuni(result.data.map(obj => ({
        value: obj.id,
        label: obj.name,
      })))
    }

  }

  const load_departaments=async()=>{

    setPreloader(true);
    let result =  undefined
    result = await getDepartaments().catch((error)=>{
      console.log(error);
      setPreloader(false);
      Swal.fire({
        icon: 'info',
        text:"Problemas para cargar la información de los departamentos",
      })
    })
    
    if(result){
      setPreloader(false);
      console.log("DATA : ",result.data);
      setDepartament(result.data.map(obj => ({
        value: obj.id,
        label: obj.name,
      })))
    }
  }

  const makeInference = async() =>{

    if (inference.magnitud !== "" && inference.tipo_cultivo !== "" && inference.variable){

      let result  = undefined
      setPreloader(true);
      result = await inferencia_2(inference).catch((error)=>{
        console.log(error);
        Swal.fire({
          icon: 'info',
          text:"Error al hacer inferencia del rango",
        })
        setAnswer(null);
        setPreloader(false);
      })

      if(result){
        setPreloader(false)
        let html = ""

        if(result.data.Answer === 'Bajo'){

          html='<span class="p-1 ps-2 pe-2 m-0 lh-sm ff-monse-regular- fw-normal text-center rounded-4 bajo">' + result.data.Answer + '</span>';

        }else if (result.data.Answer === 'Mod. bajo'){
          html='<span class="p-1 ps-2 pe-2 m-0 lh-sm ff-monse-regular- fw-normal text-center rounded-4 m_bajo">' + result.data.Answer + '</span>';
        }else if  (result.data.Answer === 'Medio'){
          html='<span class="p-1 ps-2 pe-2 m-0 lh-sm ff-monse-regular- fw-normal text-center rounded-4 medio">' + result.data.Answer + '</span>';
        }else if (result.data.Answer === 'Mod. alto'){
          html='<span class="p-1 ps-2 pe-2 m-0 lh-sm ff-monse-regular- fw-normal text-center rounded-4 m_alto">' + result.data.Answer + '</span>';
        }else{
          html='<span class="p-1 ps-2 pe-2 m-0 lh-sm ff-monse-regular- fw-normal text-center rounded-4 alto">' + result.data.Answer + '</span>';
        }
        Swal.fire({
          icon: 'success',
          html:html,
        }).then(Answer => {
          if (Answer.isConfirmed){

            setAnswer(result.data);
            if(result.data.Answer_city.Rango_media == 'No hay datos'){
              Swal.fire({
                icon: 'info',
                text:"No es posible hacer una comparativa, no hay datos asociados a la zona y año seleccionado",
              })
            }else{
              if(result.data.Answer !== result.data.Answer_city.Rango_media ){

                Swal.fire({
                  icon: 'info',
                  text:"El valor registrado, se encuentra fuera del rango asociado a la zona seleccionada",
                }) 
  
              }else{
                Swal.fire({
                  icon: 'success',
                  text:"El valor registrado, se encuentra encuentra dentro de los limites de la zona seleccionada",
                }) 
              }
            }
            

          } 
        })
        

      }

    }else{
      Swal.fire({
        icon: 'info',
        text:"Debe registrar los campos de valor, tipo de cultivo y determinación",
      })
    }

  }

  const readinferences_input = (event,type) =>{

    setInference({...inference,[type]:event.target.value})

  }

  const readinferences_select = (event,type) =>{
    if(type =='year'){
      setInference({...inference,[type]:event})
    }else{
      
      if (event){
        if(type =='departament'){
          load_muni(event.value);
          setInference({...inference,[type]:event.value});
        }else{
          setInference({...inference,[type]:event.value})
        }
        
      }else{
        if(type =='departament'){
          setMuni([]);
          setInference({...inference,[type]:''})
        }else{
          setInference({...inference,[type]:''})
        }
        
      }
    }
  }

  const handleInputChange = (newValue) => {

    if(newValue === ""){
        setClientes_short(clientes.slice(0,100));
    }else{
        let filterData = clientes.filter((obj)=> obj.value.toLowerCase().includes(newValue.toLowerCase()));
        if(filterData.length === 0){
            setClientes_short([]);
        }else if (filterData.length > 100){
            setClientes_short(filterData.slice(0,100));
        }else if (filterData.length < 100){
            setClientes_short(filterData);
        }
        
    }
    

  };

  function formato(numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }


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
                        {/* <div className='container_form'>
                                
                                <div className='card-header border-0 bg-transparent p-4 pb-0'>
                                        <div className='d-flex mb-1' style={{flexDirection:'column',alignItems:'start !important','marginBottom':'20px !important'}}>
                                            <h1 style={{'marginBottom':'40px','color':'#0d149a'}} className='p-0 lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple- description_map_text_3 nova'>
                                            Historico de clientes
                                            </h1>
                                        </div>
                                        <div  className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                                            
                                            <div  className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className='form-floating inner-addon- left-addon-'>
                                                        <div className='form-floating inner-addon- left-addon-'>
                                                            <Select onInputChange={handleInputChange} options={clientes_short} onChange={(event)=>readCliente_select(event,'cliente')} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Clientes:" styles={selectStyles} isClearable={true} />
                                                        </div>
                                                </div>
                                                
                                            </div>
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                    <div className='form-floating inner-addon- left-addon-'>
                                                        <Select options={type_cultivo} onChange={(event)=>readCliente_select(event,'tipo_cultivo')} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Tipo de cultivo:" styles={selectStyles} isClearable={true} />
                                                    </div>
                                            </div>
                                            
                                        </div>
                                        <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                                            
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className='form-floating inner-addon- left-addon-'>
                                                    <Select options={tipo_muestra} onChange={(event)=>readCliente_select(event,'variable')} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Determinación:" styles={selectStyles} isClearable={true} />
                                                </div>
                                            </div>
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className='form-floating inner-addon- left-addon-'>
                                                    <Select options={tipo_muestra} onChange={(event)=>readCliente_select(event,'finca')} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Finca:" styles={selectStyles} isClearable={true} />
                                                </div>
                                            </div>
                                            
                                        </div>
                                        {Answer_cliente !== null ? 
                                        <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5' style={{height:'300px'}}>
                                        <div className='w-100 h-100 mx-auto' id="chart-inr"></div>
                                        </div>
                                        :
                                        <></>
                                        }
                                        
                                        
                                    
                                    
                                    
                                        
                                    <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                                        <div className='col-auto' style={{width:'100%',display:'flex','justifyContent':'end'}}>
                                            <button onClick={makeCliente} className='buttonProduct btn btn-dark-purple- rounded-pill ps-5 pe-5 d-flex flex-row justify-content-center align-items-center align-self-center h-45-' type="button" >
                                                <span className='textButton lh-1 fs-6- ff-monse-regular- fw-semibold' >Evaluar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div> 
                        </div> */}
                        <div className='container_form'>
                                <div className='card-header border-0 bg-transparent p-4 pb-0'>
                                        <div className='d-flex mb-1' style={{flexDirection:'column',alignItems:'start !important','marginBottom':'20px !important'}}>
                                            <h1 style={{'marginBottom':'40px'}} className='p-0 lh-sm fs-4- ff-monse-regular- fw-bold tx-dark-purple- description_map_text_2 nova'>
                                            Formulario de interpretación
                                            </h1>
                                        </div>
                                        <div  className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                                            
                                            
                                            <div  className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className='form-floating inner-addon- left-addon-'>
                                                    <input type="number" onChange={(event)=>readinferences_input(event,'magnitud')} className='form-control'  placeholder="Registra el valor" />
                                                    <label className='fs-5- ff-monse-regular-'>Registra el valor</label>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className='form-floating inner-addon- left-addon-'>
                                                    <Select options={type_cultivo} onChange={(event)=>readinferences_select(event,'tipo_cultivo')} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Tipo de cultivo:" styles={selectStyles} isClearable={true} />
                                                </div>
                                            </div>
                                            
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className='form-floating inner-addon- left-addon-'>
                                                    <Select options={tipo_muestra} onChange={(event)=>readinferences_select(event,'variable')} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Determinación:" styles={selectStyles} isClearable={true} />
                                                </div>
                                            </div>
                                            
                                        </div>
                                        <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className='form-floating inner-addon- left-addon-'>
                                                    <Select options={departament} onChange={(event)=>readinferences_select(event,'departament')} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Departamento:" styles={selectStyles} isClearable={true} />
                                                </div>
                                            </div>
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className='form-floating inner-addon- left-addon-'>
                                                    <Select options={muni} onChange={(event)=>readinferences_select(event,'Municipio')} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Municipio:" styles={selectStyles} isClearable={true} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className='form-floating inner-addon- left-addon-'>
                                                    <Select isMulti={true} options={years} onChange={(event)=>readinferences_select(event,'year')} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Años:" styles={selectStyles} isClearable={true} />
                                                </div>
                                            </div>
                                        </div>
                                        {Answer !== null ? 
                                        
                                        <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                                        {Answer?.Answer == 'Bajo' ? 
                                        <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className = "boxRange">
                                                <div style={{width:'15px',height:'15px',background:'#F11F1F','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                                <span style={{marginLeft:'5px',position:'relative','bottom':'2px'}}><b>Rango: </b>{' Bajo'}</span>
                                                </div>
                                        </div>
                                        :
                                        <>
                                            {Answer?.Answer == 'Mod. bajo' ? 
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className = "boxRange">
                                                <div style={{width:'15px',height:'15px',background:'#F07B7B','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                                <span style={{marginLeft:'5px',position:'relative','bottom':'2px'}}><b>Rango: </b>{' Moderadamente bajo'}</span>
                                                </div>
                                            </div>
                                            :
                                            <>
                                            {Answer?.Answer =='Medio' ?  
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className = "boxRange">
                                                <div style={{width:'15px',height:'15px',background:'#9FF784','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                                <span style={{marginLeft:'5px',position:'relative','bottom':'2px'}}><b>Rango: </b>{' Medio'}</span>
                                                </div>
                                            </div>
                                            :
                                            <>
                                            {Answer?.Answer == 'Mod. alto' ? 
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className = "boxRange">
                                                <div style={{width:'15px',height:'15px',background:'#EBF781','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                                <span style={{marginLeft:'5px',position:'relative','bottom':'2px'}}><b>Rango: </b>{' Moderadamente alto'}</span>
                                                </div>
                                            </div>
                                            :
                                            <>
                                                {Answer?.Answer == 'Alto' ? 
                                                <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className = "boxRange">
                                                <div style={{width:'15px',height:'15px',background:'#FFE001','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                                <span style={{marginLeft:'5px',position:'relative','bottom':'2px'}}><b>Rango: </b>{' Alto'}</span>
                                                </div>
                                                </div>
                                                :
                                                <></>
                                                }
                                            </>
                                            } 
                                            </>
                                            
                                            }
                                            </>
                                            }
                                        </>
                                        }
                                        
                                        
                                        {Answer?.Answer  ? 
                                        <div  style={{background: `linear-gradient(to right, ${'#bd2e2d'} 0%, ${'#aa3f32'} 15%, ${'#aa3f32'} 15%, ${'#83634a'} 30%, ${'#83634a'} 30%, ${'#48ac66'} 45%, ${'#48ac66'} 45%, ${'#81d350'} 60%, ${'#81d350'} 60%, ${'#c1e634'} 80%, ${'#c1e634'} 80%, ${'#eff320'} 90%, ${'#eff320'} 90%, ${'#f9f622'} 100%)`,width:'100%','height':'50px',borderRadius:'20px'
                                        }}></div>
                                        :
                                        <></>
                                        }
                                        
                                        {Answer?.Answer_city.Rango_media != 'No hay datos'  ? 
                                        <>
                                        <div className='description_map_4'>
                                            <p className='description_map_text'>{'Zona seleccionada ('+Answer?.Answer_city.media+')'}</p>
                                        </div>
                                        {Answer?.Answer_city.Rango_media == 'Bajo' ? 
                                        <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className = "boxRange">
                                                <div style={{width:'15px',height:'15px',background:'#F11F1F','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                                <span style={{marginLeft:'5px',position:'relative','bottom':'2px'}}><b>Rango: </b>{' Bajo'}</span>
                                                </div>
                                        </div>
                                        :
                                        <>
                                            {Answer?.Answer_city.Rango_media == 'Mod. bajo' ? 
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className = "boxRange">
                                                <div style={{width:'15px',height:'15px',background:'#F07B7B','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                                <span style={{marginLeft:'5px',position:'relative','bottom':'2px'}}><b>Rango: </b>{' Moderadamente bajo'}</span>
                                                </div>
                                            </div>
                                            :
                                            <>
                                            {Answer?.Answer_city.Rango_media =='Medio' ?  
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className = "boxRange">
                                                <div style={{width:'15px',height:'15px',background:'#9FF784','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                                <span style={{marginLeft:'5px',position:'relative','bottom':'2px'}}><b>Rango: </b>{' Medio'}</span>
                                                </div>
                                            </div>
                                            :
                                            <>
                                            {Answer?.Answer_city.Rango_media == 'Mod. alto' ? 
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className = "boxRange">
                                                <div style={{width:'15px',height:'15px',background:'#EBF781','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                                <span style={{marginLeft:'5px',position:'relative','bottom':'2px'}}><b>Rango: </b>{' Moderadamente alto'}</span>
                                                </div>
                                            </div>
                                            :
                                            <>
                                                {Answer?.Answer_city.Rango_media == 'Alto' ? 
                                                <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-3 mb-xxl-3'>
                                                <div className = "boxRange">
                                                <div style={{width:'15px',height:'15px',background:'#FFE001','borderRadius':'10px','position':'relative',bottom:'2px'}}></div>
                                                <span style={{marginLeft:'5px',position:'relative','bottom':'2px'}}><b>Rango: </b>{' Alto'}</span>
                                                </div>
                                                </div>
                                                :
                                                <></>
                                                }
                                            </>
                                            } 
                                            </>
                                            
                                            }
                                            </>
                                            }
                                        </>
                                        }
                                        <div className='table-responsive table-general-'>
                                        <table className='table table-sm table-striped table-no-border- align-middle'>
                                          <thead>
                                            <tr>
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
                                              <tr>

                                                <td className='align-middle'>
                                                  <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{Answer?.Answer_city['media']}</p>
                                                </td>
                                                <td className='align-middle'>
                                                  <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{formato(Answer?.Answer_city['Bajo'])}</p>
                                                </td>
                                                <td className='align-middle'>
                                                  <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{formato(Answer?.Answer_city['Mod. bajo'])}</p>
                                                </td>
                                                <td className='align-middle'>
                                                  <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{formato(Answer?.Answer_city['Medio'])}</p>
                                                </td>
                                                <td className='align-middle'>
                                                  <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{formato(Answer?.Answer_city['Mod. alto'])}</p>
                                                </td>
                                                <td className='align-middle'>
                                                  <p className='m-0 lh-sm fs-5- ff-monse-regular- fw-normal text-center'>{formato(Answer?.Answer_city['Alto'])}</p>
                                                </td>
                                              </tr>
                                            
                                          </tbody>
                                        </table>
                                      </div>
                                        

                                        </>
                                        
                                        :
                                        <></>
                                        }

                                        </div>
                                        :
                                        <></>
                                        }
                                    
                                    
                                    
                                        
                                    <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                                        <div className='col-auto' style={{width:'100%',display:'flex','justifyContent':'end'}}>
                                            <button onClick={makeInference} className='buttonProduct btn btn-dark-purple- rounded-pill ps-5 pe-5 d-flex flex-row justify-content-center align-items-center align-self-center h-45-' type="button" >
                                                <span className='textButton lh-1 fs-6- ff-monse-regular- fw-semibold' >Evaluar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div> 
                        </div> 
                        </div>
                        
    </div>
  )
}
