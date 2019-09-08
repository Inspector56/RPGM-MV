//=============================================================================
// LateArrivals.js
//=============================================================================

/*:
 * @plugindesc Makes time pass during combat (ie, enemies will move); enemies can enter combat "late".
 * @author NanaBan
 *
 * @param ATB Period
 * @desc The total amount of CP/Action Points in a Period based on an ATB combat system.
 * @default 1000
 *
 * @param ATB Unit
 * @desc The 'agility' of the battle manager; represents the rate at which the ATB Period parameter
 * is reached. (This plugin assumes that the Moghunter ATB system is being used)
 * @default 100
 *
 * @param Rounds
 * @desc The number of full combat rounds in a Period, based on standard (turn-based) combat.
 * @default 3
 *
 * @param Turns
 * @desc The number of individual battler turns in a Period, based on standard (turn-based) combat.
 * @default 6
 *
 * @param Unit System
 * @desc Pick 'atb', 'rounds', or 'turns' to use that time metric.
 * @default rounds
 *
 * @param Tick Rate
 * @desc How many frames/calls to 'update' are invoked every time a Period elapses.
 * @default 60
 *
 * @param Max Troop Size
 * @desc The maximum number of enemies that can be in a battle at any one time; other enemies will
 * simply wait patiently beside the player. Currently it is very crude - it only stops enemies from
 * being added if the troop is exactly full; if the max is 10 and the troop currently has 9 enemies in
 * it, it will be more than happy to add 5 enemies in one batch.
 * @default 10
 *
 * @help
 *
 * ============================================================================
 * Summary
 * ============================================================================
 *
 * The purpose of this plugin is to allow the passage of in-world time during combat;
 * if enemies were approaching before combat started, they will be closer to their
 * destination when combat ends. Additionally, if enemies should arrive before the
 * battle concludes, the battlers from the enemy troop that the enemy (event) represents
 * will be added to the current battle. That is, their event code will be run until the
 * Battle Processing is reached, and when combat concludes, will resume running for all
 * such events involved.
 *
 * No plugin commands or note tags are needed; the current version, however, does NOT support
 * transfering (troop) event pages from the "late troop(s)" into the current battle; only code for the
 * initial battle will run.
 *
 *              \\\\\ IMPORTANT /////
 * This is somewhat hacky and annoying, I know, but you must create "dummy troops"; these are
 * troops that use the name "Sample", "Example", "Sample Positions", or "Example Positions", (not
 * case sensitive) and that provide the x and y coordinates you'd like troops of the same size
 * to use. This will only affect troop layouts when this plugin is doing its primary thing, that
 * is, when additional enemies are pushed into the battle.
 *
 * ============================================================================
 * Commands
 * ============================================================================
 * *All case sensitive*
 *
 * Set_LA_ATB :- sets the Unit System parameter to 'atb'
 * Set_LA_Rounds :- sets the Unit System parameter to 'rounds'
 * Set_LA_Turns :- sets the Unit System parameter to 'turns'
 * 
 * ============================================================================
 * Compatibility:
 * List of Functions that are Overriden without Aliasing
 * ============================================================================
 *
 * Game_Event.prototype.checkEventTriggerTouch
 * Game_Event.prototype.updateParallel
 *
 * ============================================================================
 * Nice-to-add-later/TODO
 * ============================================================================
 * 
 * Intelligent Automatic Battler Relocation
 * Fine-toothed Max Troop Size (Enemy Buffer)
 * Sort battler based on order in which they are drawn, and sort reference
 *	positions by smallest y and largest x to try and have consistent z-order
 *
 */
 //=============================================================================

　　var Imported = Imported || {};
　　Imported.LateArrivals = true;
　　var NB_Addons = NB_Addons || {};
  NB_Addons.lateArrivals = NB_Addons.lateArrivals || {};
