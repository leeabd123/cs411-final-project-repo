DELIMITER

CREATE PROCEDURE weather_status(
  IN p_category_name VARCHAR(255),
  IN p_attribute VARCHAR(255),
  IN p_order_direction VARCHAR(4)
)
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE stat_value DECIMAL;
  DECLARE median_value DECIMAL;
  DECLARE mode_value DECIMAL;
  
  -- Declare the cursor before creating the temporary table
  DECLARE stat_cursor CURSOR FOR
    SELECT
      CASE
        WHEN p_attribute = 'deaths' THEN deathsDirect + deathsIndirect
        WHEN p_attribute = 'injuries' THEN injuriesDirect + injuriesIndirect
        WHEN p_attribute = 'property_damage' THEN IFNULL(damageProperty, 0)
        WHEN p_attribute = 'crop_damage' THEN IFNULL(damageCrops, 0)
        ELSE 0
      END AS value_stat
    FROM WeatherEvent we
    INNER JOIN Category c ON we.category_id = c.Category_id
    WHERE c.category_name = p_category_name;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  CREATE TEMPORARY TABLE tempStats (
    Value DECIMAL
  );

  OPEN stat_cursor;

  stat_loop: LOOP
    FETCH stat_cursor INTO stat_value;
    IF done THEN
      LEAVE stat_loop;
    END IF;

    INSERT INTO tempStats (Value) VALUES (stat_value);
  END LOOP;

  CLOSE stat_cursor;

  SELECT AVG(Value) INTO median_value FROM tempStats;

  SELECT Value INTO mode_value FROM (
    SELECT Value, COUNT(*) AS freq
    FROM tempStats
    GROUP BY Value
    ORDER BY freq DESC
    LIMIT 1
  ) AS subquery;

  SELECT 'Average' AS Statistic, AVG(Value) AS Value FROM tempStats;
  SELECT 'Mean' AS Statistic, AVG(Value) AS Value FROM tempStats;
  SELECT 'Median' AS Statistic, median_value AS Value;
  SELECT 'Mode' AS Statistic, mode_value AS Value;

  SELECT * FROM tempStats ORDER BY Value;

  DROP TEMPORARY TABLE IF EXISTS tempStats;
END;

DELIMITER ;
