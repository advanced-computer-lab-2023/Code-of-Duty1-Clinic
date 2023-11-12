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
    controller(res)(saveMedicalHistory)("652b367ea1c23056f61e2651",req.files);
});
uploadRouter.get("/patient/medicalHistory/:recordName",async  (req, res) => {
    const recordName: string = req.params["recordName"];
    const fileUrl: any = await getMedicalHistoryURL({ recordName, _id: "652b367ea1c23056f61e2651" });
    res.status(200).sendFile(fileUrl!);
})
uploadRouter.get("/patient/medicalHistory/",async  (req, res) => {
   controller(res)(getMedicalHistory)("652b367ea1c23056f61e2651");
})

uploadRouter.delete("/patient/medicalHistory/:recordName", (req, res) => {
    controller(res)(removeMedicalHistory)("652b367ea1c23056f61e2651",req.params.recordName);
});

uploadRouter.post("/doctor/registration", registrationUpload.fields(allowedRegistrationFields as any[]),(req, res) => {
    controller(res)(saveRegistrationFiles)("652b367ea1c23056f61e2651", req.files);
});
uploadRouter.use((err: any, req: Request, res: Response) => { 
    if (err instanceof multer.MulterError) { 
        res.status(500).send(err.message); 
    }
});
export default uploadRouter;