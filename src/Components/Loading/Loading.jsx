import React from 'react';
import ReactLoading from 'react-loading';
import './Loading.css'
const Preloader = ({ type, color }) => (

    <div id="preloader-wrapper">
    <div className="w-auto d-flex flex-column justify-content-center align-items-center align-self-center">
    <ReactLoading  type={type} color={color} height={'100px'} width={'100px'} />
    <div className="txt-loading">
        
        <span data-text-preloader="C" className="letters-loading">
          C
        </span>
        <span data-text-preloader="A" className="letters-loading">
          A
        </span>
        <span data-text-preloader="R" className="letters-loading">
          R
        </span>
        <span data-text-preloader="G" className="letters-loading">
          G
        </span>
        <span data-text-preloader="A" className="letters-loading">
          A
        </span>
        <span data-text-preloader="N" className="letters-loading">
          N
        </span>
        <span data-text-preloader="D" className="letters-loading">
          D
        </span>
        <span data-text-preloader="O" className="letters-loading">
          O
        </span>

      </div>
    </div>
  </div>
    
);
 
export default Preloader;