
//var _alias_wintext_sct_create_com_window = Scene_Title.prototype.createCommandWindow;
//Scene_Title.prototype.createCommandWindow = function() {
//    _alias_wintext_sct_create_com_window.call(this);
//    this.textbox = new Window_Textbox({x: 200, y: 200, type: 'number', err_dir: 'right', 'hint': '175' });
//    this.dropdown = new Window_Dropdown(50, 250, ['hall', 'eo', 'breh', 'nwis']);
//    this.addWindow(this.dropdown);
//    this.addWindow(this.textbox);
//}; 

//-----------------------------------------------------------------------------
// Window_Horz2
//
// The window for Horizontal command list with basic configurables

function Window_Horz2() {
    this.initialize.apply(this, arguments);
}

Window_Horz2.prototype = Object.create(Window_HorzCommand.prototype);
Window_Horz2.prototype.constructor = Window_Horz2;

Window_Horz2.prototype.initialize = function(x, y, width, maxcols) {
    this._windowWidth = width || Graphics.boxWidth;
    this._maxCols = maxcols || 2;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
};

Window_Horz2.prototype.windowWidth = function() {
    return this._windowWidth;
};

Window_Horz2.prototype.maxCols = function() {
    return this._maxCols;
};

//-----------------------------------------------------------------------------
// Window_CommandList
//
// Version of Window_Command where the command list is specified at initialization
function Window_CommandList() {
    this.initialize.apply(this, arguments);
}

Window_CommandList.prototype = Object.create(Window_Command.prototype);
Window_CommandList.prototype.constructor = Window_CommandList;

Window_CommandList.prototype.initialize = function(x, y, list) {
    list = list || [];
    this._itemlist = list;
    Window_Command.prototype.initialize.call(this, x, y);
};

Window_CommandList.prototype.makeCommandList = function(list) {
    list = (list && Array.isArray(list)) ? list : this._itemlist;
    this._itemlist = list;
    for (var i in this._itemlist) {
        this.addCommand(this._itemlist[i], this._itemlist[i]);
    }
}

//-----------------------------------------------------------------------------
// Window_Dropdown
//
// A drop-down select window

function Window_Dropdown() {
    this.initialize.apply(this, arguments);
}
Window_Dropdown.prototype = Object.create(Window_Command.prototype);
Window_Dropdown.prototype.constructor = Window_Dropdown;

Window_Dropdown.prototype.initialize = function(x, y, options, opts) {
    this._dropIndex = -1;
    opts = opts || {};
    this._options = new Window_CommandList(x, y, options); //TODO: change y based on settings
    for (var i in options) {
        var option = options[i];
        //this._options.addCommand(option, option);
        this._options.setHandler(option, this.chooseUnfocus.bind(this));
    };
    if (opts['width']) {this._maxWidth = opts['width'];}
    Window_Command.prototype.initialize.call(this, x, y);
    align = opts['align'] || 'center'; var dy = 0;
    switch(align) {
        case 'top':
            break;
        case 'bottom':
            dy -= (this._options.height - this.height);
            break;
        case 'center':
        default:
            dy -= (this._options.height - this.height)/2;
    }
    y = Math.min(Math.max(0, y), Graphics.boxHeight);
    this._options.move(0, dy, this._options.width, this._options.height);
    this.addChild(this._options);
    this.revertUnfocus();
};

Window_Dropdown.prototype.makeCommandList = function() {
    if (!this._handlers) { //first time
        var options = this._options._list;
        var max = "";
        for (var i in options) {
            var option = options[i];
            if (this._options.textWidth(option) > this._options.textWidth(max)) {
                if (this._maxWidth && this.textWidth(option) <= this._maxWidth) {
                    max = option;
                }
            }
        };
        this.addCommand(max, max);
    } else {
        this._options.setHandler('cancel', this.revertUnfocus.bind(this));
        if (this._dropIndex == -1 || this._dropIndex >= this._options._list.length) {
            this.addCommand("", "none");
            this.setHandler("none", this.openChoose.bind(this));
        } else {
            var chosen = this._options._list[this._dropIndex].name;
            this.addCommand(chosen, chosen);
            this.setHandler(chosen, this.openChoose.bind(this));
        }
    }

};

Window_Command.prototype.windowWidth = function() {
    return 240;
};

