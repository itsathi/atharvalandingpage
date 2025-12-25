"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Lora, Space_Grotesk } from "next/font/google";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export const inter = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "700"]
});

export const playfair = Lora({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["700"]
});

// Minimal modern video embed
function ResponsiveYoutubeEmbed({ src }: { src: string }) {
  return (
    <div className="w-full aspect-video rounded-xl shadow bg-neutral-100 dark:bg-neutral-900 overflow-hidden border border-neutral-200 dark:border-neutral-800">
      <iframe
        src={src}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="w-full h-full"
        style={{ minHeight: 220, background: "transparent" }}
      />
    </div>
  );
}

type YoutubeVideo = {
  title: string;
  src: string;
};

export function Youtube() {
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fallbackVideos: YoutubeVideo[] = [
    {
      title: "Levitate Objects With Sound - Acoustic Levitation Explained",
      src: "https://www.youtube.com/embed/7rs6uV4pMFk?si=dMGuROxgPaRhne0m"
    },
    {
      title: "Joker and the Queen",
      src: "https://www.youtube.com/embed/AEQibwaokLE?si=duCLtv7MsDw6aj3M"
    },
    {
      title: "The Science Behind Things Floating in Air",
      src: "https://www.youtube.com/embed/s4jT3KRK7R4?si=N14qGMtGRBExCUsz"
    }
  ];

  useEffect(() => {
    const fetchYoutubeLinks = async () => {
      try {
        const res = await axios.get("/api/links");
        const items: any[] = Array.isArray(res.data?.data) ? res.data.data : [];

        const toEmbedUrl = (url: string) => {
          if (!url) return url;
          if (url.includes("youtube.com/embed/")) return url;
          let videoId = "";
          try {
            if (url.includes("youtu.be/")) {
              videoId = url.split("youtu.be/")[1].split(/[?&]/)[0];
            } else if (url.includes("youtube.com/watch")) {
              const params = new URL(url).searchParams;
              videoId = params.get("v") || "";
            }
          } catch {
            return url;
          }
          return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        };

        let links: string[] = [];
        items.forEach((item) => {
          if (item?.youtubevideo) {
            if (typeof item.youtubevideo === "string" && item.youtubevideo.trim()) {
              links.push(item.youtubevideo);
            }
            if (Array.isArray(item.youtubevideo)) {
              links.push(
                ...item.youtubevideo.filter((v: any) => typeof v === "string" && v.trim())
              );
            }
          }
        });

        if (links.length === 0 && items[0]?.youtubevideo) {
          if (typeof items[0].youtubevideo === "string") {
            links = [items[0].youtubevideo];
          } else if (Array.isArray(items[0].youtubevideo)) {
            links = items[0].youtubevideo.filter((v: any) => typeof v === "string");
          }
        }

        const videos: YoutubeVideo[] = links.map((link, idx) => ({
          title: `Video ${idx + 1}`,
          src: toEmbedUrl(link)
        }));

        setYoutubeVideos(videos.length > 0 ? videos : fallbackVideos);
      } catch {
        setYoutubeVideos(fallbackVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchYoutubeLinks();
  }, []);

  const goToPreviousVideo = () => {
    setCurrentVideoIndex((prev) =>
      prev === 0 ? youtubeVideos.length - 1 : prev - 1
    );
  };

  const goToNextVideo = () => {
    setCurrentVideoIndex((prev) =>
      prev === youtubeVideos.length - 1 ? 0 : prev + 1
    );
  };

  // Modern minimal glass card
  const glassCard =
    "border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 shadow-lg " +
    "rounded-2xl px-5 py-10 sm:px-8 sm:py-14 flex items-center justify-center";
  const containerPad = "flex w-full justify-center items-center py-10 sm:py-16";

  if (loading) {
    return (
      <CardContainer className={containerPad}>
        <CardBody className={glassCard}>
          <span
            className={`text-neutral-600 dark:text-neutral-200 text-lg font-medium tracking-wide ${inter.variable} font-sans`}
          >
            Loading...
          </span>
        </CardBody>
      </CardContainer>
    );
  }

  if (youtubeVideos.length === 0) {
    return (
      <CardContainer className={containerPad}>
        <CardBody className={glassCard}>
          <span
            className={`text-neutral-600 dark:text-neutral-200 text-lg font-medium tracking-wide ${inter.variable} font-sans`}
          >
            No YouTube videos found.
          </span>
        </CardBody>
      </CardContainer>
    );
  }

  return (
    <CardContainer className={containerPad}>
      <CardBody className={glassCard + " relative max-w-xl w-full"}>
        <div className="flex flex-col items-center w-full gap-6 sm:gap-8">
          {/* Modern minimal title */}
          <CardItem
            translateZ="35"
            className={`text-center ${inter.variable} font-sans text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2`}
            style={{
              letterSpacing: "0.01em"
            }}
          >
            {youtubeVideos[currentVideoIndex].title}
          </CardItem>

          {/* Responsive Video */}
          <CardItem translateZ="55" className="w-full">
            <ResponsiveYoutubeEmbed src={youtubeVideos[currentVideoIndex].src} />
          </CardItem>

          {/* Modern Pagination Controls */}
          <div className="flex flex-row justify-between items-center gap-6 mt-2 w-full">
            <CardItem translateZ="10">
              <button
                onClick={goToPreviousVideo}
                className="group px-3 h-10 w-10 flex items-center justify-center rounded-lg
                  border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800
                  hover:bg-neutral-200 dark:hover:bg-neutral-700 transition focus:outline-none disabled:opacity-40"
                aria-label="Previous video"
                disabled={youtubeVideos.length <= 1}
              >
                <svg
                  className="text-neutral-500 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white"
                  width="22"
                  height="22"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 16l-4-4 4-4" />
                </svg>
              </button>
            </CardItem>

            <div
              className={`text-base font-semibold ${inter.variable} font-sans text-neutral-800 dark:text-neutral-100 px-4 py-1 rounded bg-white/70 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700`}
            >
              {currentVideoIndex + 1}
              <span className="mx-1 text-neutral-400 dark:text-neutral-500">/</span>
              {youtubeVideos.length}
            </div>

            <CardItem translateZ="10">
              <button
                onClick={goToNextVideo}
                className="group px-3 h-10 w-10 flex items-center justify-center rounded-lg
                  border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800
                  hover:bg-neutral-200 dark:hover:bg-neutral-700 transition focus:outline-none disabled:opacity-40"
                aria-label="Next video"
                disabled={youtubeVideos.length <= 1}
              >
                <svg
                  className="text-neutral-500 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white"
                  width="22"
                  height="22"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 16l4-4-4-4" />
                </svg>
              </button>
            </CardItem>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
}
