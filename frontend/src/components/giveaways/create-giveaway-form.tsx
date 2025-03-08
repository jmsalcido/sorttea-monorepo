"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Info, Instagram } from "lucide-react";

import NoSSR from "@/components/ui/no-ssr";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUserProfile } from "@/hooks/use-user";
import { useCreateGiveaway } from "@/hooks/use-giveaways";
import { cn } from "@/lib/utils";

// Define the form schema with validation
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  startDate: z.string().min(1, "A start date is required"),
  endDate: z.string().min(1, "An end date is required"),
  rules: z.object({
    mustFollow: z.boolean().default(true),
    mustLike: z.boolean().default(true),
    mustComment: z.boolean().default(false),
    mustTag: z.number().min(0).max(10).default(0),
    customRules: z.string().max(200, "Custom rules must be less than 200 characters").optional(),
  }),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

type FormData = z.infer<typeof formSchema>;

export function CreateGiveawayForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const createGiveaway = useCreateGiveaway();
  
  // Calculate default dates
  const today = new Date();
  const oneWeekLater = new Date();
  oneWeekLater.setDate(today.getDate() + 7);
  
  const todayFormatted = format(today, "yyyy-MM-dd");
  const oneWeekLaterFormatted = format(oneWeekLater, "yyyy-MM-dd");
  
  // Get the defaultValues for the form
  const defaultValues: FormData = {
    title: "",
    description: "",
    startDate: todayFormatted,
    endDate: oneWeekLaterFormatted,
    rules: {
      mustFollow: true,
      mustLike: true,
      mustComment: false,
      mustTag: 0,
      customRules: "",
    },
  };

  // Set up the form with validation
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    if (!userProfile?.instagramUsername) {
      toast.error("You must connect your Instagram account before creating a giveaway");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Create giveaway in draft state
      await createGiveaway.mutateAsync({
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        rules: data.rules,
        status: "draft", // Always create as draft initially
      });

      toast.success("Giveaway created successfully!");
      router.push("/giveaways");
    } catch (error) {
      console.error("Error creating giveaway:", error);
      toast.error("Failed to create giveaway. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasInstagram = userProfile?.instagramUsername;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Giveaway</CardTitle>
        <CardDescription>
          Set up your new giveaway details and rules
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasInstagram && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20">
            <Info className="h-4 w-4 text-yellow-800 dark:text-yellow-600" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-600">Instagram Connection Required</AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-500">
              You need to connect your Instagram account before launching a giveaway. 
              You can create a draft now and connect Instagram later.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giveaway Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a catchy title for your giveaway" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be the main headline for your giveaway
                  </FormDescription>
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
                    <Textarea
                      placeholder="Describe your giveaway and what prizes are offered"
                      className="min-h-32 resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about the prizes and why people should participate
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        min={todayFormatted}
                      />
                    </FormControl>
                    <FormDescription>
                      When your giveaway begins
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        min={todayFormatted}
                      />
                    </FormControl>
                    <FormDescription>
                      When your giveaway ends
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Participation Rules</h3>
              <p className="text-sm text-muted-foreground">
                Set the requirements for participants to enter your giveaway
              </p>

              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="rules.mustFollow"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Must Follow</FormLabel>
                        <FormDescription>
                          Participants must follow your Instagram account
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rules.mustLike"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Must Like</FormLabel>
                        <FormDescription>
                          Participants must like the giveaway post
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rules.mustComment"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Must Comment</FormLabel>
                        <FormDescription>
                          Participants must comment on the giveaway post
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rules.mustTag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag Friends</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={10}
                          value={field.value.toString()}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of friends participants must tag (0 for none, max 10)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rules.customRules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Rules (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional rules or requirements"
                          className="resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Any special conditions or requirements for your giveaway
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/giveaways")}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Creating..." : "Create as Draft"}
          </Button>
          <Button
            onClick={() => {
              if (!hasInstagram) {
                toast.error("You must connect Instagram before launching a giveaway");
                return;
              }
              // Would normally launch directly
              form.handleSubmit(onSubmit)();
            }}
            disabled={isSubmitting || !hasInstagram}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 w-full sm:w-auto"
          >
            {!hasInstagram ? (
              <>
                <Instagram className="mr-2 h-4 w-4" />
                Connect Instagram to Launch
              </>
            ) : (
              "Create & Launch"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 