import mongoose from 'mongoose';

// Create the product structure that will be stored in MongoDB.
const productSchema = new mongoose.Schema(
  {
    // Product name is required so every product has a title.
    name: { type: String, required: true, trim: true },
    // Product description explains what the item is.
    description: { type: String, required: true, trim: true },
    // Price must be a number and cannot be negative.
    price: { type: Number, required: true, min: 0 },
    // Image URL stores the product picture.
    image: { type: String, default: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' },
    // Stock shows how many items are available.
    stock: { type: Number, default: 10, min: 0 },
    // Active controls whether the product is visible in the store.
    active: { type: Boolean, default: true },
    // Featured controls whether the product should appear in the featured section.
    featured: { type: Boolean, default: false },
  },
  {
    // timestamps adds createdAt and updatedAt automatically.
    timestamps: true,
    toJSON: {
      // This changes the MongoDB _id field into a cleaner id field for the frontend.
      transform: (doc, ret) => {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Export the model so the backend can use it for database operations.
export default mongoose.model('Product', productSchema);
