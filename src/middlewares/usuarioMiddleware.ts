import { NextFunction, Request, Response } from "express";
import { decode, verify } from "jsonwebtoken";

export const  ensuredAuthenticated = () => {
  
  return async (request: Request, response: Response, next: NextFunction) => {
    const authHeaders = request.headers.authorization;
    
    if (!authHeaders) {
      return response.status(401).json({ error: "Token is missing!" });
    }

    const [, token] = authHeaders.split(" ");

    try {
      verify(token, String(process.env.SECRET_JWT));
      const  sub  = decode(token);
      if(sub!== null){
        request.body.usuarioId = sub.toString();
        // console.log('RETURN : '+sub)
      }
      return next();
    } catch (err) {
      return response.status(401).json({ error: "Token is wrong!" });
    }
  };
};

export const  verifyAuthenticated = () => {
  return async (request: Request, response: Response) => {

    const authHeaders = request.headers.authorization;
    //console.log(authHeaders);
    if (!authHeaders) {
      console.log('SEM AUTH')
      return response.status(401).json({ error: "Token is missing" });
    }
    //console.log('COM AUTH')
    const [, token] = authHeaders.split(" ");
    //console.log(token);
    verify(token, String(process.env.SECRET_JWT));
    const sub  = decode(token);
    if(sub!== null)
      request.body.usuarioId = sub.toString();
    return response.status(200).json(
      {"message":"OK","Token":true}
    );
    
  };
};