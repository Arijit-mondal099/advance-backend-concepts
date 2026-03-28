"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";
import { Profile } from "@/lib/types";
import { ApiResponse } from "@/lib/types/api-response";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [users, setUsers] = useState<Profile[]>([]);
  const router = useRouter();

  async function getAllUsers() {
    try {
      const { data } = await api.get<ApiResponse<Profile[]>>("/admin/users");
      if (data.success && data?.data) setUsers(data.data);
    } catch (err: unknown) {
      const msg =
        err instanceof AxiosError
          ? err.response?.data.message
          : "Something went wrong";
      toast.error(msg);
    }
  }

  async function handleLogout() {
    try {
      const { data } = await api.post<ApiResponse<undefined>>(
        "/auth/logout",
        {},
      );
      if (data.success) {
        toast.success(data.message);
        return router.replace("/sign-in");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof AxiosError
          ? err.response?.data.message
          : "Something went wrong";
      toast.error(msg);
    }
  }

  useEffect(() => {
    async function getProfile() {
      try {
        const { data } = await api.get<ApiResponse<Profile>>("/auth/me");
        if (data.success && data.data) setProfile(data.data);
      } catch (err: unknown) {
        const msg =
          err instanceof AxiosError
            ? err.response?.data.message
            : "Something went wrong";
        toast.error(msg);
      }
    }

    getProfile();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-dvh w-full flex flex-col gap-6 items-center justify-center">
        <h1 className="text-4xl text-destructive font-semibold">
          Oops User Profile not Found!
        </h1>
        <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              <h1>Profile</h1>
            </CardTitle>

            <div className="space-x-2">
              <Button variant={"outline"} onClick={getAllUsers}>
                Get All Users
              </Button>

              <Button variant={"destructive"} onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div>
            <p>{profile?.name}</p>
            <p>{profile?.email}</p>
          </div>

          <div>
            <p>
              Joined on{" "}
              {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                timeZone: "UTC",
              })}
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <p>Builded by @rijitmondal</p>
        </CardFooter>
      </Card>

      <div className="mt-20 container mx-auto">
        <div className="grid md:grid-cols-2 gap-4">
          {users.length > 0 &&
            users.map((user) => (
              <Card key={user._id}>
                <CardContent>
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                  <p>{user.role}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
