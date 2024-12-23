"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { CustomCalendar } from "@/components/Calendar";
import { createClient } from "@/utils/supabase/client";
import moment from "moment";

const queryClient = new QueryClient();

export default function Page() {
  const supabase = createClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTestSuite, setTestSuite] = useState<string>("");
  const [testSuites, setTestSuites] = useState<string[]>([]);
  const [dateTime, setDateTime] = useState<string>("");

  const [currentDate, setCurrentDate] = useState(new Date());

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

  const handleNavigate = (action: string) => {
    let newDate = currentDate;
    if (action === "NEXT") {
      newDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
    } else if (action === "PREV") {
      newDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
    } else if (action === "TODAY") {
      newDate = new Date();
    }
    setCurrentDate(newDate);
  };

  const getLabel = () => {
    const startOfWeek = moment(currentDate).startOf("week").format("MMMM DD");
    const endOfWeek = moment(currentDate).endOf("week").format("MMMM DD");
    return `${startOfWeek} – ${endOfWeek}`;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full min-h-screen flex flex-col justify-start pt-10 pl-10 pr-10">
        <h1 className="text-2xl font-bold mb-5">Scheduled Suites</h1>
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-750 text-white font-semibold rounded-lg px-4 py-2 w-40"
          >
            + Schedule Test
          </Button>

          <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => handleNavigate("PREV")}
              className="text-gray-600 font-bold text-lg p-1"
            >
              &#x2039;
            </button>
            <span className="text-gray-800 font-semibold text-md">
              {getLabel()}
            </span>
            <button
              onClick={() => handleNavigate("NEXT")}
              className="text-gray-600 font-bold text-lg p-1"
            >
              &#x203A;
            </button>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Schedule Detail</h2>
          <form>
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

            <div className="flex flex-col gap-2 mb-4">
              <label className="block text-gray-700 font-medium">
                Run weekly on:
              </label>
              <div className="flex gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
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
                  )
                )}
              </div>
            </div>

            <div className="flex justify-between gap-2">
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

        <div className="pt-5">
          <CustomCalendar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
