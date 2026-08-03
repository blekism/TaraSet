"use server";

import { createClient } from "@/lib/server";
import * as auth from "@/services/auth";
// import * as cf from "@/repositories/circleFunctions";

export async function CreateCircle(_previousState: any, formdata: FormData) {
  const supabase = await createClient();

  function generateCircleCode(length = 6): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  }

  const circleName = formdata.get("name") as string;

  const { data, error } = await supabase
    .from("cicles_tbl")
    .insert({
      circle_name: circleName,
      circle_code: generateCircleCode,
    })
    .select()
    .single();

    if (error) {
      console.log(error);
      return {
        code: 0,
        message: "An error has occurred. Please try again later",
      };
    }
    console.log("data is: ", data);
    return {
        code: 0,
        message: "Circle Created Successfully.",
        data: data,
    };
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
