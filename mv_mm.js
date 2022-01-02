//=============================================================================
// RPG Maker MV Mod Manager.js
//=============================================================================

/*:
 * 
 * =============================================================================
 * ** HOW TO USE **
 * =============================================================================
 *
 * 1) Make sure that this script, and its dependency, "window_textbox.js", has been
 *  added to the plugins list (plugins.js). Neither script has any parameters.
 * 2) Create a folder, called "mods", in the same directory as Game.exe and "www"
 * 
 *
 *
 * TO USE (INSTALL) A PATCH:
 *   3) Create a directory in the mods folder called "patches".
 *   4) Copy the provided patch folder into the "patches" folder.
 *       a) Unzip the patch if necessary (if it is a .zip, .tg, .tar, .rar, etc)
 *       b) Make sure that it is set up so that the folder hierarchy goes:
 *        .../mods/patches/[patchName]/{data/, img/, audio/, etc} 
 *   5) Launch the game, navigate down to the "Mods" option, and select it.
 *   6) Select "Patches".
 *   7) Navigate the patch list on the left to find your desired patch.
 *   8) Select whichever patch tags you want.
 *   9) Select the apply button to apply the patch. NOTE: The patch is not yet playable.
 *   10) Repeat steps 6-8 for all desired patches, in the desired order. NOTE: It is not
 *    recommended to try to apply multiple patches in one installation, as there is a good
 *    chance the patches will have some conflict. But the possibility is supported.
 *   11) OPTIONAL: if you make a mistake or change your mind, use the Reset button to clear
 *    the your patch-in-progress and start from a blank slate.
 *   12) Select Export when you are ready to finish the patch. This may take a few minutes.
 *   13) Name your patch, and hit Enter.
 *    NOTE: if you ever want to delete a patch, delete the corresponding folder under
 *     /mods/installs/
 *   14) OPTIONAL: if this is your very first time ever exporting a patched game instance,
 *    you may want to restart your game. The export process silently makes some minor
 *    alterations to the base-game scripts to reduce the chances of conflict when loading
 *    additional (modified) script files. These changes, however, will not take effect
 *    unless the scripts are reloaded (the game is restarted).
 *   15) Continue pressing escape to exit to the Title menu. Press New Game, and select
 *    your named patch from the options. Alternatively, if you already have save games,
 *    you can use the Save Convert menu in the Mods page to convert the saves to the new
 *    patch (see guide below).
 *
 *
 *
 * HOW TO CONVERT SAVES
 * ----------------------------------------
 *   16) To convert a save between patches, or to/from the vanilla game to a given
 *    patch, you must:
 *       a) have at least one existing save.
 *       b) have at least one installed patch (see above for how to do this).
 *   17) Go to the game's Title menu.
 *   18) Navigate to the "Mods" option.
 *   19) In the Mods page, navigate to the Save Convert tab.
 *   20) In the list on the left, scroll through until you find the savegame that
 *    you want to convert. Hit enter to select it.
 *   21) The menu will focus to the list on the right; scroll through the list
 *    and hit Enter to select the patch installation you want to convert the save
 *    to.
 *   22) The menu will focus back to the left list; THE SAVE HAS NOT BEEN CONVERTED
 *    YET. Scroll through the save list to select the slot to save the converted
 *    version of the save to. If there is an existing save in that slot, it will
 *    prompt you to confirm that you want to overwrite that save file.
 *   23) Hit enter again, and the save conversion should apply quickly. If it worked,
 *    the selected slot on the left list should look different (either have data where
 *    before it was empty, or the patchname listed on it will look different).
 *
 *
 *
 * =============================================================================
 * ** HOW TO CREATE A PATCH **
 * =============================================================================
 * 
 *   3) Create a new folder under the "mods" folder. Call this folder "base".
 *   4) Save the original game data in this "base" folder, ie: copy the contents of
 *    of the game's "www" folder (ie, a copy of folders like "data", "img", etc)
 *    into "mods/base/".
 *   5) Modify the game (under "www", not "mods/base") as you like. (There is a 
 *    separate guide for this step below)
 *   6) Start the game, and from the Title menu navigate to the Mods option.
 *   7) Within the Mods menu, navigate to the "Create" tab on the far right.
 *   8) In this menu, you will see a textbox, three toggles beneath it, and a button
 *    to begin exporting.
 *      a) The textbox is where you provide the name of the patch; it determines
 *        the name of the folder in which the patch will be generated. 
 *      b) The top toggle, if enabled, means that you will provide an explicit list
 *        (as an array) that contains the files that you want to be diffed and included
 *        in the patch. Otherwise, when the diff occurs, every file under every folder
 *        will be analyzed (subject to the next two toggles). By default, the name of
 *        the list file it expects is LIST.txt, and it should be located in the "mods"
 *        folder.
 *        IMPORTANT NOTE: within the list file, you must provide filepaths to the file.
 *        it does not suffice to merely give the filename. Furthermore, it expects the
 *        file to be written as a JSON-formatted array. That means paths are strings
 *        (bookended by quotes), remember to escape any backslashes, and the entire list
 *        should be comma-separated and bookended by square brackets.
 *        ex:
 *         [
 *          "\\data\\System.json",
 *          "\\img\\characters\\Actor1.rpgmvp"
 *         ]
 *      c) The second, if turned on, means that you want it to scan the image, audio,
 *        and video files. By default, the patch only looks at data files (map data,
 *        database info like party members and enemies, etc).
 *      d) The third toggle, if turned on, means that you want it to scan .js files
 *        (scripts and plugins). By default, the patch only looks at data files (map
 *        data, database info like party members and enemies, etc).
 *   9) When you are ready to export, enter a valid folder name in the textbox and,
 *    still from the textbox, press Enter to be taken to the submit button. Press
 *    enter again to confirm and begin exporting the patch. Note that it may take
 *    a while to export. You will know it is finished when it automatically leaves
 *    the Create submenu of the Mods page.
 *    NOTE: if for some reason the export is interrupted (sometimes Windows will close
 *    RPG Maker MV processes if they take too many resources for a long task), try again
 *    with the same patch name - it should resume diffing from where it left off. There
 *    is no danger of "corrupted files" from an early abort.
 *   10) OPTIONAL: create a .js file that helps convert savegames. See section below.
 *   11) Your patch is ready under "mods/patches/{yourPatchName}/". Copy it somewhere, zip
 *    it, and post at your leasure.
 *   
 *
 *
 * HOW TO START MODIFYING ANOTHER GAME
 * ----------------------------------------
 *   To modify an RPG Maker MV game, you must own the software RPG Maker MV.
 *   Create a new RPG Maker MV game project.
 *   If the original game does not have any encrypted assets in it, then you simply have to copy
 * all of the game files over. Copy /img/ into the project's /img/, /data/, etc. Every folder in
 * the game's "www" folder, every folder in the same directory as "package.json" and "index.html".
 *   If the game does have encrypted assets, then you will have to find an RPG Maker MV decrypter.
 * several exist. Decrypt the assets. The one other change you have to do, is open up System.json
 * under the data folder, and change "hasEncryptedImages" and "hasEncryptedAudio" to "false". Both
 * of these will be at the very end of the file.
 *   Once all of the assets and data files are in place, unencrypted, in the project, you can simply
 * start editing from the Game.rpgproject
 *   
 *
 *
 * MAKING A SAVE CONVERSION SCRIPT
 * ----------------------------------------
 *   This is slightly more advanced, as it will require you to actually write js code that functions
 * within the context of the game. How this works, is you will write a .js file (convert.js by is
 * the default expected name) and leave it at the top level of your patch - in the same directory as
 * folders like "img", "data", "js", etc.
 *   Within the file, you will put all of your code in one function. The function is called
 * "ModManager.convertSave"; it is heavily recommended that, out of consideration for other patches,
 * you alias this function, as opposed to overwrite.
 *   eg: "let my_patchname_save_convert = ModManager.convertSave;
 *        ModManager.convertSave = function() {
 *          {your code}
 *          my_patchname_save_convert.call(this);
 *        }
 *       "
 *   Note that when this function is run, the context of the save will effectively be loaded.
 * That means that all of $data and $game objects ($gameParty, $gameMap, $dataMap, $dataActors)
 * Will all be loaded - the $game objects will have the "old patch" data, since they are from
 * a save on the old patch, and the $data objects will be those of your patch.
 *   This is your chance to increment game variables as needed, initialize elements of objects
 * from scripts that you added, that normally would get initialized during game creation (new
 * game start).
 *
 *
 *
 * MOD CREATION BEST PRACTICES
 * ----------------------------------------
 *   1) The point of this modmanager is to avoid distribution of modified versions of paid or
 *    proprietary games. As such, if the base game assets were encrypted, and some of the
 *    modded assets you use are modified version of once-encrypted assets, you should encrypt
 *    your project before creating and distributing the patch. If you choose to encrypt, it
 *    MUST be done BEFORE the patch is created.
 *   2) If you are using any plugins that work with note tags (a lot of Yanfly plugins do this),
 *    or if this script causes a problem when you try to start a new game, it may be because many
 *    plugins do not expect the database files to be loaded more than once. Look for a function
 *    called DataManager.isDatabaseLoaded that they will often override, and in that funtion there
 *    will be a variable exclusive to their plugin; there will be an "if" condition that checks
 *    for the variable to not be true (!their_var) and in that conditional, that variable will
 *    be set to "true". Copy the variable name, and set it to false ("their_var = false;"), and
 *    add that line to the "MVMM_resetLatches" function below.
 *   3) It is possible that some assets will be excluded from your patch if they have bad or
 *    corrupted headers; it is recommended, to help avoid this, that you DO NOT tamper with
 *    Decrypter.SIGNATURE, Decrypter.VER, or Decrypter.REMAIN in rpg_core.js. If you get a lot
 *    of corrupted file headers or the differ is being stubborn about comparing encrypted assets,
 *    but you want it to let those assets through anyway, try changing ModManager._checkAssetHeaders
 *    to "false" (no quotes) below.
 *   4) It is heavily advised, that if you plan on modifying how the core codebase of RPG Maker
 *    MV works, you DO NOT modify any of the primary files. These are the files with "rpg" at
 *    the start of their name (in addition to "main.js"). Please only modify or add js files
 *    that are in the js folder.
 *
 *    The reason for that is: Often plugin files will modify or overwrite functions that appear
 *    in those core scripts. This ModManager, when creating a patch, will leave out any files
 *    that have not been changed. If you change a core script, then consider the following
 *    situation:
 *    The player starts the game. This loads up the core scripts. Then it loads it plugins, which
 *    will layer over the existing code, changing some functions from the core scripts. Then a player
 *    chooses to load a modded save file, or start a modded game. The game is forced to load the
 *    modded core file in as part of the modded instance, but in reality most functions in that
 *    file have not been modified. Those functions get reset when this core file is loaded again,
 *    overwriting any changes enacted by the plugins.
 *    This is less of a problem if you KNOW that any such core file modifications: will not change
 *    behavior affected by any plugin, or are in turn modified by additional modifications to the
 *    original game's plugin files. However, note that the mod manager does its best, when applying
 *    a patch, to scrub unchanged/redundant code from modified plugin files, doing its best to only
 *    keep modified functions.
 *   4.5) In fact, while much effort has gone into trying to make the use of modified scripts/plugins
 *    work smoothly, the best thing you can do to ensure that things work well, is to avoid, whenever
 *    possible (which should be always, although it may be less convenient) actually modifying scripts.
 *    It is always better to make a new plugin instead. If you would modify a plugin, just put the new
 *    plugin after the plugin you were going to modify in the load order.
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
 * - Decrypter.decryptHTML5Audio
 * - WebAudio.prototype._load
 * - WebAudio.prototype._onXhrLoad
 * - Decrypter.decryptImg
 * - Decrypter.decryptArrayBuffer
 *
 * --------- Save List Drawing -------------------------------------------------
 *   It is quite possibly modified by any script that affects the appearance of
 * the save menu, the save list in particular, which could result in a conflict
 * with the first listed overriden function. The second one is unlikely to be
 * the source of a conflict.
 *
 * - Window_SavefileList.prototype.drawPartyCharacters
 * - Scene_Load.prototype.onSavefileOk
 *
 */

/* THIS_IS_THE_LATCH_RESET */

function MVMM_resetLatches() {
    /* The following are examples of latches that other plugins might introduce that
     * you have to unlatch whenever you begin loading the database */
    /*
    Yanfly._loaded_YEP_EquipCore = false;
    Yanfly.YEP_X_AttachAugments = false;
    SRD.notetagsLoaded = false;
    Yanfly._loaded_YEP_AutoPassiveStates = false;
    Yanfly._loaded_YEP_BattleAICore = false;
    */
}

/* =============================================================================
 * ** WARNINGS **
 * =============================================================================
 * - The script parameter parser assumes that any parameter that utilizes "On"/"Off"
 *   keywords will map On to the Boolean value true and Off to the Boolean value false
 * - Due to have javascript works and how scripts and functions are loaded, if you ENTER
 *   a game, exit to menu, and turn off/disable a script, there is NO guarantee that the
 *   script will be fully deactivated in your current session - in fact, it is unlikely
 *   that it will not still have some lingering effects. Once you have entered into a game
 *   with an active script, you MUST restart the game to clear/disable the active script.
 * - Any behavior in scripts that depends on code that runs before plugins are loaded
 *   WILL NOT WORK in a mod installation/patched instance of the game.
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
ModManager._dependencies        = ["mv_mm.js", "window_textbox.js", 'Game.rpgproject'];
ModManager._listFileName        = "LIST.txt";
ModManager._baseGameText        = "|Base Game|";
ModManager._tempFolder          = "temp";
ModManager._installsFolder      = "installs";
ModManager._patchesFolder       = "patches";
ModManager._convertFilename     = "convert.js";
ModManager._gameLoaded          = false;
ModManager._scripts             = []; //Remembers patch-specific js sources we've
ModManager._pluginsLoaded       = {}; //Remembers which patches we've already loaded the requisite sources for
ModManager._encryptionList      = {}; //Builds a map of modded assets to the proper encryption key to use
ModManager._encryptionListFile  = 'decryptMap.xx' //arbitrary file extension
ModManager._hasVarReplaced      = true;
ModManager._checkAssetHeaders   = true;

ModManager.set = function(patchname) {
    this._currPatch = patchname;
}

ModManager.convertSave = function() {
    /* EMPTY */
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
        //fs.mkdirSync(path.join(this._path, this._tempFolder, 'data'),  { recursive: true });
        //Copy in base-game info
        //this.deepCopy(path.join(path.dirname(process.mainModule.filename), 'data'));
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
    ModManager.finalScriptPass(outname);
    //should never get here with an outname folder that already exists
    fs.mkdirSync(path.join(this._path, this._installsFolder,outname),  { recursive: true });
    this.deepCopy(path.join(this._path, this._tempFolder), path.join(this._path, this._installsFolder,outname));
};

