"use client";

import { useState } from "react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useFirestore, useAuth, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Query, where } from "firebase/firestore";
import type { Announcement } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useUser } from "@/firebase/auth/use-user";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

type AnnouncementFormData = Omit<Announcement, "id" | "authorId" | "date"> & { date: string };

function AnnouncementForm({
  announcement,
  onSave,
  onClose,
}: {
  announcement?: Announcement;
  onSave: (data: AnnouncementFormData) => void;
  onClose: () => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<AnnouncementFormData>({
    defaultValues: announcement ? {
        ...announcement,
        date: new Date(announcement.date).toISOString().substring(0, 10),
    } : {
        title: '',
        shortDescription: '',
        content: '',
        date: new Date().toISOString().substring(0, 10)
    },
  });

  const onSubmit = (data: AnnouncementFormData) => {
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
        <Label htmlFor="shortDescription">Short Description</Label>
        <Input id="shortDescription" {...register("shortDescription", { required: "Short description is required" })} />
        {errors.shortDescription && <p className="text-destructive text-sm mt-1">{errors.shortDescription.message}</p>}
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" {...register("content")} className="min-h-[150px]" />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Save Announcement</Button>
      </div>
    </form>
  );
}


export default function AnnouncementsManager() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | undefined>(undefined);

  const announcementsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
        collection(firestore, "announcements"), 
        where("authorId", "==", user.id),
        orderBy("date", "desc")
    ) as Query<Announcement>;
  }, [firestore, user]);

  const { data: announcements, isLoading } = useCollection<Announcement>(announcementsQuery);
  const auth = useAuth();
  
  const handleSave = (data: AnnouncementFormData) => {
    if (!firestore || !auth.currentUser) return;
    
    const announcementData = {
        ...data,
        date: new Date(data.date).toISOString(),
        authorId: auth.currentUser.uid,
    };

    if (editingAnnouncement) {
      const docRef = doc(firestore, "announcements", editingAnnouncement.id);
      updateDoc(docRef, announcementData)
        .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: announcementData
        })));
    } else {
      addDoc(collection(firestore, "announcements"), announcementData)
        .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: `announcements`,
            operation: 'create',
            requestResourceData: announcementData
        })));
    }
  };
  
  const handleDelete = (id: string) => {
      if(!firestore) return;
      if (confirm("Are you sure you want to delete this announcement?")) {
        const docRef = doc(firestore, "announcements", id);
        deleteDoc(docRef)
            .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: docRef.path,
                operation: 'delete',
            })));
      }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Announcements</CardTitle>
          <CardDescription>Create, edit, and delete school announcements.</CardDescription>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAnnouncement(undefined)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? "Edit" : "Create"} Announcement</DialogTitle>
            </DialogHeader>
            <AnnouncementForm 
                announcement={editingAnnouncement}
                onSave={handleSave}
                onClose={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {isLoading && <p>Loading announcements...</p>}
            {announcements?.map(announcement => (
                <div key={announcement.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-semibold">{announcement.title}</h3>
                        <p className="text-sm text-muted-foreground">{new Date(announcement.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingAnnouncement(announcement); setIsFormOpen(true); }}>
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(announcement.id)}>
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
