import { Request } from '../models';
import StatusCodes from 'http-status-codes';
import path from 'path';
const getAllRequests = async (medicID: string) => {
  const requests = await Request.findOne({ medicID: medicID });
  return {
    status: 200,
    message: 'Requests retrieved successfully',
    result: requests
  };
};
const saveRegistrationFiles = async (doctorID: string, files: any) => {
  const IDFiles = files.ID;
  const degreeFiles = files.medicalDegree;
  const licensesFields = files.medicalLicenses;

  let IDPath: any = IDFiles ? getPath(IDFiles)![0] : undefined;
  let degreePath: any[] = degreeFiles ? getPath(degreeFiles) : [];
  let licensePath: any[] = licensesFields ? getPath(licensesFields) : [];

  let updates: any = {
    ID: IDPath,
    $push: {
      degree: { $each: degreePath },
      licenses: { $each: licensePath }
    }
  };

  if (!IDPath) {
    delete updates.ID;
  }
  console.log(updates, '------------');
  const results = await Request.findOneAndUpdate({ medicID: doctorID }, updates, { new: true });
  console.log(results);
  return {
    result: results,
    status: StatusCodes.OK,
    message: 'Registration Documents uploaded successfully'
  };
};
const getPath = (files: any) => {
  console.log(files);

  let results = [];
  for (let i = 0; i < files.length; i++) {
    const idx = files[i].path.indexOf('uploads');
    results.push(files[i].path.slice(idx));
  }
  return results;
};
const resolveURL = (url: string) => {
  if (!url) return null;
  const parentURL = path.dirname(__dirname);
  url = path.join(parentURL, url!);
  return url;
};
//licenses degree ID
const getRequestFileUrl = async (medicID: string, type: any, fileIDX: string) => {
  console.log(medicID," ff ff  ",type," f ff ",fileIDX,"  ")
  const requests = await Request.findOne({ medicID: medicID });
  if (!requests) throw new Error('Requests not found');
  let fileUrl;
  if (type === 'ID') {
    fileUrl = requests.ID;
  } else {
    if (!(requests as any )[type]) throw new Error(`Type ${type} not found in requests`);
    fileUrl = (requests as any )[type][Number(fileIDX)];
  }
  console.log(requests, "requests found , ", fileUrl," ddddddddddddd");
  return resolveURL(fileUrl);
};
const didUploadBefore = async (medicID: string) => {
  const requests = await Request.findOne({ medicID: medicID });
  console.log(JSON.stringify(requests));
  let result = false;
  if (requests) result = requests.ID && requests.degree?.length! > 0 && requests.licenses?.length! > 0 ? true : false;
  return {
    result: result,
    status: StatusCodes.OK
  }
};
export { getAllRequests, getRequestFileUrl, saveRegistrationFiles,didUploadBefore };
