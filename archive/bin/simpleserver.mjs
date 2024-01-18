#!/usr/bin/env /usr/local/bin/node

/**
 * ToDo Items
 * 1- modify top level event handler
 *  so promise rejection can be caught and handled
 * 2 - convert streams to TextDecode native streaming with .read()
 *   see Jake Archibald blog for excellent succinct elegant example
 *  3 - convert fav column to image and implement proper logic so that
 *      tabulator can fetch and present favicons: https://tabulator.info/docs/5.5/format#formatter-image
 * Test Cases
 * curl -v http://localhost:3000?t=https://github.com/mdn/dom-examples/tree/main/fetch
 * 
 * Regex Test Cases
 * 
 * /<\s?link\s+(?:[^>])+(?:(?:(?:href\s?=\s?["']{1}([^"']+)["']{1})(?:[^>])+(?:[rel]\s?=\s?["']{1}\s?(icon|shortcut icon)\s?["']{1}\s?))|(?:(?:[rel]\s?=\s?["']{1}\s?(icon|shortcut icon)\s?["']{1}\s?)(?:[^>])+(?:href\s?=\s?["']{1}([^"']+)["']{1}))){1}(?:[^>])+>/i
 * 
 * <link rel="icon" class="js-site-favicon" type="image/svg+xml" href="https://github.githubassets.com/favicons/favicon-dark.svg">
<link rel="alternate icon" class="js-site-favicon" type="image/png" href="https://github.githubassets.com/favicons/favicon-dark.png">
<link rel="icon" class="js-site-favicon" type="image/svg+xml" href="https://github.githubassets.com/favicons/favicon-dark.svg">
<link rel="alternate icon" class="js-site-favicon" type="image/png" href="https://github.githubassets.com/favicons/favicon-dark.png">
 */
'use strict';


import http from 'node:http';
import { Readable } from "node:stream";
import * as readline from "node:readline/promises";
import { db_coll } from '/workspaces/astro/src/lib/mongoclient.mjs';


// var fav, ttl, end, u = null;
var end, u = null;

const host = 'localhost';
const port = 3000;
const portstr = `:${port}`;
const scheme = 'http';
const hosturl = `${scheme}://${host}${portstr}`;
const server = http.createServer();

