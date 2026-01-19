import { Express } from "express";

export const registerFormMiddleware = (app: Express) => {

}

export const registerFormRoutes = (app: Express) => {
    app.get('/form', (req, resp)=>{

        // console.log('Request Object',req)

        for (const key in req.query){
            resp.write(`${key}: ${req.query[key]} \n`)
        }
        resp.end()
    })
}