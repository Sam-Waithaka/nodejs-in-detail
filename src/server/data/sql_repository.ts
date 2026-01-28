import { readFileSync } from "fs";
import { Database } from "sqlite3";
import { Repository, Result } from "./repository";

export class SqlRepository implements Repository {
    db: Database

    constructor(){
        this.db = new Database('age.db')
        this.db.exec(readFileSync('age.sql').toString(), err => {
            if (err != undefined) throw err
        })
    }

    saveResult(r: Result): Promise<number> {
        throw new Error('Method not implemented')
    }

    getAllResults(limit: number): Promise<Result[]> {
        throw new Error('Method not implemented')
    }

    getResultsByName(name: string, limit: number): Promise<Result[]> {
        throw new Error('Method not implemented')
    }
}