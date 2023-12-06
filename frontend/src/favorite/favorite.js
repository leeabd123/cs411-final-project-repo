import React, { useState, useEffect } from 'react';
import './favorite.css';

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dummy user ID - replace with actual user ID
    const userId = 2;

    // Function to fetch favorite events
    const fetchFavorites = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}/favorites`, {
                method: 'GET', // Specify the HTTP method as GET
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} 1`);
            }
            const data = await response.json();
            console.log(data);
            setFavorites(data);
        } catch (error) {
            console.error('Failed to fetch favorite events:', error);
            setError(error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites(); // Call the fetchFavorites function
    }, [userId]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>My Favorite Weather Events</h2>
            <div className="weather-event-container">
                {favorites.map((event, index) => (
                    <div key={index} className="weather-event">
                        <h3>{event.category_name}</h3>
                        <p>Event ID: {event.Event_id}</p>
                        <p>Event Begin Time: {event.eventBeginTime}</p>
                        <p>Event End Time: {event.eventEndTime}</p>
                        <p>Damage to Property: {event.damageProperty}</p>
                        <p>Place: {event.place}</p>
                        <p>Deaths Direct: {event.deathsDirect}</p>
                        <p>Deaths Indirect: {event.deathsIndirect}</p>
                        <p>Injuries Direct: {event.injuriesDirect}</p>
                        <p>Injuries Indirect: {event.injuriesIndirect}</p>
                        <p>Damage to Crops: {event.damageCrops}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favorites;
