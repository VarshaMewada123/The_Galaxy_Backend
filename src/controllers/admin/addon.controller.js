const MenuAddon = require("../../models/dining/menuAddon.model");

class AddonController {
  static async create(req, res, next) {
    try {
      const addon = await MenuAddon.create(req.body);

      res.status(201).json({
        success: true,
        data: addon,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AddonController;
