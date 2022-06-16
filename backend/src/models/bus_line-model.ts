export interface IBusLine {
  bus_line_id?: number
  company_id?: number
  bus_line_price: number
  driver_hash: string
  available_seats: number
  bus_register_number: string
  reserved_date_at: string
  stations?: any
}