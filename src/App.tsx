import {
  parse as parseSync,
} from 'csv-parse/browser/esm/sync';
import React from 'react';
import './App.css';

function App() {
  const inputRef:React.MutableRefObject<HTMLTextAreaElement|null> = React.useRef(null);
  const tableNameRef:React.MutableRefObject<HTMLInputElement|null> = React.useRef(null);
  const [output, setOutput] = React.useState('');
  const goButtonClickedCallback = React.useCallback(() => {
    setOutput('Processing…');
    try {
      if (inputRef.current === null) throw new Error('inputRef not set.');
        if (tableNameRef.current === null) throw new Error('tableNameRef not set.');
      const tableName = tableNameRef.current.value;
      const records:string[][] = parseSync(inputRef.current.value, {
        relax_column_count: true,
      });
      const maxColumnCount = records.map(record => record.length).reduce((a, b) => Math.max(a, b), 0);
      setOutput(records.map(record => {
        while (record.length < maxColumnCount) record.push('');
        return `INSERT "${tableName.replace('"', '""')}" VALUES (${record.map(value => `N'${value.replace('\'', '\'\'')}'`).join(', ')});`;
      }).join('\n'));
    } catch (ex) {
      setOutput('Error: ' + ex);
    }
  }, [
    inputRef,
    setOutput,
  ]);
  const tableNameId = React.useId();
  const inputId = React.useId();
  const outputId = React.useId();
  return (
    <div className="App">
      <div>
        <label htmlFor={tableNameId}>
          Table Name
        </label>
        <input defaultValue='#x' id={tableNameId} ref={tableNameRef}/>
      </div>
      <div>
        <label htmlFor={inputId}>
          Enter CSV
        </label>
      </div>
      <div>
        <textarea id={inputId} ref={inputRef}/>
      </div>
      <div>
        <button onClick={goButtonClickedCallback} type='button'>
          Go
        </button>
      </div>
      <div>
        <label htmlFor={outputId}>
          Results
        </label>
      </div>
      <div>
        <textarea id={outputId} readOnly={true} value={output}/>
      </div>
    </div>
  );
}

export default App;
