import './App.css';
import { Navigate,Routes,Route} from 'react-router-dom';
import Lobby from './Router/Lobby/Lobby';
import Maps from './Router/maps/Maps';
import React from 'react';
import Footer from './Components/Footer/Footer';
import Forms from './Router/Forms/Forms';

function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path = '' element={<Navigate to='/Lobby'></Navigate>}></Route>
        <Route path = '/Lobby/*' element={<Lobby></Lobby>}></Route>
        <Route path = '/Maps/*' element={<Maps></Maps>}></Route>
        <Route path = '/Forms/*' element={<Forms></Forms>}></Route>
        <Route path = '*' element={<Navigate to='/Lobby'></Navigate>}></Route>
      </Routes>
    </React.Fragment>
  );
}

export default App;
