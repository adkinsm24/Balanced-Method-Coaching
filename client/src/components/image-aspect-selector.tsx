import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ImageAspectSelectorProps {
  imageUrl: string;
  alt: string;
  className?: string;
}

type AspectRatio = {
  name: string;
  ratio: string;
  class: string;
};

const aspectRatios: AspectRatio[] = [
  { name: "16:9", ratio: "16/9", class: "aspect-video" },
  { name: "4:3", ratio: "4/3", class: "aspect-[4/3]" },
  { name: "3:2", ratio: "3/2", class: "aspect-[3/2]" },
  { name: "1:1", ratio: "1/1", class: "aspect-square" },
  { name: "3:4", ratio: "3/4", class: "aspect-[3/4]" },
  { name: "9:16", ratio: "9/16", class: "aspect-[9/16]" },
];

export default function ImageAspectSelector({ imageUrl, alt, className = "" }: ImageAspectSelectorProps) {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(aspectRatios[0]);
  const [objectPosition, setObjectPosition] = useState("object-center");

  const positions = [
    { name: "Center", class: "object-center" },
    { name: "Top", class: "object-top" },
    { name: "Bottom", class: "object-bottom" },
    { name: "Left", class: "object-left" },
    { name: "Right", class: "object-right" },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Aspect Ratio Selector */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Aspect Ratio</h3>
        <div className="flex flex-wrap gap-2">
          {aspectRatios.map((ratio) => (
            <Button
              key={ratio.name}
              variant={selectedRatio.name === ratio.name ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRatio(ratio)}
              className="text-xs"
            >
              {ratio.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Object Position Selector */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Image Position</h3>
        <div className="flex flex-wrap gap-2">
          {positions.map((position) => (
            <Button
              key={position.name}
              variant={objectPosition === position.class ? "default" : "outline"}
              size="sm"
              onClick={() => setObjectPosition(position.class)}
              className="text-xs"
            >
              {position.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Image Preview */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        <div className={`w-full ${selectedRatio.class} relative`}>
          <img
            src={imageUrl}
            alt={alt}
            className={`w-full h-full object-cover ${objectPosition}`}
          />
        </div>
      </div>

      {/* Usage Info */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p><strong>Current settings:</strong></p>
        <p>Aspect Ratio: {selectedRatio.name} ({selectedRatio.ratio})</p>
        <p>Position: {objectPosition.replace('object-', '')}</p>
        <p><strong>CSS Classes:</strong> <code className="bg-white px-1 rounded">{selectedRatio.class} {objectPosition}</code></p>
      </div>
    </div>
  );
}