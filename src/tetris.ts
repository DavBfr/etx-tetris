class Point {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

abstract class Shape {
    public points!: Point[]; // points that make up this shape
    public rotation = 0; // what rotation 0,1,2,3
    public fillColor!: number;

    private move(x: number, y: number): Point[] {
        let newPoints = [];

        for (let i = 0; i < this.points.length; i++) {
            newPoints.push(new Point(this.points[i].x + x, this.points[i].y + y));
        }
        return newPoints;
    }

    public setPos(newPoints: Point[]) {
        this.points = newPoints;
    }

    // return a set of points showing where this shape would be if we dropped it one
    public drop(): Point[] {
        return this.move(0, 1);
    }

    // return a set of points showing where this shape would be if we moved left one
    public moveLeft(): Point[] {
        return this.move(-1, 0);
    }

    // return a set of points showing where this shape would be if we moved right one
    public moveRight(): Point[] {
        return this.move(1, 0);
    }

    // override these
    // return a set of points showing where this shape would be if we rotate it
    public abstract rotate(clockwise: boolean): Point[];
}


class SquareShape extends Shape {
    constructor(cols: number) {
        super();
        this.fillColor = lcd.RGB(0, 255, 0); //'green';
        let x = cols / 2;
        let y = -2;
        this.points = [];
        this.points.push(new Point(x, y));
        this.points.push(new Point(x + 1, y));
        this.points.push(new Point(x, y + 1));
        this.points.push(new Point(x + 1, y + 1));
    }

    public rotate(clockwise: boolean): Point[] {
        // this shape does not rotate
        return this.points;
    }
}

class LShape extends Shape {
    private leftHanded: boolean;

    constructor(leftHanded: boolean, cols: number) {
        super();
        this.leftHanded = leftHanded;
        if (leftHanded)
            this.fillColor = lcd.RGB(0, 128, 0); // 'yellow';
        else
            this.fillColor = lcd.RGB(128, 255, 128); //'white';

        let x = cols / 2;
        let y = -2;
        this.points = [];

        this.points.push(new Point(x, y - 1));
        this.points.push(new Point(x, y)); // 1 is our base point
        this.points.push(new Point(x, y + 1));
        this.points.push(new Point(x + (leftHanded ? -1 : 1), y + 1));
    }

    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 4;
        let newPoints = [];
        switch (this.rotation) {
            case 0:
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? -1 : 1), this.points[1].y + 1));
                break;
            case 1:
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y + (this.leftHanded ? -1 : 1)));
                break;
            case 2:
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? 1 : -1), this.points[1].y - 1));
                break;
            case 3:
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y + (this.leftHanded ? 1 : -1)));
                break;
        }
        return newPoints;
    }
}

class StepShape extends Shape {
    private leftHanded: boolean;
    constructor(leftHanded: boolean, cols: number) {
        super();
        if (leftHanded)
            this.fillColor = lcd.RGB(0, 255, 255); //'cyan';
        else
            this.fillColor = lcd.RGB(255, 255, 0); //'magenta';

        this.leftHanded = leftHanded;
        let x = cols / 2;
        let y = -1;

        this.points = [];
        this.points.push(new Point(x + (leftHanded ? 1 : -1), y));
        this.points.push(new Point(x, y)); // point 1 is our base point
        this.points.push(new Point(x, y - 1));
        this.points.push(new Point(x + (leftHanded ? -1 : 1), y - 1));
    }


    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 2;

        let newPoints = [];

        switch (this.rotation) {
            case 0:
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? 1 : -1), this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? -1 : 1), this.points[1].y - 1));
                break;
            case 1:
                newPoints.push(new Point(this.points[1].x, this.points[1].y + (this.leftHanded ? 1 : -1)));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y + (this.leftHanded ? -1 : 1)));
                break;
        }
        return newPoints;
    }
}

