//=============================================================================
// InheritableInventories.js
//=============================================================================

/*:
 * @plugindesc Gives enemies inventories and allows them to use items in combat.
 * @author NanaBan
 *
 * @param Drop Inventory
 * @desc If true, whatever enemies have left in their inventory at the end of a fight will
 * be added to the list of item drops. (default false) #NOT YET IMPLEMENTED
 * @default false
 *
 * @param Item Chance
 * @desc The percent chance that a useable item will be used during combat.
 * @default 1.00
 *
 * @param Use Item
 * @desc The name of the skill used for controlling when Enemies can use items. Only matters if the skill
 * names are displayed to the player upon use.
 * @default useItem
 *
 * @param Default Rating
 * @desc The default rating of using this item for enemy skill selection. By default, it is 2 less than the
 * enemy's highest rating.
 *
 * @help
 *
 * ============================================================================
 * Summary
 * ============================================================================
 *
 * The purpose of this plugin is to allow enemies to have usable items, both in
 * and out of combat, and furthermore to link these.
 *
 * ============================================================================
 * Commands
 * ============================================================================
 *
 * Plugin Commands:
 *
 * AddItem itemID troopID [quantity enemyIndex]
 * AddWeapon itemID troopID [quantity enemyIndex]
 * AddArmor itemID troopID [quantity enemyIndex]
 *
 * keywords/paramters: (not case sensitive)
 * itemId= OR i=   //data index/id of the item being added
 * troopId= OR t= OR tr=   //data index/id of the troop receiving the item; if not
 *      provided, all troops in the event will share access
 * quantity= OR num= OR q= OR n=   //number of the particular item being added
 * enemyIndex= OR e=   //index into the troop; specific enemy that will receive
 *      the item(s); if not specified, all enemies in the troop share access   
 *
 * StealItem [troopId numLimit valueLimit]
 *
 * keywords/parameters: (not case sensitive)
 * troopId= OR t= OR tr=   //data index/id of the specific troop being stolen from; if
 *      not specified, the entire event pool may be stolen from
 * numLimit= OR nL=   //upper limit to the number of items that can be stolen
 * countGive OR cg   //sets the flag for "count give", meaning that giving an
 *      item to an enemy counts towards the upper limit (false if not present)
 * valueLimit= OR vL=   //upper limit to the total value that may be stolen
 * prioritizePublic OR p   //sets the flag to prioritize the public item source;
 *      if not present, stealing steals items from specific enemies first
 * stealOnly OR st   //sets the flag so that items cannot be given/put in an enemy's
 *      inventory; if not present, both stealing and giving are possible
 * sharedOnly OR sh   //sets the flag so that ONLY items that are shared can be stolen,
 *      if not present, both shared and enemy-specific items may be stolen
 *
 * quantity defaults to 1;
 * itemID is the id number of the item to be added;
 * troopID is the id of the troop within the event that should inherit this item;
 * quantity is the number of copies of the item to be given to the enemy;
 * enemyIndex, starting from 0, is the specific enemy that will receive the item(s);
 *  if not specified, the enemy troop has shared access to the item.
 * numLimit is the upper limit of items that can be stolen in one call to steal; if
 *  not specified, there is no such limit.
 * valueLimit is the upper limit of total value (in gold) of a set of items that
 *  can be taken in one use of steal; if unspecified, there is no such limit.
 *
 * If these commands are run multiple times, they will execute multiple times - "do
 * once" behavior must be imposed externally; it can be trivially implemented with
 * self-switches. It is recommended that Add commands are always clumped into such
 * a do-once block, and that if numLimit and/or valueLimit are specified, to make
 * those limits meaningful the Steal command should be placed in a do-once block. 
 * 
 * If you want to place restrictions on when enemies use items:
 * Give them a skill called "useItem"; exactly like that, do NOT substitute
 * in the name of the particular item.
 *
 * Place the desired restrictions on when that skill is used. Set the RATING
 * of the skill to be the itemID. Since there is no longer a rating, this means
 * that it will use the item as soon as the conditions are met by default. To
 * fine tune this, use the Item Chance parameter.
 *
 * 
 * ============================================================================
 * List of Functions that are Overriden without Aliasing (To Determine Compatibility)
 * ============================================================================
 *
 * Game_Enemy.prototype.makeActions
 * Game_Enemy.prototype.selectAllActions
 *
 * ============================================================================
 * Nice-to-add-later/TODO
 * ============================================================================
 * 
 * Notetags-
 * if the user WANTS to have different use item skills for each item and keep rating,
 * have a notetag for that skill that ties it to the item it should use: <USE ITEM: itemID>
 * 
 * Make troopID an optional parameter (default it to give the accumulated items to the first troop to trigger)
 *
 * For now, this assumes enemies never take double-turns; RPGM seems to decide all enemy actions before executing
 * them, so for example if an enemy has 1 potion and 3 actions, it might still use 2 or 3 potions that turn
 *
 * Have a notetag in items that gives it's usage rating for enemy skill selection (override default)
 *
 * Finish implementing droppable/stealable "gold" (itemID = -1)
 *
 * add support for game_troop dropitems
 *
 * add parameter for whether or not troops drop their inventory items
 *
 * Might consider not supporting multiple troops per event; kind of weird, if you think about it
 *
 * Can probably alias Battle Processing 
 * ^ IMPORTANT: MAKE SURE IT WORKS WITH LateBattlers ALWAYS; if they push the enemies before we compute
 * n, that's bad, but if we try to push them after adding inventories, also very bad
 *
 * Currently, if there's an item A, and enemy 1 has A and the troop has A in its shared pool,
 * it will push A twice and have an equal chance of picking either. Should put in a parameter
 * (or something more granular, if you can think of somewhere that makes sense. Enemy notetag,
 * Troop notetag?) have a toggle for "Use proprietary items first", "use shared items first",
 * maybe even keep random as an option
 *
 * maybe add "forgiveGive" flag; the basic idea is, if you give items to an enemy, you can steal them
 * back without it counting towards the steal cap - it makes decisions more forgiving on the player.
 * The easy, not a HUGE pain in the behind/inefficient way to go about something like this would be
 * to just ADD to numLimit when you give some stuff, but then people can exploit that by giving
 * up trash items to steal more. Maybe some people like the idea of that, Indiana Jones style.
 *
 * Add visual references for valueLimit/numLimit (track progress)
 *
 */
 //=============================================================================

