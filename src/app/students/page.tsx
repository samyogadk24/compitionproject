'use client';

import { useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import { collection, query, Query } from 'firebase/firestore';
import type { Student } from '@/lib/definitions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

function StudentCard({ student }: { student: Student }) {
  const initials = `${student.firstName?.[0] ?? ''}${student.lastName?.[0] ?? ''}`;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-bold font-headline">
              {student.firstName} {student.lastName}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{student.email}</p>
      </CardContent>
    </Card>
  );
}

function PageSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-[200px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function StudentsPage() {
  const firestore = useFirestore();
  const studentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // The explicit type cast is required here.
    return query(collection(firestore, 'students')) as Query<Student>;
  }, [firestore]);

  const { data: students, isLoading } = useCollection<Student>(studentsQuery);

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="flex items-center gap-4 mb-8">
          <Users className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold font-headline">Student Directory</h1>
            <p className="text-muted-foreground">
              Find and connect with other students.
            </p>
          </div>
        </div>

        {isLoading ? (
          <PageSkeleton />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {students?.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
