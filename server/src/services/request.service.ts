import { Request } from "../models";
import StatusCodes from 'http-status-codes';
import path from 'path';
const getAllRequests = async (medicID: string) => {
    const requests = await Request.findOne({medicID: medicID});
    return {
        status: 200,
        message: "Requests retrieved successfully",
        result: requests,
    };

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
  console.log(updates, "------------");
  const results = await Request.findOneAndUpdate({ medicID: doctorID }, updates, { new: true });
  console.log(results);
  return {
    result: results,
    status: StatusCodes.OK,
    message: "Registration Documents uploaded successfully"
  }

}
const getPath = (files: any) => { 
  console.log(files)
 
  let results = [];
  for (let i = 0; i < files.length; i++) { 
    const idx = files[i].path.indexOf('uploads');
    results.push(files[i].path.slice(idx));
  }
return  results;

}
const resolveURL = (url: string) => { 
  if (!url)
    return null;
  const parentURL = path.dirname(__dirname);
  url = path.join(parentURL, url!);
  return url;
}
//licenses degree ID
const getRequestFileUrl = async (medicID: string, type:any, fileIDX: string)=>{
    const requests = await Request.findOne({ medicID: medicID });
    if (!requests) throw new Error("Requests not found");
    let fileUrl;
    if (type === 'ID')
        fileUrl = requests.ID;
    else
        fileUrl = (requests as any)[type][Number(fileIDX)];

    return resolveURL(fileUrl);

};
export { getAllRequests,getRequestFileUrl,saveRegistrationFiles };