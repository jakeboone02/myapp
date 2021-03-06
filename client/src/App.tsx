import './App.scss';
import QueryBuilder, { formatQuery, RuleGroupType } from "react-querybuilder";
import { useState } from 'react';
import fields from './fields';
import getOperators from './getOperators';

function App() {
  const [query, setQuery] = useState<RuleGroupType>({
    id: 'root',
    combinator: 'and',
    rules: [],
  });

  return (
    <>
      <QueryBuilder
        fields={fields}
        onQueryChange={q => setQuery(q)}
        query={query}
        getOperators={getOperators}
      />
      <pre>{formatQuery(query, 'sql')}</pre>
      <pre>{formatQuery(query, 'json')}</pre>
    </>
  );
}

export default App;
