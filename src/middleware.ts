// import { auth } from './lib/lucia/lucia';
import { auth } from ''

// import type { MiddlewareResponseHandler } from 'astro';
// import {defineMiddleware} from "astro:middleware";


// export const onRequest: MiddlewareResponseHandler = async (context, next) => {

/*
export const onRequest: defineMiddleware = async (context, next) => {
    context.locals.auth = auth.handleRequest(context);
    return await next();
};
*/

export function onRequest(context, next){
    // defineMiddleware = async (context, next) => {
    context.locals.auth = auth.handleRequest(context);
    // return await next();
    return next();
}
