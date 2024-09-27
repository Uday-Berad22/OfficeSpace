import React from "react";
import { ComplaintForm } from "@/components/ComplaintForm";

export default function MakeComplaint() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Make a Complaint</h1>
      <ComplaintForm />
    </div>
  );
}
