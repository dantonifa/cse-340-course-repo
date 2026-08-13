DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.service_projects CASCADE;
DROP TABLE IF EXISTS public.project_categories CASCADE;
DROP TABLE IF EXISTS public.project_volunteer CASCADE;
-- 1. Create the roles table
CREATE TABLE public.roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);
-- Insert the two initial roles into the table
insert into public.roles (role_name, role_description)
values ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');
-- Verify that the rows were successfully inserted
select *
from public.roles;
-- 2. Create the users table with a foreign key constraint to roles table
create table public.users (
    user_id serial primary key,
    name varchar(100) not null,
    email varchar (100) unique not null,
    password_hash varchar(255) not null,
    role_id integer not null,
    created_at timestamp default current_timestamp,
    constraint fk_role foreign key (role_id) references public.roles (role_id)
);
-- 3. Create the table public.organizations to store information about service organizations
CREATE TABLE public.organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);
-- Insert sample data into the organizations table
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
    ),
    (
        'EcoWave CleanUp',
        'Dedicated to beach cleaning and marine life protection.',
        'contact@ecowave.org',
        'placeholder-logo.png'
    ),
    (
        'MindMatters Support',
        'Mental health awareness and free counseling services.',
        'help@mindmatters.org',
        'placeholder-logo.png'
    ),
    (
        'Paws & Claws Shelter',
        'An animal rescue group finding homes for stray pets.',
        'adopt@pawsclaws.org',
        'placeholder-logo.png'
    ),
    (
        'TechStart Academy',
        'Providing free coding lessons to underprivileged kids.',
        'info@techstart.org',
        'placeholder-logo.png'
    ),
    (
        'FoodForAll Kitchen',
        'Community food bank supplying meals to families in need.',
        'meals@foodforall.org',
        'placeholder-logo.png'
    ),
    (
        'SeniorCare Companions',
        'Connecting volunteers with isolated elderly citizens.',
        'support@seniorcare.org',
        'placeholder-logo.png'
    ),
    (
        'ArtSparks Collective',
        'Funding creative arts workshops in local schools.',
        'create@artsparks.org',
        'placeholder-logo.png'
    ),
    (
        'HealthyHearts Clinic',
        'Mobile health vans providing basic medical checks.',
        'clinic@healthyhearts.org',
        'placeholder-logo.png'
    ),
    (
        'LiteracyFirst Group',
        'Adult reading programs and library text donations.',
        'books@literacyfirst.org',
        'placeholder-logo.png'
    ),
    (
        'CityParks Initiative',
        'Planting trees and creating urban community spaces.',
        'green@cityparks.org',
        'placeholder-logo.png'
    ),
    (
        'WarmHomes Housing',
        'Assisting low-income families with home repairs.',
        'housing@warmhomes.org',
        'placeholder-logo.png'
    ),
    (
        'SafeHaven Women',
        'Crisis shelter and career coaching for women.',
        'info@safehaven.org',
        'placeholder-logo.png'
    );
-- 4. Create table to register categories
CREATE TABLE public.categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);
-- Insert at least 3 categories relevant to service organizations
INSERT INTO public.categories (category_name)
VALUES ('Community Service'),
    ('Environmental'),
    ('Education');
-- 5. Create the service_projects table fresh
CREATE TABLE public.service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES public.organizations(organization_id) ON DELETE CASCADE
);
-- Insert closed, valid sample data for projects
INSERT INTO public.service_projects (
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
    ),
    (
        4,
        'grading',
        'help schools grade assignments',
        '2026-10-20',
        'Online Portal'
    ),
    (
        1,
        'Science Fair',
        'The Science Fair is a project to help students to develop their creativity and application of the scientific knowledge.',
        '2026-11-05',
        'Main Auditorium'
    ),
    (
        1,
        'Test Project Beta',
        'Description for Test Project Beta.',
        '2026-12-01',
        'Test Location'
    ),
    (
        1,
        'Test Project Alpha',
        'This is a test project to check visibility bug.',
        '2026-12-15',
        'Beta Zone'
    ),
    (
        4,
        'grading',
        'help schools grade assignments',
        '2026-10-20',
        'Online Portal'
    );
-- 6. Create intermediate table to connect projects and categories
CREATE TABLE IF NOT EXISTS public.project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES public.service_projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE
);
INSERT INTO public.project_categories (project_id, category_id)
VALUES (1, 1),
    (2, 2),
    (3, 3);
-- 6. Create intermediate table to connect organizations and categories (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.organization_categories (
    organization_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (organization_id, category_id),
    -- Foreign keys pointing to the correct tables in public schema
    FOREIGN KEY (organization_id) REFERENCES public.organizations(organization_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE
);
-- Associate each organization with at least one category
INSERT INTO public.organization_categories (organization_id, category_id)
VALUES (1, 1),
    (2, 2),
    (3, 3);
-- 7. Create public.project_volunteer table to connect users and projects (Many-to-Many)
CREATE TABLE IF NOT EXISTS project_volunteer (
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES public.service_projects(project_id) ON DELETE CASCADE
);