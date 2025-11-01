"use client"

import { useState } from "react";
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


export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    console.log("Form submitted with:", { name, email, password, confirmPassword });

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const userData = {
      username: name,
      email: email,
      password: password,
    };
    const BACKEND_URL = "http://localhost:5000";
    try {
      console.log("Submitting user data:", userData);
      const response = await fetch(`${BACKEND_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      setMessage("User registered successfully! You can now sign in.");
      setIsError(false);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (error: any) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card {...props} className="bg-slate-900/80 backdrop-blur-md border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
        </div>
        <CardTitle className="text-white text-center text-2xl">Join Burrow</CardTitle>
        <CardDescription className="text-slate-400 text-center">
          Start exploring the graph of knowledge
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
              <Label htmlFor="name" className="text-slate-300">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-orange-500"
              />
            </div>
            
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
              <p className="text-sm text-slate-400">
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-orange-500"
              />
              <p className="text-sm text-slate-400">
                Must be at least 8 characters long.
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="confirm-password" className="text-slate-300">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-orange-500"
              />
              <p className="text-sm text-slate-400">Please confirm your password.</p>
            </div>
            
            <div className="space-y-2 pt-2">
              <Button type="submit" className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              <Button variant="outline" type="button" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                Sign up with Google
              </Button>
              <p className="px-6 text-center text-sm text-slate-400">
                Already have an account? <a href="/login" className="underline text-orange-500 hover:text-orange-400">Sign in</a>
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

