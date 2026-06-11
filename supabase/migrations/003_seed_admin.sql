-- Rodar APÓS criar sua conta em /login ou via Supabase Auth Dashboard
-- Substitua o e-mail pelo seu e-mail de acesso

UPDATE public.profiles
SET is_admin = true
WHERE email = 'rogeriocchavesxp@gmail.com';