Window_Dropdown.prototype.processTouch = function() {
    Window_Selectable.prototype.processTouch.call(this);
    if (TouchInput.isTriggered() && !this._options.isTouchedInsideFrame()) {
        if (this._selecting) {
            this.revertUnfocus();
        }
    }
}

Window_Dropdown.prototype.getResult = function() {
    if (this._dropIndex == -1 || this._dropIndex >= this._options._list.length) {
        return null;
    } else {
        return this._options._list[this._dropIndex];
    }
};

Window_Dropdown.prototype.openChoose = function() {
    this._options.open();
    this._options.activate();
    this._options._index = (this._dropIndex == -1) ? 0 : this._dropIndex;
    this._selecting = true;
    this.deactivate();
};

Window_Dropdown.prototype.chooseUnfocus = function() {
    this._selecting = false;
    this._options.close();
    this._options.deactivate();
    this.activate();
    this._dropIndex = this._options.index();
    this.refresh()
};

Window_Dropdown.prototype.revertUnfocus = function() {
    this._selecting = false;
    this._options.close();
    this._options.deactivate();
    this.activate();
    //do not change this._dropIndex
};

//==============================================================================
// ** Text_Box
//------------------------------------------------------------------------------
//  A visual text box for the user to enter/type strings into
// ----------------
// Attributes:
//   - x, y, z
//   - width, height
//   - active, visible
// Methods:
//   - getMessage : retrieve the current contents
//   - moveto(x, y) : move the textbox to (x, y) (upper-left corner)
//   - moveby(dx, dy) : move the textbox by <dx, dy>
//==============================================================================

function Window_Textbox() {
  this.initialize.apply(this, arguments);
};
Window_Textbox.prototype = Object.create(Window_Base.prototype);
Window_Textbox.prototype.constructor = Window_Textbox;

Window_Textbox.prototype.MARGINS = function() { return 20;};
Window_Textbox.prototype.FONT = function() { return "GameFont"; };
Window_Textbox.prototype.FSIZE = function() { return 16; };
Window_Textbox.prototype.FCOLOR = function() { return '#ffffff'; };
Window_Textbox.prototype.ERRCOLOR = function() { return '#dd0000'; };
Window_Textbox.prototype.HINTCOLOR = function() { return '#cccccc'; };
Window_Textbox.prototype.HIGHLIGHT_COLOR = function() { return '#ccccdd80'; };
Window_Textbox.prototype.CHAT_WIDTH = function() { return 240; };
Window_Textbox.prototype.CHAT_HEIGHT = function() { return 40; };
Window_Textbox.prototype.LINE_HEIGHT = function() { return 36; };

Object.defineProperty(Window_Textbox.prototype, 'message', {
  get: function() {
    this.validEntryCheck()
    if (this.validState) {
      return this._message;
    }
    return null;
  },
  configurable: true
});
  
