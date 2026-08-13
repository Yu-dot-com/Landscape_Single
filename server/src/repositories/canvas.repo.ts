import { pool } from "../config/db";

export const saveCanvas = async (projectId: string, placedItems: any[]) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
      DELETE FROM placed_items
      WHERE project_id=$1
      `,
      [projectId],
    );

    for (const item of placedItems) {
      await client.query(
        `INSERT INTO placed_items
(
  id,
  project_id,
  asset_id,
  x,
  y,
  width,
  height,
  rotation,
  z_index,
  color,
  points
)
VALUES
($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          item.id,
          projectId,
          item.asset_id,
          item.x,
          item.y,
          item.width,
          item.height,
          item.rotation ?? 0,
          item.z_index ?? 0,
          item.color ?? null,
          item.points ? JSON.stringify(item.points) : null,
        ],
      );
    }

    await client.query("COMMIT");

    return true;
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};

export const getCanvas = async (projectId: string) => {
  const result = await pool.query(
    `
    SELECT id, asset_id,x,y,width,height,rotation,z_index,color,points
    FROM placed_items
    WHERE project_id=$1
    `,
    [projectId],
  );
  return result.rows;
};
