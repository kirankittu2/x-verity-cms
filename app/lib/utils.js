import { unstable_noStore as noStore } from "next/cache";
import {
  deleteForms,
  fetchCurrentVersion,
  mutateRole,
  mutateStatus,
} from "./data";
import { deleteCategoryData, deletePages, deleteImages } from "@/app/lib/data";

export function generatePagination(currentPage, totalPages) {
  const page = currentPage + 1;
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (page > 5 && page < totalPages - 2) {
    return [page - 4, page - 3, page - 2, page - 1, page, "---", totalPages];
  }

  if (page > 5 && page >= totalPages - 2) {
    return [
      totalPages - 6,
      totalPages - 5,
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [1, 2, 3, 4, 5, "---", totalPages];
}

export async function newVersionCheck() {
  const response = await fetch("https://cms.x-verity.com/version", {
    method: "GET",
    cache: "no-store",
  });
  const version = await response.text();
  return version;
}

export async function versionCheck() {
  noStore();
  const version = await fetchCurrentVersion();
  const currentVersion = JSON.parse(version)[0].current_version;
  const data = await newVersionCheck();
  if (data !== currentVersion) {
    return true;
  } else {
    return false;
  }
}

export async function dateConversion(originalTimestamp) {
  const dateObject = new Date(originalTimestamp);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formattedDate = dateObject.toLocaleDateString("en-US", options);
  return formattedDate.toString();
}

export async function mutateDBData(name, value, mutateData, unique_name) {
  if (name == "media") {
    if (value == "Delete") {
      const response = await fetch(
        "https://backend.qcentrio.com/files/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filenames: mutateData }),
        }
      );

      const data = await response.json();
      if (data.status == true) {
        await deleteImages(mutateData);
      }
    }
  }

  if (name == "category") {
    if (value == "Delete") {
      deleteCategoryData(mutateData, unique_name);
    }
  }

  if (name == "page") {
    if (value == "Delete") {
      deletePages(mutateData, unique_name);
    }

    if (value == "Draft") {
      mutateStatus(mutateData, value, unique_name);
    }

    if (value == "Publish") {
      value = "Published";
      mutateStatus(mutateData, value, unique_name);
    }
  }

  if (name == "users") {
    if (value == "Delete") {
      deletePages(mutateData, unique_name);
    }

    if (value == "Admin") {
      mutateRole(mutateData, value, unique_name);
    }

    if (value == "Employee") {
      mutateRole(mutateData, value, unique_name);
    }
  }

  if (name == "forms") {
    if (value == "Delete") {
      deleteForms(mutateData);
    }
  }
}

export async function operations(id, operation, table_name) {
  if (operation == "Delete") {
    deletePages(id, table_name);
  }

  if (operation == "Draft") {
    mutateStatus(id, operation, table_name);
  }

  if (operation == "Publish") {
    mutateStatus(id, "Published", table_name);
  }

  if (operation == "Admin") {
    mutateRole(id, operation, table_name);
  }

  if (operation == "Employee") {
    mutateRole(id, operation, table_name);
  }
}
export async function formOperations(id, operation) {
  if (operation == "Delete") {
    deleteForms(id);
  }
}

export function generateRandomNumber() {
  const randomNumber =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  return randomNumber;
}
