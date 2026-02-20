// const CategoryService = require("../../services/dining/category.service");

// class DiningCategoryController {
//   static async create(req, res, next) {
//     try {
//       const category = await CategoryService.create(req.body);

//       res.status(201).json({
//         success: true,
//         message: "Category created successfully",
//         data: category,
//       });
//     } catch (err) {
//       next(err);
//     }
//   }

//   static async getAll(req, res, next) {
//     try {
//       const categories = await CategoryService.getAll();

//       res.json({
//         success: true,
//         data: categories,
//       });
//     } catch (err) {
//       next(err);
//     }
//   }

//   static async update(req, res, next) {
//     try {
//       const category = await CategoryService.update(
//         req.params.id,
//         req.body
//       );

//       res.json({
//         success: true,
//         message: "Category updated successfully",
//         data: category,
//       });
//     } catch (err) {
//       next(err);
//     }
//   }

//   static async delete(req, res, next) {
//     try {
//       await CategoryService.delete(req.params.id);

//       res.json({
//         success: true,
//         message: "Category deleted successfully",
//       });
//     } catch (err) {
//       next(err);
//     }
//   }
// }

// module.exports = DiningCategoryController;


const CategoryService = require("../../services/dining/category.service");

class DiningCategoryController {
  /*
  |--------------------------------------------------------------------------
  | CREATE CATEGORY
  |--------------------------------------------------------------------------
  */
  static async create(req, res, next) {
    try {
      const category = await CategoryService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | GET ALL CATEGORIES
  |--------------------------------------------------------------------------
  */
  static async getAll(req, res, next) {
    try {
      const categories = await CategoryService.getAll(req.query);

      return res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
      });
    } catch (err) {
      next(err);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | GET SINGLE CATEGORY
  |--------------------------------------------------------------------------
  */
  static async getById(req, res, next) {
    try {
      const category = await CategoryService.getById(req.params.id);

      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | UPDATE CATEGORY
  |--------------------------------------------------------------------------
  */
  static async update(req, res, next) {
    try {
      const category = await CategoryService.update(
        req.params.id,
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DELETE CATEGORY
  |--------------------------------------------------------------------------
  */
  static async delete(req, res, next) {
    try {
      await CategoryService.delete(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DiningCategoryController;
