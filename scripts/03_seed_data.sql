-- Insert default categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Tecnología', 'tecnologia', 'Noticias sobre tecnología e innovación'),
  ('Deportes', 'deportes', 'Noticias deportivas y resultados'),
  ('Política', 'politica', 'Actualidad política nacional e internacional'),
  ('Economía', 'economia', 'Noticias económicas y de negocios'),
  ('Cultura', 'cultura', 'Arte, espectáculos y entretenimiento'),
  ('Salud', 'salud', 'Noticias sobre salud y bienestar')
ON CONFLICT (slug) DO NOTHING;
