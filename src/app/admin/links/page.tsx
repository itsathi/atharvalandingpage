"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

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

function Links() {
  const [links, setLinks] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessages, setSuccessMessages] = useState<{ [key: string]: string | null }>({});
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string | null }>({});
  const [formState, setFormState] = useState<{ [key: string]: string }>({});
  const [linkId, setLinkId] = useState<string | null>(null);

  const iconSize = 20;
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
      key: "Twitter",
      label: "Twitter",
      icon: <Twitter size={iconSize} />,
    },
    {
      key: "Youtubechannel",
      label: "YouTube",
      icon: <Youtube size={iconSize} />,
    },
    // Youtubevideo removed
  ];

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/links");
        const data = response.data?.data?.[0];
        setLinks(data || {});
        setLinkId(data?._id || null);
        setFormState({
          spotify: data?.spotify ?? "",
          applemusic: data?.applemusic ?? "",
          itunes: data?.itunes ?? "",
          bandcamp: data?.bandcamp ?? "",
        });
      } catch (err) {
        setError("Failed to fetch links");
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const handleChange = (key: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Reset success and error for this key
    setSuccessMessages((msgs) => ({ ...msgs, [key]: null }));
    setErrorMessages((msgs) => ({ ...msgs, [key]: null }));
  };

  const handleSingleSubmit = async (key: string) => {
    if (!linkId) {
      setErrorMessages((msgs) => ({
        ...msgs,
        [key]: "Could not find existing link entry to update.",
      }));
      return;
    }

    setSavingKey(key);
    setSuccessMessages((msgs) => ({ ...msgs, [key]: null }));
    setErrorMessages((msgs) => ({ ...msgs, [key]: null }));

    try {
      const body = {
        id: linkId,
        [key]: formState[key]
      };
      const response = await axios.put("/api/links", body);

      if (response.data?.success) {
        setSuccessMessages((msgs) => ({
          ...msgs,
          [key]: `${linkItems.find((item) => item.key === key)?.label ?? key} link updated successfully!`
        }));
        setLinks(response.data?.data);
      } else {
        setErrorMessages((msgs) => ({
          ...msgs,
          [key]: response.data?.error || "Failed to update link."
        }));
      }
    } catch (err: any) {
      setErrorMessages((msgs) => ({
        ...msgs,
        [key]: err?.response?.data?.error || "An error occurred while updating link."
      }));
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (error)
    return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div>
      {/* release */}
    <div className="w-full p-4 sm:p-6 max-w-screen-2xl gap5 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">
        Admin: Update Individual Links
      </h2>
      {/* Grid wrapper for desktop */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-10">
        {/* Input forms */}
        <div className="flex flex-col gap-6">
          {linkItems.map(({ key, label, icon }) => (
            <div key={key} className="flex items-center gap-4 bg-white/10 rounded-lg p-4 hover:scale-103 duration-250 hover:drop-shadow-2xl  hover:rotate-x-2 -rotate-y-5">
              <img
                src={icon}
                alt={label}
                className="w-12 h-12 rounded"
              />
              <div className="flex-1 flex flex-col">
                <label htmlFor={key} className="text-white font-medium mb-2">
                  {label} Link
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    id={key}
                    type="url"
                    className="px-3 py-2 rounded bg-white/80 text-slate-900 w-full outline-none"
                    value={formState[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={`Enter ${label} URL`}
                    required
                    />
                  <button
                    type="button"
                    onClick={() => handleSingleSubmit(key)}
                    disabled={savingKey === key}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg font-semibold transition disabled:bg-purple-900 mt-2 sm:mt-0 sm:ml-4"
                  >
                    {savingKey === key ? "Saving..." : "Update"}
                  </button>
                </div>
                {successMessages[key] && (
                  <div className="mt-1 text-green-400 text-sm">{successMessages[key]}</div>
                )}
                {errorMessages[key] && (
                  <div className="mt-1 text-red-500 text-sm">{errorMessages[key]}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Preview */}
        <div className="flex flex-col justify-center lg:items-center mt-8 lg:mt-0">
          <h3 className="text-lg font-semibold text-white mb-2 text-center lg:text-left">Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full max-w-xs mx-auto lg:max-w-none">
            {linkItems.map(({ key, label, icon }) => {
              const linkUrl = formState[key];
              if (!linkUrl) return null;
              return (
                <a
                  key={key}
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center bg-white/10 hover:bg-white/20 transition rounded-lg shadow p-3 gap-2 hover:scale-107 duration-250 hover:drop-shadow-2xl  hover:rotate-x-5 -rotate-y-15"
                >
                  <img
                    src={icon}
                    alt={label}
                    className="w-10 h-10 rounded mb-1"
                  />
                  <span className="text-white text-base font-medium">
                    {label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>

     {/* social media */}
     <div className="w-full p-4 sm:p-6 max-w-screen-2xl gap5 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">
        Admin: Update Social Media Links
      </h2>
      {/* Grid wrapper for desktop */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-10">
        {/* Input forms */}
        <div className="flex flex-col gap-6">
          {socialMediaData.map(({ key, label, icon }) => (
            <div key={key} className="flex items-center gap-4 bg-white/10 rounded-lg p-4 hover:scale-103 duration-250 hover:drop-shadow-2xl hover:rotate-x-2 -rotate-y-5">
              <div className="w-12 h-12 flex justify-center items-center bg-white/15 rounded">
                {icon}
              </div>
              <div className="flex-1 flex flex-col">
                <label htmlFor={key} className="text-white font-medium mb-2">
                  {label} Link
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    id={key}
                    type="url"
                    className="px-3 py-2 rounded bg-white/80 text-slate-900 w-full outline-none"
                    value={formState[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={`Enter ${label} URL`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleSingleSubmit(key)}
                    disabled={savingKey === key}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg font-semibold transition disabled:bg-purple-900 mt-2 sm:mt-0 sm:ml-4"
                  >
                    {savingKey === key ? "Saving..." : "Update"}
                  </button>
                </div>
                {successMessages[key] && (
                  <div className="mt-1 text-green-400 text-sm">{successMessages[key]}</div>
                )}
                {errorMessages[key] && (
                  <div className="mt-1 text-red-500 text-sm">{errorMessages[key]}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Preview */}
        <div className="flex flex-col justify-center lg:items-center mt-8 lg:mt-0">
          <h3 className="text-lg font-semibold text-white mb-2 text-center lg:text-left">Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full max-w-xs mx-auto lg:max-w-none">
            {socialMediaData.map(({ key, label, icon }) => {
              const linkUrl = formState[key];
              if (!linkUrl) return null;
              return (
                <a
                  key={key}
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center bg-white/10 hover:bg-white/20 transition rounded-lg shadow p-3 gap-2 hover:scale-107 duration-250 hover:drop-shadow-2xl hover:rotate-x-5 -rotate-y-15"
                >
                  <div className="w-10 h-10 flex items-center justify-center mb-1 bg-white/15 rounded">
                    {icon}
                  </div>
                  <span className="text-white text-base font-medium">
                    {label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
</div>
  );
}

export default Links;