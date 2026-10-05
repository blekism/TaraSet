export type Server_Res = {
  status: number;
  data: {
    id?: string;
    email?: string;
    error?: string;
    status?: string;
    circle?: Circle;
    circles?: Circle[];
  };
};

// export type Plan = {
//   id: string;
//   circle_id: string;
//   user_id: string;
//   start_date: string;
//   end_date: string;
//   start_time: string | null;
//   end_time: string | null;
//   activity: string;
//   title: string | null;
//   location: string | null;
//   food: string | null;
//   note: string | null;
//   created_at: string;
// };
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
  owner_id: string;
  total_members: string;
  tbl2cmtbl: CircleMember[];
  tbl3cdtbl: CircleDates[];
}

export interface CircleMember {
  member_id: string;
  created_at: string;
  tbl4utbl: {
    username: string;
  };
  user_id: string;
}

export interface CircleDates {
  date_id: string;
  created_at: string;
  start_date: string;
  end_date: string;
  user_id: string;
  tbl4utbl: {
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
  user_id: string[];
};

export interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// export type Plan = {
//   itinerary_id: string;
//   circle_id: string;
//   name: string;
//   location: string | null;
//   start_date: string;
//   end_date: string;
//   notes: string | null;
// };

export interface ItineraryShape {
  itinerary_id: string;
  circle_id: string;
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  notes: string | null;
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

export type User = {
  id: string;
  email: string;
  username?: string;
};

export type UserContextValue = {
  user: User | null;
  userId: string | null;
  loading: boolean;
};
