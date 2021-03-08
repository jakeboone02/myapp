import { useState } from "react";
import QueryBuilder, { formatQuery, RuleGroupType } from "react-querybuilder";
import "./App.scss";
import combinators from "./combinators";
import CombinatorSelector from "./CombinatorSelector";
import fields from "./fields";
import getOperators from "./getOperators";
import translations from "./translations";
import { Language } from "./types";
import ValueEditor from "./ValueEditor";
import valueProcessor from "./valueProcessor";

function App() {
  const [query, setQuery] = useState<RuleGroupType>({
    id: "root",
    combinator: "and",
    rules: [],
  });
  const [language, setLanguage] = useState<Language>("en");
  const [rawData, setRawData] = useState<any[]>([]);

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
      <QueryBuilder
        fields={fields}
        onQueryChange={(q) => setQuery(q)}
        query={query}
        getOperators={getOperators}
        translations={translations[language]}
        combinators={combinators[language]}
        controlElements={{
          combinatorSelector: CombinatorSelector,
          valueEditor: ValueEditor,
        }}
      />
      <button onClick={getData}>Get Data</button>
      <pre>{formatQuery(query, { format: "sql", valueProcessor })}</pre>
      <pre>{formatQuery(query, "json")}</pre>
    </>
  );
}

export default App;
