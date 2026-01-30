import { ServerResponse } from "http";

const setheaderName = 'Set-Cookie'

export const setCookie = (resp: ServerResponse, name: string, val: string)=>{
    let cookieVal: any [] = [`${name}=${val}; Max-Age=300; SameSite=Strict`]

    if(resp.hasHeader(setheaderName)){
        cookieVal.push(resp.getHeader(setheaderName))
    }

    resp.setHeader('Set-Cookie', cookieVal)
}

export const setJsonCookie = (resp: ServerResponse, name: string, val: any)=>{
    setCookie(resp, name, JSON.stringify(val))
}