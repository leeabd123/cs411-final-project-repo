import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './funfacts.css';

const FunFacts = () => {
    const [data, setData] = useState(null);
    const [dataType, setDataType] = useState('');

    const fetchData = async (endpoint, type) => {
        try {
            const response = await fetch(`http://localhost:3000/api/statistics/${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setData(result);
            setDataType(type);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setData(null);
            setDataType('');
        }
    };

    const handleDeathsByCategoryClick = () => {
        fetchData('total-deaths-by-category', 'deathsByCategory');
    };

    const handleWindSpeedClick = () => {
        fetchData('average-wind-speed-severe-tornadoes', 'windSpeed');
    };

    const renderData = () => {
        if (!data) return null;

        if (dataType === 'deathsByCategory') {
            return (
                <div className="category-container">
                    {data.map((item, index) => (
                        <div className="category-item" key={index}>
                            <h3>{item.category_name}</h3>
                            <p>Total Direct Deaths: {item.TotalDirectDeaths}</p>
                            <p>Total Indirect Deaths: {item.TotalIndirectDeaths}</p>
                        </div>
                    ))}
                </div>
            );
        } else if (dataType === 'windSpeed') {
            return (
                <div className="wind-speed-container">
                    <h3>Average Wind Speed for Severe Tornadoes</h3>
                    <p>{data[0].AverageWindSpeed} mph</p>
                </div>
            );
        }
    };

    return (
        <div>
            <h2>Fun Facts</h2>
            <button onClick={handleDeathsByCategoryClick}>Total Deaths by Category</button>
            <button onClick={handleWindSpeedClick}>Average Wind Speed for Severe Tornadoes</button>
            <div className="data-display">
                {renderData()}
            </div>
            <div className="back-to-home">
                <Link to="/">Back to Home</Link>
            </div>
        </div>
    );
};

export default FunFacts;
