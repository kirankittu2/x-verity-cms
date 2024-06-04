"use server";

import { cookies } from "next/headers";

export async function getSessionId(key) {
  const cookieStore = cookies();
  return cookieStore.get(key)?.value;
}

async function setSessionId(key, value) {
  const cookieStore = cookies();
  cookieStore.set(key, value);
}

export async function get(key) {
  const session = getSessionId(key);
  if (!session) {
    return null;
  }
  return session;
}

export async function set(key, value) {
  setSessionId(key, value);
}
