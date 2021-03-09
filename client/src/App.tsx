import { AgChartsReact } from "ag-charts-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { parseISO } from "date-fns";
import { useState } from "react";
import QueryBuilder, { RuleGroupType } from "react-querybuilder";
import "./App.scss";
import combinators from "./combinators";
import CombinatorSelector from "./CombinatorSelector";
import fields from "./fields";
import getOperators from "./getOperators";
import translations from "./translations";
import { Dataset, Language } from "./types";
import ValueEditor from "./ValueEditor";

const processChartData = (chartData: any[]) =>
  chartData.map((cd) => ({ ...cd, order_month: parseISO(cd.order_month) }));

const columnDefs = fields.map((f) => ({
  ...f,
  field: f.name,
  headerName: f.label,
}));

function App() {
  const [query, setQuery] = useState<RuleGroupType>({
    id: "root",
    combinator: "and",
    rules: [],
  });
  const [queryUNL, setQueryUNL] = useState<RuleGroupType>({
    id: "root",
    combinator: "and",
    rules: [],
  });
  const [language, setLanguage] = useState<Language>("en");
  const [rawData, setRawData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [dataset, setDataset] = useState<Dataset>("sales");

  const getData = async () => {
    const body = JSON.stringify(query);
    const headers = new Headers({ "Content-Type": "application/json" });

    let res: { data: any[]; chartData: any[]; error?: string } = {
      data: [],
      chartData: [],
    };

    try {
      res = await (
        await fetch("/api/sales", { method: "POST", body, headers })
      ).json();
    } catch (err) {
      console.log(err);
    }

    if (res.error) {
      console.log(res.error);
    } else {
      setRawData(res.data);
      setChartData(res.chartData);
    }
  };

  return (
    <>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
      <select
        value={dataset}
        onChange={(e) => setDataset(e.target.value as Dataset)}
      >
        <option value="sales">Sales</option>
        <option value="unlocode">UN/LOCODE</option>
      </select>
      <QueryBuilder
        fields={fields}
        onQueryChange={(q) => (dataset === "sales" ? setQuery : setQueryUNL)(q)}
        query={dataset === "sales" ? query : queryUNL}
        getOperators={getOperators}
        translations={translations[language]}
        combinators={combinators[language]}
        controlElements={{
          combinatorSelector: CombinatorSelector,
          valueEditor: ValueEditor,
        }}
      />
      <button onClick={getData}>Get Data</button>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rawData}
          suppressPropertyNamesCheck
        />
      </div>
      <AgChartsReact
        options={{
          data: processChartData(chartData),
          series: [
            {
              type: "line",
              xKey: "order_month",
              yKey: "revenue",
            },
            {
              type: "line",
              xKey: "order_month",
              yKey: "profit",
            },
          ],
          axes: [
            {
              type: "time",
              position: "bottom",
            },
            {
              type: "number",
              position: "left",
            },
          ],
        }}
      />
    </>
  );
}

export default App;
