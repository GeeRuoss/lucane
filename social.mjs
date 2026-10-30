import opentype from 'opentype.js';
import {readFile} from 'node:fs/promises';
import sharp from 'sharp';

const bytes = await readFile('sources/manrope-source.ttf');
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
font.variation.set({wght: 700});
// Garder les coordonnées calculées : le sérialiseur de cette version produit des NaN.
const coordinates = {M: ['x','y'], L: ['x','y'], Q: ['x1','y1','x','y'], C: ['x1','y1','x2','y2','x','y'], Z: []};
const text = (value, x, y, size, color) => {
  const commands = font.getPath(value, x, y, size, {letterSpacing: -.05}).commands;
  const path = commands.map(command => command.type + coordinates[command.type].map(key => command[key].toFixed(2)).join(' ')).join('');
  return `<path fill="${color}" d="${path}"/>`;
};
const poster = (await sharp('assets/accueil-acoustique-v6.webp').png().toBuffer()).toString('base64');
const scene = `<image x="565" y="0" width="620" height="620" href="data:image/png;base64,${poster}"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f5f5f2"/>${text('lucane',55,105,64,'#191b20')}${text('Moins de bruit.',55,270,64,'#191b20')}${text('Plus de confort.',55,350,64,'#172fc5')}${text('Bureau d’étude acoustique',58,495,25,'#191b20')}${scene}</svg>`;
await sharp(Buffer.from(svg)).png().toFile('assets/partage-lucane-v6.png');
