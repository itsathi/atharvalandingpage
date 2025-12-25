"use client";

import { CldUploadWidget } from "next-cloudinary";
import axios from "axios";
import { useState, useEffect } from "react";

export default function ImageUploader() {
  const [slots, setSlots] = useState<Record<string, { url: string }>>({});
  const [savingSlot, setSavingSlot] = useState<string | null>(null);

  const SLOT_KEYS = ["logo", "catrel", "lamp", "youtube", "card1", "card2"];

  // Load slots
  useEffect(() => {
    axios.get("/api/slots").then((res) => setSlots(res.data));
  }, []);

  // Save uploaded image
  const handleSaveSlot = async (slotKey: string, result: any) => {
    if (!result?.info) return;

    const url = result.info.secure_url;
    const public_id = result.info.public_id;

    setSavingSlot(slotKey);

    await axios.put("/api/slots", {
      slotKey,
      url,
      public_id,
    });

    setSlots((prev) => ({
      ...prev,
      [slotKey]: { url },
    }));

    setSavingSlot(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-white mb-6">Admin: Manage Media</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {SLOT_KEYS.map((key) => {
          const url = slots[key]?.url;

          const isVideo =
            url && (url.includes("/video/") || url.endsWith(".mp4"));

          return (
            <div key={key} className="border border-gray-700 rounded-xl bg-gray-900 overflow-hidden">
              {url ? (
                isVideo ? (
                  <video src={url} autoPlay loop muted className="w-full h-64 object-cover" />
                ) : (
                  <img src={url} className="w-full h-64 object-cover" />
                )
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-800 text-gray-500">
                  Empty Slot
                </div>
              )}

              <div className="p-4 flex justify-center bg-black/40">
                <CldUploadWidget
                  signatureEndpoint="/api/sign-cloudinary"
                  uploadPreset="athilandingpage"
                  options={{
                    resourceType: "auto",
                    multiple: false,
                    folder: "atharvalandingpage",
                  }}
                  onSuccess={(r) => handleSaveSlot(key, r)}
                >
                  {({ open }) => (
                    <button
                      onClick={() => open()}
                      disabled={savingSlot === key}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      {savingSlot === key ? "Saving..." : "Update"}
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              <div className="text-center py-2 bg-gray-800 text-white capitalize">
                {key}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
