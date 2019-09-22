# RPGM-MV
Compilation of Scripts/Plugins written for RPGM MV

All listed plugins should be assumed unrelated. All are only tested in a Windows environment, and have not been rigorously tested in a large-scale, sophisticated game. Some features may not be fully implemented; to the best of my knowledge, all such cases are documented.

Inheritable Inventories:
------------------------
Enemies can be assigned inventories through on-map plugin commands. Enemies will utilize their inventory in combat; you can set additional restrictions on when particular items are used by particular enemies. Furthermore, on-map plugin commands exist to permit the player to tamper with (steal from or add to) the enemy's inventory.

Late Arrivals:
--------------
Allows for the passage of map/world "time" (ticks, during which events can trigger, move, etc); it is designed so that battle events/troops will stack; if for instance, a pursuer reaches the player on the map while they are still on the combat screen and a "Battle Processing" event is triggered, the enemies from the newly-triggered troop will be added to the current combat screen (up to a configurable limit of battlers on the screen).

ExtraWindows:
-------------
Contains a port of the XP Textbox, in Window form. Adds additional features relating to type/input checking and substring highlighting/copy-pasting of text. Because it was ported, and because many features were added onto code that was not originally intended to support those features, the code is a tangled mess. Ideally it would be written with more handlers and fewer interlocking classes.
Additionally contains a Window_Dropdown class to support selecting an option from a drop-down list.

main.js: a special version of main that most users will have no use for.
