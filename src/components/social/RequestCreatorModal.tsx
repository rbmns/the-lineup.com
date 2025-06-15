
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  reason: z.string().min(10, { message: "Please provide a reason (at least 10 characters)." }),
  contact_email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  contact_phone: z.string().optional(),
}).refine(data => !!data.contact_email || !!data.contact_phone, {
  message: "Please provide either an email or a phone number.",
  path: ["contact_phone"],
});

type CreatorRequestFormValues = z.infer<typeof formSchema>;

interface RequestCreatorModalProps {
  open: boolean;
  onClose: () => void;
  onRequest: (data: CreatorRequestFormValues) => void;
  requestStatus: string | null;
}

export const RequestCreatorModal: React.FC<RequestCreatorModalProps> = ({
  open,
  onClose,
  onRequest,
  requestStatus,
}) => {
  const hasPendingRequest = requestStatus === 'pending';

  const form = useForm<CreatorRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
      contact_email: "",
      contact_phone: "",
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
      onClose();
    }
  };

  const onSubmit = (data: CreatorRequestFormValues) => {
    onRequest(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Become an Event Creator</DialogTitle>
          {!hasPendingRequest && (
            <DialogDescription>
              Tell us why you'd like to create events and how we can reach you.
            </DialogDescription>
          )}
        </DialogHeader>
        
        {hasPendingRequest ? (
          <>
            <div className="py-4">
              <div className="text-green-600 font-semibold text-center">
                Your request has been submitted! We'll review it and get in touch soon.
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onClose} variant="default" className="w-full">Close</Button>
            </DialogFooter>
          </>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Request</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., I organize weekly yoga sessions for the community." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 123 456 7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" variant="default" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Submitting...' : 'Request Creator Access'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
