const DiningCategory = require("../../models/dining/diningCategory.model");
const slugify = require("slugify");
const { AppError } = require("../../middleware/errorHandler");

class CategoryService {
  /*
  |--------------------------------------------------------------------------
  | CREATE CATEGORY
  |--------------------------------------------------------------------------
  */
  static async create(data) {
    const slug = this.generateSlug(data.name);

    const existing = await DiningCategory.exists({ slug });
    if (existing) {
      throw new AppError("Category already exists", 400);
    }

    const category = await DiningCategory.create({
      ...data,
      slug,
    });

    return category;
  }

  /*
  |--------------------------------------------------------------------------
  | GET ALL CATEGORIES
  | (Pagination + filtering ready)
  |--------------------------------------------------------------------------
  */
  static async getAll(query = {}) {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(parseInt(query.limit) || 50, 100);
    const skip = (page - 1) * limit;

    const filter = {};

    // optional active filter
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === "true";
    }

    const categories = await DiningCategory.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return categories;
  }

  /*
  |--------------------------------------------------------------------------
  | GET CATEGORY BY ID
  |--------------------------------------------------------------------------
  */
  static async getById(id) {
    const category = await DiningCategory.findById(id).lean();

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return category;
  }

  /*
  |--------------------------------------------------------------------------
  | UPDATE CATEGORY
  |--------------------------------------------------------------------------
  */
  static async update(id, data) {
    // regenerate slug if name changes
    if (data.name) {
      const slug = this.generateSlug(data.name);

      // prevent duplicate slug
      const existing = await DiningCategory.findOne({
        slug,
        _id: { $ne: id },
      });

      if (existing) {
        throw new AppError("Category name already in use", 400);
      }

      data.slug = slug;
    }

    const category = await DiningCategory.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return category;
  }

  /*
  |--------------------------------------------------------------------------
  | DELETE CATEGORY (SOFT DELETE - PRODUCTION SAFE)
  |--------------------------------------------------------------------------
  */
 static async delete(id) {

  // ✅ ObjectId validation (prevents Mongo cast issues)
  const mongoose = require("mongoose");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid category id", 400);
  }

  const category = await DiningCategory.findById(id);

  // ✅ Idempotent behaviour (VERY IMPORTANT)
  if (!category) {
    return true; // already deleted / not exists → still success
  }

  // ✅ already inactive → don't throw error
  if (!category.isActive === false) {
    return true;
  }

  category.isActive = false;
  await category.save();

  return true;
}


  /*
  |--------------------------------------------------------------------------
  | PRIVATE HELPERS
  |--------------------------------------------------------------------------
  */
  static generateSlug(name) {
    return slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
}

module.exports = CategoryService;