function parseObj(o){
    let jp = JSON.parse(o);
    let jpfav = jp.fav?.[0].split('><').filter(e=>e.match(/\s+(?:rel\s?=\s?["']\s?(?:shortcut\s+icon|icon)\s?["']){1}/i))[0]?.split(' ')?.filter(w=>w.match(/href\s?=\s?/i))?.[0].match(/href\s?=\s?["']\s?([^"']+)/i)[1];

    jp.fav = jpfav;
    jp.ttl = jp.ttl?.[1];
    // console.log('simpleserver:parseObj:48:obj:',o);
    // console.log('simpleserver:parseObj:49:jp:',jp);
    return jp;
}
function endStream(src,res,obj){
    // console.log('endStream:53:obj',src,obj);
    return res.end(JSON.stringify(obj));
    // return;
}

// todo:  simplify document by inserting post-process rather than pre-process
async function insertBookmark(obj,res){
    let result = await db_coll.insertOne({created:obj.created,url:obj.url,fav:obj.fav,ttl:obj.ttl});
    // console.log(result,result.acknowledged,result.insertedId);
    let o = parseObj(JSON.stringify({r:result,created:obj.created,url:obj.url,fav:obj.fav,ttl:obj.ttl}))
    endStream('src=insert bookmark',res,o);
}
async function saveURLToFile(url, created, res) {
    // let fav, ttl, result;
    let fav, ttl;

    try {
        const response = await fetch(url);
        let rl = readline.createInterface({input:Readable.fromWeb(response.body),crlfDelay:Infinity});
        rl.on('line',(l)=>{
            console.log('simpleserver:74:SaveURLToFile:rl.on:line:',l);
            // TODO: update logic to append rather than replace with null
            // TODO: to accomodate manifest and other forms of json responses from github a la:
            //   https://github.com/remix-run/remix/tree/main/packages/remix-dev/vite
            fav ??= l.match(/<\s?link\s+(?:.*)((?:[rel]\s?=\s?["'](shortcut icon|alternate icon|icon).*href.*)|(?:href.*[rel]\s?=\s?["'](shortcut icon|alternate icon|icon)).*)>/i);
            ttl ??= l.match(/<\s?title\s?.*>{1}(.*)<\s?\/\s?title\s?>{1}/i);
            end ??= l.match(/<\s?\/\s?head\s?>/i);
            console.log('simpleserver:76:saveURLToFile:',created,url,fav,ttl);
            if(end){
                console.log('simpleserver:78:end:',created,url,fav,ttl);
                // todo: modify top level event handler
                //  so promise rejection can be caught and handled
                insertBookmark({created:created,url:url,fav:fav,ttl:ttl},res);
            // console.log('simpleserver:67:saveURLToFile:',{created:created,url:url,fav:fav,ttl:ttl});

                /*
                db_coll.insertOne({created:created,url:url,fav:fav,ttl:ttl}).then(r=>{
                    console.log('simpleserver:71:saveURLToFile:',r,created,url,fav,ttl);
                    endStream(rl,res,parseObj(JSON.stringify({r:r,created:created,url:url,fav:fav,ttl:ttl})));
                });
                */
                // let r = Promise.resolve(db_coll.insertOne({created:created,url:url,fav:fav,ttl:ttl})).then((r)=>{ return r; });
                // result = insertBookmark({created:created,url:url,fav:fav,ttl:ttl},res).then((r)=>{ return r; });
                // console.log('simpleserver:saveURLToFile:86:result',result);
                // console.log('simpleserver:saveURLToFile:87:result',result.then((r)=>{ return r; }));
                    // console.log('simpleserver:71:saveURLToFile:',r.then((r)=>r),created,url,fav,ttl);
                    // endStream(result,rl,res,parseObj(JSON.stringify({r:result,created:created,url:url,fav:fav,ttl:ttl})));



                rl.close();
                fav = null;
                ttl = null;
                created = null;
                end = null;
                rl = null;
            } 
        });
        // Input "stopped" (paused), but did not receive EOF 
        rl.on('pause',()=>{
            console.log('simpleserver:109:saveURLToFile:pause:',created,url,fav,ttl);
            if(!end){
                console.log('simpleserver:111:pause:NOTend:',created,url,fav,ttl);

            // console.log('simpleserver:84:saveURLToFile:',{created:created,url:url,fav:fav,ttl:ttl});

/*
                db_coll.insertOne({created:created,url:url,fav:fav,ttl:ttl}).then(r=>{
                    // console.log('simpleserver:88:saveURLToFile:',dr,created,url,fav,ttl);
                    endStream('src=!end',rl,res,parseObj(JSON.stringify({r:r,created:created,url:url,fav:fav,ttl:ttl})));
                });
*/
                console.log(created,url,fav,ttl);
                insertBookmark({created:created,url:url,fav:fav,ttl:ttl},res);

                rl.close();
                fav = null;
                ttl = null;
                end = null;
                created = null;
                rl = null;
            }
        });
        rl.on('close',()=>{
            if(rl) rl.close();
            fav = null;
            ttl = null;
            end = null;
            created = null;
            rl = null;
        });
    } catch (err) {
        console.error(err);
    }
}


server.listen(port);
server.on('request',async (req, res)=>{
    u = new URL(hosturl + req.url)
    res.writeHead(200, { 'Content-Type': 'application/json', 'access-control-allow-origin': '*' });
    
    if(u.searchParams.has('t')){
        let url = u.searchParams.get('t');

        /* '+' coerce to Number */
        let created = +u.searchParams.get('now');  
        // console.log('simpleserver:107:created:',created);
        // await saveURLToFile(u.searchParams.get('t'), res);
        await saveURLToFile(url, created, res);
    }
    if(u.searchParams.has('c')){
        // db_coll.find().map(t=>JSON.stringify(t)).stream().pipe(process.stdout.write());
        // const c = await db_coll.find().stream(JSON.stringify(this));
        const c = await db_coll.find().stream();
        let obj;
        let id,created,url,ttl,fav;
        c.on('data',d=>{
            id = d._id.toString();
            created = d.created;
            ttl = d.ttl;
            url = d.url;
            fav ??= d.fav?.toString().match(/<\s?link\s+(?:.*)((?:[rel]\s?=\s?["'](shortcut icon|alternate icon|icon).*href.*)|(?:href.*[rel]\s?=\s?["'](shortcut icon|alternate icon|icon)).*)>/i);
            
            obj = JSON.stringify(parseObj(JSON.stringify({id,created,ttl,url,fav})))+'\n';
            // console.log(obj);
            res.write(obj);
            obj = null;
            id = null;
            created = null;
            url = null;
            ttl = null;
            fav = null;

        });
        c.on('end',()=>res.end('\n'));
    }
});
