import express, { Express } from "express";

export const registerFormMiddleware = (app: Express) => {
    app.use(express.urlencoded({extended: true}))
}

export const registerFormRoutes = (app: Express) => {
    app.get('/form', (req, resp)=>{

        // console.log('Request Object',req)

        for (const key in req.query){
            resp.write(`${key}: ${req.query[key]} \n`)
        }
        resp.end()
    })

    app.post('/form', (req, res)=>{
        res.write(`Content-Type: ${req.headers['content-type']} \n`)
        for (const key in req.body){
            res.write(`${key}: ${req.body[key]}\n`)
        }
        // req.pipe(res)
        res.end()
    })
}