Window_Textbox.prototype.initialize = function(specs) {
    Window_Base.prototype.initialize.call(this);
    //x, y, and z coords of grid component
    if (specs["x"]) { this.x = specs['x']; } else { this.x=0; }
    if (specs["y"]) { this.y = specs['y'];} else { this.y=0; }
    if (specs["z"]) { this.z = specs['z'];} else { this.z = 10000; }
    //width and height of text box
    if (specs["width"]) { this.x = specs['width'];} else {this.width=this.CHAT_WIDTH();}
    if (specs["height"]) { this.height = specs['height'];} else {this.height=this.CHAT_HEIGHT();} 
    //size of margins on either side
    if (specs["margins"]) { this.margins = specs['margins'];} else {this.margins =this.MARGINS();}
    //font type, size, and color
    if (specs["font_size"]) { this.f_size = specs['font_size'];} else {this.f_size=this.FSIZE();}
    if (specs["font"]) { this.f_name = specs['font'];} else {this.f_name=this.FONT();}
    if (specs["font_color"]) { this.f_color = specs['font_color'];} else {this.f_color=this.FCOLOR();}
    //restrictions on expected type to be input
    if (specs["type"]) {this.type = specs['type'];} else {this.type = 'string';}
    //which side of the text box type-related errors should be displayed; "up" means above the textbox, etc
    if (specs["err_dir"] && (['up', 'down', 'left', 'right'].indexOf(specs["err_dir"]) >= 0)) { this._err_dir = specs['err_dir']; } else { this._err_dir = 'down'; }
    //hint text
    if (specs["hint"]) {this.hint = specs['hint'];} else {this.hint = "";}

    this.lastx = this.x; this.lasty = this.y;
    this._message = "";
    
    this.cursor = new Sprite();
    this.cursor.bitmap = new Bitmap(this.width,this.height);
    this.cursor.bitmap.fillRect(0,10,2,this.height-20,this.f_color);
    this.text = new Sprite();
    var w = (/(left|right)/.exec(this._err_dir)) ? this.width*2 : this.width;
    var h = (/(up|down)/.exec(this._err_dir)) ? this.height*2 : this.height;
    this.text.bitmap = new Bitmap(w, h);
    this.cursor.x = this.x+this.margins;
    this.cursor.y = 0;//this.y;
    switch(this._err_dir) {
      case 'up':
        this.text.x = 0; this.text.y = (this.height - this.LINE_HEIGHT())/2 - this.height; break;
      case 'down':
        this.text.x = 0; this.text.y = (this.height - this.LINE_HEIGHT())/2; break;
      case 'left':
        this.text.x = -this.width; this.text.y = (this.height - this.LINE_HEIGHT())/2; break;
      case 'right':
        this.text.x = 0; this.text.y = (this.height - this.LINE_HEIGHT())/2; break;
    }
    this.text.visible = true;
    this.cursor.visible = false;
    this.addChild(this.text);
    this.addChild(this.cursor);
    
    Keyboard.connectTextbox(this);
    
    this.visible = true;
    this.active = false;
    this.characterCache = {};
    this.scroll_index_x = 0;
    this.firstHighlightIndex = 0;
    this.restore_cursor = 0;
    this.flash_rate = 40;
    this.flash_count = 0;
    
    this.openness = 0;
    this.open();

    //write hint text
    this.text.bitmap.fontSize = this.f_size;
    this.text.bitmap.fontFace = this.f_name;
    this.writeText();
    //this.refresh();
};

Window_Textbox.prototype.setSubmitHandler = function(method) {
  this._submitCallback = method;
}
  
Window_Textbox.prototype.moveto = function(x, y) {
  var delx = x - this.x;
  this.x = x; this.y = y; this.lastx = x; this.lasty = y;
  this.cursor.y = y;
  this.cursor.x += delx;
};
  
Window_Textbox.prototype.moveby = function(dx, dy) {
  this.moveto(this.x+dx, this.y+dy);
};
  
Window_Textbox.prototype.getMessage = function() {
  var message = this._message ? this._message : "";
  return message;
};
  
Window_Textbox.prototype.needsShift = function() {
    if (this.scroll_index_x > Keyboard._cursor_pos) {
      this.scroll_index_x = Keyboard._cursor_pos;
      return true
    }
    if ((this.cursor.x+1) > (this.width-this.margins)) {
      this.scroll_index_x += 1
      return true;
    }
    return false;
};
  
Window_Textbox.prototype.findAppropriateString = function() {
    var mes = "";
    var i = this.scroll_index_x;
    var length = this.margins;
    var message = Keyboard.message;
    while (true) {
      //stop if we hit end of message, or end of text box
      if ((i == message.length) || ((length + this.charWidth(message[i])) > (this.width-this.margins))) {//((i == message.length) || ((length + this.text_widths[i]) >= (this.width-this.margins))) {
        return mes;
      } else { //incrementally generate message, keep track of total width of text/message
        mes += message[i];
        length += this.charWidth(message[i]);
        i += 1;
      }
    }
    //this message represents the finalized message to be displayed; use the
    //previously totaled width to set final cursor position
    this.cursor.x = this.margins+this.sumWidths(this.scroll_index_x, Keyboard._cursor_pos) - 1; //minus 1 for "half the cursor width"
    return mes;
};
  
Window_Textbox.prototype.validEntryCheck = function() {
  this.validState = true;
  switch(this.type) {
    case 'string': return; //all valid
    case 'number': if (!isNaN(this._message)) return; else break;
    case 'object':
      try {
        JSON.parse(this._message);
      } catch (err) {
        break;
      }
    case 'boolean': if (/^(\s)*(true|false)(\s)*$/i.exec(this._message)) return; else break;
    default:
      this.type = 'string';
      return;
  }
  //set state to invalid and write error message
  this.validState = false;
  this.text.bitmap.fontFace = 'Verdana';
  this.text.bitmap.textColor = this.ERRCOLOR();
  this.writeText(true);
};

