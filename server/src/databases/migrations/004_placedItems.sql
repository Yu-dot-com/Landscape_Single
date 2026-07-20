CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE placedItems (
    id UUID PRIMARY KEY gen_random_uuid(),

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