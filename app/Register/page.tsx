import Image from "next/image";
import Link from "next/link";
import { FileText, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import RegisterHandlerForm from "@/components/register_form";
import { createClient } from "@/lib/server";

export default async function RegisterPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/Circles");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="grid size-7 place-items-center rounded bg-brand text-brand-foreground">
            <FileText className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            Paper Check
          </span>
        </div>

        <RegisterHandlerForm />
      </div>
    </div>
  );
}
