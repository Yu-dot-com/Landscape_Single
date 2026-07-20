import { pool } from "../config/db";

export const getCategory = async () => {
  const result = await pool.query(
    ` 
    SELECT 
    c.id AS category_id,
    c.name AS category_name,
    COALESCE(
        json_agg(
            json_build_object(
                'id', s.id,
                'name', s.name
            )
        ) FILTER (WHERE s.id IS NOT NULL), 
        '[]'::json
        ) AS subcategories
    FROM asset_categories c
    LEFT JOIN asset_subcategories s ON c.id = s.category_id
    GROUP BY c.id, c.name
    ORDER BY c.name ASC;`,
  );
  return result.rows;
};

export const addAsset = async (data: any) => {
  const result = await pool.query(
    `
    INSERT INTO assets(category_id,subcategory_id,name,image_path,width,height,min_width,max_width,min_height,max_height)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *
    `,
    [
      data.category_id,
      data.subcategory_id,
      data.name,
      data.image_path,
      data.width,
      data.height,
      data.min_width,
      data.max_width,
      data.max_height,
      data.max_height,
    ],
  );
  return result.rows;
};

export const getAsset = async () => {
  const result = await pool.query(
    `
    SELECT 
    a.id AS id,
    a.name AS name,
    c.name AS category,
    s.name AS "subCategory",
    a.image_path AS "imagePath",
    a.width AS width,
    a.height AS height,
    a.min_width AS "minWidth",
    a.max_width AS "maxWidth",
    a.min_height AS "minHeight",
    a.max_height AS "maxHeight",
    a.default_points AS "defaultPoints" -- This will return null as requested
    FROM assets a
    INNER JOIN asset_categories c ON a.category_id = c.id
    LEFT JOIN asset_subcategories s ON a.subcategory_id = s.id
    `,
  );
  return result.rows;
};


