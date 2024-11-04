//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, RouterProvider, createRoutesFromElements} from 'react-router'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter,  } from 'react-router-dom'
import Login from './pages/Auth/Login.jsx'
import Home from './pages/Home/Home.jsx'
import Register from './pages/Auth/Register.jsx'
import { Provider } from 'react-redux'
import store from './Redux/store.js'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/login' element={<Login />}/>
      <Route path="/" index={true} element={<Home />}/>
      <Route path='/register' element={<Register />} />
    </Route>
    
    
  )
)


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)