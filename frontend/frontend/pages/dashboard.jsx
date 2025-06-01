import axios from "axios";
import React, { useEffect, useState } from "react";

export const Dashboard = () => {
  console.log("dashboard component render");
  const [balance , setBalance] = useState(null);

  // for finding the list of matching names of the users 
  const [search , setSearch]  = useState("");
  const [users  , setUsers ] = useState([]);
  const [searchResult , setSearchResult] = useState([]);
  
  useEffect(() =>{
    const fetchBalance = async () =>{
      try{
          const token = localStorage.getItem("jwt")
          const res = await axios.get("http://localhost:3000/api/v1/account/balance" , {
            headers :{
              Authorization : `Bearer ${token}` ,
            },
          });
          setBalance(res.data.balance)   
      }
      catch(error){
        console.log(`error in feching the data ${error}`)
      }
    }

    fetchBalance();
  } , [])

  // want to fetch the names of all the matching names with the search 
  // use debounce to avoid flooding the api request 
  useEffect(() =>{
    const delayDebounce = setTimeout(async() => {
      if(search.trim() != ""){
        await axios.get(`/api/v1/user/fetchUsers?search=${search}`)
          .then(res =>{
            setSearchResult(res.data)
          })
          .catch(err =>{
            console.log(err);
            setSearchResult([]); // no result are fetched if some error occured
          })
      }
      else{
        setSearchResult([]);
      }
    } , 900);
    return () => clearTimeout(delayDebounce);
  },[search])


  return (
    <div className="min-h-screen bg-neutral-950 text-white px-6 py-8">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-10">
        <div className="text-2xl font-semibold tracking-tight">PayTM</div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-400">Hello</span>
          <div className="w-9 h-9 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-bold">
            U
          </div>
        </div>
      </div>

      {/* Balance Section */}
      <div className="text-xl font-medium mb-6">
        Your Balance: <span className="text-green-400 font-semibold">
        ₹{balance != null ? balance.toFixed(2) : "Loding..."}
        </span>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* User Card */}
      {searchResult.length > 0  && (
        <div className="absolute top-full mt-2 bg-neutral-900 rounded-xl shadow-lg w-full max-w-md z-10">
          {searchResult.map((user) =>{
            <div key={user._id} className="px-5 py-3 border-b border-neutral-800 hover:bg-neutral-800 cursor-pointer">
              {user.firstName} {user.lastName}
            </div>
          })}
        </div>

      )}
      
    </div>
  );
};
