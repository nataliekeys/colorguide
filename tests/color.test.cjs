const {test}=require('node:test');const assert=require('node:assert/strict');
const {classifyHex,rgbToHsl,rgbToHex,sampleColor}=require('../content/color.js');
const cases={
 '#000000':'Black','#ffffff':'White','#808080':'Gray','#303030':'Dark Gray','#d0d0d0':'Light Gray',
 '#818080':'Gray','#92866b':'Brown','#8c8068':'Brown','#d2b48c':'Light Brown','#804000':'Brown',
 '#402000':'Dark Brown','#ff8800':'Orange','#ffa500':'Orange','#ff0000':'Red','#800000':'Dark Red',
 '#ffc0cb':'Light Pink','#ff00ff':'Pink','#ffff00':'Yellow','#808000':'Olive','#bdb76b':'Light Olive',
 '#00ff00':'Green','#008000':'Dark Green','#008080':'Dark Teal','#00ffff':'Teal','#0000ff':'Blue',
 '#000080':'Dark Blue','#8000ff':'Purple','#c8b1db':'Light Purple','#b0e0e6':'Light Teal'
};
for(const [hex,name] of Object.entries(cases))test(`${hex} → ${name}`,()=>assert.equal(classifyHex(hex),name));
test('short hex and RGB conversion',()=>{assert.equal(classifyHex('#f00'),'Red');assert.deepEqual(rgbToHsl(255,0,0),[0,100,50]);assert.equal(rgbToHex(255,0,128),'#FF0080')});
test('reject invalid input',()=>{for(const v of ['red','#12','#gggggg',null])assert.throws(()=>classifyHex(v),TypeError);assert.throws(()=>rgbToHsl(NaN,0,0),TypeError)});
test('all grayscale levels remain neutral',()=>{for(let i=0;i<256;i++)assert.match(classifyHex(rgbToHex(i,i,i)),/^(Black|White|(?:Dark |Light )?Gray)$/)});
test('sample voting and transparent pixels',()=>{const ctx={canvas:{width:2,height:2},getImageData:()=>({data:Uint8ClampedArray.from([255,0,0,255,255,0,0,255,0,0,255,255,0,0,0,0])})};assert.equal(sampleColor(ctx,0,0),'Red')});
test('edges sample only valid canvas pixels',()=>{for(const [x,y] of [[0,0],[9,9],[-1,-1],[20,20]]){let box;const ctx={canvas:{width:10,height:10},getImageData:(...b)=>{box=b;return {data:Uint8ClampedArray.from([146,134,107,255])}}};assert.equal(sampleColor(ctx,x,y),'Brown');assert.ok(box[0]>=0&&box[1]>=0&&box[0]+box[2]<=10&&box[1]+box[3]<=10)}});
test('tie favors clicked pixel',()=>{const ctx={canvas:{width:2,height:1},getImageData:()=>({data:Uint8ClampedArray.from([255,0,0,255,0,0,255,255])})};assert.equal(sampleColor(ctx,1,0),'Blue')});
test('transparent/empty samples are unknown',()=>{assert.equal(sampleColor({canvas:{width:0,height:0}},0,0),'Unknown');assert.equal(sampleColor({canvas:{width:1,height:1},getImageData:()=>({data:new Uint8ClampedArray(4)})},0,0),'Unknown')});
const {classifyHexDetailed, classifyRgb, formatLabel, sampleColorDetailed}=require('../content/color.js');
test('reported brown/orange ambiguity offers an optional second name',()=>{const r=classifyRgb(192,128,64);assert.equal(r.primary,'Brown');assert.equal(r.secondary,'Orange');assert.ok(r.confidence<.8);assert.equal(formatLabel(r),'Brown / Orange');assert.equal(formatLabel(r,false),'Brown')});
test('reported pale samples use cream, with white near the boundary',()=>{const r=classifyRgb(245,240,230);assert.equal(r.primary,'Cream');assert.equal(r.secondary,'White');assert.equal(classifyRgb(240,232,216).primary,'Cream')});
test('clear orange needs no alternative',()=>{const r=classifyHexDetailed('#ff8800');assert.equal(r.secondary,null);assert.ok(r.confidence>=.8)});
test('scores are bounded and alternatives never duplicate primary',()=>{for(let r=0;r<256;r+=17)for(let g=0;g<256;g+=17)for(let b=0;b<256;b+=17){const v=classifyRgb(r,g,b);assert.ok(v.confidence>=0&&v.confidence<=1);assert.notEqual(v.secondary,v.primary)}});
test('uniform ambiguous screenshot still returns alternative',()=>{const ctx={canvas:{width:1,height:1},getImageData:()=>({data:Uint8ClampedArray.from([192,128,64,255])})};assert.equal(formatLabel(sampleColorDetailed(ctx,0,0)),'Brown / Orange')});
test('mixed screenshot reports competing pixel color',()=>{const ctx={canvas:{width:2,height:1},getImageData:()=>({data:Uint8ClampedArray.from([255,0,0,255,0,0,255,255])})};const r=sampleColorDetailed(ctx,0,0);assert.equal(r.primary,'Red');assert.equal(r.secondary,'Blue');assert.ok(r.confidence<.8)});
