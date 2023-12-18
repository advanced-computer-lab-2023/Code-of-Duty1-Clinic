import { StatusCodes } from 'http-status-codes';
import { ICart, Cart, Medicine, Order, IMedicine, IOrder, User } from '../models';
import { HttpError, sendEmail } from '../utils';
import { NotificationManager } from '../utils/notification';
const getOrders = async (query: Object, userId: string, userRole: string) => {
  if (userRole == 'Pharmacist') return getAllOrders(query);
  const order = await Order.find({ ...query, userID: userId });
  return {
    status: StatusCodes.OK,
    order
  };
};
const addOrder = async (id: string, info: Object) => {
  // info must contain the address and paymentType or stripPaymentId
  const cart: ICart | null = await Cart.findOne({ userID: id });
  const items = cart!.items;
  const orderItems = await Promise.all(
    items.map(async (item) => {
      const medicine: IMedicine | null = await Medicine.findById(item.id);
      if (!medicine) throw new HttpError(StatusCodes.NOT_FOUND, 'the medicine is not found ');
      const medicinePrice = medicine!.price;
      const medicineStock = medicine!.numStock;
  
      if (item.count > medicineStock)
        throw new HttpError(StatusCodes.CONFLICT, 'there is no enough quantity in the stock ');
      await medicine!.updateOne({ $inc: { numStock: -item.count, numSold: item.count } });
      checkStock(medicine);
      return {
        id: item.id,
        count: item.count,
        price: medicinePrice * item.count
      };
    })
  );
  const orderDetails = {
    userID: id,
    items: orderItems,
    status: 'Not Processed',
    date: Date.now(),
    ...info
  };
  const order = new Order(orderDetails);
  await order.save();
  await cart!.updateOne({ items: [] });

  return {
    status: StatusCodes.OK, // need to be modified to make it works with passing the userID
    message: 'the order is created successfully',
    order
  };
};
const updateOrder = async (id: string, info: Object) => {
  const canUpdate = ['status', 'address', 'date'];
  for (const field in info) {
    if (!canUpdate.includes(field)) throw new HttpError(StatusCodes.BAD_REQUEST, 'you cannot update these fields ');
  }
  const order = await Order.findByIdAndUpdate(id, info);
  if (!order) throw new HttpError(StatusCodes.NOT_FOUND, 'order is not exist');
  return {
    satus: StatusCodes.OK,
    message: 'the order is updated successfully',
    order
  };
};
const cancelOrder = async (id: string) => {
  const order: IOrder | null = await Order.findByIdAndUpdate(id, { status: 'Cancelled' }, { new: true });
  if (!order) throw new HttpError(StatusCodes.NOT_FOUND, 'this order doesnot exist');
  order.items.forEach(async (item) => {
    await Medicine.findByIdAndUpdate(item.id, {
      $inc: { numStock: item.count, numSold: -item.count }
    });
  });
  return {
    status: StatusCodes.OK,
    message: 'the order is cancelled ',
    order
  };
};
const getAllOrders = async (query: Object) => {
  const order = await Order.find({ ...query });
  return {
    status: StatusCodes.OK,
    order
  };
};
const checkStock = async (medicine: IMedicine | null) => {
  if (!medicine) return;
  console.log("Checking is medicine is out of stock ",medicine._id);

  const medicineCount = medicine?.numStock;
  if (medicineCount <= 0) {
    let pharmacists = await User.find({ role: 'Pharmacist' });

    let messageContent = `Medicine(id: ${medicine._id} , name: ${medicine.name}) is out of stock,`

    if (pharmacists?.length === 0) {
      console.log(`${messageContent}, No Pharmacists found to notify`);
      return;
    }
    const title = `Medicine ${medicine.name} Out of stock`;
    const type = "Update";
    for (const pharmacist of pharmacists) {
      try {
        NotificationManager.notify(pharmacist._id.toString(), type, messageContent, title, new Date());
        sendEmail(pharmacist.email, title, messageContent);
      } catch (e) {
        console.error('Notification Error :', e);
        continue;
      }
    }
  }

};

export { getOrders, addOrder, updateOrder, cancelOrder, getAllOrders };
