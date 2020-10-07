let cards = [];
let minionTypeData;
let cardContainers = [];
let typeContainers = [];
let buttonTiers = [];
let tiersCount = {};
let keysCount = {};
let strategies = {};
let typesCount = {};
const cardPool = {

}
let i18n = {
    title: ["Battlegrounds", "炉石酒馆"],
    tier: ["Tier", "等级"],
    All: ["All", "全部"],
    miniontype: ["Minion Type", "随从种类"],
    keyword: ["Keyword", "关键字"],
    strategy: ["Strategy", "策略"],
    'Normal': ["Normal", "普通"],
    'Neutral': ["Neutral", "中立"],
    'Elemental': ["Elemental", "元素"],
    'Common': ["Common", "通用"],
    'Demon': ["Demon", "恶魔"],
    'Beast': ["Beast", "野兽"],
    'Dragon': ["Dragon", "龙"],
    'Mech': ["Mech", "机械"],
    'Murloc': ["Murloc", "鱼人"],
    'Pirate': ["Pirate", "海盜"],
    'Deathrattle': ["Deathrattle", "亡语"],
    'Battlecry': ["Battlecry", "战吼"],
    'Divine Shield': ["Divine Shield", "圣盾"],
    'Taunt': ["Taunt", "嘲讽"],
    'Poisonous': ["Poisonous", "剧毒"],
    'Magnetic': ["Magnetic", "磁力"],
    'Lightfang': ["Lightfang", "光牙"],
    'Deryl': ["Deryl", "刮痧"],
    'Deathwing': ["Deathwing", "死亡之翼"],
    'Reno': ["Reno", "雷诺"],
}
// 1	18
// 2	15
// 3	13
// 4	11
// 5	9
// 6	6
let lang = getLang();
function translate(word) {
    return i18n[word] ? i18n[word][lang == 'zh' ? 1 : 0] : word;
}

function getLang() {
    let lang = navigator.language;
    let queryStr = location.search;
    if (queryStr.indexOf('lang=zh') > -1) {
        // document.cookie = "zh";
        return 'zh';
    }
    // if (document.cookie = "zh") {
    //     return 'zh';
    // }
    if (lang && lang.length > 2) {
        lang = lang.substr(0, 2);
    }
    if (lang != 'zh')
        lang = 'en';
    // document.cookie = lang;
    return lang;
}

let teirInfo = {
    1: {
        eachCardsCount: 16,
        cardsChosen: 3
    },
    2: {
        eachCardsCount: 15,
        cardsChosen: 4
    },
    3: {
        eachCardsCount: 13,
        cardsChosen: 4
    },
    4: {
        eachCardsCount: 11,
        cardsChosen: 5
    },
    5: {
        eachCardsCount: 9,
        cardsChosen: 5
    },
    6: {
        eachCardsCount: 7,
        cardsChosen: 6
    },
}
let selectTiers = {
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
};
let types = [
    ['26', 'All'],
    ['0', 'Normal'],
    ['15', 'Demon'],
    ['20', 'Beast'],
    ['24', 'Dragon'],
    ['17', 'Mech'],
    ['14', 'Murloc'],
    ['23', 'Pirate'],
    ['18', 'Elemental'],
    // '100': '>100'
]
let keywords = {
    'All': true,
    // 'Normal': true,
    'Mech': true,
    'Beast': true,
    'Dragon': true,
    'Murloc': true,
    'Demon': true,
    'Pirate': true,
    'Elemental': true,
    'Deathrattle': false,
    'Battlecry': false,
    'Divine Shield': false,
    'Taunt': false,
    'Poisonous': false,
    'Magnetic': false,
}
let main = document.getElementById('main')
let header = document.getElementById('tiers')
let header2 = document.getElementById('header2')
let headerCardpool = document.getElementById('header_cardpool')
let header3 = document.getElementById('header3')
let strategyList = document.getElementById('strategies')
let currentMinionType;
let currentKeyword;
let currentStrategy;

