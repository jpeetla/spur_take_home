"use client";

import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { CustomCalendar } from "@/components/Calendar";
import { createClient } from "@/utils/supabase/client";

export default function Page() {
  const supabase = createClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTestSuite, setTestSuite] = useState<string>("");
  const [testSuites, setTestSuites] = useState<string[]>([]);
  const [dateTime, setDateTime] = useState<string>("");

  useEffect(() => {
    async function retrieveTestSuites() {
      const { data: retrievedTestSuites } = await supabase
        .from("testSuites")
        .select();
      setTestSuites(retrievedTestSuites?.map((suite) => suite.name) || []);
      setTestSuite((retrievedTestSuites && retrievedTestSuites[0]?.name) || "");
    }

    retrieveTestSuites();
  }, []);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  async function saveToSupa() {
    const startDateObject = new Date(dateTime);
    const endDateObject = new Date(startDateObject.getTime() + 60 * 60 * 1000);
    const formattedDays = selectedDays
      .map((day) => day.toUpperCase().slice(0, 2))
      .join(",");
    console.log(selectedTestSuite);
    const formattedRule = `RRULE:FREQ=WEEKLY;BYDAY=${formattedDays}`;

    await supabase.from("schedule").insert([
      {
        title: selectedTestSuite,
        start: startDateObject.toISOString(),
        end: endDateObject.toISOString(),
        rRule: formattedRule,
      },
    ]);
  }

  return (
    <div className="min-h-screen flex flex-col justify-start pt-10 pl-10">
      <h1 className="text-2xl font-bold mb-5">Scheduled Suites</h1>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2"
      >
        + Schedule Test
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Schedule Detail</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Test Suite
            </label>
            <select
              className="w-full border rounded p-2 mt-1"
              value={selectedTestSuite}
              onChange={(e) => setTestSuite(e.target.value)}
            >
              {testSuites.map((suite) => (
                <option key={suite}>{suite}</option>
              ))}
            </select>
          </div>

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

          <div className="flex gap-2 mb-4">
            <label className="block text-gray-700 font-medium">
              Run weekly on:
            </label>
            <div className="flex gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`border rounded px-2 py-1 ${
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

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setIsModalOpen(false)}
              className="bg-red-500 text-white font-bold px-4 py-2 rounded"
            >
              Cancel Schedule
            </Button>
            <Button
              onClick={() => {
                saveToSupa();
                setIsModalOpen(false);
              }}
              className="bg-blue-500 text-white font-bold px-4 py-2 rounded"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      <div className="w-full h-[90vh] px-10 pt-5">
        <CustomCalendar />
      </div>
    </div>
  );
}
