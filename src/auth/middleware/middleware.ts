// import { auth } from './lib/lucia/lucia';
// import { auth } from './lib/lucia';
// import { auth, Auth } from './lib/lucia';
import {defineMiddleware} from "astro:middleware";
import { auth } from '../lib/lucia';
import type { MiddlewareResponseHandler } from 'astro';
/**
 *
 */


// import type { MiddlewareResponseHandler } from 'astro';
// import {defineMiddleware} from "astro:middleware";


// export const onRequest: MiddlewareResponseHandler = async (context, next) => {


/*
export const onRequest 
    = defineMiddleware(async (context, next) => {
    context.locals.auth = auth.handleRequest(context);
    return await next();
});
*/

/*
export const onRequest: defineMiddleware = async (context, next) => {
    */
export const onRequest: MiddlewareResponseHandler = async (context, next) => {
    context.locals.auth = auth.handleRequest(context);
    return await next();
};
/*
console.log(auth);

export function onRequest(context, next){
    MiddlewareResponseHandler = async (context, next) => {
    context.locals.auth = auth.handleRequest(context);
    // return await next();
    return next();
}}
*/