//i18n
let titles = ['tier', 'miniontype', 'keyword', 'strategy'];
for (let t of titles) {
    console.log(t);
    $('#title_' + t).html(translate(t) + ":")
}
document.title = translate("title");
$('#change-lang').html(lang == "zh" ? "English" : "中文");
trackEvent("Start", { lang });




for (let i = 0; i < 6; i++) {
    let container = document.createElement('div');
    container.className = 'border-top py-3'
    container.id = "tier" + i;
    cardContainers.push(container);
    main.appendChild(container);
}

function trackEvent(eventName, props) {
    if (window.___publish && appInsights)
        appInsights.trackEvent(eventName, props);
}


function calcCardCount() {
    tiersCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    typesCount = {};
    for (let i = 0; i < types.length; i++)
        typesCount[types[i][1]] = 0;
    keysCount = {}
    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        if (card.inPool) {
            let tier = card.tier;
            let typeName = card.type;
            if (tiersCount[tier])
                tiersCount[tier]++;
            else
                tiersCount[tier] = 1

            if (typeName == 'All') {
                for (let k in typesCount) {
                    typesCount[k]++;
                }
            } else {
                typesCount[typeName]++;
                typesCount['All']++;
            }
            for (let k in keywords) {
                if (hasKey(card, k)) {
                    if (keysCount[k])
                        keysCount[k]++;
                    else
                        keysCount[k] = 1
                }
            }
        }
    }
    console.log("tiersCount", tiersCount);
    console.log("typesCount", typesCount);
    console.log("keysCount", keysCount);
}

function renderHeaderTxt() {
    //type
    for (let k in types) {
        console.log(k);
        let typename = types[k][1];
        let txt = translate(typename) + (typesCount[typename] ? ('(' + typesCount[typename] + ')') : '')
        let txtid = "type-txt-" + typename;
        let ele = document.getElementById(txtid);
        ele.innerHTML = txt;
    }
    for (let i = 0; i <= 6; i++) {
        let index = i > 0 ? ('' + i) : 'All';
        let txtid = "tier-txt-" + index;
        let name = i > 0 ? ('T' + i + '(' + tiersCount[i] + ')') : 'All'
        let ele = document.getElementById(txtid);
        ele.innerHTML = name;
    }
    // for (let k in types) {
    //     let typename = types[k][1];
    //     let count = typesCount['All'];
    //     if (typename !== "All") {
    //         count = cardPool[typename].ids.length;
    //     }
    //     console.log(typename, count);
    //     let txt = translate(typename) + '(' + count + ')';
    //     let txtid = "pool-txt-" + typename;
    //     let ele = document.getElementById(txtid);
    //     ele.innerHTML = txt;
    // }
    for (let k in keywords) {
        let txt = translate(k) + (keysCount[k] ? ('(' + keysCount[k] + ')') : '')
        let txtid = "keyword-txt-" + k;
        let ele = document.getElementById(txtid);
        ele.innerHTML = txt;
    }

    for (let i = 0; i < 6; i++) {
        let totalCard = 0;
        for (let j = 1; j <= i + 1; j++) {
            totalCard += teirInfo[j].eachCardsCount * tiersCount[j];
        }
        console.log("totalCard", totalCard);
        // let name = i > 0 ? ('T' + i + '(' + tiersCount[i] + ')') : 'All'
        let lv1Prob = 0;
        for (let j = 1; j <= i + 1; j++) {
            let tierCount = teirInfo[j].eachCardsCount * tiersCount[j];
            let prob = teirInfo[i + 1].cardsChosen * tierCount / totalCard * 100;
            let probTxt = `${(prob / tiersCount[j]).toFixed(1)}%`;
            if (j == 1)
                lv1Prob = probTxt
            document.getElementById(`tier-header-${i + 1}-${j}`).innerHTML = ` T${j} ${probTxt}`;
        }
        let tooltip = "";
        if (lang == "zh")
            tooltip = `当鲍勃酒馆${i + 1}级时，找到特定一张1级卡的几率是${lv1Prob}...`
        else
            tooltip = `When Bob's Tavern is T${i + 1}, ${lv1Prob} chance to get a specific T1 card ...`
        document.getElementById(`tier-header-tooltip-${i + 1}`).innerHTML = tooltip;

    }
}

