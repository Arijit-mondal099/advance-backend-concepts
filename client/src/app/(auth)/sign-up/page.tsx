"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { ApiResponse } from "@/lib/types/api-response";
import { SignUpType, signupSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SignUp() {
  const form = useForm<SignUpType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter()

  async function onSubmit(formData: SignUpType) {
    try {
        const { data } = await api.post<ApiResponse<undefined>>("/auth/sign-up", formData);
        if (data.success) {
            form.reset()
            toast.success(data.message);
            return router.replace("/sign-in");
        } 
    } catch (err: unknown) {
        const msg = err instanceof AxiosError ? err.response?.data.message : "Something went wrong";
        toast.error(msg);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <h1>Sign Up</h1>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input { ...form.register("name") } type="text" id="name" placeholder="jhon doe" />
            </div>
            <div className="space-y-1">
                <Label htmlFor="name">Email</Label>
                <Input { ...form.register("email") } type="email" id="email" placeholder="jhon@xyz.com" />
            </div>
            <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input { ...form.register("password") } type="text" id="password" placeholder="jhon doe" />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
            <p>Alredy have an account then <Link href="/sign-in" className="text-blue-500">Sign In</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}
