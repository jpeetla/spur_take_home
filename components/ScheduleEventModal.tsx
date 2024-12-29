"use client";

import React from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { saveEvent } from "@/utils/saveEvent";
import { SupabaseClient } from "@supabase/supabase-js";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  supabase: SupabaseClient;
  router: any;
  testSuites: string[];
  selectedTestSuite: string;
  setTestSuite: (val: string) => void;
  dateTime: string;
  setDateTime: (val: string) => void;
  selectedDays: string[];
  toggleDay: (day: string) => void;
  setNeedsRefresh: (val: boolean) => void;
}

export function ScheduleModal({
  isOpen,
  onClose,
  supabase,
  router,
  testSuites,
  selectedTestSuite,
  setTestSuite,
  dateTime,
  setDateTime,
  selectedDays,
  toggleDay,
  setNeedsRefresh,
}: ScheduleModalProps) {
  if (!isOpen) return null;

  async function handleSaveClick() {
    const selectedDate = new Date(dateTime);
    const currentDay = selectedDate.toLocaleString("en-US", {
      weekday: "short",
    });

    if (selectedDate < new Date()) {
      alert("Start date cannot be in the past. Please select a valid date...");
    } else if (!selectedDays.includes(currentDay)) {
      alert(
        "Start date must be in the recurring days. Please select a valid start date or change the recurring days..."
      );
    } else if (selectedDays.length === 0) {
      alert("Please select at least one recurring day...");
    } else {
      await saveEvent({
        supabase,
        router,
        dateTime,
        selectedDays,
        selectedTestSuite,
      });
      setNeedsRefresh(true);
      onClose();
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Schedule Detail</h2>
      <form>
        {/* Test Suite Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Test Suite
          </label>
          <div className="relative">
            <select
              className="w-full border border-gray-300 rounded-lg p-3 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              value={selectedTestSuite}
              onChange={(e) => setTestSuite(e.target.value)}
            >
              {testSuites.map((suite) => (
                <option key={suite}>{suite}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Start Date and Time */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Start Date and Time
          </label>
          <input
            type="datetime-local"
            className="w-full border rounded p-2 mt-1"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>

        {/* Choosing Recurring Days */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="block text-gray-700 font-medium">
            Run weekly on:
          </label>
          <div className="flex gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`border rounded px-3 py-1 ${
                  selectedDays.includes(day)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between gap-2">
          {/* Cancel Schedule Button */}
          <Button
            onClick={onClose}
            className="bg-red-500 text-white font-bold px-4 py-2 rounded"
          >
            Cancel Schedule
          </Button>

          {/* Save Changes Button */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleSaveClick();
            }}
            className="bg-blue-500 text-white font-bold px-4 py-2 rounded"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
