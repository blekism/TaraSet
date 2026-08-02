"use server";

import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import * as auth from "@/services/auth";
// import * as cf from "@/repositories/circleFunctions";

export async function CreateCircle(_previousState: any, formdata: FormData) {
  const circleName = formdata.get("name") as string;
}

export async function Login(_previousState: any) {
  const supabase = await createClient();

  try {
    const result = await auth.login(supabase);

    if (result.code === 500) {
      return {
        success: false,
        message: "An error has occured, please try again later.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "An error has occured, please try again later.",
    };
  }
}
