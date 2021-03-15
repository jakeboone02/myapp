import { Button, Grid, MenuItem, Select, Typography } from "@material-ui/core";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { AgChartsReact } from "ag-charts-react";
import { ColDef, GridApi } from "ag-grid-community";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { AgGridReact } from "ag-grid-react";
import { addDays, format, parseISO } from "date-fns";
import { useState } from "react";
import QueryBuilder, {
  Field,
  RuleGroupType,
  RuleType,
} from "react-querybuilder";
import "./App.scss";
import combinators from "./combinators";
import fields from "./fields";
import getOperators from "./getOperators";
import getOperatorsForUpdate from "./getOperatorsForUpdate";
import MaterialActionElement from "./MaterialActionElement";
import MaterialNotToggle from "./MaterialNotToggle";
import MaterialValueSelector from "./MaterialValueSelector";
import translations from "./translations";
import {
  Dataset,
  FieldAndColDef,
  Language,
  SalesAPIResponse,
  SalesChartResult,
  SalesResult,
  UNLocodeAPIResponse,
  UNLocodeResult,
} from "./types";
import ValueEditor from "./ValueEditor";
import ValueEditorForBulkEdit from "./ValueEditorForBulkEdit";

const processChartData = (chartData: SalesChartResult[]) =>
  chartData.map((cd) => ({ ...cd, order_month: parseISO(cd.order_month) }));

const columnDefsMapper = (f: Field): ColDef => ({
  ...f,
  field: f.name,
  headerName: f.label,
});

const columnDefs = fields["sales"].map(columnDefsMapper);
const columnDefsUNL = fields["unlocode"].map(columnDefsMapper);

function App() {
  const [query, setQuery] = useState<RuleGroupType>({
    id: "root",
    combinator: "and",
    rules: [],
  });
  const [updateQuery, setUpdateQuery] = useState<RuleGroupType>({
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
  const [rawData, setRawData] = useState<SalesResult[]>([]);
  const [rawDataUNL, setRawDataUNL] = useState<UNLocodeResult[]>([]);
  const [chartData, setChartData] = useState<SalesChartResult[]>([]);
  const [dataset, setDataset] = useState<Dataset>("sales");
  const [gridApi, setGridApi] = useState<GridApi>();

  const getData = async () => {
    const body = JSON.stringify(query);
    const headers = new Headers({ "Content-Type": "application/json" });

    let res: SalesAPIResponse = {
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

  const getDataUNL = async () => {
    const body = JSON.stringify(queryUNL);
    const headers = new Headers({ "Content-Type": "application/json" });

    let res: UNLocodeAPIResponse = {
      data: [],
    };

    try {
      res = await (
        await fetch("/api/unlocode", { method: "POST", body, headers })
      ).json();
    } catch (err) {
      console.log(err);
    }

    if (res.error) {
      console.log(res.error);
    } else {
      setRawDataUNL(res.data);
    }
  };

  const onClickUpdate = () => {
    (updateQuery.rules as RuleType[]).forEach((r) => {
      gridApi?.getSelectedNodes().forEach((n) => {
        let val = n.data[r.field];

        if (r.operator === "=") {
          if (
            r.field === "date" ||
            r.field === "order_date" ||
            r.field === "ship_date"
          ) {
            val = r.value;
          } else if (
            (gridApi.getColumnDef(r.field) as FieldAndColDef).inputType ===
            "number"
          ) {
            val = parseFloat(r.value);
          } else {
            val = r.value;
          }
        } else if (r.operator === "+") {
          val += parseFloat(r.value);
        } else if (r.operator === "-") {
          val -= parseFloat(r.value);
        } else if (r.operator === "extendBy") {
          val = format(
            addDays(parseISO(val), parseFloat(r.value)),
            "yyyy-MM-dd"
          );
        }

        n.setDataValue(r.field, val);
      });
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <Typography variant="h6" gutterBottom>
          Language
        </Typography>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
        </Select>
        <Typography variant="h6" gutterBottom>
          Dataset
        </Typography>
        <Select
          value={dataset}
          onChange={(e) => setDataset(e.target.value as Dataset)}
        >
          <MenuItem value="sales">Sales</MenuItem>
          <MenuItem value="unlocode">UN/LOCODE</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={10}>
        <QueryBuilder
          fields={fields[dataset]}
          onQueryChange={(q) =>
            (dataset === "sales" ? setQuery : setQueryUNL)(q)
          }
          query={dataset === "sales" ? query : queryUNL}
          getOperators={getOperators}
          translations={translations[language]}
          combinators={combinators[language]}
          controlElements={{
            addGroupAction: MaterialActionElement,
            addRuleAction: MaterialActionElement,
            fieldSelector: MaterialValueSelector,
            notToggle: MaterialNotToggle,
            operatorSelector: MaterialValueSelector,
            removeGroupAction: MaterialActionElement,
            removeRuleAction: MaterialActionElement,
            combinatorSelector: MaterialValueSelector,
            valueEditor: ValueEditor,
          }}
        />
        <Button onClick={dataset === "sales" ? getData : getDataUNL}>
          Get Data
        </Button>
        <QueryBuilder
          fields={fields[dataset]}
          onQueryChange={(q) => setUpdateQuery(q)}
          query={updateQuery}
          getOperators={getOperatorsForUpdate}
          controlElements={{
            addGroupAction: () => null,
            combinatorSelector: () => null,
            addRuleAction: MaterialActionElement,
            fieldSelector: MaterialValueSelector,
            notToggle: MaterialNotToggle,
            operatorSelector: MaterialValueSelector,
            removeGroupAction: MaterialActionElement,
            removeRuleAction: MaterialActionElement,
            valueEditor: ValueEditorForBulkEdit,
          }}
        />
        <Button type="button" onClick={onClickUpdate}>
          Update
        </Button>
        <div className="ag-theme-material" style={{ height: 400, width: "100%" }}>
          <AgGridReact
            columnDefs={[
              {
                field: "selectionColumn",
                headerCheckboxSelection: true,
                checkboxSelection: true,
                width: 40,
              },
              ...(dataset === "sales" ? columnDefs : columnDefsUNL),
            ]}
            onGridReady={(gre) => setGridApi(gre.api)}
            rowData={dataset === "sales" ? rawData : rawDataUNL}
            rowSelection="multiple"
            suppressPropertyNamesCheck
          />
        </div>
        {dataset === "sales" ? (
          <div style={{ height: 600 }}>
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
          </div>
        ) : rawDataUNL?.length ? (
          <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY!}
            language={language}
          >
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "600px" }}
              center={{ lat: 0, lng: 0 }}
              zoom={2}
            >
              {rawDataUNL
                .filter((location) => location.latitude && location.longitude)
                .map((location) => (
                  <Marker
                    key={location.id}
                    position={{
                      lat: location.latitude,
                      lng: location.longitude,
                    }}
                    title={location.name}
                  />
                ))}
            </GoogleMap>
          </LoadScript>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 600,
              width: "100%",
            }}
          >
            Load data to see map
          </div>
        )}
      </Grid>
    </Grid>
  );
}

export default App;
