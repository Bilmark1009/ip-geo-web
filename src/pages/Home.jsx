import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Validate IP format (basic check)
  const validateIP = (ip) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipRegex.test(ip);
  };

  // Fetch current user's IP on mount
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
      // Handle both direct data and wrapped response
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
      setError('Invalid IP address format. Please check and try again.');
      return;
    }

    setLoading(true);

    try {
      const response = await getIPInfo(trimmedIP);
      // Handle both direct data and wrapped response
      const ipData = response.data.data || response.data;
      setSearchedIP(ipData);
      
      // Add to history if not already there
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
      <header className="home-header">
        <h1>IP Geolocation Lookup</h1>
        <div className="header-actions">
          {user && <span className="user-email">Welcome, {user.email}</span>}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="home-content">
        {/* Current IP Info Section */}
        <section className="ip-section">
          <h2>Your IP Information</h2>
          <IPInfo 
            ipData={currentIP} 
            loading={loading && !searchedIP}
            error={!searchedIP && error}
          />
        </section>

        {/* Search Section */}
        <section className="search-section">
          <h2>Search by IP Address</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={inputIP}
              onChange={(e) => setInputIP(e.target.value)}
              placeholder="e.g., 8.8.8.8"
              disabled={loading}
              className="search-input"
            />
            <button 
              type="submit" 
              className="search-btn"
              disabled={loading}
            >
              {loading && searchedIP !== null ? 'Searching...' : 'Search'}
            </button>
            <button 
              type="button" 
              className="clear-btn"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>
          </form>

          {searchedIP && (
            <>
              <h3>Search Results</h3>
              <IPInfo 
                ipData={searchedIP} 
                loading={false}
                error={null}
              />
            </>
          )}

          {searchedIP && error && <div className="error-message">{error}</div>}
          {!searchedIP && error && <div className="error-message">{error}</div>}
        </section>

        {/* Search History Section */}
        {history.length > 0 && (
          <section className="history-section">
            <h2>Recent Searches</h2>
            <SearchHistory 
              history={history}
              onSelect={handleHistorySelect}
              onDelete={handleDeleteHistory}
            />
          </section>
        )}

        {/* Map Section */}
        {displayIP && displayIP.loc && (
          <section className="map-section">
            <Map 
              latitude={parseFloat(displayIP.loc.split(',')[0])}
              longitude={parseFloat(displayIP.loc.split(',')[1])}
              city={displayIP.city}
              ip={displayIP.ip}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;
