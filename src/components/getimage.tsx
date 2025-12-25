"use client";
import axios from "axios";
import { useEffect, useState } from "react";

type CloudinaryImage = {
  public_id: string;
  secure_url: string;
};

export default function CloudinaryGallery() {
  const [images, setImages] = useState<CloudinaryImage[]>([]);

  useEffect(() => {
    axios.get("/api/cloudinary/get-images")
      .then(res => setImages(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      {images.map((img) => (
        <img
          key={img.public_id}
          src={img.secure_url}
          alt={img.public_id}
          className="rounded-lg shadow"
        />
      ))}
    </div>
  );
}
