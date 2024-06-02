import { useState } from "react"

export function Already(){
   const [loading,setloading] =  useState('loadings....')

    setTimeout(()=>{
       setloading('Already Host exsist, you have been redireting to main');
    },100)
    setTimeout(()=>{
        window.location.href = "/";
       },1000)


    return (<>
       <h1> {loading}</h1>
    </>)
}