　　var Moghunter = Moghunter || {};  

  NB_Addons.lateArrivals.parameters = PluginManager.parameters('LateArrivals');
  NB_Addons.lateArrivals.atbTime = parseInt(String(NB_Addons.lateArrivals.parameters['ATB Period'] || '1000'));
  NB_Addons.lateArrivals.atbRate = parseInt(String(NB_Addons.lateArrivals.parameters['ATB Unit'] || '100'));
  NB_Addons.lateArrivals.numRounds = parseInt(String(NB_Addons.lateArrivals.parameters['Rounds'] || '3'));
  NB_Addons.lateArrivals.numTurns = parseInt(String(NB_Addons.lateArrivals.parameters['Turns'] || '6'));
  NB_Addons.lateArrivals.sys = String(NB_Addons.lateArrivals.parameters['Unit System'] || 'rounds');
  NB_Addons.lateArrivals.mapRate = parseInt(String(NB_Addons.lateArrivals.parameters['Tick Rate'] || '60'));
  NB_Addons.lateArrivals.maxTroopSize = parseInt(String(NB_Addons.lateArrivals.parameters['Max Troop Size'] || '10'));
  NB_Addons.lateArrivals.atbRate = Math.max(NB_Addons.lateArrivals.atbRate, 1); //must be > 0
  NB_Addons.lateArrivals.atbTime = Math.max(NB_Addons.lateArrivals.atbTime, 1); 
  NB_Addons.lateArrivals.numRounds = Math.max(NB_Addons.lateArrivals.numRounds, 1); 
  NB_Addons.lateArrivals.numTurns = Math.max(NB_Addons.lateArrivals.numTurns, 1); 
  NB_Addons.lateArrivals.mapRate = Math.max(NB_Addons.lateArrivals.mapRate, 15); 
  NB_Addons.lateArrivals.maxTroopSize = Math.max(NB_Addons.lateArrivals.maxTroopSize, 1); 
  //add parameters
  NB_Addons.lateArrivals.rowWidth = 3;
  NB_Addons.lateArrivals.margin = 50;
  NB_Addons.lateArrivals.floor = 0.3; //ratio from bottom of the screen
  NB_Addons.lateArrivals.ceil = 0.9;

  NB_Addons.lateArrivals.activeBattles = [];
  NB_Addons.lateArrivals.troopReferences = {};

var _loaded_late_arrivals;
var _late_arrivals_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!_late_arrivals_DataManager_isDatabaseLoaded.call(this)) return false;

  if (!_loaded_late_arrivals) {
    this.findReferences($dataTroops);
    _loaded_late_arrivals = true;
  }
  
  return true;
};

DataManager.findReferences = function(group) {
  for (var n = 1; n < group.length; n++) {
    var line = group[n].name;
    if (line.match(/(EXAMPLE|SAMPLE)( POSITIONS)?/i)) {
      var enemies = group[n].members;
      if (!NB_Addons.lateArrivals.troopReferences[enemies.length]) NB_Addons.lateArrivals.troopReferences[enemies.length] = n; //troopId
    }
  }
};

var _late_arrivals_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  _late_arrivals_pluginCommand.call(this, command, args);
  if (command === "Set_LA_ATB")  { NB_Addons.lateArrivals.sys = 'atb'; };
  if (command === "Set_LA_Rounds")  { NB_Addons.lateArrivals.sys = 'rounds'; };
  if (command === "Set_LA_Turns")  { NB_Addons.lateArrivals.sys = 'turns'; };
  return true;
};

