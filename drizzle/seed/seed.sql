INSERT INTO "user" (id, name, email, email_verified, image, created_at, updated_at)
VALUES (
    'ZL3XWeKfZp3rlxVzykWGQphAwBdMaxNx',
    'Test User',
    'user@test.com',
    false,
    NULL,
    '2025-11-30 17:03:31.999',
    '2025-11-30 17:03:31.999'
) ON CONFLICT(id) DO NOTHING;

INSERT INTO "user" (id, name, email, email_verified, image, created_at, updated_at)
VALUES (
    'fGM8iJ8P6NeKFDuboM8FLjKjma2arqC0',
    'Test Admin',
    'admin@test.com',
    false,
    NULL,
    '2025-11-30 17:03:31.999',
    '2025-11-30 17:03:31.999'
) ON CONFLICT(id) DO NOTHING;

INSERT INTO "account" (id, account_id, provider_id, user_id, access_token, refresh_token, id_token, access_token_expires_at, refresh_token_expires_at, scope, password, created_at, updated_at)
VALUES (
    '57wV8BrOaiH1bdBkx8p3ynaO1ZHZflUd',
    'ZL3XWeKfZp3rlxVzykWGQphAwBdMaxNx',
    'credential',
    'ZL3XWeKfZp3rlxVzykWGQphAwBdMaxNx',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '272ce44d112b85d6a8f5147accd7bd75:178c7f78f08297234ccd7db66f81f40fe2d0d6b2ef557d3c53ae5bb6c61e5ddd61dec0dd6e15ff100846942a27affbd2c07fa624f2397eee89780b9bdf6ecdd9',
    '2025-11-30 17:03:32.016',
    '2025-11-30 17:03:32.016'
) ON CONFLICT(id) DO NOTHING;

INSERT INTO "account" (id, account_id, provider_id, user_id, access_token, refresh_token, id_token, access_token_expires_at, refresh_token_expires_at, scope, password, created_at, updated_at)
VALUES (
    'pWpzzwyocuuSpmMU587p4I9iLlkYuV4l',
    'fGM8iJ8P6NeKFDuboM8FLjKjma2arqC0',
    'credential',
    'fGM8iJ8P6NeKFDuboM8FLjKjma2arqC0',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '272ce44d112b85d6a8f5147accd7bd75:178c7f78f08297234ccd7db66f81f40fe2d0d6b2ef557d3c53ae5bb6c61e5ddd61dec0dd6e15ff100846942a27affbd2c07fa624f2397eee89780b9bdf6ecdd9',
    '2025-11-30 17:03:32.016',
    '2025-11-30 17:03:32.016'
) ON CONFLICT(id) DO NOTHING;

INSERT INTO "organization" (id, name, created_at, updated_at)
VALUES (
    'EQLV6sP1s35RP7PqezUKZWbLYRlmgvQB',
    'Test Organization',
    '2025-11-30 17:03:32.016',
    '2025-11-30 17:03:32.016'
),
(
    'x7PTyusjtS5iooWqBDe0ti2J91WXV5rm',
    'Other Organization',
    '2025-11-30 17:03:32.016',
    '2025-11-30 17:03:32.016'
)
 ON CONFLICT(id) DO NOTHING;

INSERT INTO "user_role" (user_id, role_id, organization_id)
VALUES (
    'ZL3XWeKfZp3rlxVzykWGQphAwBdMaxNx', -- user@test.com
    'K8lmuZ8IWS2ylsgHX0lWO1f2WRMYTN2c', -- role user
    'EQLV6sP1s35RP7PqezUKZWbLYRlmgvQB' -- organization id
) ON CONFLICT(user_id, role_id, organization_id) DO NOTHING;

INSERT INTO "user_role" (user_id, role_id, organization_id)
VALUES (
    'fGM8iJ8P6NeKFDuboM8FLjKjma2arqC0', -- admin@test.com
    'HN3O10yZ1LF4TceZoijHz22ICk7V11ha', -- role admin
    'EQLV6sP1s35RP7PqezUKZWbLYRlmgvQB' -- organization id
) ON CONFLICT(user_id, role_id, organization_id) DO NOTHING;