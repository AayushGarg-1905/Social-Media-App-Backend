import * as crypto from 'crypto'

export default class EncryptionService{
    constructor(){

    }

    hash(data:string, algo:string){
        const hash = crypto.createHash(algo);
        hash.update(data,'utf-8');
        const hashedData = hash.digest('hex');
        return hashedData
    }

    md5Hash(data:string){
        return this.hash(data,'md5');
    }
}