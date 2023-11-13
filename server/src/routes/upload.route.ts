import controller from "../controllers";
import { Response,Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Router } from "express";
import multer from 'multer';
import path from 'path';
import { isAuthenticated, isAuthorized } from '../middlewares';
import { medicalHistoryUpload , registrationUpload ,allowedRegistrationFields} from '../middlewares';
import {saveMedicalHistory,removeMedicalHistory,saveRegistrationFiles,getMedicalHistoryURL,getMedicalHistory,getAllRequests} from '../services'
const uploadRouter = Router();

uploadRouter.use(isAuthenticated);
uploadRouter.get("/patient/medicalHistory/:recordName", async (req, res) => {
    const recordName: string = req.params["recordName"];
    console.log(recordName, "-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
    const fileUrl: any = await getMedicalHistoryURL({ recordName, _id: req.decoded.id });
    res.status(200).sendFile(fileUrl!);
});
uploadRouter.delete("/patient/medicalHistory/:recordName", (req, res) => {
    controller(res)(removeMedicalHistory)(req.decoded.id,req.params.recordName);
});

uploadRouter.get("/patient/medicalHistory/",async  (req, res) => {
   controller(res)(getMedicalHistory)(req.decoded.id);
})
uploadRouter.post("/patient/medicalHistory", medicalHistoryUpload.array("medicalHistory"), (req, res) => {
    const fileName = req.body.fileName;
    console.log(fileName,"-+-+-+-+-+-");
    controller(res)(saveMedicalHistory)( req.decoded.id,req.files,fileName);
});



//-------------------------------------------------------------------------------------------------------------------
uploadRouter.use(isAuthorized("Doctor"));
uploadRouter.post("/doctor/registration", registrationUpload.fields(allowedRegistrationFields as any[]),(req, res) => {
    controller(res)(saveRegistrationFiles)(req.decoded.id, req.files);
});
uploadRouter.get("/doctor/registration/",async  (req, res) => {
   controller(res)(getAllRequests)(req.decoded.id);
})
uploadRouter.use((err: any, req: Request, res: Response) => { 
    if (err instanceof multer.MulterError) { 
        res.status(500).send(err.message); 
    }
});
export default uploadRouter;