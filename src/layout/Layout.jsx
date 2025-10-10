import React, { useContext } from 'react'
import { Header, Sidebar } from '../components'
import { Outlet } from 'react-router'
import HeaderContext from "../components/context/HeaderContext";

function Layout() {

  const { sidebarOpen } = useContext(HeaderContext);
  
  return (
    <div>
        <Header/>
        <div className='w-full flex flex-col pt-10'>
        <div className='ml-[3%]'>
        <Outlet/>
        </div>
        <Sidebar/>
        </div>
    </div>
  )
}

export default Layout