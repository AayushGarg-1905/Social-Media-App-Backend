import { randomBytes, randomUUID } from "crypto";

export default class CommonUtils {

    public static getRandomBytes(){
        return randomBytes(6).toString('hex');
    }

    public static getRandomUUid(){
        return randomUUID();
    }
}