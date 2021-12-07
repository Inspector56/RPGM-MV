//=============================================================================
// RPG Maker MV Mod Manager.js
//=============================================================================

/*:
 * 
 * =============================================================================
 * ** HOW TO USE **
 * =============================================================================
 * 1) create a folder, called "mods", in the same directory as Game.exe
 * 
 * SCRIPTS vs PATCHES
 *   There are two ways to mod a game instance. Scripts are essentially plugins,
 * but with a separate ini (scripts.js) that is managed here, and not by RPGM. When you
 * change script settings, those settings are saved across play sessions, and the active
 * scripts will affect/apply to ANY AND ALL GAME/SAVE STATES you have. Good candidates
 * for scripts might be: combat or menu overhauls, additional effects and sounds - 
 * changes to the game system, not the level data.
 *   Patches, meanwhile, represent potential changes to the game data itself. You have
 * to use the mod manager to generate a patched instance of the game, and once you have
 * generated one, you can then choose to start a game on that patched instance of the game.
 * Once you start a game, you cannot switch patches; loading a game from a different patch
 * should automatically switch you back to that save state, within that patch.
 *
 * TO USE A SCRIPT:
 * 2) create a directory in the mods folder called "scripts".
 * 3) copy the script file (.js) into the "scripts" folder.
 * 4) launch the game, navigate down to the "Mods" option, and select it.
 * 5) select "Scripts".
 * 6) navigate to a desired script; 'enable' turns the script on or off.
 * 7) select parameters to the script with the parameter dropdown.
 * 8) for a given parameter, the description box should give a description
 *   when available. Use the input window to adjust the value of the parameter,
 *   and the Save button to save changed values.
 * 9) assuming you have been saving your changes, press escape until you return
 *   to the title menu. Scripts will take effect when you load a game or start
 *   a new one.
 *
 * TO USE A PATCH:
 * 2) create a directory in the mods folder called "patches".
 * 3) copy the provided patch folder into the "patches" folder.
 * 4) launch the game, navigate down to the "Mods" option, and select it.
 * 5) select "Patches".
 * 6) navigate the patch list on the left to find your desired patch.
 * 7) select whichever patch tags you want.
 * 8) select the apply button to apply the patch. NOTE: The patch is not yet playable.
 * 9) repeat steps 6-8 for all desired patches, in the desired order.
 * 10) note: if you make a mistake or change your mind, use the Reset button to clear
 *   the your patch-in-progress and start from a blank slate.
 * 11) select Export when you are ready to finish the patch.
 * 12) name your patch, and hit Enter.
 * 13) continue pressing escape to exit to the title menu. Press New Game, and select
 *    your named patch from the options.
 * 
 *
 * =============================================================================
 * ** HOW TO MAKE A PATCH **
 * =============================================================================
 * 
 *   First, be warned that making a patch is a tedious, possibly difficult endeavor.
 *   Changing the game data fundamentally means adding, removing, or replacing certain
 * segments - maps, events, troops, etc. The easy way, from the patch-maker's perspective,
 * is the following rule: given original game data A and new/patch game data B, used to
 * create game version C then:
 * - if something is in A and not B, DELETE it, it will not be in C
 * - if something is in A and B, REPLACE it, use the version in B
 * - if something is in B and not A, ADD/CREATE it, it will appear in C
 *   However, there are problems with this. If you apply multiple different patches that
 * affect different things, something that is added by the first patch may not be in the
 * second patch, and so when the second patch is being applied, the addition from the
 * first patch is simply deleted. This could be negated by removing the first rule, but
 * that also is not perfect; you may need to delete old events. Additionally, perhaps you
 * want to add options/parameters to your patch, so that users can choose to incorporate
 * some changes but not others.
 *   For this more fine-grain and versatile approach, I decided to use note tags. Include, 
 * in an objects notes section (more details later), a line with a command of this format:
 *                  <MM (COMMAND) (TAG LIST)>
 * Replace the things in parentheses, so for example:
 *                  <MM ADD 1,blob,e17g>
 * Valid commands are ADD/CREATE/NEW (meaning ADD, CREATE, and NEW are equivalent), REPLACE/EDIT/CHANGE/UPDATE, and DELETE/REMOVE.
 * Valid tags are alphanumeric, and NOT case sensitive.
 * Notice the tag list has no spaces.
 * For all items, DELETE & REPLACE-type commands work with respect to ID number; if no game element in the base game files
 *  has an ID that matches the ID of the game element whose note has a REPLACE-type command in it, nothing will occur.
 * A command should not span multiple lines; it should all be on one line.
 * Alternatively, you can provide no taglist (eg <MM ADD>); this command will ALWAYS activate - even
 *  if no tags are specified during the install.
 *
 * WHAT IS THIS TAG LIST? HOW DOES IT WORK?
 * ----------------------------------------
 *   The tag list is a list of comma separated tags; you can name these tags whatever you
 * like, as long as you are consistent with yourself, and you list all the valid tags in
 * a text file; more on that later. Some examples: "blue,red,black" or "1,2,6,11".
 *   Here, a tag represents a subversion of the patch. A user, when applying the patch,
 * will be able to choose which combination of tags will be "active" when the tag is applied.
 * If ANY (NOT ALL) active tag is in a command line, the command line will take effect when
 * the patch is applied.
 *  An example: our tags are "difficulty","blue","permadeath".
 *  "blue" makes the player blue.
 *  "difficulty" makes the game more difficult.
 *  "permadeath" makes the game have permadeath.
 *   If someone were to make such a versatile patch, and a user wanted to make their player
 * blue and the game more difficult but not have to deal with permadeath, then when they
 * go into the Mods > Patch menu and select this patch, before they go to apply the patch,
 * they will turn on the "blue" and "difficulty" tags.
 *   One way this might work, is that the blue patch provides an alternative asset for the player.
 * Patch assets are covered in depth under ADVANCED.
 *   Difficulty might appear in several notes sections of common events or map events, and perhaps
 * Enemy notes or Skill notes to increase enemy health, give them better skills, etc. The commands
 * that appear in the notes would likely look like <MM CHANGE difficulty>
 *   Suppose there is a command in the patch that looks like <MM ADD difficulty,permadeath>; our
 * user did not want permadeath, BUT since hey selected 'difficulty' this command will still activate
 * /take effect.
 *   I chose to do it this way because, in general with patches, you might want certain things
 * to be common to different configurations. An easy example: instead of three unrelated tags, our
 * patch only does one thing: it is a combat revamp. It still has three tags, however: 'easy', 'medium',
 * and 'hard'. Since the combat will be revamped either way, no matter which tag is chosen, some
 * code/common events will want to be changed. And perhaps there are certain difficulty mechanics - no
 * quicksaving, no resting, health doesn't regenerate between fights, etc - that would be common to
 * medium and hard, but that people using easy would be spared of.
 *   What if the user picks multiple, say easy and hard? It's up to the patch maker to leave clear
 * installation instructions or else to "idiotproof" their patch; as a trivial example, suppose we have
 * a variable to be set to 3 different values based on easy, medium, or hard - 1, 3, and 5 respectively.
 * Supposing you think hard should take priority/precedence, you would have the easy tag add "var = 1",
 * then directly below that the line that has the medium tag add "var = 3", and then beneath that, the
 * line that has the hard tag add "var = 5", so if the hard tag is used, its value always "wins".
 *
 * This API has many weaknesses, but it is the one I decided upon after much thought. If you believe
 * you have a better patch-coding API for RPGMaker MV, please contact me, I would be very happy to
 * discuss it.
 *
 * =============================================================================
 * ** ADVANCED **
 * =============================================================================
 *
 *   TODO: You can specify an exact list of which files you want to diff/create a patch for...
 *
 *   A NOTE ON ENCRYPTED ASSETS: [VERY IMPORTANT]
 * 
 *   The way this modmanager is implemented, any asset file that appears in a patch is copied over
 * when the patch is applied, even if it causes an overwrite. Any legwork to avoid redundancy or
 * excess regarding the assets is handled during patch creation. If, during patch creation, you
 * check the box to have it compare asset files, it will compare assets (images and audio) in your
 * modded game directory with your base/vanilla game directory and look for changes and additions.
 * Consider the following problem, however: The base game uses encrypted assets, and you decrypt
 * these to more easily mod the game. When you finish, however, you decide you want to re-encrypt,
 * to protect assets that you added or changed. A simple byte-by-byte comparison of these files
 * will not work - by this metric, since all of the bytes have been decrypted-and-re-encrypted
 * with another key, every basic file - even ones you didn't touch (but probably didn't go to
 * the trouble of cleaning up/deleting once you were done, why should you) would be copied into
 * the patch. Well, my modmanager took that case into account, and will compare the decrypted
 * bytes. HOWEVER. This only works for comparing two files under different encryption; it does NOT
 * work if one file is not encrypted! RPG Maker MV, when it encrypts files, seems to 
 *
 *
 * =============================================================================
 * ** CONFLICTS **
 * =============================================================================
 *   Much of this script simply provides new code; but there were some instances where
 * it was necessary to modify how things work in the vanilla code base. In particular,
 * script conflicts are more likely when a function is overwritten, instead of merely
 * aliased. The following functions are overwritten:
 *
 * --------- Asset Decryption functions ----------------------------------------
 *   It is unlikely for another function to touch these, so they probably will not
 * result in a conflict
 *
 * - Decrypter.decryptImg
 * - Decrypter.decryptHTML5Audio
 * - WebAudio.prototype._load
 * - WebAudio.prototype._onXhrLoad
 * - Decrypter.decryptArrayBuffer
 *
 * --------- Save List Drawing -------------------------------------------------
 *   It is quite possibly modified by any script that affects the appearance of
 * the save menu, the save list in particular.
 *
 * - Window_SavefileList.prototype.drawPartyCharacters
 *
 * =============================================================================
 * ** WARNINGS **
 * =============================================================================
 * - The script parameter parser assumes that any parameter that utilizes "On"/"Off"
 *   keywords will map On to the Boolean value true and Off to the Boolean value false
 * - Due to have javascript works and how scripts and functions are loaded, if you ENTER
 *   a game, exit to menu, and turn off/disable a script, there is NO guarantee that the
 *   script will be fully deactivated in your current session - in fact, it is unlikely
 *   that it will not still have some lingering effects. Once you have entered into a game
 *   with an active script, you MUST restart the game to clear/disable the active script.
 * - Currently, script load order is not obviously integrated. Once scripts.js has been created,
 *   you can change the order of the dicts/entries to reflect the script load order you desire.
 *   They are loaded in the order listed in the file.
 * - When launching, IF you partially created a patch last time, there may be a temp directory. The code attempts to
 *   delete this at launch, BUT will crash and fail IF you have that directory (mods/temp) or any subdirectory
 *   open in Windows Explorer.
 */

//-----------------------------------------------------------------------------
// ModManager
//
// The static class that manages mods.

function ModManager() {
    throw new Error('This is a static class');
}

const fs   = require('fs');
const path = require('path');
const child_process = require('child_process');

ModManager._path                = path.join(path.dirname(path.dirname(process.mainModule.filename)), 'mods');
ModManager._base                = path.join(ModManager._path, 'base');
ModManager._dependencies        = ["mv_mm.js", "window_textbox.js", 'jsondiff.exe'];
ModManager._listFileName        = "LIST.txt";
ModManager._baseGameText        = "|Base Game|";
ModManager._tempFolder          = "temp";
ModManager._installsFolder      = "installs";
ModManager._patchesFolder       = "patches";
ModManager._convertFilename     = "convert.js";
ModManager._gameLoaded          = false;
ModManager._scripts             = {}; //Maps each script name to Boolean: true for active, false for disabled
ModManager._parameters          = {}; //Holds parameter settings for each script
ModManager._awaiting            = {};
ModManager._callbacks           = {};
ModManager._encryptionList      = {}; //Builds a map of modded assets to the proper encryption key to use
ModManager._encryptionListFile  = 'decryptMap.xx' //arbitrary file extension

ModManager.set = function(patchname) {
    this._currPatch = path.join(this._path,'patches', patchname,'data');;
}

function NullFunction(args) {
    //Do nothing
}

ModManager.queuedFunction = NullFunction;
ModManager._loadLock = 0;
ModManager.quickLoad = false;

//-----------------------------------------------------------------------------
// ModManager - Patching Functions
//

ModManager.preparePatch = function() {
    if (!fs.existsSync(path.join(this._path, this._tempFolder))) {
        fs.mkdirSync(path.join(this._path, this._tempFolder),  { recursive: true });
        fs.mkdirSync(path.join(this._path, this._tempFolder, 'data'),  { recursive: true });
        //Copy in base-game info
        this.deepCopy(path.join(path.dirname(process.mainModule.filename), 'data'));
    }
};

