// to be able to use req.decoded
declare namespace Express {
  export interface Request {
    decoded: any;
  }
}
