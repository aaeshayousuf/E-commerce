import {useState} from 'react'
import './navigation.css'
import {Link} from "react-router-dom"
import { House, ShoppingCart, ShoppingBag, Heart } from 'lucide-react';
import { useSelector } from 'react-redux';



const Navigation = () => {

    const {userInfo} = useSelector((state) => state.auth)



    const [showSidebar, setShowSidebar] = useState(false);
    // const [userInfo, setUserInfo] = useState(true)
    const [dropdownOpen, setDropDownOpen] = useState(false);

    // const userInfo = userInfo.isAdmin


    const cartItems = [2,5];
    
    const toggleDropdown = ()=> {
        setDropDownOpen(!dropdownOpen)
    }


  return (
    <div style={{zIndex:9999}} className={`${showSidebar ? "hidden" : "flex"} xl:flex lg:flex md:hidden flex-col justify-between p-4 text-white bg-[#000] w-[4%] hover:w-[15%] h-[100vh] fixed`} id='navigation-container'>
        <div className='hidden md:flex flex-col justify-center space-y-4'>
            
            <div className='flex relative'>
                <Link to='/shop'
                className='flex items-center  transition-transform transform hover:translate-x-2'
                >
                    <House className='mr-2 cursor-pointer mt-[3rem]'/>
                    <span className='hidden cursor-pointer nav-item-name mt-[3rem]'>HOME</span>{" "}
                </Link>
            </div>
            <div className='flex relative'>
                <Link to='/shop'
                className='flex items-center  transition-transform transform hover:translate-x-2'
                >
                    <ShoppingCart className='mr-2 cursor-pointer mt-[3rem]'/>
                    <span className='hidden cursor-pointer nav-item-name mt-[3rem]'>SHOP</span>{" "}
                </Link>
            </div>
            


            <Link to='/cart'
            className='flex items-center  transition-transform transform hover:translate-x-2'
            >
                <div className='flex flex-row gap-2'>
                <ShoppingBag className='cursor-pointer mt-[3rem]'/>
                <span className='hidden cursor-pointer nav-item-name mt-[3rem]'>CART</span>{" "}
                </div>

                <div className='absolute top-9'>
                    {cartItems?.length > 0 && (
                        <span className='px-1 py-0 text-sm text-white bg-pink-500 rounded-full'>
                            {/* {cartItems.reduce((a,c) => a + c.qty,0)} */}2
                        </span>
                    ) }
                </div>
            
            </Link>

            <div className='flex relative'>
                <div className='flex justify-center items-center transition-transform transform hover:translate-x-2'>
                    <Heart className='mr-2 cursor-pointer mt-[3rem]'/>
                    <span className='hidden nav-item-name cursor-pointer mt-[3rem]'>Favorites</span> {" "}

                </div>

            </div>

        </div>

        <div className='relative'>
            <button onClick={toggleDropdown} className='flex items-center text-gray-700 focus:outline-none'>
                {
                    userInfo ? (
                        <span className='text-white'>{userInfo.username}</span>
                    ):(
                        <></>
                    )
                }
                {userInfo && (
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ml-1 ${
                      dropdownOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                )}


            </button>

            {dropdownOpen && userInfo && (
                <ul className={`absolute right-0 mt-2 space-y-2 bg-white text-gray-600 ${
                !userInfo.isAdmin ? "-top-20" : "-top-80"}`}>

                    {userInfo.isAdmin && (
                        <>
                        <li>
                        Dashboard
                    </li>
                    <li>
                        Products
                    </li>
                        </>
                    )}
                    

                </ul>
            )}

        </div>



    </div>
  )
}

export default Navigation