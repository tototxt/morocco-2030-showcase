export interface Match {
  id: string;
  home_team: string;
  away_team: string;
  match_date: string;
  stadium: string;
  city: string;
  stage: string;
  available_seats: number;
  total_seats: number;
  created_at: string;
}

export interface TicketCategory {
  id: string;
  name: string;
  description: string | null;
  min_price: number;
  max_price: number;
  color: string;
}

export interface Seat {
  id: string;
  match_id: string;
  category_id: string;
  block: string;
  row_number: string;
  seat_number: string;
  price: number;
  status: string;
  reserved_by: string | null;
  reserved_until: string | null;
  created_at: string;
  ticket_categories?: TicketCategory;
}

export interface Purchase {
  id: string;
  user_id: string;
  match_id: string;
  seat_id: string;
  ticket_id: string;
  category_name: string;
  block: string;
  row_number: string;
  seat_number: string;
  price: number;
  holder_name: string;
  holder_email: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  matches?: Match;
}

export interface CartItem {
  seat: Seat;
  category: TicketCategory;
}
