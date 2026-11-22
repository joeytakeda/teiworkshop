let RENDERING = false;
/* ACE editor stuff  */
let editor = ace.edit("editor");

editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/xml");
editor.session.setUseWrapMode(true);
editor.renderer.setOption('showPrintMargin', false);
editor.setOptions({
     fontSize: "14px" 
});

document.getElementById('reset').addEventListener('click', e=> {
   localStorage.removeItem('editor_doc'); 
   init(); 
});

editor.on('change', e=> {
    let value = editor.getValue();
    localStorage.setItem('editor_doc', value);
    if (!RENDERING){
        render();
    }
});


let ceteiDiv = document.getElementById('cetei');

window.addEventListener('load', init);

async function init(){
    let doc = await getDoc();
    editor.setValue(doc);
    render();
    addControls();

}

function addControls(){
    let inputs = document.querySelectorAll('#controls input');
    inputs.forEach(i => {
        i.addEventListener('change', e=>{
            document.body.classList.toggle(`no-${i.id}`, i.checked);
            console.log(i);
        });
    });


}


async function getDoc(){
    return new Promise(async (resolve, reject) => {
    if (localStorage.getItem('editor_doc')){
        return resolve(localStorage.getItem('editor_doc'));
    } else {
        let response = await fetch('xml/v01.0068.01.xml');
        let text = await response.text();
        return resolve(text);
    }
  });
    
}

function render(){
     let CETEIcean = new CETEI();
     ceteiDiv.innerHTML = '';
     RENDERING = true;
     CETEIcean.makeHTML5(editor.getValue(), (data) => {
        document.getElementById('cetei').appendChild(data);
        ceteiDiv.scrollTop = 0;
        RENDERING = false;
     });

}

            