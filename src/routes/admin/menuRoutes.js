const express = require("express");
const router = express.Router();
const adminAuth = require("../../middleware/adminAuth");
const validate = require("../../middleware/validate");
const upload = require("../../middleware/upload");
const MenuController = require("../../controllers/admin/menuController");
const { createMenuValidation, updateMenuValidation } = require("../../validations/dining/menu.validation");

// Base path in server.js is assumed to be: /api/v1/admin/dining/menu
router.use(adminAuth);


router.route("/menu")
  .get(MenuController.getAll)
  .post(
    upload.array("images", 5), // 'images' key frontend se match honi chahiye
    createMenuValidation, 
    validate, 
    MenuController.create
  );

// Special Patch operations
router.patch("/menu/bulk", MenuController.bulkUpdate);
router.patch("/menu/:id/availability", MenuController.toggleAvailability);
router.patch("/menu/:id/restore", MenuController.restore);

// Routes for: /:id
router.route("/menu/:id")
  .get(MenuController.getById)
  .patch(
    upload.array("images", 5), 
    updateMenuValidation, 
    validate, 
    MenuController.update
  )
  .delete(MenuController.remove);

module.exports = router;