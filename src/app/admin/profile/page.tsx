import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { trpcCaller } from "@/trpc/server";

export default async function AdminProfilePage() {
  const trpc = await trpcCaller();
  const user = await trpc.user.me();
  // Same stale-session race as the customer profile page — a session
  // cookie can briefly outlive the account behind it right after
  // self-deletion.
  if (!user) redirect("/login");

  return <ProfileForm user={user} locale="en" variant="admin" />;
}
