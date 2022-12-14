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
    exports.xy2tileID = exports.createboard = void 0;
    ;
    let nf_piece_icons = [];
    nf_piece_icons[0 /* pieceType.pawn */] = String.fromCharCode(0xe261);
    nf_piece_icons[1 /* pieceType.rook */] = String.fromCharCode(0xe263);
    nf_piece_icons[2 /* pieceType.knight */] = String.fromCharCode(0xe25f);
    nf_piece_icons[3 /* pieceType.bishop */] = String.fromCharCode(0xe29c);
    nf_piece_icons[4 /* pieceType.queen */] = String.fromCharCode(0xe262);
    nf_piece_icons[5 /* pieceType.king */] = String.fromCharCode(0xe260);
    Object.freeze(nf_piece_icons);
    class Piece {
        constructor(type, isWhite) {
            this.type = type;
            this.isWhite = isWhite;
        }
        get icon() {
            return nf_piece_icons[this.type];
        }
        promptMove() {
            return null;
        }
    }
    ;
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
        constructor(board) {
            this.htmlboard = board;
            this.grid = [];
            for (let x = 0; x < 8; x++) {
                this.grid[x] = [];
                for (let y = 0; y < 8; y++)
                    this.grid[x][y] = null;
            }
            /* make array static BACK TO YOUR PRIMITIVE PAST BITCH
             * AHHAAH THIS IS YOUR NATURAL STATE THIS IS HOW YOU'RE
             * MEANT TO BE */
            Object.seal(this.grid);
        }
        /* now you've got me missing C++
         *
         * why cant i neatly implement
         * functions outside of the class
         * definition?? */
        initDefaultPieces() {
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    if (defaultlayout[y][x] != null)
                        // @ts-ignore
                        this.grid[x][y] = new Piece(defaultlayout[y][x][0], defaultlayout[y][x][1]);
                    else
                        this.grid[x][y] = null;
                }
            }
        }
        draw() {
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    const id = xy2tileID(x, y);
                    const tile = document.getElementById(id);
                    const p = this.grid[x][y];
                    if (!tile)
                        throw `missing tile at ${id}`;
                    if (p != null) {
                        tile.innerText = `${p.icon}`;
                        tile.style.color = p.isWhite ? "var(--cat-blue)" : "var(--cat-maroon)";
                    }
                    else
                        tile.innerText = "";
                }
            }
        }
    }
    ;
    function createboard() {
        let board = document.getElementById("board");
        let colour = false;
        if (!board)
            throw "board not found";
        for (var y = 0; y < 8; y++) {
            const tr = document.createElement("tr");
            for (var x = 0; x < 8; x++) {
                const t = document.createElement("td");
                /* in what function universe would
                 * `if(x & 1 == 0)` produce an error?
                 * why the fuck would `&` take precedence
                 * over `==` */
                if (colour)
                    t.className = "tile black";
                else
                    t.className = "tile white";
                t.id = xy2tileID(x, y);
                tr.append(t);
                /* "Type 'boolean' iis not assignable to type 'number'" 🤓
                * there is no difference there is no difference there is
                * no difference there is no difference there is no diffe */
                colour = !colour;
            }
            colour = !colour;
            board.append(tr);
        }
        return new Board(board);
    }
    exports.createboard = createboard;
    function xy2tileID(x, y) {
        const xcoord = "abcdefgh";
        return `TILE ${xcoord[x]}${y + 1}`;
    }
    exports.xy2tileID = xy2tileID;
});
// let print = console.log;
define("main", ["require", "exports", "chess"], function (require, exports, chess) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    chess = __importStar(chess);
    function main() {
        console.log("loaded");
        const board = chess.createboard();
        board.initDefaultPieces();
        board.draw();
    }
    main();
});
