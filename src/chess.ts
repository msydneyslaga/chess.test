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

let focused_piece: (Piece | null) = null;

class Piece
{
	private type: pieceType;
	readonly element: HTMLElement;
	public isWhite: boolean;

	private _xpos: number = -1;
	private _ypos: number = -1;

	get xpos()			{ return this._xpos; }
	get ypos()			{ return this._ypos; }

	constructor(type: pieceType, isWhite: boolean, x: number, y: number)
	{
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

		/* unbelievably hack workaround. */
		const p = this;
		const thisfix = function() { p.promptMove(); };
		this.element.onclick = thisfix;

		this.move(tile);
	}

	get icon(): string
	{
		return nf_piece_icons[this.type];
	}

	move(tile: HTMLElement | null): void
	{
		if(!tile)
			throw `missing tile at ${xy2tileID(this.xpos, this.ypos)}`;

		const pieces = tile.getElementsByClassName("piece");

		[].forEach.call(pieces, function(e: HTMLElement)
		{
			e.remove();
		});

		const coords = tile2xy(tile);
		tile.append(this.element);

		console.log(coords);
		this._xpos = coords[0];
		this._ypos = coords[1];

		// @ts-ignore
		document.getElementById("explode-audio")?.play();

		focused_piece = null;
	}

	private promptTileRelative(relx: number, rely: number)
	{
		const tile = this.getTileRelative(relx, rely);

		if(!tile)
			return 1;

		return this.promptTile(tile);
	}
	
	private promptTile(tile: HTMLElement)
	{
		const prompt = tile
			.getElementsByClassName("prompt")[0] as HTMLElement; /* ??? */

		if(!prompt)
			return 1;

		prompt.classList.add("raise");

		return 0;
	}

	private getTileRelative(relx: number, rely: number)
	{
		return getTile(this.xpos + relx, this.ypos + rely);
	}

	private promptRelativeIfEmpty(relx: number, rely: number)
	{
		const tile = this.getTileRelative(relx, rely);

		if(tile && !tile?.getElementsByClassName("piece")[0])
			this.promptTile(tile);
	}

	private pawnMovement(): void
	{
		if(this.isWhite)
		{
			const diagnw = this.getTileRelative(-1, -1);
			const diagne = this.getTileRelative(1, -1);
			/* pawn can move one extra space on first row */
			if(this.ypos == 6)
				this.promptTileRelative(0, -2);

			/* diagonal take */
			if(diagnw?.getElementsByClassName("piece")[0])
				this.promptTileRelative(-1, -1);

			/* diagonal take */
			if(diagne?.getElementsByClassName("piece")[0])
				this.promptTileRelative(1, -1);

			this.promptTileRelative(0, -1);
		}
		else
		{
			const diagsw = this.getTileRelative(-1, 1);
			const diagse = this.getTileRelative(1, 1);
			/* pawn can move one extra space on first row */
			if(this.ypos == 1)
				this.promptTileRelative(0, 2);

			/* diagonal take */
			if(diagsw?.getElementsByClassName("piece")[0])
				this.promptTileRelative(-1, 1);

			/* diagonal take */
			if(diagse?.getElementsByClassName("piece")[0])
				this.promptTileRelative(1, 1);

			this.promptTileRelative(0, 1);
		}
	}

	/* this is the worst code i have ever written lmfaooo */
	private rookMovement(): void
	{
		let y1 = 1;
		let y2 = 1;
		let x1 = 1;
		let x2 = 1;
		while(y1 < 8)
		{
			const tile = this.getTileRelative(0, -y1);
			if(tile?.getElementsByClassName("piece")[0])
				break;
			if(tile)
				this.promptTile(tile);
			y1++;
		}
		while(y2 < 8)
		{
			const tile = this.getTileRelative(0, y2);
			if(tile?.getElementsByClassName("piece")[0])
				break;
			if(tile)
				this.promptTile(tile);
			y2++;
		}
		while(x1 < 8)
		{
			const tile = this.getTileRelative(-x1, 0);
			if(tile?.getElementsByClassName("piece")[0])
				break;
			if(tile)
				this.promptTile(tile);
			x1++;
		}
		while(x2 < 8)
		{
			const tile = this.getTileRelative(x2, 0);
			if(tile?.getElementsByClassName("piece")[0])
				break;
			if(tile)
				this.promptTile(tile);
			x2++;
		}
	}

	private knightMovement(): void
	{
		this.promptTileRelative(1, 2);
		this.promptTileRelative(-1, 2);
		this.promptTileRelative(1, -2);
		this.promptTileRelative(-1, -2);
		this.promptTileRelative(2, -1);
		this.promptTileRelative(-2, -1);
		this.promptTileRelative(2, 1);
		this.promptTileRelative(-2, 1);
	}

