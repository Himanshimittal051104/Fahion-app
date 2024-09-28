"use client"
import React from 'react'
import { useSession,signIn,signOut } from 'next-auth/react'

const page = () => {
  return (
    <div >
    <button  onClick={()=>{signIn("email")}}>Continue With Email</button>
    </div>
  )
}

export default page
