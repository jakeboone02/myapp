import { useState } from 'react';
import QueryBuilder, { formatQuery, RuleGroupType } from "react-querybuilder";
import './App.scss';
import combinators from './combinators';
import CombinatorSelector from './CombinatorSelector';
import fields from './fields';
import getOperators from './getOperators';
import translations from './translations';
import { Language } from './types';
import ValueEditor from './ValueEditor';

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
        controlElements={{
          combinatorSelector: CombinatorSelector,
          valueEditor: ValueEditor,
        }}
      />
      <pre>{formatQuery(query, 'sql')}</pre>
      <pre>{formatQuery(query, 'json')}</pre>
    </>
  );
}

export default App;
