import opentype from 'opentype.js';import{readFile,writeFile}from'node:fs/promises';import sharp from 'sharp';
const bytes=await readFile('sources/manrope-source.ttf');const font=opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));font.variation.set({wght:800});
const text=(t,x,y,size,color)=>`<path fill="${color}" d="${font.getPath(t,x,y,size,{letterSpacing:-.05}).toPathData(2)}"/>`;
const poster=(await sharp('assets/scene-abstract.webp').png().toBuffer()).toString('base64');
const wave=`<image x="600" y="75" width="570" height="510" href="data:image/png;base64,${poster}"/>`;
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f5f5f2"/>${text('lucane',55,105,64,'#191b20')}${text('Moins de bruit.',55,270,70,'#191b20')}${text('Plus de confort.',55,355,70,'#172fc5')}${text('Bureau d’étude acoustique',58,495,25,'#191b20')}${wave}</svg>`;
await writeFile('assets/partage-lucane-v3.svg',svg);await sharp(Buffer.from(svg)).png().toFile('assets/partage-lucane-v3.png');
