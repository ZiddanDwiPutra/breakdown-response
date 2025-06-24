import React, { useState } from 'react';

import { X, Plus } from 'lucide-react'; // Menggunakan lucide-react untuk ikon
import TabContent, { type Tab } from './components/tabs';

// Main application component
const App: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([{
    id: 'tab-1',
    title: 'Tab 1',
    jsonInput: '',
    selectedProps: [],
    err: false,
    mode: ""
  }]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  const addTab = (): void => {
    const newTabId = `tab-${tabs.length + 1}`;
    setTabs([...tabs, {
      id: newTabId,
      title: `Tab ${tabs.length + 1}`,
      jsonInput: '',
      selectedProps: [],
    }]);
    setActiveTabId(newTabId);
  };

  const removeTab = (idToRemove: string): void => {
    if (tabs.length === 1) {
      // Not allowing deletion if only one tab exists
      // Using a custom message box instead of alert()
      const confirmRemoval = window.confirm('Apakah Anda yakin ingin menghapus tab ini? Ini adalah satu-satunya tab yang tersisa.');
      if (!confirmRemoval) {
        return;
      }
    }
    const newTabs = tabs.filter((tab: Tab) => tab.id !== idToRemove);
    setTabs(newTabs);

    // If the active tab is deleted, switch to the first remaining tab
    if (activeTabId === idToRemove && newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
    } else if (newTabs.length === 0) {
      // This case should ideally not happen if we don't allow deleting the last tab
      // But good to handle if logic changes
      setTabs([{
        id: 'tab-1',
        title: 'Tab 1',
        jsonInput: '',
        selectedProps: [],
      }]);
      setActiveTabId('tab-1');
    }
  };

  const handleJsonChange = (tabId: string, newJsonInput: string): void => {
    setTabs(tabs.map((tab: Tab) =>
      tab.id === tabId ? { ...tab, jsonInput: newJsonInput } : tab
    ));
  };

  const handleConfigChange = (tabId: string, newSelectedProps: string[]): void => {
    setTabs(tabs.map((tab: Tab) =>
      tab.id === tabId ? { ...tab, selectedProps: newSelectedProps } : tab
    ));
  };

  return (
    <div className="min-h-screen bg-gray-300 font-sans text-gray-900 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header and Tab Navigation */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
          <h1 className="text-xl font-bold mb-4 text-center">{"{Breakdown: 'Response'}"}</h1>
          <nav className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-400">
            <div className="flex overflow-x-auto custom-scrollbar-hide">
              {tabs.map((tab: Tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 mr-1 whitespace-nowrap
                    ${activeTabId === tab.id
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'bg-blue-500 hover:bg-blue-600 text-blue-100'
                    }`}
                >
                  {tab.title}
                  {tabs.length > 1 && (
                    <span
                      onClick={(e: React.MouseEvent) => { e.stopPropagation(); removeTab(tab.id); }}
                      className="ml-2 p-1 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200"
                      aria-label={`Tutup tab ${tab.title}`}
                    >
                      <X size={14} />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={addTab}
              className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-t-lg shadow-sm transition-colors duration-200"
            >
              <Plus size={16} className="mr-1" />
              Tambah Tab
            </button>
          </nav>
        </div>

        {/* Active Tab Content */}
        <div className="p-6">
          {tabs.map((tab: Tab) => (
            activeTabId === tab.id && (
              <TabContent
                key={tab.id}
                tab={tab}
                onJsonChange={handleJsonChange}
                onConfigChange={handleConfigChange}
              />
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
