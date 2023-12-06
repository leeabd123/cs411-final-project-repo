DELIMITER

CREATE PROCEDURE GetWeatherEventsByCategoryAndTemperatureAndWindSpeed(
    IN category_param VARCHAR(255),
    IN temperature_choice DECIMAL(10, 2),
    IN wind_speed_choice INT
)
BEGIN
    DECLARE finished INT DEFAULT 0;
    DECLARE event_id INT;
    DECLARE event_type VARCHAR(255);
    DECLARE temperature DECIMAL(10, 2);
    DECLARE wind_speed INT;

    CREATE TEMPORARY TABLE temp_results (
        event_id INT,
        event_type VARCHAR(255),
        event_average_temperature DECIMAL(10, 2),
        event_wind_speed INT
    );

    DECLARE tornado_cursor CURSOR FOR
        SELECT e.event_id, e.event_type, AVG(t.temperature) AS average_temperature, MAX(t.wind_speed) AS max_wind_speed
        FROM WeatherEvent e
        JOIN Tornado t ON e.event_id = t.event_id
        WHERE e.category_id = (SELECT category_id FROM Category WHERE category_name = category_param)
        GROUP BY e.event_id, e.event_type;

    DECLARE blizzard_cursor CURSOR FOR
        SELECT e.event_id, e.event_type, AVG(b.temperature) AS average_temperature, MAX(b.wind_speed) AS max_wind_speed
        FROM WeatherEvent e
        JOIN Blizzard b ON e.event_id = b.event_id
        WHERE e.category_id = (SELECT category_id FROM Category WHERE category_name = category_param)
        GROUP BY e.event_id, e.event_type;

    DECLARE hail_cursor CURSOR FOR
        SELECT e.event_id, e.event_type, AVG(h.temperature) AS average_temperature, MAX(h.fall_speed) AS max_fall_speed
        FROM WeatherEvent e
        JOIN Hail h ON e.event_id = h.event_id
        WHERE e.category_id = (SELECT category_id FROM Category WHERE category_name = category_param)
        GROUP BY e.event_id, e.event_type;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;

    OPEN tornado_cursor;

    tornado_loop: LOOP
        FETCH tornado_cursor INTO event_id, event_type, temperature, wind_speed;

        IF finished = 1 THEN
            LEAVE tornado_loop;
        END IF;

        IF temperature > temperature_choice AND wind_speed > wind_speed_choice THEN
            INSERT INTO temp_results VALUES (event_id, event_type, temperature, wind_speed);
        END IF;
    END LOOP;

    CLOSE tornado_cursor;

    OPEN blizzard_cursor;

    blizzard_loop: LOOP
        FETCH blizzard_cursor INTO event_id, event_type, temperature, wind_speed;

        IF finished = 1 THEN
            LEAVE blizzard_loop;
        END IF;

        IF temperature > temperature_choice AND wind_speed > wind_speed_choice THEN
            INSERT INTO temp_results VALUES (event_id, event_type, temperature, wind_speed);
        END IF;
    END LOOP;

    CLOSE blizzard_cursor;

    OPEN hail_cursor;

    hail_loop: LOOP
        FETCH hail_cursor INTO event_id, event_type, temperature, wind_speed;

        IF finished = 1 THEN
            LEAVE hail_loop;
        END IF;

        IF temperature > temperature_choice AND wind_speed > wind_speed_choice THEN
            INSERT INTO temp_results VALUES (event_id, event_type, temperature, wind_speed);
        END IF;
    END LOOP;

    CLOSE hail_cursor;

    SELECT * FROM temp_results;

    DROP TEMPORARY TABLE IF EXISTS temp_results;
END;


DELIMITER ;