class StraightShape extends Shape {
    constructor(cols: number) {
        super();
        this.fillColor = lcd.RGB(0, 0, 255); //'blue';
        let x = cols / 2;
        let y = -2;
        this.points = [];
        this.points.push(new Point(x, y - 2));
        this.points.push(new Point(x, y - 1));
        this.points.push(new Point(x, y)); // point 2 is our base point
        this.points.push(new Point(x, y + 1));
    }

    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 2;
        let newPoints = [];
        switch (this.rotation) {
            case 0:
                newPoints[0] = new Point(this.points[2].x, this.points[2].y - 2);
                newPoints[1] = new Point(this.points[2].x, this.points[2].y - 1);
                newPoints[2] = new Point(this.points[2].x, this.points[2].y);
                newPoints[3] = new Point(this.points[2].x, this.points[2].y + 1);
                break;
            case 1:
                newPoints[0] = new Point(this.points[2].x + 2, this.points[2].y);
                newPoints[1] = new Point(this.points[2].x + 1, this.points[2].y);
                newPoints[2] = new Point(this.points[2].x, this.points[2].y);
                newPoints[3] = new Point(this.points[2].x - 1, this.points[2].y);
                break;
        }
        return newPoints;
    }
}

class TShape extends Shape {
    constructor(cols: number) {
        super();
        this.fillColor = lcd.RGB(255, 0, 0); //'red';
        this.points = [];
        let x = cols / 2;
        let y = -2;
        this.points.push(new Point(x - 1, y));
        this.points.push(new Point(x, y)); // point 1 is our base point
        this.points.push(new Point(x + 1, y));
        this.points.push(new Point(x, y + 1));
    }

    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 4;
        let newPoints = [];
        switch (this.rotation) {
            case 0:
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                break;
            case 1:
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                break;
            case 2:
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                break;
            case 3:
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                break;
        }
        return newPoints;
    }
}

class Grid {
    private rows: number;
    public cols: number;
    public blockSize: number;
    private blockColor: number[][];
    public backColor: number;
    private xOffset: number;
    private yOffset: number;

    constructor(rows: number, cols: number, backColor: number, w: number, h: number) {
        let blockSize = 0;
        blockSize = h / rows;
        this.blockSize = blockSize;
        this.backColor = backColor;
        this.cols = cols;
        this.rows = rows;
        this.blockColor = [];
        for (let r = 0; r < rows; r++) {
            let col = [];
            for (let c = 0; c < cols; c++) {
                col.push(0);
            }
            this.blockColor.push(col);
        }
        this.xOffset = w / 2 - blockSize * cols / 2;
        this.yOffset = h / 2 - blockSize * rows / 2;
    }

    public draw(shape: Shape) {
        this.paintShape(shape, shape.fillColor);
    }

    public erase(shape: Shape) {
        this.paintShape(shape, this.backColor);
    }

    private paintShape(shape: Shape, color: number) {
        shape.points.forEach(p => this.paintSquare(p.y, p.x, color));
    }

    public getPreferredSize(): Point {
        return new Point(this.blockSize * this.cols, this.blockSize * this.rows);
    }

    // check the set of points to see if they are all free
    public isPosValid(points: Point[]) {
        let valid: boolean = true;
        for (let i = 0; i < points.length; i++) {
            if ((points[i].x < 0) ||
                (points[i].x >= this.cols) ||
                (points[i].y >= this.rows)) {
                valid = false;
                break;
            }
            if (points[i].y >= 0) {
                if (this.blockColor[points[i].y][points[i].x] != this.backColor) {
                    valid = false;
                    break;
                }
            }
        }
        return valid;
    }

    public addShape(shape: Shape) {
        for (let i = 0; i < shape.points.length; i++) {
            if (shape.points[i].y < 0) {
                // a block has landed and it isn't even fully on the grid yet
                return false;
            }
            this.blockColor[shape.points[i].y][shape.points[i].x] = shape.fillColor;
        }
        return true;
    }

    private eraseGrid() {
        let width = this.cols * this.blockSize;
        let height = this.rows * this.blockSize;

        lcd.drawFilledRectangle(this.xOffset, this.yOffset, width, height, this.backColor);
    }

