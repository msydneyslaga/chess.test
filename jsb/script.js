var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
define("chess", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Board = void 0;
    ;
    let nf_piece_icons = [];
    nf_piece_icons[0 /* pieceType.pawn */] = String.fromCharCode(0xe261);
    nf_piece_icons[1 /* pieceType.rook */] = String.fromCharCode(0xe263);
    nf_piece_icons[2 /* pieceType.knight */] = String.fromCharCode(0xe25f);
    nf_piece_icons[3 /* pieceType.bishop */] = String.fromCharCode(0xe29c);
    nf_piece_icons[4 /* pieceType.queen */] = String.fromCharCode(0xe262);
    nf_piece_icons[5 /* pieceType.king */] = String.fromCharCode(0xe260);
    Object.freeze(nf_piece_icons);
    let focused_piece = null;
    class Piece {
        get xpos() { return this._xpos; }
        get ypos() { return this._ypos; }
        constructor(type, isWhite, x, y) {
            this._xpos = -1;
            this._ypos = -1;
            const tile = getTile(x, y);
            this.type = type;
            this.isWhite = isWhite;
            this._xpos = x;
            this._ypos = y;
            this.element = document.createElement("div");
            this.element.className = "piece";
            this.element.innerText = `${this.icon}`;
            this.element.style.color =
                this.isWhite ? "var(--cat-blue)" : "var(--cat-maroon)";
            /* unbelievably hack workaround.
             *
             * have i mentioned my hatred for javascript yet? */
            const p = this;
            const thisfix = function () { p.promptMove(); };
            this.element.onclick = thisfix;
            this.move(tile);
        }
        get icon() {
            return nf_piece_icons[this.type];
        }
        move(tile) {
            if (!tile)
                throw `missing tile at ${xy2tileID(this.xpos, this.ypos)}`;
            const coords = tile2xy(tile);
            tile.append(this.element);
            console.log(coords);
            this._xpos = coords[0];
            this._ypos = coords[1];
            focused_piece = null;
        }
        promptTile() {
        }
        promptTileRelative(relx, rely) {
            const tile = this.getTileRelative(relx, rely);
            if (!tile)
                return 1;
            const prompt = tile
                .getElementsByClassName("prompt")[0]; /* ??? */
            if (!prompt)
                return 1;
            prompt.classList.add("raise");
            return 0;
        }
        getTileRelative(relx, rely) {
            return getTile(this.xpos + relx, this.ypos + rely);
        }
        pawnMovement() {
            if (this.isWhite) {
                const diagne = this.getTileRelative(-1, -1);
                /* pawn can move one extra space on first row */
                if (this.ypos == 6)
                    this.promptTileRelative(0, -2);
                /* diagonal take */
                if (diagne === null || diagne === void 0 ? void 0 : diagne.getElementsByClassName("piece")[0])
                    this.promptTileRelative(-1, -1);
                this.promptTileRelative(0, -1);
            }
            else {
                /* pawn can move one extra space on first row */
                if (this.ypos == 1)
                    this.promptTileRelative(0, 2);
                this.promptTileRelative(0, 1);
            }
        }
        promptMove() {
            if (focused_piece == this) {
                focused_piece = null;
                remove_focus();
                return;
            }
            else if (focused_piece != null) {
                remove_focus();
                focused_piece = this;
            }
            else
                focused_piece = this;
            switch (this.type) {
                case 0 /* pieceType.pawn */:
                    this.pawnMovement();
                    break;
            }
        }
    }
    ;
    document.addEventListener("click", function (ev) {
        if (!focused_piece)
            return;
        if (!ev.target)
            return;
        const e = ev.target;
        if (e.closest(".prompt.raise")) {
            const t = e.closest(".tile");
            if (!t)
                throw "missing tile";
            focused_piece.move(t);
            remove_focus();
        }
    });
    function remove_focus() {
        const els = document.getElementsByClassName("prompt");
        /* lol */
        [].forEach.call(els, function (e) {
            e.classList.remove("raise");
        });
    }
    const defaultlayout = [
        [[1 /* pieceType.rook */, false], [2 /* pieceType.knight */, false], [3 /* pieceType.bishop */, false], [4 /* pieceType.queen */, false], [5 /* pieceType.king */, false], [3 /* pieceType.bishop */, false], [2 /* pieceType.knight */, false], [1 /* pieceType.rook */, false],],
        [[0 /* pieceType.pawn */, false], [0 /* pieceType.pawn */, false], [0 /* pieceType.pawn */, false], [0 /* pieceType.pawn */, false], [0 /* pieceType.pawn */, false], [0 /* pieceType.pawn */, false], [0 /* pieceType.pawn */, false], [0 /* pieceType.pawn */, false],],
        [null, null, null, null, null, null, null, null,],
        [null, null, null, null, null, null, null, null,],
        [null, null, null, null, null, null, null, null,],
        [null, null, null, null, null, null, null, null,],
        [[0 /* pieceType.pawn */, true], [0 /* pieceType.pawn */, true], [0 /* pieceType.pawn */, true], [0 /* pieceType.pawn */, true], [0 /* pieceType.pawn */, true], [0 /* pieceType.pawn */, true], [0 /* pieceType.pawn */, true], [0 /* pieceType.pawn */, true],],
        [[1 /* pieceType.rook */, true], [2 /* pieceType.knight */, true], [3 /* pieceType.bishop */, true], [4 /* pieceType.queen */, true], [5 /* pieceType.king */, true], [3 /* pieceType.bishop */, true], [2 /* pieceType.knight */, true], [1 /* pieceType.rook */, true],],
    ];
    class Board {
        constructor(width = 8, height = 8, z = 0) {
            this.pieces = [];
            const board = document.createElement("div");
            let colour = false;
            board.className = "board";
            board.style.zIndex = `${z}`;
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    const t = document.createElement("div");
                    const prompt = document.createElement("div");
                    prompt.className = "prompt";
                    /* in what function universe would
                     * `if(x & 1 == 0)` produce an error?
                     * why the fuck would `&` take precedence
                     * over `==` */
                    if (colour)
                        t.className = "tile black";
                    else
                        t.className = "tile white";
                    t.id = xy2tileID(x, y, z);
                    t.append(prompt);
                    board.append(t);
                    /* "Type 'boolean' iis not assignable to type 'number'" 🤓 */
                    colour = !colour;
                }
                colour = !colour;
            }
            this.html = board;
        }
        /* now you've got me missing C++
         *
         * why cant i neatly implement
         * functions outside of the class
         * definition?? */
        initDefaultPieces() {
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    const p = defaultlayout[y][x];
                    if (p != null)
                        this.pieces.push(new Piece(p[0], p[1], x, y));
                }
            }
        }
        forceDraw() {
            var _a;
            this.pieces.forEach(function (p) {
                if (inBoardBounds(p.xpos, p.ypos)) {
                    const tile = getTile(p.xpos, p.ypos);
                    p.move(tile);
                }
            });
            (_a = getTile(5, 4)) === null || _a === void 0 ? void 0 : _a.append(new Board(8, 8, 1).html);
        }
    }
    exports.Board = Board;
    ;
    function xy2tileID(x, y, z = 0) {
        const xcoord = String.fromCharCode(x + 97);
        return `TILE ${z}${xcoord}${y + 1}`;
    }
    function getTile(x, y, z = 0) {
        return document.getElementById(xy2tileID(x, y));
    }
    function tile2xy(t) {
        /* assumes tile ID is of form /TILE [0-9]+[a-z]+[0-9]+/ */
        const coords = t.id.match(/TILE ([0-9]+)([a-z]+)([0-9]+)/);
        if (!coords
            || !coords[1]
            || !coords[2]
            || !coords[3])
            throw "bad tile ID";
        return [
            coords[2].charCodeAt(0) - 97,
            parseInt(coords[3]) - 1,
            parseInt(coords[1]),
        ];
    }
    function inBoardBounds(x, y) {
        return (x < 8) && (y < 8);
    }
});
// let print = console.log;
define("main", ["require", "exports", "chess"], function (require, exports, chess) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    chess = __importStar(chess);
    function main() {
        console.log("loaded");
        const container = document.getElementById("board-container");
        const board = new chess.Board(8, 8);
        if (!container)
            throw 'no container';
        container.append(board.html);
        board.initDefaultPieces();
        board.forceDraw();
    }
    main();
});
