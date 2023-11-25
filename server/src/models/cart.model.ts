import mongoose, { Document, Schema } from 'mongoose';

interface ICart extends Document {
  userID: mongoose.Types.ObjectId;
  items: {
    id: mongoose.Types.ObjectId;
    count: number;
  }[];
}

const cartSchema = new Schema<ICart>(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true
    },
    items: {
      type: [
        {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medicine',
            required: true
          },
          count: {
            type: Number,
            required: true
          }
        }
      ],
      default: []
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

cartSchema.index({ userID: 1 }, { unique: true });

cartSchema.virtual('total').get(async function (this: ICart) {
  await this.populate('items.id');

  const total: number = this.items.reduce(
    (acc: number, item: { id: any; count: number }) => acc + item.id.price * item.count,
    0
  );

  return total;
});

const Cart = mongoose.model<ICart>('Cart', cartSchema);

export default Cart;
export { ICart };
