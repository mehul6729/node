import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    category: {
      type: String,
      required: true,
    },

    variants: [
      {
        color: String,
        image: [
          {
            type: String,
            required: true,
          },
        ],
        sizeOptions: [
          {
            size: String,
            stock: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],

    brand: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviews: [
      {
        reviewer_name: String,
        message: String,
        rating: Number,
      },
    ],

    gender: {
      type: String,
      enum: ["M", "F", "U", "none"],
      default: "none",
    },
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  },
);

const productModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;

// Payload example for ui
// {
//   "title": "Men's Blue Cotton Shirt",
//   "description": "Premium quality cotton shirt for men. Comfortable and stylish.",
//   "price": 1499,
//   "discountPrice": 1199,
//   "images": [
//     "https://example.com/images/shirt1.jpg",
//     "https://example.com/images/shirt2.jpg",
//     "https://example.com/images/shirt3.jpg"
//   ],
//   "category": "Shirts",
//   "variants": [
//     {
//       "size": "M",
//       "color": "Blue",
//       "offer_type": "Summer Sale",
//       "purchase_count": 10
//     },
//     {
//       "size": "L",
//       "color": "Blue",
//       "offer_type": "Summer Sale",
//       "purchase_count": 5
//     }
//   ],
//   "brand": "Zara",
//   "stock": 50,
//   "isActive": true,
//   "rating": 4.5,
//   "numReviews": 120
// }