//Battle Processing
var _late_arrivals_battle_processing = Game_Interpreter.prototype.command301;
Game_Interpreter.prototype.command301 = function() {
  var willBreak = true;
  NB_Addons.lateArrivals.activeBattles.push(this.eventId());
  if ($gameParty.inBattle()) {
        var troopId;
        if (this._params[0] === 0) {  // Direct designation
          troopId = this._params[1];
        } else if (this._params[0] === 1) {  // Designation with a variable
          troopId = $gameVariables.value(this._params[1]);
        } //else {  // Same as Random Encounter //don't have to deal with random encounters
          //troopId = $gamePlayer.makeEncounterTroopId();
        //}
        var enemies = [];
        $dataTroops[troopId].members.forEach(function(member) {
          if ($dataEnemies[member.enemyId]) {
            var enemyId = member.enemyId;
            var x = member.x;
            var y = member.y;
            var enemy = new Game_Enemy(enemyId, x, y);
            if (member.hidden) {
              enemy.hide();
            }
            enemies.push(enemy);
          }
        }, this);
        for (var i = 0; i < enemies.length; ++i) {
          $gameTroop._enemies.push(enemies[i]);
          var esprite = new Sprite_Enemy(enemies[i]);
          SceneManager._scene._spriteset._battleField.addChild(esprite);
          SceneManager._scene._spriteset._enemySprites.push(esprite);
        }
        $gameTroop.makeUniqueNames();
        $gameTroop.refreshBattlerLayout(enemies.length);
        var enemyNames = [];
        enemies.forEach(function(enemy) {
          var name = enemy.originalName();
          if (enemy.isAlive() && !enemyNames.contains(name)) {
            enemyNames.push(name);
          }
        });
        enemyNames.forEach(function(name) {
            $gameMessage.add(TextManager.emerge.format(name));
        });
        BattleManager.setSecondaryCallback(function(n) {
          this._branch[this._indent] = n;
        }.bind(this));
        //The two things below... it's a very ugly workaround; you don't want to know
        willBreak = false;
        this._index++;

  }
  _late_arrivals_battle_processing.call(this);
  return willBreak;
};

NB_Addons.lateArrivals.doUpdates = function() {
  $gameMap.events().forEach(function(event) {
    for (var i = 0; i < NB_Addons.lateArrivals.activeBattles.length; ++i) {
      if (NB_Addons.lateArrivals.activeBattles[i] == event._eventId) return;
    } NB_Addons.lateArrivals.fromBattle = true;
    for (var i = 0; i < NB_Addons.lateArrivals.mapRate; ++i) {
      if (!event._interpreter && event._trigger != 4) event.update();
    } NB_Addons.lateArrivals.fromBattle = false;
  });
};

BattleManager.setSecondaryCallback = function(callback) {
    this._secondaryCallbacks.push(callback);
};

Game_Troop.prototype.refreshBattlerLayout = function(numNew) {
  var enemies = [];
  enemies = SceneManager._scene._spriteset._enemySprites;
  var len = enemies.length;
  if (!NB_Addons.lateArrivals.troopReferences[len]) {
    var rows = Math.ceil(len / NB_Addons.lateArrivals.rowWidth);
    var maxh = 0; var maxw = 0;
    var hspacer = 0; var vspacer = 0;
    for (var i = 0; i < len; ++i) {
      if (!enemies[i].bitmap) enemies[i].updateBitmap();
      maxh = Math.max(maxh, enemies[i].bitmap.height);
      maxw = Math.max(maxw, enemies[i].bitmap.width);
    }
    hspacer = Math.floor((SceneManager._screenHeight*(1 - NB_Addons.lateArrivals.floor) - maxh) / rows);
    vspacer = Math.floor((SceneManager._screenWidth - 2*NB_Addons.lateArrivals.margin) - NB_Addons.lateArrivals.rowWidth*maxw);
    for (var i = 0; i < len; ++i) {
      $gameTroop._enemies[len - (i+1)]._screenX = enemies[len - (i+1)]._homeX = NB_Addons.lateArrivals.margin + Math.floor(maxw/2) + (i % NB_Addons.lateArrivals.rowWidth)*hspacer;
      $gameTroop._enemies[len - (i+1)]._screenY = enemies[len - (i+1)]._homeY = Math.floor(SceneManager._screenHeight*NB_Addons.lateArrivals.floor)+Math.floor(i / NB_Addons.lateArrivals.rowWidth)*vspacer;
    }
  } else {
    var references = $dataTroops[NB_Addons.lateArrivals.troopReferences[len]].members;
    for (var i = 0; i < (len - numNew); ++i) {
      $gameTroop._enemies[i]._screenX = enemies[i]._homeX = references[numNew + i].x;
      $gameTroop._enemies[i]._screenY = enemies[i]._homeY = references[numNew + i].y;
    }
    for (var i = 0; i < numNew; ++i) {
      $gameTroop._enemies[len - numNew + i]._screenX = enemies[len - numNew + i]._homeX = references[i].x;
      $gameTroop._enemies[len - numNew + i]._screenY = enemies[len - numNew + i]._homeY = references[i].y;
    }
  }

};