　　var Imported = Imported || {};
　　Imported.InheritableInventories = true;
　　var NB_Addons = NB_Addons || {}; 

  NB_Addons.parameters = PluginManager.parameters('InheritableInventories');
  NB_Addons.dropInv = eval(String(NB_Addons.parameters['Drop Inventory'] || 'false'));
  NB_Addons.itemChance = parseFloat(String(NB_Addons.parameters['Item Chance'] || '1.00'));
  NB_Addons.useItemName = String(NB_Addons.parameters['Use Item'] || 'useItem');
  NB_Addons.defaultRating = parseInt(String(NB_Addons.parameters['Default Rating']));

NB_Addons.useID = 0;
NB_Addons.activeEnemies = 0;
for (var skill in $dataSkills) {
    if (skill.name == NB_Addons.useItemName) {
        NB_Addons.useID = skill.id;
    }
}

NB_Addons.handleItemCmd = function(mapId, eventId, isAdd, type, args) {
    var numLimit; var valueLimit; var troopId;
    var quantity; var enemyIndex; var itemId;
    var countGive = false; var prioritizePublic = false; var sharedOnly = false; var stealOnly = false;
    for (var i = 0; i < args.length; ++i) {
        if (args[i].match(/(itemId|i)=(\d+)/i)) { itemId = parseInt(RegExp.$2); continue; }
        else if (args[i].match(/^(troopId|t|tr)=(\d+)$/i)) { troopId = parseInt(RegExp.$2); continue; }
        else if (args[i].match(/^(quantity|q|num|n)=(\d+)$/i)) { quantity = parseInt(RegExp.$2); continue; }
        else if (args[i].match(/^(enemyIndex|e)=(\d+)$/i)) { enemyIndex = parseInt(RegExp.$2); continue; }
        else if (args[i].match(/^(numLimit|nL)=(\d+)$/i)) { numLimit = parseInt(RegExp.$2); continue; }
        else if (args[i].match(/^(valueLimit|vL)=(\d+)$/i)) { valueLimit = parseInt(RegExp.$2); continue; }
        else if (args[i].match(/^(countGive|cg)$/i)) { countGive = true; continue; }
        else if (args[i].match(/^(prioritizePublic|p)$/i)) { prioritizePublic = true; continue; }
        else if (args[i].match(/^(stealOnly|st)$/i)) { stealOnly = true; continue; }
        else if (args[i].match(/^(sharedOnly|sh)$/i)) { sharedOnly = true; }
    }

    if (isAdd) this.addItem(mapId, eventId, type, itemId, troopId, quantity, enemyIndex);
    else this.stealItem(mapId, eventId, troopId, numLimit, valueLimit, countGive, prioritizePublic, stealOnly, sharedOnly);
};

var _ii_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_ii_pluginCommand.call(this, command, args);
	if (command === "AddItem")  { NB_Addons.handleItemCmd(this._mapId,this.eventId(),true,0,args); };
    if (command === "AddWeapon")  { NB_Addons.handleItemCmd(this._mapId,this.eventId(),true,1,args); };
    if (command === "AddArmor")  { NB_Addons.handleItemCmd(this._mapId,this.eventId(),true,2,args); };
	if (command === "StealItem")  { NB_Addons.handleItemCmd(this._mapId,this.eventId(),false,3,args); };
	return true;
};

//build up dictionary of dictionaries of dictionaries, since game_party inventory operations are based
//on dictionaries where the keys are itemIDs and the values and the quantity.
//Each enemy in the troop

NB_Addons.addItem = function(mapId, eventID, type, itemID, troopID, quantity, enemyIndex) {
    var inv; var typename = '';
    if (!quantity) quantity = 1;
    if (enemyIndex === undefined) { enemyIndex = -2; }
    //since merging is a pain in the ass, won't support this for now
    if (!troopID) troopID = -1;

    if (!$gameMap.inv) $gameMap.inv = {};
    if (!$gameMap.inv[mapId]) $gameMap.inv[mapId] = {};
    if (!$gameMap.inv[mapId][eventID]) $gameMap.inv[mapId][eventID] = {};
    switch (type) {
        case 0: typename = "items"; break;
        case 1: typename = "weapons"; break;
        case 2: typename = "armors"; break;
        default: return;
    }
    var num = quantity.clamp(0, $gameParty.maxItems());
    inv = $gameMap.inv[mapId][eventID];

    if (!inv[troopID]) inv[troopID] = {};
    if (!inv[troopID][enemyIndex]) inv[troopID][enemyIndex] = {}; //clamp quantity between 0 and max items
    if (!inv[troopID][enemyIndex][typename]) inv[troopID][enemyIndex][typename] = {};
    if (!inv[troopID][enemyIndex][typename][itemID]) inv[troopID][enemyIndex][typename][itemID] = num;
    else {
        if (inv[troopID][enemyIndex][typename][itemID]) {
            var newQ = (inv[troopID][enemyIndex][typename][itemID]+quantity);
            newQ = newQ.clamp(0, $gameParty.maxItems());
            if (newQ == 0) delete inv[troopID][enemyIndex][typename][itemID]; //delete if item count reaches 0
            else inv[troopID][enemyIndex][typename][itemID] = newQ;
            return;
        } inv[troopID][enemyIndex][typename][itemID] = num;
    }
};

