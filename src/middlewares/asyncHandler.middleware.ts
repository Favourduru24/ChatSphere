import {Request, Response, NextFunction} from "express"

type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>

export const asyncHandler = (controller: AsyncHandler) => 
    async(req: Request, res: Response, next: NextFunction) => {
      try {
         await controller(req, res, next)
      } catch (error) {
          next(error)
      }
    }
