import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

// add Products
export const addProduct = async (req, res) => {
  const { price, discountPrice, images } = req.body;
  const user = await userModel.findById(req.user.id);
  console.log(user);
  if (user.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Only Admin can add products",
    });
  }

  if (discountPrice && discountPrice > price) {
    return res.status(400).json({
      success: false,
      message: "Discount price cannot be greater than price",
    });
  }

  if (!images || images.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one image is required",
    });
  }

  try {
    const product = await productModel.create(req.body); // this save the data in db
    // const product = new productModel(req.body); // this line does not save data in db
    // await product.save(); // after we call save the data is saved
    return res
      .status(200)
      .json({ success: true, message: "Product Added successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const getProducts = async (req, res) => {
  const { category, bestSeller, minPrice, maxPrice, search, sortBy } =
    req.query;
  try {
    const products = await productModel.find().sort({ createdAt: -1 }); // newest first

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const getProducts = async (req, res) => {
//   try {
//     const {
//       category,
//       bestSeller,
//       minPrice,
//       maxPrice,
//       search,
//       sortBy,
//     } = req.query;

//     // Build filter object dynamically
//     let filter = {};

//     if (category) {
//       filter.category = category;
//     }

//     if (bestSeller === "true") {
//       filter.bestSeller = true;
//     }

//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = Number(minPrice);
//       if (maxPrice) filter.price.$lte = Number(maxPrice);
//     }

//     if (search) {
//       filter.title = { $regex: search, $options: "i" }; // case-insensitive search
//     }

//     // Sorting
//     let sortOption = { createdAt: -1 }; // default newest

//     if (sortBy === "price_low") {
//       sortOption = { price: 1 };
//     }

//     if (sortBy === "price_high") {
//       sortOption = { price: -1 };
//     }

//     const products = await productModel
//       .find(filter)
//       .sort(sortOption);

//     return res.status(200).json({
//       success: true,
//       count: products.length,
//       products,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
