import controller from '../controllers';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { isAuthenticated, isAuthorized } from '../middlewares';
import { medicalHistoryUpload, registrationUpload, allowedRegistrationFields } from '../middlewares';
import {
  saveMedicalHistory,
  removeMedicalHistory,
  saveRegistrationFiles,
  getMedicalHistoryURL,
  getMedicalHistory,
  getAllRequests,
  getRequestFileUrl
} from '../services';
import { medicineUpload } from '../middlewares';
import { saveImage, getImageURL } from '../services';

const uploadRouter = Router();

// uploadRouter.use(isAuthenticated);
uploadRouter.get('/patient/medicalHistory/:recordName', async (req, res) => {
  const recordName: string = req.params['recordName'];
  const fileUrl: any = await getMedicalHistoryURL({ recordName, _id: req.decoded.id });
  if (!fileUrl) return res.status(StatusCodes.NOT_FOUND).send('File not found');

  res.status(200).sendFile(fileUrl!);
});
uploadRouter.delete('/patient/medicalHistory/:recordName', (req, res) => {
  controller(res)(removeMedicalHistory)(req.decoded.id, req.params.recordName);
});

uploadRouter.get('/patient/medicalHistory/', async (req, res) => {
  controller(res)(getMedicalHistory)(req.decoded.id);
});
uploadRouter.post('/patient/medicalHistory', medicalHistoryUpload.array('medicalHistory'), (req, res) => {
  const fileName = req.body.fileName;
  controller(res)(saveMedicalHistory)(req.decoded.id, req.files, fileName);
});

//-------------------------------------------------------------------------------------------------------------------
uploadRouter.get('/doctor/registration/:doctorID', async (req, res) => {
  controller(res)(getAllRequests)(req.params.doctorID);
});
uploadRouter.get('/doctor/registration/:doctorID/:type/:fileIDX', async (req, res) => {
  const url = await getRequestFileUrl(req.params.doctorID, req.params.type, req.params.fileIDX);
  // console.log(url," ----* -*-*-*-*-*-")
  if (!url) res.status(StatusCodes.NOT_FOUND).send('url not found');
  res.status(StatusCodes.OK).sendFile(url!);
});

// uploadRouter.use(isAuthorized("Doctor"));
uploadRouter.post('/doctor/registration', registrationUpload.fields(allowedRegistrationFields as any[]), (req, res) => {
  controller(res)(saveRegistrationFiles)(req.decoded.id, req.files);
});

uploadRouter.use((err: any, req: Request, res: Response) => {
  if (err instanceof multer.MulterError) {
    res.status(500).send(err.message);
  }
});
uploadRouter.get('/medicine/image/:id', async (req, res) => {
  let url = await getImageURL(req.params.id);
  console.log(url);
  if (url) res.status(StatusCodes.OK).sendFile(url);
  else res.status(StatusCodes.NOT_FOUND).send('URL not found check did you upload any picture ?');
});
// uploadRouter.use(isAuthenticated);
uploadRouter.post('/medicine/image/:id', medicineUpload.single('medicine'), async (req, res) => {
  controller(res)(saveImage)(req.params.id, req.file);
});

uploadRouter.get('/pharmacist/registration/:doctorID', async (req, res) => {
  controller(res)(getAllRequests)(req.params.doctorID);
});
uploadRouter.get('/pharmacist/registration/:doctorID/:type/:fileIDX', async (req, res) => {
  const url = await getRequestFileUrl(req.params.doctorID, req.params.type, req.params.fileIDX);
  // console.log(url," ----* -*-*-*-*-*-")
  if (!url) res.status(StatusCodes.NOT_FOUND).send('url not found');
  res.status(StatusCodes.OK).sendFile(url!);
});

<<<<<<< HEAD
// uploadRouter.use(isAuthorized("Pharmacist"));
=======
// uploadRouter.use(isAuthorized('Pharmacist'));
>>>>>>> main
uploadRouter.post(
  '/pharmacist/registration',
  registrationUpload.fields(allowedRegistrationFields as any[]),
  (req, res) => {
    controller(res)(saveRegistrationFiles)(req.decoded.id, req.files);
  }
);
uploadRouter.get('/pharmacist/registration/', async (req, res) => {
  controller(res)(getAllRequests)(req.decoded.id);
});
uploadRouter.use((err: any, req: Request, res: Response) => {
  if (err instanceof multer.MulterError) {
    res.status(500).send(err.message);
  }
});

export default uploadRouter;
