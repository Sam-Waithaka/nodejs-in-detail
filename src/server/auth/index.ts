import { Express } from "express";
import { AuthStore } from "./auth_types";
import { OrmAuthStore } from "./orm_authstore";


const store : AuthStore = new OrmAuthStore()

export const createAuth = (app: Express)=>{
    app.get('/signin', (req, res)=>{
        const data = {
            username: req.query['username'],
            password: req.query['password'],
            failed: req.query['failed'] ? true : false
        }
        res.render('signin', data)
    })

    app.post('/signin', async (req, res)=>{
        const username = req.body.username
        const password = req.body.password
        const valid = await store.validateCredentials(username, password)
        if (valid){
            res.redirect('/')
        } else {
            res.redirect(`/signin?username=${username}&password=${password}&failed=1`)
        }
    })
}