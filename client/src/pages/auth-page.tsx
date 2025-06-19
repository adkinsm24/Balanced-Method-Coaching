import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema, type LoginUser } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function AuthPage() {
  const { user, loginMutation } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user && (user as any)?.hasCourseAccess) {
      setLocation("/course");
    } else if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginUser>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLogin = (data: LoginUser) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to access your nutrition course.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center">
              <button 
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
                onClick={() => {
                  // TODO: Implement forgot password functionality
                  alert("Please contact mark@balancedmethodcoaching.com for password reset assistance.");
                }}
              >
                Forgot your password?
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}