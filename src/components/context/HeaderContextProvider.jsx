import React, { useState } from "react";
import HeaderContext from "./HeaderContext";

const HeaderContextProvider = ({children}) =>{

    const [inputvalue,setinputvalue] = useState("wallpaper")
    const [sidebarOpen,setSidebarOpen] = useState(false)

    return(
        <HeaderContext.Provider value ={{inputvalue,setinputvalue,sidebarOpen,setSidebarOpen}}>
        {children}
        </HeaderContext.Provider>
    )   
}

export default HeaderContextProvider