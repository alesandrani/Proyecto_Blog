BEGIN;
-- Primero eliminamos los posts asociados
DELETE FROM "Post" WHERE "blogId" = 3;
-- Luego eliminamos el blog
DELETE FROM "Blog" WHERE id = 3;
COMMIT; 