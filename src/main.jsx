import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import React, { useState, useMemo, useEffect } from 'react'
import Header from './components/header/Header'
import Sidebar from './components/sidebar/Sidebar'
import  Home  from '../src/pages/Home'
import VideoCard from './components/video/VideoCard'
import WatchPage from './pages/WatchPage'
import Login from './pages/Login'
import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider} from 'react-router'
import Layout  from './layout/Layout'
import { Provider } from 'react-redux'
import store from './Store/Store'
import VideoPlayer from './components/video/VideoPlayer'
import SearchFilters  from './components/Filter'
import SearchPage from './pages/SearchPage'
import authService from '../Service/auth'
import { login } from './Store/authSlice'
import PrivateRoute from './middleware/PrivateRoute'
import History from './pages/History.jsx'
import SidebarVideos from './components/video/SidebarVideos.jsx'
import CommentsSection from './components/CommentsSection.jsx'
import HeaderContextProvider from './components/context/HeaderContextProvider.jsx'
import SignUp from './pages/SignUp.jsx'
import CreatePost from './pages/CreatePost.jsx'
import UserVideos from './pages/UserVideos.jsx'
import ChannelDashboard from './pages/ChannelDashboard.jsx'
import EditVideoForm from './pages/EditVideoForm.jsx'





  const router = createBrowserRouter([
    {
      path: '/',
      element:  <App/>,
      children:[
        {
          path:'/',
          element:<Login/>
        },
        {
          path:'/signUp',
          element:<SignUp/>
        },
        {
          path:'/Home',
          element:
            <PrivateRoute>
             
                  <Home/> 

            
            </PrivateRoute>
        },
        {
          path:"/video/:videoId",
          element:
            <PrivateRoute>
              <div className='w-full flex flex-row'>
                 <WatchPage/>
              </div>
            </PrivateRoute>
        },
        {
          path:'/SearchPage',
          element:<SearchPage/>
        },
        {
          path:'/History',
          element:
            <PrivateRoute>
              <>
                  <History/> 

              </>
            </PrivateRoute>
        },
         {
          path:'/CreatePost',
          element:
            <PrivateRoute>
              <>
                  <CreatePost/> 
              </>
            </PrivateRoute>
        },
         {
          path:'/userVideos',
          element:
            <PrivateRoute>
              <>
                  <UserVideos/> 

              </>
            </PrivateRoute>
        },
         {
          path:'/channeldashboard',
          element:
            <PrivateRoute>
              <>
                  <ChannelDashboard/> 
              </>
            </PrivateRoute>
        },
         {
          path:'/editvideo/:id',
          element:
            <PrivateRoute>
              <>
                  <EditVideoForm/> 
              </>
            </PrivateRoute>
        },
      ]
    }
  ])



createRoot(document.getElementById('root')).render(
  

  
    <Provider store ={store}>
      <HeaderContextProvider>
      <RouterProvider router = {router}/>
      </HeaderContextProvider>
    </Provider>
,
)
