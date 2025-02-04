"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export function ComplaintForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm({
    defaultValues: {
      user_id: "",
      subject: "",
      description: "",
      attachment: null,
    },
  });

  const onSubmit = async (data: {
    user_id: string;
    subject: string;
    description: string;
    attachment: FileList | null;
  }) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError("");

    const formData = new FormData();
    formData.append("user_id", data.user_id);
    formData.append("subject", data.subject);
    formData.append("description", data.description);
    if (data.attachment && data.attachment[0]) {
      formData.append("attachment", data.attachment[0]);
    }

    try {
      const response = await fetch("/api/make-complaint", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit complaint");
      }

      setSubmitSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setSubmitError(
        (error as Error).message || "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="attachment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attachment (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </Button>
        </form>
      </Form>

      {submitSuccess && (
        <Alert>
          <AlertDescription>Complaint submitted successfully!</AlertDescription>
        </Alert>
      )}

      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
