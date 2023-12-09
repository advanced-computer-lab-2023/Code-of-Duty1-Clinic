import express, { Request, Response } from 'express';
import {
  getMyPossiblePatients,
  getRoomMessages,
  getMyPossibleDoctors,
  getPharmacistsInfo,
  getDoctorsInfo
} from '../services/';
import controller from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';
const router = express.Router();
router.use(isAuthenticated);

router.get('/patients', isAuthorized('Doctor'), (req, res) => {
  controller(res)(getMyPossiblePatients)(req.decoded.id);
});
router.get('/patients/:patientID', (req, res) => {
  controller(res)(getRoomMessages)(req.decoded.id, req.params.patientID);
});

router.get('/doctors', isAuthorized('Patient'), (req, res) => {
  controller(res)(getMyPossibleDoctors)(req.decoded.id);
});
router.get('/doctors/:doctorID', (req, res) => {
  controller(res)(getRoomMessages)(req.decoded.id, req.params.doctorID);
});
router.get('/pharmacists', isAuthorized('Patient'), (req, res) => {
  controller(res)(getPharmacistsInfo)();
});
router.get('/pharmacists/doctors', isAuthorized('Pharmacist'), (req, res) => {
  controller(res)(getDoctorsInfo)();
});
// router.get('/:doctorID/pharmacists', (req, res) => {
//     // controller(res)(getMyPossiblePatients)(req.params.doctorID);
// });
// router.get('/:pharama/pharmacists', (req, res) => {
//     // controller(res)(getMyPossiblePatients)(req.params.doctorID);
// });

export default router;
