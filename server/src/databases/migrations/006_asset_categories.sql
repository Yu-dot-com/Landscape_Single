CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE asset_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL UNIQUE
);