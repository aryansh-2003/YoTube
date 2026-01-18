import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import  Home  from '../src/pages/Home'
import WatchPage from './pages/WatchPage'
import Login from './pages/Login'
import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider} from 'react-router'
import { Provider } from 'react-redux'
import store from './Store/Store'
import SearchPage from './pages/SearchPage'
import PrivateRoute from './middleware/PrivateRoute'
import History from './pages/History.jsx'
import HeaderContextProvider from './components/context/HeaderContextProvider.jsx'
import SignUp from './pages/SignUp.jsx'
import CreatePost from './pages/CreatePost.jsx'
import UserVideos from './pages/UserVideos.jsx'
import ChannelDashboard from './components/ChannelDashboard.jsx'
import EditVideoForm from './pages/EditVideoForm.jsx'
import ChannelPage from './pages/ChannelPage.jsx'
import SubscriptionPage from './pages/SubscriptionPage.jsx'
import PlaylistPage from './pages/PlaylistPage.jsx'
import PlaylistVideos from './pages/PlaylistVideos.jsx'
import LikedVideos from './pages/LikedVideos.jsx'
import UserSubscriberPage from './pages/UserSubscriberPage.jsx'
import NotFound from './pages/NotFound.jsx'
import Tweets from './pages/Tweets.jsx'





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
        {
          path:'/channel/:username',
          element:
            <PrivateRoute>
              <>
                  <ChannelPage/> 
              </>
            </PrivateRoute>
        },
        {
          path:'/subscription',
          element:
            <PrivateRoute>
              <>
                  <SubscriptionPage/> 
              </>
            </PrivateRoute>
        },
        {
          path:'/playlists',
          element:
            <PrivateRoute>
              <>
                  <PlaylistPage/> 
              </>
            </PrivateRoute>
        },
          {
          path:'/playlistvideos/:playlistid',
          element:
            <PrivateRoute>
              <>
                  <PlaylistVideos/> 
              </>
            </PrivateRoute>
        },
         {
          path:'/liked-videos',
          element:
            <PrivateRoute>
              <>
                  <LikedVideos/> 
              </>
            </PrivateRoute>
        },
        {
          path:'/user-subscriber/:userId',
          element:
            <PrivateRoute>
              <>
                  <UserSubscriberPage/> 
              </>
            </PrivateRoute>
        },
        {
          path:'/under-construction',
          element:
            <PrivateRoute>
              <>
                  <NotFound/> 
              </>
            </PrivateRoute>
        },
        {
          path:'/Tweets',
          element:
            <PrivateRoute>
              <>
                  <Tweets/> 
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