//credit to https://stackoverflow.com/questions/12627586/is-node-js-rmdir-recursive-will-it-work-on-non-empty-directories
ModManager.deleteFolderRecursive = function(pathname) {
    var files = [];
    if( fs.existsSync(pathname) ) {
        files = fs.readdirSync(pathname);
        files.forEach(function(file,index){
            var curPath = path.join(pathname, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                ModManager.deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(pathname);
    };
};

ModManager.clearPatch = function() {
    this.deleteFolderRecursive(path.join(this._path, this._tempFolder));
    this._encryptionList = {};
}
ModManager.savePatch = function(outname) {
    if (!fs.existsSync(path.join(this._path, this._installsFolder))) {
        fs.mkdirSync(path.join(this._path, this._installsFolder),  { recursive: true });
    }
    //should never get here with an outname folder that already exists
    fs.mkdirSync(path.join(this._path, this._installsFolder,outname),  { recursive: true });
    this.deepCopy(path.join(this._path, this._tempFolder), path.join(this._path, this._installsFolder,outname));
    this.clearPatch();
};

//Note: This function is no longer used anywhere
ModManager.copyAssets = function() {
    var input = this._currPatch.slice(0,-5); //shave off "/data"
    if (fs.existsSync(path.join(input, 'assets'))) {
        for (i in this._tagList) {
            var tag = this._tagList[i];
            if (fs.existsSync(path.join(input, 'assets', tag))) {
                this.deepCopy(path.join(input, 'assets', tag), path.join(this._path, this._tempFolder));
            }
        }
    }
};

ModManager.deepCopy = function(input, output) {
    output = output || path.join(this._path, 'temp', 'data');

    function copyRecurse(input, output) {
        var items = fs.readdirSync(input);
        for (var i in items) {
            var item = items[i];
            if (fs.lstatSync(path.join(input, item)).isDirectory()) {
                if (!fs.existsSync(path.join(output, item))) {
                    fs.mkdirSync(path.join(output, item), { recursive: true });
                }
                copyRecurse(path.join(input, item), path.join(output, item));
            } else {
                if (item == "Thumbs.db") continue;
                fs.writeFileSync(path.join(output, item), fs.readFileSync(path.join(input, item)));
            }
        }
    }
    copyRecurse(input, output);
};


ModManager._currentEncryptionKeys = function(name) {
    //Default to the base game's encryption key - shouldn't really come up
    var currentEncryptionKey = $dataSystem.encryptionKey ? $dataSystem.encryptionKey.split(/(.{2})/).filter(Boolean) : null;
    var currentImEncryptionKey = $dataSystem.hasEncryptedImages ? currentEncryptionKey : null;
    var currentAudioEncryptionKey = $dataSystem.hasEncryptedAudio ? currentEncryptionKey : null;
    const systemDataFile = path.join(this._path,this._patchesFolder, name, 'data','System.json');
    if (fs.existsSync(systemDataFile)) {
        const modSystem = JSON.parse(fs.readFileSync(systemDataFile, {encoding: 'utf8'}));
        currentEncryptionKey = modSystem['encryptionKey'] ? modSystem['encryptionKey'].split(/(.{2})/).filter(Boolean) : null;
        var currentImEncryptionKey = modSystem['hasEncryptedImages'] ? currentEncryptionKey : null;
        var currentAudioEncryptionKey = modSystem['hasEncryptedAudio'] ? currentEncryptionKey : null;
    }

    return [currentImEncryptionKey, currentAudioEncryptionKey];
}

//For these two functions, map the *relative* url of an asset - which
//  will be the url passed in when the game tries to load an asset -
//  to the key used (in the patch the asset comes from); keys is an
//  array of 2 encryption keys that goes image key, then audio key,
//  which may differ within a patch if the patch creator chose to
//  encrypt one media type and not the other
//Note that if multiple patches are applied and they modify a file
//  of the same name/url, just as the asset that is applied in the
//  later patch overwrites the first version of the asset, the
//  corresponding encryption key associated with it gets overwritten
//  in this dictionary
ModManager.addImageToEncryptList = function(url, patchName, keys) {
    this._encryptionList[url] = keys[0];
}
ModManager.addAudioToEncryptList = function(url, patchName, keys) {
    this._encryptionList[url] = keys[1];
}
//This encryption key dictionary leaves a lot to be desired in terms of
//  both storage and runtime efficiency, but we're starting with making
//  a user-friendly (automates as much as it can) modmanager that works
//  first and foremost

ModManager.dumpEncryptionList = function(dest) {
    if (AutoDiff.isEmpty(this._encryptionList)) return;
    fs.writeFileSync(path.join(dest, this._encryptionListFile),
        JSON.stringify(this._encryptionList),
        {encoding: 'utf8'});
}

ModManager.loadEncryptionList = function(patchName) {
    if (!patchName) return {};
    const listFile = path.join(this._path, this._installsFolder, patchName, this._encryptionListFile);
    if (!fs.existsSync(listFile)) return {};
    const encryptionList = fs.readFileSync(listFile, {encoding: 'utf8'});
    return encryptionList;
}

ModManager._applyPatch = function(name) {
    var currentEncryptionKeys = this._currentEncryptionKeys(name);

    //Patch relevant files, copy over new or modified images
    function filePatchRecurse(parentPath="") {
        var files = [];
        //path to base files/temp directory
        const src = path.join(this._path, this._tempFolder, parentPath);
        //path to diffs and mod assets from patch
        const curr = path.join(this._path,this._patchesFolder, name, parentPath);

        //NOTE: it was decided that if something appears in the source
        // but not the modded install, that it was not worthwhile to
        // include mechanisms to signal to actively delete those files
        // when the patch is applied.
        if (fs.existsSync(curr)) {
            files = fs.readdirSync(curr);
            files.forEach(function(file, index) {
                if (fs.lstatSync(file).isDirectory()) {
                    filePatchRecurse(path.join(parentPath, file));
                } else {
                    const patchFile = path.join(src, file);
                    const targetFile = path.join(this._path, this._patchesFolder, name, parentPath, file);
                    //If the source/base install has a corresponding file, treat it as a patch
                    if (fs.existsSync(path.join(src, file))) {
                        //JSON data files have their own diff format
                        if (file.match(/\.json$/i)) {
                            if (!this.patchJSON(targetFile, patchFile)) {
                                /* If patching fails (improperly formatted), it likely means
                                 * that multiple patches tried to add a file named patchFile that did
                                 * not exist originally, so we copy over the one from the latest patch
                                 * to be applied */
                                fs.writeFileSync(targetFile, fs.readFileSync(patchFile));
                            }

                        //Copy new image/audio/asset over
                        } else if (file.match(/\.[png|mp4|ogg|rpgmvp|rpgmvo|rpgmvm]$/i)) {
                            fs.writeFileSync(patchDest, fs.readFileSync(newfile));
                            //Map changed assets to different encryption keys; ("no encryption key" may be
                            //  a "new" encryption key; thus we do this even if the extension claims the file
                            //  is not encrypted)
                            if (file.match(/\.[png|rpgmvp]$/i)) {
                                this.addImageToEncryptList(path.join(parentPath, file), name, currentEncryptionKeys);
                            } else if (file.match(/\.[ogg|rpgmvo]$/i)) {
                                this.addAudioToEncryptList(path.join(parentPath, file), name, currentEncryptionKeys);
                            }

                        //Pure-text files use line-based diffing/patching
                        } else if (file.match(/\.[txt|csv]$/i) || file.match(/\.js$/i)) {
                            if (file == this._convertFilename) {
                                /* We expect different patches to all come with a conversion file that
                                 * provides a save conversion function override; we do not want to patch
                                 * one to look like another, we want to add/compile the logic of all of them,
                                 * so we append the overrides together subsequently in one file. */
                                this.appendContents(targetFile, patchFile);
                            } else {
                                if (!this.patchText(targetFile, patchFile)) {
                                    /* If patching fails (improperly formatted), it likely means
                                     * that multiple patches tried to add a file named patchFile that did
                                     * not exist originally, so we copy over the one from the latest patch
                                     * to be applied */
                                    fs.writeFileSync(targetFile, fs.readFileSync(patchFile));
                                }
                            }
                        }

                    //If file is exclusive to the mod/patch, copy it over
                    } else {
                        fs.writeFileSync(patchDest, fs.readFileSync(newfile));
                    }
                }
            });
        }
    }
    //Perform diff from roots
    filePatchRecurse.bind(this);
    filePatchRecurse();

    //Build encryption key list
};

/* Returns false if it fails to patch (patchFile not formatted correctly), true otherwise */
ModManager.patchText = function(sourceFile, patchFile) {
    var source = fs.readFileSync(sourceFile, {encoding: 'utf8'}).split(/[\r\n]+/);
    try {
        const patchDiff = JSON.stringify(fs.readFileSync(patchFile, {encoding: 'utf8'}));
        //Patch the list of lines
        if (!this.patchLine(source, patchDiff)) {
            return false;
        }
        //Overwrite file with patched contents
        fs.writeFileSync(sourceFile, source.join('\n'), {encoding: 'utf8'})
        return true;
    } catch (except) {
        return false;
    }
}

ModManager.appendContents = function(sourceFile, newFile) {
    fs.appendFileSync(sourceFile, fs.readFileSync(newFile, {encoding: 'utf8'}));
}

ModManager.patchLine = function(source, patchDiff) {
    if (!Array.isArray(patchDiff) || !Array.isArray(patchDiff[1])) {
        return false;
    }

    patchDiff.sort((a, b) => {
        //If both additions or both deletes, sort by line number/order
        if (a[0] == b[0]) {
            //If we're looking at deletions, sort in reverse - will
            //  become clear why later/below
            if (a[0] == '-') {
                return b[1] - a[1]
            }
            return a[1] - b[1];
        //If not equal, we want '+' to be "higher" and come later
        } else if (a[0] == '+') {
            return 1;
        } else {
            return -1;
        }
    });
    //Apply the diff modifications line by line...
    for (var lineSpec of patchDiff) {
        //Deletions all come before all additions, due to
        //  the sort. So we can delete lines based on index in original list
        //  Sort also guarantees we delete highest-index entries first, so
        //  deleting in order does not change the index of the next line to
        //  be deleted.
        if (lineSpec[0] == '-') {
            source.splice(lineSpec[1],1);
        }
        //Now we're ready to do all additions, and they
        //  are sorted in ascending order. The line numbers attached to
        //  additions are the line number of the line in in the modded
        //  file that the patch is based on (which already has the deleted
        //  lines deleted); if we insert them in ascending order, they simply
        //  each get placed where they expect to be.
        if (lineSpec[0] == '+') {
            source.splice(lineSpec[1],0,lineSpec[2]);
        }
    }

    return true;
}

ModManager.patchJSON = function(sourceFile, patchFile) {
    try {
        var source = JSON.parse(fs.readFileSync(sourceFile, {encoding: 'utf8'}));
        const patchDiff = JSON.parse(fs.readFileSync(patchFile, {encoding: 'utf8'}));
        //Patch the JSON
        this.patchObj(source, patchDiff);
        //Overwrite file with patched contents
        fs.writeFileSync(sourceFile, source, {encoding: 'utf8'});
        return true;
    } catch (except) {
        return false;
    }
}

// I have no idea why I wrote obj.splice.apply(obj, [args])
// instead of obj.splice(args); perhaps there was a good reason
ModManager.patchObj = function(source, patchDiff) {
    var keys;
    if (Array.isArray(source)) {
        let i = 0;
        //The keys to an array are just the indices
        keys = source.map(x => {i+=1; return (i-1);});
    } else {
        keys = Object.getOwnPropertyNames(source).sort();
    }
    
    var buildIndex = 0;
    //adding keys to a dictionary does not require any consideration of "indices";
    //  in fact, we need to ignore indices for the case where source has no
    //  keys, and will not iterate after this, but we with to add keys to it
    if (!Array.isArray(source) && !Array.isArray(patchDiff)) {
        const addKeys = Object.getOwnPropertyNames(patchDiff['+']);
        for (key of addKeys) {
            source[key] = AutoDiff.cloneObj(patchDiff['+'][key]);
        }
    //Similarly, do have to manually include corner case where source is an
    //  empty array (will not have anything to iterate through, below) that requires
    //  additions
    } else if (Array.isArray(source) && Array.isArray(patchDiff)) {
        if (source.length == 0 && patchDiff['+'][0]) {
            //Do generic "add" logic for arrays, at index 0
            source.splice.apply(source, [buildIndex, 0].concat(AutoDiff.cloneObj(patchDiff['+'][i])));
            buildIndex += patchDiff['+'].length;
        } else { //TODO - NEW, SHOULD BE TESTED AND SCRUTINIZED
            this.patchLine(source, patchDiff);
            return;
        }
    }
    //Apply JSON diff/patch
    for (var i = 0; i < keys.length; i++) {
        var buildIndexUpdated = false;
        if (i in patchDiff['+']) {
            if (Array.isArray(source)) {
                //The reason we call obj.splice.apply(obj... args) instead of obj.splice(args) is because
                //  we want to insert a subsequence of values - an array itself. Thus if we pass an array
                //  to splice, it will insert the array instead of insterting all values in the array in order
                //  eg: "[1, [2, 3], 4]" instead of "[1, 2, 3, 4]". By concatenating the subsequence we want
                //  to add with the parameter list that goes to apply, we transition the list into a list of
                //  splice values.
                //Thankfully, splice adheres to our "before the index" standard
                source.splice.apply(source, [buildIndex, 0].concat(AutoDiff.cloneObj(patchDiff['+'][i])));
                buildIndex += patchDiff['+'].length;
            }
            buildIndexUpdated = true;
        }
        //Note: we can modify an element AND have an insert at i, but insert first/before
        if (patchDiff['m'][i] != null) {
            const modifyDiff = patchDiff['m'][i];
            //Recurse on modification patch
            if (AutoDiff.isObject(modifyDiff)) {
                if (!Array.isArray(source)) {
                    //If it was an object, key is the "i'th" key when sorted
                    this.patchObj(source[keys[i]], modifyDiff);
                } else {
                    this.patchObj(source[i], modifyDiff);
                }
            //Or simply set the value to the new value
            } else {
                source[i] = modifyDiff;
            }
            buildIndex += 1;
            buildIndexUpdated = true;
        //Note: We SHOULD never have a modify and delete on the same index
        } else if (i in patchDiff['-']) {
            //Eliminate the current/next element
            source.splice(buildIndex, 1);
            //Essentially, tell it not to increment the buildIndex, since
            // the "processed" element was deleted, and our index does not have
            // any net movement/increase.
            buildIndexUpdated = true;
        }
        //If we didn't have any adds, deletes, or modifies, just move on
        if (!buildIndexUpdated) {
            buildIndex += 1;
        }
    }
};

ModManager._getJSON = function(dir, dest) {
    if (!fs.existsSync(path.join(dir, dest))) return {};
    return JSON.parse(fs.readFileSync(path.join(dir, dest)),'utf8');
};


//-----------------------------------------------------------------------------
// ModManager - Script Functions
//

ModManager.readScriptSettings = function(callback) {
    this._callback = callback;

    //If using mods functionality, check for script config
    //  or make it - callback is called downstream
    if (fs.existsSync(this._path)) {
        //If configuration already exists
        var url = path.join(this._path,'scripts.js');
        if (fs.existsSync(url)) {
            //nothing
        } else {
            this._scripts = {};
            this._parameters = {};
            this.logScriptSettings();
        }
        this.loadScriptSettings(url);
    } else {
        //run normally
        callback();
    }
}

ModManager.checkScriptChanges = function() {
    var fs = require('fs');
    var path = require('path');
    //Register or update parameter data for all listed files
    var _this = this;
    function scriptRegRecurse(pathname, start) {
        var scripts = fs.readdirSync(pathname);
        for (var i in scripts) {
            var item = scripts[i];
            if (fs.lstatSync(path.join(pathname, item)).isDirectory()) {
                scriptRegRecurse(path.join(pathname, item), start);
            } else {
                var ext = item.split('.').pop();
                if (ext == "js") {
                    var file = path.join(pathname, item);
                    file = file.replace(start, '').slice(1); //get rid of path separator character
                    if (Object.keys(_this._scripts).indexOf(file) < 0) _this._scripts[file] = false;
                    _this.getParams(path.join(pathname, item), file);
                }
            }
        }
    }
    if (fs.existsSync(path.join(this._path, 'scripts'))) {
        scriptRegRecurse(path.join(this._path, 'scripts'), path.join(this._path, 'scripts'));
        this.logScriptSettings();
    }

    this._callback.call();
};

//Only called when scripts.js is finished loading
ModManager.setData = function(params, scripts) {
    this._parameters = params;
    this._scripts = scripts;
    this.checkScriptChanges();
};

ModManager.loadScriptSettings = function(url) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script._url = url;
    document.body.appendChild(script); 
    return script;
}

ModManager.logScriptSettings = function() {
    var fs = require('fs');
    var data = "ModManager.setData("+JSON.stringify(this._parameters)+','+JSON.stringify(this._scripts)+")"
    //var data = "ModManager._parameters = "+JSON.stringify(this._parameters)+";\n";
    //data += "ModManager._scripts = "+JSON.stringify(this._scripts)+";";
    fs.writeFileSync(path.join(this._path,'scripts.js'), data, {encoding: 'utf8'});
};

//Loads and updates parameter data from a script file
ModManager.getParams = function(file, name) {
    name = name || file;
    var url = (/\.js/.exec(file)) ? file : file+'.js';
    var paramData = this.parameterParse(url);
    for (key in paramData) {
        if (!paramData[key].type) {
            if (paramData[key].default !== undefined)
                paramData[key]['type'] = this.guessTypeFromValue(paramData[key].default);
            else //if no info given, assume it is a string
                paramData[key]['type'] = 'undefined';
            if (paramData[key].type === 'undefined' && paramData[key].on && paramData[key].off)
                    paramData[key]['type'] = 'boolean';
            if (paramData[key].type === 'undefined' && paramData[key].values)
                    paramData[key]['type'] = this.guessTypeFromValue(paramData[key].values[0]);
            if (paramData[key].type === 'undefined')
                  paramData[key]['type'] = 'string';
        }
        if (paramData[key].default === undefined)
            if (paramData[key].type)
                paramData[key]['default'] = this.guessDefaultFromType(paramData[key].type);
        if (paramData[key].default === null && paramData[key].values)
            paramData[key].default = paramData[key].values[0];

        paramData[key]['_realValue'] = paramData[key].default;
    }
    //if file params not loaded or file properties (parameter listings) changed, load new
    if (!this._parameters[name] || this.detectChange(this._parameters[name], paramData, true)) {
        this._parameters[name] = paramData;
    }
    //this.logScriptSettings();
}

//Returns true if the old parameter data is missing a parameter present in curr,
//OR if for ANY parameter, the type or default has changed.
//If carryOverValues is true, then if a value is set in old, it will apply to curr,
//if possible/compatible. Otherwise, it will not modify old or curr.
ModManager.detectChange = function(old, curr, carryOverValues) {
    var changed = false;
    for (param in curr) {
        //if the parameter is not in the old parameter settings
        if (old[param] == null && curr[param] != null) {
            changed = true;
        //if the type of the parameter has changed
        } else if (old[param].type && (old[param].type != curr[param].type)) {
            changed = true;
        //if the default value, and likely value scale/range, has changed
        } else if (old[param].default && (old[param].default != curr[param].default)) {
            changed = true;
        //if min existed and was raised, check that we are still in bounds
        } else if (old[param].min && (old[param].min < curr[param].min)) {
            if (carryOverValues) {
                curr[param]._realValue = Math.max(old[param]._realValue, curr[param].min);
            }
            changed = true;
        //if max existed and was lowered, check that we are still in bounds
        } else if (old[param].max && (old[param].max > curr[param].max)) {
            if (carryOverValues) {
                curr[param]._realValue = Math.min(old[param]._realValue, curr[param].max);
            }
            changed = true;
        //if list of values was given but has changed, check that value is still a valid one, else find such a value
        } else if (old[param].values && (JSON.stringify(old[param].values) != JSON.stringify(curr[param].values))) {
            if (carryOverValues) {
                if (old.type == 'number' && curr.type == 'number') {
                    curr[param]._realValue = (curr[param].values.indexOf(old[param]._realValue) >= 0) ? old[param]._realValue : ((curr[param].default != undefined)?curr[param].defualt:curr[param].values[0]);
                } else {
                    curr[param]._realValue = (curr[param].values.indexOf(parseFloat(old[param]._realValue)) >= 0) ? old[param]._realValue : ((curr[param].default != undefined)?curr[param].defualt:curr[param].values[0]);
                }
            }
            changed = true;
        //OTHERWISE (parameter unchanged), if a value is set, carry over as desired
        } else if (old[param]._realValue) {
            if (carryOverValues) {
                curr[param]._realValue = old[param]._realValue;
            }
        }
    }
    return changed;
}

//Reads parameter data out of commented segments of js files
    //IMPORTANT: it expects annotations such as @param, @type, @on, @off, @default, @parent
    //and it expects the values of these annotations to be the only other thing to the right
    //of the annotation on the corresponding line.
ModManager.parameterParse = function(file) {
    //var os = require('os');
    var fs = require('fs');
    var lines = (fs.readFileSync(file, 'utf8')).split(/[\r\n]+/);//os.EOL);

    var in_comment_block = false;
    var parameters = {};
    var last_param = null;

    var i = 0;
    while (i < lines.length) {
        var line = lines[i];
        var comment = "";
        var match = null;
        if (!in_comment_block) {
            //see if the line is commented out, or the start of a comment block
            match = /\/(\/|\*)(.*)/.exec(line);
            if (match) {
                // line-comment came first
                if (match[1] == '/') {
                    comment = match[2];
                    i+=1; //process this line and move on

                // block-comment start came first
                } else if (match[1] == '*') {
                    line[i] = match[2];
                    in_comment_block = true;
                    //don't increment i or process rest of line yet, see if more happens on this line
                } else  {
                //should never happen, but if it somehow does
                    console.log(match)
                    i+=1;
                }

            //not in any comment
            } else {
                i+=1; //do nothing, move on
            }
        } else {
            //see if the line is commented out, or the start of a comment block
            match = /(.*)\*\/(.*)/.exec(line);//match = /(.*)(\/|\*)\/(.*)/.exec(line);
            if (match) {
                // if block-comment ends
                line[i] = match[2]; //process rest of line
                comment = match[1]; //process comment body
                in_comment_block = false;
                //don't increment i or process rest of line yet, see if more happens on this line
            //stays in comment body, process line as comment
            } else {
                comment = line;
                i+=1;
            }
        }

        //Parse commented segment for parameter tags
        if (comment == "") continue;
        match = /@(param|type|on|off|desc|default|value|min|max|parent) (.+)(\s*)$/i.exec(comment);
        if (match) {
            switch(match[1].toLowerCase()) {
                case "param":
                    last_param = match[2];
                    if (parameters[match[2]] == null)
                        parameters[match[2]] = {};
                    break;
                case "value":
                    if (!parameters[last_param]["values"]) {
                        parameters[last_param]["values"] = [];
                    }
                    parameters[last_param]["values"].push(match[2]);
                    break;
                case "type":
                case "on":
                case "off":
                case "desc":
                case "min":
                case "max":
                case "default":
                case "parent":
                    parameters[last_param][match[1]] = match[2];
                    break;
                default:
                    break;
            }
        }
    }
    return parameters;
}
ModManager.guessTypeFromValue = function(value) {
    if (value == undefined || value == null)
        return 'undefined';
    if (value == 'true' || value == 'false')
        return 'boolean';
    if (isNaN(value))
        return 'string';
    return 'number';
}
ModManager.guessDefaultFromType = function(type) {
    switch(type) {
        case 'boolean': return false;
        case 'string': return "";
        case 'number': return 0;
        case 'undefined': return null;
        default: return null;
    }
}
//When we exit to title, remove scripts in case we alter
//the configuration and have to load them anew
ModManager.clearScripts = function() {
    var path = require('path');
    if (this._gameLoaded) {
        for (var script in this._scripts) {
            console.log(script);
                if (!this._scripts[script]) continue;
            var source = path.join(this._path,'scripts',script);
            for (var j in document.body.childNodes) {
                var node = document.body.childNodes[j];
                if (node._url == source) {
                    document.body.removeChild(node);
                    break;
                }
            }
        }
        this._gameLoaded = false;
    }
}
ModManager.addScripts = function() {
    if (!this._gameLoaded) {
        var path = require('path');
        for (var file in this._scripts) {
            //if the script is active/enabled
            if (this._scripts[file]) {
                //convert all values to strings
                var params = {};
                for (var p in this._parameters[file]) {
                    params[p] = String(this._parameters[file][p]._realValue);
                }
                //inform PluginManager
                var name = ((file.split(/[\\|\/]/).pop()).split('.'))[0];
                PluginManager.setParameters(name, params);
                //add script code to the game
                var url = path.join(this._path,'scripts',file);
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                script.async = false;
                //script.onerror = this.onError.bind(this);
                script._url = url;
                document.body.appendChild(script);
            }
        }
        this._gameLoaded = true;
    }
}

//source is folder containing data JSON folders
ModManager.loadDatabase = function(source, callback) {
    if (!this._databases[source]) {
        source = source.toLowerCase();
        this._databases[source] = {};
        var fs = require('fs');
        var files = fs.readdirSync(source);
    
        this._awaiting[source] = files.length;
        for (var i in files) {
            var file = files[i].split('.');
            if (file[1] == 'json') {
                this.loadDataFile(source, file[0]);
            }
        }
    }
    this._callbacks[source] = callback.bind(this);
};

ModManager.loadDataFile = function(source, name) {
    var path = require('path');
    var fs = require('fs');
    //if file is outdated, delete it
    if (!fs.existsSync(source)) {
        if (this._parameters[source]) {
            delete this._parameters.source;
            this.logScriptSettings();
        }
        return;
    }
    var xhr = new XMLHttpRequest();
    name = name.toLowerCase();
    var url = path.join(source, name);//'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            this._databases[source][name] = JSON.parse(xhr.responseText);
            ModManager._onLoad(source);
        }
    };
    xhr.send();
};

ModManager._onLoad = function(database) {
    this._awaiting[database]--;
    if (this._awaiting[database] == 0) {
        this._callbacks[database].call(this);
    }
}

//-----------------------------------------------------------------------------
// Scene_Title
//
// The scene class of the title screen.

var _alias_modmanage_sct_init = Scene_Title.prototype.initialize;
Scene_Title.prototype.initialize = function() {
    if (ModManager._gameLoaded) {
        ModManager.clearScripts();
        DataManager._version = null;
    }
    _alias_modmanage_sct_init.call(this);
}

var _alias_modmanage_sct_create_com_window = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
    _alias_modmanage_sct_create_com_window.call(this);
    var fs = require('fs');
    if (fs.existsSync(ModManager._path)) {
        this._commandWindow.setHandler('mod',  this.commandModManage.bind(this));
        ModManager.clearPatch();
    }
}

var _alias_modmanage_startNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function(install) {
    var fs = require('fs');
    var path = require('path');

    if (fs.existsSync(ModManager._path) &&
        fs.existsSync(path.join(ModManager._path, ModManager._installsFolder)) &&
        ((fs.readdirSync(path.join(ModManager._path, ModManager._installsFolder))).length) > 0) {
        this._commandWindow.close();
        SceneManager.push(Scene_StartGame);
    } else {
        ModManager.addScripts();
        _alias_modmanage_startNewGame.call(this);
    }
};

Scene_Title.prototype.commandModManage = function() {
    this._commandWindow.close();
    SceneManager.push(Scene_ModManage);
}

//-----------------------------------------------------------------------------

var DMcreateGameObjsWEncryptList = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    DMcreateGameObjsWEncryptList.call(this);
    this.loadEncryptionList();
}

//TODO - change all this to work with some master mapping
//  of encryption flags+keys as needed to relevant assets
var DMloadGameWScripts = DataManager.loadGame;
DataManager.loadGame = function(savefileId) {
    var val = DMloadGameWScripts.call(this, savefileId);
    //Save original encryption key;
    //  Only do the first time - otherwise a "load" from a modded save would mess it up
    if (!Decrypter._baseEncryptionKey) {
        if ($dataSystem.encryptionKey) {
            Decrypter._baseEncryptionKey = $dataSystem.encryptionKey.split(/(.{2})/).filter(Boolean);
        }
    }
    //Vanilla/base data files loaded at boot, once we start a game, reload them based on
    //  the patch
    DataManager.loadDatabase();
    //Flush cache if we're potentially changing versions, ie
    // where games are pulled from
    ImageManager.clear(); //TODO: This will fuck up the window 
    return val;
};

DataManager.loadEncryptionList = function() {
    this._encryptionList = ModManager.loadEncryptionList(this._version);
}

//Global save info defs knows which save is on which mod/patch
// so we can show this during save file list screens
const DMsaveGameWPath = DataManager.saveGameWithoutRescue;
DataManager.saveGameWithoutRescue = function(savefileId) {
    var val = DMsaveGameWPath.call(this, savefileId);
    var globalInfo = this.loadGlobalInfo();
    globalInfo[savefileId].patch = DataManager._version;
    this.saveGlobalInfo(globalInfo);
    return val;
}

//-----------------------------------------------------------------------------

const DMcheckImageIgnoreIfNoEncrypt = Decrypter.checkImgIgnore;
Decrypter.checkImgIgnore = function(url){
    if (!DataManager._version) {
        return DMcheckImageIgnoreIfNoEncrypt.call(this, url);
    }
    //If this is in the encryption list with a key of "null",
    //  it is unencrypted, "ignore" the encryption
    if (DataManager._encryptionList) {
        if (url in DataManager._encryptionList) {
            if (!DataManager._encryptionList[url]) {
                return true;
            }
        }
    }
    return DMcheckImageIgnoreIfNoEncrypt.call(this, url);
}

Decrypter.readBaseEncryptionkey = function(){
    return this._baseEncryptionKey;
};

Decrypter.getEncryptionKey = function(url) {
    DataManager.loadEncryptionList();
    if (DataManager._version) {
        if (url in DataManager._encryptionList) {
            return DataManager._encryptionList[url];
        }
    }
    return this.readBaseEncryptionkey();
}

/* Regrettably, even though the necessary change in each function is so frustratingly minor,
 * I could find no alternative but to overwrite these Decrypt functions.
 */

const _xml_open_diverted_path = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    if (DataManager._version) {
        DataManager.loadEncryptionList();
        //inelegant, but have to remove prefix install path if it's already been appended
        //  appropriate encryption key for the asset path
        url = url.replace(DataManager._version, '')

        //really this probably shouldn't exist, should all be covered by the latter (else if) case
        if (url in DataManager._encryptionList) {
            url = path.join(DataManager._version, url);
        } else if (fs.existsSync(path.join(DataManager._version, url))) {
            url = path.join(DataManager._version, url);
        }
    }
    return _xml_open_diverted_path.call(this, method, url);
}

/* Intercept it here so that the cache will differentiate images from different
   installs... which only comes up for save lists, but doesn't hurt */

const _load_normal_bitmap_diverted_path = ImageManager.loadNormalBitmap;
ImageManager.loadNormalBitmap = function(url, hue) {
    if (DataManager._version) {
        DataManager.loadEncryptionList();
        //really this probably shouldn't exist, should all be covered by the latter (else if) case
        if (url in DataManager._encryptionList) {
            url = path.join(DataManager._version, url);
        } else if (fs.existsSync(path.join(DataManager._version, url))) {
            url = path.join(DataManager._version, url);
        }
    }
    return _load_normal_bitmap_diverted_path.call(this, url, hue);
}

const _reserve_normal_bitmap_diverted_path = ImageManager.reserveNormalBitmap;
ImageManager.reserveNormalBitmap = function(url, hue, reservationId){
    if (DataManager._version) {
        DataManager.loadEncryptionList();
        //really this probably shouldn't exist, should all be covered by the latter (else if) case
        if (url in DataManager._encryptionList) {
            url = path.join(DataManager._version, url);
        } else if (fs.existsSync(path.join(DataManager._version, url))) {
            url = path.join(DataManager._version, url);
        }
    }
    return _reserve_normal_bitmap_diverted_path.call(this, url, hue, reservationId);
};

/*
var _bitmap_request_image_diverted_path = Bitmap.prototype._requestImage;
Bitmap.prototype._requestImage = function(url){
    if (DataManager._version) {
        console.log(url)
        DataManager.loadEncryptionList();
        //really this probably shouldn't exist, should all be covered by the latter (else if) case
        if (url in DataManager._encryptionList) {
            url = path.join(DataManager._version, url);
        } else if (fs.existsSync(path.join(DataManager._version, url))) {
            url = path.join(DataManager._version, url);
        }
    }
    _bitmap_request_image_diverted_path.call(this, url);
} */

/*
Decrypter.decryptImg = function(url, bitmap) {
    console.log(url)
    url = this.extToEncryptExt(url);

    var requestFile = new XMLHttpRequest();
    requestFile.open("GET", url, true);
    requestFile.responseType = "arraybuffer";
    requestFile.send();

    requestFile.onload = function () {
        if(this.status < Decrypter._xhrOk) {
            // var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response); //Change
            var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response, url);
            bitmap._image.src = Decrypter.createBlobUrl(arrayBuffer);
            bitmap._image.addEventListener('load', bitmap._loadListener = Bitmap.prototype._onLoad.bind(bitmap));
            bitmap._image.addEventListener('error', bitmap._errorListener = bitmap._loader || Bitmap.prototype._onError.bind(bitmap));
        }
    };

    requestFile.onerror = function () {
        if (bitmap._loader) {
            bitmap._loader();
        } else {
            bitmap._onError();
        }
    };
}; */

