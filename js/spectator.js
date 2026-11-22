let btns = document.querySelectorAll('.button');
let content = document.querySelector('#content');
let styles = document.querySelectorAll('link[id]');
let facs = [1,2].map(int => {return `<img src="../images/spectator${int}.jpg"/>`});

btns.forEach(btn => {
   let id = btn.getAttribute('id');
   btn.addEventListener('click', e=> {
      e.preventDefault();
      
      if (btn.classList.contains('selected')){
          return;
      }
      content.style.visibility= 'hidden';
      content.style.opacity = 0;
      
      content.classList.remove('facs');
      btns.forEach(btn => {btn.classList.remove('selected')});
      btn.classList.add('selected');
      removeStyles(id);
      setTimeout(function(){
       if (btn.getAttribute('id') == 'facs'){
          content.innerHTML = '';
          content.classList.add('facs');
          content.innerHTML = `<div class="text">${facs.join('')}</div>`;
      } else {
         fetch('spectator_'+id+'.html')
        .then(response => {return response.text()})
        .then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, "text/html");
            content.innerHTML = '';
            content.appendChild(doc.querySelector('.text'));
            document.querySelectorAll('style').forEach(el =>{
               el.parentNode.removeChild(el); 
            });
            doc.querySelectorAll('style').forEach(el =>{
                document.querySelector('head').appendChild(el);
            });
            if (id == 'code'){
                hljs.highlightBlock(content.querySelector('pre code'));
            }

       })
   }
  content.style.visibility = 'visible'; 
  content.style.opacity = 1;
   }, 500)
   });
 });
 
 function removeOpacity(){
     content.style.opacity = 0;
 }
 
 function removeStyles(id){
       styles.forEach(style =>{
                let disabled = (style.getAttribute('id') !== 'style_' + id);
                style.disabled = disabled;
            })
 }

document.querySelector('#facs').click();