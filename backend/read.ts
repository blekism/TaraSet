import { createClient } from "@/lib/server";

export async function GetCircles(user_id: string) {
  const supabase = await createClient();

  if (!user_id) {
    return {
      code: 404,
      message: "Circle not found...",
    };
  }

  try {
    const { data, error } = await supabase
      .from("circles_tbl")
      .select(`*`)
      .eq("circle_id", user_id)
      .maybeSingle();

    if (error) {
      console.log("the paper error is: ", error);

      return {
        code: 404,
        message: error.message,
      };
    }
    console.log("the paper  is: ", data);

    return {
      code: 1,
      data: data,
      message: "Paper retreived successfully",
    };
  } catch (error) {
    console.log("the paper error is: ", error);

    return {
      code: 500,
      message: "An error has occured, please try again later...",
    };
  }
}

export async function GetCircle(circle_id: string) {
  const supabase = await createClient();

  if (!circle_id) {
    return {
      code: 0,
      message: "Paper not found...",
    };
  }

  try {
    const { data, error } = await supabase
      .from("circles_tbl")
      .select(
        `*, 
        circle_members_tbl(*, user_tbl(username)),
        circle_dates_tbl(*, user_tbl(username)),
        `,
      )
      .eq("circle_id", circle_id)
      .maybeSingle();

    if (error) {
      console.log("the paper error is: ", error);

      return {
        code: 0,
        message: error.message,
      };
    }
    console.log("the paper  is: ", data);

    return {
      code: 1,
      data: data,
      message: "Paper retreived successfully",
    };
  } catch (error) {
    console.log("the paper error is: ", error);

    return {
      code: 0,
      message: "An error has occured, please try again later...",
    };
  }
}
