"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import { Inter, Playfair_Display } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});



// Modern fade in effect with scale and blur as well
const fadeInModern = (targets: gsap.TweenTarget, delay = 0) =>
  gsap.fromTo(
    targets,
    { opacity: 0, y: 48, scale: 0.98, filter: "blur(8px)" },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.1,
      delay,
      ease: "power3.out",
      stagger: 0.12,
    }
  );

const AdminAboutPanel = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [slots, setSlots] = useState<Record<string, any>>({});
  const [content, setcontent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSlot, setSavingSlot] = useState<string | null>(null);

  // Refs for textarea values
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const card1Ref = useRef<HTMLTextAreaElement>(null);
  const card2Ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get("/api/slots");
        setSlots(res.data);
      } catch (err) {
        console.error("Error fetching image slots", err);
      }
    };
    fetchSlots();
  }, []);

  useEffect(() => {
    const fetchcontent = async () => {
      try {
        const res = await axios.get("/api/content");
        setcontent(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching content", err);
        setLoading(false);
      }
    };
    fetchcontent();
  }, []);

  // GSAP ANIMATION: Clean, modern appearance with fade, blur and scale, now with improved selectors
  useGSAP(() => {
    fadeInModern(".about-panel", 0);
    fadeInModern(".about-header", 0.09);
    fadeInModern(".bio-block", 0.22);
    fadeInModern(".modern-card", 0.37);
  }, [loading]);

  const contentItem = content?.contents?.[0] ?? {};
  const { title = "", body = "", aboutbio = "", aboutcard1 = "", aboutcard2 = "" } = contentItem;
  const contentId = contentItem._id || contentItem.id;

  const slotImgSrc = (slot: any) =>
    typeof slot === "string" ? slot : slot?.url || "";

  const handleSaveSlot = async (slotKey: string, result: any) => {
    if (!result?.info) return;

    const url = result.info.secure_url;
    const public_id = result.info.public_id;

    setSavingSlot(slotKey);

    try {
      await axios.put("/api/slots", {
        slotKey,
        url,
        public_id,
      });

      setSlots((prev) => ({
        ...prev,
        [slotKey]: { url, public_id },
      }));
    } catch (error) {
      console.error(`Error updating slot ${slotKey}:`, error);
      alert(`Failed to update ${slotKey} image`);
    } finally {
      setSavingSlot(null);
    }
  };

  const updateContentField = async (fieldName: string, value: string) => {
    if (!contentId) {
      alert("Content ID not found. Please ensure content is loaded.");
      return;
    }

    setSaving(true);
    try {
      const currentTitle = titleRef.current?.value ?? title;
      const currentBio = bioRef.current?.value ?? aboutbio;
      const currentBody = bodyRef.current?.value ?? body;
      const currentCard1 = card1Ref.current?.value ?? aboutcard1;
      const currentCard2 = card2Ref.current?.value ?? aboutcard2;

      const updateData: any = {
        id: contentId,
        title: fieldName === "title" ? value : currentTitle,
        aboutbio: fieldName === "aboutbio" ? value : currentBio,
        body: fieldName === "body" ? value : currentBody,
        aboutcard1: fieldName === "aboutcard1" ? value : currentCard1,
        aboutcard2: fieldName === "aboutcard2" ? value : currentCard2,
      };

      const response = await axios.put("/api/content", updateData, {
        headers: { "Content-Type": "application/json" },
      });

      const result = response.data;

      if (result.content) {
        setcontent({ contents: [result.content] });
      }

      alert(`${fieldName} saved successfully!`);
    } catch (error: any) {
      let message = error?.message ?? "Unknown error";
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      }
      console.error(`Error updating ${fieldName}:`, error);
      alert(`Failed to save ${fieldName}: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      ref={panelRef}
      className="about-panel w-full min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-cyan-950 pb-20 px-2 md:px-0 selection:bg-cyan-200/30 selection:text-cyan-900"
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto pt-16 about-header flex flex-col items-center gap-2">
        <h1 className="text-[2.7rem] md:text-[3.2rem] leading-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400/90 to-cyan-600 drop-shadow-xl tracking-tight">
          About <span className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-fuchsia-400 bg-clip-text text-transparent animate-gradient-x">Panel</span>
        </h1>
        <div className="h-1 w-16 rounded-full bg-cyan-500/40 mt-2 shadow-cyan-400/40 shadow-sm" />
      </div>

      {/* Background media (hero + YouTube) */}
      <section className="bio-block flex flex-col md:flex-row gap-6 max-w-4xl mx-auto mt-10 mb-12 modern-card">
        {/* Catrel background */}
        <div className="flex-1 rounded-2xl bg-gradient-to-br from-cyan-950/80 via-zinc-950/80 to-zinc-950/90 border border-cyan-900/70 shadow-xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-300">Hero Background</p>
              <p className="text-xs text-zinc-300/70">Updates the top section image (slot: catrel)</p>
            </div>
            {savingSlot === "catrel" && <span className="text-xs text-cyan-300">Saving…</span>}
          </div>
          <div 
            className="relative w-full h-44 rounded-xl overflow-hidden bg-zinc-900/70 border border-cyan-900/60 flex items-center justify-center"
            style={{ backgroundImage: slots.catrel ? `url(${slotImgSrc(slots.catrel)})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            {!slots.catrel && <span className="text-zinc-200 text-sm italic">No image</span>}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 pb-3 flex justify-center">
              <CldUploadWidget
                signatureEndpoint="/api/sign-cloudinary"
                uploadPreset="athilandingpage"
                options={{
                  resourceType: "auto",
                  multiple: false,
                  folder: "atharvalandingpage",
                }}
                onSuccess={(r) => handleSaveSlot("catrel", r)}
              >
                {({ open }) => (
                  <button
                    onClick={() => open()}
                    disabled={savingSlot === "catrel"}
                    className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-800 hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-700/15 focus:ring-2 focus:ring-cyan-400 transition-all duration-200 disabled:opacity-40"
                  >
                    {savingSlot === "catrel" ? "Saving..." : "Update Image"}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>
        </div>

        {/* YouTube background/video slot */}
        <div className="flex-1 rounded-2xl bg-gradient-to-br from-cyan-950/80 via-zinc-950/80 to-zinc-950/90 border border-cyan-900/70 shadow-xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-300">YouTube Section Media</p>
              <p className="text-xs text-zinc-300/70">Supports image or video for the YouTube block (slot: youtube)</p>
            </div>
            {savingSlot === "youtube" && <span className="text-xs text-cyan-300">Saving…</span>}
          </div>
          <div 
            className="relative w-full h-44 rounded-xl overflow-hidden bg-zinc-900/70 border border-cyan-900/60 flex items-center justify-center"
            style={{ backgroundImage: slots.youtube && !slots.youtube?.url?.match(/mp4|webm|video\/upload/) ? `url(${slotImgSrc(slots.youtube)})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            {!slots.youtube && <span className="text-zinc-200 text-sm italic">No media</span>}
            {slots.youtube?.url && slots.youtube.url.match(/mp4|webm|video\/upload/) && (
              <span className="text-xs text-cyan-200 bg-black/60 px-2 py-1 rounded-md">Video set</span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 pb-3 flex justify-center">
              <CldUploadWidget
                signatureEndpoint="/api/sign-cloudinary"
                uploadPreset="athilandingpage"
                options={{
                  resourceType: "auto",
                  multiple: false,
                  folder: "atharvalandingpage",
                }}
                onSuccess={(r) => handleSaveSlot("youtube", r)}
              >
                {({ open }) => (
                  <button
                    onClick={() => open()}
                    disabled={savingSlot === "youtube"}
                    className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-800 hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-700/15 focus:ring-2 focus:ring-cyan-400 transition-all duration-200 disabled:opacity-40"
                  >
                    {savingSlot === "youtube" ? "Saving..." : "Update Media"}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400/80 leading-tight">
            Tip: upload an mp4/webm to set a looping background video, or an image to use a static backdrop.
          </p>
        </div>
      </section>

      {/* Profile & Editable sections */}
      <section className="bio-block flex flex-col md:flex-row gap-14 max-w-3xl mx-auto mb-9 mt-8">
        {/* Picture + Overlay */}
        <div className="flex flex-col gap-7 items-center md:items-start flex-shrink-0 w-full md:w-[17rem]">
          <div 
            className="relative rounded-2xl shadow-2xl shadow-cyan-800/30 border-none h-48 w-48 flex items-center justify-center bg-gradient-to-br from-cyan-900/70 via-zinc-800/90 to-cyan-950/80 bg-cover bg-center group transition-all duration-300 modern-card overflow-hidden"
            style={{
              backgroundImage: slots.lamp ? `url(${slotImgSrc(slots.lamp)})` : undefined,
            }}
          >
            {/* Avatar ring + overlay */}
            <span className="pointer-events-none absolute inset-0 z-1 rounded-2xl border-0 ring-8 ring-cyan-400/10 group-hover:ring-cyan-400/50 transition-all"></span>
            {/* Image blur bg edge */}
            <span className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-zinc-900/70 to-transparent mix-blend-multiply" />
            {/* Avatar fallback */}
            {!slots.lamp && (
              <span className="text-zinc-300 text-lg md:text-xl italic text-center font-sans tracking-wide">
                No Image
              </span>
            )}
            {/* Upload button */}
            <div className="absolute inset-0 flex items-end justify-center z-10 pb-4 group-hover:backdrop-blur-[2px] transition-all duration-200">
              <CldUploadWidget
                signatureEndpoint="/api/sign-cloudinary"
                uploadPreset="athilandingpage"
                options={{
                  resourceType: "auto",
                  multiple: false,
                  folder: "atharvalandingpage",
                }}
                onSuccess={(r) => handleSaveSlot("lamp", r)}
              >
                {({ open }) => (
                  <button
                    onClick={() => open()}
                    disabled={savingSlot === "lamp"}
                    className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-800 hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-700/15 focus:ring-2 focus:ring-cyan-400 transition-all duration-200 disabled:opacity-40"
                  >
                    {savingSlot === "lamp" ? "Saving..." : "Update Pic"}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>
        </div>
        {/* Info & Editable blocks */}
        <div className="flex-1 grid gap-8">
          {/* Name */}
          <div className="grid gap-2 rounded-2xl bg-gradient-to-br from-cyan-950/80 via-zinc-900/80 to-zinc-950/80 border border-cyan-800/70 px-6 py-6 shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 modern-card">
            <label className="font-medium text-sm text-cyan-300 mb-1 tracking-tight">Name</label>
            <Textarea
              ref={titleRef}
              placeholder={"Edit your name..."}
              defaultValue={title}
              className="min-h-[46px] rounded-lg font-semibold text-cyan-100 ring-2 ring-cyan-400/10 hover:ring-cyan-400/40 bg-zinc-950/70 outline-none focus:ring-cyan-400/30 py-2 px-3 shadow-md focus:bg-zinc-900/70 transition-all duration-150"
            />
            <Button 
              onClick={() => updateContentField("title", titleRef.current?.value || "")}
              disabled={saving}
              className="w-full mt-1.5 bg-gradient-to-r from-cyan-500 to-cyan-800 text-white font-bold rounded-lg shadow-cyan-500/10 shadow-md  hover:from-cyan-700 hover:to-cyan-900 active:scale-[0.98] focus:ring-2 focus:ring-cyan-400 transition-all duration-100 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Name"}
            </Button>
          </div>
          {/* Bio */}
          <div className="grid gap-2 rounded-2xl bg-gradient-to-br from-cyan-950/80 via-zinc-900/80 to-zinc-950/80 border border-cyan-800/70 px-6 py-6 shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 modern-card">
            <label className="font-medium text-sm text-cyan-300 mb-1 tracking-tight">Bio</label>
            <Textarea
              ref={bioRef}
              placeholder={"Short bio or tagline..."}
              defaultValue={aboutbio}
              className="min-h-[46px] rounded-lg text-cyan-100 ring-2 ring-cyan-400/10 hover:ring-cyan-400/40 bg-zinc-950/70 outline-none focus:ring-cyan-400/30 py-2 px-3 shadow-md focus:bg-zinc-900/70 transition-all duration-150"
            />
            <Button 
              onClick={() => updateContentField("aboutbio", bioRef.current?.value || "")}
              disabled={saving}
              className="w-full mt-1.5 bg-gradient-to-r from-cyan-500 to-cyan-800 text-white font-bold rounded-lg shadow-cyan-500/10 shadow-md hover:from-cyan-700 hover:to-cyan-900 active:scale-[0.98] focus:ring-2 focus:ring-cyan-400 transition-all duration-100 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Bio"}
            </Button>
          </div>
        </div>
      </section>

      {/* Introduction/Body */}
      <section className="bio-block max-w-3xl mx-auto mb-12 modern-card">
        <div className="grid gap-3 rounded-2xl bg-gradient-to-tr from-cyan-950/90 via-zinc-900/95 to-zinc-950/90 border border-cyan-900 px-7 py-7 shadow-2xl shadow-cyan-800/10 hover:shadow-cyan-300/20 transition-all duration-200">
          <label className="font-medium text-sm mb-1 text-cyan-300 tracking-tight">Introduction</label>
          <Textarea
            ref={bodyRef}
            placeholder="Edit your intro / about you..."
            defaultValue={body}
            className="min-h-[72px] rounded-lg text-cyan-100 ring-2 ring-cyan-400/10 hover:ring-cyan-400/40 bg-zinc-950/70 outline-none focus:ring-cyan-400/30 py-2 px-3 shadow-md focus:bg-zinc-900/70 transition-all duration-150"
          />
          <Button 
            onClick={() => updateContentField("body", bodyRef.current?.value || "")}
            disabled={saving}
            className="w-full mt-1.5 bg-gradient-to-r from-cyan-500 to-cyan-800 text-white font-bold rounded-lg shadow-cyan-500/10 shadow-md hover:from-cyan-700 hover:to-cyan-900 active:scale-[0.98] focus:ring-2 focus:ring-cyan-400 transition-all duration-100 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Introduction"}
          </Button>
        </div>
      </section>

      {/* Cards */}
      <section className="cards-block flex flex-col gap-12 max-w-4xl mx-auto mt-3">
        {/* Card 1 */}
        <div className="flex flex-col md:flex-row gap-8 bg-gradient-to-r from-cyan-950/80 via-zinc-950/90 to-zinc-950/80 rounded-2xl border border-cyan-900/70 shadow-xl p-7 py-10 items-center group modern-card transition-all duration-200">
          {/* Image */}
          <div 
            className="relative w-full md:w-56 h-44 md:h-[13.5rem] rounded-xl border-0 bg-white/5 overflow-hidden flex items-center justify-center shadow-lg shadow-cyan-900/20 bg-cover bg-center group-hover:ring-4 ring-cyan-600/30 transition-all duration-200"
            style={{
              backgroundImage: slots.card1 ? `url(${slotImgSrc(slots.card1)})` : undefined,
            }}
          >
            {!slots.card1 && (
              <span className="text-zinc-200 text-lg italic text-center">No Image</span>
            )}
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-cyan-950/30 via-black/20 to-transparent opacity-90 group-hover:backdrop-blur-[2px] transition-all duration-200 pb-3">
              <CldUploadWidget
                signatureEndpoint="/api/sign-cloudinary"
                uploadPreset="athilandingpage"
                options={{
                  resourceType: "auto",
                  multiple: false,
                  folder: "atharvalandingpage",
                }}
                onSuccess={(r) => handleSaveSlot("card1", r)}
              >
                {({ open }) => (
                  <button
                    onClick={() => open()}
                    disabled={savingSlot === "card1"}
                    className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-800 hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-700/15 focus:ring-2 focus:ring-cyan-400 transition-all duration-200 disabled:opacity-40"
                  >
                    {savingSlot === "card1" ? "Saving..." : "Update Image"}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>
          <div className="flex-1 grid gap-2">
            <h3 className="text-base font-semibold text-cyan-300 mb-1">Card 1 Description</h3>
            <Textarea
              ref={card1Ref}
              placeholder="Edit description for Card 1..."
              defaultValue={aboutcard1}
              className="min-h-[54px] rounded-lg text-cyan-100 ring-2 ring-cyan-400/10 hover:ring-cyan-400/40 bg-zinc-950/70 outline-none focus:ring-cyan-400/30 py-2 px-3 shadow-md focus:bg-zinc-900/70 transition-all duration-150"
            />
            <Button 
              onClick={() => updateContentField("aboutcard1", card1Ref.current?.value || "")}
              disabled={saving}
              className="w-full mt-1.5 bg-gradient-to-r from-cyan-500 to-cyan-800 text-white font-bold rounded-lg shadow-cyan-500/10 shadow-md hover:from-cyan-700 hover:to-cyan-900 active:scale-[0.98] focus:ring-2 focus:ring-cyan-400 transition-all duration-100 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Card 1"}
            </Button>
          </div>
        </div>
        {/* Card 2 */}
        <div className="flex flex-col md:flex-row gap-8 bg-gradient-to-r from-cyan-950/80 via-zinc-950/90 to-zinc-950/80 rounded-2xl border border-cyan-900/70 shadow-xl p-7 py-10 items-center group modern-card transition-all duration-200">
          <div 
            className="relative w-full md:w-56 h-44 md:h-[13.5rem] rounded-xl border-0 bg-white/5 overflow-hidden flex items-center justify-center shadow-lg shadow-cyan-900/20 bg-cover bg-center group-hover:ring-4 ring-cyan-600/30 transition-all duration-200"
            style={{
              backgroundImage: slots.card2 ? `url(${slotImgSrc(slots.card2)})` : undefined,
            }}
          >
            {!slots.card2 && (
              <span className="text-zinc-200 text-lg italic text-center">No Image</span>
            )}
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-cyan-950/30 via-black/20 to-transparent opacity-90 group-hover:backdrop-blur-[2px] transition-all duration-200 pb-3">
              <CldUploadWidget
                signatureEndpoint="/api/sign-cloudinary"
                uploadPreset="athilandingpage"
                options={{
                  resourceType: "auto",
                  multiple: false,
                  folder: "atharvalandingpage",
                }}
                onSuccess={(r) => handleSaveSlot("card2", r)}
              >
                {({ open }) => (
                  <button
                    onClick={() => open()}
                    disabled={savingSlot === "card2"}
                    className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-800 hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-700/15 focus:ring-2 focus:ring-cyan-400 transition-all duration-200 disabled:opacity-40"
                  >
                    {savingSlot === "card2" ? "Saving..." : "Update Image"}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>
          <div className="flex-1 grid gap-2">
            <h3 className="text-base font-semibold text-cyan-300 mb-1">Card 2 Description</h3>
            <Textarea
              ref={card2Ref}
              placeholder="Edit description for Card 2..."
              defaultValue={aboutcard2}
              className="min-h-[54px] rounded-lg text-cyan-100 ring-2 ring-cyan-400/10 hover:ring-cyan-400/40 bg-zinc-950/70 outline-none focus:ring-cyan-400/30 py-2 px-3 shadow-md focus:bg-zinc-900/70 transition-all duration-150"
            />
            <Button 
              onClick={() => updateContentField("aboutcard2", card2Ref.current?.value || "")}
              disabled={saving}
              className="w-full mt-1.5 bg-gradient-to-r from-cyan-500 to-cyan-800 text-white font-bold rounded-lg shadow-cyan-500/10 shadow-md hover:from-cyan-700 hover:to-cyan-900 active:scale-[0.98] focus:ring-2 focus:ring-cyan-400 transition-all duration-100 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Card 2"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminAboutPanel;
