export type Plan = {
  id: string;
  circle_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  start_time: string | null;
  end_time: string | null;
  activity: string;
  title: string | null;
  location: string | null;
  food: string | null;
  note: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
};

export interface Circle {
  circle_id: string;
  circle_name: string;
  circle_code: string;
  total_members: string;
  user_tbl: {
    username: string;
  };
  circle_members_tbl: CircleMember[];
  circle_dates_tbl: CircleDates[];
}

export interface CircleMember {
  member_id: string;
  created_at: string;
  user_tbl: {
    username: string;
  };
}

export interface CircleDates {
  date_id: string;
  created_at: string;
  date_available: string;
  user_id: {
    username: string;
  };
}

export type AvailabilityRange = {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
};

export type OverlapWindow = {
  start: string;
  end: string;
  days: number;
  userIds: string[];
};

export interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export interface ItineraryShape {
  itinerary_id: string;
  cricles_tbl: {
    circle_id: string;
  };
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  notes: string;
}

export interface GetItineraryShape {
  code: number;
  message: string;
  data: ItineraryShape[] | null;
}

export interface GetCircleShape {
  code: number;
  message: string;
  data: Circle | null;
}

export interface ButtonProps {
  onClick: () => void;
}

export interface HeaderProps {
  id: string;
  itineraryLength: number;
  data: any;
  name: string;
}
