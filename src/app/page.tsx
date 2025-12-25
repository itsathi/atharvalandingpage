"use client";
import Image from "next/image";
import Footer from "@/components/footer";
import { Youtube } from "@/components/Youtube";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import Catalog from "@/components/catalog";
import Links from "@/components/Links";
import { motion } from "motion/react";
import { LampContainer } from "@/components/ui/lamp";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Container, Heading, Section } from "lucide-react";
// ---- >>> Use visually distinctive fonts
import { Lora, Space_Grotesk } from "next/font/google";
import { resolve } from "path";
import Preloader from "@/components/Preloader";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { getSlots, getContent, getLinks, getSpotify } from "@/lib/api";

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

// ScrollSmoother could be enabled for even smoother experience, but not included here for compatibility
gsap.registerPlugin(ScrollTrigger);

type SlotData = {
  public_id?: string;
  url?: string;
  updatedAt?: string;
};

type SlotsResponse = {
  [key: string]: string | { url: string };
};

type ContentItem = {
  _id: string;
  title: string;
  body: string;
  aboutbio: string;
  aboutcard1: string;
  aboutcard2: string;
  __v: number;
};

type ContentResponse = {
  contents: ContentItem[];
};

// Helper for safer image slot fetching
function getSlotUrl(
  slot: string | { url: string } | undefined
): string | undefined {
  if (!slot) return undefined;
  if (typeof slot === "string") return slot;
  if (typeof slot === "object" && "url" in slot && typeof slot.url === "string")
    return slot.url;
  return undefined;
}

