// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const functions = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");
const { getAuth, deleteUser } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
// const { getDatabase } = require("firebase-admin/database");
import type { UserRecord } from "firebase-admin/auth";
initializeApp();
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
exports.setAccessLevel = functions.https.onCall(setAccessLevel);
exports.setAdmin = functions.https.onCall(setAdmin);
exports.deleteUser = functions.https.onCall(delUser);
exports.addUserInFirestore = functions.auth.user().onCreate(addUserInFirestore);
// Warning: onDelete does NOT trigger for batch deletions
exports.deleteUserInFirestore = functions.auth
  .user()
  .onDelete(deleteUserInFirestore);

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// Admin
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
async function setAccessLevel(data: any, context: any) {
  console.warn(">>>>>>>>setAccessLevel", data, context.auth.token);

  const email: string = data.email;
  const level: number = data.level;
  console.log(">>>>>>>>>>>> TOKEN", context.auth.token);
  if (!context.auth || context.auth.token.admin !== true) {
    return { error: "Only admins may perform this action." };
  }
  const user = await getAuth().getUserByEmail(email);
  if (!user.uid) {
    return { error: `User not found for ${email}` };
  }
  let claims = user.customClaims;
  if (!claims) claims = {};
  claims["level"] = level;
  console.warn(">>>>>>>> SET-CLAIMS", claims);
  getAuth().setCustomUserClaims(user.uid, claims);
  return { level };
}
//
async function setAdmin(data: any, context: any) {
  console.warn(">>>>>>>>SET_ADMIN", data, context.auth.token);
  const email: string = data.email;
  const isAdmin: number = data.isAdmin;

  if (!context.auth || context.auth.token.admin !== true) {
    return { error: "Only admins may perform this action." };
  }
  const user: UserRecord = await getAuth().getUserByEmail(email);
  if (!user.uid) {
    return { error: `User not found for ${email}` };
  }

  let claims = user.customClaims;
  if (!claims) claims = {};

  claims["admin"] = isAdmin;
  claims["accessLevel"] = 10;
  console.warn(">>>>>>>> SET-CLAIMS", claims);
  getAuth().setCustomUserClaims(user.uid, claims);
  return { admin: isAdmin };
}
//
async function delUser(data: any, context: any) {
  const email: string = data.email;
  if (!context.auth || context.auth.token.admin !== true) {
    return { error: "Only admins may perform this action." };
  }
  const user: UserRecord = await getAuth().getUserByEmail(email);
  if (!user.uid) {
    return { error: `User not found for ${email}` };
  }
  console.log(">>>>>>> UID", user.uid);
  await getAuth().deleteUser(user.uid);
  return { ok: true };
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// Triggered DB Writes
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
async function addUserInFirestore(user: UserRecord, context: any) {
  const newUser = {
    uid: user.uid,
    name: user.displayName, // This will be null, it is updated after registration. need to poll for it later
    email: user.email,
    emailVerified: user.emailVerified,
    isAdmin: false,
    accessLevel: 0,
  };
  const db = getFirestore();
  const doc = db.doc(`users/${user.email}`);
  doc.set(newUser);
}
async function deleteUserInFirestore(user: UserRecord, context: any) {
  const db = getFirestore();
  const doc = db.doc(`users/${user.email}`);
  await doc.delete();
}