function renderHeader() {
    console.log(typesCount)
    for (let k in types) {
        console.log(k);
        let typename = types[k][1];
        let txt = translate(typename) + (typesCount[typename] ? ('(' + typesCount[typename] + ')') : '')
        let id = "type-" + typename;
        let txtid = "type-txt-" + typename;
        // header2.innerHTML += `
        // <button type="button" class="btn btn-primary" onclick="onTypeClick('${types[k]}')">${txt}</button>
        // `;
        header2.innerHTML += `
        <label id="${id}" class="filter">
            <input class="with-gap" name="typegroup" ${typename == "All" ? "checked" : ""} value="${typename}" type="radio" onchange="onTypeChange()" />
            <span id="${txtid}">${txt}</span>
        </label>
        `;
    }
    checkMinionType(document.getElementById('type-All'));

    for (let i = 0; i <= 6; i++) {
        let index = i > 0 ? ('' + i) : 'All';
        let name = i > 0 ? ('T' + i + '(' + tiersCount[i] + ')') : 'All'

        // header.innerHTML += `
        // <button type="button" class="btn btn-primary" onclick="onTierClick(this,${i})">${name}</button>
        // `
        let txtid = "tier-txt-" + index;
        header.innerHTML += `
        <label id="tier-${i}" class="filter filter-checked">
            <input type="checkbox" id="tier${i}" class="filled-in checkbox-blue" checked="checked" onchange="onTierChange(${i})"/>
            <span id="${txtid}" class="tier-text">${name}</span>
        </label>
        `
    }

    //init headerCardpool
    for (let k in types) {
        console.log(k);
        let typename = types[k][1];
        let count = typesCount['All'];
        if (typename !== "All") {
            count = cardPool[typename].ids.length;
        }
        let txt = translate(typename) + '(' + count + ')';
        let id = "pool-" + typename;
        let txtid = "pool-txt-" + typename;
        headerCardpool.innerHTML += `
        <label id="${id}" class="filter">
            <input class="filled-in checkbox-blue" type="checkbox" checked value="${typename}" onchange="onPoolChange()" />
            <span id="${txtid}">${txt}</span>
        </label>
        `;
    }
    // checkCardPool(document.getElementById('pool-All'));
    //end init headerCardpool


    for (let k in keywords) {
        let txt = translate(k) + (keysCount[k] ? ('(' + keysCount[k] + ')') : '')
        let id = "keyword-" + k;
        let txtid = "keyword-txt-" + k;
        // header3.innerHTML += `
        // <button type="button" class="btn btn-primary" onclick="onKeywordClick('${k}')">${txt}</button>
        // `;
        header3.innerHTML += `
        <label id="${id}" class="filter">
            <input class="with-gap blue" name="keywordgroup" value="${k}" ${k == "All" ? "checked" : ""} type="radio" onchange="onKeywordChange()" />
            <span id="${txtid}">${txt}</span>
        </label>
        `;

    }
    checkKeyword(document.getElementById('keyword-All'));

    for (let k in strategies) {
        // strategyList.innerHTML += `
        // <button type="button" class="btn btn-primary" onclick="onStrategyClick('${k}')">${k}</button>
        // `;
        let id = "stra-" + k;
        strategyList.innerHTML += `
        <label id="${id}" class="filter">
            <input class="with-gap blue" name="strategygroup" value="${k}" ${k == "Common" ? "checked" : ""} type="radio" onchange="onStrategyChange()" />
            <span>${translate(k)}</span>
        </label>
        `;
    }

    checkStrategy(document.getElementById('stra-Common'));

    for (let i = 0; i < 6; i++) {
        let tierHeader = document.createElement('div');
        tierHeader.className = "tier-header"
        tierHeader.innerHTML = `<div class="tier-header-1">${translate('tier')} ${i + 1}</div>`
        // let count = tiersCount[i + 1];
        let txt = '';
        // let cardsProb = [];
        let totalCard = 0;
        for (let j = 1; j <= i + 1; j++) {
            totalCard += teirInfo[j].eachCardsCount * tiersCount[j];
        }
        // let name = i > 0 ? ('T' + i + '(' + tiersCount[i] + ')') : 'All'
        let lv1Prob = 0;
        for (let j = 1; j <= i + 1; j++) {
            let tierCount = teirInfo[j].eachCardsCount * tiersCount[j];
            console.log(i + 1, j, tierCount, totalCard);
            let prob = teirInfo[i + 1].cardsChosen * tierCount / totalCard * 100;
            if (j == 1)
                lv1Prob = `${(prob / tiersCount[j]).toFixed(1)}%`;
            // txt += `<div class="tier-header-2"> T${j} ${(prob / tiersCount[j]).toFixed(1)}%-${prob.toFixed(1)}% </div>`
            txt += `<div id="tier-header-${i + 1}-${j}" class="tier-header-2"> T${j} ${(prob / tiersCount[j]).toFixed(1)}%</div>`
        }
        let tooltip = "";
        if (lang == "zh")
            tooltip = `当鲍勃酒馆${i + 1}级时，找到特定一张1级卡的几率是${lv1Prob}...`
        else
            tooltip = `When Bob's Tavern is T${i + 1}, ${lv1Prob} chance to get a specific T1 card ...`
        txt += `
            <div class="tooltip">?
                <span id="tier-header-tooltip-${i + 1}" class="tooltiptext">${tooltip}</span>
            </div>
        `;
        tierHeader.innerHTML += txt;
        $(tierHeader).insertBefore($(cardContainers[i]))
    }

    // keywords
}