	private bishopMovement(): void
	{
		let ne = 1;
		let nw = 1;
		let se = 1;
		let sw = 1;
		while(ne < 8)
		{
			const tile = this.getTileRelative(-ne, -ne);
			if(tile?.getElementsByClassName("piece")[0])
				break;
			if(tile)
				this.promptTile(tile);
			ne++;
		}
		while(nw < 8)
		{
			const tile = this.getTileRelative(nw, -nw);
			if(tile?.getElementsByClassName("piece")[0])
				break;
			if(tile)
				this.promptTile(tile);
			nw++;
		}
		while(sw < 8)
		{
			const tile = this.getTileRelative(-sw, sw);
			if(tile?.getElementsByClassName("piece")[0])
				break;
			if(tile)
				this.promptTile(tile);
			sw++;
		}
		while(se < 8)
		{
			const tile = this.getTileRelative(se, se);
			if(tile?.getElementsByClassName("piece")[0])
				break;
			if(tile)
				this.promptTile(tile);
			se++;
		}
	}

	private queenMovement(): void
	{
		this.rookMovement();
		this.bishopMovement();
	}

	private kingMovement(): void
	{
		this.promptRelativeIfEmpty(1, 1);
		this.promptRelativeIfEmpty(-1, 1);
		this.promptRelativeIfEmpty(1, -1);
		this.promptRelativeIfEmpty(-1, -1);
		this.promptRelativeIfEmpty(0, -1);
		this.promptRelativeIfEmpty(0, 1);
		this.promptRelativeIfEmpty(1, 0);
		this.promptRelativeIfEmpty(-1, 0);
	}

	promptMove(): void
	{
		if(focused_piece == this)
		{
			focused_piece = null;
			remove_focus();
			return;
		}
		else if(focused_piece != null)
		{
			remove_focus();
			focused_piece = this;
		}
		else
			focused_piece = this;

		switch(this.type)
		{
			case pieceType.pawn:
				this.pawnMovement();
				break;
			case pieceType.rook:
				this.rookMovement();
				break;
			case pieceType.knight:
				this.knightMovement();
				break;
			case pieceType.bishop:
				this.bishopMovement();
				break;
			case pieceType.queen:
				this.queenMovement();
				break;
			case pieceType.king:
				this.kingMovement();
				break;
		}
	}
};

document.addEventListener("click", function(ev: Event)
{
	if(!focused_piece)
		return;

	if(!ev.target)
		return;

	const e = ev.target as HTMLElement;

	if(e.closest(".prompt.raise"))
	{
		const t = e.closest(".tile") as HTMLElement;

		if(!t)
			throw "missing tile";

		focused_piece.move(t);
		remove_focus();
	}
});

function remove_focus()
{
	const els = document.getElementsByClassName("prompt");

	/* lol */
	[].forEach.call(els, function(e: HTMLElement)
	{
		e.classList.remove("raise");
	});
}

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
	readonly html: HTMLElement;
	private pieces: Piece[] = [];

	constructor(width: number = 8, height: number = 8, z: number = 0)
	{
		const board = document.createElement("div");
		let colour = false;
		board.className = "board";
		board.style.zIndex = `${z}`;

		for(var y = 0; y < height; y++)
		{
			for(var x = 0; x < width; x++)
			{
				const t = document.createElement("div");
				const prompt = document.createElement("div");
				prompt.className = "prompt";

				if(colour)
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

	getPieceByCoords(x: number, y: number): (Piece | null)
	{
		let r: (Piece | null) = null;
		this.pieces.forEach(function(p)
		{
			if((p.xpos == x) && (p.ypos == y))
				return r = p;
			return null;
		});

		return r;
	}

	forceDraw(): void
	{
		this.pieces.forEach(function(p)
		{
			if(inBoardBounds(p.xpos, p.ypos))
			{
				const tile = getTile(p.xpos, p.ypos);

				p.move(tile);
			}
		});

		getTile(5, 4)?.append(new Board(8, 8, 1).html);
	}
};

function xy2tileID(x: number, y: number, z: number = 0): string
{
	const xcoord = String.fromCharCode(x + 97);
	return `TILE ${z}${xcoord}${y + 1}`;
}

function getTile(x: number, y: number, z: number = 0): (HTMLElement | null)
{
	return document.getElementById(xy2tileID(x, y));
}

function tile2xy(t: HTMLElement): [x: number, y: number, z: number]
{
	/* assumes tile ID is of form /TILE [0-9]+[a-z]+[0-9]+/ */

	const coords = t.id.match(/TILE ([0-9]+)([a-z]+)([0-9]+)/)

	if(!coords
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

function inBoardBounds(x: number, y: number): boolean
{
	return (x < 8) && (y < 8);
}

