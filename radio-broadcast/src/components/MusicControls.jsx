import React, { useState } from "react";
import { Play, Pause, Music } from "react-feather";

const buttonClassName =
    "rounded-lg border-gray-200 bg-slate-700 hover:bg-slate-600 px-6 py-2";

export default function MusicControls({ socket }) {
    const[p,setp]= useState(true)
    const execCommand = (command) => {

        if(command == 'resume'){
            // console.log('playcalled')
            setp(false)
        }else{
            setp(true)
        }
        socket.emit("control", command);
    };

    return (
        <div className="flex flex-col justify-center items-center w-full mt-8">
           
            <div className="flex flex-row justify-center space-x-3">
               {p && <button  type="button"
                    onClick={() => execCommand("resume")}
                    className={buttonClassName} > 
                    <Play size={28} />
                </button>
                }
                {!p && <button 
                    type="button"
                    onClick={() => execCommand("pause")}
                    className={buttonClassName}
                >
                    <Pause size={28} />
                </button>}
               
            </div>

            <h1 className="mt-5" style={{display:'block',}} > Tap to '{p ? 'play' : 'pause' }'  audio track </h1>
            <h1 >Track - <Music style={{display:'inline-block'}} size={20}/> ( Xiaomi remix.. )</h1>
        </div>
    );
}