Window_Textbox.prototype.exitFocus = function() {
  if (this.active) {
    this.firstHighlightIndex = 0;
    this.refresh();
    this.validEntryCheck();
  }
  this.active = false;
};

Window_Textbox.prototype.charWidth = function(character) {
    if (!this.characterCache[character]) {
      this.text.bitmap.fontSize = this.f_size;
      this.text.bitmap.fontFace = this.f_name;
      this.text.bitmap.textColor = this.f_color;
      this.characterCache[character] = this.text.bitmap.measureTextWidth(character);
    }
    return this.characterCache[character];
}

  //excludes finish
Window_Textbox.prototype.sumWidths = function(start, finish) {
    var sum = 0
    while (finish > start) {
      sum += this.charWidth(this._message[start]);
      start += 1;
    }
    return sum;
};
  
Window_Textbox.prototype.refresh = function() {
    if (!this.active) return;
    this.flash_count = 0; //make sure cursor stays visible if it's being moved around
    this.cursor.visible = this.visible && this.isOpen();

    this._message = Keyboard.message;//.clone
    this.restore_cursor = Keyboard._cursor_pos;
    this.text.bitmap.fontSize = this.f_size;
    this.text.bitmap.fontFace = this.f_name;
    this.text.bitmap.textColor = this.f_color;
    this.text.bitmap.clear();
    
    this.cursor.x = this.margins+this.sumWidths(this.scroll_index_x, Keyboard._cursor_pos) - 1;
    while (this.needsShift()) {
      this.cursor.x = this.margins+this.sumWidths(this.scroll_index_x, Keyboard._cursor_pos) - 1;
    }
    if (this._message == null) { this._message = ""; }
    //if there is any key input and not still holding mouse, stop highlighting
    if (!TouchInput.isTriggered() && !TouchInput.isPressed() && !TouchInput.isRepeated()) {
      if (!Input.isShiftPressed()) {
        this.firstHighlightIndex = Keyboard._cursor_pos;
      }
    }

    this.drawHighlight();
    this.writeText();
};
  
Window_Textbox.prototype.drawHighlight = function() {
  var left, right;
  if (this.firstHighlightIndex < Keyboard._cursor_pos) {
    left = this.firstHighlightIndex; right = Keyboard._cursor_pos;
  } else {
    left = Keyboard._cursor_pos; right = this.firstHighlightIndex;
  }
  left = this.sumWidths(this.scroll_index_x, left)+this.margins;
  right = this.sumWidths(this.scroll_index_x, right)+this.margins;
  left = Math.min(left, this.width - this.margins);
  right = Math.min(right, this.width - this.margins);
  this.text.bitmap.fillRect(left, 0,(right - left), this.LINE_HEIGHT(), this.HIGHLIGHT_COLOR() );
};

Window_Textbox.prototype.moveCursorToMouse = function() {
  var i = 0; var length = this.x+this.margins-this.sumWidths(0,this.scroll_index_x);
  var message = Keyboard.message;
  while (true) {
    //stop if we hit end of message, or end of text box
    if (i == message.length) {
      Keyboard._cursor_pos = i;
      break;
    } else if ((length + this.charWidth(message[i])) > TouchInput.x) {
      //pick closer space of two options
      if ((i > 0)&&((length+this.charWidth(message[i])-TouchInput.x) < (TouchInput.x-length))) {
        length+=this.charWidth(message[i]);
        i += 1;
      }
      Keyboard._cursor_pos = i;
      break;
    } else { //incrementally generate message, keep track of total width of text/message
      length += this.charWidth(message[i]);
      i += 1;
    }
  }
  if (TouchInput.isTriggered()) {
    this.firstHighlightIndex = Keyboard._cursor_pos;
  } else if (TouchInput.isPressed()) {
    if (TouchInput.isRepeated()) {
      if (Keyboard._cursor_pos == this.scroll_index_x) {
        Keyboard.cursorLeft();
      } else {
        var string = this.findAppropriateString();
        if (Keyboard._cursor_pos == (string.length+this.scroll_index_x)) {
          Keyboard.cursorRight();
        }
      }
    }
  }
  this.cursor.x = length;
};
 
