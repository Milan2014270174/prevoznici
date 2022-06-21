export interface ITicket {
  ticket_id: number
  ticket_price?: number
  reserved_for_date_at: string
  seat_number: string
  ticket_type: string
  is_paid: number
  user_id: number
  to_bus_line_station_id: number
  from_bus_line_station_id: number
  roundtrip_expires_at: string | null

  toStation?: any;
  fromStation?: any;
}