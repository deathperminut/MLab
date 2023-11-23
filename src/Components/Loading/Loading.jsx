import React from 'react';
import ReactLoading from 'react-loading';
import './Loading.css'
import Charger from '../Charger/Charger';
const Preloader = ({ type, color }) => (

    <div id="preloader-wrapper">
    <div className="w-auto d-flex flex-column justify-content-center align-items-center align-self-center">
    {/* <ReactLoading  type={type} color={color} height={'100px'} width={'100px'} /> */}
    <div className='icon_image' >
        <Charger></Charger>
    </div>
    </div>
  </div>
    
);
 
export default Preloader;