function checkStrategy(el) {
    if (currentStrategy) {
        $(currentStrategy).removeClass("filter-checked");
    }
    $(el).addClass("filter-checked");
    currentStrategy = el;
}

function checkMinionType(el) {
    if (currentMinionType) {
        $(currentMinionType).removeClass("filter-checked");
    }
    $(el).addClass("filter-checked");
    currentMinionType = el;
}

function checkKeyword(el) {
    if (currentKeyword) {
        $(currentKeyword).removeClass("filter-checked");
    }
    $(el).addClass("filter-checked");
    currentKeyword = el;
}

function renderTiers() {
    for (let k in selectTiers) {
        $(cardContainers[k - 1]).css('display', selectTiers[k] ? 'block' : 'none');
        // cardContainers[k - 1].show(selectTiers[k]);
    }
}

function onPoolChange() {
    let t = event.target.value;
    let checked = event.target.checked;
    if (t === "All") {
        let allPools = document.getElementById("header_cardpool").children;
        for (let i = 0; i < allPools.length; i++) {
            let name = allPools[i].id.replace("pool-", "");
            // let checked = allPools[i].children[0].checked;
            if (name !== "pool-All")
                allPools[i].children[0].checked = checked;
        }
    }
    updateCardsByPool();
    calcCardCount();
    renderHeaderTxt();
    trackEvent("Pool", { name: t });
}

function updateCardsByPool() {
    let allPools = document.getElementById("header_cardpool").children;
    let showIds = []
    for (let i = 0; i < allPools.length; i++) {
        let name = allPools[i].id.replace("pool-", "");
        let checked = allPools[i].children[0].checked;
        if (checked && name !== "All")
            showIds = showIds.concat(cardPool[name].ids);
    }
    showIds = showIds.map(v => v + "");
    for (let k in cards) {
        let card = cards[k];
        // console.log(card.fullname);
        card.inPool = showIds.indexOf(card.fullname) > -1
        showCard(card);
    }
}

function onTypeChange() {
    let t = event.target.value;
    for (let k in cards) {
        let card = cards[k];
        let shown = true;
        if (t == '>100') {
            shown = card.rank >= 100;
        } else if (t != 'All') {
            shown = card.type == t || card.type == 'All'
            // if (card.type == t) console.log(card, t);
        }
        // $(card.element).css('display', shown ? 'inline-block' : 'none');
        card.shown = shown;
        showCard(card);
    }
    trackEvent("Minion", { name: t });
    checkMinionType(document.getElementById('type-' + t));
}

