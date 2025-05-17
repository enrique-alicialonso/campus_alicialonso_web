import { google } from "googleapis";
import { USER_SCOPES, ADMIN_SCOPES } from "../constants/google_scopes";

const credentials = JSON.parse(
  process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || ""
);

export const guserauth = (subject?: string) =>
  new google.auth.GoogleAuth({
    credentials,
    scopes: USER_SCOPES,
    clientOptions: {
      subject,
    },
  });

export const gadminauth = new google.auth.GoogleAuth({
  credentials,
  scopes: ADMIN_SCOPES,
  clientOptions: {
    subject: process.env.GOOGLE_ADMIN_USER_KEY,
  },
});
