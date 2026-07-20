CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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