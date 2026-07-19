-- 1. Create the table
DROP TABLE IF EXISTS public.organizations CASCADE;
CREATE TABLE public.organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);
-- 2. Insert sample data
INSERT INTO public.organizations (name, description, contact_email, logo_filename)
VALUES (
        'BrightFuture Builders',
        'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
        'info@brightfuturebuilders.org',
        'b_builders_logo.png'
    ),
    (
        'GreenHarvest Growers',
        'An urban farming collective promoting food sustainability and education in local neighborhoods.',
        'contact@greenharvest.org',
        'harvest_logo.png'
    ),
    (
        'UnityServe Volunteers',
        'A volunteer coordination group supporting local charities and service initiatives.',
        'hello@unityserve.org',
        'u_serve_logo.png'
    );
-- 1. Create table to register categories
CREATE TABLE public.categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);
-- 2. Create intermediate table to connect organizations and categories (Many-to-Many)
CREATE TABLE public.organization_categories (
    organization_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (organization_id, category_id),
    -- Foreign keys pointing to the correct tables in public schema
    FOREIGN KEY (organization_id) REFERENCES public.organizations(organization_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE
);
-- 4. Insert at least 3 categories relevant to service organizations
INSERT INTO public.categories (category_name)
VALUES ('Community Service'),
    ('Environmental'),
    ('Education');
-- 5. Associate each organization with at least one category
INSERT INTO public.organization_categories (organization_id, category_id)
VALUES (1, 1),
    (2, 2),
    (3, 3);
-- Drop the table first if it already exists to prevent creation errors
DROP TABLE IF EXISTS public.projects CASCADE;
-- 1. Create the projects table fresh
CREATE TABLE public.projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES public.organizations(organization_id)
);
-- 2. Insert closed, valid sample data for projects
INSERT INTO public.projects (
        organization_id,
        title,
        description,
        date,
        location
    )
VALUES (
        1,
        'Campus Maintenance',
        'Assisting with structures and campus cleanup.',
        '2026-08-01',
        'Main Campus'
    ),
    (
        1,
        'Sustainable Fish Pool',
        'Building eco-friendly aquatic habitats.',
        '2026-09-15',
        'Biology Lab Area'
    );