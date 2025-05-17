import { USER_SCOPES } from "../../constants/google_scopes";
import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
provider.setDefaultLanguage("es");
for (const scope of USER_SCOPES) {
  provider.addScope(scope);
}
provider.addScope("https://www.googleapis.com/auth/classroom.courses.readonly");
provider.addScope("https://www.googleapis.com/auth/classroom.rosters.readonly");
provider.addScope(
  "https://www.googleapis.com/auth/admin.directory.user.readonly"
);
// Restrict sign-in to a specific domain
provider.setCustomParameters({
  hd: "alicialonso.org",
});

export { provider };
