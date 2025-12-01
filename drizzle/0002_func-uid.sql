CREATE OR REPLACE FUNCTION auth.uid() RETURNS text AS $$
DECLARE
    user_id_val text;
    jwt_claims text;
BEGIN
    -- First try to get user_id from app.request.user_id
    user_id_val := current_setting('app.request.user_id', true);
    
    -- If user_id is not set, check JWT claims for sub (user ID)
    IF user_id_val IS NULL OR user_id_val = '' THEN
        BEGIN
            jwt_claims := current_setting('request.jwt.claims', true);
            IF jwt_claims IS NOT NULL AND jwt_claims != '' THEN
                user_id_val := jwt_claims::json->>'sub';
            END IF;
        EXCEPTION
            WHEN OTHERS THEN
                -- If JWT claims parsing fails, return NULL
                user_id_val := NULL;
        END;
    END IF;
    
    RETURN user_id_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;--> statement-breakpoint