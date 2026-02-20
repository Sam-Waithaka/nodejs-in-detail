import { Express } from "express";
import { AuthStore } from "./auth_types";
import { OrmAuthStore } from "./orm_authstore";


const store : AuthStore = new OrmAuthStore()

type User = {username: string}
declare module 'express-session'{
    interface SessionData {username: string}
}

declare global{
    module Express {
        interface Request {user: User, authenticated: boolean}
    }
}


export const createAuth = (app: Express)=>{

    app.use((req, res, next)=>{
        const username = req.session.username

        if(username){
            req.authenticated = true
            req.user = {username}
        } else {
            req.authenticated = false
        }
        res.locals.user = req.user
        res.locals.authenticated = req.authenticated
        next()
    })

    app.get('/signin', (req, res)=>{
        const data = {
            username: req.query['username'],
            password: req.query['password'],
            failed: req.query['failed'] ? true : false,
            signinpage: true
        }
        res.render('signin', data)
    })

    app.post('/signin', async (req, res)=>{
        const username = req.body.username
        const password = req.body.password
        const valid = await store.validateCredentials(username, password)
        if (valid){
            req.session.username = username
            res.redirect('/')
        } else {
            res.redirect(`/signin?username=${username}&password=${password}&failed=1`)
        }
    })

    app.post('/signout', async (req, res)=>{
        req.session.destroy(()=>{
            res.redirect('/')
        })
    })
}