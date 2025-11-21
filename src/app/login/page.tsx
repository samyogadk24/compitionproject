import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./_components/login-form";
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
              Access your dashboard and resources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
