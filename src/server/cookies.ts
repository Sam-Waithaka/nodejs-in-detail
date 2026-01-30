import { ServerResponse, IncomingMessage } from "http";
import { signCookie, validateCookie } from "./cookies_signed";

const setheaderName = 'Set-Cookie'
const cookieSecret = 'mysecret'

export const setCookie = (resp: ServerResponse, name: string, val: string)=>{
    
    const signedCookieVal = signCookie(val, cookieSecret)
    let cookieVal: any [] = [`${name}=${signedCookieVal}; Max-Age=300; SameSite=Strict`]

    if(resp.hasHeader(setheaderName)){
        cookieVal.push(resp.getHeader(setheaderName))
    }

    resp.setHeader('Set-Cookie', cookieVal)
}

export const setJsonCookie = (resp: ServerResponse, name: string, val: any)=>{
    setCookie(resp, name, JSON.stringify(val))
}

export const getCookie = (req: IncomingMessage, key: string): string | undefined =>{
    let result : string | undefined = undefined
    req.headersDistinct['cookie']?.forEach(header => {
        header.split(';').forEach(cookie => {
            const {name, val} =  /^(?<name>.*)=(?<val>.*)$/.exec(cookie)?.groups as any

            if (name.trim() === key){
                result = validateCookie(val, cookieSecret)
            }
        })  
    })
    return result
}

export const getJsonCookie = (req: IncomingMessage, key: string): any => {
    const cookie = getCookie(req, key)
    return cookie ? JSON.parse(cookie) : undefined
}