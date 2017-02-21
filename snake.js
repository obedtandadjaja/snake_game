// DFS

var cols, rows;
var w = 20;
var currentCell;
var linkedlist;
var runInterval;
var cells = [];

function setup() {
  createCanvas(600, 600);
  cols = floor(width/w);
  rows = floor(height/w);

  for(i = 0; i < rows; i++) {
    cells[i] = [];
    for(j = 0; j < cols; j++) {
      cells[i].push(new Cell(i, j));
      if(i === 0 || j === 0 || i === (rows-1) || j === (cols-1)) {
        cells[i][j].isWall = true;
      }
    }
  }

  linkedlist = new LinkedList();

  var positionX = floor(random(1, cols-1));
  var positionY = floor(random(1, rows-1));
  var randomDirection = floor(random(0, 4));
  currentCell = cells[positionY][positionX];
  linkedlist.addFirst(currentCell);
  linkedlist.direction = randomDirection;

  spawnFood();

  runInterval = setInterval(run, 100);
}

function spawnFood() {
  var positionX = floor(random(1, cols-1));
  var positionY = floor(random(1, rows-1));
  var currentCell = cells[positionY][positionX];
  while(currentCell.visited && currentCell.isWall) {
    positionX = floor(random(1, cols-1));
    positionY = floor(random(1, rows-1));
    currentCell = cells[positionY][positionX];
  }
  currentCell.isFood = true;
}

function LinkedList() {
  this.head = undefined;
  this.tail = undefined;
  this.direction = 1;

  this.remove = function() {
    this.tail.cell.visited = false;
    if(this.tail) {
      if(this.tail.cell === this.head.cell) {
        this.tail.visited = false;
        this.tail = undefined;
        this.head = undefined;
      } else {
        this.tail.visited = false;
        this.tail = this.tail.prev;
        this.tail.next = undefined;
      }
    } else {
      return undefined;
    }
  };

  this.addFirst = function(cell) {
    cell.visited = true;
    if(this.head) {
      if(this.head.cell === this.tail.cell) {
        this.head = new Node(undefined, cell, this.tail);
        this.tail.prev = this.head;
      } else {
        this.head = new Node(undefined, cell, this.head);
        this.head.next.prev = this.head;
      }
    } else {
      this.head = new Node(undefined, cell, undefined);
      this.tail = new Node(undefined, cell, undefined);
    }
  };

  this.print = function() {
    current = this.head;
    while(current) {
      console.log(current.cell.row+" "+current.cell.col);
      current = current.next;
    }
  };
}

function Node(prev, cell, next) {
  this.cell = cell;
  this.next = next;
  this.prev = prev;
}

function draw() {
  background(200);
  for(i = 0; i < cells.length; i++) {
    for(j = 0; j < cells[i].length; j++) {
      if(cells[i][j].visited) {
        cells[i][j].highlight();
      } else if(cells[i][j].isFood) {
        cells[i][j].highlight2();
      } else {
        cells[i][j].show();
      }
    }
  }
}

document.onkeydown = checkKey;
function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    linkedlist.direction = 0;
  } else if (e.keyCode == '40') {
    linkedlist.direction = 2;
  } else if (e.keyCode == '37') {
    linkedlist.direction = 3;
  } else if (e.keyCode == '39') {
    linkedlist.direction = 1;
  }
}

function run() {
  current = linkedlist.head;
  next = undefined;
  if(linkedlist.direction === 0) {
    next = cells[current.cell.row-1][current.cell.col];
  } else if(linkedlist.direction === 1) {
    next = cells[current.cell.row][current.cell.col+1];
  } else if(linkedlist.direction === 2) {
    next = cells[current.cell.row+1][current.cell.col];
  } else if(linkedlist.direction === 3) {
    next = cells[current.cell.row][current.cell.col-1];
  }
  if(next.visited === true || next.isWall === true) {
    noLoop();
    alert("You lost");
    clearInterval(runInterval);
  } else if(next.isFood) {
    linkedlist.addFirst(next);
    next.isFood = false;
    spawnFood();
  } else {
    linkedlist.addFirst(next);
    linkedlist.remove();
  }
}

function Cell(row, col) {
  this.row = row;
  this.col = col;
  this.visited = false;
  this.isWall = false;
  this.isFood = false;

  this.show = function() {
    var x = this.col*w;
    var y = this.row*w;
    stroke(255);

    if(this.isWall) {
      noStroke();
      fill(0, 0, 0);
      rect(x, y, w, w);
    } else if(this.visited) {
      noStroke();
      fill(255, 0, 255, 100);
      rect(x, y, w, w);
    }
  };

  this.highlight2 = function() {
    var x = this.col*w;
    var y = this.row*w;
    noStroke();
    fill(255, 0, 0);
    rect(x, y, w, w);
  }

  this.highlight = function() {
    var x = this.col*w;
    var y = this.row*w;
    noStroke();
    fill(0, 0, 255, 100);
    rect(x, y, w, w);
  };
}
