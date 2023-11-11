import controller from "../controllers";
import { Response,Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Router } from "express";
import multer from 'multer';
import path from 'path';
import { isAuthenticated, isAuthorized } from '../middlewares';
import { medicalHistoryUpload , registrationUpload ,allowedRegistrationFields} from '../middlewares';
import {saveMedicalHistory,removeMedicalHistory,saveRegistrationFiles,getMedicalHistoryURL,getMedicalHistory} from '../services'
const uploadRouter = Router();
// uploadRouter.use(isAuthenticated);

uploadRouter.post("/patient/medicalHistory", medicalHistoryUpload.array("medicalHistory"),(req, res) => {
    controller(res)(saveMedicalHistory)( req.decoded.id,req.files);
});
uploadRouter.get("/patient/medicalHistory/:recordName",async  (req, res) => {
    const recordName: string = req.params["recordName"];
    const fileUrl: any = await getMedicalHistoryURL({ recordName, _id: req.decoded.id });
    res.status(200).sendFile(fileUrl!);
})
uploadRouter.get("/patient/medicalHistory/",async  (req, res) => {
   controller(res)(getMedicalHistory)(req.decoded.id);
})

uploadRouter.delete("/patient/medicalHistory/:recordName", (req, res) => {
    controller(res)(removeMedicalHistory)(req.decoded.id,req.params.recordName);
});

uploadRouter.post("/doctor/registration", registrationUpload.fields(allowedRegistrationFields as any[]),(req, res) => {
    controller(res)(saveRegistrationFiles)("652b3a615c37bacab1ef288f", req.files);
});
uploadRouter.use((err: any, req: Request, res: Response) => { 
    if (err instanceof multer.MulterError) { 
        res.status(500).send(err.message); 
    }
});
export default uploadRouter;