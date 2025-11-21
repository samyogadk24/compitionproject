"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { addAnnouncement } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Adding..." : "Add Announcement"}
    </Button>
  );
}

export default function AddAnnouncementForm() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(addAnnouncement, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.errors) {
      toast({
        title: "Success!",
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state.message && state.errors) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);


  return (
    <form ref={formRef} action={dispatch} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
        {state.errors?.title &&
          state.errors.title.map((error: string) => (
            <p className="text-sm font-medium text-destructive" key={error}>
              {error}
            </p>
          ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
         {state.errors?.description &&
          state.errors.description.map((error: string) => (
            <p className="text-sm font-medium text-destructive" key={error}>
              {error}
            </p>
          ))}
      </div>
      <SubmitButton />
    </form>
  );
}
