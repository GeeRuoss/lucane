import opentype from 'opentype.js';import{readFile,writeFile}from'node:fs/promises';
const bytes=await readFile('sources/manrope-source.ttf');const font=opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));font.variation.set({wght:800});
const path=font.getPath('lucane',0,100,110,{letterSpacing:-.055});const box=path.getBoundingBox();const height=box.y2-box.y1,width=box.x2-box.x1;
for(const [name,color] of [['logo','#191b20'],['logo-white','#ffffff'],['logo-blue','#172fc5']])await writeFile('assets/'+name+'.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.x1-1} ${box.y1-2} ${width+3} ${height+5}" role="img" aria-label="lucane"><path fill="${color}" d="${path.toPathData(3)}"/></svg>`);
console.log('Vector wordmarks exported',width,height);
