const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const UserModel = require("./models/User");

// Configure Passport

exports.initializeGoogleAuth = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        // This function is called after a successful authentication

        const existingUser = UserModel.findOne({ googleID: profile.id });
        if (!existingUser) {
          const newUser = new UserModel({
            googleIDid: profile.id,
            googleName: profile.displayName,
          });
          await UserModel.save();
        }

        // Call done with user data
        done(null, userData);
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
// Set up routes

//Google Auth
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   function (req, res) {
//     // Successful authentication, redirect to the home page
//     res.json({ message: "Error logging in" });
//   }
// );