ModManager.deepCopy = function(input, output) {
    output = output || path.join(this._path, 'temp', 'data');

    function copyRecurse(input, output) {
        let items = fs.readdirSync(input);
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
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
        //Patch System.json to see if the modded files change whether images/audio have been encrypted, or changed what the key is
        let baseSystem = JSON.parse(fs.readFileSync(path.join('data','System.json'), {encoding: 'utf8'}));
        let modSystem = JSON.parse(decodeURIComponent(fs.readFileSync(systemDataFile, {encoding: 'utf8'})));
        this.patchObj(baseSystem, modSystem);
        //A little misleading - after patchObj, baseSystem represents the patched dataSystem object
        currentEncryptionKey = baseSystem['encryptionKey'] ? baseSystem['encryptionKey'].split(/(.{2})/).filter(Boolean) : null;
        var currentImEncryptionKey = baseSystem['hasEncryptedImages'] ? currentEncryptionKey : null;
        var currentAudioEncryptionKey = baseSystem['hasEncryptedAudio'] ? currentEncryptionKey : null;
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
    url = url.replace(/\\/g, '/');
    url = url.replace('.rpgmvo', '.ogg');
    url = url.replace('.rpgmvm', '.m4a');
    url = url.replace('.rpgmvp', '.png');
    this._encryptionList[url] = keys[0];
}
ModManager.addAudioToEncryptList = function(url, patchName, keys) {
    url = url.replace(/\\/g, '/');
    url = url.replace('.rpgmvo', '.ogg');
    url = url.replace('.rpgmvm', '.m4a');
    url = url.replace('.rpgmvp', '.png');
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
    /* Technically this is encoded in a way that's different from how it
     * would work in-game */
    this._encryptionList = {};
}

ModManager.loadEncryptionList = function(patchName) {
    if (!patchName) return {};
    const listFile = path.join(this._path, this._installsFolder, patchName, this._encryptionListFile);
    if (!fs.existsSync(listFile)) {
        return {};
    }
    const encryptionList = JSON.parse(fs.readFileSync(listFile, {encoding: 'utf8'}));
    return encryptionList;
}

//TODO: check if any of this works
/* This frees up old code/space that was relevant to a different patch of the game,
 * whenever the player changes patches (via starting a new game or loading a save) */
ModManager.changeSourceCode = function(oldver, newver) {
    if (newver == oldver) {
        return;
    }
    for (let i = 0; i < document.body.length; i++) {
        let script = document.body[i];
        if (script.src.search(path.join(this._installsFolder, oldver, 'js')) >= 0) {
            delete document.body[i];
            document.body.splice(i, 1);
        }
    }
}


ModManager.loadScript = function(url) {
    let script = document.createElement('script');
    try {
        script.type = 'text/javascript';
        script.src = url;
        script.async = false;
        script._url = url;
        document.body.appendChild(script);
    } catch (error) {
        console.log(error);
    }
    this._scripts.push([script, url]);
    return script;
}

ModManager.loadedScript = function(url) {
    for (let i = 0; i < this._scripts.length; i++) {
        if (url == this._scripts[i][1]) {
            return true;
        }
    }
    return false;
}

ModManager.pluginSetup = function(plugins) {
    let plugPath = path.join(this._path, this._installsFolder, DataManager._version, 'js', 'plugins'); 

    plugins.forEach(function(plugin) {
        if (plugin.status) {
            let name = plugin.name+'.js';
            name = path.join(plugPath, name);
            if (fs.existsSync(name) && !this.loadedScript(name)) {
                PluginManager.setParameters(name, plugin.parameters);
                this.loadScript(name);
            }
        }
    }, this);
};

ModManager.loadPlugins = function(prevVer) {
    if (prevVer == DataManager._version) return;
    if (this._pluginsLoaded[DataManager._version]) return;

    let newScripts = path.join(this._path, this._installsFolder, DataManager._version, "js");
    if (DataManager._version && DataManager._version != "") {
        if (fs.existsSync(newScripts) && fs.lstatSync(newScripts).isDirectory()) {
            let scriptfiles = fs.readdirSync(newScripts);
            for (let i = 0; i < scriptfiles.length; i++) {
                if (scriptfiles[i].match(/\.js$/) && scriptfiles[i] != "plugins.js") {
                    let url = path.join(newScripts, scriptfiles[i]);
                    ModManager.loadScript(url);
                }
            }
        }  
    }

    /* Don't load plugins multiple times */
    const pluginPath = path.join(newScripts, "plugins.js");
    if (fs.existsSync(pluginPath)) {
        let file = fs.readFileSync(pluginPath,{encoding: 'utf8'});
        let pluginVarFind = /(?:var|let|const)(?:\s+)\$plugins(?:\s+)=/;
        let plugs;
        file.replace(pluginVarFind, function(match, offset, string) {
            let i = offset;
            while (string[i] != '[') {
                i += 1;
            }
            let j = i+1;
            let bracketCount = 1;
            while (bracketCount > 0) {
                if (string[j] == '[') {
                    bracketCount += 1;
                } else if (string[j] == ']') {
                    bracketCount -= 1;
                }
                j += 1;
            }
            plugs = JSON.parse(string.slice(i, j));
            return "";
        })

        this.pluginSetup(plugs);
    }

    this._pluginsLoaded[DataManager._version] = true;
}

ModManager._applyPatch = function(name) {
    let currentEncryptionKeys = this._currentEncryptionKeys(name);

    let self = this;
    //Patch relevant files, copy over new or modified images
    let filePatchRecurse = function(parentPath="") {
        var files = [];
        //path to base files/temp directory
        const tempSrc = path.join(this._path, this._tempFolder, parentPath);
        //path to diffs and mod assets from patch
        const curr = path.join(this._path,this._patchesFolder, name, parentPath);

        //NOTE: it was decided that if something appears in the source
        // but not the modded install, that it was not worthwhile to
        // include mechanisms to signal to actively delete those files
        // when the patch is applied.
        if (fs.existsSync(curr)) {
            files = fs.readdirSync(curr);
            files.forEach(function(file, index) {
                if (fs.existsSync(path.join(parentPath, file)) && fs.lstatSync(path.join(parentPath, file)).isDirectory()) {
                    filePatchRecurse(path.join(parentPath, file));
                } else {
                    const targetFile = path.join(tempSrc, file);
                    const baseFile = path.join(/*path.dirname(process.mainModule.filename),*/ parentPath, file);
                    const patchFile = path.join(curr, file);

                    //If the source/base install has a corresponding file, treat it as a patch
                    if (fs.existsSync(baseFile)) {
                        AutoDiff.createReqDirectories(targetFile);
                        //JSON data files have their own diff format
                        if (file.match(/\.json$/i)) {
                            if (!this.patchJSON(targetFile, baseFile, patchFile)) {
                                /* If patching fails (improperly formatted), it likely means
                                 * that multiple patches tried to add a file named patchFile that did
                                 * not exist originally, so we copy over the one from the latest patch
                                 * to be applied */

                                fs.writeFileSync(targetFile, fs.readFileSync(patchFile));
                            }

                        //Copy new image/audio/asset over
                        } else if (file.match(/\.(png|mp4|ogg|rpgmvp|rpgmvo|rpgmvm)$/i)) {
                            fs.writeFileSync(targetFile, fs.readFileSync(patchFile));
                            //Map changed assets to different encryption keys; ("no encryption key" may be
                            //  a "new" encryption key; thus we do this even if the extension claims the file
                            //  is not encrypted)
                            if (file.match(/\.(png|rpgmvp)$/i)) {
                                this.addImageToEncryptList(path.join(parentPath, file), name, currentEncryptionKeys);
                            } else if (file.match(/\.(ogg|rpgmvo)$/i)) {
                                this.addAudioToEncryptList(path.join(parentPath, file), name, currentEncryptionKeys);
                            }

                        //Pure-text files use line-based diffing/patching
                        } else if (file.match(/\.(txt|csv)$/i) || file.match(/\.js$/i)) {
                            if (file == this._convertFilename) {
                                /* We expect different patches to all come with a conversion file that
                                 * provides a save conversion function override; we do not want to patch
                                 * one to look like another, we want to add/compile the logic of all of them,
                                 * so we append the overrides together subsequently in one file. */
                                this.appendContents(targetFile, baseFile, patchFile);
                            } else {
                                if (!this.patchText(targetFile, baseFile, patchFile)) {
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
                        AutoDiff.createReqDirectories(targetFile);
                        if (patchFile.match(/\.js$/i)) {
                            var fileText = fs.readFileSync(patchFile, {encoding: 'utf8'});
                            /* In theory, this var pass safety measure should be redundant */
                            fileText = this.textVarPass(fileText);
                            fileText = this.applyFunctionSafeties(fileText);
                            fs.writeFileSync(targetFile, fileText, {encoding: 'utf8'});
                        } else {
                            fs.writeFileSync(targetFile, fs.readFileSync(patchFile));
                        }
                        //Map changed assets to different encryption keys; ("no encryption key" may be
                        //  a "new" encryption key; thus we do this even if the extension claims the file
                        //  is not encrypted)
                        if (file.match(/\.(png|rpgmvp)$/i)) {
                            this.addImageToEncryptList(path.join(parentPath, file), name, currentEncryptionKeys);
                        } else if (file.match(/\.(ogg|rpgmvo)$/i)) {
                            this.addAudioToEncryptList(path.join(parentPath, file), name, currentEncryptionKeys);
                        }
                    }
                }
            }.bind(this));
        }
    }.bind(self);
    //Perform diff from roots
    filePatchRecurse();

    //Build encryption key list
};

/* Returns false if it fails to patch (patchFile not formatted correctly), true otherwise */
ModManager.patchText = function(targetFile, sourceFile, patchFile) {
    let source = fs.readFileSync(sourceFile, {encoding: 'utf8'}).split(/[\r\n]+/);

    try {
        const patchDiff = JSON.parse(fs.readFileSync(patchFile, {encoding: 'utf8'}));
        //Patch the list of lines
        //For JS files, we have to do some prep work for function guards/sanitization.
        //  We want to avoid doing that level of work for unnecessary files.
        if (sourceFile.match(/\.js$/i)) {
            if (!this.patchLineJs(source, patchDiff)) {
                return false;
            }
        } else {
            if (!this.patchLine(source, patchDiff)) {
                return false;
            }
        }
    } catch (except) {
        return false;
    }
    let fileText = source.join('\n');
    /* This is a whole mess - read the comment around the
     * applyFunctionSafeties function definition to better
     * understand why this is here. */
    if (sourceFile.match(/\.js$/i)) {
        /* In theory, this var pass protection is redundant */
        fileText = this.textVarPass(fileText);
        fileText = this.applyFunctionSafeties(fileText);
    }
    //Overwrite file with patched contents
    fs.writeFileSync(targetFile, fileText, {encoding: 'utf8'})
    return true;
}

ModManager.finalScriptPass = function(installName) {
    let self = this;
    let jsReplaceRecurse = function(parentPath="") {
        var files = [];
        //path to base files/temp directory

        if (fs.existsSync(parentPath)) {
            files = fs.readdirSync(parentPath);
            files.forEach(function(file, index) {
                if (fs.existsSync(path.join(parentPath, file)) && fs.lstatSync(path.join(parentPath, file)).isDirectory()) {
                    jsReplaceRecurse(path.join(parentPath, file));
                } else {
                    if (file.match(/\.js$/i)) {
                        var fileText = fs.readFileSync(path.join(parentPath, file), {encoding: 'utf8'});
                        fileText = fileText.replace(/DataManager._version == <replaceText>/g, "DataManager._version == "+JSON.stringify(installName));
                        fs.writeFileSync(path.join(parentPath, file), fileText, {encoding: 'utf8'});
                    }
                }
            }.bind(this));
        }
    }.bind(self);
    //Perform diff from roots
    jsReplaceRecurse(path.join(this._path, this._tempFolder));
}

ModManager.fileVarPass = function(file) {
    var fileText = fs.readFileSync(file, {encoding: 'utf8'});
    fileText = this.textVarPass(fileText);
    fs.writeFileSync(file, fileText, {encoding: 'utf8'});
}

//Replaces top-level instances of "let" and "const" declarations
//  with "var"
ModManager.textVarPass = function(fileText) {
    const maxLen = fileText.length;
    let openParenCount = 0;
    let toReplace = ["let", "const"];
    let replaceWith = "var";

    let i = 0;

    function isValidVarnameChar(char) {
        if (char >= '0' && char <= '9') {
            return true;
        } else if (char >= 'a' && char <= 'z') {
            return true;
        } else if (char >= 'A' && char <= 'Z') {
            return true;
        } else if (char == '_' || char == '$') {
            return true;
        }
        return false;
    }

    function checkForWord(index, word) {
        /* Have to check that the bad keyword is a keyword and not a substring
         * of a variable/function name. May catch a commented word, but it's not
         * worth coding it to avoid those. */
        /* EXCEPTION: very first spot in the file - index == 0 */

        let k = 0;
        if (index > 0) {
            if (isValidVarnameChar(fileText[index])) {
                return false;
            }
            index++;
        }
        while (k < word.length) {
            /* If we ran into the end before finishing the word */
            if (index+k >= maxLen) {
                return false;
            }
            if (fileText[index+k] != word[k]) {
                return false;
            }
            k++;
        }
        /* We don't have to check if the match is snug with the end of the file (== case),
         * because that would be a syntax error, if the file ended with a declaration
         * keyword. */
        if (maxLen > index+k) {
            if (isValidVarnameChar(fileText[index+k])) {
                return false;
            }
        }
        return true;
    }

    function replaceWords() {
        for (let k = 0; k < toReplace.length; k++) {
            let word = toReplace[k];
            if (checkForWord(i, word)) {
                let space = (i == 0) ? 0 : 1;
                /* Due to how we try to match - 'space' represents whether we are matching from the start
                 * of the file, or if we are matching from a "sandwich" of characters around the word we're
                 * trying to replace */
                fileText = fileText.slice(0, i+space) + replaceWith + fileText.slice(i+space+word.length);
                return;
            }
        }
    }

    //We only care about the top (global) level
    for (i = 1; i < fileText.length; i++) {
        if (fileText[i] == '(' || fileText[i] == '{') {
            openParenCount += 1;
        } else if (fileText[i] == ')' || fileText[i] == '}') {
            openParenCount -= 1;
        }
        if (openParenCount == 0) {
            replaceWords();
        }
    }

    return fileText;
}

//The reason for this is that we will probably be adding modified versions of plugins,
//  but the modified version will still possibly have some declarations in common with
//  the original. So when a patch is loaded, if the declaration used "const" or "let",
//  the game will detect a "redeclaration" and crash. Not so if we convert these
//  declarations to var, then it will allow it.
ModManager.projectVarPass = function() {
    let self = this;
    let varReplaceRecurse = function(parentPath="") {
        var files = [];
        //path to base files/temp directory

        if (fs.existsSync(parentPath)) {
            files = fs.readdirSync(parentPath);
            files.forEach(function(file, index) {
                if (fs.existsSync(path.join(parentPath, file)) && fs.lstatSync(path.join(parentPath, file)).isDirectory()) {
                    varReplaceRecurse(path.join(parentPath, file));
                } else {
                    if (file.match(/\.js$/i)) {
                        this.fileVarPass(file);
                    }
                }
            }.bind(this));
        }
    }.bind(self);

    //Perform diff on this project
    varReplaceRecurse(path.dirname(process.mainModule.filename));

    //Before we create a diff/patch, convert global let and const symbols in the base repository,
    //  as in practice the patch will also be applied onto a var-converted version of the game.
    if (fs.existsSync(this._base)) {
        varReplaceRecurse(this._base);
    }
}

ModManager.appendContents = function(tempFile, sourceFile, newFile) {
    let source;
    let patch = fs.readFileSync(newFile, {encoding: 'utf8'});
    if (!fs.existsSync(tempFile)) {
        if (!fs.existsSync(sourceFile)) {
            source = patch;
        } else {
            source = fs.readFileSync(sourceFile, {encoding: 'utf8'});
        }
    } else {
        source = fs.readFileSync(tempFile, {encoding: 'utf8'});
    }
    if (patchFile.match(/\.js$/i)) {
        source = this.textVarPass(source);
        patch = this.textVarPass(patch);
        /* NOTE - may want to applyFunctionSafeties in general,
         * but for now this append function is only used for
         * the save conversion script, where the function safeties
         * would be unhelpful
         */
    }
    if (!fs.existsSync(tempFile)) {
        fs.writeFileSync(tempFile, source);
    }
    fs.appendFileSync(tempFile, patch);
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
    for (let i = 0; i < patchDiff.length; i++) {
        let lineSpec = patchDiff[i];
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

ModManager.patchLineJs = function(source, patchDiff) {
    if (!Array.isArray(patchDiff) || patchDiff.length == 0 || !Array.isArray(patchDiff[0])) {
        return false;
    }

    this._modifiedLines = [];
    let deleteIndices = [];
    let addIndices = [];

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
    for (let i = 0; i < patchDiff.length; i++) {
        let lineSpec = patchDiff[i];
        //Deletions all come before all additions, due to
        //  the sort. So we can delete lines based on index in original list
        //  Sort also guarantees we delete highest-index entries first, so
        //  deleting in order does not change the index of the next line to
        //  be deleted.
        if (lineSpec[0] == '-') {
            source.splice(lineSpec[1],1);
            //Make note of the current-patched-file line number where a delete occurs;
            //  Because we work in reverse-order, subsequent deletes will cause previously
            //  noted indices to need to be decremented
            deleteIndices.forEach(function(deleteIndex, j, dI) { dI[j] = dI[j] - 1; } )
            deleteIndices.push(lineSpec[1]);
        }
        //Now we're ready to do all additions, and they
        //  are sorted in ascending order. The line numbers attached to
        //  additions are the line number of the line in in the modded
        //  file that the patch is based on (which already has the deleted
        //  lines deleted); if we insert them in ascending order, they simply
        //  each get placed where they expect to be.
        if (lineSpec[0] == '+') {
            source.splice(lineSpec[1],0,lineSpec[2]);
            //Make note of the patched-file line number where an add occurs;
            //  increment any noted delete indices that happen after the add, to reflect
            //  the corresponding index inour current patched file
            addIndices.push(lineSpec[1]);
            deleteIndices.forEach(function(deleteIndex, j, dI) { if (dI[j] > lineSpec[1]) { dI[j] = dI[j] + 1; } })
        }
    }

    const modified = ((deleteIndices.concat(addIndices)).sort());
    let stringIndex = 0;
    for (let i = 0; i < source.length; i++) {
        let line = source[i];
        if (modified.indexOf(i) >= 0) {
            this._modifiedLines.push([stringIndex, stringIndex+line.length]);
        }
        stringIndex += line.length + 1; //have to add 1 for the newlines that were removed by split
    }
    return true;
}

ModManager.patchJSON = function(targetFile, sourceFile, patchFile) {
    try {
        let source = JSON.parse(fs.readFileSync(sourceFile, {encoding: 'utf8'}));
        const patchDiff = JSON.parse((fs.readFileSync(patchFile, {encoding: 'utf8'})));

        //Patch the JSON
        if (!this.patchObj(source, patchDiff)) {
            return false;
        }
        //Overwrite file with patched contents
        fs.writeFileSync(targetFile, JSON.stringify(source), {encoding: 'utf8'});
        return true;
    } catch (except) {
        //console.log(except);
        return false;
    }
}

ModManager.patchObj = function(source, patchDiff) {
    let source_list = AutoDiff.buildJsonList(source);
    if (!this.patchLine(source_list, patchDiff)) {
        return false;
    }
    //Make sure that the input JSON object ends up as a patched JSON object by the end;
    // We want this to be an in-place patch function
    Object.assign(source, JSON.parse(source_list.join(' ')));
    return true;
};

ModManager._getJSON = function(dir, dest) {
    if (!fs.existsSync(path.join(dir, dest))) return {};
    return JSON.parse(fs.readFileSync(path.join(dir, dest)),'utf8');
};


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
    if (fs.existsSync(ModManager._path)) {
        this._commandWindow.setHandler('mod',  this.commandModManage.bind(this));
        ModManager.clearPatch();
    }
}

var _alias_modmanage_startNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function(install) {
    if (fs.existsSync(ModManager._path) &&
        fs.existsSync(path.join(ModManager._path, ModManager._installsFolder)) &&
        ((fs.readdirSync(path.join(ModManager._path, ModManager._installsFolder))).length) > 0) {
        this._commandWindow.close();
        SceneManager.push(Scene_StartGame);
    } else {
        _alias_modmanage_startNewGame.call(this);
    }
};

Scene_Title.prototype.commandModManage = function() {
    this._commandWindow.close();
    SceneManager.push(Scene_ModManage);
}

//-----------------------------------------------------------------------------

/* Receives a js file as a string, and modifies it as follows:
 * Removes redundant (unchanged) function definitions
 * For function overwrites or new functions, it aliases the function if relevant and wraps the function body,
 *   placing the entire function definition under the constraint "if (DataManager._version == patchname) {"
 *   and, if the js file is overwriting a function, puts in an "else" that calls the original (aliased) function
 * Note: this function is already very heavy in terms of processing. To keep it reasonable, we delete
 *   redundant function definitions based on what functions are already present in the running instance.
 *   This may seem somewhat unnerving, as anything that is loaded at any point by RPG Maker will remain
 *   until the process terminates. Thus, in theory, if you load into some modded instances and the game
 *   loads some functions unique to that mod, and then try to apply a patch, it could change the behavior
 *   of this function. In practice, though, you can convince yourself that this will never result in a
 *   problematic difference. Since those new functions will have the special "if" wrapper inserted into
 *   their body, it is very unlikely that the function body will match the one in the patch. And if it does -
 *   well, since patches must have different names, the "if" condition would never have triggered anyway in
 *   the patch that is being made/the latter patch, so the loss is trivial.
 */
ModManager.applyFunctionSafeties = function(file, patchname) {

    /* NOTE: This function assumes all scripts are well-formed, it has no safeguards
     * that will prevent it from running past the end of the string. It also assumes
     * that, for the most part, functions are declared in the standard syntax used
     * by the base RPG Maker MV library. */

     /* topline - the line that declares/sets the function, up until the first opening curly bracket
      * bodyText - the text of the function definition
      * hasElse - whether we should add an "else" to the sanitizing wrapper to invoke the normal version
      *    of the function
      * funName - name of the function, used to create an intuitive alias variable
      * args - all text, including commas etc, between (not including) the parentheses for the functions
      *    parameters/arguments */
    const self = this;

    function wrapScriptBody(topline, bodyText, hasElse, funName, args) {
        const aliasName = "MVM_script_alias_"+funName.replace(/\./g, '_');
        let preface = "";
        /* Split up so that this section does not become a target of the regex replace later, just in case */
        let if_add = "if (DataManager._version" + " == " + "<replaceText>) {";
        let if_close = "}";
        if (hasElse) {
            preface = "var "+aliasName+" = "+funName+";";
            if_close += " else { "+aliasName+".call(this"+((args == "") ? "" : (", "+args))+"); }\n";
        }
        return (preface+topline+if_add+bodyText+if_close+"}\n")
    }

    let toDelete = [];
    /* lowIndex is included in the deleted section, highIndex is not */
    function deleteMidsection() {
        /* order by start of match - which function definition appeared first */
        toDelete.sort(function(a, b) { return a[0] - b[0] });
        /* skip any matches that are inside the scope of a previously discovered function */
        let v = 0;
        while (v < toDelete.length-1) {
            let offset = toDelete[v+1][0];
            if (toDelete[v][0] <= offset && offset <= toDelete[v][1]) {
                toDelete.splice(v+1, 1);
            } else {
                v++;
            }
        }
        for (let v = toDelete.length-1; v >= 0; v--) {
            file = file.slice(0, toDelete[v][0])+toDelete[v][2]+file.slice(toDelete[v][1]+1);
        }
        toDelete = [];
    }

    /* reduce all spaces for consistency, to make comparisons 
     *   against base function bodies more reliable (ie, normalize
     *   space characters) */
    file = file.replace(/(?:[\t ])+/g, ' ');
    file = file.replace(/(?:[\n\r])+/g, '\n');
    /* delete comments to save space as well */
    /* Have to delete the multi-line style first; if we delete a line
     *   that starts a multi-line comment start or end that happens to
     *   have a '//', it will mess things out. The reverse, meanwhile,
     *   cannot be problematic. */
    file = file.replace(/\/\*(.?\s?)*?\*\//g, '');
    file = file.replace(/\/\/(.*)/g, '');

    /* eg: function DataManager() { ... } */
    const define = /(?:\s)*function(?:\s)*(?<funName>[a-zA-Z0-9_\$].*?)(?:\s)*\(/g;
    file.replace(define, function(match, funName, offset, string) {
        let i;
        let topline = match;

        /* See if the function is already defined */
        let objPath = funName.split('.');
        let nav = window;
        for (i = 0; (i < objPath.length) && (nav != null); i++) {
            nav = nav[objPath[i]];
        }

        /* build args list */
        args = "";
        let parenOpenCount = 1;
        /* index after the parenthesis that opens the argument list */
        i = offset+match.length;
        while (parenOpenCount > 0) {
            args += string[i];
            if (string[i] == ')') {
                parenOpenCount -= 1;
            } else if (string[i] == '(') {
                parenOpenCount += 1;
            } i += 1;
        }

        topline += args;
        while (string[i] != '{') {
            if (string[i] != '\n') { topline += string[i] };
            i += 1;
        }
        topline += '{';
        i += 1;

        /* i = index after the curly bracket that opens the function body */
        let bodyText = "";
        parenOpenCount = 1;
        while (parenOpenCount > 0) {
            bodyText += string[i];
            if (string[i] == '}') {
                parenOpenCount -= 1;
            } else if (string[i] == '{') {
                parenOpenCount += 1;
            } i += 1;
        }
        
        /* Note: at this point, i is the index of the curly brace that closes the function */

        /* The function has been defined; we must:
         *  1) Wrap it, with else, because it changes an existing function that
         *    we only want to be changed while the patched instance is active
         *  2) Delete it, because it doesn't chane anything and is redundant 
         * Else, if it has not been defined:
         *  3) Wrap it, without else, because it's a new function exclusive to
         *    the new patch instance, just in case*/
        bodyText = bodyText.slice(0,-1);
        if (nav && typeof nav === 'function') {
            let wasModified = false;
            self._modifiedLines.forEach(function(range) {
                const low = range[0]; const high = range[1];
                if ((offset <= low && low < i) || (offset < high && high <= i)) {
                    wasModified = true;
                }
            } )
            if (wasModified) {
                /* the function is a changed version; alias it to only use the altered logic while
                 * the relevant patch is active. */
                toDelete.push([offset, i, wrapScriptBody(topline, bodyText, true, funName, args)]);
            } else {
                /* delete the redundant function */
                toDelete.push([offset, i, ""]);
            }
        } else {
            /* the function is new to this script file, and therefore cannot be aliased */
            toDelete.push([offset, i, wrapScriptBody(topline, bodyText, false, funName, args)]);
        }

        /* Otherwise no replacement */
        return match;
    });
    //deleteMidsection();

    /* eg: function DataManager.loadDatafile = function(file) { ... } */
    /* eg: function DataManager.loadDatafile = (file) => { ... } */
    const assignment = /(?:\s)*(?:let|const|var)?(?:\s)*(?<varName>[a-zA-Z0-9_\$].*?)(?::)?(?:\s)*=(?:\s)*(?:function(?:\s)*\((?<argsCase1>.*?(?:,(?:\s)*?(?:.*?))*?)\)(?:\s)*\{|\(?(?<argsCase2>.*?(?:,(?:\s)*?(?:.*?))*?)\)?(?:\s)*=>(?:\s)*\{)/g;
    file.replace(assignment, function(match, varName, argsCase1, argsCase2, offset, string) {
        let args = argsCase1 || argsCase2 || "";
        let i;
        let topline = match;

        /* See if the function is already defined */
        let objPath = varName.split('.');
        let nav = window;
        for (i = 0; (i < objPath.length) && (nav != null); i++) {
            nav = nav[objPath[i]];
        }

        /* i = index of the curly bracket that opens the function body */
        i = offset+match.length;

        let bodyText = "";
        let parenOpenCount = 1;
        while (parenOpenCount > 0) {
            bodyText += string[i];
            if (string[i] == '}') {
                parenOpenCount -= 1;
            } else if (string[i] == '{') {
                parenOpenCount += 1;
            } i += 1;
        }
        
        /* Note: at this point, i is the index after the curly brace that closes the function */

        /* The function has been defined; we must:
         *  1) Wrap it, with else, because it changes an existing function that
         *    we only want to be changed while the patched instance is active
         *  2) Delete it, because it doesn't chane anything and is redundant 
         * Else, if it has not been defined:
         *  3) Wrap it, without else, because it's a new function exclusive to
         *    the new patch instance, just in case*/
        bodyText = bodyText.slice(0,-1)
        if (nav && typeof nav === 'function') {
            let wasModified = false;
            self._modifiedLines.forEach(function(range) {
                const low = range[0]; const high = range[1];
                if ((offset <= low && low < i) || (offset < high && high <= i)) {
                    wasModified = true;
                }
            } )
            if (wasModified) {
                /* the function is a changed version; alias it to only use the altered logic while
                 * the relevant patch is active. */
                toDelete.push([offset, i, wrapScriptBody(topline, bodyText, true, varName, args)]);
            } else {
                /* delete the redundant function */
                toDelete.push([offset, i, ""]);
            }
        } else {
            /* the function is new to this script file, and therefore cannot be aliased */
            toDelete.push([offset, i, wrapScriptBody(topline, bodyText, false, varName, args)]);
        }

        /* Otherwise no replacement */
        return match;
    });
    //deleteMidsection();

    /* eg: Object.defineProperty(Bitmap.prototype, 'paintOpacity', {
     *          get: function() {
     */
    const objproperty = /(?:Object\.defineProperty(?:\s)*\()(?:\s)*(?<objName>[a-zA-Z0-9_\$].*?)(?:\s)*,(?:\s)*(?:'(?<property1>[a-zA-Z0-9_\$].*?)'|"(?<property2>[a-zA-Z0-9_\$].*?)")(?:\s)*,(?:\s)*\{/g;
    file.replace(objproperty, function(match, objName, property1, property2, offset, string) {
        let property = property1 || property2 || "";

        /* See if the function is already defined */
        let objPath = objName.split('.');
        let nav = window;
        for (let i = 0; (i < objPath.length) && (nav != null); i++) {
            nav = nav[objPath[i]];
        }

        /* i = index of the curly bracket that opens the function body */
        i = offset+match.length;

        let bodyText = "";
        let parenOpenCount = 1;
        while (parenOpenCount > 0) {
            bodyText += string[i];
            if (string[i] == '}') {
                parenOpenCount -= 1;
            } else if (string[i] == '{') {
                parenOpenCount += 1;
            }
            i += 1;
        }

        /* Other attributes/Symbols that can be defined with defineProperty:
         * - value: value associated with the property (Number, Object, Functin, etc)
         * - writable: if the value associated with the property may be changed with an assignment operator (default: false)
         * - enumerable" whether this property appears during enumeration over the object's properties (default: false)
         * - configurable: whether this property descriptor may be changed/deleted from the object (defaults; false)
         * As you can see, none of them are functions - which makes them hard to meaningfully "alias". Thankfully,
         * the changes that this will cause a problem are very slim.
         */
        let preface = "";
        let hasGetter = !!(nav.__lookupGetter__(property));
        let hasSetter = !!(nav.__lookupSetter__(property));

        const getAlias = "MVM_property_getter_alias_"+objName.replace(/\./g, '_')+"_"+property;
        const setAlias = "MVM_property_setter_alias_"+objName.replace(/\./g, '_')+"_"+property;
        let toReplace = "";
        let replaceText = "";

        bodyText.replace(/(?:\s)*(?:get|'get'|"get")(?:\s)*:(?:\s)*function\(\)(?:\s)*\{/, function(m, o, g) {
            /* m for match, o for offset, g for "whole getter string" */

            if (hasGetter) {
                preface += "var "+getAlias+" = "+objName+".__lookupGetter__('"+property+"');\n";
            }

            let j = o+m.length;
            let bt = "";
            parenOpenCount = 1;
            while (parenOpenCount > 0) {
                bt += g[j];
                if (g[j] == '}') {
                    parenOpenCount -= 1;
                } else if (g[j] == '{') {
                    parenOpenCount += 1;
                }
                j += 1;
            }
            /* Note body text includes its surrounding { } brackets */
            
            replaceText = "get: function() {\n";
            replaceText += "if (DataManager._version == <replaceText>) {";
            replaceText += bt +"\n"; //includes its own curly braces
            if (hasGetter) {
                replaceText += " else { return "+getAlias+".call(this) }\n";
            }
            replaceText += "}\n"; //close function

            toReplace = m+bt;
            return m;
        })
        bodyText = bodyText.replace(toReplace, replaceText);
  
        bodyText.replace(/(?:\s)*(?:set|'set'|"set")(?:\s)*:(?:\s)+function\((?<argument>(?:[a-zA-Z0-9_\$].*?))\)(?:\s)*\{/, function(m, argument, o, s) {
            /* m for match, o for offset, s for "whole setter string" */

            if (hasSetter) {
                preface += "var "+setAlias+" = "+objName+".__lookupSetter__('"+property+"');\n";
            }

            let j = o+m.length;
            let bt = "";
            parenOpenCount = 1;
            while (parenOpenCount > 0) {
                bt += s[j];
                if (s[j] == '}') {
                    parenOpenCount -= 1;
                } else if (s[j] == '{') {
                    parenOpenCount += 1;
                }
                j += 1;
            }
            /* Note body text includes its surrounding { } brackets */

            replaceText = "set: function(" + argument + ") {\n";
            replaceText += "if (DataManager._version == <replaceText>) {"
            replaceText += bt +"\n"; //includes its own curly braces
            if (hasSetter) {
                replaceText += " else { return "+setAlias+".call(this, " + argument + ") }\n"
            }
            replaceText += "}\n"; //close function

            toReplace = m+bt;
            return m;
        })
        bodyText = bodyText.replace(toReplace, replaceText);

        let final = "";
        final = final + preface + "\n" + match;
        final = final + bodyText;
        final = final + ")\n;";

        i = offset+("Object.defineProperty(".length);
        parenOpenCount = 1;
        while (parenOpenCount > 0) {
            if (string[i] == ')') {
                parenOpenCount -= 1;
            } else if (string[i] == '(') {
                parenOpenCount += 1;
            }
            i += 1;
        }

        toDelete.push([offset, i+1, final]);
        return match;
    });
    //deleteMidsection();

    /* eg: Object.defineProperties(Bitmap.prototype, {
     *        prop1: {S
     *          get: function() {
     */
    const objproperties = /(?:Object\.defineProperties(?:\s)*\()(?:\s)*(?<objName>[a-zA-Z0-9_\$].*?)(?:\s)*,(?:\s)*\{/g;
    file.replace(objproperties, function(match, objName, offset, string) {
        /* See if the function is already defined */
        let objPath = objName.split('.');
        let nav = window;
        for (let i = 0; (i < objPath.length) && (nav != null); i++) {
            nav = nav[objPath[i]];
        }

        /* i = index of the curly bracket that opens the function body */
        i = offset+match.length;

        let bodyText = "";
        let parenOpenCount = 1;
        while (parenOpenCount > 0) {
            bodyText += string[i];
            if (string[i] == '}') {
                parenOpenCount -= 1;
            } else if (string[i] == '{') {
                parenOpenCount += 1;
            }
            i += 1;
        }

        let finalObjText = [];
        let preface = ""

        /* We use this convoluted loop process because the possibility that
         * regex matches something in a function body is too nontrivial. We only
         * want to match with top-level properties; thus, 
         */
        let matched = true;
        while (matched) {
            matched = false;
            let _toAxe = "";
            bodyText.replace(/(?:(?<property1>[a-zA-Z0-9_\$].*?)|'(?<property2>[a-zA-Z0-9_\$].*?)'|"(?<property3>[a-zA-Z0-9_\$].*?)")(?:\s)*:(?:\s)+\{/,
                function(_match, property1, property2, property3, _offset, _string) {
                    matched = true;

                    let property = property1 || property2 || property3 || "";

                    let hasGetter = !!(nav.__lookupGetter__(property));
                    let hasSetter = !!(nav.__lookupSetter__(property));

                    const getAlias = "MVM_property_getter_alias_"+objName.replace(/\./g, '_')+"_"+property;
                    const setAlias = "MVM_property_setter_alias_"+objName.replace(/\./g, '_')+"_"+property;
                    let toReplace = "";
                    let replaceText = "";

                    let _bodyText = "";
                    let k = _offset+_match.length;
                    parenOpenCount = 1;
                    while (parenOpenCount > 0) {
                        _bodyText += _string[k];
                        if (_string[k] == '}') {
                            parenOpenCount -= 1;
                        } else if (_string[k] == '{') {
                            parenOpenCount += 1;
                        }
                        k += 1;
                    }

                    _toAxe = _match+_bodyText;

                    /* _bodyText is the body text of the particular property's body that we matched with */
                    _bodyText.replace(/(?:\s)*(?:get|'get'|"get")(?:\s)*:(?:\s)*function\(\)(?:\s)*\{/, function(m, o, g) {
                        /* m for match, o for offset, g for "whole getter string" */

                        if (hasGetter) {
                            preface += "var "+getAlias+" = "+objName+".__lookupGetter__('"+property+"');\n";
                        }

                        let j = o+m.length;
                        let bt = "";
                        parenOpenCount = 1;
                        while (parenOpenCount > 0) {
                            bt += g[j];
                            if (g[j] == '}') {
                                parenOpenCount -= 1;
                            } else if (g[j] == '{') {
                                parenOpenCount += 1;
                            }
                            j += 1;
                        }
                        
                        replaceText = "get: function() {\n";
                        replaceText += "if (DataManager._version == <replaceText>) {";
                        replaceText += bt +"\n"; //includes its own curly braces
                        if (hasGetter) {
                            replaceText += " else { return "+getAlias+".call(this) }\n";
                        }
                        replaceText += "}\n"; //close function

                        toReplace = m+bt;
                        return m;
                    })
                    _bodyText = _bodyText.replace(toReplace, replaceText);

                    _bodyText.replace(/(?:\s)*(?:set|'set'|"set")(?:\s)*:(?:\s)+function\((?<argument>(?:[a-zA-Z0-9_\$].*?))\)(?:\s)*\{/, function(m, argument, o, s) {
                        /* m for match, o for offset, s for "whole setter string" */

                        if (hasSetter) {
                            preface += "var "+setAlias+" = "+objName+".__lookupSetter__('"+property+"');\n";
                        }

                        let j = o+m.length;
                        let bt = "";
                        parenOpenCount = 1;
                        while (parenOpenCount > 0) {
                            bt += s[j];
                            if (s[j] == '}') {
                                parenOpenCount -= 1;
                            } else if (s[j] == '{') {
                                parenOpenCount += 1;
                            }
                            j += 1;
                        }

                        replaceText = "set: function(" + argument + ") {\n";
                        replaceText += "if (DataManager._version == <replaceText>) {"
                        replaceText += bt +"\n"; //includes its own curly braces
                        if (hasSetter) {
                            replaceText += " else { return "+setAlias+".call(this, " + argument + ") }\n"
                        }
                        replaceText += "}\n"; //close function

                        toReplace = m+bt;
                        return m;
                    })
                    _bodyText = _bodyText.replace(toReplace, replaceText);

                    _finalObjText = "";
                    _finalObjText = _finalObjText + _match;
                    _finalObjText = _finalObjText + _bodyText;
                    _finalObjText = _finalObjText + "\n";
                    finalObjText.push(_finalObjText);

                    return _match;
                })
                /* Trim the key-value pair we just parsed/identified so it can't match against
                 * something inside the body text */
                bodyText = bodyText.replace(_toAxe, "");

        } /* end while (true) */
        
        let final = "";
        final = final + preface + "\n" + match;
        final = final + finalObjText.join(',');
        final = final + "})\n";

        i = offset+("Object.defineProperties(".length);
        parenOpenCount = 1;
        while (parenOpenCount > 0) {
            if (string[i] == ')') {
                parenOpenCount -= 1;
            } else if (string[i] == '(') {
                parenOpenCount += 1;
            }
            i += 1;
        }

        toDelete.push([offset, i+1, final]);

        return match;
    });
    deleteMidsection();

    return file;
}

//let MVMM_ScLoad_onSavefileOk = Scene_Load.prototype.onSavefileOk;
Scene_Load.prototype.onSavefileOk = function() {
    Scene_File.prototype.onSavefileOk.call(this);
    let prev_version = DataManager._version;
    const success = DataManager.loadGame(this.savefileId());
    if (success) {
        ModManager.changeSourceCode(prev_version, DataManager._version);
        if ((DataManager._version && DataManager._version != "") || (prev_version != DataManager._version)) {
            let loadPatchDatabases = function() {
                
                //Vanilla/base data files loaded at boot, once we start a game, reload them based on
                //  the patch
                this._loaded = true;
                this.onLoadSuccess();
            }
            ModManager.quickLoad = true;
            this._loaded = false;
            ModManager.queuedFunction = loadPatchDatabases.bind(this);

            ModManager.loadPlugins(prev_version);
            //Save original encryption key;
            //  Only do the first time - otherwise a "load" from a modded save would mess it up
            if (!Decrypter._baseEncryptionKey) {
                if ($dataSystem.encryptionKey) {
                    Decrypter._baseEncryptionKey = $dataSystem.encryptionKey.split(/(.{2})/).filter(Boolean);
                }
            }
            DataManager.loadDatabase();
        } else {
            this.onLoadSuccess();
        }
    } else {
        this.onLoadFailure();
    }
};

DataManager.loadEncryptionList = function(ver=null) {
    if (!ver) { ver = this._version; }
    if (!this._encryptionList) {
        this._encryptionList = {};
    }
    if (Object.keys(this._encryptionList).indexOf(ver) < 0) {
        this._encryptionList[ver] = ModManager.loadEncryptionList(ver);
    }
}

DataManager.checkEncryptList = function(url) {
    if (!this._encryptionList || !this._encryptionList[this._version]) { return null; }
    if (this._encryptionList[this._version][url]) {
        //url = url.replace('\\', '/');
        url = url.replace('.rpgmvo', '.ogg');
        url = url.replace('.rpgmvm', '.m4a');
        url = url.replace('.rpgmvp', '.png');
        return this._encryptionList[this._version][url];
    }
    /*
    reverseSlashes = url;
    reverseSlashes = reverseSlashes.replace(/\//, '\\');
    if (this._encryptionList[reverseSlashes]) {
        return this._encryptionList[reverseSlashes];
    }*/
    return null;
}

//Global save info defs knows which save is on which mod/patch
// so we can show this during save file list screens
var DMsaveGameWPath = DataManager.saveGameWithoutRescue;
DataManager.saveGameWithoutRescue = function(savefileId) {
    let val = DMsaveGameWPath.call(this, savefileId);
    let globalInfo = this.loadGlobalInfo();
    globalInfo[savefileId].patch = DataManager._version;
    this.saveGlobalInfo(globalInfo);
    return val;
}

var mv_mm_reset_load_latches = DataManager.loadDatabase;
DataManager.loadDatabase = function(...args) {
    MVMM_resetLatches();
    mv_mm_reset_load_latches.call(this, ...args);
}

//-----------------------------------------------------------------------------

var DMcheckImageIgnoreIfNoEncrypt = Decrypter.checkImgIgnore;
Decrypter.checkImgIgnore = function(url){
    if (!DataManager._version || DataManager._version == "") {
        return DMcheckImageIgnoreIfNoEncrypt.call(this, url);
    }
    //If this is in the encryption list with a key of "null",
    //  it is unencrypted, "ignore" the encryption
    //ie: the main game has Encrypted Assets set to true, but
    //  some patched in assets are unencrypted
    if (Decrypter.getEncryptionKey(url) == null) {
        return true;
    }
    return DMcheckImageIgnoreIfNoEncrypt.call(this, url);
}

Decrypter.readBaseEncryptionkey = function(){
    return this._baseEncryptionKey || $dataSystem.encryptionKey.split(/(.{2})/).filter(Boolean);
};

Decrypter.getEncryptionKey = function(url, ver = DataManager._version) {
    DataManager.loadEncryptionList(ver);
    if (ver && ver != "") {
        let retKey = this.readBaseEncryptionkey();
        let keys = Object.keys(DataManager._encryptionList[ver]);
        if (keys.indexOf(url) >= 0) {
            retKey = DataManager._encryptionList[ver][url];
        }
        reverseSlashes = url;
        reverseSlashes = reverseSlashes.replace(path.join(ModManager._path, ModManager._installsFolder, ver), '');
        reverseSlashes = reverseSlashes.replace(/^(\/|\\)/, '');
        if (keys.indexOf(reverseSlashes) >= 0) {
            retKey = DataManager._encryptionList[ver][reverseSlashes];
        }
        reverseSlashes = reverseSlashes.replace(/\\/g, '/');
        reverseSlashes = reverseSlashes.replace('.rpgmvo', '.ogg');
        reverseSlashes = reverseSlashes.replace('.rpgmvm', '.m4a');
        reverseSlashes = reverseSlashes.replace('.rpgmvp', '.png');
        if (keys.indexOf(reverseSlashes) >= 0) {
            retKey = DataManager._encryptionList[ver][reverseSlashes];
        }
        return retKey;
    }
    return this.readBaseEncryptionkey();
}

/* Regrettably, even though the necessary change in each function is so frustratingly minor,
 * I could find no alternative but to overwrite these Decrypt functions.
 */

var _xml_open_diverted_path = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    if (DataManager._version && DataManager._version != "") {
        DataManager.loadEncryptionList();
        //inelegant, but have to remove prefix install path if it's already been appended
        //  appropriate encryption key for the asset path

        //really this probably shouldn't exist, should all be covered by the latter (else if) case
        //if (Object.keys(DataManager._encryptionList).indexOf(url) >= 0) {
        if (DataManager.checkEncryptList(url)) {
            url = path.join(ModManager._path, ModManager._installsFolder, DataManager._version, url);
        } else if (fs.existsSync(path.join(ModManager._path, ModManager._installsFolder, DataManager._version, url))) {
            url = path.join(ModManager._path, ModManager._installsFolder, DataManager._version, url);
        }
    }
    return _xml_open_diverted_path.call(this, method, url);
}

/* Intercept it here so that the cache will differentiate images from different
   installs... which only comes up for save lists, but doesn't hurt */

var _load_normal_bitmap_diverted_path = ImageManager.loadNormalBitmap;
ImageManager.loadNormalBitmap = function(url, hue) {
    if (DataManager._version && DataManager._version != "") {
        DataManager.loadEncryptionList();
        //really this probably shouldn't exist, should all be covered by the latter (else if) case
        if (DataManager.checkEncryptList(url)) {
        //if (Object.keys(DataManager._encryptionList).indexOf(url) >= 0) {
            url = path.join(ModManager._path, ModManager._installsFolder, DataManager._version, url);
        } else if (fs.existsSync(path.join(ModManager._path, ModManager._installsFolder, DataManager._version, url))) {
            url = path.join(ModManager._path, ModManager._installsFolder, DataManager._version, url);
        }
    }
    return _load_normal_bitmap_diverted_path.call(this, url, hue);
}

var _reserve_normal_bitmap_diverted_path = ImageManager.reserveNormalBitmap;
ImageManager.reserveNormalBitmap = function(url, hue, reservationId){
    if (DataManager._version && DataManager._version != "") {
        DataManager.loadEncryptionList();
        //really this probably shouldn't exist, should all be covered by the latter (else if) case
        if (DataManager.checkEncryptList(url)) {
        //if (Object.keys(DataManager._encryptionList).indexOf(url) >= 0) {
            url = path.join(ModManager._path, ModManager._installsFolder, DataManager._version, url);
        } else if (fs.existsSync(path.join(ModManager._path, ModManager._installsFolder, DataManager._version, url))) {
            url = path.join(ModManager._path, ModManager._installsFolder, DataManager._version, url);
        }
    }
    return _reserve_normal_bitmap_diverted_path.call(this, url, hue, reservationId);
};

Decrypter.decryptHTML5Audio = function(url, bgm, pos) {
    let requestFile = new XMLHttpRequest();
    requestFile.open("GET", url);
    requestFile.responseType = "arraybuffer";
    requestFile.send();

    let ver = DataManager._version; //Change
    requestFile.onload = function () {
        if(this.status < Decrypter._xhrOk) {
            /* var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response); */ //Change
            let arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response, url, ver);
            let url = Decrypter.createBlobUrl(arrayBuffer);
            AudioManager.createDecryptBuffer(url, bgm, pos);
        }
    };
};

/* If any attempt is made at Android compatibility, "this.shouldUseHtml5Audio"
 * may not always be false, in which case the following function behavior needs
 * to be overriden to avoid Decrypting a bgm track in the case where the base
 * game/project has encrypted audio and the patch adds a bgm track that is not
 * encrypted.
/*
AudioManager.playBgm = function(bgm, pos) {
    if (this.isCurrentBgm(bgm)) {
        this.updateBgmParameters(bgm);
    } else {
        this.stopBgm();
        if (bgm.name) {
            //IF 
            if(Decrypter.hasEncryptedAudio && this.shouldUseHtml5Audio()){
                this.playEncryptedBgm(bgm, pos);
            }
            else {
                this._bgmBuffer = this.createBuffer('bgm', bgm.name);
                this.updateBgmParameters(bgm);
                if (!this._meBuffer) {
                    this._bgmBuffer.play(true, pos || 0);
                }
            }
        }
    }
    this.updateCurrentBgm(bgm, pos);
}; */

Decrypter.decryptImg = function(url, bitmap) {
    url = this.extToEncryptExt(url);

    let requestFile = new XMLHttpRequest();
    requestFile.open("GET", url);
    requestFile.responseType = "arraybuffer";
    requestFile.send();

    let ver = DataManager._version; //Changed
    requestFile.onload = function () {
        if(this.status < Decrypter._xhrOk) {
            let arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response, /*JUST THIS IS NEW */ url, ver);
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
};

WebAudio.prototype._load = function(url) {
    if (WebAudio._context) {
        let xhr = new XMLHttpRequest();
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
    let array = xhr.response;
    /* if(Decrypter.hasEncryptedAudio) array = Decrypter.decryptArrayBuffer(array); */ //Change
    if (Decrypter.hasEncryptedAudio) array = Decrypter.decryptArrayBuffer(array, url);
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
Decrypter.decryptArrayBuffer = function(arrayBuffer, url=null, version="") {
    if (!arrayBuffer) return null;
    let header = new Uint8Array(arrayBuffer, 0, this._headerlength);

    let i;
    let ref = this.SIGNATURE + this.VER + this.REMAIN;
    let refBytes = new Uint8Array(16);
    for (i = 0; i < this._headerlength; i++) {
        refBytes[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
    }
    for (i = 0; i < this._headerlength; i++) {
        if ((header[i] !== refBytes[i]) && ModManager._checkAssetHeaders) {
            throw new Error("Header is wrong");
        }
    }

    arrayBuffer = this.cutArrayHeader(arrayBuffer, Decrypter._headerlength);
    let view = new DataView(arrayBuffer);

    this._encryptionKey = this.getEncryptionKey(url, version);/* Changed: this.readEncryptionkey(); */
    if (arrayBuffer) {
        let byteArray = new Uint8Array(arrayBuffer);
        for (i = 0; i < this._headerlength; i++) {
            byteArray[i] = byteArray[i] ^ parseInt(this._encryptionKey[i], 16);
            view.setUint8(i, byteArray[i]);
        }
    }

    return arrayBuffer;
};

var _data_manage_reserve_save_images_with_reroute = DataManager.loadSavefileImages;
DataManager.loadSavefileImages = function(info) {

    DataManager._backupVersion = DataManager._version;
    DataManager._version = info.patch;
    DataManager.loadEncryptionList();
    _data_manage_reserve_save_images_with_reroute.call(this, info)
    DataManager._version = DataManager._backupVersion;

};

var _image_manage_draw_party_with_reroute = Window_SavefileList.prototype.drawPartyCharacters;
Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {

    DataManager._backupVersion = DataManager._version;
    DataManager._version = info.patch;
    DataManager.loadEncryptionList();
    //Will cause it to use save's patch's images, if applicable
    _image_manage_draw_party_with_reroute.call(this, info, x, y);
    DataManager._version = DataManager._backupVersion;
};

Window_SavefileList.prototype.drawContents = function(info, rect, valid) {
    let bottom = rect.y + rect.height;
    if (rect.width >= 420) {
        this.drawGameTitle(info, rect.x + 192, rect.y, rect.width - 192);
        if (valid) {
            this.drawPartyCharacters(info, rect.x + 220, bottom - 4);
        }
    } else {
        let patchText = "";
        if (info) {
            if (info.patch && info.patch != "") {
                patchText = path.basename(info.patch);
            } else {
                patchText = ModManager._baseGameText;
            }
        }
        this.drawText(patchText, 0, rect.y+rect.height / 3, rect.width, 'right');
        if (valid) {
            this.drawPartyCharacters(info, 24, bottom - 4);
        }
    }
    let lineHeight = this.lineHeight();
    let y2 = bottom - lineHeight;
    if (y2 >= lineHeight) {
        this.drawPlaytime(info, rect.x, y2, rect.width);
    }
};

//-----------------------------------------------------------------------------


Window_Base.prototype.addWindow = function(window) {
    Scene_Base.prototype.addWindow.call(this, window);
}

var save_ver_make_save_contents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    let contents = save_ver_make_save_contents.call(this);
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

var plugin_manager_setup_dont_duplicate = PluginManager.setup;
PluginManager.setup = function(plugins) {
    if (DataManager._version && DataManager._version != "") {
        plugins.forEach(function(plugin) {
            if (plugin.status && !this._scripts.contains(plugin.name)) {
                this.setParameters(plugin.name, plugin.parameters);
                this.loadScript(plugin.name + '.js');
                this._scripts.push(plugin.name);
            }
        }, this);
    } else {
        plugin_manager_setup_dont_duplicate.call(this, plugins);
    }
};

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
        ModManager._loadLock -= 1;
        if (ModManager._loadLock === 0) {
            ModManager.quickLoad = false;
            DataManager._loadCount += 1;
        }
        quick_load_fake_database.call(DataManager, object);
        
        if (ModManager._loadLock == 0) {
            /* THIS ONLY EXISTS TO GIVE OTHER PLUGINS A CHANCE TO
             * RELOAD INFORMATION */
            DataManager.isDatabaseLoaded();

            ModManager.queuedFunction.call();
            /* Don't count on anything being called after this, as it
             * may be running the game */
        }
    } else {
        quick_load_fake_database.call(DataManager, object);
    }
};

/* THIS IS ONLY HERE BECAUSE SOME OTHER PLUGINS NEED HELP UNDERSTANDING
 * THAT WE ARE RELOADING THE DATABASE */
var quick_load_check_db_loaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!this._loadCount) {this._loadCount = 0;}
    let res = quick_load_check_db_loaded.call(this);
    if (this._loadCount === 0) {
        return res;
    }
    return !ModManager.quickLoad;
}



//-----------------------------------------------------------------------------
// Window_TitleCommand
//
// The window for selecting New Game/Continue on the title screen.

var _alias_modmanage_win_titlecom_make_com_lst = Window_TitleCommand.prototype.makeCommandList;
Window_TitleCommand.prototype.makeCommandList = function() {
    _alias_modmanage_win_titlecom_make_com_lst.call(this);
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
    let dir = path.join(ModManager._path, ModManager._installsFolder);
    let installs = (fs.existsSync(dir)) ? fs.readdirSync(dir) : [];
    installs.splice(0,0,ModManager._baseGameText);
    this._commandWindow = new Window_CommandList(installs, Graphics.boxHeight * ((1.0-0.70)/2.0), Graphics.boxHeight/2-40, {'width': Graphics.boxWidth * (0.70) });
    for (let i = 0; i < installs.length; i++) {
        if (i > 0) {
            let version = installs[i];
            if (!version) { version = ""; } //default or vanilla game
            //this._commandWindow.addCommand(version, version);
            this._commandWindow.setHandler(installs[i], this.commandStart(version).bind(this));
        } else {
            this._commandWindow.setHandler('|Base Game|', this.commandStart("").bind(this));
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
        let prev_version = DataManager._version;
        ModManager.changeSourceCode(prev_version, install);
        DataManager._version = install;
        DataManager.loadEncryptionList();
        //Vanilla/base data files loaded at boot, once we start a game, reload them based on
        //  the patch
        let loadPatchDatabases = function() {
            DataManager.setupNewGame();
            this._commandWindow.close();
            this.fadeOutAll();
            SceneManager.pop(); //returns to Scene_Title, which calls init and would clear DataManager._version
            this._loaded = true;
            SceneManager.goto(Scene_Map);
        }
        ModManager.quickLoad = true;
        this._loaded = false;
        ModManager.queuedFunction = loadPatchDatabases.bind(this);

        ModManager.loadPlugins(prev_version);

        //Save original encryption key;
        //  Only do the first time - otherwise a "load" from a modded save would mess it up
        if (!Decrypter._baseEncryptionKey) {
            if ($dataSystem.encryptionKey) {
                Decrypter._baseEncryptionKey = $dataSystem.encryptionKey.split(/(.{2})/).filter(Boolean);
            }
        }

        DataManager.loadDatabase();
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
};

Scene_ModManage.prototype.create = function() {
    Scene_Base.prototype.create.call(this);

    const showModCreationTab = fs.existsSync(ModManager._base);
    const activeSaveTab = DataManager.isAnySavefileExists();

    this.createBackground();
    this.createWindowLayer();
    this.createCommandWindow(showModCreationTab);
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
    cols = (createPage) ? 3 : 2;
    this._hasCreatePage = createPage;
    this._showCreatePage = createPage;
    Window_Horz2.prototype.initialize.call(this, x, y, {'maxcols': cols});
    this.defaultToFirstOption();
};

Window_ModTypeCommand.prototype.makeCommandList = function() {
    this.addCommand("Patches",      'patches', this.patchesAvailable());
    this.addCommand("Convert Save", 'save',    this.savesAvailable());
    if (this._hasCreatePage) {
        this.addCommand("Create",       'create',  this.createAvailable());
    }

    //provide user advice/inform user
    if (this._list[0].enabled == false) {
        this._list[0].name = "No patches detected in 'mods/patches/'";
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
        filepath = path.join(filepath, ModManager._patchesFolder) 
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
// Window_ModPatchConfig
//
// Collection of Windows together let a user set parameters;
// Contains a Window_Selectable, 3 buttons, a confirm window, a Window_Textbox for input, and a help window

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
    for (let i = 0; i < this._patchChoicesWindow._list.length; i++) {
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

  //will be called from the textbox it is linked to, so "this" refers to textbox object
  const name = this._inputText.getMessage();
  var isValidFoldername = function(fname){
    var rg1=/^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
    var rg2=/((^\.)|(( |\.)$))/; // cannot start with dot (.), cannot end with space or dot
    var rg3=/^(nul|prn|con|aux|lpt[1-9]|com[1-9])(\.|$)/i; // forbidden file names
    result = (fname!=null)&&rg1.test(fname)&&!rg2.test(fname)&&!rg3.test(fname)&&(used.indexOf(fname) < 0)&&(fname.length > 0);
    return result;
  };
  return isValidFoldername(name);
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

    //We officially have at least one patch, so make sure to scrub "let/const"
    //declarations so that it's safer to use modded scripts
    //Since diffs are created based on "cleaned" versions of the project,
    //for indices to line up, we must clean before applying diffs.
    if (!ModManager._hasVarReplaced) {
        ModManager._hasVarReplaced = true;
        ModManager.projectVarPass();
    }

    ModManager._applyPatch(patch);

    this._history.push("PATCH: "+patch+"\n");
    this.setupHistory();
    this._applyButton.active = true;
}

Window_ModPatchConfig.prototype.doExportFinal = function() {
  //make sure we can save the patch
  if (!this.doExportConfirm()) {
    //if it returns false, it plays buzzer and the textbox should show an error
    this.setState('input');
    return;
  }
  const patchName = this._inputText.message;
  const dest = path.join(ModManager._path, ModManager._installsFolder, patchName);

  //save contents of curr to new patch. Also clears temp.
  ModManager.savePatch(patchName);
  //save the encryption list for any new assets
  ModManager.dumpEncryptionList(dest);

  //log history and clear:
  const patchTxt = path.join(dest, 'patch.txt');
  fs.writeFileSync(patchTxt, JSON.stringify(this._history), {encoding: 'utf8'});

  ModManager.clearPatch();
  this._history = [];
  this._historyWindow.contents.clear();

  //restore menu
  this._exportButton.active = true;
  this.cancelConfirm();
};

Window_ModPatchConfig.prototype.setupInput = function() {
    this._inputText.setConstraint(this.doExportConfirm.bind(this),"Must be a new, valid folder name.");
}

Window_ModPatchConfig.prototype.setupHistory = function() {
    let message = "";
    this._historyWindow.contents.clear();
    for (let i = 0; i < this._history.length; i++) {
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

    let files = [];
    let patches = []; let curr_path = path.join(ModManager._path, 'patches');
    if (fs.existsSync(curr_path))
        files = fs.readdirSync(curr_path);
    for (let i = 0; i < files.length; i++) {
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
    this._inputText.unlock(['Escape', 'ok', 'Enter']);
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
    this._logMessages = [];
    this._toggleSelectedColor = '#ffce1f';
    this._toggleSelectableColor = '#ffffff';
    this._toggleDisabledColor = '#888888';

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

    //this.createProgressBar(); //TODO?
};

Window_ModPatchCreate.prototype._handleTasks = function() {
    //Returns true if done with tasks
    if (AutoDiff.handleTasks()) {
        this._finishCreatingPatch();
    }
}

Window_ModPatchCreate.prototype._finishCreatingPatch = function() {
    AutoDiffLogger.deRegister();
    //After finishing a successful patch export... leave the menu?
    this._cancelHander.call();
    this._state = 'toggle3';
}

Window_ModPatchCreate.prototype.update = function() {

    if (this._state == "diffing") {
        this._handleTasks();
        return;
    }

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

        if (this._inputText.isTouchedInsideFrame()) {
            state = 'input';
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
            if (Input.isTriggered('right')) {
                SoundManager.playCursor();
                //state = 'toggle1';
            } else if (Input.isTriggered('left')) {
                SoundManager.playCursor();
                //state = 'toggle1';
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
                SoundManager.playCursor();
                //state = 'toggle2';
            } else if (Input.isTriggered('left')) {
                SoundManager.playCursor();
                //state = 'toggle2';
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
                //state = 'toggle3';
            } else if (Input.isTriggered('left')) {
                SoundManager.playCursor();
                //state = 'toggle3';
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
            default: return;
        }
    }
    this.refreshToggles();
    this.setupDesc();
}

Window_ModPatchCreate.prototype.refreshToggles = function(state) {
    if (this._toggle3Window.get()) { //if (this._toggle3Window.index() == 0) {
        //Using explicit diff list, turn off first two toggles
        this._toggle1Window.setDisableColor(this._toggleDisabledColor);
        this._toggle2Window.setDisableColor(this._toggleDisabledColor);
        this._toggle1Window.setDisableFontColor(this._toggleDisabledColor);
        this._toggle2Window.setDisableFontColor(this._toggleDisabledColor);
    } else {
        //Not using explicit diff list, turn on first two toggles
        this._toggle1Window.setDisableColor(this._toggleSelectableColor);
        this._toggle2Window.setDisableColor(this._toggleSelectableColor);
        this._toggle1Window.setDisableFontColor(this._toggleSelectableColor);
        this._toggle2Window.setDisableFontColor(this._toggleSelectableColor);
    }

    //If any of the toggles is selected/active, mark it with a special color
    switch(this._state) {
        case 'toggle1': this._toggle1Window.setColor(this._toggleSelectedColor); break;
        case 'toggle2': this._toggle2Window.setColor(this._toggleSelectedColor); break;
        case 'toggle3': this._toggle3Window.setColor(this._toggleSelectedColor); break;
        default: break;
    }
}

Window_ModPatchCreate.prototype.doExportConfirm = function(file) {
    /* Allow them to run again on the same name, in case a previous run didn't finish
    var used = []; //test to make sure they do not pick a name they have already used
    if (fs.existsSync(path.join(ModManager._path, 'patches'))) {
        used = fs.readdirSync(path.join(ModManager._path, 'patches'));
    } */
    var isValidFoldername = function(fname){
      var rg1=/^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
      var rg2=/((^\.)|(( |\.)$))/; // cannot start with dot (.), cannot end with space or dot
      var rg3=/^(nul|prn|con|aux|lpt[1-9]|com[1-9])(\.|$)/i; // forbidden file names
      result = (fname)&&rg1.test(fname)&&!rg2.test(fname)&&!rg3.test(fname)&&(fname.length > 0);
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

    //We officially have at least one patch, so make sure to scrub "let/const"
    //declarations so that it's safer to use modded scripts
    /* Note: would be more efficient to integrate manually into the recursive
     * search that already occurs during diffing. */
    if (!ModManager._hasVarReplaced) {
        //No reason to do this scan-and-replace twice in one sitting
        ModManager._hasVarReplaced = true;
        ModManager.projectVarPass();
    }

    AutoDiffLogger.register(this);
    AutoDiff.createPatch(config, this._inputText.message);

    this._state = "diffing";
    return true;
}

Window_ModPatchCreate.prototype.setupInput = function() {
    this._inputText.setConstraint(this.doExportConfirm,"Must be a new, valid folder name.", this);
}

Window_ModPatchCreate.prototype.setSubmit = function() {
    SoundManager.playCursor();
    this.setState('submit');
}

Window_ModPatchCreate.prototype.createInputWindow = function() {
    this._inputText = new Window_Textbox({'x':Graphics.boxWidth/4-120,'y':Graphics.boxHeight/16.0 +20, 'caption':"Patch Name:", 'caption_size':20 });
    this._inputText.unlock(['Escape', 'Enter', 'Arrow Down', 'Arrow Up', 'enter', 'ok', 'up', 'down']);
    this._inputText.setSubmitHandler(Window_ModPatchCreate.prototype.setSubmit,this);
    //Only submit from submit button
    this.setupInput();
    this.addChild(this._inputText);
}
Window_ModPatchCreate.prototype.createHelpWindow = function() {
    this._descWindow = new Window_Base((1.0/16.0)*Graphics.boxWidth, (5.0/8.0)*Graphics.boxHeight-this.lineHeight(), (7.0/8.0)*Graphics.boxWidth, (1.0/4.0)*Graphics.boxHeight );
    this.addChild(this._descWindow);
};
/* I apologize for deciding toggle 3 should actually be on the top after making this */
Window_ModPatchCreate.prototype.createToggle1Window = function() {
    this._toggle1Window = new Window_Checkbox((1.0/4.0)*Graphics.boxWidth-10, (3.0/8.0)*Graphics.boxHeight, 20, {'text':'Compare Assets', 'color':this._toggleSelectedColor, 'disable': this._toggleSelectableColor, 'disable_font_color':this._toggleSelectableColor, 'direction':'up'});
    this._toggle1Window.set(false); //Default to Off
    this.addChild(this._toggle1Window);
};
Window_ModPatchCreate.prototype.createToggle2Window = function() {
    this._toggle2Window = new Window_Checkbox((1.0/4.0)*Graphics.boxWidth-10, (1.0/2.0)*Graphics.boxHeight, 20, {'text':'Compare Scripts', 'color':this._toggleSelectedColor, 'disable': this._toggleSelectableColor, 'disable_font_color':this._toggleSelectableColor, 'direction':'up'});
    this._toggle2Window.set(false); //Default to Off
    this.addChild(this._toggle2Window);
};
Window_ModPatchCreate.prototype.createToggle3Window = function() {
    this._toggle3Window = new Window_Checkbox((1.0/4.0)*Graphics.boxWidth-10, (1.0/4.0)*Graphics.boxHeight, 20, {'text':'Use File List', 'color':this._toggleSelectedColor, 'disable': this._toggleSelectableColor, 'disable_font_color':this._toggleSelectableColor, 'direction':'up'});
    this._toggle3Window.set(false); //Default to Off
    this.addChild(this._toggle3Window);
};

Window_ModPatchCreate.prototype.createSubmitButton = function() {
    this._saveButton = new Window_CommandList(['Save'], (5.0/8.0)*Graphics.boxWidth, Graphics.boxHeight/16.0, {'width':(1.0/4.0)*Graphics.boxWidth});
    //this._saveButton.setHandler('Save', this.writeChanges.bind(this));
    this.addChild(this._saveButton);
};

Window_ModPatchCreate.prototype.setupDesc = function() {
    //this._descWindow.contents.clear();
    const descriptions = {
        'error': "Enter a valid/unused folder name.",
        'submit': "Hit Enter to start creating the patch. It may take a few minutes.",
        'input': "Enter a folder name to build the patch in. Hit Enter when finished.",
        'toggle1': "Setting this to On means that the patch creator will automatically compare assets outside the database (images, audio files, etc) for additions and modifications.",
        'toggle2': "Setting this to On means that the patch creator will automatically compare script files for additions and modification.",
        'toggle3': "Setting this to On means that the patch creator will only update/patch/overwrite files specified (via full filepath) in "+ModManager._listFileName+"."
    }
    let desc = (descriptions[this._state] || "");
    this._descWindow.contents.fontColor = '#ffffff';
    this._descWindow.contents.fontSize = 12;
    this._descWindow.drawWrapText(desc);
};

Window_ModPatchCreate.prototype.log = function(message, color) {
    const MESSAGE = 0;
    const HEIGHT = 1;
    const COLOR = 2;

    this._descWindow.contents.clear();
    this._logMessages.push([message, this._descWindow.getWrapHeight(message), color]);
    const margins = 10;
    let displayHeight = this._descWindow.height - 2*margins;
    let showing = [];
    //Go through from back to front, to ensure the bottom visible message is
    // the most recent.
    let i;
    for (i = this._logMessages.length-1; i >= 0 && displayHeight > 0; i--) {
        displayHeight -= this._logMessages[i][HEIGHT];
    }
    //If the whole window/box isn't filled, it's fine, set i to zero to use whole
    //  log array as "showing"; also make sure it doesn't start printing from partway down
    if (displayHeight >= 0) { displayHeight = 0; i = 0; }
    //If it adds all of them, we need i to be 0 or the slice below will capture nothing
    //  But it's possible that the very last one would cut off the message, so we still
    //  want to run through the iteration where i = 0 to get the displayHeight adjustment.
    if (i < 0) { i = 0; }
    //By slicing, instead of pushing them as we iterate through earlier, it will keep the order
    //  scrolling - oldest on top
    showing = this._logMessages.slice(i, this._logMessages.length);
    for (i = 0; i < showing.length; i++) {
        let entry = showing[i];
        //Start from any negative leftover height - want oldest cut off, if it doesn't break evenly into lines,
        // not the newest
        displayHeight = this._descWindow.drawWrapLine(entry[MESSAGE], true, displayHeight, 'left', 12, entry[COLOR]);
    }
}

Window_ModPatchCreate.prototype.close = function() {
    Window_Base.prototype.close.call(this);
    //this._inputText.close();
    this._toggle1Window.close();
    this._toggle2Window.close();
    this._toggle3Window.close();

    this._saveButton.close();
    this._descWindow.close();
}
Window_ModPatchCreate.prototype.open = function() {
    Window_Base.prototype.open.call(this);
    this._inputText.open();
    this._toggle1Window.open();
    this._toggle2Window.open();
    this._toggle3Window.open();

    this._saveButton.open();
    this._descWindow.open();
}
Window_ModPatchCreate.prototype.hide = function() {
    Window_Base.prototype.hide.call(this);
    this._inputText.hide();
    this._toggle1Window.hide();
    this._toggle2Window.hide();
    this._toggle3Window.hide();

    this._saveButton.hide();
    this._descWindow.hide();
}
Window_ModPatchCreate.prototype.show = function() {
    Window_Base.prototype.show.call(this);
    this._inputText.show();
    this._toggle1Window.show();
    this._toggle2Window.show();
    this._toggle3Window.show();

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
    this.createHelpWindow(dx, dy);
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
    this._confirmWindow = new Window_CommandList(['Yes', 'No'], (1.0/3.0)*Graphics.boxWidth, (1.0/2.0)*Graphics.boxHeight+2*this.lineHeight(), {'maxcols':2,'width':(1.0/3.0)*Graphics.boxWidth});
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

Window_SaveConvert.prototype.createHelpWindow = function(dx, dy) {
    const x = Graphics.boxWidth/2 + dx;
    const y = dy+(3/4)*(Graphics.boxHeight - dy);
    const width = Graphics.boxWidth/2;
    const height = (1/4)*(Graphics.boxHeight - dy);
    this._descWindow = new Window_Base(x, y, width, height);
    this.addChild(this._descWindow);
};

//Code is ripped from vanilla Window_SavefileList: drawItem;
//  I didn't want to make a new window class for this, so I expanded
//  the classes functions into this
Window_SaveConvert.prototype.drawSelectedSaveSprite = function(savefileId) {
    let info = DataManager.loadSavefileInfo(savefileId);
    this._saveSprite.contents.clear();
    this._saveSprite.resetTextColor();

    let textRect = new Rectangle;
    textRect.x = this._saveSprite.x;
    textRect.y = this._saveSprite.y;
    textRect.width = this._saveSprite.width;
    textRect.height = this._saveSprite.height;
    //Draw the save file ID
    this._saveSprite.drawText(TextManager.file + ' ' + savefileId, 0, 0, 180);
    if (info) {
        //this.changePaintOpacity(valid); <- TODO look into this for "disabling" Toggles 1 and 2
        let bottom = textRect.height - 2*this.standardPadding();
        //Draw game title and party, if able
        if (true || textRect.width >= 420) {
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
                for (let i = 0; i < info.characters.length; i++) {
                    let data = info.characters[i];
                    this._saveSprite.drawCharacter(data[0], data[1], 24 + i * 48, (bottom - 4));
                }
            }

            if (info.patch) { //Restore version, in case we're in-game
                DataManager._version = DataManager._backupVersion;
            }
        }
        let lineHeight = this.lineHeight();
        let y2 = bottom - lineHeight;
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
                this._listWindow.select(this._firstIndex-1);
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
            this._listWindow.select(this._firstIndex-1);
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
                /* Make sure that an option is selected - if the save has no
                 * currently existing/recognized patch (or no data at all),
                 * then can choose that "patch" to convert to */
                if (this._modListWindow.index() >= 0) {
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
                    this._listWindow.select(this._firstIndex-1);
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
    DataManager._version = newVersion;
    DataManager.loadEncryptionList();

    function saveWithDataStructs() {
        Graphics.frameCount = $gameSystem._framesOnSave;
        if (!globalSaveInfo[this.savefileId()]) {
            globalSaveInfo[this.savefileId()] = DataManager.makeSavefileInfo();
        }
        globalSaveInfo[this.savefileId()].patch = newVersion;
        DataManager.saveGlobalInfo(globalSaveInfo);
        $gameMap.setupEvents();

        //If the patch comes with a custome conversion function/script, load it and run it while
        const convertFile = path.join(ModManager._path, ModManager._installsFolder, ModManager._convertFilename);
        if (fs.existsSync(convertFile)) {
            const script = ModManager.loadScript(convertFile);
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
    DataManager.loadMapData($gameMap.mapId());
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
            if (!install || install == "") { install = ModManager._baseGameText; }
            this._modListWindow.select(this._modOptions.indexOf(path.basename(install)));
        } else {
            this._modListWindow.hide();
        }
    }
}

Window_SaveConvert.prototype.refreshDesc = function() {
    const descriptions = {
        'list': "Select the save data you want to convert.",
        'mod': "Select the mod installation that you wish to convert to.",
        'list2': "Pick the save slot that you want the converted version of the save to be stored to.",
        'conf': "Select whether you want to overwrite the save file that was already in that spot.",
    }
    let desc = (descriptions[this.state] || "");
    this._descWindow.contents.fontColor = '#ffffff';
    this._descWindow.contents.fontSize = 24;
    this._descWindow.drawWrapText(desc);
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
    this.refreshDesc();
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
    this._descWindow.close();
}
Window_SaveConvert.prototype.open = function() {
    Window_Base.prototype.open.call(this);
    this._listWindow.open();
    this._modListWindow.open();
    this._confirmWindow.open();
    this._descWindow.open();
}
Window_SaveConvert.prototype.hide = function() {
    Window_Base.prototype.hide.call(this);
    this._listWindow.hide();
    this._modListWindow.hide();
    this._confirmWindow.hide();
    this._descWindow.hide();
    this._saveSprite.hide();
    this._tintSprite.visible = false;
}
Window_SaveConvert.prototype.show = function() {
    Window_Base.prototype.show.call(this);
    this._listWindow.show();
    this._modListWindow.show();
    this._descWindow.show();
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
    this._descWindow.deactivate();
}


//-----------------------------------------------------------------------------
// AutoDiffLogger
//
// The static class that handles logging during diffing and patch creation.

function AutoDiffLogger() {
    throw new Error('This is a static class');
}

AutoDiffLogger._successColor = "#06c951"; //green
AutoDiffLogger._normalColor = "#e8e8e8"; //gray
AutoDiffLogger._errorColor = "#e00909"; //red

AutoDiffLogger.register = function(_logger) {
    this.logger = _logger;
}

AutoDiffLogger.deRegister = function() {
    this.logger = null;
}

/* NOTE: currently, never called. "Failed diff creation" is not implemented. */
AutoDiffLogger.reportError = function(fileA, fileB) {
    fileA = fileA.replace(ModManager._path, '');
    fileB = fileB.replace(path.dirname(process.mainModule.filename),'');
    this.logger.log("Failed to create diff for: "+fileA+" "+fileB, this._errorColor);
}

AutoDiffLogger.reportSuccess = function(fileA, fileB, fileC) {
    fileA = fileA.replace(ModManager._path, '');
    fileB = fileB.replace(path.dirname(process.mainModule.filename),'');
    fileC = fileC.replace(path.dirname(process.mainModule.filename),'');
    this.logger.log("Successfully created file: "+fileC+" from files "+fileA+" "+fileB, this._successColor);
}

AutoDiffLogger.reportFound = function(fileA, fileB) {
    fileA = fileA.replace(ModManager._path, '');
    fileB = fileB.replace(path.dirname(process.mainModule.filename),'');
    this.logger.log("Registering changed file: "+fileA+" vs "+fileB+"; task queued.", this._normalColor);
    //requestAnimationFrame(); //Write immediately
}

AutoDiffLogger.reportFoundNew = function(fileB) {
    fileB = fileB.replace(path.dirname(process.mainModule.filename),'');
    this.logger.log("Registering new file: "+fileB+"; task queued.", this._normalColor);
    //requestAnimationFrame(); //Write immediately
}

AutoDiffLogger.reportStart = function(fileA, fileB, fileC) {
    fileA = fileA.replace(ModManager._path, '');
    fileB = fileB.replace(path.dirname(process.mainModule.filename),'');
    fileC = fileC.replace(path.dirname(process.mainModule.filename),'');
    this.logger.log("Creating diff file: "+fileC+" from files "+fileA+" "+fileB, this._normalColor);
}

AutoDiffLogger.reportOverwrite = function(fileA, fileC) {
    fileA = fileA.replace(ModManager._path, '');
    fileC = fileC.replace(path.dirname(process.mainModule.filename),'');
    this.logger.log("Copying file: "+fileC+" as "+fileA, this._normalColor);
}

//-----------------------------------------------------------------------------
// AutoDiff
//
// The static class that handles diffing and patch creation.

function AutoDiff() {
    throw new Error('This is a static class');
}

/* Checks if an object equals "{}" */
AutoDiff.isEmpty = function(obj) {
    const props = Object.keys(obj);
    for (let i = 0; i < props.length; i++) {
        const prop = props[i];
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

AutoDiff.jsonDiff = function(a, b) {
    let a_list = this.buildJsonList(a);
    let b_list = this.buildJsonList(b);
    return this.listDiff(a_list, b_list);
}

//credit to: https://blog.jcoglan.com/2017/02/17/the-myers-diff-algorithm-part-3/
//String-comparison, line-based diffing for script files
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
        let v = new Array(2*max+1).fill(0);
        const li = loopIndex(v.length);
        
        v[1] = 0;
        let trace = [];
        
        //Crawl down the edit graph breadth first - compute
        //  greedy farthest-reaching d-path along each diagonal k
        //  d represents "depth" in terms of non-diagonal paths taken
        //  in the edit graph
        for (let d = 0; d <= max; d += 1) {
            trace.push(v.slice(0)); //slice(0) is just a quick way to shallow copy/clone

            //Original script ranges k from -d to +d, but it was written in Ruby, which
            //  allows negative indexing (k will be used to index into an array) which
            //  does not work in JS
            for (let k = -d; k <= d; k += 2) {
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
        let x = a.length;
        let y = b.length;
        let li = loopIndex(trace[0].length);
        
        let prev_x;
        let prev_y;
        let prev_k;

        //Warning: reverse is inplace, so make sure we only need to do this once, ever
        trace.reverse();
        let index = 0;
        for (let d = trace.length - 1; d >= 0; d -= 1) {
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
} 

AutoDiff.buildJsonList = function(obj) {
    let tab = "";
    let list = [];

    // Below, use of JSON.stringy on strings "undoes" certain simplifications
    //  that occur on parse - for instance, it automattically adds quotation marks
    //  characters on the ends, and it adds in escape characters as needed.
    // The set of characters "\\bin" gets parsed into the string of 4 characters:
    //  \ b i n     or   [\, b, i, n] 
    // To get put onto the page/file the array of characters we originally had that
    //  encode that string, JSON.stringify("\bin") will produce '"\\bin"' or
    //  [", \, \, b, i, n, "]
    function buildRecurse(list, obj, tab) {
        if (Array.isArray(obj)) {
            list.push(tab+"[");
            //indent and add elements
            for (let i = 0; i < obj.length; i++) {
                //write the entry, which itself may be complex
                buildRecurse(list, obj[i], " "+tab);
                //for all but last, put a trailing comma to indicate it is one
                // member of the array
                if (i != obj.length - 1) {
                    list[list.length - 1] += ",";
                }
            }
            list.push(tab+"]");
        } else if (AutoDiff.isObject(obj)) {
            list.push(tab+"{");
            const keys = Object.getOwnPropertyNames(obj).sort();
            for (let i = 0; i < keys.length; i++) {
                //write the key on its own line
                let key = keys[i];
                list.push(" "+tab+JSON.stringify(key)+":");
                //write the value, which itself may be complex
                buildRecurse(list, obj[key], " "+tab);
                //for all but last, put a trailing comma to indicate it is one
                // member of the object
                if (i != keys.length - 1) {
                    list[list.length - 1] += ",";
                }
            }
            list.push(tab+"}");
        } else {
            // some primitive
            if ((typeof obj == "string") || (obj instanceof String)) {
                list.push(tab+JSON.stringify(obj));
            } else {
                list.push(tab+String(obj)); 
            }
        }
    }

    buildRecurse(list, obj, tab);
    return list;
}

//A is original, B is new
AutoDiff.textDiff = function(fileA, fileB) {
    var a = fs.readFileSync(fileA, {encoding:"utf8"}).split(/[\r\n]+/);
    var b = fs.readFileSync(fileB, {encoding:"utf8"}).split(/[\r\n]+/);
    return this.listDiff(a, b);
}

//A is original, B is new
AutoDiff.diff = function(fileA, fileB) {
    var a = JSON.parse(fs.readFileSync(fileA, {encoding:"utf8"}));
    var b = JSON.parse(fs.readFileSync(fileB, {encoding:"utf8"}));
    return this.jsonDiff(a, b);
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

AutoDiff.getOrigRef = function() {
    let file = fs.readFileSync(path.join(ModManager._base, 'js', 'rpg_core.js'), {encoding:'utf8'});
    file.replace(/Decrypter\.SIGNATURE(?:\s)*=(?:\s)("(?:.+)");/g, function(match, string, offset, file) {
        this._baseRef.SIGNATURE = JSON.parse(string);
        return '';
    }.bind(this));
    file.replace(/Decrypter\.VER(?:\s)*=(?:\s)("(?:.+)");/g, function(match, string, offset, file) {
        this._baseRef.VER = JSON.parse(string);
        return '';
    }.bind(this));
    file.replace(/Decrypter\.REMAIN(?:\s)*=(?:\s)("(?:.+)");/g, function(match, string, offset, file) {
        this._baseRef.REMAIN = JSON.parse(string);
        return '';
    }.bind(this));
}

AutoDiff.getOrigEncryptFlags = function() {
    const sys = JSON.parse(fs.readFileSync(path.join(ModManager._base, 'data', 'System.json'), {encoding:'utf8'})); //Assumes data file exists
    this._baseRef.hasEncryptedAudio = sys.hasEncryptedAudio;
    this._baseRef.hasEncryptedImages = sys.hasEncryptedImages;
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
    const needsDecrypt1 = (((name.match(/\.(png|rpgmvp)$/i) && $dataSystem.hasEncryptedImages) ||
                                                 (name.match(/\.(mp4|ogg|rpgmvo|rpgmvm)$/i) && $dataSystem.hasEncryptedAudio)) &&
                                                 (patchKey != null));;
    //Whether to decrypt base file:
    const needsDecrypt2 = (((name.match(/\.(png|rpgmvp)$/i) && this._baseRef.hasEncryptedImages) ||
                                                 (name.match(/\.(mp4|ogg|rpgmvo|rpgmvm)$/i) && this._baseRef.hasEncryptedAudio)) &&
                                                 (baseKey != null));
    /* If the header is not ignored, then any "bad header" that is found, will assumed
     * to be unusable/corrupted. It will return "true" to signify that the file should not
     * be included in the patch.
     */
    if (this._ignoreHeaders) {
        let pb = patchBuffer.slice(Decrypter._headerlength);
        let bb = baseBuffer.slice(Decrypter._headerlength);

        if (needsDecrypt1) {
            pb = pb.slice(Decrypter._headerlength);
        }
        if (needsDecrypt2) {
            bb = bb.slice(Decrypter._headerlength);
        }
        return (pb.equals(bb));
    }

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
                console.log("Header is wrong: "+name);
                return true;
                //throw new Error("Header is wrong");
            }
        } 

        let tpatchBuffer = patchBuffer.buffer;
        tpatchBuffer = Decrypter.cutArrayHeader(tpatchBuffer, Decrypter._headerlength);
        let view = new DataView(tpatchBuffer);
        if (patchBuffer) {
            let byteArray = new Uint8Array(tpatchBuffer);
            for (i = 0; i < Decrypter._headerlength; i++) {
                byteArray[i] = byteArray[i] ^ parseInt(patchKey[i], 16);
                view.setUint8(i, byteArray[i]);
            }
        }
        patchBuffer = new Buffer(tpatchBuffer);
    }
    //Decrypt base file contents as needed
    if (needsDecrypt2) {
        let header = new Uint8Array(baseBuffer, 0, Decrypter._headerlength);
        let i;
        let ref = this._baseRef.SIGNATURE + this._baseRef.VER + this._baseRef.REMAIN;
        let refBytes = new Uint8Array(16);
        for (i = 0; i < Decrypter._headerlength; i++) {
            refBytes[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
        }
        for (i = 0; i < Decrypter._headerlength; i++) {
            if (header[i] !== refBytes[i]) {
                console.log("Header is wrong: "+name)
                //throw new Error("Header is wrong");
            }
        } 
        let tbaseBuffer = baseBuffer.buffer;
        tbaseBuffer = Decrypter.cutArrayHeader(tbaseBuffer, Decrypter._headerlength);
        //let acopy = baseBuffer.slice();
        let view = new DataView(tbaseBuffer);
        if (baseBuffer) {
            let byteArray = new Uint8Array(tbaseBuffer);
            for (i = 0; i < Decrypter._headerlength; i++) {
                byteArray[i] = byteArray[i] ^ parseInt(baseKey[i], 16);
                view.setUint8(i, byteArray[i]);
            }
        }
        baseBuffer = new Buffer(tbaseBuffer);
    }
    
    baseBuffer = new Buffer(baseBuffer);
    patchBuffer = new Buffer(patchBuffer);
    return patchBuffer.equals(baseBuffer);
}

AutoDiff.encryptNameMirror = function(filename) {
    const breakpoint = filename.lastIndexOf('.');
    if (breakpoint < 0) return null;
    let file = filename.substring(0,breakpoint);
    const ext = filename.substring(breakpoint+1);
    switch (ext) {
        case 'png': return (file + '.rpgmvp');
        case 'm4a': return (file + '.rpgmvm');
        case 'ogg': return (file + '.rpgmvo');
        case 'rpgmvm': return (file + '.m4a');
        case 'rpgmvp': return (file + '.png');
        case 'rpgmvo': return (file + '.ogg');
    }
    //Was not an encrypted or encrypt-able filetype
    return null;
}

AutoDiff.readProperVersion = function(filename, encoding={}) {
    if (fs.existsSync(filename)) {
        return fs.readFileSync(filename, encoding)
    } else {
        return fs.readFileSync(this.encryptNameMirror(filename), encoding);
    }
}

AutoDiff.handleTasks = function() {
    const DIFF = 0;
    const TEXTDIFF = 1;
    const OVERWRITE = 2;

    const task = this.taskList.shift();
    if (!task) { return true; }

    const taskType = task[0];
    const origFile = task[1];
    const patchFile = task[2];
    const newFile = task[3];

    this.createReqDirectories(newFile);
    if (taskType == DIFF) {
        AutoDiffLogger.reportStart(origFile, patchFile, newFile);
        let diff = this.diff(origFile, patchFile);
        fs.writeFileSync(newFile, JSON.stringify(diff), {encoding: 'utf8'});
        AutoDiffLogger.reportSuccess(origFile, patchFile, newFile);
    } else if (taskType == TEXTDIFF) {
        AutoDiffLogger.reportStart(origFile, patchFile, newFile);
        let diff = this.textDiff(origFile, patchFile);
        fs.writeFileSync(newFile, JSON.stringify(diff), {encoding: 'utf8'});
        AutoDiffLogger.reportSuccess(origFile, patchFile, newFile);
    } else if (taskType == OVERWRITE) {
        fs.writeFileSync(newFile, this.readProperVersion(patchFile));
        AutoDiffLogger.reportOverwrite(patchFile, newFile);
    }

    return false;
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
  this._baseRef = {}
  this.getOrigRef();
  this.getOrigEncryptFlags();
  this._ignoreHeaders = !ModManager._checkAssetHeaders;
  this.taskList = [];

  const DIFF = 0;
  const TEXTDIFF = 1;
  const OVERWRITE = 2;

  if (useList) {
    let fileList = [];
    try {
        /* Sorry in advance if "fileList" vs "listFile" is confusing */
        const listFile = path.join(path.dirname(path.dirname(process.mainModule.filename)), 'mods', ModManager._listFileName)
        fileList = JSON.parse(fs.readFileSync(listFile, {encoding: 'utf8'}));
    } catch (error) {
        console.log("Failed to parse LIST file for patch/diff creation.");
        return;
    }
    function fileDiffSequential(list, parentPath="") {
        //path to asset in original/source install
        const src = path.join(ModManager._base,parentPath);
        //path to asset in current/modded/patched install
        const curr = path.join(root,parentPath);
        for (let k = 0; k < list.length; k++) {
            const file = list[k];

            const orig = path.join(src, file);
            const patch = path.join(curr, file);

            /* Assumes that the file exists in the current/modded version - otherwise,
             * they shouldn't have put it in the LIST.txt */
            if (fs.existsSync(orig)) {

                const orig_bytes = this.readProperVersion(orig);
                const patch_bytes = this.readProperVersion(patch);
                if (!orig_bytes.equals(patch_bytes)) {
                    //If the file to be compared is a JSON object
                    if (file.match(/\.json$/i)) {
                        //Copy the diff of the two files named "file" into the patch folder
                        const newfile = path.join(ModManager._path, ModManager._patchesFolder, name, parentPath, file);
                        //Make sure requisite parent directory hierarchy exists
                        //  that the file will be written into

                        AutoDiffLogger.reportFound(orig, patch);
                        this.taskList.push([DIFF, orig, patch, newfile]);

                    //If the file to be compared is an asset file
                    } else if (file.match(/\.(png|mp4|m4a|ogg|rpgmvp|rpgmvo|rpgmvm)$/i)) {
                        //Make sure that the difference in bytes between new and old isn't just
                        //  due to encryption differences
                        if (this.unencryptBytesEqual(orig_bytes, patch_bytes, orig_key, mod_key, file)) continue;
                        //Copy new image/audio/asset into
                        const newfile = path.join(ModManager._path, ModManager._patchesFolder, name, parentPath, file);
                        //Make sure requisite parent directory hierarchy exists
                        //  that the file will be written into
                        AutoDiffLogger.reportFound(orig, patch);
                        this.taskList.push([OVERWRITE, orig, patch, newfile])

                    //If the file to be compared is a text or script file
                    } else if (file.match(/\.(txt|csv)$/i) || file.match(/\.js$/i)){
                        const newfile = path.join(ModManager._path, ModManager._patchesFolder, name, parentPath, file);
                        //Make sure requisite parent directory hierarchy exists
                        //  that the file will be written into

                        AutoDiffLogger.reportFound(orig, patch);
                        this.taskList.push([TEXTDIFF, orig, patch, newfile])

                    }
                }
            //File exists in modded directory but not base directory:
            } else {
                //No "asset compare" or "script compare" arguments in a LIST-based diff;
                //  exactly every file specified in the list is "diffed", or in this case,
                //  copied

                //Copy it into the patch, it's new content
                const patch = path.join(curr, file);
                const newfile = path.join(ModManager._path, ModManager._patchesFolder, name, parentPath, file);
                //Make sure requisite parent directory hierarchy exists
                //  that the file will be written into

                AutoDiffLogger.reportFoundNew(patch);
                this.taskList.push([OVERWRITE, "", patch, newfile])
            }
        }
    }
    fileDiffSequential = fileDiffSequential.bind(this);
    //Perform the diff on the files
    fileDiffSequential(fileList);

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
            files = fs.readdirSync(curr);
            files.forEach(function(file, index) {
                    //Skip this script and files added to make this one work
                    if (ModManager._dependencies.includes(file)) { return; }

                if (fs.lstatSync(path.join(parentPath, file)).isDirectory()) {
                    fileDiffRecurse(path.join(parentPath, file));
                } else {
                    //If this file also exists (as an encrypted, or unencrypted version)
                    if (fs.existsSync(path.join(src, file)) || fs.existsSync(this.encryptNameMirror(path.join(src, file)))) {
                        //If the filetype is not one we're interested in, we can skip the comparison
                        if (file.match(/\.(png|mp4|m4a|ogg|rpgmvp|rpgmvo|rpgmvm)$/i) && !assetCompare) { return; }
                        if (file.match(/\.js$/i) && !scriptCompare) { return; }

                        const orig = path.join(src, file);
                        const patch = path.join(curr, file);

                        const orig_bytes = this.readProperVersion(orig);
                        const patch_bytes = this.readProperVersion(patch);
                        if (!orig_bytes.equals(patch_bytes)) {
                            if (file.match(/\.json$/i)) {
                                //Copy the diff of the two files named "file" into the patch folder
                                const newfile = path.join(ModManager._path, ModManager._patchesFolder, name, parentPath, file);
                                //Make sure requisite parent directory hierarchy exists
                                //  that the file will be written into

                                AutoDiffLogger.reportFound(orig, patch);
                                this.taskList.push([DIFF, orig, patch, newfile])

                            //If asset compare flag is checked, we can copy in new/changed assets;
                            //  files with extensions that are not common are copied regardless, to be safe
                            } else if (file.match(/\.(png|mp4|m4a|ogg|rpgmvp|rpgmvo|rpgmvm)$/i)) {
                                //Make sure that the difference in bytes between new and old isn't just
                                //  due to encryption differences
                                if (!this.unencryptBytesEqual(orig_bytes, patch_bytes, orig_key, mod_key, file)) {
                                    //Copy new image/audio/asset into
                                    const newfile = path.join(ModManager._path, ModManager._patchesFolder, name, parentPath, file);
                                    //Make sure requisite parent directory hierarchy exists
                                    //  that the file will be written into

                                    AutoDiffLogger.reportFound(orig, patch);
                                    this.taskList.push([OVERWRITE, orig, patch, newfile])

                                }
                            //If script flag is checked, we can copy in new/changed assets;
                            //  files with extensions that are not common are copied regardless, to be safe
                            } else if (file.match(/\.(txt|csv)$/i) || file.match(/\.js$/i)) {
                                const newfile = path.join(ModManager._path, ModManager._patchesFolder, name, parentPath, file);
                                //Make sure requisite parent directory hierarchy exists
                                //  that the file will be written into

                                AutoDiffLogger.reportFound(orig, patch);
                                this.taskList.push([TEXTDIFF, orig, patch, newfile])
  
                            }

                        //File bytes match in both modded and base directory:
                        } else {
                            //Do nothing; file unchanged
                        }

                    //File exists in modded directory but not base directory:
                    } else {
                          //If asset compare flag is checked, we can copy in new/changed assets;
                          //  files with extensions that are not common are copied regardless, to be safe
                          if ((!file.match(/\.(png|mp4|m4a|ogg|rpgmvp|rpgmvo|rpgmvm)$/i) || assetCompare) &&
                              (!file.match(/\.js$/i) || scriptCompare) ) {
                            //Copy it into the patch, it's new content
                            const patch = path.join(curr, file);
                            const newfile = path.join(ModManager._path, ModManager._patchesFolder, name, parentPath, file);
                            //Make sure requisite parent directory hierarchy exists
                            //  that the file will be written into

                            AutoDiffLogger.reportFoundNew(patch);
                            this.taskList.push([OVERWRITE, "", patch, newfile])

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
}

//add events to map 0, change event 0 in map 1, add map 2, insert map before map 3

Array.prototype.equals = function (arr) {
    return this.length == arr.length && this.every((u, i) => u === arr[i]);
}

//TODO:
//  Um... so to read into the encryption key map, converts all .exts to unencrypted. Use a bit of brainpower
//    to determine if this causes a problem/how to tell if an image needs to be decrypted... ie, I know practically
//    speaking it's a weird case, but suppose the base game has Actor1.png unencrypted, and the patch provides
//    a new, encrypted image. So, does the game go based on its data and try to load with an unencrypted name? May
//    have already addressed in other functions, but double-check

//TODO - save convert: thankfully self-switches are indexed by event ids, which shouldn't be changed easily,
//   so this is the best heuristic we could hope for.
//  The bad news is, there's still possible ways to design a game patch where this doesn't work. If there
//  are events A and B, and new event C that's only in the patch, there may be self-switches in all three,
//  but playing the way the game flows means that in the course of setting the switches in A and/or B,
//  something triggered the switch in C. But it will default to have its switches off, while A and B will
//  have the save data converted and push the play "past" the C checkpoint, locking progression


//TODO - since it changed from "read from src, write to temp", we can now add more conditions (oh boy) that first
//  check if the temp version of the file exists (to see if we're apply a 2nd, 3rd, etc patch). And if we aren't, then
//  instead of copying a json diff as "the patched file" we can alert about an error applying the diff, and abort

//TODO: main.js decrypter script currently changes file size when it decrypts, need to fix
//TODO: scripts are activated by adding <script>s to the document; have to do that when they start playing (so
//  if they start new game, like really start, after our "choose patch" extra option, or when they continue from
//  a load. More interestingly, perhaps... if they return to title and make any CHANGES, we have to do something
//  about that, see if we can *remove* or unload the script resources. If that's REALLY not possible, then we have
//  to set a flag in ModManager when the scripts are loaded/added and deactivate scripts in the mod window if that
//  flag is set.
//TODO: fix cursor thing when MOG is used
