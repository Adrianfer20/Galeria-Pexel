//Funtions
const getDataPhotos = async (query, more) => {
    const API_KEY = '563492ad6f917000010000013896bce3679a4762811019b301914c7c';
    let page;
    if (more) {
        page = localStorage.getItem('page');
        localStorage.setItem("page", Number(1 * page + 1));
    }
    else {
        page = 1;
        localStorage.setItem("page", Number(page + 1));
    };
    try {
        const BASE_URL = 'https://api.pexels.com/v1/search?query=' + query + '&per_page=30&page=' + page;
        const response = await fetch(BASE_URL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: API_KEY
            }
        });
    
        const data = await response.json();
        return data.photos;
    } catch (error) {
        return {error:true, msg:error};
    }
}

//CRUD
const creatModal = (params) => {
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'fixed top-0 left-0 right-0 bottom-0 w-full h-screen flex items-center justify-center bg-black/70';

    const boxModal = document.createElement('div');
    boxModal.className = 'max-w-screen-sm h-52 md:h-72 relative flex flex-col bg-slate-100 text-slate-800 rounded-lg shadow-md py-6 pr-4';

    const titleModal = document.createElement('h2');
    titleModal.className = 'text-xl text-center font-bold sticky mb-4';
    titleModal.textContent = params.title;
    const boxparagraph = document.createElement('div');
    boxparagraph.className = 'overflow-y-scroll pl-6';

    params.paragraph.forEach(paragraph => {
        const p = document.createElement('p');
        p.className = 'mb-4';
        p.textContent = paragraph;
        boxparagraph.appendChild(p);
    });

    const button = document.createElement('button');
    button.id = 'btn-modalClose';
    button.className = 'absolute top-3 right-4 h-6 w-6 font-bold rounded-full bg-red-600 text-white text-center';
    button.textContent = 'X';


    boxModal.appendChild(titleModal);
    boxModal.appendChild(boxparagraph);
    modal.appendChild(button);
    modal.appendChild(boxModal);
    return modal;
}
const creatMsgCookies = (params) => {
    const boxMsg = document.createElement('div');
    boxMsg.id = 'msg-cookies';
    boxMsg.className = 'fixed left-0 md:left-4 bottom-0 md:bottom-2 right-0 md:right-4 flex flex-col items-center justify-center max-w-6xl w-full h-42 bg-slate-200 text-slate-800 md:rounded-md shadow-md p-6 mx-auto';
    boxMsg.innerHTML = `<h2 class="text-lg text-center font-bold uppercase mb-2">${params.title}</h2>
    <p class="mb-4">${params.msg}</p>
    <button id="btn-cookies" class="font-bold text-indigo-200 bg-indigo-800 rounded-md shadow-md py-1 px-4">ACEPTAR</button>`;
    return boxMsg;
}
const creatSpinner = () => {
    const boxspinner = document.createElement('div');
    boxspinner.id = 'box-spinner';
    boxspinner.className = 'adsolute  w-full flex items-center justify-center mx-auto';
    boxspinner.innerHTML = `<div class="spinner">
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
    <div class="rect4"></div>
    <div class="rect5"></div>
  </div>`;
  return boxspinner;
}
const updateBtnCategory = (btn) => {
    btn.classList.add('bg-indigo-800', 'text-indigo-200');
    btn.classList.remove('text-indigo-800', 'bg-transparent');

    const btnPrevius = document.querySelector("ul li.bg-indigo-800");
    btnPrevius.classList.remove('bg-indigo-800', 'text-indigo-200');
    btnPrevius.classList.add('text-indigo-800', 'bg-transparent');
    console.log(btn, btnPrevius);
}

//UI
const showGallery = async (more) => {
    const query = localStorage.getItem('categories') || 'all';
    const response = await getDataPhotos(query, more);
    if(response.error) return false;
    const framet = new DocumentFragment();
    response.forEach(photo => {
        const item = document.createElement('div');
        item.className = "flex justify-center relative mb-4";
        item.innerHTML = `
                <div class="absolute top-0 right-0 left-0 bottom-0 flex flex-col items-center justify-center bg-black/30 text-center cursor-pointer opacity-0 hover:opacity-100 transition delay-150 duration-300 ease-in-out">
                <p class="text-indigo-200 uppercase">autor</p>
                <h2 class="text-indigo-200 font-bold uppercase">${photo.photographer}</h2>
                
                </div>
                <img src="${photo.src.medium}" class="max-w-full block outline outline-offset-2 outline-2 outline-indigo-200 rounded-md cover-center" />
            
        `;

        framet.appendChild(item);
    });

    const mainGalery = document.getElementById("main-gallery");
    if (!more) mainGalery.innerHTML = '';
    mainGalery.appendChild(framet);
    document.querySelector('#box-spinner').remove();
    return true;
}

