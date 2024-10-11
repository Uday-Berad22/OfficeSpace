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
import { allocateParking } from "@/actions/parkingAllotment";

interface Allocation {
  name: string;
  parkingSpot: string;
}

export function ParkingAllottedList() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  useEffect(() => {
    const fetchAllocations = async () => {
      const data = await allocateParking();
      setAllocations(data);
    };

    fetchAllocations();
  }, []);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Parking Spot</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allocations.map((allocation, index) => (
            <TableRow key={index}>
              <TableCell>{allocation.name}</TableCell>
              <TableCell>{allocation.parkingSpot}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