Decrypter.decryptHTML5Audio = function(url, bgm, pos) {
    var requestFile = new XMLHttpRequest();
    requestFile.open("GET", url);
    requestFile.responseType = "arraybuffer";
    requestFile.send();

    requestFile.onload = function () {
        if(this.status < Decrypter._xhrOk) {
            /* var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response); */ //Change
            var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response, url);
            var url = Decrypter.createBlobUrl(arrayBuffer);
            AudioManager.createDecryptBuffer(url, bgm, pos);
        }
    };
};

WebAudio.prototype._load = function(url) {
    if (WebAudio._context) {
        var xhr = new XMLHttpRequest();
        if(Decrypter.hasEncryptedAudio) url = Decrypter.extToEncryptExt(url);
        xhr.open('GET', url);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
            if (xhr.status < 400) {
                this._onXhrLoad(xhr, url); /* this._onXhrLoad(xhr); */ //Change
            }
        }.bind(this);
        xhr.onerror = this._loader || function(){this._hasError = true;}.bind(this);
        xhr.send();
    }
};

/* WebAudio.prototype._onXhrLoad = function(xhr) { */ //Change
WebAudio.prototype._onXhrLoad = function(xhr, url=null) {
    var array = xhr.response;
    /* if(Decrypter.hasEncryptedAudio) array = Decrypter.decryptArrayBuffer(array); */ //Change
    if(Decrypter.hasEncryptedAudio) array = Decrypter.decryptArrayBuffer(array, url);
    this._readLoopComments(new Uint8Array(array));
    WebAudio._context.decodeAudioData(array, function(buffer) {
        this._buffer = buffer;
        this._totalTime = buffer.duration;
        if (this._loopLength > 0 && this._sampleRate > 0) {
            this._loopStart /= this._sampleRate;
            this._loopLength /= this._sampleRate;
        } else {
            this._loopStart = 0;
            this._loopLength = this._totalTime;
        }
        this._onLoad();
    }.bind(this));
};

/* Decrypter.decryptArrayBuffer = function(arrayBuffer) { */
Decrypter.decryptArrayBuffer = function(arrayBuffer, url=null) {
    if (!arrayBuffer) return null;
    var header = new Uint8Array(arrayBuffer, 0, this._headerlength);

    var i;
    var ref = this.SIGNATURE + this.VER + this.REMAIN;
    var refBytes = new Uint8Array(16);
    for (i = 0; i < this._headerlength; i++) {
        refBytes[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
    }
    for (i = 0; i < this._headerlength; i++) {
        if (header[i] !== refBytes[i]) {
            throw new Error("Header is wrong");
        }
    }

    arrayBuffer = this.cutArrayHeader(arrayBuffer, Decrypter._headerlength);
    var view = new DataView(arrayBuffer);
    this._encryptionKey = this.getEncryptionKey(url);/* this.readEncryptionkey(); */ //Change
    if (arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer);
        for (i = 0; i < this._headerlength; i++) {
            byteArray[i] = byteArray[i] ^ parseInt(Decrypter._encryptionKey[i], 16);
            view.setUint8(i, byteArray[i]);
        }
    }

    return arrayBuffer;
};

/* To explain the ImageManager.clear() - the ImageManager caches bitmaps
 *   based on url/filepath... this is the enemy of what we're doing, where
 *   in two different saves (on different patches), two assets with the same
 *   filepath may reroute to different modded assets in a process that gets
 *   "skipped" with ImageManager caching. So since we're trying to render
 *   possibly different patches of the same assets at once on the screen,
 *   we have to clear the cache every time.
 */
 /*
Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {
    if (info.characters) {
        for (var i = 0; i < info.characters.length; i++) {
            var data = info.characters[i];
            if (info.patch) { 
                DataManager._backupVersion = DataManager._version;
                DataManager._version = info.patch;
            } //Will cause it to use save's patch's images, if applicable
            console.log(data[0])
            console.log(data[1])
            console.log(info.patch)
            this.drawCharacter(data[0], data[1], x + i * 48, y);
            if (info.patch) { //Restore version, in case we're in-game
                DataManager._version = DataManager._backupVersion;
            }
        }
    }
};*/

const _data_manage_reserve_save_images_with_reroute = DataManager.loadSavefileImages;
DataManager.loadSavefileImages = function(info) {
    if (info.patch) { 
        DataManager._backupVersion = DataManager._version;
        DataManager._version = info.patch;
    }
    _data_manage_reserve_save_images_with_reroute.call(this, info)
    if (info.patch) { //Restore version, in case we're in-game
        DataManager._version = DataManager._backupVersion;
    }
};

const _image_manage_draw_party_with_reroute = Window_SavefileList.prototype.drawPartyCharacters;
Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {
    if (info.patch) { 
        DataManager._backupVersion = DataManager._version;
        DataManager._version = info.patch;
    } //Will cause it to use save's patch's images, if applicable
    _image_manage_draw_party_with_reroute.call(this, info, x, y);
    if (info.patch) { //Restore version, in case we're in-game
        DataManager._version = DataManager._backupVersion;
    }
};
/*
const _data_manage_reserve_save_images_with_reroute = DataManager.loadSavefileImages;
DataManager.loadSavefileImages = function(info) {
    if (info.patch) {
        this._backupVersion = this._version;
        this._version = info.patch;
    }
    _data_manage_reserve_save_images_with_reroute.call(this, info);
    if (info.patch) { //Restore version, in case we're in-game
        this._version = this._backupVersion;
    }
};*/

//-----------------------------------------------------------------------------

var LoadScriptFromDoc = Scene_Boot.prototype.initialize;
Scene_Boot.prototype.initialize = function() {
    ModManager.readScriptSettings(LoadScriptFromDoc.bind(this));
};

Window_Base.prototype.addWindow = function(window) {
    Scene_Base.prototype.addWindow.call(this, window);
}

var save_ver_make_save_contents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    var contents = save_ver_make_save_contents.call(this);
    contents = contents || {};
    contents._patch = this._version;
    return contents;
}

var extr_ver_make_save_contents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    extr_ver_make_save_contents.call(this, contents);
    this._version = contents._patch;
    this.loadEncryptionList();
}

var quick_load_increment_lock = DataManager.loadDataFile;
DataManager.loadDataFile = function(name, src) {
    if (ModManager.quickLoad) {
        const backup = JSON.parse(JSON.stringify(window[name]));
        ModManager._loadLock += 1;
        quick_load_increment_lock.call(this, name, src); //sets window[name] to null before the load;
            //unnecessary, since we will not run ModManager.queuedFunction until after all have been loaded
            //regardless; sometimes causes problems when data structs are suddenly null in the interim,
            //as the base game code only expects them to be null once, at the start
        window[name] = backup;
    } else {
        quick_load_increment_lock.call(this, name, src);
    }
    
}

var quick_load_fake_database = DataManager.onLoad;
DataManager.onLoad = function(object) {
    if (ModManager.quickLoad) {
        quick_load_fake_database.call(DataManager, object);
        ModManager._loadLock -= 1;
        if (ModManager._loadLock == 0) {
            //ImageManager.clear(); //TODO - if it loads a special window, have to... undo that...
            ModManager.queuedFunction.call();
            ModManager.quickLoad = false;
        }
    } else {
        quick_load_fake_database.call(DataManager, object);
    }
};

//-----------------------------------------------------------------------------
// Window_TitleCommand
//
// The window for selecting New Game/Continue on the title screen.

var _alias_modmanage_win_titlecom_make_com_lst = Window_TitleCommand.prototype.makeCommandList;
Window_TitleCommand.prototype.makeCommandList = function() {
    _alias_modmanage_win_titlecom_make_com_lst.call(this);
    var fs = require('fs');
    if (fs.existsSync(ModManager._path)) {
        this.addCommand('Mods', 'mod');
    }
}

//-----------------------------------------------------------------------------
// Scene_StartGame
//
// If another install is detected, ask which to use when starting a game

function Scene_StartGame() {
    this.initialize.apply(this, arguments);
}

Scene_StartGame.prototype = Object.create(Scene_Base.prototype);
Scene_StartGame.prototype.constructor = Scene_StartGame;

Scene_StartGame.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createWindowLayer();
    this.createCommandWindow();
}
Scene_StartGame.prototype.createCommandWindow = function() {
    var fs = require('fs');
    var path = require('path');
    var dir = path.join(ModManager._path, ModManager._installsFolder);
    var installs = (fs.existsSync(dir)) ? fs.readdirSync(dir) : [];
    installs.splice(0,0,ModManager._baseGameText);
    this._commandWindow = new Window_CommandList(installs, 0, Graphics.boxHeight/2-40);
    for (var i in installs) {
        if (i > 0) {
            var version = installs[i];
            if (!version) version = path.dirname(process.mainModule.filename);
            else version = path.join(ModManager._path, ModManager._installsFolder, version);
            //this._commandWindow.addCommand(version, version);
            this._commandWindow.setHandler(installs[i], this.commandStart(version).bind(this));
        } else {
            this._commandWindow.setHandler('|Base Game|', this.commandStart(null).bind(this));
        }
    }
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
}

Scene_StartGame.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
};

Scene_StartGame.prototype.commandStart = function(install) {
    return function() {
        DataManager._version = path.join(ModManager._path, ModManager._installsFolder, install);
        //Vanilla/base data files loaded at boot, once we start a game, reload them based on
        //  the patch
        DataManager.loadDatabase();
        DataManager.setupNewGame();
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.pop(); //returns to Scene_Title, which calls init and would clear DataManager._version
        ModManager.addScripts();
        SceneManager.goto(Scene_Map);
    }
}

//-----------------------------------------------------------------------------
// Scene_ModManage
//
// The scene class for handling script mods and mod data patches

function Scene_ModManage() {
    this.initialize.apply(this, arguments);
}

Scene_ModManage.prototype = Object.create(Scene_Base.prototype);
Scene_ModManage.prototype.constructor = Scene_ModManage;

Scene_ModManage.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    this._patch = {};
};

Scene_ModManage.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    const showModCreationTab = fs.existsSync(ModManager._base);
    const activeSaveTab = DataManager.isAnySavefileExists();

    this.createBackground();
    this.createWindowLayer();
    this.createCommandWindow(showModCreationTab);
    this.createScriptConfWindow();
    this.createPatchConfWindow();
    this.createSaveConvertWindow();
    
    if (showModCreationTab) {
        this.createPatchCreateWindow();
    }

    this.restoreActive();
};

Scene_ModManage.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
};

Scene_ModManage.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
};

Scene_ModManage.prototype.createCommandWindow = function(createPage = false) {
    this._commandWindow = new Window_ModTypeCommand(0, 0, createPage);
    this._commandWindow.setHandler('patches', this.commandPatch.bind(this));
    this._commandWindow.setHandler('scripts', this.commandScript.bind(this));
    this._commandWindow.setHandler('save', this.commandSaveConvert.bind(this));
    if (createPage) {
        this._commandWindow.setHandler('create', this.commandPatchCreate.bind(this));
    }
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
}

Scene_ModManage.prototype.createPatchConfWindow = function() {
    this._patchConfigWindow = new Window_ModPatchConfig(0, this._commandWindow.height);
    this._patchConfigWindow.setCancelHandler(this.restoreActive.bind(this));
    this.addWindow(this._patchConfigWindow);
}

Scene_ModManage.prototype.createScriptConfWindow = function() {
    this._scriptConfigWindow = new Window_ModScriptConfig(0, this._commandWindow.height);
    this._scriptConfigWindow.setCancelHandler(this.restoreActive.bind(this));
    this.addWindow(this._scriptConfigWindow);
}

Scene_ModManage.prototype.createSaveConvertWindow = function() {
    this._saveConvertWindow = new Window_SaveConvert(0, this._commandWindow.height);
    this._saveConvertWindow.setCancelHandler(this.restoreActive.bind(this));
    this.addWindow(this._saveConvertWindow);
}

Scene_ModManage.prototype.createPatchCreateWindow = function() {
    this._patchCreateWindow = new Window_ModPatchCreate(0, this._commandWindow.height);
    this._patchCreateWindow.setCancelHandler(this.restoreActive.bind(this));
    this.addWindow(this._patchCreateWindow);
}

Scene_ModManage.prototype.restoreActive = function() {
    this._commandWindow.activate();
    this._commandWindow.open();

    this._patchConfigWindow.close();
    this._patchConfigWindow.deactivate();
    this._patchConfigWindow.hide();

    this._scriptConfigWindow.close();
    this._scriptConfigWindow.deactivate();
    this._scriptConfigWindow.hide();

    if (this._saveConvertWindow) {
        this._saveConvertWindow.close();
        this._saveConvertWindow.deactivate();
        this._saveConvertWindow.hide();
    }
    if (this._patchCreateWindow) {
        this._patchCreateWindow.close();
        this._patchCreateWindow.deactivate();
        this._patchCreateWindow.hide();
    }
}

Scene_ModManage.prototype.commandPatch = function() {
    this._commandWindow.deactivate();
    this._patchConfigWindow.open();
    this._patchConfigWindow.activate();
    this._patchConfigWindow.show();
    this._patchConfigWindow.init(); //init's the patch, so the user cannot cause a crash
}

Scene_ModManage.prototype.commandScript = function() {
    this._commandWindow.deactivate();
    this._scriptConfigWindow.open();
    this._scriptConfigWindow.activate();
    this._scriptConfigWindow.show();
}

Scene_ModManage.prototype.commandSaveConvert = function() {
    this._commandWindow.deactivate();
    this._saveConvertWindow.open();
    this._saveConvertWindow.activate();
    this._saveConvertWindow.show();
}

Scene_ModManage.prototype.commandPatchCreate = function() {
    this._commandWindow.deactivate();
    this._patchCreateWindow.open();
    this._patchCreateWindow.activate();
    this._patchCreateWindow.show();
}

//-----------------------------------------------------------------------------
// Window_ModTypeCommand
//
// The window for selecting New Game/Continue on the title screen.

function Window_ModTypeCommand() {
    this.initialize.apply(this, arguments);
}

Window_ModTypeCommand.prototype = Object.create(Window_Horz2.prototype);
Window_ModTypeCommand.prototype.constructor = Window_ModTypeCommand;

Window_ModTypeCommand.prototype.initialize = function(x, y, createPage = false) {
    cols = (createPage) ? 4 : 3;
    this._showCreatePage = createPage;
    Window_Horz2.prototype.initialize.call(this, x, y, {'maxcols': cols});
    this.defaultToFirstOption();
};

Window_ModTypeCommand.prototype.makeCommandList = function() {
    this.addCommand("Patches",      'patches', this.patchesAvailable());
    this.addCommand("Scripts",      'scripts', this.pluginsAvailable());
    this.addCommand("Convert Save", 'save',    this.savesAvailable());
    this.addCommand("Create",       'create',  this.createAvailable());

    //provide user advice/inform user
    if (this._list[0].enabled == false) {
        this._list[0].name = "No patches detected in 'mods/patches/'";
    }
    if (this._list[1].enabled == false) {
        this._list[1].name = "No scripts detected in 'mods/scripts/'"
    }
}

Window_ModTypeCommand.prototype.defaultToFirstOption = function() {
    for (var i = 0; i < this._list.length; i += 1) {
        if (this._list[i].enabled) {
            this.select(i);
            break;
        } 
    }
}

//Must have the /mods/patches folder setup to even try to use patches
Window_ModTypeCommand.prototype.patchesAvailable = function() {
    var filepath = path.join(ModManager._path);
    if (fs.existsSync(filepath)) {
        filepath = path.join(filepath, 'patches') 
        if (fs.existsSync(filepath) && (fs.readdirSync(filepath).length > 0)) {
            return true;
        }
    }
    return false;
}

//Must have the /mods/scripts folder setup to even try to use scripts
Window_ModTypeCommand.prototype.pluginsAvailable = function() {
    var filepath = ModManager._path;
    if (fs.existsSync(filepath)) {
        filepath = path.join(filepath, 'scripts');
        if (fs.existsSync(filepath) && (fs.readdirSync(filepath).length > 0)) {
            return true;
        }
    }
    return false;
}

//Must have a save folder, with some files (assumed to be save files, you can try to "trick" it but... you won't
//  get much out of that) to convert saves
Window_ModTypeCommand.prototype.savesAvailable = function() {

    const saveFolder = path.join(path.dirname(process.mainModule.filename), 'save');
    const existingPatches = path.join(ModManager._path, ModManager._installsFolder);
    if (fs.existsSync(saveFolder) && fs.existsSync(existingPatches)) {
        const saves = fs.readdirSync(saveFolder);
        const installs = fs.readdirSync(existingPatches);
        if ((saves.length > 0) && (installs.length > 0)) {
            return true;
        }
    }
    return false;
}

//Must have the /base folder setup (and have it be nonempty) to try to create
// a patch
Window_ModTypeCommand.prototype.createAvailable = function() {
    if (fs.existsSync(ModManager._base)) {
        const files = fs.readdirSync(ModManager._base);
        if (files.length > 0) {
            return true;
        }
    }
    return false;
}

//-----------------------------------------------------------------------------
// Window_ModScriptConfig
//
// Collection of Windows together let a user set parameters;
// Contains a 3xN Window_Selectable, a confirm button, a Window_Textbox for input, and a help window

function Window_ModScriptConfig() {
    this.initialize.apply(this, arguments);
}

Window_ModScriptConfig.prototype = Object.create(Window_Base.prototype);
Window_ModScriptConfig.prototype.constructor = Window_ModScriptConfig;

Window_ModScriptConfig.prototype.initialize = function(x, y) {
    Window_Base.prototype.initialize.call(this, x, y, Graphics.boxWidth - x, Graphics.boxHeight - y);
    this._listIndex = 0;
    this._menuState = [];
    this.createWindows();
    if (this.noScripts()) return;
    for (var i in this._scriptChoicesWindow._list) {
        this._menuState.push([0,0]); //[window index, paramList index]
    }
    this.refreshBoxes();
    this.setState('list');
};

Window_ModScriptConfig.prototype.noScripts = function() {
    return (this._scriptChoicesWindow._list.length == 0);
}

Window_ModScriptConfig.prototype.createWindows = function() {
    this.createScriptListWindow();
    this.createInputWindow();
    this.createHelpWindow();
    this.createToggleWindow();
    this.createSubmitButton();
    this.createParamListWindow();
};

Window_ModScriptConfig.prototype.setupToggle = function() {
    var script = this._scriptChoicesWindow._list[this._listIndex].name;
    this._toggleWindow.select(ModManager._scripts[script] ? 0 : 1);
};

Window_ModScriptConfig.prototype.setupParams = function() {
    var script = this._scriptChoicesWindow._list[this._listIndex].name;
    this._paramWindow.setCommandList(Object.keys(ModManager._parameters[script]), this._menuState[this._listIndex][1]);
    this._paramWindow.setCursorRect(0,0,0,0); //hide cursors
};

Window_ModScriptConfig.prototype.setupDesc = function() {
    this._descWindow.contents.clear();
    var script = this._scriptChoicesWindow._list[this._listIndex].name;
    var param = this._paramWindow.getResult();
    var desc = (param) ? (ModManager._parameters[script][param.name].desc || "") : "";
    this._descWindow.contents.fontSize = 12;
    this._descWindow.drawWrapText(desc);
};

Window_ModScriptConfig.prototype.setupInput = function() {
    var script = this._scriptChoicesWindow._list[this._listIndex].name;
    var param = this._paramWindow.getResult();
    this._inputWindow.hide(); //this._inputWindow.deactivate();
    this._inputWindowT.hide(); //this._inputWindowT.deactivate();
    this._inputWindowD.hide(); //this._inputWindowD.deactivate();
    var def = (param)?(ModManager._parameters[script][param.name]._realValue || ""):"";
    if (param && ModManager._parameters[script][param.name].values && ModManager._parameters[script][param.name].values.length > 1) {
        //use drop-down
        this._inputWindowD.show(); //this._inputWindowD.activate();
        var values = ModManager._parameters[script][param.name].values;
        this._inputWindowD.setCommandList(values, Math.max(0, values.indexOf(def)));
        this._inputWindowD.setCursorRect(0,0,0,0); //hide cursors
    } else if (param && (ModManager._parameters[script][param.name].on || ModManager._parameters[script][param.name].off)) {
        //use toggle
        this._inputWindowT.show(); //this._inputWindowD.activate();
        this._inputWindowT.select((def)?0:1); //[On, Off]
    } else {
        //use textbox
        this._inputWindow.show(); //this._inputWindow.activate();
        var type = (param)?(ModManager._parameters[script][param.name].type || "string"):"string";
        var min = (param)?(ModManager._parameters[script][param.name].min || null):null;
        var max = (param)?(ModManager._parameters[script][param.name].max || null):null;
        if (min && type == 'Number') min = Number(min); if (max && type == 'Number') max = Number(max);
        if (min !== null) {
            if (max !== null) {
                var con = function(message) { return (min <= message && message <= max);}
                this._inputWindow.setConstraint(con, "Value must be between "+min+" and "+max+".");
            } else {
                var con = function(message) { return (min <= message);}
                this._inputWindow.setConstraint(con, "Value must be at least "+min+".");
            }
        } else if (max !== null) {
            var con = function(message) { return (message <= max);}
            this._inputWindow.setConstraint(con, "Value must not exceed "+max+".");
        }
        this._inputWindow.setHint(def, true);
        this._inputWindow.setType(type);
    }
}

Window_ModScriptConfig.prototype.goRight = function() {
    SoundManager.playCursor();
    var index = this._scriptChoicesWindow.index();
    var windows = ['toggle', 'param', 'input', 'submit'];
    this.setState(windows[this._menuState[index][0]]);
};
Window_ModScriptConfig.prototype.goLeft = function() {
    SoundManager.playCursor();
    var windows = ['toggle', 'param', 'input', 'submit'];
    var script = this._scriptChoicesWindow._list[this._listIndex].name;
    this._menuState[this._listIndex] = [windows.indexOf(this.state), this._paramWindow._dropIndex];
    ModManager._scripts[script] = (this._toggleWindow.index() == 0);
    ModManager.logScriptSettings();
    this.setState('list');
}

Window_ModScriptConfig.prototype.isInputTouchedInsideFrame = function() {
    //probably none of this matters
    if (this._inputWindow.visible && this._inputWindow.isTouchedInsideFrame())
        return true;
    if (this._inputWindowT.visible && this._inputWindowT.isTouchedInsideFrame())
        return true;
    if (this._inputWindowD.visible) {
        if (this._inputWindowD._selecting) {
            return this._inputWindowD._options.isTouchedInsideFrame();
        } else {
            return this._inputWindowD.isTouchedInsideFrame();
        }
    }
    return false;
}

