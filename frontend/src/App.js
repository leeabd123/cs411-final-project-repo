import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import Routes and Route
import Login from './login/login.js';
import Register from './register/register.js';
import { fetchWeatherByMonth } from './client.js';
import Modal from 'react-modal';
import UpdateUser from './updateUser/updateUser.js'; // Import the new component
import './App.css';

Modal.setAppElement('#root');


function App() {
    const [month, setMonth] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [sortOrder, setSortOrder] = useState('Newest to Oldest');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [comparedEvent, setComparedEvent] = useState(null);

    const handleMonthChange = (event) => {
      console.log("enterd");
        setMonth(event.target.value);
    };

    const handleCompareEventClick = (event) => {
        setComparedEvent(event);
    };

    const handleEventClick = async (event) => {
        const eventDetails = await fetchEventDetails(event.event_id, event.type);
        setSelectedEvent(eventDetails);
        setIsModalOpen(true);
    };

    useEffect(() => {
        // This code will run when 'count' or 'name' changes.
    
        console.log("selected type updated");
      }, [setSelectedType]); 
    

    // Function to fetch event details
    const fetchEventDetails = async (eventId, selectedType) => {
        console.log("eventid and type ", selectedType, " ", eventId);
        let url = '';
        switch (selectedType) {
            case 'Tornado':
                url = `http://localhost:3000/api/weather/tornado/:${eventId}`;
                break;
            case 'Blizzard':
                url = `http://localhost:3000/api/weather/blizzard/:${eventId}`;
                break;
            case 'Hail':
                url = `http://localhost:3000/api/weather/hail/:${eventId}`;
                break;
            // Add more cases as needed for different event types
        }
    
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch event details:', error);
            // Handle the error appropriately
        }
    };
    

    // Function to handle event click
    const handleDetialEventClick = async (event) => {
        const eventDetails = await fetchEventDetails(event.event_id);
        setSelectedEvent(eventDetails);
        setIsModalOpen(true);
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
            let dateA = new Date(a.eventBeginTime); // Assuming 'date' is the attribute for event date
            let dateB = new Date(b.eventBeginTime);
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
                              <div key={index} onClick = {() => handleEventClick(event)}>{event.category_id}: {event.event_id}, began at {event.eventBeginTime}</div>
                          ))}
                      </div>
                      {/* Modal rendering */}
                      {isModalOpen && (
                        <Modal 
                        isOpen={isModalOpen}
                        onRequestClose={() => { setIsModalOpen(false); setComparedEvent(null); }}
                        contentLabel="Event Details"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <h2>Event Details</h2>
                            <div>Category Name: {selectedEvent?.category_name}</div>
                            <div>User ID: {selectedEvent?.user_id}</div>
                            {/* Render other general details of selectedEvent */}
                            {/* Render specific details based on event type */}
                             </div>
                            {comparedEvent && (
                                <div>
                                    <h2>Compared Event Details</h2>
                                    <div>User ID: {comparedEvent?.user_id}</div>
                                    {/* Render other details of comparedEvent */}
                                </div>
                            )}
                        </div>
                    
                        <div>
                            <h3>Other Events:</h3>
                            <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                                {filteredData.map((event, index) => (
                                    <div key={index} onClick={() => handleCompareEventClick(event)}>
                                        {event.category_id}: {event.event_id}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Modal>
                        )}
                  </div>
              } />
          </Routes>
      </Router>
  );
  
}

export default App;
