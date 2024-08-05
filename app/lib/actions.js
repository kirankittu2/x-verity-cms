"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import dotenv from "dotenv";
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
import bcrypt from "bcryptjs";
import { exec, execFile } from "child_process";
import path from "path";
import { z } from "zod";
// import WebSocket from "ws";
import { headers } from "next/headers";

const env = process.env.NODE_ENV || "development";
if (env === "development") {
  dotenv.config({ path: ".env.local" });
} else if (env === "production") {
  dotenv.config({ path: ".env.prod" });
}

export async function authenticate(prevState, formData) {
  const headersList = headers();
  const referer = headersList.get("X-Forwarded-Host");
  console.log(referer);

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
  let socketPath;
  let scriptPath;
  if (env === "development") {
    socketPath = "ws://socket.qcentrio.com";
    scriptPath = "../../../../update.sh";
  } else if (env === "production") {
    socketPath = "wss://socket.qcentrio.com";
    scriptPath = "../../../update.sh";
  }

  const websocket = new WebSocket(socketPath);
  const scriptPathAB = path.join(__dirname, scriptPath);

  websocket.addEventListener("open", () => {
    websocket.send(
      JSON.stringify({
        type: "load",
        message: "Application is being updated..",
      })
    );

    exec(
      "chmod a+rwx /home/qcadmin/public_html/x-verity-cms/update.sh",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing script: ${error.message}`);
          return "chmod failed";
        }
        if (stderr) {
          console.error(`Script stderr: ${stderr}`);
          return "chmod failed";
        }
        console.log(`Script stdout: ${stdout}`);
      }
    );

    exec(scriptPathAB, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        websocket.send(
          JSON.stringify({ type: "error", message: error.message })
        );
        return "Update failed";
      }
      if (stderr) {
        console.error(`Script stderr: ${stderr}`);
        websocket.send(JSON.stringify({ type: "error", message: "stderr" }));
        return "Update failed";
      }

      websocket.send(
        JSON.stringify({
          type: "success",
          message: "Application updated successfully",
        }),
        (err) => {
          if (err) {
            console.error(`Error sending WebSocket message: ${err.message}`);
            return;
          }

          exec("pm2 restart all", (error, stdout, stderr) => {
            if (error) {
              console.error(`Error restarting PM2: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`PM2 stderr: ${stderr}`);
              return;
            }
            console.log(`PM2 stdout: ${stdout}`);
          });
        }
      );

      return "Update triggered";
    });
  });
}

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