Window_ModScriptConfig.prototype.update = function() {
    var okTrigger = Input.isTriggered('ok');
    var touchTrigger = TouchInput.isTriggered();
    Window_Base.prototype.update.call(this);
    if (!this.active || this.noScripts()) return;

    if (touchTrigger) {
        var state = null;
        if (this._scriptChoicesWindow.isTouchedInsideFrame()) {
            if (this.state != 'list') { this.goLeft(); return; }
            else { state = 'list'; }
        } else if (this._paramWindow.isTouchedInsideFrame() && this._paramWindow.visible) {
            state = 'param';
        } else if (this._toggleWindow.isTouchedInsideFrame()) {
            state = 'toggle';
        } else if (this.isInputTouchedInsideFrame()) {
            state = 'input';
        } else if (this._saveButton.isTouchedInsideFrame() && this._saveButton.visible) {
            state = 'submit';
        }
        if (this._listIndex != this._scriptChoicesWindow.index()) {
            this._listIndex = this._scriptChoicesWindow.index();
            this.refreshBoxes();
        }
        this.setState(state);
    } else {
        //support movement between
        if (this.state == 'list') {
            if (Input.isTriggered('right') || okTrigger) {
                this.goRight();//this.setState('param');
            } else if (Input.isTriggered('down') || Input.isTriggered('up')) {
                this._listIndex = this._scriptChoicesWindow.index();
                this.refreshBoxes();
            }
        } else if (this.state == 'toggle') {
            if (Input.isTriggered('left')) {
                if (this._toggleWindow.index() == 1) {
                    this._toggleWindow.select(0);
                    this.goLeft();
                }
            } else if ((Input.isTriggered('down') || Input.isTriggered('ok'))&& this._paramWindow.visible) {
                SoundManager.playCursor();
                this.setState('param');
            } else if (Input.isTriggered('cancel')) {
                this.goLeft();
            }
        } else if (this.state == 'param') {
            if (Input.isTriggered('left') || Input.isTriggered('cancel')) {
                if (this._paramWindow._selecting) {
                    this._paramWindow.revertUnfocus();
                }
                this.goLeft();
            } else if (Input.isTriggered('up')) {
                if (this._paramWindow._selecting) {
                    if (this._paramWindow._options.index() == this._paramWindow._options._list.length - 1) {
                        this._paramWindow.revertUnfocus();
                        SoundManager.playCursor();
                        //this.setState('toggle');
                    }
                } else {
                    SoundManager.playCursor();
                    this.setState('toggle');
                }
            } else if (Input.isTriggered('down')) {
                //if choosing, but at the bottom of the list
                if (this._paramWindow._selecting) {
                    if (this._paramWindow._options.index() == 0) {
                        this._paramWindow.revertUnfocus();
                        SoundManager.playCursor();
                        //this.setState('input');
                    }
                } else {
                    SoundManager.playCursor();
                    this.setState('input');
                }
            }
            if (this._paramIndex != this._paramWindow._dropIndex) {
                this._paramIndex = this._paramWindow._dropIndex;
                this.setupDesc();
                this.setupInput();
            }
        } else if (this.state == 'input') {
            if (Input.isTriggered('down') || Input.isTriggered('Arrow Down')) {
                    if (!this._inputWindowD.visible || !this._inputWindowD._selecting || (this._inputWindowD._options.index() === 0)) {
                    SoundManager.playCursor();
                    this.setState('submit');
                  }
            } else if (Input.isTriggered('up') || Input.isTriggered('Arrow Up')) {
                    if (!this._inputWindowD.visible || !this._inputWindowD._selecting || (this._inputWindowD._options.index() === this._inputWindowD._options._list.length)) {
                    SoundManager.playCursor();
                    this.setState('param');
                  }
            } else if (Input.isTriggered('left') || Input.isTriggered('Arrow Left') || Input.isTriggered('Escape')) {
                if (Input.isTriggered('left') && this._inputWindowT.visible && this._inputWindowT.index() == 1) {
                    this._toggleWindow.select(0);
                    this.goLeft();
                } else if (Input.isTriggered('left') && !this._inputWindow.visible) {
                        this.goLeft();
                } else if (Keyboard._cursor_pos == 0) {
                    this.goLeft();
                }
            }
        } else if (this.state == 'submit') {
            if (Input.isTriggered('left')) {
                this.goLeft();
            } else if (Input.isTriggered('up')) {
                SoundManager.playCursor();
                this.setState('input')
            }
        }
    }
};

Window_ModScriptConfig.prototype.setState = function(state) {
    if (state) {
        this.state = state;
        this._scriptChoicesWindow.deactivate();
        this._toggleWindow.deactivate();
        this._deactivateInput();
        this._paramWindow.deactivate();
        this._saveButton.deactivate();

        this._paramWindow.setCursorRect(0,0,0,0); //hide cursors
        this._inputWindowD.setCursorRect(0,0,0,0);
        this._saveButton.setCursorRect(0,0,0,0); //hide cursors
        switch(state) {
            case 'list': this._scriptChoicesWindow.activate(); break;
            case 'toggle': this._toggleWindow.activate(); break;
            case 'input': this._activateInput(); this._inputWindow.refresh(); break;
            case 'param': this._paramWindow.activate(); this._paramIndex = this._paramWindow._dropIndex; break;
            case 'submit': this._saveButton.activate(); break;
            default: return;
        }
        if (state != 'param') {
            if (this._paramWindow._selecting) {
                this._paramWindow.revertUnfocus();
            }
        }
        if (state != 'input') {
            if (this._inputWindowD._selecting) {
                this._inputWindowD.revertUnfocus();
            }
        }
    }
}

Window_ModScriptConfig.prototype.close = function() {
    Window_Base.prototype.close.call(this);
    this._scriptChoicesWindow.close();
    this._toggleWindow.close();
    this._inputWindow.close();
    this._inputWindowT.close();
    this._inputWindowD.close();
    this._descWindow.close();
    this._paramWindow.close();
    this._saveButton.close();
}
Window_ModScriptConfig.prototype.open = function() {
    Window_Base.prototype.open.call(this);
    this._scriptChoicesWindow.open();
    this._toggleWindow.open();
    this._inputWindow.open();
    this._inputWindowT.open();
    this._inputWindowD.open();
    this._descWindow.open();
    this._paramWindow.open();
    this._saveButton.open();
}
Window_ModScriptConfig.prototype.hide = function() {
    Window_Base.prototype.hide.call(this);
    this._scriptChoicesWindow.hide();
    this._toggleWindow.hide();
    this._inputWindow.hide();
    this._inputWindowT.hide();
    this._inputWindowD.hide();
    this._descWindow.hide();
    this._paramWindow.hide();
    this._saveButton.hide();
}
Window_ModScriptConfig.prototype.show = function() {
    Window_Base.prototype.show.call(this);
    this._scriptChoicesWindow.show();
    this._toggleWindow.show();
    this.refreshBoxes();
}
Window_ModScriptConfig.prototype.activate = function() {
    Window_Base.prototype.activate.call(this);
    this.setState(this.state);
}
Window_ModScriptConfig.prototype.deactivate = function() {
    Window_Base.prototype.deactivate.call(this);
    this._scriptChoicesWindow.deactivate();
    this._toggleWindow.deactivate();
    this._deactivateInput();
    this._descWindow.deactivate();
    this._paramWindow.deactivate();
    this._saveButton.deactivate();
}

Window_ModScriptConfig.prototype._activateInput = function() {
    if (this._inputWindow.visible) this._inputWindow.activate();
    if (this._inputWindowD.visible) this._inputWindowD.activate();
    if (this._inputWindowT.visible) this._inputWindowT.activate();
}

Window_ModScriptConfig.prototype._deactivateInput = function() {
    this._inputWindow.deactivate();
    this._inputWindowD.deactivate();
    this._inputWindowT.deactivate();
}

Window_ModScriptConfig.prototype.createScriptListWindow = function() {
    var fs = require('fs');
    var path = require('path');

    var scripts = []; var curr_path = path.join(ModManager._path, 'scripts');
    if (fs.existsSync(curr_path)) {
        scripts = fs.readdirSync(curr_path);
    }

    this._scriptChoicesWindow = new Window_CommandList(Object.keys(ModManager._scripts), (1.0/16.0)*Graphics.boxWidth, ((1.0/16.0)*Graphics.boxHeight), {'width':(1.0/3.0)*Graphics.boxWidth, 'height':(3.0/4.0)*Graphics.boxHeight});
    this.addChild(this._scriptChoicesWindow);
    //this._scriptChoicesWindow.drawAllItems();
};
Window_ModScriptConfig.prototype.setCancelHandler = function(method) {
    this._scriptChoicesWindow.setHandler('cancel', method);
};
Window_ModScriptConfig.prototype.createInputWindow = function() {
    this._inputWindow = new Window_Textbox({'x':(5.0/8.0)*Graphics.boxWidth,'y':((3.0/8.0)*Graphics.boxHeight+this.lineHeight()/2),'width':(1.0/4.0)*Graphics.boxWidth, 'err_dir':'down'});
    this._inputWindow.unlock(['up', 'down','left', 'Arrow Up', 'Arrow Down','Arrow Left','Escape']);
    this._inputWindowT = new Window_CommandList(['On', 'Off'], (5.0/8.0)*Graphics.boxWidth, ((3.0/8.0)*Graphics.boxHeight), {'maxcols':2,'width':(1.0/4.0)*Graphics.boxWidth});
    this._inputWindowD = new Window_Dropdown([], (5.0/8.0)*Graphics.boxWidth, ((3.0/8.0)*Graphics.boxHeight), {'align': 'center','default':true,'width': (1.0/4.0)*Graphics.boxWidth});
    this.addChild(this._inputWindow);
    this.addChild(this._inputWindowT);
    this.addChild(this._inputWindowD);
};
Window_ModScriptConfig.prototype.createHelpWindow = function() {
    this._descWindow = new Window_Base((9.0/16.0)*Graphics.boxWidth, (2.0/3.0 - 1.0/8.0)*Graphics.boxHeight+(this.lineHeight()/2.0), (3.0/8.0)*Graphics.boxWidth, (1.0/6.0)*Graphics.boxHeight );
    this.addChild(this._descWindow);
};
Window_ModScriptConfig.prototype.createParamListWindow = function() {
    this._paramWindow = new Window_Dropdown([], (9.0/16.0)*Graphics.boxWidth, (3.0/16.0)*Graphics.boxHeight+this.lineHeight(), {'align': 'top','default':true,'width': (3.0/8.0)*Graphics.boxWidth});
    this.addChild(this._paramWindow);
};
Window_ModScriptConfig.prototype.createToggleWindow = function() {
    this._toggleWindow = new Window_CommandList(['On', 'Off'], (11.0/16.0)*Graphics.boxWidth, (1.0/8.0)*Graphics.boxHeight-this.lineHeight(), {'maxcols':2,'width':(1.0/4.0)*Graphics.boxWidth});
    this.addChild(this._toggleWindow);
};
Window_ModScriptConfig.prototype.createSubmitButton = function() {
    this._saveButton = new Window_CommandList(['Save'], (5.0/8.0)*Graphics.boxWidth, (3.0/4.0)*Graphics.boxHeight, {'width':(1.0/4.0)*Graphics.boxWidth});
    this._saveButton.setHandler('Save', this.writeChanges.bind(this));
    this.addChild(this._saveButton);
};
Window_ModScriptConfig.prototype.writeChanges = function() {
    this._saveButton.activate();
    var val = null;
    if (this._inputWindow.visible) {
        val = this._inputWindow.message;
    } else if (this._inputWindowT.visible) {
        val = (this._inputWindowT.index()==0)?true:false;
    } else if (this._inputWindowD.visible) {
        val = this._inputWindowD.getResult().name;
    }
    if (val == null) {
        //sound buzzer?
    } else {
        var script = this._scriptChoicesWindow._list[this._listIndex].name;
        var param = this._paramWindow.getResult().name;
        ModManager._parameters[script][param]._realValue = val;
        ModManager.logScriptSettings();
    }
};
Window_ModScriptConfig.prototype.refreshBoxes = function() {
    this.contents.clear();
    this.setupToggle(); //show enabled for this script
    this.setupParams(); //show last selected param for this script
    this.drawText("Enable:", (1.0/2.0)*Graphics.boxWidth, (1.0/8.0)*Graphics.boxHeight-this.lineHeight(), (1.0/4.0)*Graphics.boxWidth, 'left');
    if (this._paramWindow.hasOptions()) {
        this.setupDesc(); //show description for that param
        this.setupInput(); //change default and type constraints on input
        this._paramWindow.show();
        this._descWindow.show();
        this._saveButton.show();
        this.drawText("Parameter:", (1.0/2.0)*Graphics.boxWidth, ((3.0/16.0)*Graphics.boxHeight)-this.lineHeight()/2, (1.0/4.0)*Graphics.boxWidth, 'left');
        this.drawText("Input:", (1.0/2.0)*Graphics.boxWidth, ((3.0/8.0)*Graphics.boxHeight), (1.0/4.0)*Graphics.boxWidth, 'left');
        this.drawText("Description:", (1.0/2.0)*Graphics.boxWidth, ((2.0/3.0 - 1.0/8.0)*Graphics.boxHeight-this.lineHeight()), (3.0/8.0)*Graphics.boxWidth, 'left');
    } else {
        this._inputWindow.hide();
        this._inputWindowT.hide();
        this._inputWindowD.hide();
        this._paramWindow.hide();
        this._descWindow.hide();
        this._saveButton.hide();
    }
};

//-----------------------------------------------------------------------------
// Window_ModPatchConfig
//
// Collection of Windows together let a user set parameters;
// Contains a 3xN Window_Selectable, a confirm button, a Window_Textbox for input, and a help window

function Window_ModPatchConfig() {
    this.initialize.apply(this, arguments);
}

Window_ModPatchConfig.prototype = Object.create(Window_Base.prototype);
Window_ModPatchConfig.prototype.constructor = Window_ModPatchConfig;

Window_ModPatchConfig.prototype.initialize = function(x, y) {
    Window_Base.prototype.initialize.call(this, x, y, Graphics.boxWidth - x, Graphics.boxHeight - y);
    this._listIndex = 0;
    this._menuState = [];
    this._history = [];

    this.createWindows();
    if (this.noPatches()) return;
    for (var i in this._patchChoicesWindow._list) {
        this._menuState.push([[],0,1]); //last selected tags
    }
    this._rightState = 'init';

    this.setState('list');
};

Window_ModPatchConfig.prototype.noPatches = function() {
    return (this._patchChoicesWindow._list.length == 0)
}

Window_ModPatchConfig.prototype.createWindows = function() {
    this.createPatchListWindow();
    this.createHistoryWindow();
    this.createExportButton();
    this.createInitButton();
    this.createApplyButton();
    this.createShadeSprite(); //goes under textbox, helps signal "export"
    this.createInputWindow(); //for naming exported patches
};

//credit to: https://gist.github.com/doctaphred/d01d05291546186941e1b7ddc02034d3
// and https://stackoverflow.com/questions/11100821/javascript-regex-for-validating-filenames
Window_ModPatchConfig.prototype.doExportConfirm = function() {
    var used = []; //test to make sure they do not pick a name they have already used
    if (fs.existsSync(path.join(ModManager._path, ModManager._installsFolder))) {
        used = fs.readdirSync(path.join(ModManager._path, ModManager._installsFolder));
    }
    
  var isValidFoldername = function(fname){
    var rg1=/^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
    var rg2=/((^\.)|(( |\.)$))/; // cannot start with dot (.), cannot end with space or dot
    var rg3=/^(nul|prn|con|aux|lpt[1-9]|com[1-9])(\.|$)/i; // forbidden file names
    result = (fname!=null)&&rg1.test(fname)&&!rg2.test(fname)&&!rg3.test(fname)&&(used.indexOf(fname) < 0)&&(fname.length > 0);
    //console.log("result:",rg1.test(fname),!rg2.test(fname),!rg3.test(fname),(used.indexOf(fname) < 0), (fname.length > 0),result);
    return result;
  };
  return isValidFoldername(this._inputText.message);
};

Window_ModPatchConfig.prototype.cancelConfirm = function() {
    this._tintSprite.visible = false;
    this._inputText.deactivate();
    this._inputText.hide();
    this.setState('export');
};

Window_ModPatchConfig.prototype.export = function() {
    this._tintSprite.visible = true;
    this._inputText.activate();
    this._inputText.show();
    this._inputText.open();
    this.setupInput();
    this.setState('input');
}

Window_ModPatchConfig.prototype.init = function() {
    //clear patch temp:
    ModManager.clearPatch();
    //clear history:
    this._history = [];
    this._historyWindow.contents.clear();
    //initialize patch setting:
    ModManager.preparePatch();
    this._initButton.active = true;
};

Window_ModPatchConfig.prototype.apply = function() {
    var patch = this._patchChoicesWindow._list[this._listIndex].name;
    //Unnecessary - holdover, but I'm not confident enough to remove,
    //  it's not a lot of overhead anyway
    ModManager.set(patch);

    ModManager._applyPatch(patch);

    this._history.push("PATCH: "+patch+"\n");
    this.setupHistory();
    this._applyButton.active = true;
}

Window_ModPatchConfig.prototype.doExportFinal = function() {
  //make sure we can save the patch
  if (!this.doExportConfirm()) {
    //if it returns false, it plays buzzer and the textbox should show an error
    return;
  }
  const patchName = this._inputText.message;
  const dest = path.join(ModManager._path, ModManager._installsFolder, patchName);
  //save contents of curr to new patch. Also clears temp.
  ModManager.savePatch(patchName);
  //save the encryption list for any new assets
  ModManager.dumpEncryptionList(dest);

  //clear tag settings:
  for (var i in this._menuState) { this._menuState[i] = [[],0,1]; }

  //log history and clear:
  const patchTxt = path.join(dest, 'patch.txt');
  fs.writeFileSync(patchTxt, JSON.stringify(this._history), {encoding: 'utf8'});

  this._history = [];
  this._historyWindow.contents.clear();

  //restore menu
  this._exportButton.active = true;
  this.cancelConfirm();
};

Window_ModPatchConfig.prototype.setupInput = function() {
    this._inputText.setConstraint(this.doExportConfirm,"Must be a new, valid folder name.");
}

Window_ModPatchConfig.prototype.setupHistory = function() {
    var message = "";
    this._historyWindow.contents.clear();
    for (var i in this._history) {
        message += this._history[i];
    }
    this._historyWindow.drawWrapText(message, 20, 'left', 16);
};

Window_ModPatchConfig.prototype.goRight = function() {
    SoundManager.playCursor();
    this._listIndex = this._patchChoicesWindow.index();

    this.setState(this._rightState);
};
Window_ModPatchConfig.prototype.goLeft = function() {
    SoundManager.playCursor();
    this._rightState = this.state;
    this.setState('list');
}

Window_ModPatchConfig.prototype.update = function() {
    var okTrigger = Input.isTriggered('ok');
    var touchTrigger = TouchInput.isTriggered();
    Window_Base.prototype.update.call(this);
    if (!this.active || this.noPatches()) return;

    //If there is a click
    if (touchTrigger) {
        var state = null;
        //If we are already in naming/input/export-confirmation phase,
        if (this.state == 'input') {
            //If it's just a click to somewhere within the input textbox, do nothing
            if (this._inputText.isTouchedInsideFrame()) {
                //do nothing
            //Otherwise, a click outside the textbox is treated as an escape/cancel from input phase
            } else {
                //exit
                SoundManager.playCancel();
                this.cancelConfirm();
            }
        //If a click occurred while we were not in the input phase, but rather some
        //  settings/menu navigation-related click:
        } else {
            //If a part of the menu is clicked, give that window focus
            if (this._patchChoicesWindow.isTouchedInsideFrame()) {
                if (this.state != 'list') { this.goLeft(); return; }
                else { state = 'list'; }
            } else if (this._exportButton.isTouchedInsideFrame()) {
                state = 'export';
            } else if (this._initButton.isTouchedInsideFrame()) {
                state = 'init';
            } else if (this._applyButton.isTouchedInsideFrame()) {
                state = 'apply';
            }

            this.setState(state);
        }
    } else {
        //If there was no click this phase, check for other input - cancel or arrow
        //  navigation across/within windows
        if (this.state == 'input') {
            if (Input.isTriggered('cancel')||Input.isTriggered('Escape')) {
                SoundManager.playCancel();
                this.cancelConfirm();
            }
        //support movement between
        } if (this.state == 'list') {
            if (Input.isTriggered('right') || okTrigger) {
                this.goRight();//this.setState('param');
            } else if (Input.isTriggered('down') || Input.isTriggered('up')) {
                this._listIndex = this._patchChoicesWindow.index();
                this.setState('list');
            }
        } else if (this.state == 'export') {
            if (Input.isTriggered('left') || Input.isTriggered('cancel')) {
                this.goLeft();
            } else if (Input.isTriggered('up')) {
                SoundManager.playCursor();
                this.setState('apply');
            } else if (Input.isTriggered('down')) {
                SoundManager.playCursor();
                this.setState('init');
            }
        } else if (this.state == 'init') {
            if (Input.isTriggered('left') || Input.isTriggered('cancel')) {
                this.goLeft();
            } else if (Input.isTriggered('up')) {
                SoundManager.playCursor();
                this.setState('export');
            } else if (Input.isTriggered('down')) {
                SoundManager.playCursor();
                this.setState('apply');
            }
        } else if (this.state == 'apply') {
            if (Input.isTriggered('left') || Input.isTriggered('cancel')) {
                this.goLeft();
            } else if (Input.isTriggered('up')) {
                SoundManager.playCursor();
                this.setState('init');
            } else if (Input.isTriggered('down')) {
                SoundManager.playCursor();
                this.setState('export');
            }
        }
    }
};

Window_ModPatchConfig.prototype.setState = function(state) {
    if (state) {
        //this._inputText only activated/deactivated in a few specialized code segments
        this.state = state;
        this._patchChoicesWindow.deactivate();
        this._exportButton.deactivate();
        this._initButton.deactivate();
        this._applyButton.deactivate();

        this._exportButton.setCursorRect(0,0,0,0); //hide cursors
        this._initButton.setCursorRect(0,0,0,0);
        this._applyButton.setCursorRect(0,0,0,0);
        switch(state) {
            case 'input': this._inputText.refresh(); break;
            case 'list': this._patchChoicesWindow.activate(); break;
            case 'export': this._exportButton.activate(); break;
            case 'init': this._initButton.activate(); break;
            case 'apply': this._applyButton.activate(); break;
            default: return;
        }
        if (state != 'list') {
            this._rightState = state;
        }
    }
}

