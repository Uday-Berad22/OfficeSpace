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

interface Allocation {
  user_id: string;
  name: string;
  parking_spot: string;
  priority: number;
}

export function ParkingAllottedList() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  useEffect(() => {
    // Fetch allocations from API
    const fetchAllocations = async () => {
      // Replace with actual API call
      const response = await fetch("/api/allocations");
      const data = await response.json();
      setAllocations(data);
    };

    fetchAllocations();
  }, []);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Parking Spot</TableHead>
            <TableHead>Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allocations.map((allocation) => (
            <TableRow key={allocation.user_id}>
              <TableCell>{allocation.user_id}</TableCell>
              <TableCell>{allocation.name}</TableCell>
              <TableCell>{allocation.parking_spot}</TableCell>
              <TableCell>{allocation.priority}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
