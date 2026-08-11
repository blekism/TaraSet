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
        code: 1,
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

export async function ValidateCode(code: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cicle_members_tbl")
    .select("*")
    .eq("circle_code", code)
    .maybeSingle();

    if (error) {
      console.log(error);
      return {
        code: 0,
        message: "An error has occurred. Please try again later",
      };
    }
    console.log("data is: ", data);
    return {
        code: 1,
        message: "Circle Validated!",
        data: data,
    };
}

export async function JoinCircle(_previousState: any, formdata: FormData) {
  const supabase = await createClient();

  const code = formdata.get("circle_code") as string;

  const result = await ValidateCode(code);

  if (result.code === 0) {
    return {
      code: 0,
      message: "Circle does not exist!"
    }
  }

  const { data, error } = await supabase
    .from("cicle_members_tbl")
    .insert({
      circle_id: result.data.circle_id,
      user_id: await supabase.auth.getSession(),
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
        code: 1,
        message: "Circle Created Successfully.",
        data: data,
    };
}

export async function AddItinerary(_previousState: any, formdata: FormData) {
  const supabase = await createClient();

  const code = formdata.get("circle_code") as string;
  const name = formdata.get("name") as string;
  const location = formdata.get("location") as string;
  const start_date = formdata.get("start_date") as string;
  const end_date = formdata.get("end_date") as string;
  const notes = formdata.get("notes") as string;

  const result = await ValidateCode(code);

  if (result.code === 0) {
    return {
      code: 0,
      message: "Circle does not exist!",
    }
  }

  const { data, error } = await supabase
    .from("itinerary_tbl")
    .insert({
      circle_id: result.data.circle_id,
      name: name, 
      location: location, 
      start_date: start_date, 
      end_date: end_date, 
      notes: notes, 
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
        code: 1,
        message: "Itinerary added Successfully.",
        data: data,
    };
}

export async function UpdateItineraryDetails(_previousState: any, formdata: FormData) {
  const supabase = await createClient();

  const itineraryId = formdata.get("itinerary_id") as string;

  const name = formdata.get("name") as string;
  const location = formdata.get("location") as string;
  const start_date = formdata.get("start_date") as string;
  const end_date = formdata.get("end_date") as string;
  const notes = formdata.get("notes") as string;

  const { data, error } = await supabase
    .from("itinerary_tbl")
    .update({
      name: name, 
      location: location, 
      start_date: start_date, 
      end_date: end_date, 
      notes: notes, 
    }) 
    .select()
    .eq("itineraryId", itineraryId);

    if (error) {
      console.log(error);
      return {
        code: 0,
        message: "An error has occurred. Please try again later",
      };
    }
    console.log("data is: ", data);
    return {
        code: 1,
        message: "Itinerary Details Updated Successfully.",
        data: data,
    };
}

export async function DeleteDestination(_previousState: any, formdata: FormData) {
  const supabase = await createClient();

  // const circleId = formdata.get("circle_id") as string;
  const date_id = formdata.get("date_id") as string;

  // const result = await ValidateCode(circleId);

  // if (result.code === 0) {
  //   return {
  //     code: 0,
  //     message: "Circle does not exist!",
  //   }
  // }

  const { data, error } = await supabase
    .from("circle_dates_tbl")
    .delete() 
    .select()
    .eq("date_id", date_id);

    if (error) {
      console.log(error);
      return {
        code: 0,
        message: "An error has occurred. Please try again later",
      };
    }
    console.log("data is: ", data);
    return {
        code: 1,
        message: "Destination Deleted Successfully.",
        data: data,
    };
}

export async function DeleteCircle(_previousState: any, formdata: FormData) {
  const supabase = await createClient();

  const circleId = formdata.get("circle_id") as string;

  const result = await ValidateCode(circleId);

  if (result.code === 0) {
    return {
      code: 0,
      message: "Circle does not exist!",
    }
  }

  const { data, error } = await supabase
    .from("circle_dates_tbl")
    .delete() 
    .select()
    .eq("circle_id", result.data.circle_id);

    if (error) {
      console.log(error);
      return {
        code: 0,
        message: "An error has occurred. Please try again later",
      };
    }
    console.log("data is: ", data);
    return {
        code: 1,
        message: "Circle Deleted Successfully.",
        data: data,
    };
}

export async function DeleteDate(_previousState: any, formdata: FormData) {
  const supabase = await createClient();

  // const circleId = formdata.get("circle_id") as string;
  const date_id = formdata.get("date_id") as string;

  // const result = await ValidateCode(circleId);

  // if (result.code === 0) {
  //   return {
  //     code: 0,
  //     message: "Circle does not exist!",
  //   }
  // }

  const { data, error } = await supabase
    .from("circle_dates_tbl")
    .delete() 
    .select()
    .eq("date_id", date_id);

    if (error) {
      console.log(error);
      return {
        code: 0,
        message: "An error has occurred. Please try again later",
      };
    }
    console.log("data is: ", data);
    return {
        code: 1,
        message: "Date Deleted Successfully.",
        data: data,
    };
}