export default function Home() {
  const [slots, setSlots] = useState<SlotsResponse>({});
  const [toggle, setToggle] = useState(false);
  const [content, setcontent] = useState<ContentResponse | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showPreloader, setShowPreloader] = useState(true);

  // Track loading states for different data sources
  const [slotsLoaded, setSlotsLoaded] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [linksLoaded, setLinksLoaded] = useState(false);
  const [spotifyLoaded, setSpotifyLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // GSAP sticky pin refined for smooth pinning between cards
  useGSAP(
    () => {
      // Clear previous triggers
      ScrollTrigger.getAll().forEach((t) => t.kill());

      // Set initial 3D perspective on container
      gsap.set(container.current, {
        perspective: 1500,
        transformStyle: "preserve-3d",
      });

      const cards = gsap.utils.toArray<HTMLElement>(".sticky-card");
      if (cards.length < 2) return;

      cards.forEach((card, i) => {
        // Set initial 3D properties for each card
        gsap.set(card, {
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        });

        // Get card content elements for parallax effect
        const cardContent = card.querySelector(".card-content") as HTMLElement;
        const cardImage = card.querySelector(
          ".card-image-wrapper"
        ) as HTMLElement;

        if (i > 0) {
          gsap.set(card, {
            scale: 0.82,
            rotateX: -10,
            rotateY: 1.5,
            z: -100,
            opacity: 0.25,
          });

          if (cardContent) {
            gsap.set(cardContent, {
              y: 25,
              opacity: 0.4,
            });
          }
          if (cardImage) {
            gsap.set(cardImage, {
              y: 15,
              scale: 0.92,
            });
          }
        }

        if (i === 0) {
          ScrollTrigger.create({
            trigger: card,
            start: "top bottom",
            end: "top top",
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              gsap.to(card, {
                rotateX: -12 + progress * 12,
                rotateY: 2 - progress * 2,
                scale: 0.82 + progress * 0.18,
                opacity: 0.25 + progress * 0.75,
                z: -100 + progress * 100,
                ease: "power1.out",
                duration: 0.1,
              });

              if (cardContent) {
                gsap.to(cardContent, {
                  y: 35 - progress * 35,
                  opacity: 0.4 + progress * 0.6,
                  ease: "power1.out",
                  duration: 0.1,
                });
              }
              if (cardImage) {
                gsap.to(cardImage, {
                  y: 20 - progress * 20,
                  scale: 0.92 + progress * 0.08,
                  ease: "power1.out",
                  duration: 0.1,
                });
              }
            },
          });
        }

        if (i === cards.length - 1) {
          ScrollTrigger.create({
            trigger: card,
            start: "top top",
            end: "bottom top",
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              gsap.to(card, {
                rotateX: -10 + progress * 10,
                rotateY: 1.5 - progress * 1.5,
                scale: 0.82 + progress * 0.18,
                opacity: 0.25 + progress * 0.75,
                z: -100 + progress * 100,
                ease: "power1.out",
                duration: 0.1,
              });

              if (cardContent) {
                gsap.to(cardContent, {
                  y: 25 - progress * 25,
                  opacity: 0.4 + progress * 0.6,
                  ease: "power1.out",
                  duration: 0.1,
                });
              }
              if (cardImage) {
                gsap.to(cardImage, {
                  y: 15 - progress * 15,
                  scale: 0.92 + progress * 0.08,
                  ease: "power1.out",
                  duration: 0.1,
                });
              }
            },
          });
          return;
        }

        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: cards[i + 1],
          end: "top top",
          pin: true,
          pinType: "transform",
          pinSpacing: false,
          anticipatePin: 1,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const nextCard = cards[i + 1] as HTMLElement;

            gsap.to(card, {
              scale: 1 - progress * 0.18,
              rotateX: progress * 10,
              rotateY: -progress * 1.5,
              z: -progress * 100,
              opacity: 1 - progress * 0.75,
              ease: "power1.inOut",
              duration: 0.1,
            });

            if (cardContent) {
              gsap.to(cardContent, {
                y: progress * 25,
                opacity: 1 - progress * 0.6,
                ease: "power1.inOut",
                duration: 0.1,
              });
            }
            if (cardImage) {
              gsap.to(cardImage, {
                y: progress * 15,
                scale: 1 - progress * 0.08,
                ease: "power1.inOut",
                duration: 0.1,
              });
            }

            if (nextCard) {
              const nextContent = nextCard.querySelector(
                ".card-content"
              ) as HTMLElement;
              const nextImage = nextCard.querySelector(
                ".card-image-wrapper"
              ) as HTMLElement;

              gsap.to(nextCard, {
                scale: 0.82 + progress * 0.18,
                rotateX: -10 + progress * 10,
                rotateY: 1.5 - progress * 1.5,
                z: -100 + progress * 100,
                opacity: 0.25 + progress * 0.75,
                ease: "power1.inOut",
                duration: 0.1,
              });

              if (nextContent) {
                gsap.to(nextContent, {
                  y: 25 - progress * 25,
                  opacity: 0.4 + progress * 0.6,
                  ease: "power1.inOut",
                  duration: 0.1,
                });
              }
              if (nextImage) {
                gsap.to(nextImage, {
                  y: 15 - progress * 15,
                  scale: 0.92 + progress * 0.08,
                  ease: "power1.inOut",
                  duration: 0.1,
                });
              }
            }
          },
        });
      });

      ScrollTrigger.refresh();
      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { dependencies: [slots, content], scope: container }
  );

  function toggler() {
    setToggle((prevToggle) => !prevToggle);
  }

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await getSlots();
        setSlots(data);
        setSlotsLoaded(true);
      } catch (err) {
        console.error("Error fetching image slots", err);
        setSlotsLoaded(true);
      }
    };
    fetchSlots();
  }, []);

  useEffect(() => {
    const fetchcontent = async () => {
      try {
        const data = await getContent();
        setcontent(data);
        setContentLoaded(true);
      } catch (err) {
        console.error("Error fetching content", err);
        setContentLoaded(true);
      }
    };
    fetchcontent();
  }, []);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        await getLinks();
        setLinksLoaded(true);
      } catch (err) {
        console.error("Error fetching links", err);
        setLinksLoaded(true);
      }
    };
    fetchLinks();
  }, []);

  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        await getSpotify();
        setSpotifyLoaded(true);
      } catch (err) {
        console.error("Error fetching spotify", err);
        setSpotifyLoaded(true);
      }
    };
    fetchSpotify();
  }, []);

  // Calculate progress based on data fetching
  useEffect(() => {
    const dataSources = [
      slotsLoaded,
      contentLoaded,
      linksLoaded,
      spotifyLoaded,
    ];
    const loadedDataCount = dataSources.filter(Boolean).length;
    const dataProgress = (loadedDataCount / dataSources.length) * 60; // 60% for data fetching

    // Update progress for data loading
    setProgress(Math.round(dataProgress));
  }, [slotsLoaded, contentLoaded, linksLoaded, spotifyLoaded]);

  // Track image loading after data is loaded
  useEffect(() => {
    // Only start tracking images after slots and content are loaded
    if (!slotsLoaded || !contentLoaded || imagesLoaded) return;

    // Small delay to ensure DOM is updated with images
    const timeoutId = setTimeout(() => {
      const images = Array.from(document.images);
      const videos = Array.from(document.querySelectorAll("video"));

      const assets = [...images, ...videos];
      let loaded = 0;

      if (assets.length === 0) {
        setProgress(100);
        setImagesLoaded(true);
        return;
      }

      const updateProgress = () => {
        loaded++;
        const imageProgress = Math.round((loaded / assets.length) * 40); // 40% for images
        setProgress(60 + imageProgress);

        if (loaded === assets.length) {
          setImagesLoaded(true);
          setProgress(100);
        }
      };

      assets.forEach((asset: any) => {
        if (asset.complete || asset.readyState >= 3) {
          updateProgress();
        } else {
          asset.onload = updateProgress;
          asset.onerror = updateProgress;
          asset.onloadeddata = updateProgress;
        }
      });
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [slotsLoaded, contentLoaded, imagesLoaded]);

  // Hide preloader when everything is loaded (called by Preloader component when progress reaches 100)
  const handlePreloaderComplete = () => {
    setShowPreloader(false);
    setLoading(false);
  };

  const youtubeSlot = slots.youtube;
  const isVideoUrl = (url?: string) =>
    !!url && /\.mp4$|\.webm$|\/video\/upload\//.test(url);

  const contentItem = content?.contents?.[0];

  const title = contentItem?.title || "";
  const body = contentItem?.body || "";
  const aboutbio = contentItem?.aboutbio || "";
  const aboutcard1 = contentItem?.aboutcard1 || "";
  const aboutcard2 = contentItem?.aboutcard2 || "";

  // Dynamic info for pincards
  const pincardConfigs = [
    {
      Heading: "Introduction",
      key: "body",
      text: body,
      hasImage: false,
      imageSlotKey: "",
    },
    {
      Heading: "Genre & Journey",
      key: "aboutbio",
      text: aboutbio,
      hasImage: false,
      imageSlotKey: "",
    },
    {
      Heading: "Originals",
      key: "aboutcard1",
      text: aboutcard1,
      hasImage: true,
      imageSlotKey: "card1",
      imageAlt: "Card1",
    },
    {
      Heading: "Collaborations",
      key: "aboutcard2",
      text: aboutcard2,
      hasImage: true,
      imageSlotKey: "card2",
      imageAlt: "Card2",
    },
  ];

  const baseClass =
    "cardcontent flex flex-col md:flex-row gap-6 md:gap-10 justify-center items-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 shadow-2xl rounded-4xl";

  return (
    <div className={`${inter.variable} ${playfair.variable}`}>
      {showPreloader && (
        <Preloader progress={progress} onComplete={handlePreloaderComplete} />
      )}
      {/* Catrel Section */}
      <div
        id="catrel"
        className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden"
        style={
          typeof slots.catrel === "object" && slots.catrel?.url
            ? {
                backgroundImage: `url(${getSlotUrl(slots.catrel)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        <motion.div
          whileHover={{
            scale: 1.03,
            boxShadow: 3,
          }}
          transition={{
            duration: 0.3,
            type: "keyframes",
          }}
          id="container"
          className="relative z-10 flex flex-col w-4/5 h-4/5 items-center rounded-4xl shadow-lg shadow-black/70 bg-white/5 backdrop-blur-s overflow-hidden"
        >
          <div
            id="picandname"
            className="w-full h-fit p-2 flex flex-row items-center justify-center rounded-t-3xl shadow-md gap-5 shadow-black/20 "
          >
            <h1
              className="font-lora text-3xl md:text-5xl font-bold text-purple-100 tracking-tight italic"
              style={{
                fontFamily: "'Lora', var(--font-playfair), serif",
                letterSpacing: "0.03em",
                textShadow: "0 2px 12px rgba(138,87,222,0.10)",
              }}
            >
              Atharva
            </h1>
            {slots.logo && (
              <div
                className="w-14 h-14 rounded-full bg-white/50 flex items-center justify-center overflow-hidden ring-2 ring-white/75"
                style={{
                  boxShadow: "0 0 10px 2px rgba(0,0,0,0.2)",
                }}
              >
                <img
                  src={getSlotUrl(slots.logo)}
                  alt="Logo"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <h1
              className="font-lora text-3xl md:text-5xl font-bold text-purple-100 tracking-tight italic"
              style={{
                fontFamily: "'Lora', var(--font-playfair), serif",
                letterSpacing: "0.03em",
                textShadow: "0 2px 12px rgba(138,87,222,0.10)",
              }}
            >
              Acharya
            </h1>
          </div>

          <div id="contentcontainer" className="w-full h-full m-4">
            <div
              id="contentsection"
              className="flex flex-col w-full h-full items-center"
            >
              {/* The Toggle Button */}
              <button
                onClick={toggler}
                className="
                flex border-4 border-purple-400/70 p-3 rounded-full gap-3
                "
                style={{
                  fontFamily: "'Space Grotesk', var(--font-inter), sans-serif",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                }}
              >
                {/* LABELS */}
                <div className="relative flex h-full items-center gap-3 rounded-full ">
                  {/* LEFT label */}
                  <span
                    className={`text-sm font-bold tracking-wide transition-colors z-10 flex-1 text-center ${
                      !toggle ? "text-white" : "text-purple-300/50"
                    }`}
                    style={{
                      textTransform: "uppercase",
                      fontFamily:
                        "'Space Grotesk', var(--font-inter), sans-serif",
                    }}
                  >
                    Releases
                  </span>

                  {/* RIGHT label */}
                  <span
                    className={`text-sm font-bold tracking-wide transition-colors z-10 flex-1 text-center ${
                      toggle ? "text-white" : "text-purple-300/50"
                    }`}
                    style={{
                      textTransform: "uppercase",
                      fontFamily:
                        "'Space Grotesk', var(--font-inter), sans-serif",
                    }}
                  >
                    Catalog
                  </span>
                </div>
              </button>

              <div className="w-full h-full flex">
                {/* Conditional Rendering */}
                {toggle ? <Catalog /> : <Links />}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* YouTube Section */}
      <div id="youtube" className="relative w-full h-screen overflow-hidden">
        {typeof youtubeSlot === "object" &&
          youtubeSlot?.url &&
          isVideoUrl(getSlotUrl(youtubeSlot)) && (
            <video
              src={getSlotUrl(youtubeSlot)}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <Youtube />
        </div>
      </div>

      {/* about section */}
      <section className="w-full flex flex-col justify-center items-center ">
        <LampContainer>
          <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
            {slots.lamp && (
              <div
                className="w-60 h-60  flex items-center justify-center 
                     ring-2  p-3 rounded-3xl overflow-clip border-4 shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]"
              >
                <img
                  src={getSlotUrl(slots.lamp)}
                  alt="Lamp"
                  className="object-cover flex justify-center items-center w-fit h-fit hover:scale-110 duration-300"
                />
              </div>
            )}

            <motion.h1
              initial={{ opacity: 0.5, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="text-center text-4xl md:text-7xl p-7 font-bold tracking-tight italic bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-transparent drop-shadow-lg"
              style={{
                fontFamily: "'Lora', var(--font-playfair), serif",
                letterSpacing: "0.05em",
                lineHeight: 1.15,
                textShadow: "0 1px 18px rgba(138,87,222,0.10)",
              }}
            >
              <EncryptedText
                text={title || "Atharva Acharya"}
                encryptedClassName="text-neutral-500"
                revealedClassName="dark:text-white text-black"
                revealDelayMs={50}
              />
              
            </motion.h1>
          </div>
        </LampContainer>
      </section>

      <div
        id="sticky-cards"
        ref={container}
        className="relative w-full min-h-[410vh] bg-[#020617] perspective-distant transform-3d"
      >
        <div id="sticky-card-wrapper" className="relative w-full">
          <div id="stacked-cards" className="relative w-full">
            {pincardConfigs.map((card) => {
              const hasImage =
                !!card.hasImage && !!getSlotUrl(slots[card.imageSlotKey || ""]);
              return (
                <div
                  key={card.key}
                  className="sticky-card h-screen w-full flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 px-6 md:px-12 transform-3d backface-hidden"
                >
                  {/* Modern card container with enhanced depth */}
                  <div
                    className="relative w-full max-w-6xl h-[85vh] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl shadow-[0_25px_80px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-white/15 transform-gpu"
                    style={{ willChange: "transform, opacity" }}
                  >
                    {/* Animated border glow effect */}
                    <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-purple-500/50 via-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="w-full h-full flex flex-col md:flex-row justify-center items-center gap-8  md:gap-12 p-8 md:p-12 border-2 shadow-2xl shadow-cyan-500/50  ">
                      <div
                        className={`card-content w-full md:w-1/2 flex flex-col justify-center gap-6 z-10 transform-3d`}
                      >
                        <h2
                          className="font-lora text-2xl md:text-5xl font-bold text-center md:text-left bg-gradient-to-br from-white via-slate-100 to-slate-300 bg-clip-text text-transparent drop-shadow-lg italic"
                          style={{
                            fontFamily: "'Lora', var(--font-playfair), serif",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {card.Heading}
                        </h2>
                        <p
                          className="font-spaceGrotesk text-base md:text-lg text-slate-300/90 text-center md:text-left leading-relaxed"
                          style={{
                            fontFamily:
                              "'Space Grotesk', var(--font-inter), sans-serif",
                            fontWeight: 500,
                            letterSpacing: "0.03em",
                          }}
                        >
                          {card.text}
                        </p>
                      </div>
                      {/* Image */}
                      {hasImage && (
                        <div className="w-full md:w-1/2 flex justify-center items-center z-10">
                          <div className="card-image-wrapper relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-[0_15px_50px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.1)] transform-3d">
                            <motion.img
                              whileHover={{
                                scale: 1.5,
                              }}
                              className="w-full h-full object-cover"
                              src={getSlotUrl(slots[card.imageSlotKey])}
                              alt={card.imageAlt || "Card image"}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                            {/* Image shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Enhanced gradient overlays for depth */}
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_60%)]" />
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_100%,rgba(0,0,0,0.3)_0%,transparent_60%)]" />

                    {/* Corner accent lights */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-br-full blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-tl-full blur-2xl pointer-events-none" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
