import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model";

const clientURL = process.env.CLIENT_URL || "http://localhost:3000";

if (process.env.GOOGLE_CLIENT_ID) {
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: `${clientURL}/api/v1/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const googleId = profile.id;

        if (!email) {
          return done(new Error("No email returned from Google"));
        }

        let user = await User.findOne({ provider: "google", providerId: googleId });

        if (!user) {
          user = await User.findOne({ email: email.toLowerCase() });
          if (user) {
            user.provider = "google";
            user.providerId = googleId;
            if (!user.avatar && profile.photos?.[0]?.value) {
              user.avatar = profile.photos[0].value;
            }
          } else {
            user = await User.create({
              fullName: name,
              email: email.toLowerCase(),
              password: googleId + process.env.JWT_SECRET,
              provider: "google",
              providerId: googleId,
              avatar: profile.photos?.[0]?.value,
            });
          }
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err as Error);
      }
    }
  )
);
}


passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
