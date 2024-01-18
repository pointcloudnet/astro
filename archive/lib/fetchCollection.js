/**
 * drag and drop hyperlink / text logger
 * 
 * add records to bookmark database table
 * create bookmark hyperlink files from 
 * hyperlinks dropped into app
 * 
 * enable fetching favicon and 
 * page title from fetch call to url
 * 
 */

// 
'use strict';
import { buildUrl } from './buildUrl.js';
import { server_url } from './srvrcfg.js';

async function fetchCollection(url,coll){
    const u = buildUrl(`${server_url}?c=${coll}`);
    // let response, res_json;

    // fetch(buildUrl(`${server_url}?c=${coll}`)).then(r=>r.json()).then(r=>r);
/*
    let f = await fetch(u);
    let j = await f.text();
    return j;
*/
    return await fetch(u).then(r=>r.text());


    // res_json = await response.json();

    // return res_json;
    /*
        .then((r)=>r.json())
        .then((d)=>{ return d.body; });
    console.log('res_data:',res_data);
    return res_data;
    */
}

export { fetchCollection };
// console.log('collection:',fetchCollection(server_url,'bookmarks'));