import { pool } from "../config/db";

export const addMember = async (
  project_id: string,
  email: string,
  role: string,
) => {
  console.log(project_id);
  const result = await pool.query(
    `
        INSERT INTO project_members (project_id,user_id,role)
        VALUES ($1,$2,$3)
        RETURNING *
        `,
    [project_id, email, role],
  );
  return result.rows[0];
};

export const getMemberById = async (project_id: string, user_id: string) => {
  const result = await pool.query(
    `
        SELECT user_id from project_members 
        WHERE project_id = $1 AND user_id = $2
        `,
    [project_id, user_id],
  );
  return result.rows[0];
};

export const getProjectMembers = async (projectId: string) => {
  const result = await pool.query(
    `
    SELECT 
      users.id,
      users.username,
      users.email,
      project_members.role
    FROM users
    INNER JOIN project_members
      ON users.id = project_members.user_id
    WHERE project_members.project_id = $1
    `,
    [projectId],
  );
  return result.rows;
};

export const getProjectRole = async (projectId: string, userId: string) => {
  const result = await pool.query(
    `
    SELECT
      pm.role,
      p.owner_id
    FROM projects p
    LEFT JOIN project_members pm
      ON pm.project_id = p.id
      AND pm.user_id = $2
    WHERE p.id = $1
    `,
    [projectId, userId],
  );

  return result.rows[0];
};

export const deleteProjectMember = async (
  project_id: string,
  user_id: string,
) => {
  const result = await pool.query(
    `
        DELETE FROM project_members
      WHERE project_id = $1 
      AND user_id = $2
      RETURNING *
        `,
    [project_id, user_id],
  );
  return result;
};

export const updateMemberRole = async (
  project_id: string,
  user_id: string,
  role: string,
) => {
  const result = await pool.query(
    `
      UPDATE project_members
      SET role = $1,update_at=CURRENT_TIMESTAMP
      WHERE project_id = $2 AND user_id=$3
      RETURNING *
      `,
    [role, project_id, user_id],
  );
  return result.rows[0];
};
