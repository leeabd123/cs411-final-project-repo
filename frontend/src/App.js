import React, { useState } from 'react';
import axios from 'axios';
import './App.css';


const App = () => {
  const [state, setState] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = async () => {
    try {
      // Replace this URL with the endpoint of backend server
      //const response = await axios.get('url`);
      // setEvents(response.data);
    } catch (error) {
      console.error('Error fetching weather events:', error);
    }
  };

  return (
    <div className="App">
      <h1>NOAA Storm Events Database</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter a state..."
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="events-list">
        {events.map((event, index) => (
          <div key={index} className="event-item" onClick={() => handleOpenModal(event)}>
            {event.title}
          </div>
        ))}
      </div>
      {isModalOpen && selectedEvent && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>{selectedEvent.title}</h2>
            <p>{selectedEvent.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
