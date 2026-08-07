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

export type Circle = {
  id: string;
  name: string;
  code: string;
  created_by: string;
  created_at: string;
};

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
