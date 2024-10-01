"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function BookParkingForm() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const form = useForm<{
    user_id: string;
  }>();

  useEffect(() => {
    const checkFormAvailability = () => {
      const now = new Date();
      const hour = now.getHours();
      setIsFormOpen(hour >= 20 || hour < 0);
    };

    checkFormAvailability();
    const interval = setInterval(checkFormAvailability, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data: { user_id: string }) => {
    // Handle form submission
    console.log(data);
    // Here you would typically send this data to your API
  };

  if (!isFormOpen) {
    return <p>Booking is only available from 8 PM to 12 AM.</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Add more form fields as needed */}
        <Button type="submit">Book Parking</Button>
      </form>
    </Form>
  );
}
