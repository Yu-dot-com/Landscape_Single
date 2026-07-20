-- =========================================================================
-- 1. EXTENSIONS & ENUMS SETUP
-- =========================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop dependent tables first to clear relationships safely
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS placed_items CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS asset_subcategories CASCADE;
DROP TABLE IF EXISTS asset_categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop and recreate custom ENUM types
DROP TYPE IF EXISTS project_role;
CREATE TYPE project_role AS ENUM ('viewer', 'editor', 'admin');


-- =========================================================================
-- 2. INDEPENDENT / PARENT TABLES
-- =========================================================================

-- USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hash_password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ASSET CATEGORIES TABLE
CREATE TABLE asset_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE
);


-- =========================================================================
-- 3. DEPENDENT / CHILD TABLES (Level 1)
-- =========================================================================

-- ASSET SUBCATEGORIES TABLE (Depends on asset_categories)
CREATE TABLE asset_subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT fk_subcategory_category
        FOREIGN KEY (category_id)
        REFERENCES asset_categories(id)
        ON DELETE CASCADE
);

-- PROJECTS TABLE (Depends on users)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Added default generator
    owner_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_projects_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================================================
-- 4. DEPENDENT / CHILD TABLES (Level 2)
-- =========================================================================

-- ASSETS TABLE (Depends on categories and subcategories)
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL,
    subcategory_id UUID,
    name VARCHAR(255) NOT NULL,
    image_path TEXT,
    width DOUBLE PRECISION NOT NULL,
    height DOUBLE PRECISION NOT NULL,
    min_width DOUBLE PRECISION NOT NULL,
    max_width DOUBLE PRECISION NOT NULL,
    min_height DOUBLE PRECISION NOT NULL,
    max_height DOUBLE PRECISION NOT NULL,
    default_points JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_asset_category
        FOREIGN KEY (category_id)
        REFERENCES asset_categories(id),
    CONSTRAINT fk_asset_subcategory
        FOREIGN KEY (subcategory_id)
        REFERENCES asset_subcategories(id)
);

-- PROJECT MEMBERS TABLE (Depends on projects and users)
CREATE TABLE project_members (
    project_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role project_role NOT NULL DEFAULT 'viewer',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id),
    CONSTRAINT fk_members_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_members_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- PLACED ITEMS TABLE (Depends on projects and assets)
CREATE TABLE placed_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Added default generator
    project_id UUID NOT NULL,
    asset_id UUID NOT NULL,
    x DOUBLE PRECISION NOT NULL,
    y DOUBLE PRECISION NOT NULL,
    width DOUBLE PRECISION NOT NULL,
    height DOUBLE PRECISION NOT NULL,
    rotation DOUBLE PRECISION DEFAULT 0,
    z_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_items_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_project_items_asset
        FOREIGN KEY (asset_id)
        REFERENCES assets(id)
        ON DELETE CASCADE
);