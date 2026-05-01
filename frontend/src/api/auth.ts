const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

async function parseAuthResponse(response: Response) {
  const payload = (await response.json().catch(() => null)) as
    | { message?: string; user?: AuthUser }
    | null;

  if (!response.ok || !payload?.user) {
    throw new Error(payload?.message ?? "Authentication failed.");
  }

  return payload.user;
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  return parseAuthResponse(response);
}

export async function registerUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
      name: email.split("@")[0],
    }),
  });

  return parseAuthResponse(response);
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/auth/session`, {
    credentials: "include",
  });

  return parseAuthResponse(response);
}

export async function logoutUser() {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
