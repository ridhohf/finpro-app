"use client";

import { ImageGallery } from "@/components/properties/imageGallery";

interface PropertyImageGalleryProps {
  images: string[];
  name: string;
}

export function PropertyImageGallery({ images, name }: PropertyImageGalleryProps) {
  return (
    <div className="mb-8">
      <ImageGallery images={images} name={name} />
    </div>
  );
}