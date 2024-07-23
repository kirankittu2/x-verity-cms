"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import {
  getOTP,
  getUser,
  insertUser,
  isUpdated,
  queryAsync,
  storeOTP,
  updatePassword,
  updateVersion,
} from "./data";
import { revalidatePath, unstable_noStore } from "next/cache";
import { generateRandomNumber, newVersionCheck } from "./utils";
import { sendEmail, sendmail } from "./mail";
import { get, set } from "./session-store";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { exec } from "child_process";
import path from "path";
import { z } from "zod";

export async function authenticate(prevState, formData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid Email or Password",
          };
        default:
          return {
            message: "Invalid Email or Password",
          };
      }
    }
    throw error;
  }
}

const storeCategorySchema = z.object({
  name: z.string(),
});

export async function createCategory(formData) {
  const name = formData.get("category");
  const main = formData.get("main");
  const page = formData.get("page");

  const validationResult = storeCategorySchema.safeParse({
    name,
  });

  if (!validationResult.success) {
    console.error("Validation error:", validationResult.error);
    return null;
  }

  const query = `INSERT INTO ${main} (name) VALUES (?)`;

  try {
    await queryAsync(query, [name]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  revalidatePath(`/dashboard/${page}/category`);
}

export async function updateCMS(prevState, formData) {
  const repoPath = path.join(__dirname, "../../../");

  exec(`cd ${repoPath} && git pull origin dev`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error pulling updates: ${error.message}`);
      return {
        success: false,
      };
    }
    if (stderr) {
      console.error(`git pull stderr: ${stderr}`);
    }
    console.log(`git pull stdout: ${stdout}`);

    // Install new dependencies
    exec("npm install", { cwd: repoPath }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error installing dependencies: ${error.message}`);
        return {
          success: false,
        };
      }
      if (stderr) {
        console.error(`npm install stderr: ${stderr}`);
      }
      console.log(`npm install stdout: ${stdout}`);

      // Build the React app
      exec("npm run build", { cwd: repoPath }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error building the app: ${error.message}`);
          return {
            success: false,
          };
        }
        if (stderr) {
          console.error(`Build stderr: ${stderr}`);
        }
        console.log(`Build stdout: ${stdout}`);

        // Restart the server using PM2
        exec("pm2 restart x-verity-cms", (error, stdout, stderr) => {
          if (error) {
            console.error(`Error restarting server: ${error.message}`);
            return {
              success: false,
            };
          }
          if (stderr) {
            console.error(`PM2 restart stderr: ${stderr}`);
          }
          console.log(`PM2 restart stdout: ${stdout}`);
          return {
            success: true,
          };
        });
      });
    });
  });
}

// export async function updateCMS(formData) {
// const version = await newVersionCheck();
// const response = await fetch(`http://localhost:3004/zip/${version}`);
// const arrayBuffer = await response.arrayBuffer();
// const zipBuffer = Buffer.from(arrayBuffer);
// const tempExtractPath = path.join(process.cwd(), "temp_extracted");
// const backups = path.join(process.cwd(), "backups");
// const nextFolderPath = path.join(process.cwd(), ".next");
// try {
//   await isUpdated("1");

//   if (!existsSync(backups)) {
//     fs.promises.mkdir(backups);
//   }
//   const currentDateFolder = path.join(backups, getCurrentDate());

//   await fss
//     .ensureDir(currentDateFolder)
//     .then(async () => {
//       console.log(`Folder '${currentDateFolder}' created successfully!`);

//       return await fss.copy(nextFolderPath, currentDateFolder);
//     })
//     .then(() => {
//       console.log("Contents copied successfully!");
//     })
//     .catch((err) => {
//       console.error("Error:", err);
//     });

//   if (!existsSync(tempExtractPath)) {
//     fs.promises.mkdir(tempExtractPath);
//   }
//   const zipFilePath = path.join(tempExtractPath, `${version}.zip`);
//   await fs.promises.writeFile(zipFilePath, zipBuffer);

//   await fss.emptyDir(nextFolderPath);

//   const zip = new AdmZip(zipFilePath);
//   zip.extractAllTo(nextFolderPath, true);

//   const data = await fetchCurrentVersion();
//   const pr_version = JSON.parse(data).current_version;
//   await updateVersion(pr_version, version);
//   await isUpdated("0");

// exec("npm run start", (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error restarting server: ${error}`);
//   } else {
//     console.log("Server restarted successfully");
//   }
// });
// } catch (error) {
//   const currentDateFolderBackup = path.join(backups, getCurrentDate());
//   await fss.emptyDir(nextFolderPath);
//   await fss.copy(currentDateFolderBackup, nextFolderPath);
//   console.error("Error updating CMS:", error);

//   return { success: false, error: "Failed to update CMS" };
// } finally {
//   fs.rmdir(tempExtractPath, { recursive: true }, (err) => {
//     if (err) {
//       console.error(`Error removing directory: ${err}`);
//     } else {
//       console.log("Directory removed successfully!");
//     }
//   });
// }
// }

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function forgotPassword(prevState, formData) {
  unstable_noStore();

  const data = {
    mail: formData.get("email"),
  };

  const parsedCredentials = z
    .object({ mail: z.string().email() })
    .safeParse(data);

  if (parsedCredentials.success) {
    const { mail } = parsedCredentials.data;
    const user = await getUser(mail);

    if (!user) return { message: "Email is not Registered", success: false };
    const otp = generateRandomNumber();
    const res = await sendmail(mail, otp);
    if (res.message == true) {
      const res = await storeOTP(otp, mail);
      if (res.success) {
        return { message: "", success: true };
      } else {
        return { message: "Something went wrong", success: false };
      }
    }

    return { message: "", success: false };
  }

  return { message: "", success: false };
}

export async function verifyOTP(prevState, formData) {
  const data = {
    userOTP: formData.get("otp"),
    email: formData.get("email"),
  };

  const parsedCredentials = z
    .object({ userOTP: z.string().min(6), email: z.string().email() })
    .safeParse(data);

  if (parsedCredentials.success) {
    const { userOTP, email } = parsedCredentials.data;

    const res = await getOTP(email);
    if (res) {
      const parsedData = JSON.parse(res);
      const otp = parsedData[0].otp;
      if (otp == userOTP) {
        redirect(`/auth/change-password?email=${email}`);
      } else {
        return { message: "Something went wrong", success: false };
      }
    }

    return { message: "Something went wrong", success: false };
  }

  return { message: "Something went wrong", success: false };
}

export async function changePassword(prevState, formData) {
  const data = {
    pass: formData.get("pass"),
    email: formData.get("email"),
  };

  const parsedCredentials = z
    .object({ pass: z.string().min(7), email: z.string().email() })
    .safeParse(data);

  if (parsedCredentials.success) {
    const { pass, email } = parsedCredentials.data;
    const user = await getUser(email);

    if (!user) return { message: "Something went wrong", success: false };
    const hashedPassword = await bcrypt.hash(pass, 10);
    const res = await updatePassword(hashedPassword, user.id);

    if (res) {
      redirect("/auth/login");
    } else {
      return { message: "Something went wrong", success: false };
    }
  }
  return { message: "Something went wrong", success: false };
}

export async function createUser(formData) {
  const data = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  const parsedCredentials = z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      password: z.string().min(7),
      role: z.string(),
    })
    .safeParse(data);

  if (parsedCredentials.success) {
    await insertUser(parsedCredentials.data);
  }
}

export async function deleteForm(formData) {
  const id = formData.get("id");
  try {
    const query1 = `DELETE FROM form_data WHERE id = ?`;
    const query2 = `DELETE FROM forms WHERE id = ?`;
    const values = [id];

    const res1 = await queryAsync(query1, values);
    const res2 = await queryAsync(query2, values);

    if (res1 && res2) {
    }
  } catch (e) {
    console.log(e);
    return { success: false };
  }

  redirect("/dashboard/forms");
}
