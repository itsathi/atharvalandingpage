import React from 'react'
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LampContainer } from "@/components/ui/lamp";


gsap.registerPlugin(ScrollTrigger);

// for getting pics via cloudinary 

type SlotData = {
    public_id?: string;
    url?: string;
    updatedAt?: string;
  };
  
  type SlotsResponse = {
    [key: string]: string | { url: string }; // each slot can be a direct URL string or an object with a url property
  };
  





function card() {
  
    const [slots, setSlots] = useState<SlotsResponse>({});
    const [content,setcontent]=useState();


    useEffect(() => {
        const fetchSlots = async () => {
          try {
            const res = await fetch("/api/slots");
            if (!res.ok) return;
            const data = await res.json();
            // directly store the document in state
            setSlots(data);
          } catch (err) {
            console.error("Error fetching image slots", err);
          }
        };
        fetchSlots();
      }, []);


      useEffect(() => {
        const fetchcontent = async () => {
          try {
            const res = await fetch("/api/content");
            if (!res.ok) return;
            const data = await res.json();
            // directly store the document in state
            setcontent(data);
          } catch (err) {
            console.error("Error fetching image slots", err);
          }
        };
        fetchcontent();
      }, []);




  return (
    <div>   
      <div className=" border-purple-800 rounded-3xl overflow-hidden border-3">
      {slots.lamp && (
               <div 
                 className=" w-50 h-50  bg-white/50 flex items-center  justify-center overflow-hidden ring-2 ring-white/75 "
                 style={{
                   boxShadow: "0 0 10px 2px rgba(0,0,0,0.2)"
                 }}
               >
                 <img
                   src={typeof slots.lamp === "string" ? slots.lamp : slots.lamp?.url}
                   alt="Logo"
                   className="object-cover w-full h-full "
                 />
               </div>
             )}
      </div>
      
    
    
    </div>
  )
}

export default card