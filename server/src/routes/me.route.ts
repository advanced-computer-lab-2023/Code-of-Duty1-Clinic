import express, { Request, Response } from 'express';

import controller from '../controllers';
import { isAuthenticated, isAuthorized } from '../middlewares';
import {
  getUsers,
  updateInfo,
  getAppointments,
  getPrescriptions,
  addFamilyMember,
  getFamily,
  getHealthRecords,
  filterAppointments,
  getUpcoming_Past_Appointments,
  viewWallet
} from '../services';

const router = express.Router();

router.use(isAuthenticated);

// All Users (Doctor & Patient)
router.get('/info', (req: Request, res: Response) => {
  controller(res)(getUsers)({ _id: req.decoded.id });
});
router.put('/info', (req: Request, res: Response) => {
  controller(res)(updateInfo)(req.decoded.id, req.body);
});

router.use(isAuthorized('Doctor', 'Patient'));

// get my appointments
router.get('/appointments', (req: Request, res: Response) => {
  if (req.query.s === 'Upcoming') {
    controller(res)(getUpcoming_Past_Appointments)(req.decoded.id, req.decoded.role,"Upcoming");
  }
  else if (req.query.s === 'Completed') {
    controller(res)(getUpcoming_Past_Appointments)(req.decoded.id, req.decoded.role, "Completed");
  }
  else if (req.query.s === 'filter') {
    // user's id field depends on the role
    const userId = req.decoded.role === 'Patient' ? 'patientID' : 'doctorID';
    controller(res)(filterAppointments)({ ...req.query, [userId]: req.decoded.id, role: req.decoded.role });
  }
  else {
    // user's id field depends on the role
    const userID = req.decoded.role === 'Patient' ? 'patientID' : 'doctorID';
    controller(res)(getAppointments)({ ...req.query, [userID]: req.decoded.id });
  }
});
router.post('/appointments', (req: Request, res: Response) => {
  //   controller(res)()();
});

router.get('/wallet', (req: Request, res: Response) => {
  controller(res)(viewWallet)(req.decoded.id, req.decoded.role);
});

// Doctor Routes
router.get('/weeklyslots', (req: Request, res: Response) => {
  // controller(res)()();
});
router.put('/weeklyslots', (req: Request, res: Response) => {
  // controller(res)()();
});
router.delete('/weeklyslots', (req: Request, res: Response) => {
  // controller(res)()();
});

router.get('/contract', (req: Request, res: Response) => {
  // controller(res)()();
});
router.put('/contract', (req: Request, res: Response) => {
  // controller(res)()();
});

// Patient Routes
router.get('/prescriptions/:id', (req: Request, res: Response) => {
  controller(res)(getPrescriptions)({ _id: req.params.id });
});
router.get('/prescriptions', (req: Request, res: Response) => {
  controller(res)(getPrescriptions)(req.query);
});

router.get('/medicalhistory', isAuthorized('Patient'), (req: Request, res: Response) => {
  controller(res)(getHealthRecords)(req.decoded.id);
});

router.post('/medicalhistory', (req: Request, res: Response) => {
  // controller(res)()();
});

router.get('/doctors', (req: Request, res: Response) => {
  // get my doctors
  // controller(res)()();
});

router.get('/family', (req: Request, res: Response) => {
  controller(res)(getFamily)(req.decoded.id);
});
router.post('/family', (req: Request, res: Response) => {
  controller(res)(addFamilyMember)(req.decoded.id, req.body);
});

router.get('/package', (req: Request, res: Response) => {
  // get package I am subscribed to
  // controller(res)()();
});
router.post('/package', (req: Request, res: Response) => {
  // subscribe to a package
  // controller(res)()();
});

export default router;