// Battle Processing
var _ii_battle_processing = Game_Interpreter.prototype.command301;
Game_Interpreter.prototype.command301 = function() {
    //added this next bit for possible future compatibility with "Late Battlers"
    if ($gameParty.inBattle()) {n = $gameTroop.members.length;}
    _ii_battle_processing.call(this);
    var troopId = $gameTroop._troopId; //in original they check if ($dataTroops[troopId]); I'll assume we don't need to
    if ($gameMap.inv) {
        var eve = $gameMap.inv[this._mapId][this.eventId()];
        //figure out what to do with troopID -1 stuff here
        this._lastTroop = troopId;
        var enemies = $gameTroop._enemies;
        //shared
        if (eve[troopId]["-2"]) $gameTroop.inv = eve[troopId]["-2"];
        for (var i = NB_Addons.activeEnemies; i < enemies.length; ++i) { //only do this for battlers being added. Have to hoise it out of the !inBattle
            enemies[i].inv = eve[troopId][i]; //region, part of aliasing. Basically, if the troop exists, we always try to add inventory; probably AFTER
            if (!enemies[i].inv) enemies[i].inv = {"items":{}, "weapons":{}, "armors":{}};
        } NB_Addons.activeEnemies = enemies.length;
    }
    return true;
};

// If Win
var _ii_gi_command601 = Game_Interpreter.prototype.command601;
Game_Interpreter.prototype.command601 = function() {
    //may want to rework this later?
    if (this._branch[this._indent] == 0) {
        var eve = $gameMap.inv[this._mapId][this.eventId()];
        eve[this._lastTroop] = {};
        this._lastTroop = -1;
    }
    NB_Addons.activeEnemies = 0;
    return _ii_gi_command601.call(this);
};

// If Escape
var _ii_gi_command602 = Game_Interpreter.prototype.command602;
Game_Interpreter.prototype.command602 = function() {
    if (this._branch[this._indent] == 1) {
        var eve = $gameMap.inv[this._mapId][this.eventId()][this._lastTroop] || {};
        //have to check that $gameTroop is not killed before we get here, else have to use
        //$dataTroops[this._lastTroop], but that won't work with the plugin that makes enemies
        //be able to walk into an active fight
        eve[-2] = $gameTroop.inv;
        var enemies = $gameTroop.members();
        for (var i = 0; i < enemies.length; ++i) {
            eve[i] = enemies[i].inv;
        }
        this._lastTroop = -1;
    }
    NB_Addons.activeEnemies = 0;
    return _ii_gi_command602.call(this);;
};

// If Lose
var _ii_gi_command603 = Game_Interpreter.prototype.command603;
Game_Interpreter.prototype.command603 = function() {
    if (this._branch[this._indent] == 2) {
        var eve = $gameMap.inv[this._mapId][this.eventId()][this._lastTroop] || {};
        //have to check that $gameTroop is not killed before we get here, else have to use
        //$dataTroops[this._lastTroop], but that won't work with the plugin that makes enemies
        //be able to walk into an active fight
        eve[-2] = $gameTroop.inv;
        var enemies = $gameTroop.members();
        for (var i = 0; i < enemies.length; ++i) {
            eve[i] = enemies[i].inv;
        }
        this._lastTroop = -1;
    }
    NB_Addons.activeEnemies = 0;
    return _ii_gi_command603.call(this);;
};

//ALL OF THE SECTION BELOW IS TO SUPPORT ENEMIES USING ITEMS

var _ii_game_battler_consume_item = Game_Battler.prototype.consumeItem;
Game_Battler.prototype.consumeItem = function(item) {
    if (this.isActor()) _ii_game_battler_consume_item.call(this, item);
    else {
        this.inv["items"][item] -= 1;
        if (this.inv["items"][item] == 0) {
            delete this.inv["items"][item];
        }
    }
};

Game_Troop.prototype.consumeItem = function(item) {
    this.inv["items"][item] -= 1;
    if (this.inv["items"][item] == 0) {
        delete this.inv["items"][item];
    }
};

var _ii_game_enemy_isactionvalid = Game_Enemy.prototype.isActionValid;
Game_Enemy.prototype.isActionValid = function(action) {
    if (action.itypeId === undefined)  { return _ii_game_enemy_isactionvalid.call(this, action); }
    else return true;
};
var _ii_game_enemy_selectaction = Game_Enemy.prototype.selectAction;
Game_Enemy.prototype.selectAction = function(actionList, ratingZero) {
    //do Use Item check here
    for (var i = 0; i < actionList.length; ++i) { //if it has the useItem skill and has the item for it
        if (($dataSkills[actionList[i].skillId].name == NB_Addons.useItemName) && this.inv["items"][actionList[i].rating]) {
            if (Math.random() < NB_Addons.itemChance)
                return $dataItems[actionList[i].rating];
        }
    }
    return _ii_game_enemy_selectaction.call(this, actionList, ratingZero);
};

Game_Enemy.prototype.selectAllActions = function(actionList) {
    var ratingMax = Math.max.apply(null, actionList.map(function(a) {
        return a.rating;
    }));
    var ratingZero = ratingMax - 3;
    actionList = actionList.filter(function(a) {
        return (a.rating > ratingZero) || ($dataSkills[a.skillId].name == NB_Addons.useItemName); //had to edit :(
    });
    for (var i = 0; i < this.numActions(); i++) {
        this.action(i).setEnemyAction(this.selectAction(actionList, ratingZero));
    }
};

