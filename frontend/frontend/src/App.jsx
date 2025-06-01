import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from 'react'
import { Signup } from '../pages/signup'
import { Signin } from '../pages/signin'
import { Dashboard } from '../pages/dashboard'
import { SendMoney } from '../pages/send_money'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/send" element={<SendMoney/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
