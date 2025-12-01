CREATE SCHEMA postgrest;
GRANT USAGE ON SCHEMA postgrest TO "authenticator";

create or replace function postgrest.pre_config()
returns void as $$
declare
  jwt_secret_value text;
begin
  select jsonb_build_object(
    'alg', 'EdDSA',
    'crv', (public_key::jsonb)->>'crv',
    'x',   (public_key::jsonb)->>'x',
    'kty', (public_key::jsonb)->>'kty',
    'kid', id
  )::text
  into jwt_secret_value
  from auth.jwks
  order by created_at desc
  limit 1;
  
  perform set_config('pgrst.jwt_secret', jwt_secret_value, true);
end;
$$ language plpgsql;