Window_Textbox.prototype.writeText = function(error) {
  error = error || false;
  var string = this.findAppropriateString();
  if (string == "") {
    this.text.bitmap.textColor = this.HINTCOLOR();
    string = this.hint;
  }
  switch(this._err_dir) {
    case 'up':
      if (error) {
        this.text.bitmap.drawTextNoOutline("Error: Invalid type. Expected: "+this.type, 0, this.height/2-10, this.width, 36);
      } else {
        this.text.bitmap.drawText(string, this.margins, this.height, this.width, 36);
      } break;
    case 'down':
      if (error) {
        this.text.bitmap.drawTextNoOutline("Error: Invalid type. Expected: "+this.type, 0, this.height/2+10, this.width, 36);
      } else {
        this.text.bitmap.drawText(string, this.margins, 0, this.width, 36);
      } break;
    case 'left':
      if (error) {
        this.text.bitmap.drawTextNoOutline("Error: Invalid type. Expected: "+this.type, 0, 0, this.width, 36);
      } else {
        this.text.bitmap.drawText(string, this.margins+this.width, 0, this.width, 36);
      } break;
    case 'right':
      if (error) {
        this.text.bitmap.drawTextNoOutline("Error: Invalid type. Expected: "+this.type, this.width, 0, this.width, 36);
      } else {
        this.text.bitmap.drawText(string, this.margins, 0, this.width, 36);
      } break;
  }
}

Window_Textbox.prototype.close = function() {
  Window_Base.prototype.close.call(this);
  this.exitFocus();
}

Window_Textbox.prototype.update = function() {
  Window_Base.prototype.update.call(this);
  //if someone used x or y attributes to move the textbox
  if (this.x != this.lastx || this.y != this.lasty) {
    moveto(this.x, this.y)
  }
  //if not visible, cannot activate/click into it
  if (TouchInput.isTriggered() || TouchInput.isPressed()) {
    if ((TouchInput.x >= this.x) && (TouchInput.x <= (this.x+this.width)) && (TouchInput.y >= this.y) && (TouchInput.y <= (this.y+this.height))) {
      this.active = true;
      this.cursor.visible = this.visible && this.isOpen();

      Keyboard.message = this._message;
      Keyboard._cursor_pos = this.restore_cursor;
    } else if (TouchInput.isTriggered()) {
      this.exitFocus();
    }
    if (this._message != "") {
      this.moveCursorToMouse();
    }
    if (!this.visible) { this.active = false }
    this.refresh();
  }
  if (this.active) {
    if (this.flash_count == this.flash_rate) {
      this.cursor.visible = false;
    } else if (this.flash_count >= (this.flash_rate * 5)/3) {
      this.flash_count = 0;
      this.cursor.visible = this.visible && this.isOpen();
    }
    this.flash_count++;
  }
  if (!this.active) this.cursor.visible = false;
  this.text.visible = this.visible && this.isOpen();
};

//-----------------------------------------------------------------------------
/**
 * The basic object that represents an image.
 *
 * @class Bitmap
 * @constructor
 * @param {Number} width The width of the bitmap
 * @param {Number} height The height of the bitmap
 */

Bitmap.prototype.drawTextNoOutline = function(text, x, y, maxWidth, lineHeight, align) {
    // Note: Firefox has a bug with textBaseline: Bug 737852
    //       So we use 'alphabetic' here.
    if (text !== undefined) {
        var tx = x;
        var ty = y + lineHeight - (lineHeight - this.fontSize * 0.7) / 2;
        var context = this._context;
        var alpha = context.globalAlpha;
        maxWidth = maxWidth || 0xffffffff;
        if (align === 'center') {
            tx += maxWidth / 2;
        }
        if (align === 'right') {
            tx += maxWidth;
        }
        context.save();
        context.font = this._makeFontNameText();
        context.textAlign = align;
        context.textBaseline = 'alphabetic';
        //context.globalAlpha = 1;
        //this._drawTextOutline(text, tx, ty, maxWidth);
        context.globalAlpha = alpha;
        this._drawTextBody(text, tx, ty, maxWidth);
        context.restore();
        this._setDirty();
    }
};

