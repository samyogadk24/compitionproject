"use client";

import { useState } from "react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useFirestore, useAuth, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc, Query } from "firebase/firestore";
import type { Event } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useUser } from "@/firebase/auth/use-user";

type EventFormData = Omit<Event, "id" | "authorId" | "date"> & { date: string };

function EventForm({
  event,
  onSave,
  onClose,
}: {
  event?: Event;
  onSave: (data: EventFormData) => void;
  onClose: () => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>({
    defaultValues: event ? {
      ...event,
      date: new Date(event.date).toISOString().substring(0, 10),
    } : {
      title: '',
      description: '',
      date: new Date().toISOString().substring(0, 10)
    },
  });

  const onSubmit = (data: EventFormData) => {
    onSave(data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title", { required: "Title is required" })} />
        {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" {...register("date", { required: "Date is required" })} />
        {errors.date && <p className="text-destructive text-sm mt-1">{errors.date.message}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description", { required: "Description is required" })} />
        {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Save Event</Button>
      </div>
    </form>
  );
}

export default function EventsManager() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);

  const eventsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, "events"), orderBy("date", "desc")) as Query<Event>;
  }, [firestore, user]);

  const { data: events, isLoading } = useCollection<Event>(eventsQuery);
  const auth = useAuth();
  
  const handleSave = async (data: EventFormData) => {
    if (!firestore || !auth.currentUser) return;

    const eventData = {
      ...data,
      date: new Date(data.date).toISOString(),
      authorId: auth.currentUser.uid,
    };

    if (editingEvent) {
      const docRef = doc(firestore, "events", editingEvent.id);
      await updateDoc(docRef, eventData);
    } else {
      await addDoc(collection(firestore, "events"), eventData);
    }
  };
  
  const handleDelete = async (id: string) => {
      if(!firestore) return;
      if (confirm("Are you sure you want to delete this event?")) {
        await deleteDoc(doc(firestore, "events", id));
      }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Events</CardTitle>
          <CardDescription>Create, edit, and delete school events.</CardDescription>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingEvent(undefined)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit" : "Create"} Event</DialogTitle>
            </DialogHeader>
            <EventForm 
                event={editingEvent}
                onSave={handleSave}
                onClose={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {isLoading && <p>Loading events...</p>}
            {events?.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingEvent(event); setIsFormOpen(true); }}>
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(event.id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
