// fields.ts
import { ICellRendererParams } from "ag-grid-community";
import { format, parseISO } from "date-fns";
import { Field } from "react-querybuilder";

const priorities = [
  { name: "C", label: "Critical" },
  { name: "H", label: "High" },
  { name: "M", label: "Medium" },
  { name: "L", label: "Low" },
];

const prioritiesRefData: Record<string, string> = {};
priorities.forEach((p) => (prioritiesRefData[p.name] = p.label));

const itemTypes = [
  { name: "Baby Food", label: "Baby Food" },
  { name: "Beverages", label: "Beverages" },
  { name: "Cereal", label: "Cereal" },
  { name: "Clothes", label: "Clothes" },
  { name: "Cosmetics", label: "Cosmetics" },
  { name: "Fruits", label: "Fruits" },
  { name: "Household", label: "Household" },
  { name: "Meat", label: "Meat" },
  { name: "Office Supplies", label: "Office Supplies" },
  { name: "Personal Care", label: "Personal Care" },
  { name: "Snacks", label: "Snacks" },
  { name: "Vegetables", label: "Vegetables" },
];

const regions = [
  { name: "Asia", label: "Asia" },
  { name: "Australia and Oceania", label: "Australia and Oceania" },
  {
    name: "Central America and the Caribbean",
    label: "Central America and the Caribbean",
  },
  { name: "Europe", label: "Europe" },
  {
    name: "Middle East and North Africa",
    label: "Middle East and North Africa",
  },
  { name: "North America", label: "North America" },
  { name: "Sub-Saharan Africa", label: "Sub-Saharan Africa" },
];

const dateCellRenderer = ({ value }: ICellRendererParams) =>
  value ? format(parseISO(value), "yyyy-MM-dd") : null;

const fields: Field[] = [
  {
    name: "order_id",
    label: "Order ID",
    inputType: "number",
    type: "rightAligned",
  },
  {
    name: "region",
    label: "Region",
    valueEditorType: "select",
    values: regions,
  },
  {
    name: "country",
    label: "Country",
  },
  {
    name: "item_type",
    label: "Item Type",
    valueEditorType: "select",
    values: itemTypes,
  },
  {
    name: "sales_channel",
    label: "Sales Channel",
    valueEditorType: "select",
    values: [
      { name: "Offline", label: "Offline" },
      { name: "Online", label: "Online" },
    ],
  },
  {
    name: "order_priority",
    label: "Order Priority",
    valueEditorType: "select",
    values: priorities,
    refData: prioritiesRefData,
  },
  {
    name: "order_date",
    label: "Order Date",
    datatype: "date",
    cellRenderer: dateCellRenderer,
  },
  {
    name: "ship_date",
    label: "Ship Date",
    datatype: "date",
    cellRenderer: dateCellRenderer,
  },
  {
    name: "units_sold",
    label: "Units Sold",
    inputType: "number",
    type: "rightAligned",
  },
  {
    name: "unit_price",
    label: "Unit Price",
    inputType: "number",
    type: "rightAligned",
  },
  {
    name: "unit_cost",
    label: "Unit Cost",
    inputType: "number",
    type: "rightAligned",
  },
  {
    name: "total_revenue",
    label: "Total Revenue",
    inputType: "number",
    type: "rightAligned",
  },
  {
    name: "total_cost",
    label: "Total Cost",
    inputType: "number",
    type: "rightAligned",
  },
  {
    name: "total_profit",
    label: "Total Profit",
    inputType: "number",
    type: "rightAligned",
  },
];

export default fields;
