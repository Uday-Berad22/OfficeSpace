import React from "react";
import { ParkingAllottedList } from "@/components/ParkingAllottedList";

export default function ParkingAllotted() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Parking Allotted</h1>
      <ParkingAllottedList />
    </div>
  );
}
