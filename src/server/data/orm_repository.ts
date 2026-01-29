import { Sequelize } from "sequelize";
import { Repository, Result } from "./repository";
import { addSeedData, defineRelationships, fromOrmModel, initializeModels } from "./orm_helpers";
import { Calculation, Person, ResultModel } from "./orm_models";

export class OrmRepository implements Repository {
    sequelize: Sequelize

    constructor(){
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'orm_age.db',
            logging: console.log,
            logQueryParameters: true
        })
        this.initModelAndDatabase()
    }
    async initModelAndDatabase(): Promise<void> {
        initializeModels(this.sequelize)
        defineRelationships()
        await this.sequelize.drop()
        await this.sequelize.sync()
        await addSeedData(this.sequelize)

    }

    async saveResult(r: Result): Promise<number> {
        throw new Error('Method not implemented')
    }

    async getAllResults(limit: number): Promise<Result[]> {
        throw new Error('Method not implemented')
    }

    async getResultsByName(name: string, limit: number): Promise<Result[]> {
        throw new Error('Method not implemented')
    }
}