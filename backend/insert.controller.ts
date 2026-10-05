import * as auth from "@/services/auth.service";
import { redirect } from "next/navigation";
import { register, login } from "@/services/auth.service";
import { createCircle, joinCircle } from "@/services/circle.service";

export async function Register(_previousState: any, formdata: FormData) {
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;
  const name = formdata.get("name") as string;

  if (!email.trim() || !password.trim() || !name.trim()) {
    return {
      success: false,
      message: "Email, Password, and Username are required.",
    };
  }

  if (name.trim().length < 2) {
    return {
      success: false,
      message: "Username cannot be shorter than 2 characters.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password must at least be 8 characters.",
    };
  }

  try {
    const data = await register(email, password, name.trim());

    return {
      success: data.status === 201,
      message:
        data.status === 201
          ? "Registered Successfully. You can now login to continue"
          : "Registration Failed",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error has occurred, please try again later.",
    };
  }
}

export async function Login(_previousState: any, formdata: FormData) {
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;

  if (!email.trim() || !password.trim()) {
    return {
      success: false,
      message: "Email and Password are required.",
    };
  }

  try {
    const data = await login(email, password);

    return {
      success: data.status === 200,
      message: data.status === 200 ? "Login Successfully" : "Login Failed",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error has occured, please try again later.",
    };
  }
}

export async function CreateCircle(_previousState: any, formdata: FormData) {
  const circleName = formdata.get("circle_name") as string;

  if (!circleName) {
    return {
      success: false,
      message: "Circle Name is required.",
    };
  }

  try {
    console.log(circleName);
    const res = await createCircle(circleName);

    return {
      code: 1,
      data: res.data,
      message: "Circle created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      code: 0,
      data: null,
      message:
        error instanceof Error
          ? error.message
          : "An error has occured, please try again later...",
    };
  }
}

export async function JoinCircle(_previousState: any, formdata: FormData) {
  const circleCode = formdata.get("circle_code") as string;

  if (!circleCode) {
    return {
      success: false,
      message: "Circle code is required.",
    };
  }

  try {
    console.log(circleCode);
    const res = await joinCircle(circleCode);

    return {
      code: 1,
      data: res.data,
      message: "Joined a circle successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      code: 0,
      data: null,
      message:
        error instanceof Error
          ? error.message
          : "An error has occured, please try again later...",
    };
  }
}

// export async function Login(_previousState: any) {
//   const supabase = await createClient();

//   try {
//     const result = await auth.login(supabase);

//     if (result.code === 500) {
//       return {
//         success: false,
//         message: "An error has occured, please try again later.",
//       };
//     }
//   } catch (error) {
//     return {
//       success: false,
//       message: "An error has occured, please try again later.",
//     };
//   }
// }

// export async function ValidateCode(code: string) {
//   const supabase = await createClient();

//   console.log("im the code", code);

//   const { data, error } = await supabase
//     .from("circles_tbl")
//     .select("*")
//     .eq("circle_code", code)
//     .maybeSingle();

//   if (error) {
//     console.log(error);
//     return {
//       code: 0,
//       message: "An error has occurred. Please try again later",
//     };
//   }
//   console.log("data is: ", data);
//   console.log("error: ", error);
//   return {
//     code: 1,
//     message: "Circle Validated!",
//     data: data,
//   };
// }

// export async function JoinCircle(_previousState: any, formdata: FormData) {
//   const supabase = await createClient();

//   const user = await supabase.auth.getUser();

//   const code = formdata.get("circle_code") as string;

//   const result = await ValidateCode(code);

//   console.log("resulttttt", result);

//   if (result.code === 0) {
//     return {
//       code: 0,
//       message: "Circle does not exist!",
//     };
//   }

//   const { data, error } = await supabase
//     .from("circle_members_tbl")
//     .insert({
//       circle_id: result.data.circle_id,
//       user_id: user.data.user?.id,
//     })
//     .select()
//     .single();

//   if (error) {
//     console.log(error);
//     return {
//       code: 0,
//       message: "An error has occurred. Please try again later",
//     };
//   }
//   console.log("data is: ", data);
//   return {
//     code: 1,
//     message: "Circle Joined Successfully.",
//     data: data,
//   };
// }

// export async function AddItinerary(_previousState: any, formdata: FormData) {
//   const supabase = await createClient();

