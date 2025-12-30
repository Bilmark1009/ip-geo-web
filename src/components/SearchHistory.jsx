import React, { useState } from 'react';
import './SearchHistory.css';

const SearchHistory = ({ history, onSelect, onDelete }) => {
  const [selectedIndices, setSelectedIndices] = useState(new Set());

  if (history.length === 0) {
    return <div className="search-history-empty">No search history yet</div>;
  }

  const handleCheckboxChange = (index) => {
    const newSelected = new Set(selectedIndices);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedIndices(newSelected);
  };

  const handleDeleteSelected = () => {
    // Delete in reverse order to maintain correct indices
    const indicesToDelete = Array.from(selectedIndices).sort((a, b) => b - a);
    indicesToDelete.forEach(index => onDelete(index));
    setSelectedIndices(new Set());
  };

  const handleSelectAll = () => {
    if (selectedIndices.size === history.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(history.map((_, i) => i)));
    }
  };

  return (
    <div className="search-history-card">
      <div className="history-header">
        <h3>Search History</h3>
        {history.length > 0 && (
          <div className="history-controls">
            <label className="select-all-checkbox">
              <input 
                type="checkbox"
                checked={selectedIndices.size === history.length && history.length > 0}
                onChange={handleSelectAll}
              />
              Select All
            </label>
            {selectedIndices.size > 0 && (
              <button 
                className="delete-selected-btn"
                onClick={handleDeleteSelected}
              >
                Delete Selected ({selectedIndices.size})
              </button>
            )}
          </div>
        )}
      </div>
      <div className="history-list">
        {history.map((ip, index) => (
          <div 
            key={index} 
            className={`history-item ${selectedIndices.has(index) ? 'selected' : ''}`}
          >
            <input 
              type="checkbox"
              checked={selectedIndices.has(index)}
              onChange={() => handleCheckboxChange(index)}
              className="history-checkbox"
            />
            <span 
              className="history-ip"
              onClick={() => onSelect && onSelect(ip)}
              title="Click to reload this IP"
            >
              {ip}
            </span>
            <button
              className="history-delete-btn"
              onClick={() => onDelete(index)}
              title="Delete"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