Window_ModPatchConfig.prototype.close = function() {
    Window_Base.prototype.close.call(this);
    this._inputText.close();
    this._tintSprite.visible = false;
    this._patchChoicesWindow.close();
    this._historyWindow.close();
    this._exportButton.close();
    this._initButton.close();
    this._applyButton.close();
}
Window_ModPatchConfig.prototype.open = function() {
    Window_Base.prototype.open.call(this);
    this._inputText.open();
    this._patchChoicesWindow.open();
    this._historyWindow.open();
    this._exportButton.open();
    this._initButton.open();
    this._applyButton.open();
}
Window_ModPatchConfig.prototype.hide = function() {
    Window_Base.prototype.hide.call(this);
    this._inputText.hide();
    this._tintSprite.visible = false;
    this._patchChoicesWindow.hide();
    this._historyWindow.hide();
    this._exportButton.hide();
    this._initButton.hide();
    this._applyButton.hide();
}
Window_ModPatchConfig.prototype.show = function() {
    Window_Base.prototype.show.call(this);
    if (this.state == 'input') {
        this._inputText.show();
        this._tintSprite.visible = true;
    } else {
        this._patchChoicesWindow.show();
        this._historyWindow.show();
        this._exportButton.show();
        this._initButton.show();
        this._applyButton.show();
    }
}
Window_ModPatchConfig.prototype.activate = function() {
    Window_Base.prototype.activate.call(this);
    this.setState(this.state);
}
Window_ModPatchConfig.prototype.deactivate = function() {
    Window_Base.prototype.deactivate.call(this);
    this._inputText.deactivate();
    this._patchChoicesWindow.deactivate();
    this._historyWindow.deactivate();
    this._exportButton.deactivate();
    this._initButton.deactivate();
    this._applyButton.deactivate();
}

Window_ModPatchConfig.prototype.createPatchListWindow = function() {
    var fs = require('fs');
    var path = require('path');

    var files = [];
    var patches = []; var curr_path = path.join(ModManager._path, 'patches');
    if (fs.existsSync(curr_path))
        files = fs.readdirSync(curr_path);
    for (var i in files) {
        if (fs.lstatSync(path.join(ModManager._path, 'patches', files[i])).isDirectory()) {
            patches.push(files[i]);
        }
    }
    this._patches = patches;
    this._patchChoicesWindow = new Window_CommandList(patches, (1.0/16.0)*Graphics.boxWidth, ((1.0/16.0)*Graphics.boxHeight), {'width':(1.0/3.0)*Graphics.boxWidth});
    this.addChild(this._patchChoicesWindow);
    this._patchChoicesWindow.drawAllItems();
};

Window_ModPatchConfig.prototype.setCancelHandler = function(method) {
    this._patchChoicesWindow.setHandler('cancel', method);
};

Window_ModPatchConfig.prototype.createShadeSprite = function() {
    this._tintSprite = new Sprite();
    this._tintSprite.bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
    this._tintSprite.bitmap.fillAll('#00000055');
    this._tintSprite.visible = false;
    this.addChild(this._tintSprite);
}

Window_ModPatchConfig.prototype.createInputWindow = function() {
    this._inputText = new Window_Textbox({'x':Graphics.boxWidth/2-120,'y':Graphics.boxHeight/2-20});
    this._inputText.unlock(['Escape']);
    this._inputText.setSubmitHandler(Window_ModPatchConfig.prototype.doExportFinal,this);
    this.setupInput();
    this.addChild(this._inputText);
}

Window_ModPatchConfig.prototype.createHistoryWindow = function() {
    this.drawText("History:", (1.0/2.0)*Graphics.boxWidth, ((2.0/3.0 - 1.0/8.0)*Graphics.boxHeight-this.lineHeight()), (3.0/8.0)*Graphics.boxWidth, 'left');
    this._historyWindow = new Window_Base((9.0/16.0)*Graphics.boxWidth, (2.0/3.0 - 1.0/8.0)*Graphics.boxHeight+(this.lineHeight()/2.0), (3.0/8.0)*Graphics.boxWidth, (1.0/6.0)*Graphics.boxHeight );
    this.addChild(this._historyWindow);
};

Window_ModPatchConfig.prototype.createInitButton = function() {
    this._initButton = new Window_CommandList(['Reset'], (2.0/3.0)*Graphics.boxWidth, (1.0/8.0)*Graphics.boxHeight, {'width':(1.0/6.0)*Graphics.boxWidth});
    this._initButton.setHandler('Reset', this.init.bind(this));
    this.addChild(this._initButton);
};
Window_ModPatchConfig.prototype.createApplyButton = function() {
    this._applyButton = new Window_CommandList(['Apply'], (2.0/3.0)*Graphics.boxWidth, (1.0/4.0)*Graphics.boxHeight, {'width':(1.0/6.0)*Graphics.boxWidth});
    this._applyButton.setHandler('Apply', this.apply.bind(this));
    this.addChild(this._applyButton);
};
Window_ModPatchConfig.prototype.createExportButton = function() {
    this._exportButton = new Window_CommandList(['Export'], (2.0/3.0)*Graphics.boxWidth, (3.0/8.0)*Graphics.boxHeight, {'width':(1.0/6.0)*Graphics.boxWidth});
    this._exportButton.setHandler('Export', this.export.bind(this));
    this.addChild(this._exportButton);
};
Window_ModPatchConfig.prototype.writeChanges = function() {
    this._saveButton.activate();
    ModManager.logScriptSettings();
};

//-----------------------------------------------------------------------------
// Window_ModPatchCreate
//
// Simple menu for modmakers who want to export a patch
// Contains a Window_Textbox to input the patch name, a confirm button, and two settings toggles

function Window_ModPatchCreate() {
    this.initialize.apply(this, arguments);
}

Window_ModPatchCreate.prototype = Object.create(Window_Base.prototype);
Window_ModPatchCreate.prototype.constructor = Window_ModPatchCreate;

Window_ModPatchCreate.prototype.initialize = function(x, y) {
    Window_Base.prototype.initialize.call(this, x, y, Graphics.boxWidth - x, Graphics.boxHeight - y);
    this._listIndex = 0;
    this._menuState = [];
  	this._toggleSelectedColor = '#ffce1f';
  	this._toggleSelectableColor = '#ffffff';
  	this._toggleDisabledColor = '#888888';
    AutoDiff.initializeExecArgs();

    this.createWindows();
    //setState calls refreshToggles
    this.setState('toggle3');
};
Window_ModPatchCreate.prototype.createWindows = function() {
    //a textbox to type the patch name
    this.createInputWindow();
    //checkbox for "check for changes to assets"
    this.createToggle1Window();
    //checkbox for "check for changes to scripts"
    this.createToggle2Window();
    //checkbox for "check only listed files"
    this.createToggle3Window();
    //box with description text for each button
    this.createHelpWindow();
    //button to start patch creation
    this.createSubmitButton();

    //checkbox for turning eq optimization assumption on/off
    this.createEqToggle();
    //input window for eq optimization minimum consideration size
    this.createEqMinSizeBox();
    //input window for eq optimization minimum consideration ratio (%)
    this.createEqMinRatioBox();

    //checkbox for diff timeout
    this.createTimeoutToggle();
    //input window for timeout, in seconds
    this.createTimeoutInput();

    //input box for number of maximum number of subprocesses to spawn
    this.createMaxProcessInput();

    //this.createProgressBar(); //TODO?
};

Window_ModPatchCreate.prototype.update = function() {
    var okTrigger = Input.isTriggered('ok');
    var touchTrigger = TouchInput.isTriggered();
    Window_Base.prototype.update.call(this);
    if (!this.active) return; //TODO: if in progress, wait

    if (Input.isTriggered('cancel') || Input.isTriggered('Escape')) {
    	if (this._state != 'submit') {
        this._cancelHander.call();
    	}
    }

    //Conditions for setting a certain button/input as active when the user clicks that region
    if (touchTrigger) {
        var state = null;
        if (this._eqToggleWindow.isTouchedInsideFrame()) {
        	state = 'eqOn';
        }
        if (this._eqToggleWindow.get()) {
        	if (this._eqMinSizeWindow.isTouchedInsideFrame()) {
        		state = 'eqMinSize';
        	} else if (this._eqMinRatioWindow.isTouchedInsideFrame()) {
        		state = 'eqMinRatio';
        	}
        }
        if (this._timeoutOnWindow.isTouchedInsideFrame()) {
        	state = 'timeoutOn';
        }
        if (this._timeoutOnWindow.get()) {
        	if (this._timeoutInputWindow.isTouchedInsideFrame()) {
        		state = 'timeoutInput';
        	}
        }

        if (this._inputText.isTouchedInsideFrame()) {
            state = 'input';
        } else if (this._maxProcessesWindow.isTouchedInsideFrame()) {
        		state = 'maxProcesses';
        } else if (this._toggle1Window.isTouchedInsideFrame() && (!this._toggle3Window.get())) {
            state = 'toggle1';
        } else if (this._toggle2Window.isTouchedInsideFrame() && (!this._toggle3Window.get())) {
            state = 'toggle2';
        } else if (this._toggle3Window.isTouchedInsideFrame()) {
            state = 'toggle3';
        } else if (this._saveButton.isTouchedInsideFrame()) {
            if (this._state == 'submit') {
                this.doExportFinal();
            }
            state = 'submit';
        }

        //If we click on a toggle that is already active - state == this._state - then we want to
        // refreshToggles, as a key toggle may have changed. But, setState already calls refreshToggles
        // no matter what, so no need to do anything special to accomodate.
        this.setState(state);
    } else {
        var state = null;
        //Throughout, if we are using an explicit diff list (toggle 3 is "On"),
        //  AKA toggle 3 has index 0 - then gray out first two toggles and skip/ignore them

        //support movement between
        if (this._state == 'input') {
            if (Input.isTriggered('right')) {
                //Won't register - textbox captures left and right arrow input
            } else if (okTrigger) {
                //Nothing; trigger from submit handler
                //SoundManager.playCursor();
                //state = 'submit';
            } else if (Input.isTriggered('up')) {
                SoundManager.playCursor();
                //If "use explicit list" (toggle3) is On (true), toggles 1 and 2 are disabled, so skip them
                state = this._toggle3Window.get() ? 'toggle3' : 'toggle1';
            } else if (Input.isTriggered('down')) {
                SoundManager.playCursor();
                state = 'toggle3';
            }
        } else if (this._state == 'toggle1') {
        	  //Go to equivalent section of EQ column
            if (Input.isTriggered('right')) {
                SoundManager.playCursor();
                if (this._eqToggleWindow.get()) {
                	state = 'eqMinSize';
                } else {
                	state = 'eqOn';
                }
            //Go to equivalent section of Timeout column
            } else if (Input.isTriggered('left')) {
                SoundManager.playCursor();
                if (this._timeoutOnWindow.get()) {
                	state = 'timeoutInput';
                } else {
                	state = 'timeoutOn';
                }
            } else if (okTrigger) {
                this.refreshToggles();
            } else if (Input.isTriggered('down')) {
                SoundManager.playCursor();
                state = 'toggle2';
            } else if (Input.isTriggered('up')) {
                SoundManager.playCursor();
                state = 'toggle3';
            }
        } else if (this._state == 'toggle2') {
            if (Input.isTriggered('right')) {
                if (this._eqToggleWindow.get()) {
                	state = 'eqMinRatio';
                } else {
                	state = 'eqOn';
                }
            } else if (Input.isTriggered('left')) {
                SoundManager.playCursor();
                if (this._timeoutOnWindow.get()) {
                	state = 'maxProcesses';
                } else {
                	state = 'timeoutOn';
                }
            } else if (okTrigger) {
                this.refreshToggles();
            } else if (Input.isTriggered('down')) {
                SoundManager.playCursor();
                /* Changed my mind about vertical cycling
                state = 'input';
                */
            } else if (Input.isTriggered('up')) {
                SoundManager.playCursor();
                state = 'toggle1';
            }
        } else if (this._state == 'toggle3') {
            if (Input.isTriggered('right')) {
                SoundManager.playCursor();
                state = 'eqOn';
            } else if (Input.isTriggered('left')) {
                SoundManager.playCursor();
                state = 'timeoutOn';
            } else if (okTrigger) {
                this.refreshToggles();
            } else if (Input.isTriggered('up')) {
                SoundManager.playCursor();
                state = 'input';
            } else if (Input.isTriggered('down')) {
                SoundManager.playCursor();
                //If "use explicit list" (toggle3) is On (true), toggles 1 and 2 are disabled, so skip them
                // state = this._toggle3Window.get() ? 'input' : 'toggle1'; Changed my mind about vertical cycling
                if (!this._toggle3Window.get()) { state = 'toggle1' }
            }
        } else if (this._state == 'eqOn') {
        	if (Input.isTriggered('right')) {
        		SoundManager.playCursor();
       			state = 'timeoutOn';
        	} else if (Input.isTriggered('left')) {
        		SoundManager.playCursor();
            state = 'toggle3';
          } else if (okTrigger) {
            this.refreshToggles();
          } else if (Input.isTriggered('up')) {
            SoundManager.playCursor();
            state = 'input';
          } else if (Input.isTriggered('down')) {
            SoundManager.playCursor();
            if (this._eqToggleWindow.get()) {
       				state = 'eqMinSize';
            } else {
            	/* Changed my mind about vertical cycling in other columns
            	state = 'input';
            	*/
            }
          }
        } else if (this._state == 'eqMinSize') {
        	if (Input.isTriggered('right')) {
        		SoundManager.playCursor();
        		if (this._timeoutOnWindow.get()) {
        			state = 'timeoutInput';
        		} else {
        			state = 'timeoutOn';
        		}
        	} else if (Input.isTriggered('left')) {
        		SoundManager.playCursor();
            if (this._toggle3Window.get()) {
       				state = 'toggle3';
            } else {
            	state = 'toggle1';
            }
          } else if (okTrigger) {
              state = 'eqMinSize'; //submit will try to exitFocus - restore focus, stay on this state.
          } else if (Input.isTriggered('up')) {
              SoundManager.playCursor();
              state = 'eqOn';
          } else if (Input.isTriggered('down')) {
              SoundManager.playCursor();
              //If we are here, eqOn must be true
              state = 'eqMinRatio';
          }
        } else if (this._state == 'eqMinRatio') {
        	if (Input.isTriggered('right')) {
        		SoundManager.playCursor();
        		state = 'maxProcesses'; //aligned with this, so timeoutOn doesn't matter
        	} else if (Input.isTriggered('left')) {
        		SoundManager.playCursor();
            if (this._toggle3Window.get()) {
       				state = 'toggle3';
            } else {
            	state = 'toggle2';
            }
          } else if (okTrigger) {
              state = 'eqMinRatio'; //submit will try to exitFocus - restore focus, stay on this state.
          } else if (Input.isTriggered('up')) {
              SoundManager.playCursor();
              //If we are here, eqOn must be true
              state = 'eqMinSize';
          } else if (Input.isTriggered('down')) {
          	SoundManager.playCursor();
          	/* Changed my mind about vertical cycling in other columns
              SoundManager.playCursor();
              state = 'input';
              */
          }
        } else if (this._state == 'timeoutOn') {
        	if (Input.isTriggered('right')) {
        		SoundManager.playCursor();
       			state = 'toggle3';
        	} else if (Input.isTriggered('left')) {
        		SoundManager.playCursor();
            state = 'eqOn';
          } else if (okTrigger) {
            this.refreshToggles();
          } else if (Input.isTriggered('up')) {
          	SoundManager.playCursor();
          	/* Changed my mind about vertical cycling in other columns
            SoundManager.playCursor();
            state = 'input';
            */
          } else if (Input.isTriggered('down')) {
            SoundManager.playCursor();
            if (this._timeoutOnWindow.get()) {
       				state = 'timeoutInput';
            } else {
            	state = 'maxProcesses';
            }
          }
        } else if (this._state == 'timeoutInput') {
        	if (Input.isTriggered('right')) {
        		SoundManager.playCursor();
        		if (this._toggle3Window.get()) {
       				state = 'toggle3';
            } else {
            	state = 'toggle1';
            }
        	} else if (Input.isTriggered('left')) {
        		SoundManager.playCursor();
            if (this._eqToggleWindow.get()) {
       				state = 'eqMinSize';
            } else {
            	state = 'eqOn';
            }
          } else if (okTrigger) {
              state = 'timeoutInput'; //submit will try to exitFocus - restore focus, stay on this state.
          } else if (Input.isTriggered('up')) {
              SoundManager.playCursor();
              state = 'timeoutOn';
          } else if (Input.isTriggered('down')) {
              SoundManager.playCursor();
              state = 'maxProcesses';
          }
        } else if (this._state == 'maxProcesses') {
        	if (Input.isTriggered('right')) {
        		SoundManager.playCursor();
        		if (this._toggle3Window.get()) {
       				state = 'toggle3';
            } else {
            	state = 'toggle2';
            }
        	} else if (Input.isTriggered('left')) {
        		SoundManager.playCursor();
            if (this._eqToggleWindow.get()) {
       				state = 'eqMinRatio';
            } else {
            	state = 'eqOn';
            }
          } else if (okTrigger) {
              state = 'maxProcesses'; //submit will try to exitFocus - restore focus, stay on this state.
          } else if (Input.isTriggered('up')) {
              SoundManager.playCursor();
              //If "Timeout On" is true, timeoutInput is disabled, so skip it
              state = this._timeoutOnWindow.get() ? 'timeoutInput' : 'timeoutOn';
          } else if (Input.isTriggered('down')) {
          	SoundManager.playCursor();
          	/* Changed my mind about vertical cycling in other columns
              SoundManager.playCursor();
              state = 'input';
              */
          }
        } else if (this._state == 'submit') {
            if (Input.isTriggered('left')) {
                SoundManager.playCursor();
                state = 'input';
            } else if (okTrigger) {
                this.doExportFinal();
            } else if (Input.isTriggered('escape')) {
                state = 'input';
            } else if (Input.isTriggered('up') || Input.isTriggered('down') || Input.isTriggered('right')) {
                //Do nothing
            }
        }
        if (state) {
            this.setState(state);
        }
    }
    this.refreshToggles();
};

Window_ModPatchCreate.prototype.setCancelHandler = function(method) {
    this._cancelHander = method;
};

Window_ModPatchCreate.prototype.setState = function(state) {
    if (state) {
        this._state = state;
        this._toggle1Window.deactivate();
        this._toggle2Window.deactivate();
        this._toggle3Window.deactivate();
        this._eqToggleWindow.deactivate();
        this._eqMinSizeWindow.deactivate();
        this._eqMinRatioWindow.deactivate();
        this._timeoutOnWindow.deactivate();
        this._timeoutInputWindow.deactivate();
        this._maxProcessesWindow.deactivate();
        this._inputText.deactivate();
        this._saveButton.deactivate();

        //this._inputText.setCursorRect(0,0,0,0);
        this._saveButton.setCursorRect(0,0,0,0); //hide cursors
        switch(state) {
            case 'toggle1': this._toggle1Window.activate(); break;
            case 'toggle2': this._toggle2Window.activate(); break;
            case 'toggle3': this._toggle3Window.activate(); break;
            case 'input':
            case 'error': this._inputText.activate(); this._inputText.refresh(); break;
            case 'submit': this._saveButton.activate(); break;

            case 'eqOn': this._eqToggleWindow.activate(); break;
            case 'eqMinSize': this._eqMinSizeWindow.activate(); this._eqMinSizeWindow.refresh(); break;
            case 'eqMinRatio': this._eqMinRatioWindow.activate(); this._eqMinRatioWindow.refresh(); break;

            case 'timeoutOn': this._timeoutOnWindow.activate(); break;
            case 'timeoutInput': this._timeoutInputWindow.activate(); this._timeoutInputWindow.refresh(); break;

            case 'maxProcesses': this._maxProcessesWindow.activate(); this._maxProcessesWindow.refresh(); break;

            default: return;
        }
    }
    this.refreshToggles();
    this.setupDesc();
}

Window_ModPatchCreate.prototype.refreshToggles = function(state) {
    if (this._toggle3Window.get()) { //if (this._toggle3Window.index() == 0) {
        //Using explicit diff list, turn off first two toggles
        this._toggle1Window.setColor(this._toggleDisabledColor);
        this._toggle2Window.setColor(this._toggleDisabledColor);
    } else {
        //Not using explicit diff list, turn on first two toggles
        this._toggle1Window.setColor(this._toggleSelectableColor);
        this._toggle2Window.setColor(this._toggleSelectableColor);
    }
    if (this._eqToggleWindow.get()) {
    	this._eqMinSizeWindow.setFontColor(this._toggleSelectableColor);
    	this._eqMinRatioWindow.setFontColor(this._toggleSelectableColor);
    	this._eqMinSizeWindow.setCaptionColor(this._toggleSelectableColor);
    	this._eqMinRatioWindow.setCaptionColor(this._toggleSelectableColor);
    	this._eqMinSizeWindow.opacity = 255;
    	this._eqMinRatioWindow.opacity = 255;
    } else {
    	this._eqMinSizeWindow.setFontColor(this._toggleDisabledColor);
    	this._eqMinRatioWindow.setFontColor(this._toggleDisabledColor);
    	this._eqMinSizeWindow.setCaptionColor(this._toggleDisabledColor);
    	this._eqMinRatioWindow.setCaptionColor(this._toggleDisabledColor);
    	this._eqMinSizeWindow.opacity = 100;
    	this._eqMinRatioWindow.opacity = 100;
    }
    if (this._timeoutOnWindow.get()) {
    	this._timeoutInputWindow.setFontColor(this._toggleSelectableColor);
    	this._timeoutInputWindow.setCaptionColor(this._toggleSelectableColor);
    	this._timeoutInputWindow.opacity = 255;
    } else {
    	this._timeoutInputWindow.setFontColor(this._toggleDisabledColor);
    	this._timeoutInputWindow.setCaptionColor(this._toggleDisabledColor);
    	this._timeoutInputWindow.opacity = 100;
    }

    //If any of the toggles is selected/active, mark it with a special color
    switch(this._state) {
    	case 'toggle1': this._toggle1Window.setColor(this._toggleSelectedColor); break;
    	case 'toggle2': this._toggle2Window.setColor(this._toggleSelectedColor); break;
    	case 'toggle3': this._toggle3Window.setColor(this._toggleSelectedColor); break;
    	case 'eqOn': this._eqToggleWindow.setColor(this._toggleSelectedColor); break;
    	case 'timeoutOn': this._timeoutOnWindow.setColor(this._toggleSelectedColor); break;
    	default: break;
    }
}

Window_ModPatchCreate.prototype.doExportConfirm = function(file) {
    var used = []; //test to make sure they do not pick a name they have already used
    if (fs.existsSync(path.join(ModManager._path, 'patches'))) {
        used = fs.readdirSync(path.join(ModManager._path, 'patches'));
    }
    var isValidFoldername = function(fname){
      var rg1=/^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
      var rg2=/((^\.)|(( |\.)$))/; // cannot start with dot (.), cannot end with space or dot
      var rg3=/^(nul|prn|con|aux|lpt[1-9]|com[1-9])(\.|$)/i; // forbidden file names
      result = (fname)&&rg1.test(fname)&&!rg2.test(fname)&&!rg3.test(fname)&&(used.indexOf(fname) < 0)&&(fname.length > 0);
      //console.log("result:",rg1.test(fname),!rg2.test(fname),!rg3.test(fname),(used.indexOf(fname) < 0), (fname.length > 0),result);
      return result;
    };
    var ret = isValidFoldername(file);
    return ret;
}

