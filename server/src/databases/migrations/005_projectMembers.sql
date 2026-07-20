CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE project_role AS ENUM ('viewer', 'editor', 'admin');

CREATE TABLE project_members (
    project_id UUID NOT NULL gen_random_uuid(),
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