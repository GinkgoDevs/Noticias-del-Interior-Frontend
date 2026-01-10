-- IMPORTANTE: Este script solo funciona DESPUÉS de que te registres manualmente
-- en la aplicación (usa /register)
-- 
-- Instrucciones:
-- 1. Ve a /register y crea una cuenta con tu email
-- 2. Después de registrarte, ejecuta este script reemplazando 'tu-email@ejemplo.com' 
--    con el email que usaste para registrarte
-- 3. Esto actualizará tu rol a 'admin'

-- Actualizar el rol del usuario a admin
-- REEMPLAZA 'tu-email@ejemplo.com' con tu email real
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'tu-email@ejemplo.com';

-- Verificar que el cambio se aplicó correctamente
SELECT id, email, full_name, role, created_at
FROM public.profiles
WHERE email = 'tu-email@ejemplo.com';