// function onTypeClick(t) {
//     console.log(t);
//     for (let k in cards) {
//         let card = cards[k];
//         let shown = true;
//         if (t == '>100') {
//             shown = card.rank >= 100;
//         } else if (t != 'All') {
//             shown = card.type == t || card.type == 'All'
//         }
//         // $(card.element).css('display', shown ? 'inline-block' : 'none');
//         showCard(card, shown);
//     }
// }

function showCard(card) {
    // console.log("showCard", card, show, important)
    let show = card.inPool && card.shown;
    if (show) {
        $(card.element).removeClass('d-none');
        $(card.element).addClass('d-inline-block');
    } else {
        $(card.element).removeClass('d-inline-block');
        $(card.element).addClass('d-none')
    }
}

function onKeywordChange() {
    let key = event.target.value;
    for (let k in cards) {
        let card = cards[k];
        let shown = hasKey(card, key);
        // $(card.element).css('display', shown ? 'inline-block' : 'none');
        card.shown = shown;
        showCard(card);
    }
    trackEvent("Keyword", { name: key });
    checkKeyword(document.getElementById('keyword-' + key));
}

// function onKeywordClick(key) {
//     for (let k in cards) {
//         let card = cards[k];
//         let shown = hasKey(card, key);
//         // $(card.element).css('display', shown ? 'inline-block' : 'none');
//         showCard(card, shown);
//     }
// }

function hasKey(card, key) {
    if (key == 'All') {
        return true
    } else if (keywords[key]) {
        return card.type == key || card.desc.indexOf(translate(key)) > -1;
    } else {
        return card.desc.indexOf(translate(key)) > -1;
    }
}

function onTierChange(i) {
    let checked = event.target.checked;
    let checkedClass = "filter-checked";
    if (i > 0) {
        selectTiers[i] = checked;
    } else {
        for (let i = 1; i <= 6; i++) {
            selectTiers[i] = checked;
            $("#tier" + i).prop('checked', checked);
            if (checked)
                $("#tier-" + i).addClass(checkedClass)
            else
                $("#tier-" + i).removeClass(checkedClass)
        }
    }
    if (checked)
        $("#tier-" + i).addClass(checkedClass)
    else
        $("#tier-" + i).removeClass(checkedClass)
    renderTiers();
}

function onTierClick(btn, i) {
    if (i > 0) {
        $(btn).toggleClass('btn-outline-primary');
        $(btn).toggleClass('btn-primary');
        selectTiers[i] = $(btn).hasClass('btn-primary')
        console.log(i)
    } else {
        for (let i = 1; i <= 6; i++) {
            selectTiers[i] = true;
            $(header).children().each(
                function () {
                    $(this).addClass('btn-primary');
                    $(this).removeClass('btn-outline-primary');
                }
            )
        }
    }
    renderTiers();
}

function onConfigClick() {
    // saveRank();
    // $('#save').toggleClass('d-inline-block');
    // $('#save').toggleClass('d-none');
    window.location = './config.html'
}

function onLangClick() {
    if (lang == "zh")
        window.location = './?lang=en';
    else
        window.location = './?lang=zh';
}
// function onSaveClick() {
//     saveRank();
// }

// function saveRank() {
//     let data = {};
//     for (let k in cards) {
//         let input = cards[k].element.querySelector('input');
//         let rank = parseInt(input.value);
//         cards[k].rank = rank;
//         data[cards[k].fullname] = rank;
//     }
//     $.post("./rank.php", {
//         data: JSON.stringify(data, null, 2)
//     });
// }

function getStrategy() {
    $.getJSON('strategy.json', function (data) {
        // let data = JSON.parse(r);
        strategies = data;
        // for (let k in cards) {
        //     let card = cards[k];
        //     cardContainers[card.tier - 1].add(card.dragItem);
        // }
        // let s = '';
        // for (let k in data) {
        //     s = k;
        //     break;
        // }
        sortCard();
        renderHeader();
        // onStrategyClick(s);
    });
}


