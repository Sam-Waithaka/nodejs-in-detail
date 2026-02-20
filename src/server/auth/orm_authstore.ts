import { Sequelize } from "sequelize";
import { CredentialsModel, initalizeAuthModels } from "./orm_auth_models";
import { AuthStore, Credentials } from "./auth_types";
import { randomBytes, pbkdf2, timingSafeEqual } from "crypto";


export class OrmAuthStore implements AuthStore{
    sequelize: Sequelize

    constructor(){
        this.sequelize = new Sequelize({
            dialect: "sqlite",
            storage: 'orm_auth.db',
            logging: console.log,
            logQueryParameters: true
        })
        this.initModelAndDatabase()
    }

    async initModelAndDatabase(): Promise<void>{
        initalizeAuthModels(this.sequelize)
        await this.sequelize.drop()
        await this.sequelize.sync()
        await this.storeOrUpdateUser("alice", 'mysecret')
        await this.storeOrUpdateUser('bob', 'mysecret')
    }

    async getUser(name: string){
        return await CredentialsModel.findByPk(name)   
    }

    async storeOrUpdateUser(username: string, password: string){
        const salt = randomBytes(16)
        const hashedPassword = await this.createHashCode(password, salt)
        const [model] = await CredentialsModel.upsert({
            username, hashedPassword, salt
        })
        return model
    }

    async validateCredentials(username: string, password: string): Promise<boolean>{
        const storedCreds = await this.getUser(username)
        if (storedCreds){
            const candidateHash = await this.createHashCode(password, storedCreds.salt)
            return timingSafeEqual(candidateHash, storedCreds.hashedPassword)
        }
        return false
    }

    private createHashCode(password: string, salt: Buffer): Promise<Buffer>{
        return new Promise((resolve, reject)=>{
            pbkdf2(password, salt, 100_000, 64, 'sha512', (err, hash)=>{
                if(err){
                    reject(err)
                }
                resolve(hash)
            })
        })
    }
}