import mongoose from "mongoose";

export default class DatabaseService {
    constructor(){

    }
    public async addDbTransaction(){
        const session = await mongoose.startSession();
        session.startTransaction();
        return session;
    }
    public async handleTransaction<T>(session: mongoose.ClientSession, fn: () => Promise<T>): Promise<T> {
        try{
            const result = await fn();
            await session.commitTransaction();
            return result;
        } catch(error){
            await session.abortTransaction();
            throw error;
        } finally{
            session.endSession();
        }
    }
}