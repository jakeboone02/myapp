import './App.scss';
import QueryBuilder, { formatQuery, RuleGroupType } from "react-querybuilder";
import { useState } from 'react';
import fields from './fields';
import getOperators from './getOperators';
import { Language } from './types';
import translations from './translations';
import combinators from './combinators';

function App() {
  const [query, setQuery] = useState<RuleGroupType>({
    id: 'root',
    combinator: 'and',
    rules: [],
  });
  const [language, setLanguage] = useState<Language>("en");

  return (
    <>
      <select value={language} onChange={e => setLanguage(e.target.value as Language)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
      <QueryBuilder
        fields={fields}
        onQueryChange={q => setQuery(q)}
        query={query}
        getOperators={getOperators}
        translations={translations[language]}
        combinators={combinators[language]}
      />
      <pre>{formatQuery(query, 'sql')}</pre>
      <pre>{formatQuery(query, 'json')}</pre>
    </>
  );
}

export default App;
