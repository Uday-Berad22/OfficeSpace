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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CarPoolOffer {
  user_id: string;
  name: string;
  route: string;
  departure_time: string;
}

export default function CarPooling() {
  const [offers, setOffers] = useState<CarPoolOffer[]>([]);
  const form = useForm<CarPoolOffer>();

  useEffect(() => {
    // Fetch car pool offers from API
    const fetchOffers = async () => {
      // Replace with actual API call
      const response = await fetch("/api/car-pool-offers");
      const data = await response.json();
      setOffers(data);
    };

    fetchOffers();
  }, []);

  const onSubmit = async (data: CarPoolOffer) => {
    // Handle form submission
    console.log(data);
    // Here you would typically send this data to your API
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="route"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Route</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="departure_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Offer Ride</Button>
        </form>
      </Form>

      <h2 className="text-xl font-semibold mt-8 mb-4">Available Rides</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <Card key={offer.user_id}>
            <CardHeader>
              <CardTitle>{offer.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Route: {offer.route}</p>
              <p>Departure: {offer.departure_time}</p>
              <Button className="mt-2">Request Ride</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
