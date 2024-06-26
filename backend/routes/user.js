const express = require("express");

const router = express.Router();
const { login, signup, verifyUser, userDetail, getUserOwnedProject, getUserNameFromId, getUserSharedProjects, forgotPassword, editUserProfile, resetPassword} = require("../controller/user");

const { isAuth } = require('../middlewares/user');


router.post("/login", login);
router.post("/signup", signup);
router.post("/verify-user", verifyUser);
router.get("/detail", isAuth, userDetail);
router.get("/owned-projects", isAuth, getUserOwnedProject);
router.get("/name-from-id", getUserNameFromId);
router.get("/shared-projects-to-user", isAuth ,getUserSharedProjects);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/edit", isAuth, editUserProfile);

module.exports = router;