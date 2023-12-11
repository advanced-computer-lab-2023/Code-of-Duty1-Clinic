import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../utils';
import { Cart, Prescription, User } from '../models';
import { Types } from 'mongoose';
import Medicine, { IMedicine } from '../models/medicine.model';

const getCart = async (userId: string) => {
  const cart = await Cart.findOne({ userID: userId }).populate('items.id');
  if (!cart) throw new HttpError(StatusCodes.NOT_FOUND, 'Cart is empty');

  return {
    status: StatusCodes.OK,
    message: 'Cart retrieved !',
    result: cart
  };
};
const addCartItem = async (userId: string, medID: string, prescriptionID: string, medicineID: string) => {
  let cart = await Cart.findOne({ userID: userId });
  const medicine = await Medicine.findOne({ _id: medID });
  if (!medicine) throw new HttpError(StatusCodes.NOT_FOUND, 'Medicine are out of Stock');

  if (!cart) {
    cart = new Cart({ userID: userId, items: [] });
    await cart.save();
  }
  let itemIndex = cart.items.findIndex((item) => item.id._id.toString() === medID);
  if (itemIndex !== -1) {
    cart.items[itemIndex].count++;
  } else {
    cart.items.push({ id: new Types.ObjectId(medID), count: 1 });
  }
  await cart.save();

  if (prescriptionID && medicineID) {
    const prescription = await Prescription.findById(prescriptionID);
    let prescriptionMedicines = prescription?.medicines;
    prescriptionMedicines?.forEach((medicine) => {
      if (medicine?._id.toString() === medicineID) {
        medicine.isSubmitted = true;
      }
    });
    const updatedPrescription = await prescription?.updateOne({ medicines: prescriptionMedicines });
    if (!updatedPrescription) throw new HttpError(StatusCodes.BAD_REQUEST, 'failed to update prescription');
  }
  return {
    status: StatusCodes.OK,
    message: 'Item added successfully !',
    result: 'Item added successfully'
  };
};

const removeCartItem = async (userId: string, itemID: String) => {
  const cart = await Cart.findOne({ userID: userId });
  if (!cart) throw new HttpError(StatusCodes.NOT_FOUND, 'Cart not found');
  const item = cart.items.find((item) => item.id._id.toString() === itemID.toString());
  if (!item) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Item not found');
  }
  cart.items.splice(cart.items.indexOf(item), 1);
  if (cart.items.length == 0) {
    await cart.deleteOne();
  } else {
    await cart.save();
  }
  return {
    status: StatusCodes.OK,
    message: 'Item deleted successfully !',
    result: 'Item deleted successfully'
  };
};
const increaseItemCount = async (userId: string, itemId: string) => {
  const cart = await Cart.findOne({ userID: userId });
  if (!cart) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Cart not found');
  }

  const item = cart.items.find((item) => item.id.equals(itemId));
  if (!item) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Item not found');
  }

  const medicine = await Medicine.findOne({ _id: item.id });
  if (!medicine) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Medicine not found');
  }

  if (medicine.numStock - item.count === 0) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Medicine is out of stock');
  }

  item.count++;
  await cart.save();

  return {
    status: StatusCodes.OK,
    message: 'Count changed successfully!',
    result: 'Count changed successfully!'
  };
};

const decreaseItemCount = async (userId: string, itemId: string) => {
  const cart = await Cart.findOne({ userID: userId });
  if (!cart) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Cart not found');
  }

  const itemIndex = cart.items.findIndex((item) => item.id.toString() === itemId);
  if (itemIndex === -1) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Item not found');
  }

  cart.items[itemIndex].count--;
  if (cart.items.length === 0) {
    await cart.deleteOne();
  } else {
    await cart.save();
  }

  return {
    status: StatusCodes.OK,
    message: 'Count has been changed successfully!',
    result: 'Count has been changed successfully!'
  };
};

export { getCart, removeCartItem, increaseItemCount, decreaseItemCount, addCartItem };
