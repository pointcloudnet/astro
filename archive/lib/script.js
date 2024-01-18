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

// 'use strict';

import { buildUrl } from './buildUrl.js';
import { fetchCollection } from './fetchCollection.js';
import { server_url } from './srvrcfg.js';
// import { TabulatorFull as Tabulator } from './tabulator/tabulator.js'
import { TabulatorFull as Tabulator } from './tabulator/tabulator_esm.js'


let dz = document.querySelector('#dz-hyperlink');
let inStr;
var created;
let url;
let id;
let table;
let arr = [];

// function addBkmk(data,created){
function addBkmk(data, created){
    let timestamp = new Date(created).toISOString();
    // console.log('addBkmk:32:data',data,created,timestamp);
    // table.addData({id:data.r.insertedId,created:new Date(created).toISOString(),title:data.ttl?.[1],url:data?.url,nav:data.fav?.[1]},true);
    // console.log('addBkmk:35:data',data.ttl,data.fav);

    // table.addData({id:data.r.insertedId,created:timestamp,ttl:data.ttl?.[1],url:data?.url,fav:data.fav?.[1]},true);
    table.addData({id:data.r.insertedId,created:timestamp,ttl:data?.ttl,url:data?.url,fav:data?.fav},true);
}

function bldTable(a){
    table = new Tabulator("#example-table", {
        data: a,
        height: "80%"
        ,layout:"fitDataTable"
        ,pagination:true
        ,paginationSize:20
        ,responsiveLayout:true // enable responsive layouts
        ,width:"100%" //set the width on all columns to 200px
        ,columns:[ //set column definitions for imported table data
            {title:"id", field:"id",visible:false,responsive:1}
            ,{title:"created", field:"created",responsive:0,width:"auto"}
           ,{title:"Title", field:"ttl",responsive:0,width:"33%"}
            ,{title:"URL", field:"url",formatter:"link",formatterParams:{ target: "_blank" },responsive:0,width:"33%"}
            ,{title:"Fav", field:"fav",responsive:0,width:"33%"}
            // ,{title:"Fav", field:"fav",responsive:0,width:"33%"}
            // add three fields and modify one...
            //  change 'Fav' to show actual fav icon instead of link to favicon
            //  add edit/delete column
            //  add open in browser (X/y/z) column
            //  add page screenshot column
            //  add metadata column

    ]
            
    });
}
// function fetchDetails(url,created){
function fetchDetails(url, created){
    fetch(url)
        // Todo: replace response.json with TextDecode in a pipeline
        .then((response)=>response.json())
        // .then((data)=>{ return data });
        // .then((data)=>{console.log(data);addBkmk(data); localStorage.setItem('bkmk',JSON.stringify(data));});
        // .then((data)=>addBkmk(data, created));
        .then((data)=>{console.log(data);addBkmk(data,created);});
}

function writeFile(data){
    console.log('[Internet Shortcut]');
    console.log(data);
}


dz.addEventListener('drop',(ev)=>{
    ev.preventDefault();
    dz.textContent = '';
    inStr = ev.dataTransfer.getData('text');
    id = crypto.randomUUID();
    created = Date.now();
    url = buildUrl(`${server_url}?t=${inStr}&i=${id}&now=${created}`);
    fetchDetails(url, created);
    // addBkmk(fetchDetails(url));
    writeFile(url);
});

/*{k==='created' ? v = Date(v) : v }));}*/
fetchCollection(server_url,'bookmarks')
    .then(r=>{r.split('\n').forEach(d=>{
        if(d) arr.push(JSON.parse(d,(k,v)=>{ return k === 'created' ? new Date(v).toISOString() : v })) });
        return arr;
    })
    .then(r=>{ bldTable(r) });
    // .then(r=>{r.split('\n').forEach(d=>{ if(d) arr.push(JSON.parse(d,(k,v)=>{ console.log('k,v',k,v); return k === 'created' && !!v && parseInt(v).toString().length >= 8 ? new Date(v).toISOString() : v }))});
    //     return arr;
    // })

    // .then(r=>{r.split('\n').forEach(d=>{ if(d) arr.push(JSON.parse(d,(k,v)=>{ k === 'created' ? console.log(typeof v,v,new Date(v).toISOString()) : console.log('k,v',k,v); return k === 'created' ? new Date(v).toISOString() : v })) });
    //     console.log(arr);
    //     return arr;
    // })

