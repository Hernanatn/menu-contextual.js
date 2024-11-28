

class OpcionMenu extends HTMLElement{
    constructor(){
        super();
        this._internals = this.attachInternals();
    }

    connectedCallback(){
                
        let boton;
        var iComando = document.createElement("i")
        if (this.hasAttribute('sub-menu')){
            boton = document.createElement('div');
            iComando = document.createElement('span');
            iComando.classList.add('material-symbols-outlined');
            iComando.append("expand_circle_right");
            this.addEventListener("mouseenter", ()=>{
                htmx.removeClass(htmx.find(this,"menu-contextual"),"oculto");
            })
            this.addEventListener("mouseleave", ()=>{
                htmx.addClass(htmx.find(this,"menu-contextual"),"oculto");
            })
        }
        else if (!( this.hasAttribute('hx-get')
            || this.hasAttribute('hx-put')  
            || this.hasAttribute('hx-post') 
            || this.hasAttribute('hx-patch')
            || this.hasAttribute('hx-delete')
            || this.hasAttribute('hx-on:click')
            || this.hasAttribute('href')
        )){
            boton = document.createElement('button');
            const evento = this.getAttribute('evento') || 'click';
            const funcion = eval(this.getAttribute('funcion'));
            
            if (this.hasAttribute('comando')){
                iComando = document.createElement('i');
                iComando.innerHTML = `Shift+${this.getAttribute('comando')}`
                document.addEventListener(
                    'keyup',
                    (e)=>{
                        if(e.shiftKey && e.key.toUpperCase() == this.getAttribute('comando').toUpperCase()){
                            funcion(e)
                        }
                    }
                )

            }
            boton.addEventListener(evento,funcion);
        }else if(this.hasAttribute('href')){
            boton = document.createElement('a');
            boton.setAttribute('href',this.getAttribute('href'))
        }else{
            boton = document.createElement('div');
        }
        const pNombre = document.createElement('p');
        if (this.hasAttribute('icono')){
            const spanIcono = document.createElement('span');
            spanIcono.classList.add('material-symbols-outlined');
            spanIcono.append(this.getAttribute('icono'));
            pNombre.appendChild(spanIcono);
        }
        pNombre.append(this.getAttribute('nombre'));
        boton.appendChild(pNombre);
        boton.appendChild(iComando);

        
        this.appendChild(boton);
    }
}

class MenuContextual extends HTMLElement{
    
    static observedAttributes = ["size"];

    constructor(){
        super();
        this._internals = this.attachInternals();
    }

    connectedCallback() {

        this.classList.add('oculto');  

        const titulo = document.createElement('i');
        titulo.innerHTML=`${this.getAttribute('titulo') || ''}`;
        this.appendChild(titulo);

        document.addEventListener('click', e => {
            document.querySelectorAll('menu-contextual').forEach(
                e => {
                    e.classList.add('oculto');
                }
            );
        });
        

        if(this.parentElement.hasAttribute('sub-menu') || this.hasAttribute("sub-menu")){
            this.style.left="calc( 100% + 1em )"
        }

        this.parentElement.addEventListener('contextmenu', (e) => { 
            e.preventDefault();
            document.querySelectorAll('menu-contextual').forEach(
                e => {
                    e.classList.add('oculto');
                }
            );
            var horizontal = "left";
            var vertical = "top";
            const root = document.querySelector(":root");
            const mouseX = root.style.getPropertyValue('--mouse-x');
            const mouseY = root.style.getPropertyValue('--mouse-y');
            
            let correccionPadreX=0
            let correccionPadreY=0
            if(this.hasAttribute('relativo')){        
                correccionPadreY-=this.parentElement.offsetTop;
                correccionPadreX-=this.parentElement.offsetLeft;
            }
            let scrollY = window.scrollY;
            let scrollX = window.scrollX;

            if(this.getAttribute('modal')){        
                scrollY = 0;
                scrollX = 0;
            }

  
            if ((mouseX - scrollX) < window.innerWidth*.4) { this.style.left = `${(mouseX)*1+ correccionPadreX}px`;} else
            if (window.innerWidth*.4 <= (mouseX - scrollX) && (mouseX - scrollX) < window.innerWidth*.6) { horizontal = "center"; this.style.left = `${(mouseX - this.offsetWidth/2)*1+ correccionPadreX}px`;} else 
            { horizontal = "right"; this.style.left = `${(mouseX - this.offsetWidth)*1+ correccionPadreX}px`; }
              

            if ((mouseY - scrollY) < window.innerHeight*.45) { this.style.top = `${(mouseY - document.querySelector("header").offsetHeight)*1+ correccionPadreY}px`;} else
            if (window.innerHeight*.45 <= (mouseY - scrollY) && (mouseY - scrollY) < window.innerHeight*.6) { vertical = "center"; this.style.top = `${(mouseY - document.querySelector("header").offsetHeight - this.offsetHeight/3)*1+ correccionPadreY}px`;} else 
            if (window.innerHeight*.6 <= (mouseY - scrollY) && (mouseY - scrollY) < window.innerHeight*.7) { vertical = "center"; this.style.top = `${(mouseY - document.querySelector("header").offsetHeight - this.offsetHeight/2)*1+ correccionPadreY}px`;} else 
            if (window.innerHeight*.7 <= (mouseY - scrollY) && (mouseY - scrollY) < window.innerHeight*.85) { vertical = "center"; this.style.top = `${(mouseY - document.querySelector("header").offsetHeight - this.offsetHeight/1.5)*1+ correccionPadreY}px`;} else 
            { vertical = "bottom"; this.style.top = `${(mouseY - document.querySelector("header").offsetHeight - this.offsetHeight)*1+ correccionPadreY}px`; }
            this.style.transformOrigin = `${vertical} ${horizontal}`;
            this.classList.remove('oculto');
            e.stopPropagation();
        })


        /*for (const [nombre, funciones] of Object.entries(opciones)) {
            if ((nombre.includes('separador'))){
                const separador = document.createElement('hr');
                this.elemento.appendChild(separador);
                continue;
            }
            const opcion = document.createElement('div');
            opcion.classList.add('opcion-menu')
            const boton = document.createElement('button');
            const pNombre = document.createElement('p');
            pNombre.innerHTML = nombre;
            iComando = document.createElement('i');
            boton.appendChild(pNombre);
            for (const [evento,[funcion,comando]] of Object.entries(funciones)){
                boton.addEventListener(evento,funcion);
                if (comando){
                    iComando.innerHTML = `Shift+${comando}`
                    document.addEventListener(
                        'keyup',
                        (e)=>{
                            if(e.shiftKey && e.key.toUpperCase() == comando){
                                funcion(e)
                            }
                        }
                    )
                }
            }
            this.elemento.appendChild(opcion);
            opcion.appendChild(boton);

          }*/

    }
    
    disconnectedCallback() {
    }
      
    adoptedCallback() {
    }
    
    attributeChangedCallback(atributo, valorViejo, nuevoValor) {
      }
    
      inicializar(opciones){

      }
}

window.customElements.define('menu-contextual',MenuContextual)
window.customElements.define('opcion-menu',OpcionMenu)

window.addEventListener("popstate",
    e => {
        console.log("movido",e)
        document.querySelectorAll("opcion-menu").forEach(
            o => {
                const largo = o.children.length 
                if (largo <= 1) {return}
                for (let i = 0; i < largo; i++) {
                    console.log("l: ",largo, o.children.length)
                    console.log("i: ",i)
                    console.log("c: ",o.children[0])
                    o.children[0].remove();
                }
            }
        )
    }
)
