"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  arrivalTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format. Use HH:MM (24-hour format).",
  }),
  departureTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format. Use HH:MM (24-hour format).",
  }),
  specificReason: z.string().min(1, { message: "Please select a reason" }),
  wantToCarPool: z.boolean().default(false),
  availableSeats: z.number().min(0).max(4).optional(),
  email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

export function BookParkingForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [weeklyTokens, setWeeklyTokens] = useState(2);
  const [monthlyTokens, setMonthlyTokens] = useState(5);
  const [usermail, setUsermail] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      arrivalTime: "",
      departureTime: "",
      specificReason: "",
      wantToCarPool: false,
      availableSeats: 0,
      email: "",
    },
  });

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email == null) {
      router.push("/login");
    } else {
      setUsermail(email);
      form.setValue("email", email);
    }
  }, [router, form]);

  useEffect(() => {
    async function getUser() {
      if (!usermail) return;

      try {
        const response = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: usermail }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const { user } = await response.json();
        setWeeklyTokens(user.weekly_token);
        setMonthlyTokens(user.monthly_token);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setFormError("Failed to load user data. Please try again.");
      }
    }

    getUser();
  }, [usermail]);

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch("/api/book-parking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to submit booking");
      }

      const data = await response.json();
      setWeeklyTokens(data.remainingWeeklyTokens);
      setMonthlyTokens(data.remainingMonthlyTokens);
      form.reset();
      setFormError(null);
    } catch (error) {
      console.error("Booking submission error:", error);
      setFormError(
        "An error occurred while submitting your booking. Please try again."
      );
    }
  };

  return (
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
          name="specificReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specific Reason</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="meeting">Client Meeting</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="earlyStart">Early Start</SelectItem>
                  <SelectItem value="lateFinish">Late Finish</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
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
                  Check this if you're willing to car pool with others.
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

        <div className="space-y-2">
          <p>Weekly Tokens: {weeklyTokens}</p>
          <p>Monthly Tokens: {monthlyTokens}</p>
        </div>
        <Button type="submit">Submit Booking</Button>
      </form>
      {formError && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
    </Form>
  );
}
