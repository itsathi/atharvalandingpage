import React, { useEffect, useState } from "react";
import { easeOut, motion, spring } from "motion/react";

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
    <div className="w-full h-full flex flex-col">
      <h1 className="px-3 sm:px-4 md:px-6 pt-3 pb-2 text-base sm:text-lg md:text-2xl font-bold text-center">
        Catalog
      </h1>

      <div className="flex-1 flex flex-col gap-2 px-2 sm:px-4 md:px-6 pb-3 overflow-y-auto overflow-x-hidden">
        {tracks.map((track) => (
          <motion.a
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.1, ease: easeOut, type: spring }}
            key={track.id}
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col sm:flex-row items-start sm:items-center p-2 sm:p-3 md:p-4 gap-3 sm:gap-4 rounded-lg hover:bg-white/5 hover:backdrop-blur-xs transition-colors"
          >
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex flex-col gap-0.5 sm:gap-1 md:gap-1.5 items-start justify-center w-full min-w-0">
              <div className="font-bold text-sm sm:text-base md:text-lg text-white truncate w-full">
                {track.name}
              </div>
              
              
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );

}