    public clearGrid() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.blockColor[row][col] = this.backColor;
            }
        }
    }

    private paintSquare(row: number, col: number, color: number) {
        if (row >= 0) { // don't paint rows that are above the grid
            lcd.drawFilledRectangle(this.xOffset + col * this.blockSize, this.yOffset + row * this.blockSize, this.blockSize - 1, this.blockSize - 1, color);
        }
    }

    private drawGrid() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.blockColor[row][col] !== this.backColor) {
                    this.paintSquare(row, col, this.blockColor[row][col]);
                }
            }
        }
    }

    public paint() {
        this.eraseGrid();
        this.drawGrid();
    }

    // only the rows in last shape could have been filled
    public checkRows(lastShape: Shape) {
        let rowMin = lastShape.points[0].y;
        let rowMax = lastShape.points[0].y;
        let rowComplete;
        let rowsRemoved = 0;
        for (let i = 1; i < lastShape.points.length; i++) {
            if (lastShape.points[i].y < rowMin) {
                rowMin = lastShape.points[i].y;
            }
            if (lastShape.points[i].y > rowMax) {
                rowMax = lastShape.points[i].y;
            }
        }
        if (rowMin < 0) {
            rowMin = 0;
        }

        while (rowMax >= rowMin) {
            rowComplete = true;
            for (let col = 0; col < this.cols; col++) {
                if (this.blockColor[rowMax][col] == this.backColor) {
                    rowComplete = false;
                    break;
                }
            }
            if (rowComplete) {
                rowsRemoved++;
                // shuffle down, stay on this row
                for (let r = rowMax; r >= 0; r--) {
                    for (let col = 0; col < this.cols; col++) {
                        if (r > 0)
                            this.blockColor[r][col] = this.blockColor[r - 1][col];
                        else
                            this.blockColor[r][col] = this.backColor;
                    }
                }
                rowMin++;
            }
            else {
                // move up a row
                rowMax--;
            }
        }

        return rowsRemoved;
    }
}


class Message {
    private game: Game
    private messageLabel?: any;
    private margin = 20;

    constructor(game: Game) {
        this.game = game;
    }

    public setMessage(message: string): void {
        this.messageLabel = message;
    }

    public clearMessage(): void {
        this.messageLabel = null;
    }

    public draw() {
        if (this.messageLabel == null) {
            return;
        }

        lcd.drawFilledRectangle(this.margin, this.margin, game.w - this.margin * 2, game.h - this.margin * 2, COLOR_THEME_SECONDARY1, 1);
        lcd.drawRectangle(this.margin, this.margin, game.w - this.margin * 2, game.h - this.margin * 2, COLOR_THEME_PRIMARY1, 2);
        lcd.drawText(game.w / 2, game.h / 2, this.messageLabel, COLOR_THEME_PRIMARY1 | CENTER | VCENTER | DBLSIZE);
    }
}

class Game {
    private currentShape!: Shape;
    private grid: Grid;
    private speed: number; // in milliseconds
    private level: number = -1;
    private rowsCompleted: number = 0;
    static gameState = { initial: 0, playing: 1, paused: 2, gameOver: 3 };
    private phase = Game.gameState.initial;
    private score: number = 0;
    private scoreLabel?: string;
    private rowsLabel?: string;
    private levelLabel?: string;
    private message: Message;
    private timerToken: number = 0;
    public w: number;
    public h: number;

    constructor(w: number, h: number) {
        this.w = w;
        this.h = h;
        this.message = new Message(this);
        this.grid = new Grid(16, 10, lcd.RGB(128, 128, 128), w, h);
        this.speed = 1000;
        this.message.setMessage("TETRIS\nPress SYS to start");
        this.timerToken = getTime();
    }

    private draw() {
        lcd.clear(COLOR_THEME_PRIMARY2);
        this.grid.paint();
        if (this.phase == Game.gameState.playing) {
            this.grid.draw(this.currentShape);
        }
        if (this.scoreLabel != null) {
            lcd.drawText(10, 10, `Score: ${this.scoreLabel}`, SMLSIZE | COLOR_THEME_PRIMARY1);
        }
        if (this.levelLabel != null) {
            lcd.drawText(10, 23, `Level: ${this.levelLabel}`, SMLSIZE | COLOR_THEME_PRIMARY1);
        }
        if (this.rowsLabel != null) {
            lcd.drawText(10, 36, `Rows: ${this.rowsLabel}`, SMLSIZE | COLOR_THEME_PRIMARY1);
        }
        this.message.draw();
    }

    private newGame() {
        this.message.clearMessage();
        this.grid.clearGrid();
        this.currentShape = this.newShape();
        this.score = 0;
        this.rowsCompleted = 0;
        this.score = 0;
        this.level = -1;
        this.speed = 1000;
        this.phase = Game.gameState.playing;
        this.incrementLevel(); // will start the game timer & update the labels
    }