//Note: return value not currently used
Window_ModPatchCreate.prototype.doExportFinal = function() {
    if (!this.doExportConfirm(this._inputText.message)) {
        //Input textbox should auto-show an error message
        SoundManager.playBuzzer();
        return false;
    }
    //Make the patch
    var outfolder = path.join(ModManager._path, 'patches', this._inputText.message);
    AutoDiff.createReqDirectories(outfolder);

    //Consider the setting options they've chosen for how to formulate the patch
    var config = {};
    config['asset_compare'] = this._toggle1Window.get();
    config['script_compare'] = this._toggle2Window.get();
    config['explicit_list'] = this._toggle3Window.get();

    //Use current eq, timeout, and process settings for how to run the diff exe
    this.setDiffParams();
    AutoDiff.createPatch(config, this._inputText.message);
    return true;
}

Window_ModPatchCreate.prototype.setupInput = function() {
    this._inputText.setConstraint(this.doExportConfirm,"Must be a new, valid folder name.", this);
}

Window_ModPatchCreate.prototype.setSubmit = function() {
    SoundManager.playCursor();
    this.setState('submit');
}

Window_ModPatchCreate.prototype.numberConstrain = function(lower, upper) {
    return function(input) {
    		if (input == "") return true; //Allow user to not change default/empty
        const num = parseInt(input);
        if (isNaN(num)) { return false; }
        return ((num >= lower) && (num <= upper));
    }
}

Window_ModPatchCreate.prototype.setDiffParams = function() {
    AutoDiff.setExecArgs([
            this._eqToggleWindow.get() ? "1" : "0",
            this._eqMinSizeWindow.message,
            this._eqMinRatioWindow.message,
            this._timeoutOnWindow.get() ? "1" : "0",
            this._timeoutInputWindow.message,
            this._maxProcessesWindow.message
        ]);
}

Window_ModPatchCreate.prototype.createInputWindow = function() {
    this._inputText = new Window_Textbox({'x':Graphics.boxWidth/4-120,'y':Graphics.boxHeight/8.0 +20, 'caption':"Patch Name:", 'caption_size':20 });
    this._inputText.unlock(['Escape', 'Enter', 'Arrow Down', 'Arrow Up', 'enter', 'ok', 'up', 'down']);
    this._inputText.setSubmitHandler(Window_ModPatchCreate.prototype.setSubmit,this);
    //Only submit from submit button
    this.setupInput();
    this.addChild(this._inputText);
}
Window_ModPatchCreate.prototype.createHelpWindow = function() {
    this._descWindow = new Window_Base((1.0/8.0)*Graphics.boxWidth, (3.0/4.0)*Graphics.boxHeight-this.lineHeight(), (3.0/4.0)*Graphics.boxWidth, (1.0/4.0)*Graphics.boxHeight );
    this.addChild(this._descWindow);
};
/* I apologize for deciding toggle 3 should actually be on the top after making this */
Window_ModPatchCreate.prototype.createToggle1Window = function() {
    this._toggle1Window = new Window_Checkbox((1.0/4.0)*Graphics.boxWidth-10, (1.0/2.0)*Graphics.boxHeight, 20, {'text':'Compare Assets', 'color':this._toggleSelectedColor, 'disable': '#ffffff', 'direction':'up'});
    this._toggle1Window.set(false); //Default to Off
    this.addChild(this._toggle1Window);
};
Window_ModPatchCreate.prototype.createToggle2Window = function() {
    this._toggle2Window = new Window_Checkbox((1.0/4.0)*Graphics.boxWidth-10, (5.0/8.0)*Graphics.boxHeight, 20, {'text':'Compare Scripts', 'color':this._toggleSelectedColor, 'disable': '#ffffff', 'direction':'up'});
    this._toggle2Window.set(false); //Default to Off
    this.addChild(this._toggle2Window);
};
Window_ModPatchCreate.prototype.createToggle3Window = function() {
    this._toggle3Window = new Window_Checkbox((1.0/4.0)*Graphics.boxWidth-10, (3.0/8.0)*Graphics.boxHeight, 20, {'text':'Use File List', 'color':this._toggleSelectedColor, 'disable': '#ffffff', 'direction':'up'});
    this._toggle3Window.set(false); //Default to Off
    this.addChild(this._toggle3Window);
};

Window_ModPatchCreate.prototype.createEqToggle = function() {
    this._eqToggleWindow = new Window_Checkbox((1.0/2.0)*Graphics.boxWidth-10, (3.0/8.0)*Graphics.boxHeight, 20, {'text':'Eq Enable', 'color':this._toggleSelectedColor, 'disable': '#ffffff', 'direction':'up'});
    this.addChild(this._eqToggleWindow);
}
Window_ModPatchCreate.prototype.createEqMinSizeBox = function() {
    this._eqMinSizeWindow = new Window_Textbox({'x':Graphics.boxWidth*1.0/2.0-90,'y':Graphics.boxHeight*1.0/2.0, 'width':180, 'caption':"Min Size", 'reset':true });
    this._eqMinSizeWindow.unlock(['Escape', 'Enter', 'Arrow Down', 'Arrow Up', 'enter', 'ok', 'up', 'down']);
    this._eqMinSizeWindow.setHint(String(AutoDiff._eqMinSize));
    this._eqMinSizeWindow.setConstraint(this.numberConstrain(1,999999),"Must be an integer between 1 and 999999.", this);
    this.addChild(this._eqMinSizeWindow);
}
Window_ModPatchCreate.prototype.createEqMinRatioBox = function() {
    this._eqMinRatioWindow = new Window_Textbox({'x':Graphics.boxWidth*1.0/2.0-90,'y':Graphics.boxHeight*5.0/8.0, 'width':180, 'caption':"Min Ratio", 'reset':true });
    this._eqMinRatioWindow.unlock(['Escape', 'Enter', 'Arrow Down', 'Arrow Up', 'enter', 'ok', 'up', 'down']);
    this._eqMinRatioWindow.setHint(String(AutoDiff._eqMinRatio));
    this._eqMinRatioWindow.setConstraint(this.numberConstrain(50,100),"Must be an integer between 50 and 100.", this);
    this.addChild(this._eqMinRatioWindow);
}
Window_ModPatchCreate.prototype.createTimeoutToggle = function() {
    this._timeoutOnWindow = new Window_Checkbox((3.0/4.0)*Graphics.boxWidth-10, (3.0/8.0)*Graphics.boxHeight, 20, {'text':'Timeout Enable', 'color':this._toggleSelectedColor, 'disable': '#ffffff', 'direction':'up'});
    this.addChild(this._timeoutOnWindow);
}
Window_ModPatchCreate.prototype.createTimeoutInput = function() {
    this._timeoutInputWindow = new Window_Textbox({'x':Graphics.boxWidth*3.0/4.0-90,'y':Graphics.boxHeight/2.0, 'width':180, 'caption':"Timeout", 'reset':true });
    this._timeoutInputWindow.unlock(['Escape', 'Enter', 'Arrow Down', 'Arrow Up', 'enter', 'ok', 'up', 'down']);
    this._timeoutInputWindow.setHint(String(AutoDiff._searchTimeout));
    this._timeoutInputWindow.setConstraint(this.numberConstrain(20,999999),"Must be an integer between 20 and 999999.", this);
    this.addChild(this._timeoutInputWindow);
}
Window_ModPatchCreate.prototype.createMaxProcessInput = function() {
    this._maxProcessesWindow = new Window_Textbox({'x':Graphics.boxWidth*3.0/4.0-90,'y':Graphics.boxHeight*5.0/8.0, 'width':180, 'caption':"Max Processes", 'reset':true });
    this._maxProcessesWindow.unlock(['Escape', 'Enter', 'Arrow Down', 'Arrow Up', 'enter', 'ok', 'up', 'down']);
    this._maxProcessesWindow.setHint(String(AutoDiff._maxProcesses));
    this._maxProcessesWindow.setConstraint(this.numberConstrain(1,32),"Must be an integer between 1 and 32.", this);
    this.addChild(this._maxProcessesWindow);
}

Window_ModPatchCreate.prototype.createSubmitButton = function() {
    this._saveButton = new Window_CommandList(['Save'], (5.0/8.0)*Graphics.boxWidth, Graphics.boxHeight/8, {'width':(1.0/4.0)*Graphics.boxWidth});
    //this._saveButton.setHandler('Save', this.writeChanges.bind(this));
    this.addChild(this._saveButton);
};

Window_ModPatchCreate.prototype.setupDesc = function() {
    this._descWindow.contents.clear();
    const descriptions = {
        'error': "Enter a valid/unused folder name.",
        'submit': "Hit Enter to start creating the patch. It may take a few minutes.",
        'input': "Enter a folder name to build the patch in. Hit Enter when finished.",
        'toggle1': "Setting this to On means that the patch creator will automatically compare assets outside the database (images, audio files, etc) for additions and modifications.",
        'toggle2': "Setting this to On means that the patch creator will automatically compare script files for additions and modification.",
        'toggle3': "Setting this to On means that the patch creator will only update/patch/overwrite files specified (via full filepath) in "+ModManager._listFileName+".",
        'eqOn': "This turns on an optimization assumption that could improve diff search time at the risk of excluding the optimal diff. The idea of the assumption is that if two locations that are roughly 'Min Size' large share 'Min Ratio' percent of their data, that it will not consider those segments to possibly match any other segments.",
        'eqMinSize': "Should be a positive integer. Default 30. Represents 'size' of a JSON entry based on the number of primitives, including keys. { 'key1': [1, 2, 3], 'key2': { 'a': [], 'b': null } } is considered to have 9 leaves, for example.",
        'eqMinRatio': "Should be an integer between 50 and 100. Default 90. Recommended to be very high. Represents the minimum percentage of data two JSON entries must share before they are assumed to have originated from the same entry.",
        'timeoutOn': "Setting this to On means that every individual file diff shall be subject to a timeout, measured in seconds. Some diffs would take a very long time to generate; when the timeout is reached, the process will stop and it will use the best diff it found by then.",
        'timeoutInput': "The time in seconds that a diff search is allowed to run. The longer the algorithm runs, the better result it will find. All diffs will work for creating game patches, but better diffs obscure more of the original files' data. IF SPARING THE TIME IS AT ALL AN OPTION, MAKE THIS VALUE AS HIGH AS POSSIBLE.",
        'maxProcesses': "You can have multiple diff search algorithms run in parallel, but this may consume more resources, perhaps even crash your program if unregulated. This number is the maximum number of subprocess that can be spawned. Default 1."
    }
    var desc = (descriptions[this._state] || "");
    this._descWindow.contents.fontSize = 12;
    this._descWindow.drawWrapText(desc);
};

Window_ModPatchCreate.prototype.close = function() {
    Window_Base.prototype.close.call(this);
    //this._inputText.close();
    this._toggle1Window.close();
    this._toggle2Window.close();
    this._toggle3Window.close();

    this._eqToggleWindow.close();
    this._eqMinSizeWindow.close();
    this._eqMinRatioWindow.close();
    this._timeoutOnWindow.close();
    this._timeoutInputWindow.close();
    this._maxProcessesWindow.close();

    this._saveButton.close();
    this._descWindow.close();
}
Window_ModPatchCreate.prototype.open = function() {
    Window_Base.prototype.open.call(this);
    this._inputText.open();
    this._toggle1Window.open();
    this._toggle2Window.open();
    this._toggle3Window.open();

    this._eqToggleWindow.open();
    this._eqMinSizeWindow.open();
    this._eqMinRatioWindow.open();
    this._timeoutOnWindow.open();
    this._timeoutInputWindow.open();
    this._maxProcessesWindow.open();

    this._saveButton.open();
    this._descWindow.open();
}
Window_ModPatchCreate.prototype.hide = function() {
    Window_Base.prototype.hide.call(this);
    this._inputText.hide();
    this._toggle1Window.hide();
    this._toggle2Window.hide();
    this._toggle3Window.hide();

    this._eqToggleWindow.hide();
    this._eqMinSizeWindow.hide();
    this._eqMinRatioWindow.hide();
    this._timeoutOnWindow.hide();
    this._timeoutInputWindow.hide();
    this._maxProcessesWindow.hide();

    this._saveButton.hide();
    this._descWindow.hide();
}
Window_ModPatchCreate.prototype.show = function() {
    Window_Base.prototype.show.call(this);
    this._inputText.show();
    this._toggle1Window.show();
    this._toggle2Window.show();
    this._toggle3Window.show();

    this._eqToggleWindow.show();
    this._eqMinSizeWindow.show();
    this._eqMinRatioWindow.show();
    this._timeoutOnWindow.show();
    this._timeoutInputWindow.show();
    this._maxProcessesWindow.show();

    this._saveButton.show();
    this._descWindow.show();
}
Window_ModPatchCreate.prototype.activate = function() {
    Window_Base.prototype.activate.call(this);
    this.setState('toggle3');
}
Window_ModPatchCreate.prototype.deactivate = function() {
    Window_Base.prototype.deactivate.call(this);
    this._inputText.deactivate();
    this._toggle1Window.deactivate();
    this._toggle2Window.deactivate();
    this._toggle3Window.deactivate();

    this._eqToggleWindow.deactivate();
    this._eqMinSizeWindow.deactivate();
    this._eqMinRatioWindow.deactivate();
    this._timeoutOnWindow.deactivate();
    this._timeoutInputWindow.deactivate();
    this._maxProcessesWindow.deactivate();

    this._saveButton.deactivate();
    this._descWindow.deactivate();
}

//-----------------------------------------------------------------------------
// Window_SaveConvert
//
// Use to convert saves to a given patch

function Window_SaveConvert() {
    this.initialize.apply(this, arguments);
}

Window_SaveConvert.prototype = Object.create(Window_Base.prototype);
Window_SaveConvert.prototype.constructor = Window_SaveConvert;

Window_SaveConvert.prototype.initialize = function(dx, dy) {
    Window_Base.prototype.initialize.call(this);

    this._loaded = true;
    this.createWindows(dx, dy);
    this.setState('list');
};

Window_SaveConvert.prototype.createWindows = function(dx, dy) {
    Scene_Base.prototype.createWindowLayer.call(this);
    DataManager.loadAllSavefileImages();

    this.createModListWindow(dx, dy);
    this.createListWindow(dx, dy);
    this.createSelectedSaveSprite(dx, dy);
    this.createShadeSprite();
    this.createOverwriteConfWindow();
};

Window_SaveConvert.prototype.savefileId = function() {
    return this._listWindow.index() + 1;
};

Window_SaveConvert.prototype.firstSavefileIndex = function() {
    return DataManager.lastAccessedSavefileId() - 1;
};

Window_SaveConvert.prototype.createListWindow = function(dx, dy) {
  var x = 0 + dx;
  var y = 0 + dy;
  var width = Graphics.boxWidth/2;
  var height = Graphics.boxHeight - y;

  this._listWindow = new Window_SavefileList(x, y, width, height);
  this._listWindow.setTopRow(this.firstSavefileIndex() - 2);
  this._listWindow.select(this.firstSavefileIndex());
  //Timeout necessary to give the ImageManager time to cache/reserve the character bitmaps;
  // it's dumb and annoying, but it will fail to draw the characters on save files without this
  // delay
  setTimeout(
    function() {
        this._listWindow.refresh();
        this.refreshModList();
  }.bind(this), 1000);
  
  //SceneManager._scene.addWindow(this._listWindow);
  this.addWindow(this._listWindow);
};

Window_SaveConvert.prototype.createModListWindow = function(dx, dy) {
    const x = Graphics.boxWidth/2 + dx;
    const y = dy+(1/4)*(Graphics.boxHeight - dy);
    const width = Graphics.boxWidth/2;
    const height = (1/2)*(Graphics.boxHeight - dy);

    const existingPatches = path.join(ModManager._path, ModManager._installsFolder);
    var installs = (fs.existsSync(existingPatches)) ? fs.readdirSync(existingPatches) : [];
    installs.splice(0,0,ModManager._baseGameText);
    this._modOptions = installs;

    this._modListWindow = new Window_CommandList(installs, x, y, {'width': width, 'height': height});
    this.addWindow(this._modListWindow);
    this._modListWindow.deactivate();
}

Window_SaveConvert.prototype.createOverwriteConfWindow = function() {
    this._confirmWindow = new Window_CommandList(['Yes', 'No'], (1.0/3.0)*Graphics.boxWidth, (1.0/2.0)*Graphics.boxHeight-2*this.lineHeight(), {'maxcols':2,'width':(1.0/3.0)*Graphics.boxWidth});
    this._confirmWindow.select(1); //Default to No
    this.addWindow(this._confirmWindow);
};

Window_SaveConvert.prototype.createSelectedSaveSprite = function(dx, dy) {
    const spacing = 20;
    const width = Graphics.boxWidth / 2.0;
    const height = this._listWindow.itemHeight()+2*this.standardPadding();
    const x = dx + Graphics.boxWidth / 2.0;
    const y = dy;
    this._saveSprite = new Window_Base(x, y, width, height);
    this._saveSprite.hide();
    this.addChild(this._saveSprite);
}

//Code is ripped from vanilla Window_SavefileList: drawItem;
//  I didn't want to make a new window class for this, so I expanded
//  the classes functions into this
Window_SaveConvert.prototype.drawSelectedSaveSprite = function(savefileId) {
    var info = DataManager.loadSavefileInfo(savefileId);
    this._saveSprite.contents.clear();
    this._saveSprite.resetTextColor();

    var textRect = new Rectangle;
    textRect.x = this._saveSprite.x;
    textRect.y = this._saveSprite.y;
    textRect.width = this._saveSprite.width;
    textRect.height = this._saveSprite.height;
    //Draw the save file ID
    this._saveSprite.drawText(TextManager.file + ' ' + savefileId, 0, 0, 180);
    if (info) {
        //this.changePaintOpacity(valid); <- TODO look into this for "disabling" Toggles 1 and 2
        var bottom = textRect.height - 2*this.standardPadding();
        //Draw game title and party, if able
        if (textRect.width >= 420) {
            if (info.patch) { 
                DataManager._backupVersion = DataManager._version;
                DataManager._version = info.patch;
            } //Will cause it to use save's patch's images, if applicable
    
            //Draw title if able
            if (info.title) {
                this._saveSprite.drawText(info.title, 192, 0, textRect.width - 192);
            }
            //Draw party if able
            if (info.characters) {
                for (var i = 0; i < info.characters.length; i++) {
                    var data = info.characters[i];
                    this._saveSprite.drawCharacter(data[0], data[1], (220) + i * 48, (bottom - 4));
                }
            }

            if (info.patch) { //Restore version, in case we're in-game
                DataManager._version = DataManager._backupVersion;
            }
        }
        var lineHeight = this.lineHeight();
        var y2 = bottom - lineHeight;
        if (y2 >= lineHeight) {
            //Draw playtime if able
            if (info.playtime) {
                this._saveSprite.drawText(info.playtime, 0, y2, textRect.width - 2*this.standardPadding(), 'right');
            }
        }
    }
}

Window_SaveConvert.prototype.createShadeSprite = function() {
    this._tintSprite = new Sprite();
    this._tintSprite.bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
    this._tintSprite.bitmap.fillAll('#00000055');
    const width = 100;
    this._tintSprite.bitmap.drawText("Overwrite save file?", (Graphics.boxWidth - width)/2, Graphics.boxHeight/2 - 36, width, 36);
    this._tintSprite.visible = false;
    this.addChild(this._tintSprite);
}

Window_SaveConvert.prototype.exitConfirm = function(confirmed) {
    if (confirmed) {
        this.onConvertOk();
    }
    this.setState('list');
}

Window_SaveConvert.prototype.update = function() {
    var okTrigger = Input.isTriggered('ok');
    var touchTrigger = TouchInput.isTriggered();
    Window_Base.prototype.update.call(this);
    if (!this.active) return;
    if (!this._loaded) return; //Do not navigate menu while mid-save-convert

    if (Input.isTriggered('cancel') || Input.isTriggered('Escape')) {
        SoundManager.playCancel();
        switch (this.state) {
            case 'list':
                this._cancelHandler.call();
                return;
            case 'mod':
                this.refreshModList();
                this.setState('list');
                return;
            case 'list2':
                this.setState('mod');
                return;
            case 'conf':
                this.exitConfirm(false);
                return;
        }
    }

    if (touchTrigger) {
        var state = null;
        if (this._listWindow.isTouchedInsideFrame()) {
            state = 'list';
        } else if (this._modListWindow.isTouchedInsideFrame() && this._modListWindow.visible) {
            if (this.state == 'list2') {
                SoundManager.playCancel();
            }
            state = 'mod';
        } else if (this.state == 'conf' && !this._confirmWindow.isTouchedInsideFrame()) {
            this.exitConfirm(false);
        }

        this.setState(state);
    } else {
        var state = null;
        //support movement between
        if (this.state == 'list') {
            if (Input.isTriggered('right') || okTrigger) {
                if (this._modListWindow.visible) {
                    SoundManager.playCursor();
                    this.drawSelectedSaveSprite(this.savefileId());
                    state = 'mod';
                } else {
                    SoundManager.playBuzzer();
                }
            } else if (Input.isTriggered('down') || Input.isTriggered('up')) {
                //List Window handles cursor sounds
                this.refreshModList();
            }
        } else if (this.state == 'mod') {
            if (Input.isTriggered('left')) {
                SoundManager.playCancel();
                this.refreshModList();
                state = 'list';
            } else if (okTrigger) {
                if (this._modListWindow.index() && this._modListWindow.index() >= 0) {
                  SoundManager.playCursor();
                  this._firstIndex = this.savefileId();
                  state = 'list2';
                } else {
                    SoundManager.playBuzzer();
                }
            } else if (Input.isTriggered('down') 
                || Input.isTriggered('up') 
                || Input.isTriggered('right')) {
                //Do nothing special, list internally handles up-down
                //These are just here for clarity, comprehensiveness
            }
        } else if (this.state == 'list2') {
            if (Input.isTriggered('right')) {
                if (this._modListWindow.visible) {
                    SoundManager.playCancel();
                    state = 'mod';
                }
           } else if (okTrigger) {
                if (DataManager.isThisGameFile(this.savefileId())) {
                    SoundManager.playCursor();
                    state = 'conf';
                } else {
                    SoundManager.playOk();
                    this.onConvertOk();
                    state = 'list';
                }
            } else if (Input.isTriggered('down') || Input.isTriggered('up')) {
                //Do nothing special, list internally handles up-down
                //These are just here for clarity, comprehensiveness
            }
        } else if (this.state == 'conf') {
            if (okTrigger) {
                // 0: Yes, 1: No
                if (this._confirmWindow.index() == 0) {
                    SoundManager.playOk();
                    this.exitConfirm(true);
                } else {
                    SoundManager.playCancel();
                    this.exitConfirm(false);
                }
            }
        }
        if (state) {
            this.setState(state);
        }
    }
};