//   const code = formdata.get("circle_code") as string;
//   const name = formdata.get("name") as string;
//   const location = formdata.get("location") as string;
//   const start_date = formdata.get("start_date") as string;
//   const end_date = formdata.get("end_date") as string;
//   const notes = formdata.get("notes") as string;

//   const result = await ValidateCode(code);

//   if (result.code === 0) {
//     return {
//       code: 0,
//       message: "Circle does not exist!",
//     };
//   }

//   const { data, error } = await supabase
//     .from("itinerary_tbl")
//     .insert({
//       circle_id: result.data.circle_id,
//       name: name,
//       location: location,
//       start_date: start_date,
//       end_date: end_date,
//       notes: notes,
//     })
//     .select()
//     .single();

//   if (error) {
//     console.log(error);
//     return {
//       code: 0,
//       message: "An error has occurred. Please try again later",
//     };
//   }
//   console.log("data is: ", data);
//   return {
//     code: 1,
//     message: "Itinerary added Successfully.",
//     data: data,
//   };
// }

// export async function UpdateItineraryDetails(
//   _previousState: any,
//   formdata: FormData,
// ) {
//   const supabase = await createClient();

//   const itineraryId = formdata.get("itinerary_id") as string;

//   const name = formdata.get("name") as string;
//   const location = formdata.get("location") as string;
//   const start_date = formdata.get("start_date") as string;
//   const end_date = formdata.get("end_date") as string;
//   const notes = formdata.get("notes") as string;

//   const { data, error } = await supabase
//     .from("itinerary_tbl")
//     .update({
//       name: name,
//       location: location,
//       start_date: start_date,
//       end_date: end_date,
//       notes: notes,
//     })
//     .select()
//     .eq("itineraryId", itineraryId);

//   if (error) {
//     console.log(error);
//     return {
//       code: 0,
//       message: "An error has occurred. Please try again later",
//     };
//   }
//   console.log("data is: ", data);
//   return {
//     code: 1,
//     message: "Itinerary Details Updated Successfully.",
//     data: data,
//   };
// }

// export async function DeleteDestination(
//   _previousState: any,
//   formdata: FormData,
// ) {
//   const supabase = await createClient();

//   // const circleId = formdata.get("circle_id") as string;
//   const date_id = formdata.get("date_id") as string;

//   // const result = await ValidateCode(circleId);

//   // if (result.code === 0) {
//   //   return {
//   //     code: 0,
//   //     message: "Circle does not exist!",
//   //   }
//   // }

//   const { data, error } = await supabase
//     .from("circle_dates_tbl")
//     .delete()
//     .select()
//     .eq("date_id", date_id);

//   if (error) {
//     console.log(error);
//     return {
//       code: 0,
//       message: "An error has occurred. Please try again later",
//     };
//   }
//   console.log("data is: ", data);
//   return {
//     code: 1,
//     message: "Destination Deleted Successfully.",
//     data: data,
//   };
// }

// export async function DeleteCircle(_previousState: any, formdata: FormData) {
//   const supabase = await createClient();

//   const circleId = formdata.get("circle_id") as string;

//   const result = await ValidateCode(circleId);

//   if (result.code === 0) {
//     return {
//       code: 0,
//       message: "Circle does not exist!",
//     };
//   }

//   const { data, error } = await supabase
//     .from("circle_dates_tbl")
//     .delete()
//     .select()
//     .eq("circle_id", result.data.circle_id);

//   if (error) {
//     console.log(error);
//     return {
//       code: 0,
//       message: "An error has occurred. Please try again later",
//     };
//   }
//   console.log("data is: ", data);
//   return {
//     code: 1,
//     message: "Circle Deleted Successfully.",
//     data: data,
//   };
// }

// export async function DeleteDate(_previousState: any, formdata: FormData) {
//   const supabase = await createClient();

//   // const circleId = formdata.get("circle_id") as string;
//   const date_id = formdata.get("date_id") as string;

//   // const result = await ValidateCode(circleId);

//   // if (result.code === 0) {
//   //   return {
//   //     code: 0,
//   //     message: "Circle does not exist!",
//   //   }
//   // }

//   const { data, error } = await supabase
//     .from("circle_dates_tbl")
//     .delete()
//     .select()
//     .eq("date_id", date_id);

//   if (error) {
//     console.log(error);
//     return {
//       code: 0,
//       message: "An error has occurred. Please try again later",
//     };
//   }
//   console.log("data is: ", data);
//   return {
//     code: 1,
//     message: "Date Deleted Successfully.",
//     data: data,
//   };
// }