//==============================================================================
// ** Keyboard
//------------------------------------------------------------------------------
//  A helper (singleton) class to handle user input and message creation/editing
// ----------------
// Attributes:
//   - message : current string
//   - _cursor_pos : position of cursor in string/message
//   - send_ready : flag that message is "done"
//   - active
// Methods:
//   - send_message() : set send flag
//   - receive_message() : unset send flag, get message value, and reset message to empty
//   - maxed() : returns true if message is max length/full
//   - cursorLeft() : tries to decrement the cursor position
//   - cursorRight() : tries to increment the cursor position
//==============================================================================

function Keyboard() {
    throw new Error('This is a static class');
};

Keyboard._max_message_len = 200;
//  attr_accessor   :active
//  attr_accessor   :message
//  attr_accessor   :_cursor_pos
//  attr_reader     :send_ready
  
Keyboard.initialize = function() {
    this.message = "";
    this._highlight_end = 0;
    this.active = false;
    this.needs_refresh = false;
    this._cursor_pos = 0;
    this._send_ready = false;
    this.text_boxes = [];
    this.old_scene = SceneManager._scene;
};
Keyboard.initialize();

Keyboard.sendMessage = function() {
  for (var i in this.text_boxes) {
    var box = this.text_boxes[i];
    if (box.active) {
      if (box._submitCallback)
        (box._submitCallback)(this);
      box.exitFocus();
      break;
    }
  }
};
  
Keyboard.connectTextbox = function(tb) {
  //reset connections on scene change
  if (this.old_scene != SceneManager._scene) {
    this.text_boxes = [];
    this.old_scene = SceneManager._scene;
  }
  this.text_boxes.push(tb);
};
  
Keyboard.update = function() {
  //if any text box is active, keyboard is active
  var change = false;
  for (var box in this.text_boxes) {
    if (this.text_boxes[box].active) {
      change = true;
      break;
    }
  }
  if (change != this.active) {
    this.active = change;
    if (this.active) {
      KeyInput.enable();
    } else {
      KeyInput.disable();
    }
  }
};
Keyboard.window = function() {
  for (var i in this.text_boxes) {
    if (this.text_boxes[i].active) return this.text_boxes[i];
  }
  return null;
}

Keyboard.refreshTextboxes = function() {
    for (var box in this.text_boxes) {
      this.text_boxes[box].refresh();
    }
};
  
document.addEventListener('copy', function(event) {
  var clipdata = event.clipboardData || window.clipboardData;
  if (Keyboard.active) {
    var text = Keyboard.copy();
    event.clipboardData.setData('text/plain', text);
    event.preventDefault();
  }
});
Keyboard.copy = function() {
  var text = ""; var textbox = this.window();
  if (textbox && textbox.firstHighlightIndex != this._cursor_pos) {
    var left = Math.min(textbox.firstHighlightIndex, this._cursor_pos);
    var right = Math.max(textbox.firstHighlightIndex, this._cursor_pos);
    text = this.message.slice(left, right);
  }
  return text;
};

document.addEventListener('paste', function(event) {
  var clipdata = event.clipboardData || window.clipboardData;
  var text = clipdata.getData('text/plain');
  if (Keyboard.active) {
    Keyboard.paste(text);
  }
});
Keyboard.paste = function(text) {
  for (var i = 0; i < text.length; i++) {
    this.tryTypeLetter(text[i]);
    this.refreshTextboxes();
  }
};

Keyboard.tryTypeLetter = function(letter) {
    var textbox = this.window();
    if (textbox && textbox.firstHighlightIndex != this._cursor_pos) {
      //delete highlighted text
      var left = Math.min(textbox.firstHighlightIndex, this._cursor_pos);
      var right = Math.max(textbox.firstHighlightIndex, this._cursor_pos);
      this.message = this.message.slice(0, left)+((this.message.length == right) ? "" : this.message.slice(right));
      this._cursor_pos = left;
    } 
    //if the textbox has more room for another character
    if (!this.maxed()) {
      //add the character to the right of the cursor's location
      this.message = this.message.slice(0, this._cursor_pos)+letter+this.message.slice(this._cursor_pos);
      //move the cursor past the newly-inserted letter
      this.cursorRight();
    } else {
      //fail to type, full
      SoundManager.playBuzzer();
    }
};
  