//may not be able to alias this
Game_Enemy.prototype.makeActions = function() {
    Game_Battler.prototype.makeActions.call(this);
    if (this.numActions() > 0) {
        var actionList = this.enemy().actions.filter(function(act) {return true;}); //added filter to make it
        //a copy and not the actual json object
        //added start
        var ratingMax = Math.max.apply(null, actionList.map(function(a) {
        return a.rating;
        })); //redundant with selectAllActions :(

        var useItemReserved = {};
        for (var i = 0; i < actionList.length; ++i) { //if we want to only use the item under certain conditions,
            if ($dataSkills[actionList[i].skillId].name == NB_Addons.useItemName) { //take it out of regular action pool
                useItemReserved[actionList[i].rating] = true;
            }
        }

        //shared
        if ($gameTroop.inv && $gameTroop.inv["items"]) {
            for (var item in $gameTroop.inv["items"]) {
                //if the option isn't already represented with Use Item, if we have the item, and it isn't Gold
                if (!useItemReserved[parseInt(item)] && ($gameTroop.inv["items"][item] > 0) && (parseInt(item) != -1)) {
                    var actItem = $dataItems[item];
                    actItem.rating = ratingMax - 2;
                    actItem.shared = true;
                    actionList.push(actItem);
                }
            }
        }
        //proprietary
        if (this.inv["items"]) {
            for (var item in this.inv["items"]) {
                //if the option isn't already represented with Use Item, if we have the item, and it isn't Gold
                if (!useItemReserved[parseInt(item)] && (this.inv["items"][item] > 0) && (parseInt(item) != -1)) {
                    var actItem = $dataItems[item];
                    actItem.rating = ratingMax - 2;
                    actionList.push(actItem);
                }
            }
        } 
        //added end
        actionList = actionList.filter(function(a) {
            return this.isActionValid(a);
        }, this);
        if (actionList.length > 0) {
            this.selectAllActions(actionList);
        }
    }
    this.setActionState('waiting');
};

var _ii_game_action_setenemyaction = Game_Action.prototype.setEnemyAction;
Game_Action.prototype.setEnemyAction = function(action) {
    if (action && action.itypeId) {
        this.setItem(action.id);
        if (action.shared) $gameTroop.consumeItem(action.id);
        else this.subject().consumeItem(action.id);
    } else _ii_game_action_setenemyaction.call(this, action);
};

//for Window_Steal
NB_Addons.convertType = function(type) {
    if (type == "items") return 0;
    if (type == "weapons") return 1;
    if (type == "armors") return 2;
    return -1;
}
NB_Addons.getType = function(item) {
    if (DataManager.isItem(item)) {
        return "0";
    } else if (DataManager.isWeapon(item)) {
        return "1";
    } else if (DataManager.isArmor(item)) {
        return "2";
    }
    return "0"; //why not
}

NB_Addons.stealItem = function(mapId, eventId, troopId, numLimit, valueLimit, countGive, prioritizePublic, stealOnly, sharedOnly) {
    if (!$gameParty.inBattle()) {
        var goods = []; var goods_list = {};
        var inventories = [];
        var public;
        var inv = $gameMap.inv;
        if (inv) { //not sure how "for in" works, may need to do "enemy in inv[troop], etc"
            inv = inv[mapId];
            if (inv) {
                inv = inv[eventId];
                if (inv) {
                    if (!troopId || troopId == -1) { //should never be 0, right?
                        for (var troop in inv) {
                            if (!inv[troop]["-2"]) inv[troop]["-2"] = {}; //set this up in case of "give"
                            for (var enemy in inv[troop]) {
                                if (enemy == "-2") {
                                    public = troop["-2"];
                                }
                                inventories.push(inv[troop][enemy]);
                                for (var type in inv[troop][enemy]) {
                                    for (var item in inv[troop][enemy][type]) {
                                        //[itemId, Quantity, Item/Weapon/Armor]
                                        if (!goods_list[item]) goods_list[item] = {};
                                        if (!goods_list[item][this.convertType(type)])
                                            goods_list[item][this.convertType(type)] = inv[troop][enemy][type][item];
                                        else goods_list[item][this.convertType(type)] += inv[troop][enemy][type][item];
                                    }
                                }
                            }
                        }
                    } else {
                        var troop;
                        troop = inv[troopId];
                        if (!troop["-2"]) troop["-2"] = {}; //set this up in case of "give"
                        for (var enemy in troop) {
                            if (enemy == "-2") {
                                public = troop["-2"];
                            }
                            inventories.push(troop[enemy]);
                            for (var type in troop[enemy]) {
                                for (var item in troop[enemy][type]) {
                                    //[itemId, Quantity, Item/Weapon/Armor]
                                    if (!goods_list[item]) goods_list[item] = {};
                                    if (!goods_list[item][this.convertType(type)])
                                        goods_list[item][this.convertType(type)] = troop[enemy][type][item];
                                    else goods_list[item][this.convertType(type)] += troop[enemy][type][item];
                                }
                            }
                        }
                    }
                    for (var item in goods_list) {
                        for (var type in goods_list[item]) {
                            goods.push([parseInt(type), parseInt(item), 1, goods_list[item][type]]);
                        }
                    }
                    SceneManager.push(Scene_Steal);
                    SceneManager.prepareNextScene(goods, goods_list, inventories, public, numLimit, valueLimit, stealOnly, prioritizePublic, countGive);
                }
            }
        }
    }
};

//-----------------------------------------------------------------------------
// Scene_Steal
//
// The scene class of the shop screen, modified slightly for our purposes.

function Scene_Steal() {
    this.initialize.apply(this, arguments);
}

Scene_Steal.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Steal.prototype.constructor = Scene_Steal;

Scene_Shop.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Steal.prototype.prepare = function(goods, goods_list, inventories, shared, numLimit, valueLimit, stealOnly, prioritizePublic, countGive) {
    this._goods = goods;
    this._goods_list = goods_list;
    this._inventories = inventories;
    this._shared = shared;
    this._purchaseOnly = stealOnly;
    this._numLimit = numLimit;
    this._valueLimit = valueLimit;
    this._prioritizePublic = prioritizePublic;
    this._item = null;
    this._countGive = countGive;
};

Scene_Steal.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createGoldWindow();
    this.createCommandWindow();
    this.createDummyWindow();
    this.createNumberWindow();
    this.createStatusWindow();
    this.createBuyWindow();
    this.createCategoryWindow();
    this.createSellWindow();
};

