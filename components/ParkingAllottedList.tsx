"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ParkingAllotment = {
  userId: string;
  userName: string;
  area: number;
  date: string;
};

export function ParkingAllottedList() {
  const [allotments, setAllotments] = useState<ParkingAllotment[]>([]);

  useEffect(() => {
    const fetchAllotments = async () => {
      const response = await fetch("/api/parking-allotted");
      if (response.ok) {
        const data = await response.json();
        setAllotments(data);
      }
    };

    fetchAllotments();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Area</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allotments.map((allotment, index) => (
          <TableRow key={index}>
            <TableCell>{allotment.userName}</TableCell>
            <TableCell>{allotment.area}</TableCell>
            <TableCell>
              {new Date(allotment.date).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
