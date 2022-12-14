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

let prompted_tiles: HTMLElement[] = [];

class Piece
{
	private type: pieceType;
	private element: HTMLElement;
	public isWhite: boolean;

	private _xpos: number = -1;
	private _ypos: number = -1;

	set xpos(n: number)	{ this._xpos = n; }
	get xpos()			{ return this._xpos; }

	set ypos(n: number)	{ this._ypos = n; }
	get ypos()			{ return this._ypos; }

	constructor(type: pieceType, isWhite: boolean, x: number, y: number)
	{
		const tile = getTile(x, y);

		this.type = type;
		this.isWhite = isWhite;
		this.xpos = x;
		this.ypos = y;


		this.element = document.createElement("div");
		this.element.className = "piece";
		this.element.innerText = `${this.icon}`;
		this.element.style.color =
			this.isWhite ? "var(--cat-blue)" : "var(--cat-maroon)";

		/* unbelievably hack workaround.
		 *
		 * have i mentioned my hatred for javascript yet? */
		const p = this;
		const test = function() { p.promptMove(); };
		this.element.onclick = test;

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

		tile.append(this.element);
	}

	private promptTile(): void
	{
	}

	/* return non-zero on out-of-bounds */
	private promptTileRelative(relx: number, rely: number): number
	{
		const tile = getTile(this.xpos + relx, this.ypos + rely);

		if(!tile)
			return 1;

		prompted_tiles.push(tile);

		return 0;
	}

	private doPromptMove(): void
	{
		// function promptlistener(ev: Event)
		// {
		// 	if(ev.target)
		// 	{
		// 		document.removeEventListener("click", promptlistener);
		// 		return;
		// 	}

		// 	const t = ev.target as HTMLElement;
		// 	console.log(ev.target);
		// 	console.log(t.className);

		// 	// if(ev.target.className != "tile prompt")
		// 	// 	document.removeEventListener("click", promptlistener);
		// }

		// document.addEventListener("click", promptlistener);

		prompted_tiles.forEach(function(t: HTMLElement)
		{
			const prompt = document.createElement("div");
			prompt.className = "prompt";

			t.append(prompt);
		});
	}

	promptMove(): (HTMLElement | null)
	{
		switch(this.type)
		{
			case pieceType.pawn:
			{
				if(this.isWhite)
				{
					/* pawn can move one extra space on first row */
					if(this.ypos == 6)
						this.promptTileRelative(0, -2);
					this.promptTileRelative(0, -1);
				}
				else
				{
					if(this.ypos == 1)
						this.promptTileRelative(0, 2);
					this.promptTileRelative(0, 1);
				}
				break;
			}
		}
		this.doPromptMove();
		return null;
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

				/* in what function universe would
				 * `if(x & 1 == 0)` produce an error?
				 * why the fuck would `&` take precedence
				 * over `==` */
				if(colour)
					t.className = "tile black";
				else
					t.className = "tile white";

				t.id = xy2tileID(x, y, z);

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

export function xy2tileID(x: number, y: number, z: number = 0): string
{
	const xcoord = "abcdefgh";
	return `TILE ${z}${xcoord[x]}${y + 1}`;
}

export function getTile(x: number, y: number, z: number = 0): (HTMLElement | null)
{
	return document.getElementById(xy2tileID(x, y));
}

function inBoardBounds(x: number, y: number): boolean
{
	return (x < 8) && (y < 8);
}

