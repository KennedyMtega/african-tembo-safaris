INSERT INTO public.user_roles (user_id, role)
VALUES ('99999052-8523-402e-a6e0-4b9734209b3d', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;