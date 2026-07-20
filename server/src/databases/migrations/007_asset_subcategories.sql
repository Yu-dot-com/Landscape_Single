CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE asset_subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category_id UUID NOT NULL,

    name VARCHAR(100) NOT NULL,

    CONSTRAINT fk_subcategory_category
        FOREIGN KEY (category_id)
        REFERENCES asset_categories(id)
        ON DELETE CASCADE
);