import { pool } from "../config/db";

export const updateProjectThumbnail = async (
  projectId: string,
  thumbnailUrl: string
) => {
  const result = await pool.query(
    `
    UPDATE projects
    SET thumbnail_url = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
    `,
    [thumbnailUrl, projectId]
  );

  return result.rows[0];
};
export const getProjectNameById=async( projectId:string)=>{
  const result =await pool.query(
    `SELECT name FROM projects WHERE id=$1`,[projectId]
  );
  return result.rows[0];
}
export const createProject = async (
  client: any,
  owner_id: string,
  name: string,
  description: string,
) => {
  const result = await client.query(
    `INSERT INTO projects
        (owner_id,name,description)
        VALUES ($1,$2,$3)
        RETURNING *
        `,
    [owner_id, name, description],
  );
  return result.rows[0];
};

export const addMembers = async (
  client: any,
  project_id: string,
  owner_id: string,
  role: string,
) => {
  const result = await client.query(
    `
        INSERT INTO project_members
        (project_id,user_id,role)
        VALUES ($1,$2,$3)
        RETURNING *
    `,
    [project_id, owner_id, role],
  );
  return result.rows[0];
};

//allProject
export const getUserProjects = async (user_id: string) => {
  const result = await pool.query(
    `
    SELECT
      p.id,
      p.owner_id,
      p.name,
      p.description,
      p.thumbnail_url,
      p.created_at,
      p.updated_at,

      CASE
        WHEN p.owner_id = $1 THEN 'owner'
        ELSE pm.role::text
      END AS my_role,

      (
        SELECT COALESCE(
          json_agg(
            jsonb_build_object(
              'id', collaborators.id,
              'username', collaborators.username
            )
            ORDER BY collaborators.username
          ),
          '[]'::json
        )
        FROM (
          -- Project owner
          SELECT
            u.id,
            u.username
          FROM users u
          WHERE u.id = p.owner_id

          UNION

          -- Project members
          SELECT
            u.id,
            u.username
          FROM project_members pm2
          JOIN users u
            ON u.id = pm2.user_id
          WHERE pm2.project_id = p.id
        ) collaborators
      ) AS collaborators

    FROM projects p

    -- Only get current user's membership
    LEFT JOIN project_members pm
      ON pm.project_id = p.id
      AND pm.user_id = $1

    WHERE
      p.owner_id = $1
      OR pm.user_id = $1

    ORDER BY p.updated_at DESC

    LIMIT 3;
    `,
    [user_id],
  );
  return result.rows;
};

export const getOwnedProjects = async (user_id: string) => {
  const result = await pool.query(
    `
    SELECT
      p.id,
      p.name,
      p.description,
      p.thumbnail_url,
      p.created_at,
      p.updated_at,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', u.id,
            'username', u.username
          )
        ) FILTER (
          WHERE u.id IS NOT NULL
        ),
        '[]'
      ) AS collaborators

    FROM projects p

    LEFT JOIN project_members pm
      ON p.id = pm.project_id

    LEFT JOIN users u
      ON pm.user_id = u.id

    WHERE p.owner_id = $1

    GROUP BY
      p.id

    ORDER BY p.updated_at DESC
    `,
    [user_id],
  );
  return result.rows;
};

export const getSharedProjects = async (userId: string) => {
  const result = await pool.query(
    `
    SELECT
      p.id,
      p.name,
      p.description,
      p.thumbnail_url,
      p.created_at,
      p.updated_at,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', u.id,
            'username', u.username
          )
        ) FILTER (
          WHERE u.id IS NOT NULL
        ),
        '[]'
      ) AS collaborators

    FROM projects p

    INNER JOIN project_members pm
      ON p.id = pm.project_id

    LEFT JOIN users u
      ON pm.user_id = u.id

    WHERE p.owner_id != $1
      AND pm.user_id = $1

    GROUP BY p.id

    ORDER BY p.updated_at DESC
    `,
    [userId],
  );
  return result.rows;
};

export const deleteProject = async (
  client: any,
  project_id: string,
  user_id: string,
) => {
  const result = await client.query(
    `
        DELETE FROM projects
        WHERE id = $1 AND owner_id=$2
        `,
    [project_id, user_id],
  );
  return result.rows;
};

export const getOwnerId = async (project_id: string) => {
  const result = await pool.query(
    `
        SELECT owner_id from projects
        where id =$1
        `,
    [project_id],
  );
  return result.rows[0];
};

export const updateProjectName = async (project_id: string, name: string) => {
  const result = await pool.query(
    `
      UPDATE projects
      SET name=$1,updated_at = CURRENT_TIMESTAMP
      WHERE id=$2
      RETURNING *
      `,
    [name, project_id],
  );
  return result.rows[0];
};

export const getProjectCount = async (id: string) => {
  const result = await pool.query(
    `SELECT 
    COUNT(CASE WHEN p.owner_id = $1 THEN 1 END) AS own_projects,
    COUNT(CASE WHEN pm.user_id = $1 AND p.owner_id!=$1 THEN 1 END) AS shared_projects,
    COUNT(*) AS total_projects
    FROM projects p
    LEFT JOIN project_members pm
    ON p.id=pm.project_id
    AND pm.user_id=$1
    WHERE p.owner_id=$1
    OR pm.user_id=$1
    `,
    [id],
  );
  return result.rows[0];
};

export const getProjectItems = async (projectId: string) => {
  const result = await pool.query(
    `
    SELECT 
        pi.id,
        pi.project_id as "projectId",
        pi.asset_id as "templateId",
        pi.x,
        pi.y,
        pi.width,
        pi.height,
        pi.rotation,
        pi.z_index as "zindex",
        a.name,
        ac.name as "category",
        a.default_points as "points"
      FROM placed_items pi
      JOIN assets a ON pi.asset_id = a.id
      JOIN asset_categories ac ON a.category_id = ac.id
      WHERE pi.project_id = $1
      ORDER BY pi.z_index ASC;
    `,
    [projectId],
  );
  return result.rows;
};
