"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CustomCalendar } from "@/components/Calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Scheduled Suites</h1>
      <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2">
        + Schedule Test
      </Button>

      <div className="w-full h-[90vh] px-10 pt-5">
        <CustomCalendar />
      </div>
    </div>
  );
}
