import React, { useEffect, useState } from "react";
import { anticipate, color, easeInOut, easeOut, motion, spring } from "motion/react";


interface SpotifyTrack {
  id: string;
  name: string;
  album: {
    name: string;
    images: { url: string }[];
  };
  artists: { name: string; id: string }[];
  external_urls: { spotify: string };
}

export default function Catalog() {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/spotify")
      .then((res) => res.json())
      .then((data) => {
        setTracks(data.tracks || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load catalog.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-lg">Loading catalog...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="w-full h-full flex flex-col flex-1">
      <h1 className="p-4">
        Catalog
      </h1>
      {tracks.map((track) => (
        <motion.a
         whileHover={{
          scale:1.01,
      
         }}
         transition={{
          duration:0.1,
          ease:easeOut,
          type:spring
         }}

          key={track.id}
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="flex p-2 gap-5 hover:bg-white/5 hover:backdrop-blur-xs hover:duration-200 "
        >
          <img
          id="trackimage"
            src={track.album.images[0]?.url}
            alt={track.name}
            className=" w-20 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform"
          />
          <div 
          id="textcontainer"
          className="flex flex-col gap-2 items-center justify-center">
          <div className="font-bold text-lg text-white group-hover:text-blue-700 mb-1 text-center">
            {track.name}
          </div>
      

          </div>
        </motion.a>
      ))}
    </div>
  );
}