import React from 'react'
import './Lobby.css'
import Navigationbar from '../../Components/Navbar/Navbar';
import Fondo from '../../img/Langing_2.png';
import { TiCancelOutline } from "react-icons/ti";
import '../../index.css';
import {useNavigate} from 'react-router-dom';
import { GiColombia } from 'react-icons/gi';
import Swal from 'sweetalert2';

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
                <div className='carouselBody font' style={{backgroundImage: `url(${Fondo})`,backgroundSize:'cover'}}>
                    
                    <p className='font title ' id='dropdown-basic'>Multilab Agroanalítica</p>
                    <p className='font description'>Laboratorio de análisis fisicoquímico de suelos, foliares, fertilizantes y enmiendas.</p>
                    <div className='cardsContainer_'>
                    <div class="icon-scroll" style={{position:'relative'}}></div>
                    </div>
                    <div className='cardsContainer'>
                            <div onClick={()=> redirect()} className='card_' style={{opacity:1,cursor:'pointer'}}>
                                  <div className='box_icon'>
                                    <GiColombia style={{width:'60',height:'60'}} width={50} height={50} color='white'/>
                                  </div>
                                  <p className='textCard_2'>Mapa de indicadores</p>
                                  <p className='textCard'>Accede e informate en tiempo real.</p>    
                            </div>
                            <div className='card_' style={{opacity:1,cursor:'pointer'}} onClick={seeAlert}>
                            <div className='box_icon'>
                                    <TiCancelOutline style={{width:'60',height:'60'}} width={50} height={50} color='white'/>
                                  </div>
                                  <p className='textCard_2'>En desarrollo</p>
                                  <p className='textCard'>Pronto estara disponible.</p>
                            
                                
                            </div>
                            <div className='card_' style={{opacity:1,cursor:'pointer'}} onClick={seeAlert}>
                                  <div className='box_icon'>
                                    <TiCancelOutline style={{width:'60',height:'60'}} width={50} height={50} color='white'/>
                                  </div>
                                  <p className='textCard_2'>En desarrollo</p>
                                  <p className='textCard'>Pronto estara disponible.</p>    
                                
                            </div>
                    </div>
                </div>
                </div>
                
            </div>
        </>
    
  )
}
