import { DataTypes, Sequelize } from "sequelize";
import { Calculation, Person, ResultModel } from "./orm_models";


const primaryKey = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
}

export const initializeModels = (sequelize: Sequelize) =>{
    Person.init({
        ...primaryKey,
        name: { type: DataTypes.STRING }
    }, { sequelize })

    Calculation.init({
        ...primaryKey,
        age: { type: DataTypes.INTEGER},
        years: { type: DataTypes.INTEGER},
        nextage: { type: DataTypes.INTEGER},
    }, { sequelize })

    ResultModel.init({
        ...primaryKey,
    }, { sequelize })
}