Keyboard.tryDeleteAtCursor = function() {
  var textbox = this.window();
  if (textbox && textbox.firstHighlightIndex != this._cursor_pos) {
    //delete highlighted text
    var left = Math.min(textbox.firstHighlightIndex, this._cursor_pos);
    var right = Math.max(textbox.firstHighlightIndex, this._cursor_pos);
    console.log("delete: "+left+" "+right);
    this.message = this.message.slice(0, left)+((this.message.length == right) ? "" : this.message.slice(right));
    this._cursor_pos = left;
  } else {
    //cannot delete if nothing to the left of the cursor
    if (this._cursor_pos == 0) return;
    //otherwise, cursor will move left
    this._cursor_pos -= 1;
    if (this._cursor_pos == this.message.length) {
      //delete the end
      this.message = this.message.slice(0, -1);
    } else {
      //delete the character just right of the new cursor position (left of old)
      this.message = this.message.slice(0,this._cursor_pos)+this.message.slice((this._cursor_pos+1),this.message.length);
    }
  }
};
  
Keyboard.maxed = function() {
  return (this.message.length >= this._max_message_len);
};
  
Keyboard.cursorRight = function() {
  //increment the cursor position by 1 if it is not at the end
  this._cursor_pos = Math.min(Math.min(this._cursor_pos+1, this.message.length),this._max_message_len);
};

Keyboard.cursorLeft = function() {
  //decrement the cursor position by 1 if not at the beginning
  this._cursor_pos = Math.max(this._cursor_pos-1, 0);
};

//-----------------------------------------------------------------------------
// KeyInput
//
// Lightweight class; bridge between Input and Keyboard

function KeyInput() {
    throw new Error('This is a static class');
}
KeyInput._keyMap = {
         'A': 65, 'B': 66, 'C': 67, 'D': 68, 'E': 69, 'F': 70, 
         'G': 71, 'H': 72, 'I': 73, 'J': 74, 'K': 75, 'L': 76, 
         'M': 77, 'N': 78, 'O': 79, 'P': 80, 'Q': 81, 'R': 82, 
         'S': 83, 'T': 84, 'U': 85, 'V': 86, 'W': 87, 'X': 88, 
         'Y': 89, 'Z': 90,
         '0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53,
         '6': 54, '7': 55, '8': 56, '9': 57,
//         'NumberPad 0': 45, 'NumberPad 1': 35, 'NumberPad 2': 40,
//         'NumberPad 3': 34, 'NumberPad 4': 37, 'NumberPad 5': 12,
//         'NumberPad 6': 39, 'NumberPad 7': 36, 'NumberPad 8': 38,
//         'NumberPad 9': 33,
         'F1': 112, 'F2': 113, 'F3': 114, 'F4': 115, 'F5': 116,
         'F6': 117, 'F7': 118, 'F8': 119, 'F9': 120, 'F10': 121,
         'F11': 122, 'F12': 123,
         ';': 186, '=': 187, ',': 188, '-': 189, '.': 190, '/': 220,
         '\\': 191, '\'': 222, '[': 219, ']': 221, '`': 192,
         'Backspace': 8, 'Tab': 9, 'Enter': 13, 'Shift': 16,
         'Left Shift': 160, 'Right Shift': 161, 'Left Ctrl': 162,
         'Right Ctrl': 163, 'Left Alt': 164, 'Right Alt': 165, 
         'Ctrl': 17, 'Alt': 18, 'Esc': 27, 'Space': 32, 'Page Up': 33,
         'Page Down': 34, 'End': 35, 'Home': 36, 'Insert': 45,
         'Delete': 46, 'Arrow Left': 37, 'Arrow Up': 38,
         'Arrow Right': 39, 'Arrow Down': 40,
         'Mouse Left': 1, 'Mouse Right': 2, 'Mouse Middle': 4,
         'Mouse 4': 5, 'Mouse 5': 6
       };
KeyInput._inputMap = Object.assign({}, Input.keyMapper);

KeyInput.invertMap = function() {
  var map = {};
  for (key in this._keyMap) {
    map[this._keyMap[key]] = key;
  }
  return map;
};
KeyInput.enable = function() {
  Input.clear();
  this._active = true;
  Input.keyMapper = this.invertMap();
};
KeyInput.disable = function() {
  Input.clear();
  this._active = false;
  Input.keyMapper = Object.assign({}, this._inputMap);
};


