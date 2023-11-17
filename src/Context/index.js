import React from 'react'

const AppContext = React.createContext();


function ProviderContext(props){

    /* ESTADOS */
    
    let [data,setData]  = React.useState(null);

    return (
        
        <AppContext.Provider value={{data,setData}}>
            {props.children}
        </AppContext.Provider>
        
    
    );
}

export {ProviderContext,AppContext};
