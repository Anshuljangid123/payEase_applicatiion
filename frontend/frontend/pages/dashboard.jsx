import axios from "axios";
import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  console.log("dashboard component render");
  const navigate = useNavigate();

  const [balance, setBalance] = useState(null);

  // for finding the list of matching names of the users
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  

  // to fetch the available balance for the user available to do transactions .
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(
          "http://localhost:3000/api/v1/account/balance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBalance(res.data.balance);
      } catch (error) {
        console.log(`error in feching the data ${error}`);
      }
    };

    fetchBalance();
  }, []);

  // want to fetch the names of all the matching names with the search
  // use debounce to avoid flooding the api request

  const fetchUsers = debounce(async (query) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/user/bulk?filter=${query}`
      );
      console.log(res.data);
      setUsers(res.data.user);
    } catch (error) {
      console.log("error in fetching users", error);
    }
  }, 300); // 300 ms debounce rate

  useEffect(() => {
    if (search.length > 0) {
      fetchUsers(search);
    } else {
      setUsers([]);
    }

    return () => fetchUsers.cancel();
  }, [search]); // re run when search changes after 300 ms

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
        Your Balance:{" "}
        <span className="text-green-400 font-semibold">
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

      {users.map((user) => {
        return (
          <div
            key={user._id}
            className="flex items-center justify-between bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center font-semibold text-white text-lg shadow-inner">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div className="text-white font-medium text-base tracking-tight">
                {user.firstName} {user.lastName}
              </div>
            </div>

            <button 
              onClick={() => navigate("/send" , {
                state :{
                  name : user.firstName + " " + user.lastName,
                  userId : user._id
                }
              }) } 
              className="bg-white text-black px-5 py-2 rounded-xl text-sm font-medium hover:bg-neutral-200 transition duration-300 shadow" >
              Send Money
            </button>
          </div>
        );
      })}
    </div>
  );
};
