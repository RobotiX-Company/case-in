/*// Read files
function readFile(input) {
    let file = input.files[0];

    let reader = new FileReader();

    reader.readAsText(file, 'windows-1251');

    reader.onload = function() {
        console.log(reader.result);
        let type = 'data:application/javascript;base64, ';
        let text = escape(reader.result);
        alert(unescape(text));
        let base = btoa(text); //unescape(atob(btoa(escape(reader.result))));
        document.getElementById('test').href = type + base;
    };

    reader.onerror = function() {
        console.log(reader.error);
    };
}

function readFile1(input) {
    let file = input.files[0];

    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function() {
        document.getElementById('test1').src = reader.result;
    };

    reader.onerror = function() {
        console.log(reader.error);
    };
}*/

// activate elements
window.activeSlide = 0;

function clickOnSlider(slideContentTag) {
    if (window.code != window.lastCode) {
        window.lastCode = window.code;
        return;
    }
    for (let i = 0; i < slideContentTag.children.length; i++) {
        slideContentTag.children[i].classList.remove('clicked')
    }
}

function clickOnElement(element) {
    let slideContentTag = element.parentElement;
    for (let i = 0; i < slideContentTag.children.length; i++) {
        slideContentTag.children[i].classList.remove('clicked')
    }
    element.classList.add('clicked')
    window.activeElement = element;
    document.getElementById('elementWidth').value = element.style.width;
    document.getElementById('elementHeight').value = element.style.height;
    window.code = Math.random();
}

//events
document.getElementById('move').addEventListener('click', enableMoveElements);
document.getElementById('changeSize').addEventListener('click', resizeElement);
document.getElementById('elementHeight').addEventListener('change', changeHeight);
document.getElementById('elementWidth').addEventListener('change', changeWidth);
document.getElementById('addText').addEventListener('click', allowAddText);
document.getElementById('changeFontSettings').addEventListener('click', setFontSettings);
document.getElementById('changeFontSize').addEventListener('click', setFontSettings);
document.getElementById('changeFontColor').addEventListener('click', setFontSettings);
document.getElementById('changeBold').addEventListener('click', setFontSettings);
document.getElementById('underlineText').addEventListener('click', setFontSettings);
document.getElementById('throughText').addEventListener('click', setFontSettings);
document.getElementById('img').addEventListener('click', openDialog);
document.getElementById('video').addEventListener('click', openDialog);
document.getElementById('audio').addEventListener('click', openDialog);
document.getElementById('newSlaid').addEventListener('click', newSlide);
document.getElementsByClassName('dialog-container')[0].addEventListener('change', uploadImage);
document.getElementById('js').addEventListener('click', saveAsJs);
document.getElementsByClassName('upload-presentation')[0].addEventListener('change', openJSON);
document.getElementById('redactor').addEventListener('click', function () {
    document.getElementsByClassName('dialog-container')[2].style.display = 'flex';
});
document.documentElement.setAttribute('onkeyup', 'keyUp(event)');
document.getElementById('cancel').addEventListener('click', closeDialog);
document.getElementById('cancelSave').addEventListener('click', closeDialog);
document.getElementById('cancelOpen').addEventListener('click', closeDialog);

//tools functions
window.Tools = {
    draggable: enableMoveElements,
    resizeElement: resizeElement,
    addText: allowAddText,
    fontSettings: setFontSettings
}
window.tools = {};
window.tools.draggable = true;

function clickOnTool(element, method) {
    let toolsNames = Object.keys(window.tools);
    for (let i = 0; i < toolsNames.length; i++) {
        if (window.tools[toolsNames[i]]) {
            window.Tools[toolsNames[i]](true);
        }
    }
    let toolsTags = document.getElementsByClassName("tool");
    for (let i = 0; i < toolsTags.length; i++) {
        let item = toolsTags[i];
        item.classList.remove('clicked-tool')
    }
    element.classList[method]('clicked-tool');
}

function enableMoveElements(flag) {
    let draggable = window.tools.draggable;
    let method = window.tools.draggable ? 'disable' : 'enable';
    if (flag == true) {}
    else {
        clickOnTool(document.getElementById('move'), window.tools.draggable ? 'remove' : 'add')
    }
    $( ".draggable" ).draggable({containment:".slide"});
    $( ".draggable" ).draggable(method);
    window.tools.draggable = draggable ? false : true;
}

