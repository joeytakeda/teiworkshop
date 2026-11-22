/* 
 * Script for creating annotator 
 * 
 */

const KEY = 'annotations';
let cache = [];
let anno;


window.onload = () => {

    if (localStorage.getItem(KEY)){
        cache = JSON.parse(localStorage.getItem(KEY));
    }
    let image = document.getElementById('image');
    anno = Annotorious.init({
        image: image,
        widgets: ['TAG'],
        formatter: Annotorious.ShapeLabelsFormatter()
      });
      // Update all of the annotations, if they're cached
      cache.forEach(a => {
         anno.addAnnotation(a);
      });
      let parent = image.parentElement;
      parent.style.display = 'block';
     let slider =  document.getElementById('img-size');
     let slideVal = document.getElementById('img-size-val');
     slider.addEventListener('change', e=> {
         let width = slider.value + '%';
         parent.style.width = slideVal.innerHTML = width;
     });

      anno.on('createAnnotation', addToCache);
      anno.on('deleteAnnotation', removeFromCache);
      anno.on('updateAnnotation', function(annotation, previous){
           removeFromCache(previous);
           addToCache(annotation);
      });

      document.getElementById('clear').addEventListener('click', e=> {
            anno.clearAnnotations();
            cache = [];
            updateStorage();
      });
 };
 
 function addToCache(ann){
     cache.push(ann);
     updateStorage();
 }
 
 function removeFromCache(ann){
     let idToRemove = ann.id;
     let index = cache.findIndex(a => a.id == idToRemove);
     if (index > -1){
         cache.splice(index, 1);
     }
     console.log(cache);
     updateStorage();
 }
 
 function updateStorage(){
     localStorage.setItem(KEY, JSON.stringify(cache));
 }

 
 