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

interface Booking {
  email: string;
  arrivalTime: string;
  departureTime: string;
  wantToCarPool: boolean;
  availableSeats: number;
  name: string;
}

export function ParkingAllottedList() {
  const [approvedBookings, setApprovedBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchApprovedBookings = async () => {
      try {
        const response = await fetch("/api/parking-allotted", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setApprovedBookings(data.approvedBookings);
        } else {
          console.error("Failed to fetch approved bookings");
        }
      } catch (error) {
        console.error("Error fetching approved bookings:", error);
      }
    };

    fetchApprovedBookings();
  }, []);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Arrival Time</TableHead>
            <TableHead>Departure Time</TableHead>
            <TableHead>Want to Carpool</TableHead>
            <TableHead>Available Seats</TableHead>
            <TableHead>Parking Spot</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {approvedBookings.map((booking, index) => (
            <TableRow key={index}>
              <TableCell>{booking.name}</TableCell>
              <TableCell>{booking.email}</TableCell>
              <TableCell>{booking.arrivalTime}</TableCell>
              <TableCell>{booking.departureTime}</TableCell>
              <TableCell>{booking.wantToCarPool ? "Yes" : "No"}</TableCell>
              <TableCell>{booking.availableSeats}</TableCell>
              <TableCell>{index + 1}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
