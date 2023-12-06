DELIMITER //

CREATE PROCEDURE WeatherStats(
  IN p_category_name VARCHAR(255),
  IN p_attribute VARCHAR(255),
  IN p_order_direction VARCHAR(4)
)
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE stat_value DECIMAL;
  
  CREATE TEMPORARY TABLE tempStats (
    Value DECIMAL
  );

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

  OPEN stat_cursor;

  stat_loop: LOOP
    FETCH stat_cursor INTO stat_value;
    IF done THEN
      LEAVE stat_loop;
    END IF;

    INSERT INTO tempStats (Value) VALUES (stat_value);
  END LOOP;

  CLOSE stat_cursor;

  SELECT
    'Average' AS Statistic, AVG(Value) AS Value
  UNION
  SELECT
    'Mean' AS Statistic, AVG(Value) AS Value
  UNION
  SELECT
    'Median' AS Statistic, PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY Value) AS Value
  UNION
  SELECT
    'Mode' AS Statistic, MODE() WITHIN GROUP (ORDER BY Value) AS Value
  FROM tempStats;

  SELECT * FROM tempStats ORDER BY Value;

  DROP TEMPORARY TABLE IF EXISTS tempStats;
END //

DELIMITER ;