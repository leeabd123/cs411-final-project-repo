import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import Routes and Route
import Login from './login/login.js';
import Register from './register/register.js';
import { fetchWeatherByMonth } from './client.js';
import UpdateUser from './updateUser/updateUser.js'; // Import the new component
import './App.css';

function App() {
    const [month, setMonth] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [sortOrder, setSortOrder] = useState('Newest to Oldest');

    const handleMonthChange = (event) => {
      console.log("enterd");
        setMonth(event.target.value);
    };

    const handleSubmit = async (event) => {
      console.log("enterd");

        event.preventDefault();
        const data = await fetchWeatherByMonth(month);
        console.log("exit");

        setWeatherData(data);
        setFilteredData(data); // Reset filtered data
    };

    useEffect(() => {
        // Apply type filter on the fetched month data
        let filtered = selectedType ? weatherData.filter(event => event.type === selectedType) : weatherData;

        // Sorting logic
        filtered.sort((a, b) => {
            let dateA = new Date(a.date); // Assuming 'date' is the attribute for event date
            let dateB = new Date(b.date);
            return sortOrder === 'Newest to Oldest' ? dateB - dateA : dateA - dateB;
        });

        setFilteredData(filtered);
    }, [selectedType, weatherData, sortOrder]);

    return (
      <Router>
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/update-user" element={<UpdateUser />} /> {/* New Route for updating user */}
              <Route path="/" element={
                  <div>
                      <div>
                          {/* Navigation Links (Optional) */}
                          <Link to="/login">Login</Link>
                          <Link to="/register">Register</Link>
                          <Link to="/update-user">Update User</Link>

                      </div>
                      <form onSubmit={handleSubmit}>
                          <input type="text" value={month} onChange={handleMonthChange} placeholder="Enter month (e.g., 01 for January)" />
                          <button type="submit">Search</button>
                      </form>
                      <div>
                          <button onClick={() => setSelectedType('Tornado')}>Tornado</button>
                          <button onClick={() => setSelectedType('Blizzard')}>Blizzard</button>
                          <button onClick={() => setSelectedType('Hail')}>Hail</button>
                          <button onClick={() => setSelectedType('')}>Show All</button>
                      </div>
                      <div>
                          <button onClick={() => setSortOrder('Newest to Oldest')}>Newest to Oldest</button>
                          <button onClick={() => setSortOrder('Oldest to Newest')}>Oldest to Newest</button>
                      </div>
                      <div style={{ overflowY: 'scroll', height: '400px' }}>
                          {filteredData.map((event, index) => (
                              <div key={index}>{/* Display weather event details here */}</div>
                          ))}
                      </div>
                  </div>
              } />
          </Routes>
      </Router>
  );
  
}

export default App;
