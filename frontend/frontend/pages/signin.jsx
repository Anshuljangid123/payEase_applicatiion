import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");

  console.log("Signin component render");
  const navigateTo = useNavigate();

  const handleRegister =  async(e)=>{
    e.preventDefault();
    try{
        const {data} = await axios.post("http://localhost:3000/api/v1/user/signin" ,{
          email , password
        } , {
            headers:{
                "Content-Type" : "application/json"
            }
        })
        console.log(data);
        alert("user signed in successfully .");

        navigateTo("/Dashboard")
        localStorage.setItem("jwt" , data.token);
        setEmail("");
        setPassword("");
    }
    catch(error){
        console.log(`${error} : error in sign in router`);
        alert("signin failed -> try again ");

    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1c1c1e] rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-semibold text-center">Sign In</h1>
        <p className="text-center text-gray-400">
          Enter your credentials to access your account
        </p>

        <div className="space-y-4">

          <form onSubmit={handleRegister}>
          
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="abcd223@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#2c2c2e] text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>

            <div>
              <label className="block mt-2 mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#2c2c2e] text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black py-2 rounded-lg font-semibold mt-4 hover:bg-gray-300 transition"
            >
              Sign In
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-400 hover:underline">
                Sign up
              </a>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
};
