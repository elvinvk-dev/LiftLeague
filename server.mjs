import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const mime={'.html':'text/html','.css':'text/css','.mjs':'text/javascript','.js':'text/javascript','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)||!mime[path.extname(file)]){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',mime[path.extname(file)]);res.setHeader('X-Content-Type-Options','nosniff');res.end(await readFile(file));}catch{res.writeHead(404);res.end('Not found');}}).listen(Number(process.env.PORT || 4173),'127.0.0.1',()=>console.log('LiftLeague: http://localhost:4173'));

