"use server";

import connection from "@/app/lib/db";
import { revalidatePath, unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

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

export async function deleteArticleCategory(data, unique_name) {
  const query = `DELETE FROM ${unique_name} WHERE id IN (?)`;
  try {
    await queryAsync(query, [data]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  revalidatePath("/articles/category");
}

export async function deleteArticles(data, unique_name) {
  const query = `DELETE FROM ${unique_name} WHERE id IN (?)`;
  try {
    await queryAsync(query, [data]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  revalidatePath("/articles/category");
}

export async function getUser(email) {
  const query = "SELECT * FROM registration WHERE email = ?";
  try {
    const results = await queryAsync(query, [email]);
    return results[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
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

export async function storeArticle(
  cmsdata,
  data,
  allfields,
  name,
  categoryvalue,
  statusvalue,
  id,
  unique_name
) {
  let results = {};
  if (id !== "") {
    updateArticle(
      name,
      cmsdata,
      data,
      allfields,
      categoryvalue,
      statusvalue,
      id,
      unique_name
    );
    return;
  }

  const query = `INSERT INTO ${unique_name} (name, cms_content, content, all_fields, type, status) VALUES (?, ?, ?, ?, ?, ?)`;
  try {
    results = await queryAsync(query, [
      name,
      cmsdata,
      data,
      allfields,
      categoryvalue,
      statusvalue,
    ]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
  revalidatePath(`/${unique_name}/list-of-articles`);
  redirect(`/dashboard/${unique_name}/${results.insertId}/edit`, "push");
}

export async function updateArticle(
  name,
  cmsdata,
  data,
  allfields,
  categoryvalue,
  statusvalue,
  id,
  unique_name
) {
  const query = `UPDATE ${unique_name} SET name = ? ,cms_content = ? , content=  ? , all_fields = ?, type = ?, status = ?   WHERE id = ?`;
  try {
    await queryAsync(query, [
      name,
      cmsdata,
      data,
      allfields,
      categoryvalue,
      statusvalue,
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
  const query = "SELECT role FROM registration WHERE id = ?";
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
  console.log(num);
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
  const query = `INSERT INTO activities (title, type) VALUES (?, ?)`;
  try {
    await queryAsync(query, [title, refinedType]);
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
  const query = `UPDATE registration SET password = '${password}' WHERE id = ${userID}`;
  try {
    await queryAsync(query);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
