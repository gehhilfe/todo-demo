CREATE OR REPLACE FUNCTION has_permission(
    organization_id text,
    permission_slug text
) RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM user_role ur
        JOIN role_permission rp ON ur.role_id = rp.role_id
        WHERE ur.user_id = auth.uid()
          AND ur.organization_id = has_permission.organization_id
          AND rp.permission_slug = has_permission.permission_slug
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;