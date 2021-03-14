import { ColDef } from "ag-grid-community";
import { Field } from "react-querybuilder";

export type FieldAndColDef = Field & ColDef;
export type Language = "en" | "es";
export type Dataset = "sales" | "unlocode";

export interface SalesResult {
  order_id: number;
  region: string;
  country: string;
  item_type: string;
  sales_channel: string;
  order_priority: string;
  order_date: string;
  ship_date: string;
  units_sold: number;
  unit_price: number;
  unit_cost: number;
  total_revenue: number;
  total_cost: number;
  total_profit: number;
}

export interface SalesChartResult {
  order_month: string;
  revenue: string | number;
  profit: string | number;
}

export interface UNLocodeResult {
  id: number;
  country: string;
  location: string;
  name: string;
  name_without_diacritics: string;
  subdivision: string | null;
  status: string;
  function: string;
  date: string | Date | null;
  iata: string;
  coordinates: string | null;
  remarks: string | null;
  locode: string;
  port: boolean;
  rail_terminal: boolean;
  road_terminal: boolean;
  airport: boolean;
  postal_exchange: boolean;
  multimodal: boolean;
  fixed: boolean;
  border_crossing: boolean;
  latitude: number | null;
  longitude: number | null;
}

export type SalesAPIResponse = {
  data: SalesResult[];
  chartData: SalesChartResult[];
  error?: string;
};

export type UNLocodeAPIResponse = {
  data: UNLocodeResult[];
  error?: string;
};
