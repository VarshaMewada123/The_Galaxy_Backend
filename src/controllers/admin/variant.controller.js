const MenuVariant = require("../../models/dining/menuVariant.model");

class VariantController {
  static async create(req, res, next) {
    try {
      const variant = await MenuVariant.create(req.body);

      res.status(201).json({
        success: true,
        data: variant,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = VariantController;
