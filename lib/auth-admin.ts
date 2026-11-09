import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/neon";

export async function getAdminUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const result = await sql`
    SELECT id, email, role
    FROM "user"
    WHERE id = ${session.user.id}
    LIMIT 1
  `;

  const user = result[0];

  if (!user || user.role !== "admin") {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}
