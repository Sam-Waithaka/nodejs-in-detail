import { Op, Sequelize } from "sequelize";
import { Session, SessionRepository } from "./repository";
import { SessionModel, initializeModel } from "./orm_models";
import { randomUUID } from "crypto";
import { ApiRepository, Result } from "../data/repository";
import { Calculation, Person, ResultModel } from "../data/orm_models";
import { fromOrmModel } from "../data/orm_helpers";

export class OrmRepository implements ApiRepository, SessionRepository {
    sequelize: Sequelize;
    constructor() {
        this.sequelize = new Sequelize({
            dialect: "sqlite",
             storage: "orm_sessions.db",
            logging: console.log,
            logQueryParameters: true
        });
        this.initModelAndDatabase();
    }
    update(r: Result): Promise<Result | undefined> {
        throw new Error("Method not implemented.");
    }
    saveResult(r: Result): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getAllResults(limit: number): Promise<Result[]> {
        throw new Error("Method not implemented.");
    }
    getResultsByName(name: string, limit: number): Promise<Result[]> {
        throw new Error("Method not implemented.");
    }


    async getResultById(id: number): Promise<Result | undefined>{
        const model = await ResultModel.findByPk(id, {
            include: [Person, Calculation]
        })

        return model ? fromOrmModel(model) : undefined
    }

    async delete(id: number): Promise<boolean> {
        const count = await ResultModel.destroy({where: {id}})
        return count == 1
    }
    async initModelAndDatabase() : Promise<void> {
        initializeModel(this.sequelize);
        await this.sequelize.drop();       
        await this.sequelize.sync();
    }
    async createSession(): Promise<Session> {
        return { id: randomUUID(), data: {} };
    }
    async getSession(id: string): Promise<Session | undefined> {
        const dbsession = await SessionModel.findOne({
            where: { id, expires: { [Op.gt] : new Date(Date.now()) }}
        });
        if (dbsession) {
            return { id, data: dbsession.data };
        }
    }
    async saveSession(session: Session, expires: Date): Promise<void> {
        await SessionModel.upsert({
            id: session.id,
            data: session.data,
            expires
        });
    }
    async touchSession(session: Session, expires: Date): Promise<void> {
        await SessionModel.update({ expires }, { where: { id: session.id } });
    }
}
