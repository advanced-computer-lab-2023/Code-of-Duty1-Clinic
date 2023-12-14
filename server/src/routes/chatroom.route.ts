import express, { Request, Response } from 'express';
import {
  getMyPossiblePatients,
  getRoomMessages,
  getMyPossibleDoctors,
  getPharmacistsInfo,
    getDoctorsInfo,
  countUnseenMessages,
  getMyPatients,
  getPatientsForPharmacist
} from '../services/';
import controller from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();
router.use(isAuthenticated);

router.get('/patients', isAuthorized('Doctor'), (req, res) => {
  controller(res)(getMyPossiblePatients)(req.decoded.id);
});

router.get('/doctors', isAuthorized('Patient'), (req, res) => {
  controller(res)(getMyPossibleDoctors)(req.decoded.id);
});

router.get('/pharmacists', isAuthorized('Patient','Doctor'), (req, res) => {
  controller(res)(getPharmacistsInfo)();
});
router.get('/pharmacists/doctors', isAuthorized('Pharmacist'), (req, res) => {
  console.log("147852963");
  controller(res)(getDoctorsInfo)();
});
router.get('/pharmacists/patient', isAuthorized('Pharmacist'), (req, res) => {
  controller(res)(getPatientsForPharmacist)(req.decoded.id);
});

router.get('/room/:otherID', (req, res) => { 
    controller(res)(getRoomMessages)(req.decoded.id, req.params.otherID); 
})
router.get('/room/:otherID/count', async (req, res) => { 
    // try{
    // res.status(StatusCodes.OK).send(await countUnseenMessages(req.decoded.id, req.params.otherID))
    controller(res)(countUnseenMessages)(req.decoded.id, req.params.otherID); 
})

// router.get('/:doctorID/pharmacists', (req, res) => {
//     // controller(res)(getMyPossiblePatients)(req.params.doctorID);
// });
// router.get('/:pharama/pharmacists', (req, res) => {
//     // controller(res)(getMyPossiblePatients)(req.params.doctorID);
// });

export default router;