function resizeElement(flag) {
    window.tools.resizeElement = window.tools.resizeElement || false;
    let resizeElement = window.tools.resizeElement;
    if (flag == true) {}
    else {
        clickOnTool(document.getElementById('changeSize'), resizeElement ? 'remove' : 'add');
    }
    document.getElementsByClassName('resize-menu')[0].style['display'] = resizeElement ? 'none' : 'flex';
    let slideTags = document.getElementsByClassName('slide');
    for (let i = 0; i < slideTags.length; i++) {
        slideTags[i].style['bottom'] = resizeElement ? 0 : 'var(--resize-menu-height)';
    }
    window.tools.resizeElement = resizeElement ? false : true;
}

function changeHeight() {
    if (window.activeElement != undefined) {
        window.activeElement.style.height = document.getElementById('elementHeight').value;
    }
}

function changeWidth() {
    if (window.activeElement != undefined) {
        window.activeElement.style.width = document.getElementById('elementWidth').value;
    }
}

function allowAddText(flag) {
    window.tools.addText = window.tools.addText || false;
    let addText = window.tools.addText;
    if (flag == true) {}
    else {
        clickOnTool(document.getElementById('addText'), addText ? 'remove' : 'add');
    }
    window.tools.addText = addText ? false : true;
    let slideContentTags = document.getElementsByClassName('slide-content');
    for (let i = 0; i < slideContentTags.length; i++) {
        slideContentTags[i].setAttribute('onclick', addText ? 'clickOnSlider(this);' : ' addText(' + i + ');');
    }
}

function addText(index) {
    if (window.allowAddTexts && !window.allowAddTexts) {
        window.allowAddTexts = true;
        return;
    }
    let text = document.createElement('div');
    text.style = 'font-size: 36px; top: 0; left: 0; width: 150px; height: 150px;'
    text.className = 'ui-widget-content text draggable clicked double-clicked';
    text.innerHTML = '<span class="text-content">Drag me around</span><textarea class="input-text" onchange="insertText(this)"></textarea>'
    text.setAttribute('onclick', 'clickOnElement(this)');
    text.setAttribute('ondblclick', 'editText(this)');
    text.setAttribute('ondragstart', 'clickOnElement(this)');
    document.getElementsByClassName('slide-content')[index].appendChild(text);
    $( ".draggable" ).draggable({containment:".slide"});
    enableMoveElements();
}

function editText(element, flag) {
    let method = flag == true ? 'remove' : 'add';
    element.classList[method]('double-clicked');
}

function insertText(element) {
    let text = element.value;
    element.parentElement.getElementsByTagName('span')[0].innerHTML = text;
    element.parentElement.classList.remove('double-clicked');
}

function setFontSettings(flag) {
    window.tools.fontSettings = window.tools.fontSettings || false;
    let fontSettings = window.tools.fontSettings;
    if (flag == true) {}
    else {
        clickOnTool(document.getElementById('changeFontSettings'), fontSettings ? 'remove' : 'add');
    }
    document.getElementsByClassName('font-settings')[0].style['display'] = fontSettings ? 'none' : 'flex';
    let slideTags = document.getElementsByClassName('slide');
    for (let i = 0; i < slideTags.length; i++) {
        slideTags[i].style['bottom'] = fontSettings ? 0 : 'var(--resize-menu-height)';
    }
    window.tools.fontSettings = fontSettings ? false : true;
}

function openDialog() {
    document.getElementsByClassName('dialog-container')[0].style.display = 'flex';
}

function closeDialog() {
    document.getElementsByClassName('dialog-container')[0].style.display = 'none';
    document.getElementsByClassName('dialog-container')[1].style.display = 'none';
    document.getElementsByClassName('dialog-container')[2].style.display = 'none';
}

function uploadImage() {
    let input = document.getElementsByClassName('upload-media')[0];
    let file = input.files[0];
    const type = file.type.replace(/\/.+/, '')
    switch (type) {
        // если изображение
        case 'image':
            openMedia(file, 'img')
            break;
        // если аудио
        case 'audio':
            openMedia(file, 'audio')
            break;
        // если видео
        case 'video':
            openMedia(file, 'video')
            break;
        default:
            alert('Неверный формат медиа-файла!')
            break;
    }

    closeDialog();
}

