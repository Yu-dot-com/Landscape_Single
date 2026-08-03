import { pool } from "../config/db";

export const createActivity = async (
  actorId: string,
  action: string,
  projectId?: string | null,
  metadata: Record<string, any> = {}
) => {
  const result = await pool.query(
    `
    INSERT INTO activities (actor_id, project_id, action, metadata)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [actorId, projectId ?? null, action, JSON.stringify(metadata)]
  );

  return result.rows[0];
};

export const getRecentActivities = async (userId: string, limit = 20) => {
  const result = await pool.query(
    `
    SELECT
      a.id,
      a.action,
      a.metadata,
      a.created_at,
      a.project_id,
      u.username AS actor_username,
      p.name AS project_name
    FROM activities a
    JOIN users u ON u.id = a.actor_id
    LEFT JOIN projects p ON p.id = a.project_id
    WHERE
      a.actor_id = $1
      OR a.project_id IN (
        SELECT project_id
        FROM project_members
        WHERE user_id = $1
      )
    ORDER BY a.created_at DESC
    LIMIT $2
    `,
    [userId, limit]
  );

  return result.rows;
};

export const getProjectActivities = async (
  projectId: string,
  limit = 20
) => {
  const result = await pool.query(
    `
    SELECT
      a.id,
      a.action,
      a.metadata,
      a.created_at,
      u.username AS actor_username
    FROM activities a
    JOIN users u ON u.id = a.actor_id
    WHERE a.project_id = $1
    ORDER BY a.created_at DESC
    LIMIT $2
    `,
    [projectId, limit]
  );

  return result.rows;
};