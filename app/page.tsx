"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScheduleModal } from "@/components/ScheduleEventModal";
import { CustomCalendar } from "@/components/Calendar";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  handleNavigate as navigateDate,
  getLabel,
} from "@/utils/calendarNavButton";

export default function Page() {
  const supabase = createClient();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTestSuite, setTestSuite] = useState<string>("");
  const [testSuites, setTestSuites] = useState<string[]>([]);
  const [dateTime, setDateTime] = useState<string>("");
  const [needsRefresh, setNeedsRefresh] = useState<boolean>(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Dynamically retrieve test suites from Supabase
  useEffect(() => {
    async function retrieveTestSuites() {
      const { data: retrievedTestSuites } = await supabase
        .from("testSuites")
        .select();
      setTestSuites(retrievedTestSuites?.map((suite) => suite.name) || []);
      setTestSuite((retrievedTestSuites && retrievedTestSuites[0]?.name) || "");
    }
    retrieveTestSuites();
  }, [supabase]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleNavigate = (action: string) => {
    const newDate = navigateDate(currentDate, action);
    setCurrentDate(newDate);
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-start pt-10 pl-10 pr-10">
      <h1 className="text-2xl font-bold mb-5">Scheduled Suites</h1>

      <div className="flex items-center space-x-4 mb-4">
        {/* Schedule Recurring Test Button */}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-750 text-white font-semibold rounded-lg px-4 py-2 w-40"
        >
          + Schedule Test
        </Button>

        {/* Calendar Navigation Button */}
        <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
          <button
            onClick={() => handleNavigate("PREV")}
            className="text-gray-600 font-bold text-lg p-1"
          >
            &#x2039;
          </button>
          <span className="text-gray-800 font-semibold text-md">
            {getLabel(currentDate)}
          </span>
          <button
            onClick={() => handleNavigate("NEXT")}
            className="text-gray-600 font-bold text-lg p-1"
          >
            &#x203A;
          </button>
        </div>
      </div>

      {/* Modal to Schedule Recurring Test Event */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supabase={supabase}
        router={router}
        testSuites={testSuites}
        selectedTestSuite={selectedTestSuite}
        setTestSuite={setTestSuite}
        dateTime={dateTime}
        setDateTime={setDateTime}
        selectedDays={selectedDays}
        toggleDay={toggleDay}
        setNeedsRefresh={setNeedsRefresh}
      />

      {/* Calendar Week View to Display Recurring Test Events */}
      <div className="pt-5">
        <CustomCalendar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          needsRefresh={needsRefresh}
          setNeedsRefresh={setNeedsRefresh}
        />
      </div>
    </div>
  );
}
