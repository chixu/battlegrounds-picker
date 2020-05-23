console.log('hhi')
let cards = [];
let cardContainers = [];
let typeContainers = [];
let buttonStrategies = [];
let strategies = {};
let currentStrategy = "";
let createMode = false;

let types = {
    '26': 'All',
    '0': 'Normal',
    '15': 'Demon',
    '20': 'Beast',
    '17': 'Mech',
    '14': 'Murloc',
    '100': '>100'
}

let main = document.getElementById('main')
let strategyList = document.getElementById('strategies')
let strategyHeader = document.getElementById('header')
let createHeader = document.getElementById('createHeader')
// $(createHeader).css("display", "none")

for (let i = 0; i < 6; i++) {
    let dragContainer = new DragContainer();
    let container = document.createElement('div');
    // let container = dragContainer.element;
    container.className = 'border-top py-3'
    container.style.width = "100%";
    container.id = "tier" + i;
    cardContainers.push(dragContainer);
    container.appendChild(dragContainer.element);
    // container.innerHTML += 
    let button = $(`
    <button type="button" class="btn btn-primary mt-2 ml-3" onclick="onTierResetClick(${i})">Reset</button>
    `)
    container.appendChild(button[0]);
    main.appendChild(container);
}

function addHeaderButton(k) {
    strategyList.innerHTML += `
    <button id="s-${k}" type="button" class="btn btn-outline-primary" onclick="onStrategyClick('${k}')">${k}</button>
    `;
}

function renderHeader() {
    for (let k in strategies) {
        addHeaderButton(k);
    }
}

function onTierResetClick(index) {
    let items = cardContainers[index].items;
    for (let i = 0; i < items.length; i++) {
        items[i].visible = true;
    }
    cardContainers[index].render();
}

function onStrategyClick(key) {
    if (key == undefined || key == currentStrategy) return;
    console.log('onStrategyClick', key)
    $('#s-' + key).addClass('btn-primary');
    $('#s-' + key).removeClass('btn-outline-primary');
    $('#s-' + currentStrategy).removeClass('btn-primary');
    $('#s-' + currentStrategy).addClass('btn-outline-primary');

    currentStrategy = key;
    showStrategy(key);
}

// function onCreateClick() {
//     // saveRank();
//     showRank();
//     $('#save').toggleClass('d-inline-block');
//     $('#save').toggleClass('d-none');
// }

function saveCurrentStrategy() {
    let name = createMode ? $('#strategyName').val() : currentStrategy;
    if (!name) {
        alert('Name cannot be empty!')
        return;
    }
    let data = {};
    for (let i = 0; i < cardContainers.length; i++) {
        let container = cardContainers[i];
        for (let j = 0; j < container.items.length; j++) {
            let item = container.items[j];
            let card = item.card;
            if (item.visible) {
                let rank = (i + 1) * 1000 + container.items.length - j;
                data[card.fullname] = rank;
            } else {
                data[card.fullname] = -1;
            }
        }
    }
    strategies[name] = data;
    return name;
}

function onSaveClick() {
    saveCurrentStrategy()
    save();
}

function onNewSaveClick() {
    let name = saveCurrentStrategy()
    addHeaderButton(name);
    onStrategyClick(name);
    onCloseClick();
}

function onCloseClick() {
    // saveRank();
    createMode = false;
    $(strategyHeader).css('display', 'flex')
    $(createHeader).css('display', 'none')
}

function onDeleteCardMouse() {
    event.stopPropagation();
}

function onDeleteCardClick(name) {
    event.stopPropagation();
    console.log(event, name);
    getCardByName2(name).dragItem.visible = false;
    getCardByName2(name).dragItem.container.render();
}

function onDeleteClick() {
    if (confirm(`Are you sure you want to delete "${currentStrategy}"?`)) {
        // Save it!
        delete strategies[currentStrategy];
        $('#s-' + currentStrategy).remove();
        // save();
    } else {
        // Do nothing!
    }
}

