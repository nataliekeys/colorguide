(() => {
 const hex=document.querySelector('#hex'),picker=document.querySelector('#picker');
 function render(value){try{const name=ColorGuide.classifyHex(value);document.querySelector('#result').textContent=name;document.querySelector('#sample').style.background=value;document.querySelector('#value').textContent=value;hex.value=value;if(value.length===7)picker.value=value;}catch{document.querySelector('#result').textContent='Enter a valid hex color.';}}
 document.querySelector('#color-form').addEventListener('submit',e=>{e.preventDefault();render(hex.value)});
 picker.addEventListener('input',()=>render(picker.value));
 for(const value of ['#92866b','#d2b48c','#804000','#ff8800','#808000','#bdb76b','#818080','#ffc0cb','#000080','#c8b1db','#b0e0e6']){
 const button=document.createElement('button');button.type='button';button.className='fixture';
 const chip=document.createElement('span');chip.className='chip';chip.style.background=value;chip.setAttribute('aria-hidden','true');
 const label=document.createElement('span');label.textContent=ColorGuide.classifyHex(value);
 const code=document.createElement('small');code.textContent=value;button.append(chip,label,code);button.addEventListener('click',()=>render(value));document.querySelector('#fixtures').append(button);
 }render(hex.value);
})();
