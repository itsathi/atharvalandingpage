"use client";
import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";

function Footer() {
  const [socialMediaLinks, setSocialMediaLinks] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray("#linkitem").forEach((item: any, i) => {
      gsap.fromTo(
        item as HTMLElement,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          delay: i * 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item as HTMLElement,
            start: "top 80%",
            end: "bottom 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  const iconSize = 20;

  // Match the keys to lowercase field names as received from backend (all lowercase!)
  const socialMediaData = [
    {
      key: "facebook",
      label: "Facebook",
      icon: <Facebook size={iconSize} />,
    },
    {
      key: "instagram",
      label: "Instagram",
      icon: <Instagram size={iconSize} />,
    },
    {
      key: "twitter",
      label: "Twitter",
      icon: <Twitter size={iconSize} />,
    },
    {
      key: "youtubechannel",
      label: "YouTube",
      icon: <Youtube size={iconSize} />,
    },
    {
      key: "youtubevideo",
      label: "YouTube Video",
      icon: <Youtube size={iconSize} />,
    },
  ];

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await axios.get("/api/links");
        setSocialMediaLinks(response.data?.data?.[0] || {}); // Only the first object, which has the keys directly
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        setLoading(false);
        console.error("Error fetching social media links:", err);
      }
    };
    fetchSocialLinks();
  }, []);

  const socialData = socialMediaLinks || {};

  return (
    <footer className="bg-black">
      <div className="p-4 flex flex-col items-center justify-center ">
        <div>
          {loading && <p>Loading social links...</p>}
          {error && <p>Error: {error}</p>}

          {!loading && !error && (
            <ul className="social-media-links flex flex-row gap-4">
              {socialMediaData.map(({ key, label, icon }) => {
                // Handle both string and array formats
                const linkValue = socialData[key];
                let link = linkValue;

                if (Array.isArray(linkValue) && linkValue.length > 0) {
                  link = linkValue[0]; // Extract first URL from array
                }

                // If youtubechannel exists, don't show youtubevideo
                if (key === "youtubevideo" && socialData["youtubechannel"]) {
                  return null;
                }

                if (!link) return null;

                return (
                  <motion.li
                    whileHover={{
                      scale: 1.3,
                      transition: { duration: 0.3 },
                      color: "#6c3082",
                      backgroundColor: "#364141",
                    }}
                    id="linkitem"
                    key={key}
                    className="flex items-center justify-center gap-5 p-2 rounded-lg"
                  >
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={label}
                    >
                      <span>{icon}</span>
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>

        <span className="text-sm mt-4 text-center text-gray-500 hover:text-emerald-700">
          Powered by Athinemmusic
        </span>
        <span className="text-sm mt-4 text-center text-gray-500">
          &copy; {new Date().getFullYear()} All rights reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
