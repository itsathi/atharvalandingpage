"use client";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { anticipate, easeInOut, motion } from "motion/react";
import { Lora, Space_Grotesk } from "next/font/google";
import { resolve } from "path";

export const inter = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const playfair = Lora({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["700"],
});




function Links() {
  const [links, setLinks] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const linkItems = [
    {
      key: "spotify",
      label: "Spotify",
      icon: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg",
    },
    {
      key: "applemusic",
      label: "Apple Music",
      icon: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Apple_Music_icon.svg",
    },
    {
      key: "itunes",
      label: "iTunes",
      icon: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
    {
      key: "bandcamp",
      label: "Bandcamp",
      icon: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Bandcamp-button-circle-whitecolor.svg",
    },
  ];

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get("/api/links");
        setLinks(response.data);
      } catch (err) {
        setError("Failed to fetch links");
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  // Assume that the links are stored in response.data.data[0]
  const fetchedLinks = (links as any)?.data?.[0] || {};

  return (
    <div className={`${inter.variable} ${playfair.variable}w-full h-full flex flex-col flex-1`}>


<h1
  className="font-lora font-semibold text-purple-100 p-5 tracking-tight text-2xl mb-4"
  style={{ fontFamily: "var(--font-lora), sans-serif" }}
>
  Latest Releases
</h1>
  
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <ul className="grid grid-rows-4 w-full h-full divide-y divide-white/20">

        {linkItems.map(({ key, label, icon }) => {
          const linkUrl = fetchedLinks[key];
          if (!linkUrl) return null;
      
          return (
            <motion.li
             whileHover={{
              scale:1.03,
              
             }}
            transition={{
              duration:0.2,
              ease:easeInOut
            }}

            key={key} 
            className="h-full w-full p-5  hover:bg-white/5 hover:backdrop-blur-xs hover:duration-200 ">
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center h-full p-2 gap-2  "
              >
                <img src={icon} className="w-6 h-6" />
                <span className="text-white text-lg">{label}</span>
              </a>
            </motion.li>
          );
        })}
      </ul>
      
      )}
    </div>
  )
}

export default Links