import mongoose, { Document, Schema } from 'mongoose';

interface OrderItem {
  id: mongoose.Types.ObjectId;
  price: number;
  count: number;
}

interface IOrder extends Document {
  userID: mongoose.Types.ObjectId;
  items: OrderItem[];
  address: string;
  status?: 'Not Processed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  deliveryPrice?: number;
  paymentType: 'Cash' | 'Card' | 'Wallet';
  StripePaymentID?: string;
  date: Date;
  deliveredAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
          price: {
            type: Number,
            required: true
          },
          count: {
            type: Number,
            required: true
          }
        }
      ],
      required: true
    },
    address: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Not Processed'
    },
    deliveryPrice: {
      type: Number,
      min: 0,
      default: 0
    },
    paymentType: {
      type: String,
      enum: ['Cash', 'Card', 'Wallet'],
      required: true
    },
    StripePaymentID: {
      type: String,
      required: function () {
        return this.paymentType === 'Card';
      }
    },
    date: {
      type: Date,
      default: Date.now
    },
    deliveredAt: Date
  },
  { timestamps: true }
);

orderSchema.index({ userID: 1 });

orderSchema.virtual('total').get(function (this: IOrder) {
  const productsPrice: number = this.items.reduce(
    (acc: number, item: { price: number; count: number }) => acc + item.price * item.count,
    0
  );
  const total: number = productsPrice + this.deliveryPrice!;

  return total;
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
export { IOrder };
