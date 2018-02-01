

function Tile (number, size) {
	this.number = number;
	this.size = size;
}

Tile.prototype = {
	draw: function(posX, posY) {
		if (this.number == 0) return;
		let size = this.size;
		ctx.fillStyle="#ffcc00";
		ctx.fillRect(posX*size+5, posY*size+5, size-10, size-10);
		ctx.font = "100px Arial";
		ctx.fillStyle="#fff";
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		ctx.fillText(this.number.toString(), posX*size + size/2, posY*size + size/2);
	}
}