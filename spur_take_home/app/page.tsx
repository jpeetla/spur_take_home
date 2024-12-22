"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { CustomCalendar } from "@/components/Calendar";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-start pt-10 pl-10">
      <h1 className="text-2xl font-bold mb-5">Scheduled Suites</h1>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2"
      >
        + Schedule Test
      </Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="w-full h-[90vh] px-10 pt-5">
        <CustomCalendar />
      </div>
    </div>
  );
}
