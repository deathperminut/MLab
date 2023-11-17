import React from 'react'
import {useNavigate} from 'react-router-dom';
import logo from '../../img/logo.png'
import './Navbar.css'

export default function Navigationbar() {
  
    const navigate=useNavigate();
  
  
    return (
      <div className="Navbar" >
        <img src={logo} onClick={()=>navigate('/Lobby')} style={{cursor:'pointer'}} alt = 'jaivana logo' className='logo'></img>
      </div>
    )
  }