import opentype from 'opentype.js';import{readFile,writeFile}from'node:fs/promises';
const bytes=await readFile('sources/manrope-source.ttf');const font=opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));font.variation.set({wght:800});
// Raison sociale complète, demandée par le bureau le 12 novembre 2026. Les mots sont posés un à un pour garder un espace lisible malgré l’interlettrage serré.
const words=['bS','Lucane','sàrl'],size=110,gap=size*.25;let x=0,d='';const box={x1:Infinity,y1:Infinity,x2:-Infinity,y2:-Infinity};
for(const word of words){const path=font.getPath(word,x,100,size,{letterSpacing:-.055});const b=path.getBoundingBox();d+=path.toPathData(3);box.x1=Math.min(box.x1,b.x1);box.y1=Math.min(box.y1,b.y1);box.x2=Math.max(box.x2,b.x2);box.y2=Math.max(box.y2,b.y2);x=b.x2+gap;}
const height=box.y2-box.y1,width=box.x2-box.x1;
for(const [name,color] of [['logo','#191b20'],['logo-white','#ffffff'],['logo-blue','#2B74B7']])await writeFile('assets/'+name+'.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${(box.x1-1).toFixed(2)} ${(box.y1-2).toFixed(2)} ${(width+3).toFixed(2)} ${(height+5).toFixed(2)}" role="img" aria-label="${words.join(' ')}"><path fill="${color}" d="${d}"/></svg>`);
console.log('Vector wordmarks exported',width,height);
