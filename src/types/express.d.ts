import { Types } from "mongoose"

export {}

declare global {
  namespace Express {
    export interface Request {
      userId?: Types.ObjectId
    }
  }
}