    private updateLabels() {
        this.scoreLabel = this.score.toString();
        this.rowsLabel = this.rowsCompleted.toString();
        this.levelLabel = this.level.toString();
    }

    private gameTimer() {
        if (this.phase == Game.gameState.playing) {
            let points = this.currentShape.drop();
            if (this.grid.isPosValid(points)) {
                this.currentShape.setPos(points);
            }
            else {
                this.shapeFinished();
            }
        }
    }

    private keyHandler(event: any) {
        let points!: Point[];
        if (this.phase == Game.gameState.playing) {
            switch (event) {
                case EVT_VIRTUAL_NEXT: // right
                    points = this.currentShape.moveRight();
                    break;
                case EVT_VIRTUAL_PREV: // left
                    points = this.currentShape.moveLeft();
                    break;
                case EVT_TELEM_FIRST:
                    points = this.currentShape.rotate(true);
                    break;
                case EVT_VIRTUAL_NEXT_PAGE:
                    // erase ourself first
                    points = this.currentShape.drop();
                    while (this.grid.isPosValid(points)) {
                        this.currentShape.setPos(points);
                        points = this.currentShape.drop();
                    }

                    this.shapeFinished();
                    break;
            }

            switch (event) {
                case EVT_VIRTUAL_NEXT: // right
                case EVT_VIRTUAL_PREV: // left
                case EVT_TELEM_FIRST:
                    if (this.grid.isPosValid(points)) {
                        this.currentShape.setPos(points);
                    }
                    break;
            }
        }

        if (event == EVT_SYS_BREAK) {
            this.newGame();
        }
        else if (event == EVT_MODEL_FIRST) { // Pause
            this.togglePause();
        }
    }

    private togglePause() {
        if (this.phase == Game.gameState.paused) {
            this.message.clearMessage();
            this.phase = Game.gameState.playing;
            this.draw(); // kick the render loop off again
        }
        else if (this.phase == Game.gameState.playing) {
            this.phase = Game.gameState.paused;
            this.showMessage("PAUSED");
        }
    }

    private showMessage(message: string) {
        this.message.setMessage(message);
    }

    private incrementLevel() {
        this.level++;
        if (this.level < 10) {
            this.speed = 1000 - (this.level * 100);
        }
        this.updateLabels();
    }

    private shapeFinished() {
        if (this.grid.addShape(this.currentShape)) {
            this.grid.draw(this.currentShape);
            let completed = this.grid.checkRows(this.currentShape); // and erase them
            this.rowsCompleted += completed;
            this.score += (completed * (this.level + 1) * 10);
            if (this.rowsCompleted > ((this.level + 1) * 10)) {
                this.incrementLevel();
            }
            this.updateLabels();

            this.currentShape = this.newShape();
        }
        else {
            // game over!
            this.phase = Game.gameState.gameOver;
            this.showMessage("GAME OVER\nPress SYS to Restart");
        }
    }

    private newShape(): Shape {
        // 7 shapes
        let randomShape = Math.floor(Math.random() * 7);
        let newShape: Shape;
        switch (randomShape) {
            case 0:
                newShape = new LShape(false, this.grid.cols);
                break;
            case 1:
                newShape = new LShape(true, this.grid.cols);
                break;
            case 2:
                newShape = new TShape(this.grid.cols);
                break;
            case 3:
                newShape = new StepShape(false, this.grid.cols);
                break;
            case 4:
                newShape = new StepShape(true, this.grid.cols);
                break;
            case 5:
                newShape = new SquareShape(this.grid.cols);
                break;
            case 6:
                newShape = new StraightShape(this.grid.cols);
                break;
        }
        return newShape!;
    }

    public run(event: any, touchState: any): number {
        const t = getTime();
        if ((t - this.timerToken) * 10 >= this.speed) {
            this.gameTimer();
            this.timerToken = t;
        }
        this.draw();

        this.keyHandler(event);
        return 0;
    }
}

let game!: Game;

function init(w: number = LCD_W, h: number = LCD_H): void {
    game = new Game(w, h);

}

function run(event: any, touchState: any): number {

    return game.run(event, touchState);
}

export { init, run }
