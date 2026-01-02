import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Search, Trash2, MapPin, Clock } from 'lucide-react';
import { getIPInfo } from '../services/api';
import IPInfo from '../components/IPInfo';
import SearchHistory from '../components/SearchHistory';
import Map from '../components/Map';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [currentIP, setCurrentIP] = useState(null);
  const [searchedIP, setSearchedIP] = useState(null);
  const [inputIP, setInputIP] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);

  const validateIP = (ip) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipRegex.test(ip);
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchCurrentIP();
  }, [navigate]);

  const fetchCurrentIP = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getIPInfo();
      const ipData = response.data.data || response.data;
      setCurrentIP(ipData);
      setSearchedIP(null);
      setInputIP('');
    } catch (err) {
      setError('Failed to fetch current IP information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedIP = inputIP.trim();
    if (!trimmedIP) {
      setError('Please enter an IP address');
      return;
    }

    if (!validateIP(trimmedIP)) {
      setError('Invalid IP address format');
      return;
    }

    setLoading(true);

    try {
      const response = await getIPInfo(trimmedIP);
      const ipData = response.data.data || response.data;
      setSearchedIP(ipData);
      
      if (!history.includes(trimmedIP)) {
        setHistory([trimmedIP, ...history]);
      }
      setInputIP('');
    } catch (err) {
      setError('Failed to fetch IP information. Please check the IP address.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputIP('');
    setSearchedIP(null);
    setError('');
    fetchCurrentIP();
  };

  const handleHistorySelect = async (ip) => {
    setError('');
    setLoading(true);
    try {
      const response = await getIPInfo(ip);
      const ipData = response.data.data || response.data;
      setSearchedIP(ipData);
      setInputIP(ip);
    } catch (err) {
      setError('Failed to fetch IP information. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDeleteHistory = (index) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  const displayIP = searchedIP || currentIP;

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <motion.div
          className="header-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="logo">
            <MapPin className="w-6 h-6 text-cyan-400" />
            <h1>IP Intelligence</h1>
          </div>
        </motion.div>

        <motion.div
          className="header-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {user && <span className="user-badge">{user.email}</span>}
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </motion.div>
      </header>

      {/* Main content */}
      <main className="home-content">
        {/* Search Section */}
        <motion.section
          className="search-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="section-header">
            <h2>
              <Search className="w-5 h-5" />
              IP Lookup
            </h2>
            <p className="section-subtitle">Enter an IP address to get detailed geolocation information</p>
          </div>

          <form onSubmit={handleSearch} className="search-form glass">
            <div className="search-input-wrapper">
              <input
                type="text"
                value={inputIP}
                onChange={(e) => setInputIP(e.target.value)}
                placeholder="e.g., 8.8.8.8 or 1.1.1.1"
                disabled={loading}
                className="search-input"
              />
              <span className="input-icon">192.168</span>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="search-button"
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
            >
              <Search className="w-4 h-4" />
              {loading ? 'Scanning...' : 'Search'}
            </motion.button>

            <motion.button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="clear-button"
              whileHover={!loading ? { scale: 1.02 } : {}}
            >
              Reset
            </motion.button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                className="error-banner"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                ⚠ {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* IP Info Section */}
        <motion.section
          className="ip-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="section-header">
            <h2>
              {searchedIP ? (
                <>
                  <span className="text-cyan-400">{searchedIP.ip}</span> Information
                </>
              ) : (
                <>Your IP Address</>
              )}
            </h2>
          </div>
          <IPInfo
            ipData={searchedIP || currentIP}
            loading={loading && !searchedIP}
            error={!searchedIP && error}
          />
        </motion.section>

        {/* Search Results */}
        <AnimatePresence>
          {searchedIP && (
            <motion.section
              className="ip-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="section-header">
                <h2>
                  <span className="text-cyan-400">{searchedIP.ip}</span> Results
                </h2>
              </div>
              <IPInfo ipData={searchedIP} loading={false} error={null} />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Map Section */}
        <AnimatePresence>
          {displayIP && displayIP.loc && (
            <motion.section
              className="map-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="section-header">
                <h2>
                  <MapPin className="w-5 h-5" />
                  Location Map
                </h2>
              </div>
              <Map
                latitude={parseFloat(displayIP.loc.split(',')[0])}
                longitude={parseFloat(displayIP.loc.split(',')[1])}
                city={displayIP.city}
                ip={displayIP.ip}
              />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Search History Section */}
        <AnimatePresence>
          {history.length > 0 && (
            <motion.section
              className="history-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="section-header">
                <h2>
                  <Clock className="w-5 h-5" />
                  Recent Searches
                </h2>
              </div>
              <SearchHistory
                history={history}
                onSelect={handleHistorySelect}
                onDelete={handleDeleteHistory}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Home;
