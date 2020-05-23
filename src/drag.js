// var MyDrag = {};
var itemHeight = 207;
var itemWidth = 150;
var itemXMargin = -3;
var itemYMargin = 0;
var itemZIndex = 1000;

// $(window).resize(resize);

function resize() {

    colCount = Math.floor(($list.outerWidth() + itemXMargin) / (itemWidth + itemXMargin));
    // gutterStep = colCount == 1 ? gutter : (gutter * (colCount - 1) / colCount);
    // rowCount = 0;

    // layoutInvalidated();
}

function DragContainer() {
    this.numRows;
    this.numCols;
    this.items = [];
    this.name = 'container';
    this.$element = $("<div></div>");

    // this.element = document.createElement('div')
    this.element = this.$element[0];
    // this.element.id = 'tier'
    // this.$element = $(this.element)
    this.$element.css('position', 'relative')
    this.$element.css('width', '100%')
}

DragContainer.prototype.changePosition = function (fromItem, toItem) {
    if (this.items.length < 2) return;
    // console.log('changed ', fromItem.index, toItem.index)
    this.items.splice(this.items.indexOf(fromItem), 1);
    this.items.splice(this.items.indexOf(toItem), 0, fromItem);


    // var insert = fromItem.index > toItem.index ? "insertBefore" : "insertAfter";

    // Change DOM positions
    // fromItem.$element[insert](toItem.$element);
    this.render();
    // layoutInvalidated(rowToUpdate);
}

DragContainer.prototype.resize = function (item) {
    console.log(this.name);
}


DragContainer.prototype.getVisibleItems = function () {
    let items = [];
    for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].visible) {
            items.push(this.items[i]);
        }
    }
    return items;
}

DragContainer.prototype.render = function (item) {
    let items = this.getVisibleItems();
    let count = items.length;
    // console.log('$element.outerWidth()', this.$element.outerWidth())
    console.log('window.innerWidth', window.innerWidth)
    this.numCols = Math.floor((window.innerWidth + itemXMargin) / (itemWidth + itemXMargin));
    this.numRows = count > 0 ? (Math.ceil(count / this.numCols)) : 0;
    // = count > 0 ? (count>0) : 0;
    if (count > 0) {
        let height = this.numRows * (itemYMargin + itemHeight) - itemYMargin;
        this.$element.css('height', height + 'px')
    } else {
        this.$element.css('height', '0')
    }

    for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        // console.log(item.visible, item.$element)
        if (item.visible)
            item.$element.removeClass('d-none');
        else
            item.$element.addClass('d-none');
    }

    for (let i = 0; i < items.length; i++) {
        let r = Math.floor(i / this.numCols);
        let c = i - r * this.numCols;
        // this.$element.css('tra', '0')
        // TweenLite.to(this.items[i].element, 0, {
        //     x: c * (itemXMargin + itemWidth),
        //     y: r * (itemYMargin + itemHeight),
        // });
        // console.log(items[i].card.fullname, i, r, c);
        this.$element.append(this.items[i].$element);
        items[i].index = i;
        items[i].setPosition(r, c)
    }
}

DragContainer.prototype.sayHi = function (item) {
    console.log(this.name);
}

DragContainer.prototype.add = function (item) {
    console.log('add', this.element)
    this.element.appendChild(item.element);
    item.index = this.items.length;
    this.items.push(item);
    item.container = this;
    console.log('add', this.element.children.length)
    // this.render();
}

DragContainer.prototype.show = function (b) {
    $(this.element).css('display', b ? 'block' : 'none');
}

DragContainer.sayHi = function () {
    console.log('static hi')
}
var dc1 = new DragContainer();
dc1.sayHi();
var dc2 = DragContainer.sayHi();



