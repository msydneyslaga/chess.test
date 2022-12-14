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

	readonly xpos: number;
	readonly ypos: number;

	constructor(type: pieceType, isWhite: boolean)
	{
		this.type = type;
		this.isWhite = isWhite;
	}

	get icon(): string
	{
		return nf_piece_icons[this.type];
	}

	promptMove(): (HTMLElement | null)
	{
		promptTile();
		return null;
	}

	private prompTile(): void
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

class Board
{
	private htmlboard: HTMLElement;
	private grid: (Piece | null)[][];

	constructor(board: HTMLElement)
	{
		this.htmlboard = board;

		this.grid = [];
		for(let x = 0; x < 8; x++)
		{
			this.grid[x] = [];
			for(let y = 0; y < 8; y++)
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
	initDefaultPieces(): void
	{
		for(let y = 0; y < 8; y++)
		{
			for(let x = 0; x < 8; x++)
			{
				if(defaultlayout[y][x] != null)
					// @ts-ignore
					this.grid[x][y] = new Piece(defaultlayout[y][x][0], defaultlayout[y][x][1]);
				else
					this.grid[x][y] = null;
			}
		}
	}

	draw(): void
	{
		for(let y = 0; y < 8; y++)
		{
			for(let x = 0; x < 8; x++)
			{
				const id = xy2tileID(x, y);
				const tile = document.getElementById(id);
				const p = this.grid[x][y];

				if(!tile)
					throw `missing tile at ${id}`;

				if(p != null)
				{
					tile.innerText = `${p.icon}`;
					tile.style.color = p.isWhite ? "var(--cat-blue)" : "var(--cat-maroon)";
				}
				else
					tile.innerText = "";
			}
		}
	}
};

export function createboard(): Board
{
	let board = document.getElementById("board");
	let colour = false;

	if(!board)
		throw "board not found";

	for(var y = 0; y < 8; y++)
	{
		const tr = document.createElement("tr");

		for(var x = 0; x < 8; x++)
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

	return new Board(board);
}

export function xy2tileID(x: number, y: number)
{
	const xcoord = "abcdefgh";
	return `TILE ${xcoord[x]}${y + 1}`;
}

