INSERT INTO permission (slug, name) 
VALUES 
    ('organization.view', 'View Organization'),
    ('organization.update', 'Update Organization')
ON CONFLICT(slug) 
DO UPDATE SET 
    name = EXCLUDED.name;

INSERT INTO role (id, organization_id, name, description)
VALUES 
  ('K8lmuZ8IWS2ylsgHX0lWO1f2WRMYTN2c', NULL, 'User', 'Default readonly user role'),
  ('HN3O10yZ1LF4TceZoijHz22ICk7V11ha', NULL, 'Admin', 'Admin role')
ON CONFLICT(id) 
DO UPDATE SET 
    name = EXCLUDED.name, 
    description = EXCLUDED.description;

INSERT INTO role_permission (role_id, permission_slug)
VALUES 
  ('K8lmuZ8IWS2ylsgHX0lWO1f2WRMYTN2c', 'organization.view'),
  ('HN3O10yZ1LF4TceZoijHz22ICk7V11ha', 'organization.view'),
  ('HN3O10yZ1LF4TceZoijHz22ICk7V11ha', 'organization.update')
ON CONFLICT(role_id, permission_slug) 
DO NOTHING;