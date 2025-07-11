import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const SendMoney = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {name , userId} = location.state || {} ;
  const [amount  , setAmount] = useState("");

  const initials = name 
      ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
      :  "??";
      
      
  console.log("sendMoney component render.......");

  const handleTransfer = async () =>{
    if(!amount || amount <= 0 ){
      alert("please enter the valid amount");
    }
    try{
      const token = localStorage.getItem("jwt");
      const res = await axios.post("http://localhost:3000/api/v1/account/transfer" ,{
        amount : Number(amount),
        to : userId
      },{
        headers : {
          Authorization : `Bearer ${token}`,
        }
      });
      alert(res.data.message);
      navigate("/dashboard");
    }
    catch(error){
      console.log("transfer error : " , error);
      alert( error?.response?.data?.message || "transfer failed try again ")
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="bg-neutral-900 text-white rounded-3xl shadow-xl p-10 w-full max-w-md transition-all duration-300 ease-in-out">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-center mb-8 tracking-tight">
          Send Money
        </h1>

        {/* Recipient */}
        <div className="flex items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold shadow-md">
            {initials}
          </div>
          <div className="ml-4 text-xl font-medium">{name || "Unknown"}</div>
        </div>

        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Amount (in ₹)
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleTransfer}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold tracking-wide shadow-md transition duration-200"
        >
          Initiate Transfer
        </button>
      </div>
    </div>
  );
};