function DragItem(index) {
    this.container;
    this.visible = true;
    this.index = index;
    this.isDragging = false;
    this.positioned = true;
    this.lastIndex = null;
    this.row = 0;
    this.col = 0;
    var element = $("<div></div>");
    this.$element = element;
    this.$element.css('width', itemWidth + 'px')
    $(element).css("position", "absolute")
    $(element).css("display", "block")
    var threshold = "40%";
    var _this = this;
    // var lastX = 0;

    this.draggable = Draggable.create(element, {
        // onDrag: () => this.onDrag(),
        onDrag: onDrag,
        onPress: onPress,
        onRelease: onRelease,
    });

    // NOTE: Leave rowspan set to 1 because this demo 
    // doesn't calculate different row heights
    // var data = {
    // col: null,
    // colspan: colspan,
    // height: 0,
    // inBounds: true,
    // index: index,
    // isDragging: false,
    // lastIndex: null,
    // newTile: true,
    // positioned: false,
    // row: null,
    // rowspan: 1,
    // width: 0,
    // x: 0,
    // y: 0
    // };

    // Add tile properties to our element for quick lookup
    // element[0].data = data;
    element[0].item = this;

    // $list.append(element);
    // layoutInvalidated();

    function onPress() {
        console.log('onPress', event)
        // lastX = this.x;
        _this.isDragging = true;
        _this.row = -1;
        _this.col = -1;
        this.lastIndex = this.index;

        TweenLite.to(element, 0.2, {
            autoAlpha: 0.75,
            // boxShadow: shadow2,
            scale: 0.95,
            zIndex: "+=1000"
        });
    }

    function onDrag() {
        console.log('onDrag')
        if (!_this.isDragging) return;
        // Move to end of list if not in bounds
        // if (!this.hitTest($list, 0)) {
        //     tile.inBounds = false;
        //     changePosition(tile.index, tiles.length - 1);
        //     return;
        // }

        // tile.inBounds = true;
        // console.log(this);
        // console.log(typeof(this))
        let items = _this.container.items;
        for (var i = 0; i < items.length; i++) {

            // Row to update is used for a partial layout update
            // Shift left/right checks if the tile is being dragged 
            // towards the the tile it is testing
            var item = items[i];
            // var onSameRow = (tile.row === testTile.row);
            // var rowToUpdate = onSameRow ? tile.row : -1;
            // var shiftLeft = onSameRow ? (this.x < lastX && tile.index > i) : true;
            // var shiftRight = onSameRow ? (this.x > lastX && tile.index < i) : true;
            // var validMove = (testTile.positioned && (shiftLeft || shiftRight));
            var validMove = item.positioned;
            if (this.hitTest(item.element, threshold) && validMove) {
                // _this.changePosition(_this.index, i);
                _this.container.changePosition(_this, item);
                break;
            }
        }

        // lastX = this.x;
    }

    function onRelease() {
        console.log('onRelease')
        if (!_this.isDragging) return;
        // Move tile back to last position if released out of bounds
        // this.hitTest($list, 0) ?
        //     layoutInvalidated() :
        //     changePosition(tile.index, tile.lastIndex);
        // tile.isDragging = false;
        _this.setPosition(_this.row, _this.col, true);
        _this.isDragging = false;
        _this.container.render();
    }
    this.element = element[0];
}

DragItem.prototype.setPosition = function (r, c, forced = false) {
    if ((this.row != r || this.col != c) && !this.isDragging && this.positioned) {

        // TweenLite.to(this.items[i].element, 0, {
        //     x: c * (itemXMargin + itemWidth),
        //     y: r * (itemYMargin + itemHeight),
        // });
        console.log(this.row, this.col, 'to', r, c);
        TweenLite.to(this.element, 0.2, {
            x: c * (itemXMargin + itemWidth),
            y: r * (itemYMargin + itemHeight),
            autoAlpha: 1,
            scale: 1,
            onComplete: () => {
                this.positioned = true;
                this.row = r;
                this.col = c;
            },
            onStart: () => {
                this.positioned = false;
            }
        }, "reflow");
    }
}