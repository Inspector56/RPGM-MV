//=============================================================================
// main.js
//=============================================================================

var $collectingAudio = 0;
var $outpath = "decrypted";
var $total_files = 0;
var $files_copied = 0;

var getAssets = function(outpath, ignore) {
	//Works for default Windows
	var path_separator = '\\';

	var fs = require('fs');
	var path = require('path');
	var filepath = path.dirname(process.mainModule.filename);
	outpath = path.join(path.dirname(filepath), outpath);
	ignore = ignore || ['js','save'];

	if (!fs.existsSync(outpath))
		fs.mkdirSync(outpath,  { recursive: true });

	var visited = []
	function decryptRecurse(sourcePath, outPath) {
		var dirs = fs.readdirSync(sourcePath);
		for (dir in dirs) {
			//if new directory, make new output directory and recurse into it
			if (fs.lstatSync(path.join(sourcePath, dirs[dir])).isDirectory()) {
				if (ignore.indexOf(dirs[dir]) >= 0) continue;
				if (!fs.existsSync(path.join(outPath, dirs[dir]))) {
					fs.mkdirSync(path.join(outPath, dirs[dir]), { recursive: true });
				}
				decryptRecurse(path.join(sourcePath, dirs[dir]), path.join(outPath, dirs[dir]));
			} else {
				if (file == "Thumbs.db") continue;
				$total_files++; //update total # of images seen
				var file = dirs[dir];
				var ext = file.split('.').pop();
				switch (ext) {
					case 'rpgmvp': //IMG Decrypt
						var img = file.slice(0,-7); //remove ".rpgmvp"

						var bitmap = ImageManager.loadBitmap(sourcePath+path_separator, img);
						var data = [ bitmap, outPath, img ];
						bitmap.addLoadListener(function() {
							base64ToPNG(this[0].canvas.toDataURL(), this[1], this[2]);
							//log progress
							update_progress();
						}.bind(data));
						break;
					case 'rpgmvo': //OGG Decrypt
						$collectingAudio++;
						var ogg = file.slice(0,-7) //remove ".rpgmvo"
						var parent = (sourcePath.split(path.sep)).pop();
						if (parent == 'bgm') AudioManager.playBgm({name: ogg});
						else AudioManager.createBuffer(parent, ogg);
						break;
					case 'rpgmvm': //M4A Decrypt
						$collectingAudio++;
						var ogg = file.slice(0,-7) //remove ".rpgmvm"
						var parent = (sourcePath.split(path.sep)).pop();
						AudioManager.createBuffer(parent, ogg);
						break;
					default:
						fs.writeFileSync(path.join(outPath, file), fs.readFileSync(path.join(sourcePath, file)));
						update_progress();
				} 
			}
		}
	}
	decryptRecurse(filepath, outpath);
}

var onxhrload = WebAudio.prototype._onXhrLoad;
WebAudio.prototype._onXhrLoad = function(xhr) {
	if ($collectingAudio > 0) {		
		var path = require('path');

		var array = xhr.response;
		array = Decrypter.decryptArrayBuffer(array);

		var url = (xhr.responseURL).split(path.sep);
		if (url.length == 1) { url = url[0].split('/'); }
		var file = (url[url.length - 1]).split('.');

		var ext = file.pop();
		file = file[0];

		var dest = path.join($outpath, (url.slice(url.indexOf('www')+1,-1)).join(path.sep));
		var type;
		if (ext == 'rpgmvo') {type = 'ogg';} else if (ext == 'rpgmvm') {type = 'm4a';}
		base64ToOGG(array, dest, file, type); //TODO: make sure this does what I want it to
	}
	onxhrload.call(this, xhr);
}

//credit to: miguelmota/base64-to-png.js : https://gist.github.com/miguelmota/4e9864f182c053d7a51d
function base64ToPNG(data, outpath, filename) {
  var fs = require('fs');
  var path = require('path');
  data = data.replace(/^data:image\/png;base64,/, '');

  fs.writeFileSync(path.join(outpath, filename+".png"), data, 'base64');
}
//ogg, credit to: https://stackoverflow.com/questions/48291593/convert-base64-audio-to-file
function base64ToOGG(array, outpath, filename, ftype) {
	var fs = require('fs');
	var path = require('path');
	ftype = ftype || 'ogg';

	var data = [outpath, filename, ftype]
	var blob = new Blob([array], {type: ("audio/"+ftype)});
	var reader = new FileReader();
	reader.readAsDataURL(blob);
	reader.onloadend = function() {
	    var base64data = reader.result;
    	fs.writeFileSync(path.join(this[0], this[1]+'.'+this[2]), base64data.replace(('data:audio/'+this[2]+';base64,'), ''), 'base64');
		$collectingAudio--;
		update_progress();
	}.bind(data);
}
function update_progress() {
	var fs = require('fs');
	$files_copied++;
	fs.writeFileSync("progress.txt", $files_copied.toString()+ " / "+ $total_files.toString());
}

PluginManager.setup($plugins);

window.onload = function() {
	getAssets($outpath);
    SceneManager.run(Scene_Boot);
};
