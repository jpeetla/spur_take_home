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
    <div className="flex justify-between items-center mb-5">
      <Button
        onClick={() => onNavigate("PREV")}
        className="bg-blue-500 text-white font-bold px-4 py-2 rounded"
      >
        Back
      </Button>
      <span className="text-lg font-semibold">{label}</span>
      <Button
        onClick={() => onNavigate("NEXT")}
        className="bg-blue-500 text-white font-bold px-4 py-2 rounded"
      >
        Next
      </Button>
    </div>
  );
}