Scene_Steal.prototype.createGoldWindow = function() {
    this._goldWindow = new Window_Gold(0, this._helpWindow.height);
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
    this.addWindow(this._goldWindow);
};

Scene_Steal.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_StealCommand(this._goldWindow.x, this._purchaseOnly);
    this._commandWindow.y = this._helpWindow.height;
    this._commandWindow.setHandler('buy',    this.commandBuy.bind(this));
    this._commandWindow.setHandler('sell',   this.commandSell.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Steal.prototype.createDummyWindow = function() {
    var wy = this._commandWindow.y + this._commandWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._dummyWindow = new Window_Base(0, wy, Graphics.boxWidth, wh);
    this.addWindow(this._dummyWindow);
};

Scene_Steal.prototype.createNumberWindow = function() {
    var wy = this._dummyWindow.y;
    var wh = this._dummyWindow.height;
    this._numberWindow = new Window_StealNumber(0, wy, wh, this._valueLimit, this._numLimit);
    this._numberWindow.hide();
    this._numberWindow.setHandler('ok',     this.onNumberOk.bind(this));
    this._numberWindow.setHandler('cancel', this.onNumberCancel.bind(this));
    this.addWindow(this._numberWindow);
};

Scene_Steal.prototype.createStatusWindow = function() {
    var wx = this._numberWindow.width;
    var wy = this._dummyWindow.y;
    var ww = Graphics.boxWidth - wx;
    var wh = this._dummyWindow.height;
    this._statusWindow = new Window_ShopStatus(wx, wy, ww, wh);
    this._statusWindow.hide();
    this.addWindow(this._statusWindow);
};

Scene_Steal.prototype.createBuyWindow = function() {
    var wy = this._dummyWindow.y;
    var wh = this._dummyWindow.height;
    this._buyWindow = new Window_Steal(0, wy, wh, this._goods, this._valueLimit);
    this._buyWindow.setHelpWindow(this._helpWindow);
    this._buyWindow.setStatusWindow(this._statusWindow);
    this._buyWindow.hide();
    this._buyWindow.setHandler('ok',     this.onBuyOk.bind(this));
    this._buyWindow.setHandler('cancel', this.onBuyCancel.bind(this));
    this.addWindow(this._buyWindow);
};

Scene_Steal.prototype.createCategoryWindow = function() {
    this._categoryWindow = new Window_ItemCategory();
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.y = this._dummyWindow.y;
    this._categoryWindow.hide();
    this._categoryWindow.deactivate();
    this._categoryWindow.setHandler('ok',     this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
    this.addWindow(this._categoryWindow);
};

Scene_Steal.prototype.createSellWindow = function() {
    var wy = this._categoryWindow.y + this._categoryWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._sellWindow = new Window_ShopSell(0, wy, Graphics.boxWidth, wh);
    this._sellWindow.setHelpWindow(this._helpWindow);
    this._sellWindow.hide();
    this._sellWindow.setHandler('ok',     this.onSellOk.bind(this));
    this._sellWindow.setHandler('cancel', this.onSellCancel.bind(this));
    this._categoryWindow.setItemWindow(this._sellWindow);
    this.addWindow(this._sellWindow);
};

Scene_Steal.prototype.activateBuyWindow = function() {
    this._buyWindow.setMoney(this.money());
    this._buyWindow.show();
    this._buyWindow.activate();
    this._statusWindow.show();
};

Scene_Steal.prototype.activateSellWindow = function() {
    this._categoryWindow.show();
    this._sellWindow.refresh();
    this._sellWindow.show();
    this._sellWindow.activate();
    this._statusWindow.hide();
};

Scene_Steal.prototype.commandBuy = function() {
    this._dummyWindow.hide();
    this.activateBuyWindow();
};

Scene_Steal.prototype.commandSell = function() {
    this._dummyWindow.hide();
    this._categoryWindow.show();
    this._categoryWindow.activate();
    this._sellWindow.show();
    this._sellWindow.deselect();
    this._sellWindow.refresh();
};

Scene_Steal.prototype.onBuyOk = function() {
    this._item = this._buyWindow.item();
    this._buyWindow.hide();
    this._numberWindow.setup(this._item, this.maxBuy(), this.buyingPrice());
    this._numberWindow.setCurrencyUnit(this.currencyUnit());
    this._numberWindow.show();
    this._numberWindow.activate();
};

Scene_Steal.prototype.onBuyCancel = function() {
    this._commandWindow.activate();
    this._dummyWindow.show();
    this._buyWindow.hide();
    this._statusWindow.hide();
    this._statusWindow.setItem(null);
    this._helpWindow.clear();
};

Scene_Steal.prototype.onCategoryOk = function() {
    this.activateSellWindow();
    this._sellWindow.select(0);
};

Scene_Steal.prototype.onCategoryCancel = function() {
    this._commandWindow.activate();
    this._dummyWindow.show();
    this._categoryWindow.hide();
    this._sellWindow.hide();
};

Scene_Steal.prototype.onSellOk = function() {
    this._item = this._sellWindow.item();
    this._categoryWindow.hide();
    this._sellWindow.hide();
    this._numberWindow.setup(this._item, this.maxSell(), this.sellingPrice());
    this._numberWindow.setCurrencyUnit(this.currencyUnit());
    this._numberWindow.show();
    this._numberWindow.activate();
    this._statusWindow.setItem(this._item);
    this._statusWindow.show();
};

Scene_Steal.prototype.onSellCancel = function() {
    this._sellWindow.deselect();
    this._categoryWindow.activate();
    this._statusWindow.setItem(null);
    this._helpWindow.clear();
};

Scene_Steal.prototype.onNumberOk = function() {
    SoundManager.playShop();
    switch (this._commandWindow.currentSymbol()) {
    case 'buy':
        this.doBuy(this._numberWindow.number());
        break;
    case 'sell':
        this.doSell(this._numberWindow.number());
        break;
    }
    this.endNumberInput();
    this._goldWindow.refresh();
    this._statusWindow.refresh();
};

Scene_Steal.prototype.onNumberCancel = function() {
    SoundManager.playCancel();
    this.endNumberInput();
};

NB_Addons.doRemoveItem = function(number, inv, type, typeNum, itemId, goods_list, goods) {
    var quantity = 0;
    var goods_index = 0;
    for (var i = 0; i < goods.length; ++i) {
        if (goods[i][0] == parseInt(typeNum) && goods[i][1] == parseInt(itemId)) {
            goods_index = i; break;
        }
    }
    if (inv[type]) {
        if (inv[type][itemId]) {
            quantity = inv[type][itemId];
            if (quantity > number) {
                inv[type][itemId] -= number;
                goods_list[itemId][typeNum] -= number;
                for (var i = 0; i < goods.length; ++i) {
                    if (goods[i][0] == parseInt(typeNum) && goods[i][1] == parseInt(itemId)) {
                        goods[i][3] -= number;
                        break;
                    }
                }
                return number;
            } else if (quantity == number) {
                delete inv[type][itemId];
                goods_list[itemId][typeNum] -= number;
                if (goods_list[itemId][typeNum] == 0) {
                    delete goods_list[itemId][typeNum];
                    goods.splice(goods_index,1);
                } return number;
            } else { //quantity < number
                delete inv[type][itemId];
                goods_list[itemId][typeNum] -= number;
                if (goods_list[itemId][typeNum] == 0) {
                    delete goods_list[itemId][typeNum];
                    goods.splice(goods_index,1);
                } return quantity;
            }
        }
    } return 0;
};

//Here's the important part
Scene_Steal.prototype.doBuy = function(number) {
    //$gameParty.loseGold(number * this.buyingPrice());
    $gameParty.gainItem(this._item, number);
    if (this._numLimit) this._numLimit -= number;
    if (this._valueLimit) this._buyWindow._valueLimit -= number*(this._item.price);
    if (this._valueLimit) this._numberWindow._valueLimit -= number*(this._item.price);
    this._numberWindow._stolenItems += number;
    var type; var typeNum;
    if (DataManager.isItem(this._item)) {
        type = "items"; typeNum = "0";
    } else if (DataManager.isWeapon(this._item)) {
        type = "weapons"; typeNum = "1";
    } else if (DataManager.isArmor(this._item)) {
        type = "armors"; typeNum = "2";
    }
    if (this._prioritizePublic) {
        number -= NB_Addons.doRemoveItem(number, this._shared, type, typeNum, this._item.id, this._goods_list, this._goods)
        if (number == 0) { 
            this._buyWindow.refresh(); this.checkContinue(); return;
        } else {
            for (var i = 0; i < this._inventories.length; ++i) {
                number -= NB_Addons.doRemoveItem(number, this._inventories[i], type, typeNum, this._item.id, this._goods_list, this._goods) 
                if (number == 0) {
                    this._buyWindow.refresh(); this.checkContinue(); return;
                }
            }
        }
    } else {
        for (var i = 0; i < this._inventories.length; ++i) {
            number -= NB_Addons.doRemoveItem(number, this._inventories[i], type, typeNum, this._item.id, this._goods_list, this._goods)
            if (number == 0) {
                this._buyWindow.refresh(); this.checkContinue(); return;
            }
        }
        number -= NB_Addons.doRemoveItem(number, this._shared, type, typeNum, this._item.id, this._goods_list, this._goods)
        if (number == 0) { 
            this._buyWindow.refresh();  this.checkContinue(); return;
        }
    }
};

//Here's the other important part
Scene_Steal.prototype.doSell = function(number) {
    $gameParty.loseItem(this._item, number);
    var type; var typeNum;
    if (DataManager.isItem(this._item)) {
        type = "items"; typeNum = "0";
    } else if (DataManager.isWeapon(this._item)) {
        type = "weapons"; typeNum = "1";
    } else if (DataManager.isArmor(this._item)) {
        type = "armors"; typeNum = "2";
    }
    if (!this._shared[type]) this._shared[type] = {};
    if (!this._shared[type][this._item.id]) this._shared[type][this._item.id] = number;
    else this._shared[type][this._item.id] += number;
    if (!this._goods_list[this._item.id]) this._goods_list[this._item.id] = {};
    if (!this._goods_list[this._item.id][typeNum]) { this._goods_list[this._item.id][typeNum] = number;
        this._goods.push([0, this._item.id]);
    } else this._goods_list[this._item.id][typeNum] += number;
    var goods_index = 0;
    for (var i = 0; i < this._goods.length; ++i) {
        if (this._goods[i][0] == parseInt(typeNum) && this._goods[i][1] == this._item.id) {
            goods_index = i; break;
        }
    } this._goods[goods_index][3] += number;
    if (this._countGive) this._numLimit -= number;
    this.checkContinue();
};

Scene_Steal.prototype.checkContinue = function() {
    if (this._numLimit == 0) { this.popScene(); return; }
    for (var i = 0; i < this._goods.length; ++i) {
        if (this._goods[i][0] == 0) {
            if ($dataItems[this._goods[i][1]].price >= this.valueLimit) { return; }
        } else if (this._goods[i][0] == 1) {
            if ($dataWeapons[this._goods[i][1]].price >= this.valueLimit) { return; }
        } else if (this._goods[i][0] == 2) {
            if ($dataArmors[this._goods[i][1]].price >= this.valueLimit) { return; }
        }
    } //if we've made it here, cannot "afford" to steal anything else
    if ((!this._purchaseOnly) && ($gameParty.allItems().length > 0)) return; //can give
    this.popScene();
};

Scene_Steal.prototype.endNumberInput = function() {
    this._numberWindow.hide();
    switch (this._commandWindow.currentSymbol()) {
    case 'buy':
        this.activateBuyWindow();
        break;
    case 'sell':
        this.activateSellWindow();
        break;
    }
};

Scene_Steal.prototype.maxBuy = function() {
    var max = Math.min(($gameParty.maxItems(this._item) - $gameParty.numItems(this._item)), this._goods_list[this._item.id][NB_Addons.getType(this._item)]);
    if (this._numLimit) max = Math.min(this._numLimit, max);
    if (this._valueLimit && (this._item.price > 0)) max = Math.min(max, Math.floor(this._valueLimit / this._item.price))
    return max;
};

Scene_Steal.prototype.maxSell = function() {
    var maxSell = $gameParty.numItems(this._item);
    if (this._countGive) maxSell = Math.min(maxSell, this._numLimit);
    return maxSell;
};

Scene_Steal.prototype.money = function() {
    return this._goldWindow.value();
};

Scene_Steal.prototype.currencyUnit = function() {
    return this._goldWindow.currencyUnit();
};

Scene_Steal.prototype.buyingPrice = function() {
    return 0;//this._buyWindow.price(this._item);
};

Scene_Steal.prototype.sellingPrice = function() {
    return 0;//Math.floor(this._item.price / 2);
};

//-----------------------------------------------------------------------------
// Window_ShopCommand
//
// The window for selecting buy/sell on the shop screen.

function Window_StealCommand() {
    this.initialize.apply(this, arguments);
}

Window_StealCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_StealCommand.prototype.constructor = Window_StealCommand;

Window_StealCommand.prototype.initialize = function(width, purchaseOnly) {
    this._windowWidth = width;
    this._purchaseOnly = purchaseOnly;
    Window_HorzCommand.prototype.initialize.call(this, 0, 0);
};

Window_StealCommand.prototype.windowWidth = function() {
    return this._windowWidth;
};

Window_StealCommand.prototype.maxCols = function() {
    return 3;
};

Window_StealCommand.prototype.makeCommandList = function() {
    this.addCommand("Steal",    'buy');
    this.addCommand("Give",   'sell',   !this._purchaseOnly);
    this.addCommand(TextManager.cancel, 'cancel');
};

//-----------------------------------------------------------------------------
// Window_Steal
//
// The window for selecting an item to buy on the shop screen.

function Window_Steal() {
    this.initialize.apply(this, arguments);
}

Window_Steal.prototype = Object.create(Window_Selectable.prototype);
Window_Steal.prototype.constructor = Window_Steal;

Window_Steal.prototype.initialize = function(x, y, height, shopGoods, valueLimit) {
    var width = this.windowWidth();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._shopGoods = shopGoods;
    this._valueLimit = valueLimit;
    this._money = 0;
    this.refresh();
    this.select(0);
};

Window_Steal.prototype.windowWidth = function() {
    return 456;
};

Window_Steal.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_Steal.prototype.item = function() {
    return this._data[this.index()];
};

Window_Steal.prototype.setMoney = function(money) {
    this._money = money;
    this.refresh();
};

Window_Steal.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this._data[this.index()]);
};