function openMedia(file, tag) {
    let imageTag = document.createElement(tag);
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function () {
        imageTag.src = reader.result;
        if (tag == 'audio') {
            imageTag.setAttribute('controls', 'controls');
        }
        imageTag.style['max-width'] = '100%';
        imageTag.style['max-height'] = '100%';
        imageTag.style = 'top: 0; left: 0; width: 150px; height: 150px;';
        imageTag.className = 'ui-widget-content image draggable clicked';
        imageTag.setAttribute('onclick', 'clickOnElement(this)');
        imageTag.setAttribute('ondragstart', 'clickOnElement(this)');
        document.getElementsByClassName('slide-content')[activeSlide].appendChild(imageTag);
        $( ".draggable" ).draggable({containment:".slide"});
    };

    reader.onerror = function () {
        console.log(reader.error);
    }

}

function newSlide() {
    let slide = `<div style="display: none; bottom: 0;" class="slide header">
        <div class="slide-content" onclick="clickOnSlider(this)">
        </div>
    </div>`;
    document.getElementsByClassName('slide')[activeSlide].outerHTML += slide;
    changeSlide(1);
}

//hot keys

function keyUp(event) {
    //alert(event.code + ' ' + event.keyCode);
    if (event.keyCode == 122 || event.code == 'F11') {
        let fullScreenTag = document.getElementsByClassName('presentation')[0];
        fullScreenTag.style.display = fullScreenTag.style.display == 'flex' ? 'none' : 'flex';
        fullScreenTag.innerHTML = '';
        enableMoveElements();
        fullScreenTag.appendChild(document.getElementsByClassName('slider')[0]);
    }
}

//slider

function changeSlide(slide) {
    let slideNumber = window.activeSlide + slide;
    let slidesTags = document.getElementsByClassName('slide');
    for (let i = 0; i < slidesTags.length; i++) {
        slidesTags[i].style.display = 'none';
    }
    slidesTags[slideNumber].style.display = 'block';
    document.getElementById('leftArrow').style.display = 'none';
    document.getElementById('rightArrow').style.display = 'none';
    if (slidesTags[slideNumber-1] != undefined) {
        document.getElementById('leftArrow').style.display = 'block';
        document.getElementById('leftArrow').style.zIndex = '1000';
    }
    if (slidesTags[slideNumber+1] != undefined) {
        document.getElementById('rightArrow').style.display = 'block';
        document.getElementById('rightArrow').style.zIndex = '1000';
    }
    window.activeSlide = slideNumber;
}

// save
/*data = [
    [
        {
            type: 'div',
            top: '300px',
            left: '300px',
            width: '350px',
            height: '250px',
            data: 'qwer tyuiop[ asd f ghjkl;z xcvbnm, ./',
            zindex: '5'
        },
        {
            type: 'img',
            top: '0px',
            left: '0px',
            width: '100%',
            height: 'auto',
            data: '',
            zindex: '1'
        },
        {
            type: 'video',
            top: '0px',
            left: '0px',
            width: '350px',
            height: 'auto',
            zindex: '10',
            data: ''
        },
        {
            type: 'audio',
            top: '0px',
            left: '350px',
            width: '100%',
            height: 'auto',
            zindex: '1',
            data: ''
        }
    ]
]*/

/*templates = {
    text: `<div class="ui-widget-content text draggable" onclick="clickOnElement(this)" ondblclick="editText(this)" ondragstart="clickOnElement(this)" style="font-size: 36px; z-index: {{Z_INDEX}}; top: {{TOP}}; left: {{LEFT}}; width: {{WIDTH}}; height: {{HEIGHT}};"><span class="text-content">{{TEXT}}</span><textarea class="input-text" onchange='insertText(this)'></textarea></div>`,
   video: `<video src="{{DATA}}" style="top: {{TOP}}; left: {{LEFT}}; width: {{WIDTH}}; height: {{HEIGHT}};" class="ui-widget-content image draggable clicked ui-draggable ui-draggable-handle" onclick="clickOnElement(this)" ondragstart="clickOnElement(this)"></video>`
}*/

