import { Request } from "../models";
import { HttpError } from '../utils';
import StatusCodes from 'http-status-codes';
const getPath = (files: any) => { 
  console.log(files)
 
  let results = [];
  for (let i = 0; i < files.length; i++) { 
    const idx = files[i].path.indexOf('uploads');
    results.push(files[i].path.slice(idx));
  }
return  results;

}
const saveRegistrationFiles = async (doctorID: string, files: any) => {

  const IDFiles = files.ID;
  const degreeFiles = files.medicalDegree;
  const licensesFields = files.medicalLicenses;
    
  let IDPath: any = IDFiles ? (getPath(IDFiles)![0]) : undefined;
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
//   console.log(updates, "------------");
  const results = await Request.findOneAndUpdate({ medicID: doctorID }, updates, { new: true });
  console.log(results);
  return {
    result: results,
    status: StatusCodes.OK,
    message: "Registration Documents uploaded successfully"
  }

}
