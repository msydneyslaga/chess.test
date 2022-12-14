const enum pieceType
{
	pawn,
	rook,
	knight,
	bishop,
	queen,
	king,
};

let nf_piece_icons: string[] = [];
nf_piece_icons[pieceType.pawn] = String.fromCharCode(0xe261);
nf_piece_icons[pieceType.rook] = String.fromCharCode(0xe263);
nf_piece_icons[pieceType.knight] = String.fromCharCode(0xe25f);
nf_piece_icons[pieceType.bishop] = String.fromCharCode(0xe29c);
nf_piece_icons[pieceType.queen] = String.fromCharCode(0xe262);
nf_piece_icons[pieceType.king] = String.fromCharCode(0xe260);
Object.freeze(nf_piece_icons);

class Piece
{
	readonly type: pieceType;
	isWhite: boolean;

	private _xpos: number = -1;
	private _ypos: number = -1;

	constructor(type: pieceType, isWhite: boolean, x: number, y: number)
	{
		this.type = type;
		this.isWhite = isWhite;
		this.xpos = x;
		this.ypos = y;
	}

	get icon(): string
	{
		return nf_piece_icons[this.type];
	}

	set xpos(n: number)	{ this._xpos = n; }
	set ypos(n: number)	{ this._ypos = n; }
	get xpos()			{ return this._xpos; }
	get ypos()			{ return this._ypos; }

	move(tile: HTMLElement | null): void
	{
		if(!tile)
			throw `missing tile at ${xy2tileID(this.xpos, this.ypos)}`;

		tile.innerText = `${this.icon}`;
		tile.style.color = this.isWhite ? "var(--cat-blue)" : "var(--cat-maroon)";
		tile.onclick = this.promptMove;
		tile.style.cursor = "pointer";
	}

	promptMove(): (HTMLElement | null)
	{
		this.promptTile();
		return null;
	}

	private promptTile(): void
	{
		switch(this.type)
		{
			case pieceType.pawn:
			{
				break;
			}
		}
	}
};

const defaultlayout: ([pieceType, boolean] | null)[][] =
[
	[[pieceType.rook, false],	[pieceType.knight, false],	[pieceType.bishop, false],	[pieceType.queen, false],	[pieceType.king, false],	[pieceType.bishop, false],	[pieceType.knight, false],	[pieceType.rook, false],],
	[[pieceType.pawn, false],	[pieceType.pawn, false],		[pieceType.pawn, false],		[pieceType.pawn, false],		[pieceType.pawn, false],	[pieceType.pawn, false],		[pieceType.pawn, false],		[pieceType.pawn, false],],
	[null,				null,				null,				null,				null,			null,				null,				null,],
	[null,				null,				null,				null,				null,			null,				null,				null,],
	[null,				null,				null,				null,				null,			null,				null,				null,],
	[null,				null,				null,				null,				null,			null,				null,				null,],
	[[pieceType.pawn, true],	[pieceType.pawn, true],		[pieceType.pawn, true],		[pieceType.pawn, true],		[pieceType.pawn, true],	[pieceType.pawn, true],		[pieceType.pawn, true],		[pieceType.pawn, true],],
	[[pieceType.rook, true],	[pieceType.knight, true],	[pieceType.bishop, true],	[pieceType.queen, true],	[pieceType.king, true],	[pieceType.bishop, true],	[pieceType.knight, true],	[pieceType.rook, true],],
];

export class Board
{
	private htmlboard: HTMLElement;
	private pieces: Piece[] = [];

	constructor(width: number = 8, height: number = 8)
	{
		const boardbg = document.createElement("div");
		const board = document.createElement("table");
		let colour = false;

		boardbg.style.textAlign = "center";
		boardbg.style.margin = "0 auto";
		boardbg.style.height = "80vh";
		boardbg.style.aspectRatio = `${width} / ${height}`;
		boardbg.style.backgroundColor = "var(--cat-crust)";
		boardbg.style.color = "var(--cat-base)";

		board.style.width = "100%";
		board.style.aspectRatio = `${width} / ${height}`;

		for(var y = 0; y < height; y++)
		{
			const tr = document.createElement("tr");
			tr.style.height = `${Math.floor(100 / height)}%`
			tr.style.width = "100%";

			for(var x = 0; x < width; x++)
			{
				const t = document.createElement("td");

				/* in what function universe would
				 * `if(x & 1 == 0)` produce an error?
				 * why the fuck would `&` take precedence
				 * over `==` */
				if(colour)
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

		boardbg.append(board);
		document.body.append(boardbg);
		this.htmlboard = boardbg
	}

	/* now you've got me missing C++
	 *
	 * why cant i neatly implement
	 * functions outside of the class
	 * definition?? */
	initDefaultPieces(): void
	{
		for(let y = 0; y < 8; y++)
		{
			for(let x = 0; x < 8; x++)
			{
				const p = defaultlayout[y][x];

				if(p != null)
					this.pieces.push(new Piece(p[0], p[1], x, y));
			}
		}
	}

	draw(): void
	{
		this.pieces.forEach(function(p)
		{
			console.log(p);
			if(inBoardBounds(p.xpos, p.ypos))
			{
				const tile = getTile(p.xpos, p.ypos);

				p.move(tile);
			}
		});
	}
};

export function xy2tileID(x: number, y: number)
{
	const xcoord = "abcdefgh";
	return `TILE ${xcoord[x]}${y + 1}`;
}

export function getTile(x: number, y: number)
{
	return document.getElementById(xy2tileID(x, y));
}

function inBoardBounds(x: number, y: number)
{
	return (x < 8) && (y < 8);
}
