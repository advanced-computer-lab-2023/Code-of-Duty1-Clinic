import { StatusCodes } from 'http-status-codes';

import { Medicine } from '../models';
import { IMedicine } from '../models/medicine.model';
import { HttpError } from '../utils';
import path from 'path';
const getMedicines = async (query: Object) => {
  const medicines = await Medicine.find(query);
  if (!medicines) throw new HttpError(StatusCodes.NOT_FOUND, 'No medicine found');

  return {
    status: StatusCodes.OK,
    message: 'Medicines retrieved !',
    result: medicines
  };
};

const addMedicine = async (body: IMedicine) => {
  const newMedicine = new Medicine(body);
  await newMedicine.save();

  return {
    status: StatusCodes.CREATED,
    message: 'Medicine added successfully !',
    result: newMedicine
  };
};

const updateMedicine = async (id: string, body: IMedicine) => {
  let updatedMedicine = await Medicine.findByIdAndUpdate(id, body, { new: true });
  if (!updatedMedicine) throw new HttpError(StatusCodes.NOT_FOUND, 'Medicine not found');

  return {
    status: StatusCodes.OK,
    message: 'Medicine updated successfully !',
    result: updatedMedicine
  };
};
const getPath = (file: any) => {
  const idx = file.path.indexOf('uploads');
  return file.path.slice(idx);
};
const saveImage = async (medicineID: string, file: Express.Multer.File) => {
  // console.log(file, '-------');
  let path = getPath(file);
  let result = await Medicine.findOneAndUpdate({ _id: medicineID }, { image: path }, { new: true });
  return {
    result: result,
    status: StatusCodes.OK,
    message: 'Image uploaded successfully'
  };
};
const getImageURL = async (medicineID: string) => {
  let result;
  try {
    result = await Medicine.findOne({ _id: medicineID });

    console.log(result);
    console.log(medicineID);
    if (!result) return null;
    let imagePath = result?.image;
    console.log(imagePath);

    return path.join(path.dirname(__dirname), imagePath!);
  } catch (e) {
    return null;
  }
};

export { getMedicines, addMedicine, updateMedicine, saveImage, getImageURL };
