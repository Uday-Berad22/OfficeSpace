"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { bookParking } from "../actions/bookParking";
import { Toaster, toast } from "react-hot-toast";

const formSchema = z.object({
  arrivalTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format. Use HH:MM (24-hour format).",
  }),
  departureTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format. Use HH:MM (24-hour format).",
  }),
  wantToCarPool: z.boolean().default(false),
  availableSeats: z.number().min(0).max(4).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function BookParkingForm() {
  const [isFormAvailable, setIsFormAvailable] = useState(false);
  const [hasActiveBooking, setHasActiveBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      arrivalTime: "",
      departureTime: "",
      wantToCarPool: false,
      availableSeats: 0,
    },
  });

  useEffect(() => {
    const checkFormAvailability = () => {
      const now = new Date();
      const hours = now.getHours();
      setIsFormAvailable(hours >= 12 && hours < 24);
    };

    const checkExistingBooking = async () => {
      try {
        const response = await fetch("/api/book-parking", {
          method: "GET",
        });
        const data = await response.json();
        setHasActiveBooking(data.hasActiveBooking);
        if (data.hasActiveBooking) {
          setBookingMessage(data.message);
        }
      } catch (error) {
        console.error("Error checking booking status:", error);
        toast.error("Failed to check booking status. Please try again later.");
      }
    };

    checkFormAvailability();
    checkExistingBooking();
    const interval = setInterval(checkFormAvailability, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (hasActiveBooking) {
      toast.error(
        "You already have an active booking. You cannot submit a new booking at this time."
      );
      return;
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const result = await bookParking(formData);

    if (result.error) {
      toast.error(result.error, {
        duration: 4000,
        position: "top-center",
      });
    } else if (result.success) {
      toast.success(result.message || "Booking successful!", {
        duration: 4000,
        position: "top-center",
      });
      setHasActiveBooking(true);
      setBookingMessage(
        "You have successfully submitted a booking. You cannot submit a new booking at this time."
      );
      form.reset();
    } else {
      toast.error("An unexpected error occurred", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  if (!isFormAvailable) {
    return (
      <Alert variant="default" className="mt-4">
        <AlertTitle>
          Booking form is only available between 6 PM and 11:59 PM.
        </AlertTitle>
      </Alert>
    );
  }

  if (hasActiveBooking) {
    return (
      <Alert variant="default" className="mt-4">
        <AlertTitle>{bookingMessage}</AlertTitle>
      </Alert>
    );
  }

  return (
    <>
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="arrivalTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arrival Time</FormLabel>
                <FormControl>
                  <Input placeholder="HH:MM" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your arrival time in 24-hour format.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="departureTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure Time</FormLabel>
                <FormControl>
                  <Input placeholder="HH:MM" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your departure time in 24-hour format.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wantToCarPool"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Want to Car Pool?</FormLabel>
                  <FormDescription>
                    Check this if youre willing to car pool with others.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          {form.watch("wantToCarPool") && (
            <FormField
              control={form.control}
              name="availableSeats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Seats</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the number of available seats in your car.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit">Submit Booking</Button>
        </form>
      </Form>
    </>
  );
}
