import React from "react";
import Root from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Host from "./routes/host";
import Listen from "./routes/listen";
// import { useLocation } from 'react-router-dom';
export function Tej(){

    window.addEventListener("beforeunload",(ev)=>{
       
        // io('http://localhost:3000').emit('delhost');
  })
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root />,
        },
        {
            path: "/host",
            element: <Host />,
        },
        {
            path: "/listen",
            element: <Listen />,
        },
    ]);
return (  
  
      
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
      
    );
    
    
}
