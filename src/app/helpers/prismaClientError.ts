





/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";


export const handleZodError = (err: any):  TGenericErrorResponse => {
     const errorSources : TErrorSources[] = [];

     err.issues.forEach((issue: any) => {
          errorSources.push({
               path: issue.path[issue.path.length -1],
               message: issue.message
          })
     });

     return {
          statusCode: 400,
          message: "Zod Error",
          errorSources
     }
}



export const prismaP2002Error = (err: any):  TGenericErrorResponse => {
     const errorSources : TErrorSources[] = [];

     // if(err.code === 'P2002'){
     //      errorSources.push({
     //           path: err.meta.target,
     //           message: "Duplicate Key error"
     //      })
     // }

     // return {
     //      statusCode: 400,
     //      message: "Duplicate Key error",
     //      errorSources
     // }

     const duplicatedField = Array.isArray(err.meta?.target)
    ? err.meta.target.join(", ")
    : err.meta?.target || "unknown";

  errorSources.push({
    path: duplicatedField,
    message: `${duplicatedField} already exists`,
  });

  return {
    statusCode: 400,
    message: "Duplicate Key Error",
    errorSources,
  };
}