import { ValidationRequirements, ValidationRule, WebServiceValidation } from "./validation_types";
import validator from "validator";

const intValidator: ValidationRule ={
    validation: [val => validator.isInt(val)],
    converter: (val) => Number.parseInt(val)
}

const partialResultValidator: ValidationRequirements ={
    name: [val => validator.isInt(val)],
    age: intValidator,
    years: intValidator
}

export const ResultWebServiceValidation: WebServiceValidation ={
    keyValidator: intValidator,
    store: partialResultValidator,

    replace: {
        ...partialResultValidator,
        nextage: intValidator
    }
}