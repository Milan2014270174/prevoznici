export interface ITicket {
  ticket_id: number
  ticket_price?: number
  reserved_for_date_at: string
  seat_number: string
  ticket_type: string
  is_paid: number
  passenger_name: string
  user_id: number
  to_bus_line_station_id: number
  from_bus_line_station_id: number
  roud_trip_ticket_id: number

  toStation?: any;
  fromStation?: any;
}