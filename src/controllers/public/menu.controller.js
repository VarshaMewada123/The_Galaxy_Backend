// const DailyRoster = require("../../models/dining/DailyRoster");
// const Menu = require("../../models/dining/menuItemmodel"); // apna model name use karna

// exports.getMenuForUsers = async (req, res, next) => {
//   try {
//     const start = new Date();
//     start.setHours(0, 0, 0, 0);

//     const end = new Date();
//     end.setHours(23, 59, 59, 999);

//     const roster = await DailyRoster.find({
//       date: { $gte: start, $lte: end },
//     })
//       .populate({
//         path: "items.id",
//         select:
//           "name basePrice images isVeg description preparationTime spiceLevel category",
//         populate: {
//           path: "category",
//           select: "name",
//         },
//       })
//       .lean();

//     let menu = [];

//     if (roster.length) {
//       menu = roster.flatMap((r) =>
//         r.items.map((item) => ({
//           _id: item.id._id,
//           name: item.id.name,
//           basePrice: item.id.basePrice,
//           images: item.id.images,
//           isVeg: item.id.isVeg,
//           description: item.id.description,
//           preparationTime: item.id.preparationTime,
//           spiceLevel: item.id.spiceLevel,
//           category: item.id.category,
//           quantity: item.quantity,
//         })),
//       );
//     } else {
//       const fallbackMenu = await Menu.find({
//         isAvailable: true,
//         isArchived: { $ne: true },
//       })
//         .populate("category", "name")
//         .select(
//           "name basePrice images isVeg description preparationTime spiceLevel category",
//         )
//         .lean();

//       menu = fallbackMenu.map((item) => ({
//         ...item,
//         quantity: null,
//       }));
//     }

//     res.status(200).json({
//       success: true,
//       data: menu,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.getDailyRosterMenu = async (req, res, next) => {
//   try {
//     const start = new Date();
//     start.setHours(0, 0, 0, 0);

//     const end = new Date();
//     end.setHours(23, 59, 59, 999);

//     const roster = await DailyRoster.find({
//       date: { $gte: start, $lte: end },
//     })
//       .populate({
//         path: "items.id",
//         select:
//           "name basePrice images isVeg description preparationTime spiceLevel category",
//         populate: {
//           path: "category",
//           select: "name",
//         },
//       })
//       .lean();

//     if (!roster.length) {
//       return res.status(200).json({
//         success: true,
//         data: [],
//       });
//     }

//     const menu = roster.flatMap((r) =>
//       r.items.map((item) => ({
//         _id: item.id._id,
//         name: item.id.name,
//         basePrice: item.id.basePrice,
//         images: item.id.images,
//         isVeg: item.id.isVeg,
//         description: item.id.description,
//         preparationTime: item.id.preparationTime,
//         spiceLevel: item.id.spiceLevel,
//         category: item.id.category,
//         quantity: item.quantity,
//       })),
//     );

//     res.status(200).json({
//       success: true,
//       data: menu,
//     });
//   } catch (err) {
//     next(err);
//   }
// };


const DailyRoster = require("../../models/dining/DailyRoster");
const Menu = require("../../models/dining/menuItemmodel");

exports.getMenuForUsers = async (req, res, next) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const roster = await DailyRoster.find({
      date: { $gte: start, $lte: end },
    })
      .populate({
        path: "items.id",
        select:
          "name basePrice images isVeg description preparationTime spiceLevel category",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .lean();

    let menu = [];

    if (roster.length) {
      menu = roster.flatMap((r) =>
        r.items
          .filter((item) => item.quantity > 0)
          .map((item) => ({
            _id: item.id._id,
            name: item.id.name,
            basePrice: item.id.basePrice,
            images: item.id.images,
            isVeg: item.id.isVeg,
            description: item.id.description,
            preparationTime: item.id.preparationTime,
            spiceLevel: item.id.spiceLevel,
            category: item.id.category,
            quantity: item.quantity,
          })),
      );
    } else {
      const fallbackMenu = await Menu.find({
        isAvailable: true,
        isArchived: { $ne: true },
      })
        .populate("category", "name")
        .select(
          "name basePrice images isVeg description preparationTime spiceLevel category",
        )
        .lean();

      menu = fallbackMenu.map((item) => ({
        _id: item._id,
        name: item.name,
        basePrice: item.basePrice,
        images: item.images,
        isVeg: item.isVeg,
        description: item.description,
        preparationTime: item.preparationTime,
        spiceLevel: item.spiceLevel,
        category: item.category,
        quantity: null,
      }));
    }

    res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (err) {
    next(err);
  }
};

exports.getDailyRosterMenu = async (req, res, next) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const roster = await DailyRoster.find({
      date: { $gte: start, $lte: end },
    })
      .populate({
        path: "items.id",
        select:
          "name basePrice images isVeg description preparationTime spiceLevel category",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .lean();

    if (!roster.length) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const menu = roster.flatMap((r) =>
      r.items
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          _id: item.id._id,
          name: item.id.name,
          basePrice: item.id.basePrice,
          images: item.id.images,
          isVeg: item.id.isVeg,
          description: item.id.description,
          preparationTime: item.id.preparationTime,
          spiceLevel: item.id.spiceLevel,
          category: item.id.category,
          quantity: item.quantity,
        })),
    );

    res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (err) {
    next(err);
  }
};