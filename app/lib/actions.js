"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import {
  getUser,
  isUpdated,
  queryAsync,
  updatePassword,
  updateVersion,
} from "./data";
import { revalidatePath, unstable_noStore } from "next/cache";
import { newVersionCheck } from "./utils";
import { sendEmail, sendmail } from "./mail";
import { get, set } from "./session-store";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { exec } from "child_process";
import path from "path";

export async function authenticate(prevState, formData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function createCategory(formData) {
  const name = formData.get("category");
  const main = formData.get("main");
  const page = formData.get("page");
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
  console.log(repoPath);

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

        return {
          success: true,
        };

        // Restart the server using PM2
        // exec("npm run start", (error, stdout, stderr) => {
        //   if (error) {
        //     console.error(`Error restarting server: ${error.message}`);
        //     return {
        //       success: false,
        //     };
        //   }
        //   if (stderr) {
        //     console.error(`PM2 restart stderr: ${stderr}`);
        //   }
        //   console.log(`PM2 restart stdout: ${stdout}`);
        // });
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
  const mail = formData.get("email");
  const user = await getUser(mail);
  if (!user) return { message: false };
  const otp = generateRandomNumber();
  const res = await sendmail(mail, otp);
  if (res.message == true) {
    set("otp", otp);
    set("email", mail);
  }

  return { message: true };
}

function generateRandomNumber() {
  const randomNumber =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  return randomNumber;
}

export async function verifyOTP(formData) {
  const userOTP = formData.get("otp");
  const otp = await get("otp");
  console.log(userOTP);
  console.log(otp);
  if (userOTP == otp) {
    redirect("/auth/change-password");
  }
}

export async function changePassword(formData) {
  const pass = formData.get("password");
  const email = await get("email");
  const user = await getUser(email);
  if (!user) return null;
  const hashedPassword = await bcrypt.hash(pass, 10);
  console.log(hashedPassword);
  await updatePassword(hashedPassword, user.id);
}