//Initialize Turns/Rounds
var _late_arrivals_bm_init_members = BattleManager.initMembers;
BattleManager.initMembers = function() {
  this._turns = 0;
  this._rounds = 0;
  this._secondaryCallbacks = [];
  _late_arrivals_bm_init_members.call(this);
};

var _late_arrivals_bm_end_battle = BattleManager.endBattle;
BattleManager.endBattle = function(result) {
  for (var i = 0; i < this._secondaryCallbacks.length; ++i) {
    this._secondaryCallbacks[i](result);
  }
  NB_Addons.lateArrivals.activeBattles = [];
  _late_arrivals_bm_end_battle.call(this, result);
};

//Update Rounds, Update Map if sys = rounds
var _late_arrivals_bm_end_turn = BattleManager.endTurn;
BattleManager.endTurn = function() {
  _late_arrivals_bm_end_turn.call(this);
  if (NB_Addons.lateArrivals.sys == 'rounds') {
    this._rounds += 1;
    while (this._rounds >= NB_Addons.lateArrivals.numRounds) {
      this._rounds -= NB_Addons.lateArrivals.numRounds;
      NB_Addons.lateArrivals.doUpdates();
    }
  }
};

//Update Turns, Update Map if sys = turns
var _late_arrivals_bm_end_action = BattleManager.endAction;
BattleManager.endAction = function() {
  _late_arrivals_bm_end_action.call(this);
  if (NB_Addons.lateArrivals.sys == 'turns') {
    this._turns += 1;
    while (this._turns >= NB_Addons.lateArrivals.numTurns) {
      this._turns -= NB_Addons.lateArrivals.numTurns;
      NB_Addons.lateArrivals.doUpdates();
    }
  }
};

Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
    if (!$gameMap.isEventRunning() || NB_Addons.lateArrivals.fromBattle) {
      if (this._trigger === 2 && $gamePlayer.pos(x, y)) {
          if (!this.isJumping() && this.isNormalPriority()) {
              if (!$gameParty.inBattle()) this.start();
              else {
                if ($gameTroop.members().length < NB_Addons.lateArrivals.maxTroopSize)
                  this._interpreter = new Game_Interpreter();
              }
          }
      }
    }
};

Game_Event.prototype.updateParallel = function() {
    if (this._interpreter && !this._interpreter.isRunning() && this._interpreter.hasRun && (this._trigger != 4)) {
      this._interpreter = null; return;
    }
    if (this._interpreter) {
        if (!this._interpreter.isRunning()) {
            this._interpreter.setup(this.list(), this._eventId);
            this._interpreter.hasRun = true;
        }
        this._interpreter.update();
    }
};

if (Imported.MOG_ATB) {

//Update ATB, Update Map if sys = atb
var _late_arrivals_bm_update_atb = BattleManager.update_ATB;
BattleManager.update_ATB = function() {
  if (NB_Addons.lateArrivals.sys == 'atb') {
    this._currentATB += NB_Addons.lateArrivals.atbRate;
    while (this._currentATB > NB_Addons.lateArrivals.atbTime) {
      this._currentATB -= NB_Addons.lateArrivals.atbTime;
      NB_Addons.lateArrivals.doUpdates();
    }
  }
  _late_arrivals_bm_update_atb.call(this);
};

//Initialize ATB
var _late_arrivals_bm_setup_atb = BattleManager.setupATB;
BattleManager.setupATB = function() {
  if (NB_Addons.lateArrivals.sys == 'atb') this._currentATB = 0;
  _late_arrivals_bm_setup_atb.call(this);
};

};
