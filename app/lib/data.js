"use server";

import pool from "@/app/lib/db";
import { revalidatePath, unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import bcrypt from "bcrypt";
import { z } from "zod";

const IMAGES_PER_PAGE = 18;
const ITEMS_PER_PAGES = 10;

export async function retrieveImages(name, type, currentPage) {
  const offset = currentPage * IMAGES_PER_PAGE;

  let query1 = `SELECT * FROM media WHERE 1=1`;
  let query2 = `SELECT * FROM media WHERE 1=1`;
  const params1 = [];
  const params2 = [];

  if (name !== null && name !== undefined) {
    query1 += ` AND name LIKE ?`;
    query2 += ` AND name LIKE ?`;
    params1.push(`%${name}%`);
    params2.push(`%${name}%`);
  }

  if (
    type !== null &&
    type !== undefined &&
    type !== "" &&
    type !== "All Media Items"
  ) {
    query1 += ` AND type = ?`;
    query2 += ` AND type = ?`;
    params1.push(type);
    params2.push(type);
  }

  query1 += ` LIMIT ?`;
  params1.push(IMAGES_PER_PAGE.toString());

  if (offset !== null && offset !== undefined) {
    query1 += ` OFFSET ?`;
    params1.push(offset.toString());
  }

  try {
    const results1 = await queryAsync(query1, params1);
    const results2 = await queryAsync(query2, params2);
    const parsedResults = JSON.parse(results2);
    const totalPages = Math.ceil(
      Number(parsedResults.length) / IMAGES_PER_PAGE
    );

    return [results1, totalPages];
  } catch (error) {
    console.error("Error retriving images:", error);
    return null;
  }
}

export async function fetchFilePages(name, type, times) {
  const { query, values } = handleFetchNumberofPages(
    "media",
    name,
    type,
    times
  );
  try {
    const results = await queryAsync(query, values);
    const totalPages = Math.ceil(Number(results.length) / IMAGES_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Error fetching pages:", error);
    return null;
  }
}

export async function retrieveAll(
  unique_name,
  name,
  type,
  status,
  currentPage
) {
  const offset = currentPage * ITEMS_PER_PAGES;

  let query1 = `SELECT * FROM ${unique_name} WHERE 1=1`;
  let query2 = `SELECT * FROM ${unique_name} WHERE 1=1`;
  const params1 = [];
  const params2 = [];

  if (name !== null && name !== undefined) {
    query1 += ` AND name LIKE ?`;
    query2 += ` AND name LIKE ?`;
    params1.push(`%${name}%`);
    params2.push(`%${name}%`);
  }

  if (
    type !== null &&
    type !== undefined &&
    type !== "" &&
    type !== "All Media Items"
  ) {
    query1 += ` AND type = ?`;
    query2 += ` AND type = ?`;
    params1.push(type);
    params2.push(type);
  }

  if (status !== null && status !== undefined && status !== "") {
    query1 += ` AND status = ?`;
    query2 += ` AND status = ?`;
    const refinedStatus = status == "Draft" ? "Draft" : "Published";
    params1.push(refinedStatus);
    params2.push(refinedStatus);
  }

  query1 += ` LIMIT ?`;
  params1.push(ITEMS_PER_PAGES.toString());

  if (offset !== null && offset !== undefined) {
    query1 += ` OFFSET ?`;
    params1.push(offset.toString());
  }

  try {
    const results1 = await queryAsync(query1, params1);
    const results2 = await queryAsync(query2, params2);
    const parsedResults = JSON.parse(results2);
    const totalPages = Math.ceil(
      Number(parsedResults.length) / ITEMS_PER_PAGES
    );

    return JSON.stringify([results1, totalPages]);
  } catch (error) {
    console.error("Error retriving all:", error);
    return null;
  }
}

export async function fetchPageNumber(unique_name, name, type, times) {
  const { query, values } = handleFetchNumberofPages(
    unique_name,
    name,
    type,
    times
  );

  try {
    const results = await queryAsync(query, values);
    const totalPages = Math.ceil(Number(results.length) / ITEMS_PER_PAGES);
    return totalPages;
  } catch (error) {
    console.error("Error fetching page number:", error);
    return null;
  }
}

function handleFetchNumberofPages(db_name, name, type, times) {
  if (
    type == "" ||
    type == "All Media Items" ||
    (type.length == 0 && times.length == 0 && name.length == 0)
  ) {
    const query = `SELECT * FROM ${db_name} WHERE name LIKE '%${name}%' ORDER BY created_on ${
      times.length != 0 ? (times == "Latest" ? "DESC" : "ASC") : "DESC"
    }`;
    const values = [];

    return { query, values };
  } else {
    const query = `SELECT * FROM ${db_name} WHERE type = ? AND name LIKE '%${name}%' ORDER BY created_on ${
      times.length != 0 ? (times == "Latest" ? "DESC" : "ASC") : "DESC"
    }`;
    const values = [type];

    return { query, values };
  }
}

export async function retrieveImageTypes() {
  const query = "SELECT DISTINCT type FROM media";
  try {
    return await queryAsync(query);
  } catch (error) {
    console.error("Error fetching total number of pages:", error);
    return null;
  }
}

export async function uploadImage(uniquename, name, type) {
  const query =
    "INSERT INTO media (uniquefilename, name , type) VALUES (?, ? , ?)";
  try {
    await queryAsync(query, [uniquename, name, type]);
  } catch (error) {
    console.error("Error uploading images:", error);
    return null;
  }

  revalidatePath("/media");
}

export async function deleteImages(data) {
  const query = `DELETE FROM media WHERE uniquefilename IN (?)`;
  try {
    await queryAsync(query, [data]);
  } catch (error) {
    console.error("Error deleting images:", error);
    return null;
  }

  revalidatePath("/media");
}

export async function deleteCategoryData(data, unique_name) {
  const query = `DELETE FROM ${unique_name} WHERE id IN (?)`;
  try {
    await queryAsync(query, data);
  } catch (error) {
    console.error("Error deleting category data:", error);
    return null;
  }

  revalidatePath(`/${unique_name}/category`);
}

export async function deletePages(data, unique_name) {
  const filteredArray = data.filter((value) => value !== null);
  const placeholders = filteredArray.map(() => "?").join(",");
  const query = `DELETE FROM ${unique_name} WHERE id IN (${placeholders})`;
  try {
    await queryAsync(query, filteredArray);
  } catch (error) {
    console.error("Error deleting pages:", error);
    return null;
  }
  revalidatePath(`/${unique_name}/list-of-${unique_name}`);
}

export async function mutateStatus(data, value, unique_name) {
  console.log("data");
  console.log(data);
  const filteredArray = data.filter((value) => value !== null);
  const placeholders = filteredArray.map(() => "?").join(",");
  const query = `UPDATE ${unique_name} SET status = ? WHERE id IN (${placeholders})`;
  try {
    await queryAsync(query, [value, filteredArray]);
  } catch (error) {
    console.error("Error mutating status:", error);
    return null;
  }

  revalidatePath(`/dashboard/${unique_name}/list-of-${unique_name}`);
}

export async function getUser(email) {
  const query = "SELECT * FROM users WHERE email = ?";
  try {
    const results = await queryAsync(query, [email]);
    const parsedResults = JSON.parse(results);
    return parsedResults[0];
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export async function getOTPUser(email) {
  const query = "SELECT * FROM otp WHERE email = ?";
  try {
    const results = await queryAsync(query, [email]);
    return results[0];
  } catch (error) {
    console.error("Error getting otp to user:", error);
    return null;
  }
}

const storeDataSchema = z.object({
  data: z.string(),
  allfields: z.string().optional(),
  name: z.string(),
  categoryvalue: z.string(),
  statusvalue: z.string(),
  featuredImage: z.string().url(),
  id: z.union([z.string(), z.number()]).optional(),
  unique_name: z.string(),
  slug: z.string(),
});

const storePageDataSchema = z.object({
  data: z.string(),
  allfields: z.string().optional(),
  name: z.string(),
  parentvalue: z.union([z.string(), z.literal("")]),
  statusvalue: z.string(),
  featuredImage: z.string().url(),
  id: z.union([z.string(), z.number()]).optional(),
  unique_name: z.string(),
  slug: z.string(),
});

export async function storeData(
  data,
  allfields,
  name,
  categoryvalue,
  statusvalue,
  featuredImage,
  id,
  unique_name,
  slug
) {
  let results = {};

  const validationResult = storeDataSchema.safeParse({
    data,
    allfields,
    name,
    categoryvalue,
    statusvalue,
    featuredImage,
    id,
    unique_name,
    slug,
  });

  if (!validationResult.success) {
    console.error("Validation error:", validationResult.error);
    return null;
  }
  if (id !== "") {
    updateData(
      name,
      data,
      allfields,
      categoryvalue,
      statusvalue,
      featuredImage,
      id,
      unique_name,
      slug
    );
    return;
  }
  const res = await auth();
  const author = res.user.first_name;

  const query = `INSERT INTO ${unique_name} (name, content, all_fields, type, status, featured_image, author, slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  try {
    results = await queryAsync(query, [
      name,
      data,
      allfields,
      categoryvalue,
      statusvalue,
      featuredImage,
      author,
      slug,
    ]);
  } catch (error) {
    console.error("Error storing data:", error);
    return null;
  }
  const parsedResults = JSON.parse(results);

  revalidatePath(`/${unique_name}/list-of-articles`);
  redirect(
    `/dashboard/${unique_name}/${parsedResults.insertId}/edit?id=${parsedResults.insertId}`,
    "push"
  );
}

export async function storePageData(
  data,
  allfields,
  name,
  parentvalue = "",
  statusvalue,
  featuredImage,
  id,
  unique_name,
  slug
) {
  let results = {};

  const validationResult = storePageDataSchema.safeParse({
    data,
    allfields,
    name,
    parentvalue,
    statusvalue,
    featuredImage,
    id,
    unique_name,
    slug,
  });

  if (!validationResult.success) {
    console.error("Validation error:", validationResult.error);
    return null;
  }
  if (id !== "") {
    updatePageData(
      name,
      data,
      allfields,
      parentvalue,
      statusvalue,
      featuredImage,
      id,
      unique_name,
      slug
    );
    return;
  }
  const res = await auth();
  const author = res.user.first_name;

  const query = `INSERT INTO ${unique_name} (name, content, all_fields, parent, status, featured_image, author, slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  try {
    results = await queryAsync(query, [
      name,
      data,
      allfields,
      parentvalue,
      statusvalue,
      featuredImage,
      author,
      slug,
    ]);
  } catch (error) {
    console.error("Error storing page data:", error);
    return null;
  }
  const parsedResults = JSON.parse(results);
  revalidatePath(`/${unique_name}/list-of-articles`);
  redirect(
    `/dashboard/${unique_name}/${parsedResults.insertId}/edit?id=${parsedResults.insertId}`,
    "push"
  );
}

export async function updateData(
  name,
  data,
  allfields,
  categoryvalue,
  statusvalue,
  featuredImage,
  id,
  unique_name,
  slug
) {
  const query = `UPDATE ${unique_name} SET name = ? , content=  ? , all_fields = ?, type = ?, status = ?, featured_image = ?, slug = ?  WHERE id = ?`;
  try {
    await queryAsync(query, [
      name,
      data,
      allfields,
      categoryvalue,
      statusvalue,
      featuredImage,
      slug,
      id,
    ]);
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }

  revalidatePath(`/${unique_name}/list-of-articles`);
}

export async function updatePageData(
  name,
  data,
  allfields,
  parentvalue,
  statusvalue,
  featuredImage,
  id,
  unique_name,
  slug
) {
  const query = `UPDATE ${unique_name} SET name = ? , content=  ? , all_fields = ?, parent = ?, status = ?, featured_image = ?, slug = ?  WHERE id = ?`;
  try {
    await queryAsync(query, [
      name,
      data,
      allfields,
      parentvalue,
      statusvalue,
      featuredImage,
      slug,
      id,
    ]);
  } catch (error) {
    console.error("Error updating page data:", error);
    return null;
  }

  revalidatePath(`/${unique_name}/list-of-articles`);
}

export async function getArticles() {
  const query = "SELECT * FROM articles";
  try {
    const results = await queryAsync(query);
    return results;
  } catch (error) {
    console.error("Error getting articles:", error);
    return null;
  }
}

export async function getPageById(id, unique_name) {
  const query = `SELECT * FROM ${unique_name} WHERE id = ?`;
  try {
    return await queryAsync(query, [id]);
  } catch (error) {
    console.error("Error getting page by id:", error);
    return null;
  }
}

export async function getAllCategories(unique_name, currentPage) {
  const offset = currentPage * ITEMS_PER_PAGES;
  const query1 = `SELECT id, name FROM ${unique_name} LIMIT ? OFFSET ?`;
  const query2 = `SELECT id, name FROM ${unique_name}`;

  try {
    const results1 = await queryAsync(query1, [
      ITEMS_PER_PAGES.toString(),
      offset.toString(),
    ]);
    const results2 = await queryAsync(query2);
    const parsedResults = JSON.parse(results2);
    const totalPages = Math.ceil(
      Number(parsedResults.length) / ITEMS_PER_PAGES
    );
    return JSON.stringify([results1, totalPages]);
  } catch (error) {
    console.error("Error getting all categories:", error);
    return null;
  }
}

export async function getAllCategoriesWithoutOffset(unique_name) {
  const query = `SELECT id, name FROM ${unique_name}`;

  try {
    return await queryAsync(query);
  } catch (error) {
    console.error("Error getting all categories without offset:", error);
    return null;
  }
}

export async function retrieveCategories(unique_name) {
  const query = `SELECT DISTINCT type FROM ${unique_name}`;
  try {
    return await queryAsync(query);
  } catch (error) {
    console.error("Error retriving categories:", error);
    return null;
  }
}

export async function retrieveParents() {
  const query = `SELECT DISTINCT parent FROM pages`;
  try {
    return await queryAsync(query);
  } catch (error) {
    console.error("Error retriving categories:", error);
    return null;
  }
}

export async function retrieveUserRoles(userID) {
  const query = "SELECT role, first_name, last_name FROM users WHERE id = ?";
  try {
    return await queryAsync(query, [userID]);
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

export async function fetchCurrentVersion() {
  const query = "SELECT current_version FROM version_control";
  try {
    const results = await queryAsync(query);
    return JSON.stringify(results[0]);
  } catch (error) {
    console.error("Error fetching current version:", error);
    return null;
  }
}

export async function updateVersion(prev, current) {
  const query = `UPDATE version_control SET previous_version = '${prev}', current_version = '${current}'`;
  try {
    await queryAsync(query);
  } catch (error) {
    console.error("Error updating version:", error);
    return null;
  }
}

export async function isUpdated(num) {
  const query = `UPDATE version_control SET is_updated = '${num}'`;
  try {
    await queryAsync(query);
  } catch (error) {
    console.error("Error at isUpdated method:", error);
    return null;
  }
}

export async function fetchIsUpdated() {
  const query = "SELECT is_updated FROM version_control";
  try {
    const results = await queryAsync(query);
    return JSON.stringify(results[0]);
  } catch (error) {
    console.error("Error at fetchIsUpdated method:", error);
    return null;
  }
}

export async function retrieveSingleImageDetails(id) {
  const query = "SELECT * FROM media WHERE id = ?";
  try {
    return await queryAsync(query, [id]);
  } catch (error) {
    console.error("Error fetching single image details:", error);
    return null;
  }
}

export default async function storeActivity(title, type) {
  let refinedType;
  if (type == "articles") {
    refinedType = "Article";
  } else if (type == "pages") {
    refinedType = "Page";
  } else if (type == "case_studies") {
    refinedType = "Case Study";
  }
  const res = await auth();
  console.log(res);
  const author = res.user.first_name;

  const query = `INSERT INTO activities (title, type, author) VALUES (?, ?, ?)`;
  try {
    await queryAsync(query, [title, refinedType, author]);
  } catch (error) {
    console.error("Error storing activity:", error);
    return null;
  }

  revalidatePath("/dashboard");
}

export async function fetchAllActivities() {
  const query = "SELECT * FROM activities ORDER BY created_on DESC LIMIT 5;";
  try {
    return await queryAsync(query);
  } catch (error) {
    console.error("Error fetching all activities:", error);
    return null;
  }
}

export async function fetchArticleCount() {
  unstable_noStore();

  const query = "SELECT COUNT(*) as count FROM articles";
  try {
    return await queryAsync(query);
  } catch (error) {
    console.error("Error fetching article count:", error);
    return null;
  }
}

export async function fetchPagesCount() {
  unstable_noStore();

  const query = "SELECT COUNT(*) as count FROM pages";
  try {
    return await queryAsync(query);
  } catch (error) {
    console.error("Error fetching pages count:", error);
    return null;
  }
}

export async function fetchCaseStudiesCount() {
  unstable_noStore();
  const query = "SELECT COUNT(*) as count FROM case_studies";
  try {
    return await queryAsync(query);
  } catch (error) {
    console.error("Error fetching case study count:", error);
    return null;
  }
}

export async function updatePassword(password, userID) {
  const query = `UPDATE users SET password = '${password}' WHERE id = ${userID}`;
  try {
    await queryAsync(query);
    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    return null;
  }
}

export async function storeOTP(otp, email) {
  const user = await getOTPUser(email);
  if (!user) {
    const query = "INSERT INTO otp (otp, email) VALUES (?, ?)";
    try {
      await queryAsync(query, [otp, email]);
      return { success: true };
    } catch (error) {
      console.error("Error fetching user:", error);
      return { success: false };
    }
  } else if (user) {
    const query = `UPDATE otp SET otp = '${otp}' WHERE email = '${email}'`;
    try {
      await queryAsync(query);
      return { success: true };
    } catch (error) {
      console.error("Error storing otp:", error);
      return { success: false };
    }
  }
}

export async function getOTP(email) {
  const query = "SELECT * FROM otp WHERE email = ?;";
  try {
    const results = await queryAsync(query, [email]);
    return JSON.stringify(results);
  } catch (error) {
    console.error("Error getting otp:", error);
    return null;
  }
}

export async function operations(id, operation, table_name) {
  if (operation == "Delete") {
    deletePages([id], table_name);
  } else if (operation == "Draft") {
    mutateStatus(id, operation, table_name);
  } else if (operation == "Publish") {
    mutateStatus(id, "Published", table_name);
  }
}

export async function insertUser(data) {
  const { firstName, lastName, email, password, role } = data;
  try {
    const query =
      "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)";
    const hashedPassword = await bcrypt.hash(password, 10);

    await queryAsync(query, [firstName, lastName, email, hashedPassword, role]);
  } catch (e) {
    console.log(e);
  }
}

export async function fetchAllUsers() {
  try {
    const query = "SELECT * FROM users";
    const results = await queryAsync(query, []);

    return results;
  } catch (e) {
    console.log(e);
  }
}

async function createColumnsIfNeeded(fields) {
  try {
    const columnsQuery = `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'form_data'
    `;

    const existingColumns = JSON.parse(
      await queryAsync(columnsQuery, ["qcadmin_xv_cms"])
    );

    const alterTableQueries = [];

    fields.forEach((field) => {
      const columnName = field.toLowerCase().replace(/\s+/g, "_");
      if (!existingColumns.some((col) => col.COLUMN_NAME === columnName)) {
        alterTableQueries.push(
          `ALTER TABLE form_data ADD COLUMN \`${columnName}\` TEXT`
        );
      }
    });

    if (alterTableQueries.length > 0) {
      await Promise.all(
        alterTableQueries.map((query) => queryAsync(query, []))
      );
    }
  } catch (error) {
    console.error("Error creating columns:", error);
    throw error;
  }
}

export async function storeFormData(formName, fields) {
  try {
    const query = "INSERT INTO forms (form_name, fields) VALUES (?, ?)";
    const values = [formName, JSON.stringify(fields)];

    await queryAsync(query, values);
    await createColumnsIfNeeded(fields);
  } catch (e) {
    console.error("Error storing form data:", e);
    return { success: false };
  }

  revalidatePath("/dashboard/forms");
  return { success: true };
}

export async function fetchAllForms() {
  try {
    const query = "SELECT id, form_name FROM forms";
    return await queryAsync(query, []);
  } catch (e) {
    console.error("Error fetching all forms:", e);
    return { success: false };
  }
}

export async function fetchFormData(id) {
  try {
    const query = `SELECT * FROM forms t1 JOIN form_data t2 ON t1.id = t2.id WHERE t1.id = ?`;
    const results = await queryAsync(query, [id]);
    return results;
  } catch (e) {
    console.error("Error fetching form data:", e);
    return { success: false };
  }
}

export async function fetchTablesColumns(id) {
  try {
    const query = `SELECT * FROM forms WHERE id = ?`;
    const results = await queryAsync(query, [id]);
    return results;
  } catch (e) {
    console.error("Error fetching table columns:", e);
    return { success: false };
  }
}

export async function updateTablesColumns(formName, fields, id) {
  try {
    const query = `UPDATE forms SET form_name = ?, fields = ? WHERE id = ?;`;
    const values = [formName, JSON.stringify(fields), id];

    await queryAsync(query, values);
    await createColumnsIfNeeded(fields);
    return { success: true };
  } catch (e) {
    console.error("Error updating table columns:", e);
    return { success: false };
  }
}

export async function queryAsync(query, values = []) {
  console.log(query);
  console.log(values);
  let connection;
  try {
    connection = await pool.getConnection();
    const results = await connection.execute(query, values);
    return JSON.stringify(results[0]);
  } catch (error) {
    console.error("Error executing query:", error);
    if (
      error.code === "PROTOCOL_CONNECTION_LOST" ||
      error.code === "ECONNRESET" ||
      error.code === "ETIMEDOUT"
    ) {
      return queryAsync(query, values);
    }
    throw error;
  } finally {
    if (connection) connection.release();
  }
}
