import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Copy, Check } from 'lucide-react';
import './SearchHistory.css';

const SearchHistory = ({ history, onSelect, onDelete }) => {
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [copiedIP, setCopiedIP] = useState(null);

  if (history.length === 0) {
    return (
      <div className="search-history-empty glass">
        <div className="empty-icon">📭</div>
        <p>No search history yet</p>
      </div>
    );
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

  const handleCopyIP = (ip) => {
    navigator.clipboard.writeText(ip);
    setCopiedIP(ip);
    setTimeout(() => setCopiedIP(null), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="search-history-card glass">
      <div className="history-header">
        <div className="history-title">
          <span className="history-count">{history.length}</span>
          <span>Recent Searches</span>
        </div>
        <AnimatePresence mode="wait">
          {selectedIndices.size > 0 ? (
            <motion.div
              key="delete"
              className="history-controls"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <label className="select-all-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIndices.size === history.length && history.length > 0}
                  onChange={handleSelectAll}
                />
                <span>All</span>
              </label>
              <motion.button
                className="delete-selected-btn"
                onClick={handleDeleteSelected}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="w-4 h-4" />
                Delete {selectedIndices.size}
              </motion.button>
            </motion.div>
          ) : (
            <motion.label
              key="select"
              className="select-all-checkbox"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <input
                type="checkbox"
                checked={false}
                onChange={handleSelectAll}
              />
              <span>Select All</span>
            </motion.label>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="history-list"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {history.map((ip, index) => (
            <motion.div
              key={`${ip}-${index}`}
              className={`history-item glass ${selectedIndices.has(index) ? 'selected' : ''}`}
              variants={itemVariants}
              exit={{ opacity: 0, x: -20 }}
              layout
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="checkbox"
                checked={selectedIndices.has(index)}
                onChange={() => handleCheckboxChange(index)}
                className="history-checkbox"
              />

              <motion.span
                className="history-ip"
                onClick={() => onSelect && onSelect(ip)}
                whileHover={{ color: '#22D3EE' }}
              >
                {ip}
              </motion.span>

              <div className="history-actions">
                <motion.button
                  className="history-copy-btn"
                  onClick={() => handleCopyIP(ip)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Copy IP address"
                >
                  {copiedIP === ip ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </motion.button>

                <motion.button
                  className="history-delete-btn"
                  onClick={() => onDelete(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Delete this IP"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SearchHistory;
