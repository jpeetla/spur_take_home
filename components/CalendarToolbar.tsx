import React from "react";
import { Button } from "@/components/ui/button";

export function CustomToolbar({
  label,
  onNavigate,
}: {
  label: string;
  onNavigate: (action: string) => void;
}) {
  return (
    <div className="flex justify-center items-center space-x-4 border border-gray-300 rounded-lg p-2 shadow-sm">
      <button
        onClick={() => onNavigate("PREV")}
        className="text-gray-600 font-bold text-lg p-1"
      >
        &#x2039; {/* Left arrow symbol */}
      </button>
      <span className="text-gray-800 font-semibold">{label}</span>
      <button
        onClick={() => onNavigate("NEXT")}
        className="text-gray-600 font-bold text-lg p-1"
      >
        &#x203A; {/* Right arrow symbol */}
      </button>
    </div>
  );
}
