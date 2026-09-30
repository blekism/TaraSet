import { GetCircleShape, GetItineraryShape } from "@/lib/types";
import {
  getCircles,
  getACircle,
  getItinerary,
} from "@/services/circle.service";

export async function GetCircles() {
  try {
    const res = await getCircles();

    return {
      code: 1,
      data: res.data,
      message: "Circles fetched successfully",
    };
  } catch (error) {
    return {
      code: 0,
      data: [],
      message:
        error instanceof Error
          ? error.message
          : "An error has occured, please try again later...",
    };
  }
}

export async function GetCircle(circle_id: string) {
  if (!circle_id) {
    return {
      code: 0,
      data: null,
      message: "Circle not found...",
    };
  }

  try {
    const res = await getACircle(circle_id);

    return {
      code: 1,
      data: res.data,
      message: "Circle retreived successfully",
    };
  } catch (error) {
    console.log("the circle error is: ", error);

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

export async function GetItinerary(circle_id: string) {
  if (!circle_id) {
    return {
      code: 0,
      message: "Circle not found...",
      data: null,
    };
  }

  try {
    const res = await getItinerary(circle_id);

    return {
      code: 1,
      data: res.data,
      message: "itinerary retrieved successfully",
    };
  } catch (error) {
    console.log("the itinerary error is: ", error);

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