//When they select something on the mod/installs list to convert to,
//  change the global save info entry to make it use modded path
//  assets/data in the future.
//  Runs the installs run-once conversion function, if applicable. 
Window_SaveConvert.prototype.onConvertOk = function() {
    var newVersion = this._modOptions[this._modListWindow.index()];
    if (newVersion == ModManager._baseGameText) {
        newVersion = "";
    }
    if (!newVersion) {return;}

    var globalSaveInfo = DataManager.loadGlobalInfo();

    const restore = DataManager._version;
    DataManager.loadGame(this._firstIndex);
    DataManager._version = path.join(ModManager._path, ModManager._installsFolder, newVersion);

    function saveWithDataStructs() {
        Graphics.frameCount = $gameSystem._framesOnSave;
        if (!globalSaveInfo[this.savefileId()]) {
            globalSaveInfo[this.savefileId()] = DataManager.makeSavefileInfo();
        }
        globalSaveInfo[this.savefileId()].patch = newVersion;
        DataManager.saveGlobalInfo(globalSaveInfo);

        //If the patch comes with a custome conversion function/script, load it and run it while
        const convertFile = path.join(ModManager._path, ModManager._installsFolder, ModManager._convertFilename);
        if (fs.existsSync(convertFile)) {
            const script = ModManager.loadScriptSettings(convertFile);
            ModManager.convertSave(); // <- Function Implemented by Modder in convert.js
            document.body.removeChild(script)
        }

        DataManager.saveGame(this.savefileId());
        DataManager._version = restore;
        //this._listWindow.refresh(); //TODO - is this necessary? To put the delay in here as well?
        //Timeout necessary to give the ImageManager time to cache/reserve the character bitmaps;
        // it's dumb and annoying, but it will fail to draw the characters on save files without this
        // delay
        setTimeout(
            function() {
                this._listWindow.refresh();
                this.refreshModList();
        }.bind(this), 1000);
        this._loaded = true;
    }
    ModManager.quickLoad = true;
    this._loaded = false;
    ModManager.queuedFunction = saveWithDataStructs.bind(this);

    DataManager.loadDatabase();
};

//Hides the list of installed modded game instances when the user
//  hovers over an unused save slot, and sets the highlight/select
//  index to reflect the current patch that the save is on when
//  they navigate to/examine a new save slot.
Window_SaveConvert.prototype.refreshModList = function() {
    if (this.state != 'list2' && this.state != 'conf') {
        const saveId = this.savefileId();
        if (DataManager.isThisGameFile(saveId)) {
            this._modListWindow.show();
            const globalSaveInfo = DataManager.loadGlobalInfo();
            var install = globalSaveInfo[saveId].patch;
            if (install == "") { install = ModManager._baseGameText; }
            this._modListWindow.select(this._modOptions.indexOf(install));
        } else {
            this._modListWindow.hide();
        }
    }
}

Window_SaveConvert.prototype.setState = function(newState) {
    this.state = newState;
    switch(newState) {
        case 'list':
            this._listWindow.activate();
            this._modListWindow.deactivate();
            this._confirmWindow.deactivate();
            this._confirmWindow.hide();
            this._saveSprite.hide();
            this._tintSprite.visible = false;
            break;
        case 'mod':
            this._listWindow.deactivate();
            this._modListWindow.activate();
            this._confirmWindow.deactivate();
            this._confirmWindow.hide();
            this._saveSprite.show();
            this._tintSprite.visible = false;
            break;
        case 'list2':
            this._listWindow.activate();
            this._modListWindow.deactivate();
            this._confirmWindow.deactivate();
            this._confirmWindow.hide();
            this._saveSprite.show();
            this._tintSprite.visible = false;
            break;
        case 'conf':
            this._listWindow.deactivate();
            this._modListWindow.deactivate();
            this._confirmWindow.activate();
            this._confirmWindow.show();
            this._saveSprite.show();
            this._tintSprite.visible = true;
            break;
    }
    if (this._modListWindow.visible) { this.refreshModList(); }
}

Window_SaveConvert.prototype.setCancelHandler = function(method) {
    this._cancelHandler = method;
};

Window_SaveConvert.prototype.close = function() {
    Window_Base.prototype.close.call(this);
    this._listWindow.close();
    this._modListWindow.close();
    this._confirmWindow.close();
}
Window_SaveConvert.prototype.open = function() {
    Window_Base.prototype.open.call(this);
    this._listWindow.open();
    this._modListWindow.open();
    this._confirmWindow.open();
}
Window_SaveConvert.prototype.hide = function() {
    Window_Base.prototype.hide.call(this);
    this._listWindow.hide();
    this._modListWindow.hide();
    this._confirmWindow.hide();
    this._saveSprite.hide();
    this._tintSprite.visible = false;
}
Window_SaveConvert.prototype.show = function() {
    Window_Base.prototype.show.call(this);
    this._listWindow.show();
    this._modListWindow.show();
    this.setState(this.state);
}
Window_SaveConvert.prototype.activate = function() {
    Window_Base.prototype.activate.call(this);
    this.setState(this.state);
    this.refreshModList();
}
Window_SaveConvert.prototype.deactivate = function() {
    Window_Base.prototype.deactivate.call(this);
    this._listWindow.deactivate();
    this._modListWindow.deactivate();
    this._confirmWindow.deactivate();
}

//-----------------------------------------------------------------------------
// AutoDiff
//
// The static class that handles diffing and patch creation.

function AutoDiff() {
    throw new Error('This is a static class');
}

/* DEFUNCT - MOVED TO C++ EXECUTABLE
AutoDiff.checkEquality = function(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        return this.arrayEquality(a, b);
    }
    function isObject(val) {
        if (val === null) return false;
        if (Array.isArray(val)) return false;
        return (typeof val === 'object');
    }
    if ((!Array.isArray(a) && !Array.isArray(b)) && (this.isObject(a) && this.isObject(b))) {
        return this.jsonEquality(a, b);
    }
    if ((a == b) && ((typeof a) == (typeof b))) {
        //check primitives
        return true;
    }
    //function, null, or a and b are different types
    return false;
} */

/* DEFUNCT - MOVED TO C++ EXECUTABLE
AutoDiff.arrayEquality = function(a, b) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
        if (!this.checkEquality(a[i], b[i])) return false;
    }
    return true;
} */

/* DEFUNCT - MOVED TO C++ EXECUTABLE
AutoDiff.jsonEquality = function(a, b) {
    var a_keys = Object.getOwnPropertyNames(a);
    var b_keys = Object.getOwnPropertyNames(b);

    if (!this.arrayEquality(a_keys, b_keys)) { return false; }
    for (var i = 0; i < a_keys.length; i++) {
        let key = a_keys[i];
        if (!this.checkEquality(a[key], b[key])) { return false; }
    }
    return true;
} */

/*
TOY EXAMPLE

BASE:
{
    "maps":
      0 : {"events" : [{A: 1, B: 2},{},{E: 1}], "tileset": "red"}
      1 : {"events" : [{Q: 7}, {C: 2}], "tileset": "blue"}
      2 : {}
      3 : {"events" : [{R: 5}, {L: 3}, {C: 1}], "tileset": "yellow"}
}

add events to map 0, change event 0 in map 1, add map 2, insert map before map 3

{
    "maps":
      0 : {"events" : [{A: 1, B: 2},{D: 1},{E: 1}, {B: 4}], "tileset": "red"}
      1 : {"events" : [{Q: 5, Y: 3}, {C: 2}], "tileset": "blue"}
      2 : {"events" : [{H: 3}], "tileset": "red"}
      3 : {"events" : [{S: 2}, {L: 4, D: 3}], "tileset": "brown"}
      4 : {"events" : [{R: 5}, {L: 3}, {C: 1}], "tileset": "yellow"}
}

There are two important questions this raises:
 1) how do we stop it from making a redundant "modify" entry that is just a "delete-add" that's more explicit
  than it needs to be? (the goal of this patching system is to minimize data exposure)

*/

/* Checks if an object equals "{}" */
AutoDiff.isEmpty = function(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
}
/* Checks if a value is a object */
AutoDiff.isObject = function(val) {
    return (val === Object(val));
}
/* Clone deep copy of an object 
 * Note: object must consist entirely of
 * primitives and objects/arrays, no functions
 * or symbols
 */
AutoDiff.cloneObj = function(obj) {
    return JSON.parse(JSON.stringify(obj));
}


/* This is so we now how much to weight a JSON object that is
 * being "added" or "deleted"; each primitive value accounts for one,
 * as does each key (to account for say, "5 => {}")
 */
 /* DEFUNCT - MOVED TO C++ EXECUTABLE
AutoDiff.countLeaves = function(obj) {
    let count = 0;
    if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
            count += this.countLeaves(obj[i]);
        }
    } else if (this.isObject(obj)) {
        const keys = Object.getOwnPropertyNames(obj);
        for (const key of keys) {
            // Add 1 for the key itself, see rule above
            count += (1 + this.countLeaves(obj[key]));
        }
    } else {
        // some primitive
        return 1; 
    }
    return count;
}
*/

/* Note - there is a "worst case" that this method is vulnerable to;
 *  I do not believe it would come up through ordinary means, but if
 *  someone changed only the key in a dictionary pair, this method can
 *  only identify the change as a complete deletion of the key, and then
 *  complete addition of the value to the "new" key. This is fitting,
 *  perhaps, as that is how the change would have to happen programatically.
 *
 */
 /* DEFUNCT - MOVED TO C++ EXECUTABLE
AutoDiff.jsonDiff = function(a, b, currCount, currBest) {
    // Reminder: a is orig, b is new //
    // Create subdiff //
    var diff = {};

  // I believe that the ordering of getOwnPropertyNames
  // is deterministic, even across browsers... buuuut...
  // it's not a bit deal to ensure it with sort, juuust
  // to be sure. 
   
    var a_keys = Object.getOwnPropertyNames(a).sort();
    var b_keys = Object.getOwnPropertyNames(b).sort();

    // Init "delete", "modify", and "add" in diff
    diff['-'] = [];
    diff['m'] = a_keys.map(x => null); // Create an array with an entry for each key in the original
    diff['+'] = {};
    //Note: in theory, the syntax allows for the diff to have a "modify" on a deleted key.
    // Thus, this function must be careful to never create such a situation
     
    var changes = currCount;

    // So, with JSON, if the note above the function is true, we don't
    // do traditional Myers Diff because we don't always have the same
    // options; dictionaries are not "sequenced". If a key appears in one
    // version and not the other, it can only have been added or deleted.
    // Furthermore, values to keys are independent; a change does not "span"
    // multiple keys, so we can independently Myers-diff the before and
    // after values of any matching keys. We do not really need to branch
    // or path-search through a graph, the choices - add, delete, or modify
    // - are made for us by the keys.

    // To expose slightly less data, instead of referring to keys in the
    // original (say, when we mark a "delete [key]" or "change to [key]"
    // in the diff), we refer to the index of the key in the sorted
    // key list of a/the original. Note that we are ok with exposing
    // data from the new version/patch (indeed, it is necessary).

    // Perhaps this density of checks does more harm than good, but for an
    // attempt at efficiency, we bound with "best changes" so, whenever we
    // increment the number of current changes, we check if we have exceeded
    // the "best" number of changes we have seen so far, in which case
    // we know this method is worse, so we abort (return early; the calling
    // function will know this is an "abort" and not a success because the
    // changes count will exceed "best")

    // Check old keys
    for (var i = 0; i < a_keys.length; i++) {
        const key = a_keys[i];
        if (!b_keys.includes(key)) {
            // key has been deleted
            diff['-'].push(i);
            // Add 1 at the end to represent the key itself
            changes += this.countLeaves(a[key])+1;
            if ((currBest > 0) && (changes > currBest)) return [changes, diff];

        } else {
            const a_next = a[key]; const b_next = b[key];
            // If the values to compare are arrays
            if (Array.isArray(a_next) && Array.isArray(b_next)) {

                // If no modification occurred/is necessary, do nothing
                if (this.arrayEquality(a_next, b_next)) {
                    continue;
                }
                // Get subdiff of sub-array
                const result = this.arrayDiff(a_next, b_next);
                changes += result[0];
                if ((currBest > 0) && (currBest < changes)) {
                    return [changes, diff];
                }

                diff['m'][i] = result[1];

            // If the values to compare are more json
            } else if (
                (!Array.isArray(a_next) && !Array.isArray(b_next)) && 
                (this.isObject(a_next) && this.isObject(b_next))
                ) {

                // If no modification occurred/is necessary, do nothing
                if (this.jsonEquality(a_next, b_next)) {
                    continue;
                }
                // Recurse into key contents, run again,
                //  and associate the diff to this key;
                //  increment changes accordingly.
                const result = this.jsonDiff(a, b, changes, currBest);
                changes = result[0]; diff['m'][i] = result[1];
                if ((currBest > 0) && (changes > currBest)) return [changes, diff];

            // If the values are both primitives
            } else if (!this.isObject(a_next) && !this.isObject(b_next)) {
                // If the values match, no modification
                if (a_next == b_next) {
                    continue;
                }
                // Modify value
                diff['m'][i] = b_next;
                changes += 1;
                if ((currBest > 0) && (changes > currBest)) return [changes, diff];

            // If the values are not of the same type
            } else {
                // No efficient way to "modify" them to be the same, have to delete one
                //  and add in a new one
                //  "modify" entire entry (effectively deletes old entry, adds new)
                diff['m'][i] = this.cloneObj(b[key]);
                changes += this.countLeaves(a[key]);
                changes += this.countLeaves(b[key]);
                if ((currBest > 0) && (changes > currBest)) return [changes, diff];
            }
        }
    }

    // Add new keys - keys that do not appear in A
    for (var i = 0; i < b_keys.length; i++) {
        const key = b_keys[i];
        if (!a_keys.includes(key)) {
            // Add key and its corresponding value
            diff['+'][key] = this.cloneObj(b[key]);
            changes += this.countLeaves(b[key]) + 1;
            if ((currBest > 0) && (changes > currBest)) return [changes, diff];
        }
    }

    return [changes, diff];
} */

/* DEFUNCT - MOVED TO C++ EXECUTABLE
AutoDiff.arrayDiff = function(a, b) {
    // These represent indices into a and b
    const n = a.length;
    const m = b.length;

    //if () {} //TODO - try straightforward listDiff first

    // Since arrayDiff, despite only wrapping the recursive one, can effectively be called
    //   recursively through jsonDiff, it must return a diff count in addition to the diff "answer"
    return this.arrayDepthFirst(a, b, {'+': {}, 'm': a.map(x => null), '-':[]}, 0, 0, n, m, 0, -1);
} */

/* TODO - think about all the diffs; is the cloning excessive? Want to use
 * minimal stack space, already we'll be using a bunch so limit redundancy */

//credit to: https://blog.jcoglan.com/2017/02/17/the-myers-diff-algorithm-part-3/
//String-comparison, line-based diffing for script files
/* DEFUNCT - MOVED TO C++ EXECUTABLE
AutoDiff.listDiff = function(a, b) {
    const loopIndex = function(arraySize) {
        return (function(x) {
            while (x < 0) {
                x += arraySize;
            }
            return x;
        });
    }

    function shortestEdit(_a, _b) {
        const n = _a.length;
        const m = _b.length;
        const max = n+m;
        var v = new Array(2*max+1).fill(0);
        const li = loopIndex(v.length);
        
        v[1] = 0;
        var trace = [];
        
        //Crawl down the edit graph breadth first - compute
        //  greedy farthest-reaching d-path along each diagonal k
        //  d represents "depth" in terms of non-diagonal paths taken
        //  in the edit graph
        for (var d = 0; d <= max; d += 1) {
            trace.push(v.slice(0)); //slice(0) is just a quick way to shallow copy/clone

            //Original script ranges k from -d to +d, but it was written in Ruby, which
            //  allows negative indexing (k will be used to index into an array) which
            //  does not work in JS
            for (var k = -d; k <= d; k += 2) {
                //If k defines our vertical boundary, keep moving vertical
                //If k defines our horizontal boundary, cannot let it move vertical
                //Final rule is just a tie-breaker; we could reverse it, maybe get
                //  different diffs/solutions, but they'd be just as minimal/optimal
                if ((k == -d) || ((k != d) && (v[li(k-1)] < v[li(k+1)]))) {
                    x = v[li(k+1)];
                } else {
                    x = v[li(k-1)] + 1;
                }
                //compute y from k relation
                y = x - k;
                //greedily maximize "snakes" or trailing diagonal stretches
                //  as long as possible
                while ((x < n) && (y < m) && (_a[x] == _b[y])) {
                    x += 1;
                    y += 1;
                }
                v[li(k)] = x;
                //if we arrived at the final node, we have a path from start to end;
                //the first such path must be the shortest, or tied for shortest
                if ((x >= n) && (y >= m)) {
                    return trace;
                }
            }
        }
        return [];
    }

    var diff = [];
    function composeDiff(prev_x, prev_y, x, y) {
        //const a_line = a[prev_x];
        //const b_line = b[prev_y];
        if (x == prev_x) {
            //Put in an insertion of b_line at new doc line prev_y
            const b_line = b[prev_y];
            diff.push(['+', prev_y, b_line])
        } else if (y == prev_y) {
            //Put in an deletion of a_line at orig doc line prev_x
            diff.push(['-', prev_x])
        } else {
            //No change, no need to document
            // Due to way the code works (see backtrack), should never get here
        }
    }

    function backtrack(trace) {
        if (trace.length == 0) return;
        var x = a.length;
        var y = b.length;
        var li = loopIndex(trace[0].length);
        
        var prev_x;
        var prev_y;
        var prev_k;

        //Warning: reverse is inplace, so make sure we only need to do this once, ever
        trace.reverse();
        var index = 0;
        for (var d = trace.length - 1; d >= 0; d -= 1) {
            const k = x - y;
            const v = trace[index];

            if ((k == -d) || ((k != d) && (v[li(k-1)] < v[li(k+1)]))) {
                prev_k = k+1;
            } else {
                prev_k = k-1;
            }
            prev_x = v[li(prev_k)];
            prev_y = prev_x - prev_k;
            
            //Cut through the long stretches of undocumented matches to get
            // to the next key move in the graph
            while ((x > prev_x) && (y > prev_y)) {
                composeDiff(x - 1, y - 1, x, y);
                x = x-1;
                y = y-1;
            }
            
            if (d > 0) {
                composeDiff(prev_x, prev_y, x, y);
            }
            x = prev_x;
            y = prev_y;
            index += 1;
        }
    }

    backtrack(shortestEdit(a, b));
    return diff;
} */

//A is original, B is new
//AutoDiff.textDiff = function(fileA, fileB) TODO - DELETE OLD
AutoDiff.textDiff = function(fileA, fileB, outfile) {
    /* Arguments:
    <0: command name of executable file>
     1: original version of file (filename string)
     2: modified version of file (filename string)
     3: output path (path string)
     4: 0 = treat the files as newline-delimited text files, 1 = treat the files as JSON
      - the following will be constant, and supplied by the class later -
     5: is eq search optimization enabled (0 = disabled)
     6: eq search optimization minSize (unsigned int)
     7: eq search optimization minRatio (double)
     8: is search timeout enabled (0 = disabled)
     9: search timeout, in sec (unsigned long int)
     */
    this.addChildProcess([fileA, fileB, outfile, "0"]);

    /* DEFUNCT - MOVED TO C++ EXECUTABLE
    var a = fs.readFileSync(fileA, {encoding:"utf8"}).split(/[\r\n]+/);
    var b = fs.readFileSync(fileB, {encoding:"utf8"}).split(/[\r\n]+/);
    return this.listDiff(a, b); */
}

// Note: This algorithm implementation has a good deal of redundancy, for
// any place where we could do a
/* DEFUNCT - MOVED TO C++ EXECUTABLE
AutoDiff.arrayDepthFirst = function(a, b, diff, x, y, n, m, count, best) {
    var temp_diff;
    var temp_count;
    var best_diff = this.cloneObj(diff);
    var result;
    var new_count;
    // Stop if we reach end of edit path, or if we know this path
    //   is already not the best path (current change count better than
    //   best change count found so far)
    if (((x == n) && (y == m)) || ((count > best) && (best > 0))) {
        return [count, diff];
    }

    // TRY MODIFY 1st (modify contains "equal" as a subcase)
    // All diffs use source-side indices, for consistency

    // Try modifying current index of a
    //   to reflect current index of b

    // Reset to try taking this approach at the index
    if ((x < n) && (y < m)) {
        temp_diff = this.cloneObj(diff);
        temp_count = count;
        //Modify ENtry has check for/handles equality, as well
        result = this.modifyEntry(a[x], b[y], count, best);
        //If a[x] == b[y], no need to record modification
        if (result[0] > 0) {
            temp_count += result[0]; temp_diff['m'][x] = result[1];
        }
        if ((temp_count < best) || (best < 0)) {
            result = this.arrayDepthFirst(a, b, temp_diff, x+1, y+1, n, m, temp_count, best);
            if ((result[0] < best) || (best < 0)) {
                best = result[0]; best_diff = result[1];
            }
        }
    }

    // TRY ADD (Prioritize add over delete)
    // Reset to try taking this approach at the index
    if (y < m) {
        temp_diff = this.cloneObj(diff);
        temp_count = count;
        temp_count += this.countLeaves(b[y]);
        if ((temp_count < best) || (best < 0)) {
            // Can have multiple subsequent adds in a row/at the same source index, so we keep a list
            if (x in temp_diff['+']) { temp_diff['+'][x].push(this.cloneObj(b[y])); }
            else { temp_diff['+'][x] = [this.cloneObj(b[y])]; }
            result = this.arrayDepthFirst(a, b, temp_diff, x, y+1, n, m, temp_count, best);
            if ((result[0] < best) || (best < 0)) { best = result[0]; best_diff = result[1]; }
        }
    }

    // Note: Because adds are prioritized, adds are performed BEFORE source index;
    // ie, if source is "ae", and an add is performed on source index 1,
    // we end up with "abe"

    // TRY DELETE
    // Reset to try taking this approach at the index
    if (x < n) {
        temp_diff = this.cloneObj(diff);
        temp_count = count;
        // Any listed index is in '-' is deleted
        temp_count += this.countLeaves(a[x]); temp_diff['-'].push(x);
        if ((temp_count < best) || (best < 0)) {
            result = this.arrayDepthFirst(a, b, temp_diff, x+1, y, n, m, temp_count, best);
            if ((result[0] < best) || (best < 0)) { best = result[0]; best_diff = result[1]; }
        }
    }

    // Return best we have found
    return [best, best_diff];
} */

// Called by arrayDepthFirst to handle getting any kind of modification
//   subdiff depending on the types of entries involved
/* DEFUNCT - MOVED TO C++ EXECUTABLE
AutoDiff.modifyEntry = function(a, b, count, best) {
    if (this.checkEquality(a, b)) {
        return [0, null]; //"null", specifically for a modify, encodes "no change" for this entry
    }

    if ((Array.isArray(a)) && (Array.isArray(b))) {
        // Get a subdiff of the array elements; this is a brand new diff
        //   that is a child of the diff from which this is called, it is
        //   NOT another step in creating the parent/calling array diff
        return this.arrayDiff(a, b);

    // If the entries are Objects
    } else if (
            (!Array.isArray(a) && !Array.isArray(b)) && 
            (this.isObject(a) && this.isObject(b))
          ) {
        // Get a subdiff of the json entries
        return this.jsonDiff(a, b, count, best);

    // If the entries are primitives
    } else if (!this.isObject(a) && !this.isObject(b)) {
        // Only changing one value
        count += 1;
        // The subdiff in this case is just the b (post-patch) value
        return [count, b];
    } else {
        // This is the case where we're coming from an array, not JSON,
        //   and in one, the element is an array and the other is an object,
        //   so we do another "drastic modify", where in effect the patcher
        //   will delete all of a and add in b
        // Note: this adds redundancy as this will override any situation
        //   where we would do a delete and then add
        count += this.countLeaves(a);
        count += this.countLeaves(b);
        return [count, this.cloneObj(b)];
    }
} */

