import { useState, useEffect, useMemo, useCallback } from 'react';
import ResultBarChart from './ResultBarChart';
import ConfigProps from './ConfigProps';
import CodeEditor from './CodeEditor';
import ResultInterfacing from './ResultInterfacing';
import ResultCalculation from './ResultCalculation';

export interface Tab {
  id: string;
  title: string;
  jsonInput: string;
  selectedProps: string[];
  err?: boolean;
  mode?: string;
}

export interface TabContentProps {
  tab: Tab;
  onJsonChange: (tabId: string, newJsonInput: string) => void;
  onConfigChange: (tabId: string, newSelectedProps: string[]) => void;
}

// TabContent component for each tab
const TabContent: React.FC<TabContentProps> = ({ tab, onJsonChange, onConfigChange }) => {
  const [jsonError, setJsonError] = useState<string>('');
  const [parsedJson, setParsedJson] = useState<Record<string, any>[]>([]); // Array of objects, values can be anything
  const [mode, setMode] = useState<string>('')

  // Effect to validate JSON when tab.jsonInput changes
  useEffect(() => {
    try {
      tab.err = false
      if (tab.jsonInput) {
        const data = JSON.parse(tab.jsonInput);
        setParsedJson(data);
        setJsonError('');
      } else {
        setParsedJson([]);
        setJsonError('');
      }
    } catch (error: any) { // Catching as any for broader error handling
      setParsedJson([]);
      setJsonError(`JSON tidak valid: ${error.message}`);
      tab.err = true
    }
  }, [tab.jsonInput]);

  // Extract available properties for checkboxes

  const collectArrInObject = useCallback((dataObj: any, result: string[]) => {
    for(const key in dataObj) {
      if(Array.isArray(dataObj[key])) {
        const collect: string[] = Array.from(new Set(dataObj[key].flatMap(obj => Object.keys(obj))))
        result.push(...collect)
      }else collectArrInObject(dataObj[key], result)
    }
  }, []) 

  const availableProps: string[] = useMemo(() => {
    const listProps: string[] = []
    if(parsedJson.length > 0) {
      return Array.from(new Set(parsedJson.flatMap(obj => Object.keys(obj))))
    }else {
      collectArrInObject(parsedJson, listProps)
    }
    return listProps
  }, [collectArrInObject, parsedJson])

  const handleJsonInputChange = (value: string): void => {
    onJsonChange(tab.id, value);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-inner flex flex-col gap-6 h-full">
      {/* Kolom Input JSON */}
      <div className="flex-1 min-w-[300px]">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Input JSON</h3>
        <div className="relative mb-4 flex flex-row">
          <div className={mode === 'Comparator'? 'w-1/2': 'w-full'}>
            <CodeEditor
              language='json'
              className="w-full border p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono resize-y"
              value={tab.jsonInput}
              height={500}
              onChange={(value) => handleJsonInputChange(value || '')}
            />
            {jsonError && (
              <div className="absolute bottom-0 left-0 w-full bg-red-100 text-red-700 text-xs p-2 rounded-b-md">
                {jsonError}
              </div>
            )}
          </div>
          {mode === 'Comparator' && <div className='w-1/2'>
            <CodeEditor
              language='json'
              className="w-full border p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono resize-y"
              value={''}
              height={500}
            />
          </div>}
        </div>
      </div>

      <select onChange={(e) => {
        setMode(e.target.value);
        tab.mode = e.target.value;
      }} value={mode} className='p-3 border border-gray-300 rounded-md shadow-sm w-[300px]'>
        <option value="">Select Mode</option>
        <option value="Interfacing">Interfacing</option>
        {/* <option value="BarChart">Bar Chart</option> */}
        <option value="Calculation">Calculation</option>
        {/* <option value="Collection">Collection</option> */}
        <option value="Comparator">Comparator</option>
      </select>
      
      {
        mode === 'BarChart' && <>
          <ConfigProps {...{onConfigChange, tab, availableProps}}/>
          <ResultBarChart {...{parsedJson, tab, availableProps}}/>
        </>
      }
      {
        mode === 'Calculation' && <>
          <ConfigProps {...{onConfigChange, tab, availableProps}}/>
          <ResultCalculation {...{parsedJson, tab, availableProps}}/>
        </>
      }
      {
        mode === 'Interfacing' && <>
          <ResultInterfacing {...{tab, availableProps}}/>
        </>
      }

    </div>
  );
};

export default TabContent