Input.isShiftPressed = function() {
  return (
    this.isPressed("Shift") || this.isRepeated("Shift")||
    this.isPressed("Left Shift") || this.isRepeated("Left Shift")||
    this.isPressed("Right Shift") || this.isRepeated("Right Shift")
    );
}
//this change to Input is where a lot of the code that makes "keyboard" work actually lies
var feed_keypresses_into_keyboard = Input.update;
Input.update = function() {
  feed_keypresses_into_keyboard.call(this);
  Keyboard.update();
  if (Keyboard.active) {
    this.keyboard_lock = true;
    for (var id in this.keyMapper) {//KeyInput._keyMap) {
      var key = this.keyMapper[id];//KeyInput._keyMap[key];
      if ((this.isTriggered(key) || this.isRepeated(key)) && (["Shift", "Left Shift", "Right Shift"].indexOf(key) < 0)) {
        if (/NumberPad /.exec(key)) {
          continue; //collision with NumberPad and arrows, apparently not
            //actually meant to be numbers
          //key = key[10..key.length]
        } else if (/Ctrl/.exec(key)) {
          //allow copy and paste to be handled by document handlers
          continue;
        }
        if (key.length == 1) {
          var letter;
          if (this.isPressed("Ctrl") || this.isRepeated("Ctrl")|| this.isPressed("Left Ctrl") || this.isRepeated("Left Ctrl")|| this.isPressed("Right Ctrl") || this.isRepeated("Right Ctrl")) {
            if (this.isTriggered) {
              //Keyboard.copy();
              break;
            } else if (this.isTriggered('v')) {
              //Keyboard.paste();
              break;
            }
          } else if (this.isShiftPressed()) {
            //upper case
            switch(key) {
              case '.':
                letter = '>'
              case ',':
                letter = '<'
              case '/':
                $letter = '?'
              case '1':
                letter = '!'
              case '2':
                letter = '@'
              case '3':
                letter = '#'
              case '4':
                letter = '$'
              case '5':
                letter = '%'
              case '6':
                letter = '^'
              case '7':
                letter = '&'
              case '8':
                letter = '*'
              case '9':
                letter = '('
              case '0':
                letter = ')'
              case '-':
                letter = '_'
              case '=':
                letter = '+'
              case '\\':
                letter = '|'
              case "'":
                letter = '"'
              case ';':
                letter = ':'
              case '[':
                letter = '{'
              case ']':
                letter = '}'
              case '`':
                letter = '~'
              default:
                letter = key.toUpperCase(); //check how this handles non alphabetic
            }
          } else {
            //lowercase verison
            letter = key.toLowerCase();
          }
          Keyboard.tryTypeLetter(letter);
        } else { //non single letter; delete, numpad, arrows
          switch(key) {
            case "Delete":
            case "Backspace":
              if (Keyboard.message != "")
                Keyboard.tryDeleteAtCursor()
              break;
            case "Space":
              Keyboard.tryTypeLetter(" "); break;
            case "Tab":
              for (var i in Array(4))
                Keyboard.tryTypeLetter(" ");
              break;
            case "Enter":
              Keyboard.sendMessage(); break;
            case "Arrow Right":
              Keyboard.cursorRight(); break;
            case "Arrow Left":
              Keyboard.cursorLeft(); break;
            case "Esc":
              Keyboard.active = false
          }
        }
        Keyboard.refreshTextboxes();
        break; //only add one letter
      }
    }
    //done "using" the keyboard
    this.keyboard_lock = false
  }
};

var eat_press = Input.isPressed;
Input.isPressed = function(key) {
  if (!Keyboard.active || this.keyboard_lock) {
    return eat_press.call(this, key);
  }
  return false;
};
var eat_trigger = Input.isTriggered;
Input.isTriggered = function(key) {
  if (key == KeyInput._keyMap['Mouse Left'] || ((Array.isArray(key)) && (key.indexOf(KeyInput._keyMap['Mouse Left']) >= 0))) {
    return eat_trigger.call(this, key);
  }
  if (!Keyboard.active || this.keyboard_lock) {
    return eat_trigger.call(this, key);
  }
  return false;
};
var eat_repeat = Input.isRepeated;
Input.isRepeated = function(key) {
  if (!Keyboard.active || this.keyboard_lock) {
    return eat_repeat.call(this,key);
  }
  return false;
};
