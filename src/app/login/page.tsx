import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SchoolPulseLogo } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
               <SchoolPulseLogo className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold font-headline">Student Login</CardTitle>
            <CardDescription>
              Login is currently disabled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">Please check back later.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