function onStrategyChange() {
    let name = event.target.value;
    if (strategies[name]) {
        let rank = strategies[name];
        for (let k in cards) {
            let card = cards[k];
            let name = card.fullname;
            card.rank = rank[name] || -1;
            card.shown = card.rank > -1
            showCard(card);
            // $(card.element).css('display', card.rank > -1 ? 'inline-block' : 'none');
        }
        sortCard();
        trackEvent("Strategy", { name });
        checkStrategy(document.getElementById('stra-' + name));
    }
}

// function onStrategyClick(name) {
//     // currentStrategy = key;
//     if (strategies[name]) {
//         let rank = strategies[name];
//         for (let k in cards) {
//             let card = cards[k];
//             let name = card.fullname;
//             card.rank = rank[name] || 0;
//             showCard(card, card.rank > -1);
//             // $(card.element).css('display', card.rank > -1 ? 'inline-block' : 'none');
//         }
//         sortCard();
//     }
// }

function sortCard() {
    cards.sort((a, b) => b.rank - a.rank)

    for (let k in cards) {
        let card = cards[k];
        cardContainers[card.tier - 1].appendChild(card.element);
    }
}

function getRank() {
    $.getJSON('strategy.json', function (data) {
        // let data = JSON.parse(r);
        for (let k in cards) {
            let name = cards[k].fullname;
            // console.log(name, data[name])
            cards[k].rank = data[name];
        }
        sortCard();
    });
}


$.getJSON(`cards_150${lang == "zh" ? '_cn' : ''}.json?v=${window.___publishtime}`, function (data) {
    $.getJSON(`miniontype.json?v=${window.___publishtime}`, function (_minionTypData) {
        // let data = JSON.parse(r);
        // console.log(data);
        minionTypeData = _minionTypData
        for (let k in minionTypeData) {
            let typeName = k;
            if (typeName === "Neutral") typeName = "Normal";
            let typeData = minionTypeData[k];
            cardPool[typeName] = {
                "ids": [],
                "t1": 0,
                "t2": 0,
                "t3": 0,
                "t4": 0,
                "t5": 0,
                "t6": 0
            }
            for (let j = 0; j < typeData.length; j++) {
                cardPool[typeName]["ids"].push(typeData[j].id);
                cardPool[typeName]["t" + typeData[j].tier]++;
            }
        }
        console.log("cardPool", cardPool);
        for (let k in data) {
            let c = data[k];
            let name = c['name']
            let tier = c['tier']
            let typeName = c['typeName']
            // let fullname = tier + '_' + typeName + '_' + name;
            let fullname = k;
            let filename = fullname + '.png';
            let desc = c.desc;
            let pos = c.pos;

            // let div = document.createElement('div');
            let div = document.createElement('div');
            // $(div).addClass('d-inline-block')
            // let img = document.createElement('div')
            div.className = "mycard";
            // img.className = "mycard"
            // img.id = fullname
            // $(div).draggable();
            // MyDrag.apply(div);
            // img.src = './img_150/' + filename;
            div.style = `background: url(cards_150${lang == "zh" ? '_cn' : ''}.png) -${pos[0]}px -${pos[1]}px;`
            // div.appendChild(img);
            // div.innerHTML += `
            //     <input class="d-none" style="width:100px;margin:0 25px;text-align:center">
            // `;
            // cardContainers[tier - 1].appendChild(div);

            let card = {
                name: name,
                // id: c.id,
                tier: tier,
                desc: desc,
                type: typeName,
                filename: filename,
                fullname: fullname,
                element: div,
                inPool: true,
                shown: true,
                rank: 0
            }
            cards.push(card)
            // if (tiersCount[tier])
            //     tiersCount[tier]++;
            // else
            //     tiersCount[tier] = 1

            // if (typeName == 'All') {
            //     for (let k in typesCount) {
            //         typesCount[k]++;
            //     }
            // } else {
            //     typesCount[typeName]++;
            //     typesCount['All']++;
            // }
            // for (let k in keywords) {
            //     if (hasKey(card, k)) {
            //         if (keysCount[k])
            //             keysCount[k]++;
            //         else
            //             keysCount[k] = 1
            //     }
            // }
            // console.log(name, tier, typeName)
        }
        calcCardCount();
        console.log("typesCount", typesCount);
        getStrategy();
    })
})