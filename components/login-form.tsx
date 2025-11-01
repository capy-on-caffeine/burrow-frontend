"use client"
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const BACKEND_URL = "http://localhost:5000";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        setMessage("Login successful!");
        setIsError(false);
        setEmail("");
        setPassword("");
      } else {
        throw new Error("Login successful, but no token received.");
      }

    } catch (error: any) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
          </div>
          <CardTitle className="text-white text-center text-2xl">Welcome Back</CardTitle>
          <CardDescription className="text-slate-400 text-center">
            Login to continue your journey through knowledge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {message && (
                <p className={`text-sm ${isError ? 'text-red-400' : 'text-green-400'}`}>
                  {message}
                </p>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-orange-500"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-slate-300">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-orange-500 hover:text-orange-400"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-orange-500"
                />
              </div>
              <div className="space-y-2 pt-2">
                <Button type="submit" className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <Button variant="outline" type="button" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                  Login with Google
                </Button>
                <p className="text-center text-sm text-slate-400">
                  Don&apos;t have an account? <a href="/signup" className="underline text-orange-500 hover:text-orange-400">Sign up</a>
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