Window_Steal.prototype.price = function(item) {
    return this._price[this._data.indexOf(item)] || 0;
};

Window_Steal.prototype.isEnabled = function(item) {
    if (this._valueLimit) return this._valueLimit > item.price;
    else return true;
};

Window_Steal.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};

Window_Steal.prototype.makeItemList = function() {
    this._data = [];
    this._price = [];
    this._shopGoods.forEach(function(goods) {
        var item = null;
        switch (goods[0]) {
        case 0:
            item = $dataItems[goods[1]];
            break;
        case 1:
            item = $dataWeapons[goods[1]];
            break;
        case 2:
            item = $dataArmors[goods[1]];
            break;
        }
        if (item) {
            this._data.push(item);
            this._price.push(goods[2] === 0 ? item.price : goods[3]);
        }
    }, this);
};

Window_Steal.prototype.drawItem = function(index) {
    var item = this._data[index];
    var rect = this.itemRect(index);
    var priceWidth = 96;
    rect.width -= this.textPadding();
    this.changePaintOpacity(this.isEnabled(item));
    this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
    this.drawText(this.price(item), rect.x + rect.width - priceWidth,
                  rect.y, priceWidth, 'right');
    this.changePaintOpacity(true);
};

Window_Steal.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};

Window_Steal.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
    if (this._statusWindow) {
        this._statusWindow.setItem(this.item());
    }
};

