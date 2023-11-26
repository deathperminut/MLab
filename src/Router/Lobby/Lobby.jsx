import React from 'react'
import './Lobby.css'
import Navigationbar from '../../Components/Navbar/Navbar';
import Fondo from '../../img/ya.jpeg';
import Logo  from  '../../img/LogoLobby.png';
import { TiCancelOutline } from "react-icons/ti";
import '../../index.css';
import {useNavigate} from 'react-router-dom';
import { GiColombia } from 'react-icons/gi';
import Swal from 'sweetalert2';
import Icon from '../../Components/logo/logo';
import Map from '../../Components/Map/Map';
import FormIcon from '../../Components/Icon/form';

export default function Lobby() {

  
  /* NAVIGATE */

  const navigate=useNavigate();


  const redirect=(type)=>{
    navigate('/Maps')
  }

  const seeAlert=()=>{
    Swal.fire({
        icon: 'info',
        text:"Aún esta en desarrollo...",
    })
  }


  return (
        <>
            <div className='body' style={{display:'flex',justifyContent:'center'}}>
                <Navigationbar></Navigationbar>
                <div style={{width:'100%',minHeight:'100%',display:'flex',flexDirection:'column'}}>
                <div className='carouselBody font' style={{backgroundImage: `url(${Fondo})`,backgroundSize:'cover'}} >
                    <div className='icon_image' >
                        <Icon width={'1060'} height={'504'}></Icon>
                    </div>
                    <p className='font description'>Decisiones que dan frutos</p>
                    
                    <div className='cardsContainer_'>
                    <div class="icon-scroll" style={{position:'relative'}}></div>
                    </div>
                    <div className='cardsContainer'>
                            <div onClick={()=> redirect()} className='card_' style={{opacity:1,cursor:'pointer'}}>
                                  <div className='box_icon'>
                                    <Map style={{width:'80',height:'80'}} width={80} height={80} color='white'/>
                                  </div>
                                  <p className='textCard_2 nova' style={{fontSize:'20px'}}>FERTILIDAD</p>
                                  <p className='textCard_3 nova' style={{fontSize:'20px'}}>DE SUELOS</p>
                                  <p className='textCard nova' style={{fontSize:'14px'}}>Información en tiempo real</p>    
                            </div>
                            <div onClick={()=> navigate('/Forms')} className='card_' style={{opacity:1,cursor:'pointer'}}>
                                  <div className='box_icon'>
                                    <FormIcon style={{width:'80',height:'80'}} width={80} height={80} color='white'/>
                                  </div>
                                  <p className='textCard_2 nova' style={{fontSize:'20px'}}>MÓDULO DE</p>
                                  <p className='textCard_3 nova' style={{fontSize:'20px'}}>FORMULARIOS</p>
                                  <p className='textCard nova' style={{fontSize:'14px'}}>Información en tiempo real</p>    
                            </div>
                    </div>
                </div>
                </div>
                
            </div>
        </>
    
  )
}
