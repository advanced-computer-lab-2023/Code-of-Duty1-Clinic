import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils';
import { Order, IOrder, Medicine } from '../models';
import { getAllOrders } from './order.service';
import { ObjectId } from 'mongoose';
import { Types } from 'mongoose';
const getReport = async (query: Object, filter: Object) => {
  let orders = await Order.find({ ...query, status: { $ne: 'Cancelled' } });
  if ('day' in filter) {
    orders = orders.filter((order) => order.date.getDay() == filter.day);
  }
  if ('month' in filter) {
    orders = orders.filter((order) => order.date.getMonth() + 1 == filter.month);
  }
  if ('year' in filter) {
    orders = orders.filter((order) => {
      return order.date.getFullYear() == filter.year;
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

  console.log(filteredOrder);
  return {
    status: StatusCodes.OK,
    filteredOrder
  };
};

export { getReport };
