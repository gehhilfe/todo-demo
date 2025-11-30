CREATE OR REPLACE FUNCTION current_user_id()
RETURNS text AS $$
BEGIN
    RETURN current_setting('app.request.user_id', true);
END;
$$ LANGUAGE plpgsql STABLE;