//AutoDiff.diff = function(fileA, fileB) TODO - DELETE OLD
AutoDiff.diff = function(fileA, fileB, outfile) {
    /* Arguments:
    <0: command name of executable file>
     1: original version of file (filename string)
     2: modified version of file (filename string)
     3: output path (path string)
     4: 0 = treat the files as newline-delimited text files, 1 = treat the files as JSON
      - the following will be constant, and supplied by the class later - 
     5: is eq search optimization enabled (0 = disabled)
     6: eq search optimization minSize (unsigned int)
     7: eq search optimization minRatio (double)
     8: is search timeout enabled (0 = disabled)
     9: search timeout, in sec (unsigned long int)
     */
    this.addChildProcess([fileA, fileB, outfile, "1"]);

    /* DEFUNCT - MOVED TO C++ EXECUTABLE
    var a = JSON.parse(fs.readFileSync(fileA, {encoding:"utf8"}));
    var b = JSON.parse(fs.readFileSync(fileB, {encoding:"utf8"}));

    if (Array.isArray(a) && Array.isArray(b)) {
        const result = this.arrayDiff(a, b);
        return result[1];
    } else if ((!Array.isArray(a) && !Array.isArray(b)) && 
                (this.isObject(a) && this.isObject(b))) {
        const result = this.jsonDiff(a, b);
        return result[1];
    }
    console.log("Error - arrived at diff with incompatible types");
    return null;
    */
}

AutoDiff.tryNextProcess = function() {
	console.log("in Try Next");
		while (this._activeProcesses < parseInt(this._maxProcesses) && (this._processes.length > 0)) {
	  	const args = this._processes.pop();
	  	//We want the file names, and whether it's a JSON or list/line/text file. Other parameters
	  	//  should be constant throughout an entire project diff
	  	let exec = path.join(path.dirname(process.mainModule.filename), "jsondiff.exe");
	  	//exec = "start "+exec;
	  	//DEBUG
	  	console.log("Running diff on the following files: "+args[0]+" "+args[1]);
	  	console.log("Command: "+exec+(args.concat([this._eqOn, this._eqMinSize, this._eqMinRatio,
	      this._timeoutOn, this._searchTimeout])).join(" "));

			let p = child_process.exec(exec+" "+(args.concat([this._eqOn, this._eqMinSize, this._eqMinRatio,
	      this._timeoutOn, this._searchTimeout])).join(" "));

			//p.on('close', this.onProcessTerminate2(args));

	  	//let p = child_process.execFile(exec, args.concat([this._eqOn, this._eqMinSize, this._eqMinRatio,
	    //  this._timeoutOn, this._searchTimeout]), this.onProcessTerminate(args));

			const fileA = args[0];
			const fileB = args[1];
			const out = args[2];
	  	this._running[out] = [p, fileA, fileB];
	  	this._activeProcesses += 1;
	  }
}

AutoDiff.onProcessTerminate = function(args) {
	const fileA = args[0];
	const fileB = args[1];
	const fileC = args[2];
	return function(error, stdout, stderr) {
		console.log("I promise that this ran and stuff");
    console.log(stdout);
    if (error) {
    		console.log(stderr);
        AutoDiff.reportError(fileA, fileB);
    } else {
        AutoDiff.reportSuccess(fileA, fileB, fileC);
    }
  }
}

//TODO - more than simply log-and-continue?
AutoDiff.reportError = function(fileA, fileB) {
    this._activeProcesses -= 1;
    console.log("Failed to create diff for: "+fileA+" "+fileB);
    this.tryNextProcess();
}

AutoDiff.reportSuccess = function(fileA, fileB, fileC) {
    this._activeProcesses -= 1;
    console.log("Successfully created file: "+fileC+" from files "+fileA+" "+fileB);
    this.tryNextProcess();
}

AutoDiff.checkDone = function() {
	return ((this._activeProcesses == 0) && (this._processes.length == 0))
}

AutoDiff.addChildProcess = function(cpArgs) {
    this._processes.push(cpArgs);
    this.tryNextProcess();
}

AutoDiff.initializeExecArgs = function() {
    this._eqOn = "0";
    this._eqMinSize = "30";
    this._eqMinRatio = "90";
    this._timeoutOn = "0";
    this._searchTimeout = "90";
    this._maxProcesses = "1";
    this._activeProcesses = 0;
    this._processes = [];
    this._running = {};
}

AutoDiff.setExecArgs = function(args) {
    //Any that can be defined in textboxes may be null when passed here
    //All are already strings when passed here (ultimately the .exe call requires string arguments)
    this._eqOn = args[0];
    this._eqMinSize = args[1] || this._eqMinSize;
    this._eqMinRatio = args[2] || this._eqMinRatio;
    this._timeoutOn = args[3];
    this._searchTimeout = args[4] || this._searchTimeout;
    this._maxProcesses = args[5] || this._maxProcesses;
}

AutoDiff.createReqDirectories = function(filepath) {
    let folder = path.dirname(filepath);
    if (fs.existsSync(folder)) {
        //Stop when the folder needed to contain this file already exists
        return;
    } else {
        //Keep going upstream to the highest-level folder that exists already
        this.createReqDirectories(folder);
        //Make the next needed folder in the path/stream, and finish
        //  - In the recursive scheme, goes to make the next needed folder after
        //    this prerequisite we just made
        fs.mkdirSync(folder);
    }
}

AutoDiff.getOrigKey = function() {
    let data = path.join(ModManager._base, 'data');
    if (!fs.existsSync(data) || !fs.existsSync(path.join(data, 'System.json'))) {
        //Very problematic
        return null
    }
    const sys = JSON.parse(fs.readFileSync(path.join(data, 'System.json'), {encoding:'utf8'}));
    if (sys.encryptionKey) {
        return sys.encryptionKey.split(/(.{2})/).filter(Boolean);
    } else {
        return null;
    }
}
AutoDiff.getModKey = function() {
    const sys = $dataSystem;
    if (sys.encryptionKey) {
        return sys.encryptionKey.split(/(.{2})/).filter(Boolean);
    } else {
        return null;
    }
}

/*  Important notes/lessons learned from experimenting:
 *   - By the end of Decrypter.decryptArrayBuffer, the arrayBuffer
 *     contents will match/be equal to those of an unecnrypted file
 *   - The contents of a file when retrieved via the XMLHttpRequest
 *     (response format: array buffer, GET, open, etc) process is
 *     equivalent to the bytes retrieved by fs.fileReadSync with no
 *     econding specified (so it returns a Buffer, not a String)
 *       - the primary significance of this is that there was some
 *         concern that the xml request might return the file body
 *         without header bytes, but the two methods seem to both
 *         fetch all file bytes, in the same order
 *   - variable type is very important to observing equivalence:
 *     it is easiest to see this by converting to Uint8Arrays, but
 *     since those do not have a builtin "equals" function, they
 *     should be converted back to Buffers for comparison.
 *
 */

AutoDiff.unencryptBytesEqual = function(baseBuffer, patchBuffer, baseKey, patchKey, name) {
    //Whether to decrypt mod/patch file:
    const needsDecrypt1 = (((name.match(/\.[png|rpgmvp]$/i) && $dataSystem.hasEncryptedImages) ||
                                                 (name.match(/\.[mp4|ogg|rpgmvo|rpgmvm]$/i) && $dataSystem.hasEncryptedAudio)) &&
                                                 (patchKey != null));;
    //Wheter to decrypt base file:
    const sys = JSON.parse(fs.readFileSync(path.join(ModManager._base, 'data', 'System.json'), {encoding:'utf8'})); //Assumes data file exists
    const needsDecrypt2 = (((name.match(/\.[png|rpgmvp]$/i) && sys.hasEncryptedImages) ||
                                                 (name.match(/\.[mp4|ogg|rpgmvo|rpgmvm]$/i) && sys.hasEncryptedAudio)) &&
                                                 (baseKey != null));
    //Decrypt modded file contents as needed
    if (needsDecrypt1) {
    let header = new Uint8Array(patchBuffer, 0, Decrypter._headerlength);
    let i;
    let ref = Decrypter.SIGNATURE + Decrypter.VER + Decrypter.REMAIN;
    let refBytes = new Uint8Array(16);
    for (i = 0; i < Decrypter._headerlength; i++) {
        refBytes[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
    }
    for (i = 0; i < Decrypter._headerlength; i++) {
        if (header[i] !== refBytes[i]) {
            throw new Error("Header is wrong");
        }
    } 

    patchBuffer = Decrypter.cutArrayHeader(patchBuffer, Decrypter._headerlength);
    let view = new DataView(patchBuffer);
    Decrypter._encryptionKey = patchKey;
    if (patchBuffer) {
        let byteArray = new Uint8Array(patchBuffer);
        for (i = 0; i < Decrypter._headerlength; i++) {
            byteArray[i] = byteArray[i] ^ parseInt(Decrypter._encryptionKey[i], 16);
            view.setUint8(i, byteArray[i]);
        }
    }
    }
    //Decrypt base file contents as needed
    if (needsDecrypt2) {
    let header = new Uint8Array(baseBuffer, 0, Decrypter._headerlength);
    let i;
    let ref = Decrypter.SIGNATURE + Decrypter.VER + Decrypter.REMAIN;
    let refBytes = new Uint8Array(16);
    for (i = 0; i < Decrypter._headerlength; i++) {
        refBytes[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
    }
    for (i = 0; i < Decrypter._headerlength; i++) {
        if (header[i] !== refBytes[i]) {
            throw new Error("Header is wrong");
        }
    } 

    baseBuffer = Decrypter.cutArrayHeader(baseBuffer, Decrypter._headerlength);
    let view = new DataView(baseBuffer);
    Decrypter._encryptionKey = baseKey;
    if (baseBuffer) {
        let byteArray = new Uint8Array(baseBuffer);
        for (i = 0; i < Decrypter._headerlength; i++) {
            byteArray[i] = byteArray[i] ^ parseInt(Decrypter._encryptionKey[i], 16);
            view.setUint8(i, byteArray[i]);
        }
    }
    }
    
    baseBuffer = new Buffer(baseBuffer);
    patchBuffer = new Buffer(patchBuffer);
    return patchBuffer.equals(baseBuffer);
}

AutoDiff.createPatch = function(config, name) {
  // If the patch output folder with "name" does not already exist, make it
  let output = path.join(ModManager._path, 'patches', name);
  if (fs.existsSync(output)) {
    ModManager.deleteFolderRecursive(output);
  } 
  fs.mkdirSync(output);

  const root = path.join(path.dirname(process.mainModule.filename)); //the 'www' directory
  const assetCompare = config['asset_compare'];
  const scriptCompare = config['script_compare'];
  const useList = config['explicit_list'];
  const orig_key = this.getOrigKey();
  const mod_key = this.getModKey();


  if (useList) {
    let list = [];
    try {
        const listFile = path.join(path.dirname(path.dirname(process.mainModule.filename)), 'mods', ModManager._listFileName)
        list = JSON.parse(fs.readFileSync(listFile, {encoding: 'utf8'}));
    } catch (error) {
        console.log("Failed to parse LIST file for patch/diff creation.");
        return;
    }
    function fileDiffSequential(fileList, parentPath="") {
        const src = path.join(ModManager._base,parentPath);
        for (var k in list) {
        		const file = list[k];

            const orig = path.join(src, file);
            const patch = path.join(curr, file);

            const orig_bytes = fs.readFileSync(orig);
            const patch_bytes = fs.readFileSync(patch);
            if (!orig_bytes.equals(patch_bytes)) {
                //If the file to be compared is a JSON object
                if (file.match(/\.json$/i)) {
                    //Copy the diff of the two files named "file" into the patch folder
                    const newfile = path.join(ModManager._path, ModManager._patchesFolder, name, parentPath, file);
                    //Make sure requisite parent directory hierarchy exists
                    //  that the file will be written into
                    this.createReqDirectories(newfile);
                    this.diff(orig, patch, newfile);
                    //let diff = this.diff(orig, patch); TODO: DELETE, OLD WAY, pre executable
                    //fs.writeFileSync(newfile, JSON.stringify(diff), {encoding: 'utf8'});
                //If the file to be compared is an asset file
                } else if (file.match(/\.[png|mp4|ogg|rpgmvp|rpgmvo|rpgmvm]$/i)) {
                    //Make sure that the difference in bytes between new and old isn't just
                    //  due to encryption differences
                    if (this.unencryptBytesEqual(orig_bytes, patch_bytes, orig_key, mod_key, file)) continue;
                    //Copy new image/audio/asset into
                    const newfile = path.join(ModManager._path, ModManager._patchesFolder, name, parentPath, file);
                    //Make sure requisite parent directory hierarchy exists
                    //  that the file will be written into
                    this.createReqDirectories(newfile);
                    fs.writeFileSync(newfile, patch_bytes);
                  //If the file to be compared is a text or script file
                } else if (file.match(/\.[txt|csv]$/i) || file.match(/\.js$/i)){
                    const newfile = path.join(ModManager._path, ModManager._patchesFolder, name, parentPath, file);
                    //Make sure requisite parent directory hierarchy exists
                    //  that the file will be written into
                    this.createReqDirectories(newfile);
                    this.textDiff(orig, patch, newfile);
                    //let diff = this.textDiff(orig, patch); TODO: DELETE, OLD WAY, pre executable
                    //fs.writeFileSync(newfile, JSON.stringify(diff), {encoding: 'utf8'});
                }
            }
        }
    }
    fileDiffSequential = fileDiffSequential.bind(this);
    //Perform the diff on the files
    fileDiffSequential(list);

  //If we are not given a list, but instead must search for changes ourselves
  } else {
    function fileDiffRecurse(parentPath="") {
        let files = [];
        //path to asset in original/source install
        const src = path.join(ModManager._base,parentPath);
        //path to asset in current/modded/patched install
        const curr = path.join(root,parentPath);

        //NOTE: it was decided that if something appears in the source
        // but not the modded install, that it was not worthwhile to
        // include mechanisms to signal to actively delete those files
        // when the patch is applied.
        if (fs.existsSync(curr)) {
            console.log(curr);
            files = fs.readdirSync(curr);
            files.forEach(function(file, index) {
            		//Skip this script and files added to make this one work
            		if (ModManager._dependencies.includes(file)) { return; }

                if (fs.lstatSync(path.join(parentPath, file)).isDirectory()) {
                    fileDiffRecurse(path.join(parentPath, file));
                } else {
                    //If this file also exists
                    if (fs.existsSync(path.join(src, file))) {
                        //If the filetype is not one we're interested in, we can skip the comparison
                        if (file.match(/\.[png|mp4|ogg|rpgmvp|rpgmvo|rpgmvm]$/i) && !assetCompare) { return; }
                        if (file.match(/\.js$/i) && !scriptCompare) { return; }

                        const orig = path.join(src, file);
                        const patch = path.join(curr, file);

                        const orig_bytes = fs.readFileSync(orig);
                        const patch_bytes = fs.readFileSync(patch);
                        if (!orig_bytes.equals(patch_bytes)) {
                            console.log(file);
                            if (file.match(/\.json$/i)) {
                                //Copy the diff of the two files named "file" into the patch folder
                                const newfile = path.join(ModManager._path, ModManager._patchesFolder, name, parentPath, file);
                                //Make sure requisite parent directory hierarchy exists
                                //  that the file will be written into
                                this.createReqDirectories(newfile);
                                this.diff(orig, patch, newfile);
                                //let diff = this.diff(orig, patch); TODO: DELETE, OLD WAY, pre executable
                                //fs.writeFileSync(newfile, JSON.stringify(diff), {encoding: 'utf8'});

                            //If asset compare flag is checked, we can copy in new/changed assets;
                            //  files with extensions that are not common are copied regardless, to be safe
                            } else if (file.match(/\.[png|mp4|ogg|rpgmvp|rpgmvo|rpgmvm]$/i)) {
                                //Make sure that the difference in bytes between new and old isn't just
                            //  due to encryption differences
                            if (this.unencryptBytesEqual(orig_bytes, patch_bytes, orig_key, mod_key, file)) return;
                                //Copy new image/audio/asset into
                                const newfile = path.join(ModManager._path, ModManager._patchesFolder, name, parentPath, file);
                                //Make sure requisite parent directory hierarchy exists
                                //  that the file will be written into
                                this.createReqDirectories(newfile);
                                fs.writeFileSync(newfile, patch_bytes);

                            //If script flag is checked, we can copy in new/changed assets;
                            //  files with extensions that are not common are copied regardless, to be safe
                            } else if (file.match(/\.[txt|csv]$/i) || file.match(/\.js$/i)) {
                                const newfile = path.join(ModManager._path, ModManager._patchesFolder, name, parentPath, file);
                                //Make sure requisite parent directory hierarchy exists
                                //  that the file will be written into
                                this.createReqDirectories(newfile);
                                this.textDiff(orig, patch, newfile);
                                //let diff = this.textDiff(orig, patch); TODO: DELETE, OLD WAY, pre executable
                                //fs.writeFileSync(newfile, JSON.stringify(diff), {encoding: 'utf8'});
                            }

                        //File bytes match in both modded and base directory:
                        } else {
                            //Do nothing; file unchanged
                        }

                    //File exists in modded directory but not base directory:
                    } else {
                          //If asset compare flag is checked, we can copy in new/changed assets;
                          //  files with extensions that are not common are copied regardless, to be safe
                          if (!file.match(/\.[png|mp4|ogg|rpgmvp|rpgmvo|rpgmvm]$/i) || assetCompare) {
                            //Copy it into the patch, it's new content
                            const newfile = path.join(ModManager._path, name, parentPath, file);
                            //Make sure requisite parent directory hierarchy exists
                            //  that the file will be written into
                            this.createReqDirectories(newfile);
                            fs.writeFileSync(newfile, fs.readFileSync(path.join(curr, file), {encoding: 'utf8'}));
                          }
                    }
                }
            }.bind(this));
        }
    }
    fileDiffRecurse = fileDiffRecurse.bind(this);
    //Perform diff from roots
    fileDiffRecurse();
  }

  console.log("Ok, now we wait...")
  //Wait until all process calls have terminated - "collect" threads
  while (!this.checkDone()) {
    	for (let outfile in this._running) {
    		let p = this._running[outfile];
    		if (fs.existsSync(outfile)) {
    				p[0].unref();
			      this.reportSuccess(p[1], p[2], outfile);
			      delete this._running[outfile];
    			}
    	}
  }
}

//add events to map 0, change event 0 in map 1, add map 2, insert map before map 3

Array.prototype.equals = function (arr) {
    return this.length == arr.length && this.every((u, i) => u === arr[i]);
}


//Save convert TODOs: so I had to get rid of "ImageManager.clear()" to get more of the save files
// to have characters drawn... so I need a way of either forcing it to not shortcut to a bitmap
// when we feed it an image name (aka cache) since the whole point is different saves in different
// patches have different ideas of what an image looks like... or, have the initial names somehow
// be different so they are cached in different places (but, this is hard because you have to go
// a few functions into the call stack before it adds "img/characters/" to the filename, so
// the patch install path has to be added late...). Also currently: it seems to only care about the
// patch/version of the currently-top-row/showing save file in the list - they all get drawn or
// are invisible based on that. Why? Also - why are they invisible at all...? Happened less when I
// got rid of ImageManager.clear() - but not completely, the bottom two when I first enter the menu
// still don't have a party drawn.
// potential idea: put a check into "drawCharacter" that injects the url with the patch if the window
// is a savefilelist type... eh, might not help at all...

//TODO: Once again, supporting the ability to apply multiple patches causes a problem that I did
// not initially realize: suppose we have a file that does not exist in the original and is added
// by the mod. Ok, then instead of a diff, we just leave the whole new file intact in the patch,
// and paste it into the new install directory when we apply the patch. But - what if we apply
// another patch, that adds the same file? We could throw our hands up and say "oh well, that's
// some bad luck, but the one last applied 'wins' and overwrites the file from the patch before it"
// (TODO - check that that's how it currently would work) And for an asset - image or audio file -
// that's probably the best we could do. And this issue would seemingly be rare and niche... but
// where it most comes into play, is "convert.js". A file that modmakers are instructed to create
// that tells the game how to perform a conversion on the save file to make it compatible with
// the mod. So we expect that it will be a "new" file of a very particular name that any mod could
// add, but overwriting one file's conversion method, so long as we're including the patch that it's
// a conversion for, will obviously lead to issues.
//  - TODO - dynamic "diff without delete"

// If a modder unencrypts a game to work with it more easily, changes very few images, and then
// chooses to encrypt *their* new images and thus encrypts the whole working copy and creates
// a patch, currently, since they are encrypted differently, the bytes of *every* image and audio
// file will be different, and the "diff" will pick up all of them, even the unchanged ones
// make it do byte compares on the *unencrypted* bytes if the files are both encrypted
//   - implemented, concept has been tested in practice, but final implementation needs test

//TODO: main.js decrypter script currently changes file size when it decrypts, need to fix
//TODO: add in toggle in create patch for doing character-by-character diff instead of line by line
//TODO: change description/overview text at the top - no more "tags", all auto-diff,
//  explain the toggles, explain how to do convert.js
//TODO: test menu for transitioning save files across patches
//TODO: test line-based text diffing for scripts; implement image diffing
//TODO: right now, in theory, a "patched instance" can include multiple mods/patches.
//  In reality, this won't work currently because the mods/patches will have different
//  decrypt keys for their images, and likely the latest one added will override all
//  others. Furthermore, if base game is encrypted but modder leaves his images unencrypted
//  (mixed bag of encryption) that will also fail, currently, I think
//TODO: test applying patch
//TODO: make sure that when loading a save, it loads database info from the correct patch...
//  but it's loading it from a save, and the save will have been made based on patch info, so no need to worry
//  about potential patch-hopping...? Wait, no that's what this bullet is about - make sure that the things NOT
//  loaded from saves can't vary by patch, otherwise, have to include patch metadata in saves, then check, and
//  possibly alter/reload the non-save patch-sensitive variables
//TODO: scripts are activated by adding <script>s to the document; have to do that when they start playing (so
//  if they start new game, like really start, after our "choose patch" extra option, or when they continue from
//  a load. More interestingly, perhaps... if they return to title and make any CHANGES, we have to do something
//  about that, see if we can *remove* or unload the script resources. If that's REALLY not possible, then we have
//  to set a flag in ModManager when the scripts are loaded/added and deactivate scripts in the mod window if that
//  flag is set.
//TODO: diff-creating tool - needs more test
//   - test with explicit list option as well
//TODO: ideally? add progress bar to patch-apply, patch init, and patch export.
//TODO: fix cursor thing when MOG is used
//Apparently " * @type file" is a thing, account for this in scripts?
// * @dir audio/se/
// * @require 1"
// "
// Also so is this:  * @type common_event