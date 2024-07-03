"use server";

import connection from "@/app/lib/db";
import { revalidatePath, unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import bcrypt from "bcrypt";
import { z } from "zod";

const IMAGES_PER_PAGE = 18;
export async function retrieveImages(name, type, times, currentPage) {
  const offset = currentPage * IMAGES_PER_PAGE;

  const { query, values } = handleRetrievePages(
    "media",
    name,
    type,
    times,
    offset,
    IMAGES_PER_PAGE
  );
  try {
    const results = await queryAsync(query, values);
    return JSON.stringify(results);
  } catch (error) {
    console.error("Error fetching user:", error);
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
    console.error("Error fetching user:", error);
    return null;
  }
}
const ITEMS_PER_PAGES = 10;
export async function retrieveAll(unique_name, name, type, times, currentPage) {
  const offset = currentPage * ITEMS_PER_PAGES;

  const { query, values } = handleRetrievePages(
    unique_name,
    name,
    type,
    times,
    offset,
    ITEMS_PER_PAGES
  );
  try {
    const results = await queryAsync(query, values);
    return JSON.stringify(results);
  } catch (error) {
    console.error("Error fetching user:", error);
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
    console.error("Error fetching user:", error);
    return null;
  }
}

function handleRetrievePages(db_name, name, type, times, offset, pages) {
  if (
    type == "" ||
    type == "All Media Items" ||
    (type.length == 0 && times.length == 0 && name.length == 0)
  ) {
    const query = `SELECT * FROM ${db_name} WHERE name LIKE '%${name}%' ORDER BY created_on ${
      times.length != 0 ? (times == "Latest" ? "DESC" : "ASC") : "DESC"
    } LIMIT ${pages} OFFSET ${offset}`;
    const values = [];

    return { query, values };
  } else {
    const query = `SELECT * FROM ${db_name} WHERE type = ? AND name LIKE '%${name}%' ORDER BY created_on ${
      times.length != 0 ? (times == "Latest" ? "DESC" : "ASC") : "DESC"
    } LIMIT ${pages} OFFSET ${offset}`;
    const values = [type];

    return { query, values };
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
    const results = await queryAsync(query);
    return JSON.stringify(results);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function uploadImage(uniquename, name, type) {
  const query =
    "INSERT INTO media (uniquefilename, name , type) VALUES (?, ? , ?)";
  try {
    await queryAsync(query, [uniquename, name, type]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  revalidatePath("/media");
}

export async function deleteImages(data) {
  const query = `DELETE FROM media WHERE uniquefilename IN (?)`;
  try {
    await queryAsync(query, [data]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  revalidatePath("/media");
}

export async function deleteCategoryData(data, unique_name) {
  const query = `DELETE FROM ${unique_name} WHERE id IN (?)`;
  try {
    await queryAsync(query, [data]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  revalidatePath(`/${unique_name}/category`);
}

export async function deletePages(data, unique_name) {
  const query = `DELETE FROM ${unique_name} WHERE id IN (?)`;
  try {
    await queryAsync(query, [data]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  revalidatePath(`/${unique_name}/list-of-${unique_name}`);
}

export async function mutateStatus(data, value, unique_name) {
  const query = `UPDATE ${unique_name} SET status = ? WHERE id IN (?)`;
  try {
    await queryAsync(query, [value, data]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  revalidatePath(`/${unique_name}/list-of-${unique_name}`);
}

export async function getUser(email) {
  const query = "SELECT * FROM users WHERE email = ?";
  try {
    const results = await queryAsync(query, [email]);
    return results[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getOTPUser(email) {
  const query = "SELECT * FROM otp WHERE email = ?";
  try {
    const results = await queryAsync(query, [email]);
    return results[0];
  } catch (error) {
    console.error("Error fetching user:", error);
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
});

export async function storeData(
  data,
  allfields,
  name,
  categoryvalue,
  statusvalue,
  featuredImage,
  id,
  unique_name
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
      unique_name
    );
    return;
  }
  const res = await auth();
  const author = res.user.first_name;

  const query = `INSERT INTO ${unique_name} (name, content, all_fields, type, status, featured_image, author) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  try {
    results = await queryAsync(query, [
      name,
      data,
      allfields,
      categoryvalue,
      statusvalue,
      featuredImage,
      author,
    ]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
  revalidatePath(`/${unique_name}/list-of-articles`);
  redirect(
    `/dashboard/${unique_name}/${results.insertId}/edit?id=${results.insertId}`,
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
  unique_name
) {
  const query = `UPDATE ${unique_name} SET name = ? , content=  ? , all_fields = ?, type = ?, status = ?, featured_image = ?   WHERE id = ?`;
  try {
    await queryAsync(query, [
      name,
      data,
      allfields,
      categoryvalue,
      statusvalue,
      featuredImage,
      id,
    ]);
  } catch (error) {
    console.error("Error fetching user:", error);
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
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getPageById(id, unique_name) {
  const query = `SELECT * FROM ${unique_name} WHERE id = ?`;
  try {
    const results = await queryAsync(query, [id]);
    return results;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getAllCategories(unique_name) {
  const query = `SELECT id, name FROM ${unique_name}`;
  try {
    const results = await queryAsync(query);
    return results;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function retrieveCategories(unique_name) {
  const query = `SELECT DISTINCT type FROM ${unique_name}`;
  try {
    const results = await queryAsync(query);
    return JSON.stringify(results);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function retrieveUserRoles(userID) {
  const query = "SELECT role, first_name, last_name FROM users WHERE id = ?";
  try {
    const results = await queryAsync(query, [userID]);
    return JSON.stringify(results[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function fetchCurrentVersion() {
  const query = "SELECT current_version FROM version_control";
  try {
    const results = await queryAsync(query);
    return JSON.stringify(results[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function updateVersion(prev, current) {
  const query = `UPDATE version_control SET previous_version = '${prev}', current_version = '${current}'`;
  try {
    await queryAsync(query);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function isUpdated(num) {
  const query = `UPDATE version_control SET is_updated = '${num}'`;
  try {
    await queryAsync(query);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function fetchIsUpdated() {
  const query = "SELECT is_updated FROM version_control";
  try {
    const results = await queryAsync(query);
    return JSON.stringify(results[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function retrieveSingleImageDetails(id) {
  const query = "SELECT * FROM media WHERE id = ?";
  try {
    const results = await queryAsync(query, [id]);
    return JSON.stringify(results[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
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
  const author = res.user.first_name;

  const query = `INSERT INTO activities (title, type, author) VALUES (?, ?, ?)`;
  try {
    await queryAsync(query, [title, refinedType, author]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  revalidatePath("/dashboard");
}

export async function fetchAllActivities() {
  const query = "SELECT * FROM activities ORDER BY created_on DESC LIMIT 5;";
  try {
    const results = await queryAsync(query);
    return JSON.stringify(results);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function fetchArticleCount() {
  unstable_noStore();

  const query = "SELECT COUNT(*) as count FROM articles";
  try {
    const results = await queryAsync(query);
    return JSON.stringify(results[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function fetchPagesCount() {
  unstable_noStore();

  const query = "SELECT COUNT(*) as count FROM pages";
  try {
    const results = await queryAsync(query);
    return JSON.stringify(results[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function fetchCaseStudiesCount() {
  unstable_noStore();
  const query = "SELECT COUNT(*) as count FROM case_studies";
  try {
    const results = await queryAsync(query);
    return JSON.stringify(results[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function updatePassword(password, userID) {
  const query = `UPDATE users SET password = '${password}' WHERE id = ${userID}`;
  try {
    await queryAsync(query);
    return { success: true };
  } catch (error) {
    console.error("Error fetching user:", error);
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
      console.error("Error fetching user:", error);
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
    console.error("Error fetching user:", error);
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

    return JSON.stringify(results);
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
    const existingColumns = await queryAsync(columnsQuery, [
      connection.config.database,
    ]);

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

    revalidatePath("/dashboard/forms");
    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false };
  }
}

export async function fetchAllForms() {
  try {
    const query = "SELECT id, form_name FROM forms";

    const results = await queryAsync(query, []);
    return JSON.stringify(results);
  } catch (e) {
    console.log(e);
    return { success: false };
  }
}

export async function fetchFormData(id) {
  console.log(id);
  try {
    const query = `SELECT * FROM forms t1 JOIN form_data t2 ON t1.id = t2.id WHERE t1.id = ?`;

    const results = await queryAsync(query, [id]);
    return JSON.stringify(results);
  } catch (e) {
    console.log(e);
    return { success: false };
  }
}

export async function queryAsync(sqlQuery, values = "") {
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}
