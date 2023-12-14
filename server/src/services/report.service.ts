import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils';
import { Order, IOrder, Medicine } from '../models';
import { Types } from 'mongoose';
const getReport = async (query: Object) => {
  let orders = await Order.find({ status: { $ne: 'Cancelled' } });

  if ('day' in query) {
    orders = orders.filter((order) => {
      console.log(order.date.getDate());
      return order.date.getDate() - 1 == query.day;
    });
  }
  if ('month' in query) {
    orders = orders.filter((order) => order.date.getMonth() + 1 == query.month);
  }
  if ('year' in query) {
    orders = orders.filter((order) => {
      return order.date.getFullYear() == query.year;
    });
  }

  let filteredOrder: { [itemName: string]: { count: number; totalPrice: number; id: Types.ObjectId } } = {};

  for (const order of orders) {
    const items = order.items;
    for (const item of items) {
      const orderItem = await Medicine.findById(item.id);
      if (orderItem) {
        const itemName = orderItem.name;
        if (itemName in filteredOrder) {
          filteredOrder[itemName].count += item.count;
          filteredOrder[itemName].totalPrice += item.count * orderItem.price;
        } else {
          filteredOrder[itemName] = {
            count: item.count,
            totalPrice: item.count * orderItem.price,
            id: new Types.ObjectId(item.id)
          };
        }
      }
    }
  }

  return {
    status: StatusCodes.OK,
    filteredOrder
  };
};

export { getReport };
