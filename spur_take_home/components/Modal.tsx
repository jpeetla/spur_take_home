import React from "react";
import { Button } from "@/components/ui/button";

export function Modal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Schedule Detail</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Test Suite
            </label>
            <select className="w-full border rounded p-2 mt-1">
              <option>Demo Suite</option>
              <option>Authentication</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Start Date and Time
            </label>
            <input
              type="datetime-local"
              className="w-full border rounded p-2 mt-1"
            />
          </div>
          <div className="flex gap-2 mb-4">
            <label className="block text-gray-700 font-medium">
              Run Weekly on:
            </label>
            <div className="flex gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <button
                  key={day}
                  type="button"
                  className="border rounded px-2 py-1 bg-gray-200 hover:bg-gray-300"
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              onClick={onClose}
              className="bg-red-500 text-white font-bold px-4 py-2 rounded"
            >
              Cancel Schedule
            </Button>
            <Button className="bg-blue-500 text-white font-bold px-4 py-2 rounded">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
