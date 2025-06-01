import React, { useState } from "react";
import axios from "axios"
import {useNavigate} from "react-router-dom";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log("Signup component render");

  const navigateTo = useNavigate();

  const handleRegister = async (e) =>{
    e.preventDefault();
    try{
        const {data} = await axios.post("http://localhost:3000/api/v1/user/signup" ,{
            firstName, lastName , email , password 
        } ,{
            headers:{
                "Content-Type" : "application/json"
            }
        }) 

        console.log(data)
        alert(data.message || "user registerd successfully .");
        navigateTo("/signin");
        localStorage.setItem("jwt" , data.token)
        setUserName("")
        setEmail("")
        setPassword("")
    }
    catch(error){
        console.error("Signup Error:", error.response?.data || error.message);
        alert("signup failed")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1c1c1e] rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-semibold text-center">Signup</h1>
        <p className="text-center text-gray-400">
          Enter your details to get started
        </p>

        <div className="space-y-4">
          <form onSubmit={handleRegister}>
            <div>
              <label className="block mb-1 text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                placeholder="First name"
                className="w-full px-4 py-2 rounded-lg bg-[#2c2c2e] text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm mt-2 font-medium">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#2c2c2e] text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm mt-2 font-medium">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#2c2c2e] text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm mt-2 font-medium">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#2c2c2e] text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>

            <button
              type="submit"
              className="w-full  bg-white text-black py-2 mt-4 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Sign Up
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              Already have an account?{" "}

              <a href="/signin" className="text-blue-400 hover:underline">
                Sign in
              </a>
              
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