function saveAsJs() {
    window.data = [];
    let slides = document.getElementsByClassName('slide-content');
    for (let i = 0; i < slides.length; i++) {
        window.data[i] = [];
        let elements = slides[i].children;
        for (let j = 0; j < elements.length; j++) {
            let element = elements[j];
            window.data[i][j] = {};
            window.data[i][j].type = element.tagName.toLowerCase();
            window.data[i][j].top = element.style.top;
            window.data[i][j].left = element.style.left;
            window.data[i][j].width = element.style.width;
            window.data[i][j].height = element.style.height;
            window.data[i][j].zindex = element.style.zIndex;
            window.data[i][j].data = element.tagName == 'DIV' ? element.getElementsByTagName('span')[0].innerText : element.src;
        }
    }
    console.log(window.data);
    let file = new Blob(
        [JSON.stringify(window.data)], {
            type: 'application/json'
        }
    )
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(file));
    link.setAttribute('download', 'data.json');
    link.textContent = 'Скачать в формате .json';
    document.getElementsByClassName('link-container')[0].appendChild(link);
    document.getElementsByClassName('dialog-container')[1].style.display = 'flex';
}

//open file

function openJSON() {
    let input = document.getElementsByClassName('upload-presentation')[0];
    let file = input.files[0];
    const type = file.type;
    window.data = [];
    if (type == 'application/json') {
        let reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function() {
            window.data = reader.result;
        };

        reader.onerror = function () {
            console.log(reader.error);
        }
    }
    if (file.type === 'application/pdf') {
        createIframe(file)
        return;
    }
    closeDialog();
    let slides = document.getElementsByClassName('slide');
    for (let i = 0; i < slides.length; i++) {
        slides[i].remove();
    }
    for (let i = 0; i < window.data.length; i++) {
        let slide = document.createElement('div');
        slide.className = 'slide header';
        slide.style = 'display: none; bottom: 0;';
        let slideContent = document.createElement('div');
        slideContent.className = 'slide-content';
        slideContent.setAttribute('onclick', 'clickOnSlider(this)');
        for (let j = 0; j < window.data[i].length; j++) {
            let element = document.createElement(window.data[i][j].type);
                element.className = 'ui-widget-content text draggable';
            element.setAttribute('onclick', 'clickOnElement(this)');
            element.setAttribute('ondragstart', 'clickOnElement(this)');
            if (window.data[i][j].type) {
                element.setAttribute('ondblclick', 'clickOnElement(this)');
            }
            element.style.top = window.data[i][j].top;
            element.style.left = window.data[i][j].left;
            element.style.width = window.data[i][j].width;
            element.style.height = window.data[i][j].height;
            element.style.zIndex = window.data[i][j].zindex;
            if (element.tagName == 'DIV') {
                element.getElementsByTagName('span')[0].innerText = window.data[i][j];
            }
            else {
                element.src = window.data[i][j];
            }
            slideContent.appendChild(element);
        }
        slide.appendChild(slideContent);
        document.getElementsByClassName('slider')[0].appendChild(slide);
    }
}

// change sizes
resizeWindow();
window.addEventListener('resize', resizeWindow);
function resizeWindow () {
    window.presentation = {format: {w: 933}, style: {fontSize: 36, fontUnit: 'px'}}
    let tag = document.getElementsByClassName('slider')[0];
    let w = tag.clientWidth;
    let coeficent = w / (window.lastWidth || window.presentation.format.w);
    let textTags = document.getElementsByClassName('text');
    let presentationTag = document.getElementsByClassName('presentation')[0];
    if (presentationTag.innerHTML != '') {
        let image = presentationTag.getElementsByTagName('img')[0];
        let slider = presentationTag.getElementsByClassName('slider')[0];
        slider.style.maxWidth = image.width + 'px';
        slider.style.maxHeight = image.height + 'px';
    }
    for (let i = 0; i < textTags.length; i++) {
        textTags[i].style['font-size'] = Number(textTags[i].style['font-size'].substring(0, textTags[i].style['font-size'].length - 2)) * coeficent + 'px';
        textTags[i].style['top'] = Number(textTags[i].style['top'].substring(0, textTags[i].style['top'].length - 2)) * coeficent + 'px';
        textTags[i].style['left'] = Number(textTags[i].style['left'].substring(0, textTags[i].style['left'].length - 2)) * coeficent + 'px';
        textTags[i].style['width'] = Number(textTags[i].style['width'].substring(0, textTags[i].style['width'].length - 2)) * coeficent + 'px';
        textTags[i].style['height'] = Number(textTags[i].style['height'].substring(0, textTags[i].style['height'].length - 2)) * coeficent + 'px';
    }
    window.lastWidth = w;
}