//-----------------------------------------------------------------------------
// Window_StealNumber
//
// The window for inputting quantity of items to buy or sell on the shop
// screen.

function Window_StealNumber() {
    this.initialize.apply(this, arguments);
}

Window_StealNumber.prototype = Object.create(Window_Selectable.prototype);
Window_StealNumber.prototype.constructor = Window_StealNumber;

Window_StealNumber.prototype.initialize = function(x, y, height, valueLimit, numLimit) {
    var width = this.windowWidth();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._item = null;
    this._max = 1;
    this._price = 0;
    this._number = 1;
    this._currencyUnit = TextManager.currencyUnit;
    this._valueLimit = valueLimit;
    this._numLimit = numLimit;
    this._stolenItems = 0;
    this.createButtons();
};

Window_StealNumber.prototype.windowWidth = function() {
    return 456;
};

Window_StealNumber.prototype.number = function() {
    return this._number;
};

Window_StealNumber.prototype.setup = function(item, max, price) {
    this._item = item;
    this._max = Math.floor(max);
    this._price = item.price;
    this._number = 1;
    this.placeButtons();
    this.updateButtonsVisiblity();
    this.refresh();
};

Window_StealNumber.prototype.setCurrencyUnit = function(currencyUnit) {
    this._currencyUnit = currencyUnit;
    this.refresh();
};

