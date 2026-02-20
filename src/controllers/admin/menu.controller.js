const MenuService = require("../../services/dining/menu.service");
const uploadToCloudinary = require("../../utils/cloudUpload");

class MenuController {
  static async create(req, res, next) {
    try {
      let imageUrls = [];

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await uploadToCloudinary(file.buffer);
          imageUrls.push(result.secure_url);
        }
      }

      const item = await MenuService.create({
        ...req.body,
        images: imageUrls,
      });

      res.status(201).json({
        success: true,
        message: "Menu item created successfully",
        data: item,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req, res, next) {
    try {
      const items = await MenuService.getAll(req.query);

      res.json({
        success: true,
        data: items,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const item = await MenuService.getById(req.params.id);

      res.json({
        success: true,
        data: item,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      let imageUrls = [];

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await uploadToCloudinary(file.buffer);
          imageUrls.push(result.secure_url);
        }
      }

      const updatedData = {
        ...req.body,
      };

      if (imageUrls.length > 0) {
        updatedData.images = imageUrls;
      }

      const item = await MenuService.update(req.params.id, updatedData);

      res.json({
        success: true,
        message: "Menu updated successfully",
        data: item,
      });
    } catch (err) {
      next(err);
    }
  }
static async delete(req, res, next) {
  try {
    await MenuService.delete(req.params.id);

    res.json({
      success: true,
      message: "Menu archived successfully",
    });
  } catch (err) {
    next(err);
  }
}
static async restore(req, res, next) {
  try {
    const item = await MenuService.restore(req.params.id);

    res.json({
      success: true,
      message: "Menu restored successfully",
      data: item,
    });
  } catch (err) {
    next(err);
  }
}


  static async toggleAvailability(req, res, next) {
  try {
    const { isAvailable, reason } = req.body;

    const item = await MenuService.toggleAvailability(
      req.params.id,
      isAvailable,
      reason
    );

    res.json({
      success: true,
      message: "Availability updated",
      data: item,
    });
  } catch (err) {
    next(err);
  }
}
static async bulkUpdate(req, res, next) {
  try {
    const result = await MenuService.bulkUpdate(req.body);

    res.json({
      success: true,
      message: "Bulk update completed successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

}

module.exports = MenuController;
