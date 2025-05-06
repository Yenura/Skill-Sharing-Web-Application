import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import { AUTH_ENDPOINTS } from '../../config/apiConfig';
import { useToast } from '../common/Toast';
import  backgroundImage from '../../assets/logobg.jpg';

const Auth = () => {
    const [isActive, setIsActive] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ 
        firstName: '',
        lastName: '',
        username: '', 
        email: '', 
        password: '',
        role: 'BEGINNER'
    });
    const navigate = useNavigate();
    const { addToast } = useToast();

    const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "email": loginData.email,
                    "password": loginData.password
                }),
            });

            let data;
            try {
                data = await response.json();
            } catch (error) {
                // If the response is not JSON, create a fallback error object
                data = { message: `Error: ${response.status} ${response.statusText}` };
            }

            if (response.ok) {
                localStorage.setItem('token', data.token);
                addToast('Login successful!', 'success');
                navigate('/Profile');
            } else {
                addToast(data.message || 'Login failed. Please check your credentials.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            addToast('An error occurred during login. Please try again.', 'error');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            let data;
            try {
                data = await response.json();
            } catch (error) {
                // If the response is not JSON, create a fallback error object
                data = { message: `Error: ${response.status} ${response.statusText}` };
            }

            if (response.ok) {
                addToast('Registration successful! Please login.', 'success');
                setIsActive(false); // Switch back to login form
            } else {
                addToast(data.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            addToast('An error occurred during registration. Please try again.', 'error');
        }
    };

    return (
        <div style={containerStyle } >
            {/* No more AlertMessage component */}
            
            <div className="relative w-[850px] h-[550px] bg-white m-5 rounded-3xl shadow-lg overflow-hidden">
                {/* Login Form Box */}
                <div className={`absolute w-1/2 h-full bg-white flex items-center text-gray-800 text-center p-10 z-10 transition-all duration-700 ease-in-out ${isActive ? 'opacity-0 pointer-events-none right-1/2' : 'opacity-100 right-0'}`}>
                    <form onSubmit={handleLoginSubmit} className="w-full">
                        <h1 className="text-4xl -mt-2.5 mb-0">Login</h1>
                        <div className="relative my-7">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                required
                                value={loginData.email}
                                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium"
                            />
                            <i className='bx bxs-envelope absolute right-5 top-1/2 transform -translate-y-1/2 text-xl'></i>
                        </div>
                        <div className="relative my-7">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                required
                                value={loginData.password}
                                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium"
                            />
                            <i className='bx bxs-lock-alt absolute right-5 top-1/2 transform -translate-y-1/2 text-xl'></i>
                        </div>
                        <div className="-mt-4 mb-4">
                            <a href="#" className="text-sm text-gray-800">Forgot Password?</a>
                        </div>
                        <button type="submit" 
                                className="w-full h-12 rounded-lg shadow-md border-none cursor-pointer text-base text-white font-semibold bg-DarkColor">
                            Login
                        </button>
                        <p className="text-sm my-4">or login with social platforms</p>
                        <div className="flex justify-center">
                            <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-2xl text-gray-800 mx-2"><i className='bx bxl-google'></i></a>
                            <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-2xl text-gray-800 mx-2"><i className='bx bxl-facebook'></i></a>
                            <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-2xl text-gray-800 mx-2"><i className='bx bxl-github'></i></a>
                            <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-2xl text-gray-800 mx-2"><i className='bx bxl-linkedin'></i></a>
                        </div>
                    </form>
                </div>

                {/* Register Form Box */}
                <div className={`absolute w-[450px] min-h-[90vh] h-auto bg-white flex items-center text-gray-800 text-center p-10 z-10 transition-all duration-700 ease-in-out ${isActive ? 'opacity-100 left-0' : 'opacity-0 pointer-events-none right-0'}`}>
                    <form onSubmit={handleRegisterSubmit} className="w-full">
                        <h1 className="text-4xl -mt-2.5 mb-0">Registration</h1>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="First Name" 
                                    value={registerData.firstName}
                                    onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                                    className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium"
                                />
                                <i className='bx bx-user absolute right-5 top-1/2 transform -translate-y-1/2 text-xl'></i>
                            </div>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Last Name" 
                                    value={registerData.lastName}
                                    onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                                    className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium"
                                />
                                <i className='bx bx-user absolute right-5 top-1/2 transform -translate-y-1/2 text-xl'></i>
                            </div>
                        </div>
                        <div className="relative my-5">
                            <input 
                                type="text" 
                                placeholder="Username" 
                                required
                                value={registerData.username}
                                onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium"
                            />
                            <i className='bx bx-at absolute right-5 top-1/2 transform -translate-y-1/2 text-xl'></i>
                        </div>
                        <div className="relative my-5">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                required
                                value={registerData.email}
                                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium"
                            />
                            <i className='bx bxs-envelope absolute right-5 top-1/2 transform -translate-y-1/2 text-xl'></i>
                        </div>
                        <div className="relative my-5">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                required
                                value={registerData.password}
                                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base text-gray-800 font-medium"
                            />
                            <i className='bx bxs-lock-alt absolute right-5 top-1/2 transform -translate-y-1/2 text-xl'></i>
                        </div>
                        <button type="submit" 
                                className="w-full h-12 rounded-lg shadow-md border-none cursor-pointer text-base text-white font-semibold bg-DarkColor mt-2">
                            Register
                        </button>
                        <p className="text-sm my-4">or register with social platforms</p>
                        <div className="flex justify-center">
                            <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-2xl text-gray-800 mx-2"><i className='bx bxl-google'></i></a>
                            <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-2xl text-gray-800 mx-2"><i className='bx bxl-facebook'></i></a>
                            <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-2xl text-gray-800 mx-2"><i className='bx bxl-github'></i></a>
                            <a href="#" className="inline-flex p-2.5 border-2 border-gray-300 rounded-lg text-2xl text-gray-800 mx-2"><i className='bx bxl-linkedin'></i></a>
                        </div>
                    </form>
                </div>

                {/* Toggle Box with sliding background */}
                <div className="absolute w-full h-full">
                    {/* This creates the sliding background */}
                    <div className="absolute w-full h-full overflow-hidden">
                        <div className={`absolute w-[300%] h-full rounded-[150px] transition-all duration-[1.8s] ease-in-out transform ${isActive ? 'left-[calc(-50%+850px)]' : '-left-[250%]'} bg-SecondaryColor`}>
                        </div>
                    </div>

                    {/* Left panel - visible when not active */}
                    <div className={`absolute left-0 w-1/2 h-full flex flex-col justify-center items-center z-20 transition-all duration-700 ease-in-out ${isActive ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'} text-ExtraDarkColor`}>
                        <h1 className="text-4xl">Hello, Welcome!</h1>
                        <p className="mb-5 text-sm">Don't have an account?</p>
                        <button 
                            className="w-40 h-[46px] bg-transparent rounded-lg font-semibold border-2 border-ExtraDarkColor text-ExtraDarkColor"
                            onClick={() => setIsActive(true)}
                        >
                            Register
                        </button>
                    </div>

                    {/* Right panel - visible when active */}
                    <div className={`absolute right-0 w-1/2 h-full flex flex-col justify-center items-center z-20 transition-all duration-700 ease-in-out ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'} text-ExtraDarkColor`}  style={{ left: '55%' }} >
                        <h1 className="text-4xl">Welcome Back!</h1>
                        <p className="mb-5 text-sm">Already have an account?</p>
                        <button 
                            className="w-40 h-[46px] bg-transparent rounded-lg font-semibold border-2 border-ExtraDarkColor text-ExtraDarkColor"
                            onClick={() => setIsActive(false)}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        
        </div>
    );
};

export default Auth;
