import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';
const generateStorageObject = (lastPath: string) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      let relativeFolderPath = '../uploads/';
      let fullFolderPath = path.resolve(__dirname, relativeFolderPath);
      if (!fs.existsSync(fullFolderPath)) {
        fs.mkdirSync(fullFolderPath);
      }
      fullFolderPath = path.resolve(fullFolderPath, lastPath);
      if (!fs.existsSync(fullFolderPath)) {
        fs.mkdirSync(fullFolderPath);
      }
      cb(null, fullFolderPath);
    },
    filename: function (req, file, cb) {
      const filename = file.fieldname + '-' + Date.now() + '-' + Math.random() * 1000 + path.extname(file.originalname);
      cb(null, filename);
    }
  });
};
const fileFilter = (req: Request, file: any, cb: any) => {
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
  let isAllowed = false;

  if (allowedTypes.includes(file.mimetype)) isAllowed = true;

  cb(null, isAllowed);
};
const fieldGenerator = (name: string, maxCount: number = 2) => {
  return {
    name: name,
    maxCount: maxCount
  };
};
const allowedRegistrationFields = [
  fieldGenerator('ID'),
  fieldGenerator('medicalLicenses'),
  fieldGenerator('medicalDegree')
];

const medicalHistoryUpload = multer({ storage: generateStorageObject('medicalHistory'), fileFilter: fileFilter });

const registrationUpload = multer({ storage: generateStorageObject('registration'), fileFilter: fileFilter });

export { registrationUpload, medicalHistoryUpload, allowedRegistrationFields };
