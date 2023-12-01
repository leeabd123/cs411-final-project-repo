import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const express = require('express');
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '34.41.207.129',
  user: 'root',
  password: '',
  database: 'CS411-Project',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  }
}

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
      setEvents(response.data);
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