const showModal = (params) => {
    const modal = creatModal(params);
    const app = document.querySelector('body');
    app.appendChild(modal);
}

const showMsg = (params) => {
    const msgCookies = creatMsgCookies(params);
    document.querySelector('body').appendChild(msgCookies);
}
const showSpinner = () => {
    const spinner = creatSpinner();
    document.getElementById('main-gallery').appendChild(spinner);
}

//Events
window.addEventListener('DOMContentLoaded', async () => {
    localStorage.setItem('categories', 'all');
    const isShow = await showGallery();
    if (!isShow) {
        const params = {
            title: 'Error Al Cargar Las Imagenes',
            msg: 'En este sitio hacemos uso del internet; por favor verifique su conexion a internet.'
        }
        showMsg(params);
        return;
    }
    setTimeout(() => {
        const params = {
            title: 'Uso de Cookies',
            msg: 'En este sitio hacemos usos de las cookies porque nos permite hacer un mejor uso del rendimiento del dipositivo.'
        }
        showMsg(params);
    }, 5000);
});

window.addEventListener('click', async (e) => {
    const id = e.target.id;
    if (e.target.parentElement.id === 'btn-categories') {
        const btn = e.target;
        const isBtnActive = btn.classList.contains('bg-indigo-800');
        if (isBtnActive) return;
        updateBtnCategory(btn);
        const category = e.target.dataset.category;
        localStorage.setItem('categories', category);
        showGallery();
    }
    else if (id === 'btn-more') {
        showSpinner();
        const isShow = await showGallery(true);
        if (!isShow) {
            const params = {
                title: 'Error Al Cargar Las Imagenes',
                msg: 'En este sitio hacemos uso del internet; por favor verifique su conexion a internet.'
            }
            showMsg(params);
            return;
        }
    }
    else if (id === 'btn-sobreNosotros') {
        const paragraph = [
            'Este proyecto es realizado con intencion de demostrar los conocimientos aprendidos durante las clases dadas en telecomunicaciones, se nos brindo informaciòn; de que es un sitio web y como maquetar un sitio implementando las tecnologias requeridas como HTML, CSS y Javascript.',
            'La intencion dentro de este proyecto ò lo requisitos autos-impuestos por el grupo formado en clases. Es de realizar un sitio que hiciera uso de una API externa de imagenes que pudieramos mostrar como una especie de pinterest; espermos que las expectativas de este proyecto realizado sean cumplidas.',
            'El grupo de Telecomunicaciones del IUTIRLA extensiòn Maturin està conformado por Adrianfer Martinez, Xiorelis Azocar, Jose Quiaro y Oswaldo Ruiz. Contamos con la tutoria de nuestra profesora e ingeniera Maria Aguilera'];

        showModal({ title: 'Sobre Nosotros', paragraph });
    }
    else if (id === 'btn-politicaDeUso') {
        const paragraph = [
            'El propósito de una política de uso de Internet es definir lo que está permitido o no a la hora de utilizar la red y establecer conexiones en Internet, con el fin de que los trabajadores de la empresa y los colaboradores puedan realizar sus actividades en un entorno seguro y de calidad.',
            'A la hora de realizar una política para el uso de Internet debemos considerar el objetivo de las mismas que no es otro que es establecer las directrices y normas para establecer seguridad en todas las formas de uso, teniendo en cuenta la cultura de la compañía, sin perder de vista la estrategia del negocio, considerando siempre las necesidades de las partes interesadas y ofreciendo así a todos los clientes un servicio seguro y de calidad.',
            'Previa a la definición de los puntos a tener en cuenta a la hora de realizar la política, queda resaltar que dicha política impactará sobre toda la compañía, por lo que no puede ser tratada de forma aleatoria y aplicar solo a un ámbito de la empresa. La idea es promover una concienciación en toda la estructura de la compañía y facilitar el correcto desarrollo del trabajo con todas las partes interesadas.'];

        showModal({ title: 'Politicas de Uso', paragraph });
    }
    else if(id === 'btn-copyright') {
        const paragraph = [
            'El copyright representa los derechos de autor que se le conceden a los creadores de una obra literaria, tema musical o artículo científico, entre otras.',
            'Es la forma de atribuir la autoría a alguien que ha creado una obra, además de proporcionarle una serie de derechos como autor.',
            'Supone una forma de proteger esta obra para que pueda gestionar los derechos de su contenido su propio creador.',
            'Los derechos morales, y patrimoniales de una obra están recogidos en el copyright de una creación de estas características.'];

        showModal({ title: 'Copyright', paragraph });
    }
    else if (id === 'btn-modalClose') {
        document.getElementById('modal').remove();
    }
    else if (id === 'btn-cookies') {
        document.getElementById('msg-cookies').remove();
    }
});