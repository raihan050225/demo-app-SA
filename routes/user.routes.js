const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup", userController.userSignup);
router.post("/login", userController.login);

// router.use(authMiddleware);
// GET all users & POST new user
router.get("/",authMiddleware, userController.getAllUsers);
router.get("/me",authMiddleware, userController.getUserProfile);
router.post("/", (req, res) => userController.createUser(req, res));

router.post("/softdelete/:id", (req, res) =>
  userController.softDeleteUser(req, res),
);
router.post("/adduserprofile", userController.addUserProfile);

// GET, PUT, PATCH, DELETE user by ID
router.get("/:id", (req, res) => userController.getUserById(req, res));
router.put("/:id", (req, res) => userController.updateUser(req, res));
router.patch("/:id", (req, res) => userController.patchUser(req, res));
router.delete("/:id", (req, res) => userController.deleteUser(req, res));

module.exports = router;
