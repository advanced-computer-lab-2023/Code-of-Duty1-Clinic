import { Request } from "../models";


const getAllRequests = async (medicID: string) => {
    const requests = await Request.find({medicID: medicID});
    return {
        status: 200,
        message: "Requests retrieved successfully",
        result: requests,
    };

}

export { getAllRequests };