function onCreateClick() {
    // saveRank();
    createMode = true;
    $(strategyHeader).css('display', 'none')
    $(createHeader).css('display', 'flex')
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function save() {
    // $.post("./strategy.php", {
    //     data: JSON.stringify(strategies, null, 2)
    // }, function (data) {
    //     if (data = "success")
    //         alert("Saved successfully")
    //     console.warn(data);
    // });
    console.warn("save");
    download(JSON.stringify(strategies, null, 2), 'strategy.json', 'text/plain');
}

function getCardByName(name) {
    for (let k in cards) {
        if (name == cards[k].fullname)
            return cards[k];
    }
    return undefined;
}

function getCardByName2(name) {
    for (let k in cards) {
        if (name == getCardFullName2(cards[k].fullname))
            return cards[k];
    }
    return undefined;
}

function showStrategy(name) {
    if (strategies[name]) {
        let rank = strategies[name];
        for (let k in cards) {
            let name = cards[k].fullname;
            cards[k].rank = rank[name] || 0;
            // if (cards[k].rank == -1)
            cards[k].dragItem.visible = cards[k].rank > -1;
        }
        for (let k in cardContainers) {
            cardContainers[k].items.sort((a, b) => b.card.rank - a.card.rank)
            cardContainers[k].render();
        }
        // showRank();
        // cards.sort((a, b) => b.rank - a.rank)

        // for (let k in cards) {
        //     let card = cards[k];
        //     cardContainers[card.tier - 1].add(card.dragItem);
        // }
    } else {

    }
}


function getRank() {
    $.getJSON('strategy.json', function (data) {
        // let data = JSON.parse(r);
        strategies = data;

        // for (let k in cards) {
        //     let name = cards[k].fullname;
        //     // console.log(name, data[name])
        //     cards[k].rank = data[name];
        // }
        // // showRank();
        // cards.sort((a, b) => b.rank - a.rank)

        // for (let k in cards) {
        //     let card = cards[k];
        //     cardContainers[card.tier - 1].add(card.dragItem);
        // }
        for (let k in cards) {
            let card = cards[k];
            cardContainers[card.tier - 1].add(card.dragItem);
        }
        let s = '';
        for (let k in data) {
            s = k;
            break;
        }
        renderHeader();
        onStrategyClick(s);
    });
}

//remove single quote and space
function getCardFullName2(fullname) {
    return fullname.replace("'", '').replace(" ", '')
}

$.getJSON('cards_150.json', function (data) {
    // let data = JSON.parse(r);

    for (let k in data) {
        let c = data[k];
        let name = c['name']
        let tier = c['tier']
        let typeName = c['typeName']
        let fullname = k;
        let filename = fullname + '.png';
        let desc = c.desc;
        let pos = c.pos;

        // let div = document.createElement('div');
        let dragItem = new DragItem();
        let div = dragItem.element;
        let img = document.createElement('div')
        $(div).addClass('hscard');
        // MyDrag.apply(div);
        // img.src = './img_150/' + filename;
        // img.style = 'display:block'

        img.className = "d-inline-block mycard";
        img.style = `display:block; background: url(cards_150.png) -${pos[0]}px -${pos[1]}px;`
        div.appendChild(img);
        div.innerHTML += `
            <button type="button" class="btn btn-danger" 
            onpointerdown="onDeleteCardMouse()"
            onmousedown="onDeleteCardMouse()"
            onclick="onDeleteCardClick('${getCardFullName2(fullname)}')">X</button>
        `;
        // cardContainers[tier - 1].appendChild(div);

        let card = {
            name: name,
            tier: tier,
            desc: desc,
            type: typeName,
            filename: filename,
            fullname: fullname,
            element: div,
            dragItem: dragItem,
            rank: 0
        }
        div.id = card.fullname;
        dragItem.card = card;
        cards.push(card)
    }
    getRank();
})