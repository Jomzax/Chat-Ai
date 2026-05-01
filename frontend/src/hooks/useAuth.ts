"use client";

import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/api/auth";

export function useAuth() {
  const router = useRouter();

  async function login(username: string, password: string) {
    return loginUser(username, password);
  }

  async function register(email: string, password: string) {
    return registerUser(email, password);
  }

  async function currentUser() {
    return getCurrentUser();
  }

  async function logout() {
    await logoutUser();
    router.push("/login");
    router.refresh();
  }

  return { currentUser, login, logout, register };
}