Window_StealNumber.prototype.createButtons = function() {
    var bitmap = ImageManager.loadSystem('ButtonSet');
    var buttonWidth = 48;
    var buttonHeight = 48;
    this._buttons = [];
    for (var i = 0; i < 5; i++) {
        var button = new Sprite_Button();
        var x = buttonWidth * i;
        var w = buttonWidth * (i === 4 ? 2 : 1);
        button.bitmap = bitmap;
        button.setColdFrame(x, 0, w, buttonHeight);
        button.setHotFrame(x, buttonHeight, w, buttonHeight);
        button.visible = false;
        this._buttons.push(button);
        this.addChild(button);
    }
    this._buttons[0].setClickHandler(this.onButtonDown2.bind(this));
    this._buttons[1].setClickHandler(this.onButtonDown.bind(this));
    this._buttons[2].setClickHandler(this.onButtonUp.bind(this));
    this._buttons[3].setClickHandler(this.onButtonUp2.bind(this));
    this._buttons[4].setClickHandler(this.onButtonOk.bind(this));
};

Window_StealNumber.prototype.placeButtons = function() {
    var numButtons = this._buttons.length;
    var spacing = 16;
    var totalWidth = -spacing;
    for (var i = 0; i < numButtons; i++) {
        totalWidth += this._buttons[i].width + spacing;
    }
    var x = (this.width - totalWidth) / 2;
    for (var j = 0; j < numButtons; j++) {
        var button = this._buttons[j];
        button.x = x;
        button.y = this.buttonY();
        x += button.width + spacing;
    }
};

Window_StealNumber.prototype.updateButtonsVisiblity = function() {
    if (TouchInput.date > Input.date) {
        this.showButtons();
    } else {
        this.hideButtons();
    }
};

Window_StealNumber.prototype.showButtons = function() {
    for (var i = 0; i < this._buttons.length; i++) {
        this._buttons[i].visible = true;
    }
};

Window_StealNumber.prototype.hideButtons = function() {
    for (var i = 0; i < this._buttons.length; i++) {
        this._buttons[i].visible = false;
    }
};

Window_StealNumber.prototype.refresh = function() {
    this.contents.clear();
    this.drawItemName(this._item, 0, this.itemY());
    this.drawMultiplicationSign();
    this.drawNumber();
    this.drawTotalPrice();
};

Window_StealNumber.prototype.drawMultiplicationSign = function() {
    var sign = '\u00d7';
    var width = this.textWidth(sign);
    var x = this.cursorX() - width * 2;
    var y = this.itemY();
    this.resetTextColor();
    this.drawText(sign, x, y, width);
};

Window_StealNumber.prototype.drawNumber = function() {
    var x = this.cursorX();
    var y = this.itemY();
    var width = this.cursorWidth() - this.textPadding();
    this.resetTextColor();
    this.drawText(this._number, x, y, width, 'right');
};

Window_StealNumber.prototype.drawTotalPrice = function() {
    var width = this.contentsWidth() - this.textPadding();
    var pad = 0;
    if (this._valueLimit) {
        pad = this.lineHeight() * 1.5;
        var total = this._valueLimit - (this._number*this._price);
        this.drawCurrencyValue("Value Remaining: "+total.toString(), this._currencyUnit, 0, this.priceY(), width);
        this.resetTextColor();
    }
    if (this._numLimit) {
        var total = this._stolenItems + this._number;
        this.drawText("Items Stolen: "+total.toString()+" / "+this._numLimit.toString(), 0, this.priceY()+pad, width, 'right');
    }
};

Window_StealNumber.prototype.itemY = function() {
    return Math.round(this.contentsHeight() / 2 - this.lineHeight() * 1.5);
};

Window_StealNumber.prototype.priceY = function() {
    return Math.round(this.contentsHeight() / 2 + this.lineHeight() / 2);
};

Window_StealNumber.prototype.buttonY = function() {
    return Math.round(this.priceY() + this.lineHeight() * 2.5);
};

Window_StealNumber.prototype.cursorWidth = function() {
    var digitWidth = this.textWidth('0');
    return this.maxDigits() * digitWidth + this.textPadding() * 2;
};

Window_StealNumber.prototype.cursorX = function() {
    return this.contentsWidth() - this.cursorWidth() - this.textPadding();
};

Window_StealNumber.prototype.maxDigits = function() {
    return 2;
};

Window_StealNumber.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    this.processNumberChange();
};

Window_StealNumber.prototype.isOkTriggered = function() {
    return Input.isTriggered('ok');
};

Window_StealNumber.prototype.playOkSound = function() {
};

Window_StealNumber.prototype.processNumberChange = function() {
    if (this.isOpenAndActive()) {
        if (Input.isRepeated('right')) {
            this.changeNumber(1);
        }
        if (Input.isRepeated('left')) {
            this.changeNumber(-1);
        }
        if (Input.isRepeated('up')) {
            this.changeNumber(10);
        }
        if (Input.isRepeated('down')) {
            this.changeNumber(-10);
        }
    }
};

Window_StealNumber.prototype.changeNumber = function(amount) {
    var lastNumber = this._number;
    this._number = (this._number + amount).clamp(1, this._max);
    if (this._number !== lastNumber) {
        SoundManager.playCursor();
        this.refresh();
    }
};

Window_StealNumber.prototype.updateCursor = function() {
    this.setCursorRect(this.cursorX(), this.itemY(),
                       this.cursorWidth(), this.lineHeight());
};

Window_StealNumber.prototype.onButtonUp = function() {
    this.changeNumber(1);
};

Window_StealNumber.prototype.onButtonUp2 = function() {
    this.changeNumber(10);
};

Window_StealNumber.prototype.onButtonDown = function() {
    this.changeNumber(-1);
};

Window_StealNumber.prototype.onButtonDown2 = function() {
    this.changeNumber(-10);
};

Window_StealNumber.prototype.onButtonOk = function() {
    this.processOk();
};
