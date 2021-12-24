
Window_Base.prototype.getWrapHeight = function(line, indent, size, type) {
    let base = 0; const lineHeight = 20;
    let y = 0;
    let space = this.textWidth(" ");
    indent = indent || 0;
    //Still need to set these because they affect sizing/fit
    if (size) this.contents.fontSize = size;
    if (type) this.contents.fontFace = type;

    let x = base;
    let indented = false;
    let words = line.split(/\s/);
    const margins = 20; //TODO change?
    const width = this.width - 2*margins;

    let i = 0;
    while (i < words.length) {
      const word = words[i];
      let ww = this.textWidth(word);
      if (x+((x==base)?0:space)+ww < width) {
        x += ((x==base)?0:space)+ww;//draw this word
        i = i+1;
      } else if (x != base) {
        if (!indented) {indented = true; base+=indent;}
        x = base;
        y += lineHeight;
      } else {
        //if a single line is too long, have to break it
        var j = 0;
        while (j < word.length) {
          const l = this.textWidth(word[j]);
          if (x+l < width) {
            j = j+1; x+=l;
          } else if (x != base) {
            if (!indented) {indented = true; base+=indent;}
            x = base;
            y += lineHeight;
          } else {
            return; //else we'd never finish; window is likely way too narrow
          }
        }
        i = i+1;
      }
    }
    return y+lineHeight;
}

Window_Base.prototype.drawWrapLine = function(text, indent, y, align, size, color, type) {
    let base = 0; const lineHeight = 20;
    let space = this.textWidth(" ");
    indent = indent || 0;
    align = align || 'left';
    if (size) this.contents.fontSize = size;
    if (color) this.contents.textColor = color;
    if (type) this.contents.fontFace = type;

    let x = base;
    let indented = false;
    let words = text.split(/\s/);
    const margins = 20; //TODO change?
    const width = this.width - 2*margins;

    let i = 0;
    while (i < words.length) {
      const word = words[i];
      let ww = this.textWidth(word);
      if (x+((x==base)?0:space)+ww < width) {
        this.drawText(((x==base)?"":" ")+word, x, y, width, align);
        x += ((x==base)?0:space)+ww;//draw this word
        i = i+1;
      } else if (x != base) {
        if (!indented) {indented = true; base+=indent;}
        x = base;
        y += lineHeight;
      } else {
        //if a single line is too long, have to break it
        var j = 0;
        while (j < word.length) {
          const l = this.textWidth(word[j]);
          if (x+l < width) {
            this.drawText(word[j], x, y, width, align);
            j = j+1; x+=l;//draw this word
          } else if (x != base) {
            if (!indented) {indented = true; base+=indent;}
            x = base;
            y += lineHeight;
          } else {
            return; //else we'd never finish; window is likely way too narrow
          }
        }
        i = i+1;
      }
    }
    return y+lineHeight;
}

//Have to keep a version with this args for legacy/laziness
Window_Base.prototype.drawWrapText = function(text, indent, align, size) {
  return this.drawWrapTextOffset(text, -10, indent, align, size);
}

Window_Base.prototype.drawWrapTextOffset = function(text, y, indent, align, size) {
  this.contents.clear();

  let lines = text.split(/[\r\n]+/);
  for (let k = 0; k < lines.length; k++) {
    const line = lines[k];
    y = this.drawWrapLine(line, indent, y, align, size);
  }
  return y;
}

//-----------------------------------------------------------------------------
// Window_Checkbox
//
// The window for a binary choice selection

function Window_Checkbox() {
    this.initialize.apply(this, arguments);
}

Window_Checkbox.prototype = Object.create(Window_Base.prototype);
Window_Checkbox.prototype.constructor = Window_Base;

Window_Checkbox.prototype.LINE_HEIGHT = function() { return 36; };

Window_Checkbox.prototype.initialize = function(x, y, side, specs) {
    specs = specs || {};
    this._text = specs['text'] || ""; //text to display near the checkbox
    this.margins = specs['gap'] || 10; //distance between checkbox and start of text
    this._direction = specs['direction'] || 'left'; //direction (from checkbox) to display text
    this._dir = specs['dir'] || specs['directory'] || 'img/system/'; //directory to look for image
    this._image = specs['image'] || null; //image to use for the checkmark
    this._boxSize = specs['size'] || side * 0.9; //if no image, side length of interior box/fill
    this._color = specs['color'] || '#ffffff';
    this._fontColor = specs['font_color'] || '#ffffff';
    this._disableColor = specs['disable_color'] || '#cccccc';
    this._disableFontColor = specs['disable_font_color'] || '#cccccc';
    Window_Base.prototype.initialize.call(this, x, y, side, side);
    //this._createCursorSprite(); - called in createTextSprite
    this._createFillSprite();
    this._createTextSprite();

    this.visible = true;
    this.active = true;
    this._enabled = false;
    this._drawText();
};

Window_Checkbox.prototype._createFillSprite = function() {
    this._fill = new Sprite();
    if (this._image != null) {
        this._fill.bitmap = ImageManager.loadBitmap(this._dir, this._image);
    } else {
        this._fill.bitmap = new Bitmap(this.width, this.height);
        this._fill.bitmap.fillRect((this.width - this._boxSize)/2, (this.height - this._boxSize)/2, this._boxSize, this._boxSize, this._color);
    }
    
    this._fill.visible = false;
    this.addChild(this._fill);
}

Window_Checkbox.prototype.redrawBox = function() {
    let drawColor = (this.active) ? this._color : this._disableColor;
    if (this._image == null) {
        this._fill.bitmap.fillRect((this.width - this._boxSize)/2, (this.height - this._boxSize)/2, this._boxSize, this._boxSize, drawColor);
    }
}

Window_Checkbox.prototype.setColor = function(color) {
    this._color = color;
    this.redrawBox();
}

Window_Checkbox.prototype.setDisableColor = function(color) {
    this._disableColor = color;
    this.redrawBox();
}

Window_Checkbox.prototype.setFontColor = function(color) {
    this._fontColor = color;
    this._drawText();
}
Window_Checkbox.prototype.setDisableFontColor = function(color) {
    this._disableFontColor = color;
    this._drawText();
}

Window_Checkbox.prototype.isTouchedInsideFrame = function() {
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
}

Window_Checkbox.prototype._createTextSprite = function() {
    if (this._text != "") {
        this.text = new Sprite();
        let w = this.textWidth(this._text);
        let h = this.LINE_HEIGHT();
        let gr_width = (w > this.width) ? w : this.width;
        let gr_height = (h > this.height) ? h : this.height;
        this.text.bitmap = new Bitmap(w, h);
        switch(this._direction) {
          case 'up':
            this.text.x = (this.width - w)/2; this.text.y = -(h + this.margins);
            this.createCursorRect(-this.margins+this.text.x,-this.margins - h, gr_width + 2*this.margins, this.height + h + 2*this.margins);
            break;
          case 'down':
            this.text.x = (this.width - w)/2; this.text.y = (this.height + this.margins);
            this.createCursorRect(-this.margins+this.text.x,-this.margins, gr_width + 2*this.margins, this.height + h + 2*this.margins);
            break;
          case 'left':
            this.text.x = -(this.margins + w); this.text.y = (this.height - h)/2;
            this.createCursorRect(-this.margins - w,this.text.y - this.margins,this.width + w + 2*this.margins, gr_height+2*this.margins);
            break;
          case 'right':
            this.text.x = (this.width + this.margins); this.text.y = (this.height - h)/2;
            this.createCursorRect(-this.margins,this.text.y - this.margins,this.width + w + 2*this.margins, gr_height+2*this.margins);
            break;
        }
        this.text.bitmap.textColor = (this.active) ? this._fontColor : this._disableFontColor;
        this.text.bitmap.drawText(0,0,this.text.bitmap.width, this.text.bitmap.height);
        this.text.visible = false;
        this.addChild(this.text);
    } else {
        this.createCursorRect(-this.margins,-this.margins,this.width +2*this.margins, this.height+2*this.margins);
    }
}

Window_Checkbox.prototype.createCursorRect = function(x, y, width, height) {
  this._cursor = new Sprite;
  this._cursor.bitmap = new Bitmap(width, height);
  this._cursor.x = x;
  this._cursor.y = y;
  this._cursor.bitmap.fillRect(0,0,width,height,'#ffffff');
  this._cursor.opacity = 80;
  this.addChild(this._cursor);
}

Window_Checkbox.prototype.update = function() {
    let okTrigger = Input.isTriggered('ok') || this.isTouchedInsideFrame();
    Window_Base.prototype.update.call(this);
    if (this.active) {
        if (okTrigger) {
            this._enabled = !this._enabled;
        }
    }
    this._cursor.visible = this.active && this.visible;
    this._fill.visible = this.visible && this._enabled;
}

Window_Checkbox.prototype._drawText = function() {
  if (this._text == "" || !this.text) {
    return;
  }
  this.text.bitmap.clear();
  this.text.bitmap.textColor = (this.active) ? this._fontColor : this._disableFontColor;
  this.text.bitmap.drawText(this._text, 0, 0, this.text.bitmap.width, 36);
  this.text.visible = true;
}

Window_Checkbox.prototype.set = function(val=true) {
    this._enabled = val;
}
Window_Checkbox.prototype.get = function() {
    return this._enabled;
}

Object.defineProperty(Window_Checkbox.prototype, 'opacity', {
    get: function() {
        return this._windowSpriteContainer.alpha * 255;
    },
    set: function(value) {
        this._windowSpriteContainer.alpha = value.clamp(0, 255) / 255;
        this._cursor.opacity = value;
        this._fill.opacity = value;
        this.text.opacity = value;
    },
    configurable: true
});

Window_Checkbox.prototype.activate = function() {
    this.setColor(this._color);
    this.active = true;
}
Window_Checkbox.prototype.deactivate = function() {
    this.setColor(this._disableColor);
    this.active = false;
}
Window_Checkbox.prototype.show = function() {
    this.visible = true;
}
Window_Checkbox.prototype.hide = function() {
    this.visible = false;
}

//-----------------------------------------------------------------------------
// Window_Horz2
//
// The window for Horizontal command list with basic configurables

function Window_Horz2() {
    this.initialize.apply(this, arguments);
}

Window_Horz2.prototype = Object.create(Window_HorzCommand.prototype);
Window_Horz2.prototype.constructor = Window_Horz2;

Window_Horz2.prototype.initialize = function(x, y, specs) {
    specs = specs || {};
    this._windowWidth = specs['width'] || Graphics.boxWidth;
    this._maxCols = specs['maxcols'] || 1;
    this._visRows = specs['maxrows'] || -1;
    this._windowHeight = specs['height'] || -1;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
};

Window_Horz2.prototype.windowWidth = function() {
    return this._windowWidth;
};

Window_Horz2.prototype.windowHeight = function() {
  if (this._windowHeight > 0) return this._windowHeight;
  else return Window_Command.prototype.windowHeight.call(this);
}

Window_Horz2.prototype.numVisibleRows = function() {
  if (this._visRows > 0) return this._visRows;
  else return Window_Command.prototype.numVisibleRows.call(this);
}

Window_Horz2.prototype.maxCols = function() {
    return this._maxCols;
};

//-----------------------------------------------------------------------------
// Window_CommandList
//
// Version of Window_Command (Window_Horz2) where the command list is specified at initialization
function Window_CommandList() {
    this.initialize.apply(this, arguments);
}

Window_CommandList.prototype = Object.create(Window_Horz2.prototype);
Window_CommandList.prototype.constructor = Window_CommandList;

Window_CommandList.prototype.initialize = function(list, x, y, specs) {
    list = list || [];
    this._itemlist = list;
    Window_Horz2.prototype.initialize.call(this, x, y, specs);
};

Window_CommandList.prototype.makeCommandList = function(list) {
    list = (list && Array.isArray(list)) ? list : this._itemlist;
    if (this._itemlist != list) {
      this._itemlist = list;
      this.refresh();
    } else {
      for (let i = 0; i < this._itemlist.length; i++) {
          this.addCommand(this._itemlist[i], this._itemlist[i]);
      }
    }
}


//-----------------------------------------------------------------------------
// Window_MultiPick
//
// Divergent of WindowHorz2 where multiple items can be selected

function Window_MultiPick() {
    this.initialize.apply(this, arguments);
}

Window_MultiPick.prototype = Object.create(Window_CommandList.prototype);
Window_MultiPick.prototype.constructor = Window_MultiPick;

Window_MultiPick.prototype.initialize = function(list, x, y, specs) {
    this._selected = [];
    Window_CommandList.prototype.initialize.call(this, list, x, y, specs);
};

Window_MultiPick.prototype.addCommand = function(name, symbol, enabled, ext) {
    Window_Command.prototype.addCommand.call(this, name, symbol, enabled, ext);
    if (!this._handlers) this._selected.push(false);
};

Window_MultiPick.prototype.clearCommandList = function() {
    Window_CommandList.prototype.clearCommandList.call(this);
    //this._selected = [];
};

Window_MultiPick.prototype.select = function(target) {
    if (Array.isArray(target)) {
      this._selected = target;
    } else {
      Window_CommandList.prototype.select.call(this, target);
    }
}

Window_MultiPick.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    if (this._selected[index]) this.chosenTextColor(); else this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_MultiPick.prototype.chosenTextColor = function() {
    this.changeTextColor(this.hpGaugeColor2());
};

Window_MultiPick.prototype.processOk = function() {
    if (this.isCurrentItemEnabled()) {
        this.playOkSound();
        this._selected[this.index()] = !this._selected[this.index()];
        this.refresh();

    } else {
        this.playBuzzerSound();
    }
};

Window_MultiPick.prototype.getSelected = function() {
    var results = [];
    for (var i; i < this._selected.length; i++) {
        if (this._selected[i]) {
            results.push(this._list[i]);
        }
    } return results;
};

//-----------------------------------------------------------------------------
// Window_Dropdown
//
// A drop-down select window

function Window_Dropdown() {
    this.initialize.apply(this, arguments);
}
Window_Dropdown.prototype = Object.create(Window_CommandList.prototype);
Window_Dropdown.prototype.constructor = Window_Dropdown;

Window_Dropdown.prototype.initialize = function(options, x, y, opts) {
    this._selecting = false;
    opts = opts || {};
    this._noneText = opts['none_text'] || 'None';
    this._defaultSelect = opts['default'] || false;
    this._dropIndex = (this._defaultSelect) ? 0 : -1;
    if (opts['width']) {this._maxWidth = opts['width'];}
    else this._maxWidth = Window_Command.prototype.windowWidth.call(this);
    this._options = new Window_CommandList(options, x, y, {'width':this._maxWidth});
    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        this._options.setHandler(option, this.chooseUnfocus.bind(this));
    };
    Window_CommandList.prototype.initialize.call(this,[], x, y, {'width':this._maxWidth});
    align = opts['align'] || 'center';
    this.alignOptions(align);
    this._options.hide()
    this.addChild(this._options);
    this.revertUnfocus();
};

Window_Dropdown.prototype.alignOptions = function(align) {
  align = align || this.align || 'center';
  this.align = align;
  var dy = 0.0;
  switch(align) {
      case 'top':
          break;
      case 'bottom':
          dy = 1.0;
          break;
      case 'center':
          dy = 1.0/2.0;
          break;
      default:
          dy = parseFloat(align);
          if (isNaN(dy)) dy = 1.0/2.0;
  }
  this.dy = dy;
  this._options.move(0, dy*(this.height - this._options.height), this._options.width, this._options.height);
}

Window_Dropdown.prototype.update = function() {
  Window_CommandList.prototype.update.call(this);
  if (this._options._opening || this._options._closing) {
    var scaled = (this._options.height*(this._options._openness/255.0));
    //var y = (this._options._opening)?this.standardPadding():-this.standardPadding();
    var goalY = this.dy*(this.height - scaled);
    this._options.y = goalY+(scaled/2.0)-(this._options.height/2.0);
  } else { this._options.y = this.dy*(this.height - this._options.height); }
}

Window_Dropdown.prototype.setCommandList = function(list, index, align) {
  var _options = new Window_CommandList(list, this.x, this.y, {'width':this._windowWidth,'maxcols':this._maxCols,'maxrows':this._visRows});
  this.removeChild(this._options);
  this._options = _options;
  this._options.hide();
  this.addChild(this._options);
  this.alignOptions(align);
  for (var i = 0; i < list.length; i++) {
      var option = list[i];
      this._options.setHandler(option, this.chooseUnfocus.bind(this));
  };
  this._dropIndex = index || ((this._defaultSelect) ? 0 : -1);
  this.revertUnfocus();
  this.refresh();
}

Window_Dropdown.prototype.activate = function() {
  if (this._selecting) {
    this._options.activate();
  } else {
    Window_CommandList.prototype.activate.call(this);
  }
}

Window_Dropdown.prototype.deactivate = function() {
  Window_CommandList.prototype.deactivate.call(this);
  this._options.deactivate();
}

Window_Dropdown.prototype.hide = function() {
  Window_CommandList.prototype.hide.call(this);
  this._options.hide();
}
Window_Dropdown.prototype.show = function() {
  Window_CommandList.prototype.show.call(this);
  if (this._selecting)
    this._options.show();
}
Window_Dropdown.prototype.open = function() {
  Window_CommandList.prototype.open.call(this);
  if (this._selecting)
    this._options.open();
}
Window_Dropdown.prototype.close = function() {
  Window_CommandList.prototype.close.call(this);
  if (this._selecting)
    this._options.close();
}

Window_Dropdown.prototype.refresh = function() {
  Window_CommandList.prototype.refresh.call(this);
  this.drawNone();
}

Window_Dropdown.prototype.hasOptions = function() {
  return (!(!this._options._list || this._options._list.length == 0));
}

Window_Dropdown.prototype.drawNone = function() {
  if (!this.hasOptions()) {
    this.changeTextColor(this.systemColor());
    this.drawText(this._noneText, 0, 0, this.width, 'left');
  }
}

Window_Dropdown.prototype.makeCommandList = function() {
    if (!this._handlers) { //first time
        let options = this._options._list;
        let max = "";
        //currently this does not do anything; this was partial code towards
        //making it defualt to a width that accomodates the largest command
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            if (this._options.textWidth(option) > this._options.textWidth(max)) {
                if (this._maxWidth && this._options.textWidth(option) <= this._maxWidth) {
                    max = option;
                }
            }
        };
        this.addCommand(max, max);
    } else {
        this._options.setHandler('cancel', this.revertUnfocus.bind(this));
        if (this._options._list.length === 0) {
          //nothing
        } else if (this._dropIndex == -1 || this._dropIndex >= this._options._list.length) {
            this.addCommand("", "none");
            this.setHandler("none", this.openChoose.bind(this));
        } else {
            var chosen = this._options._list[this._dropIndex].name;
            this.addCommand(chosen, chosen);
            this.setHandler(chosen, this.openChoose.bind(this));
        }
    }

};

Window_Dropdown.prototype.processTouch = function() {
    Window_Selectable.prototype.processTouch.call(this);
    if (TouchInput.isTriggered() && !this._options.isTouchedInsideFrame()) {
        if (this._selecting) {
            this.revertUnfocus();
        }
    }
};

Window_Dropdown.prototype.getResult = function() {
    if (this._dropIndex == -1 || this._dropIndex >= this._options._list.length ||  0 == this._options._list.length) {
        return null;
    } else {
        return this._options._list[this._dropIndex];
    }
};

Window_Dropdown.prototype.unChoose = function() {
  if (this._selecting) this.revertUnfocus();
  this._dropIndex = -1;
  this.refresh();
}

Window_Dropdown.prototype.openChoose = function() {
    if (this._options._list.length <= 1) { this.activate(); return; }
    this._options.show();
    this._options.open();
    this._options.activate();
    this._options._index = (this._dropIndex == -1) ? 0 : this._dropIndex;
    this._selecting = true;
    Window_CommandList.prototype.deactivate.call(this);
};

Window_Dropdown.isTouchedInsideFrame = function() {
    if (this._selecting) {
      return this._options.isTouchedInsideFrame();
    } else {
      return Window_CommandList.prototype.isTouchedInsideFrame.call(this);
    }
}

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
    this._options.select(this._dropIndex.clamp(0, (this._options._list.length-1)));
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

Window_Textbox.prototype.MARGINS = function() { return 18;};
Window_Textbox.prototype.FONT = function() { return "GameFont"; };
Window_Textbox.prototype.FSIZE = function() { return 16; };
Window_Textbox.prototype.FCOLOR = function() { return '#ffffff'; };
Window_Textbox.prototype.ERR_COLOR = function() { return '#dd0000'; };
Window_Textbox.prototype.HINT_COLOR = function() { return '#cccccc'; };
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
    if (specs["width"]) { this.width = specs['width'];} else {this.width=this.CHAT_WIDTH();}
    if (specs["height"]) { this.height = specs['height'];} else {this.height=this.CHAT_HEIGHT();} 
    //size of margins on either side, between edges of textbox and text within
    if (specs["margins"]) { this.margins = specs['margins'];} else {this.margins =this.MARGINS();}
    //font type, size, and color
    if (specs["font_size"]) { this.f_size = specs['font_size'];} else {this.f_size=this.FSIZE();}
    if (specs["font"]) { this.f_name = specs['font'];} else {this.f_name=this.FONT();}
    if (specs["font_color"]) { this.f_color = specs['font_color'];} else {this.f_color=this.FCOLOR();}
    if (specs["highlight_color"]) { this._highlightColor = specs['highlight_color']; } else { this._highlightColor = this.HIGHLIGHT_COLOR(); }
    if (specs["hint_color"]) { this._hintColor = specs['hint_color']; } else { this._hintColor = this.HINT_COLOR(); }
    if (specs["error_color"]) { this._errColor = specs['error_color']; } else { this._errColor = this.ERR_COLOR(); }
    //restrictions on expected type to be input
    if (specs["type"]) {this.type = specs['type'];} else {this.type = 'string';}
    //which side of the text box type-related errors should be displayed; "up" means above the textbox, etc
    if (specs["err_dir"] && (['up', 'down', 'left', 'right'].indexOf(specs["err_dir"]) >= 0)) { this._err_dir = specs['err_dir']; } else { this._err_dir = 'down'; }
    //if there is a caption string to write beside the textbox
    if (specs["caption"]) {this._captionText = specs['caption'];} else {this._captionText = "";}
    if (specs["caption_size"]) { this.cap_f_size = specs['caption_size'];} else {this.cap_f_size=this.FSIZE();}
    if (specs["caption_font"]) { this.cap_f_name = specs['caption_font'];} else {this.cap_f_name=this.FONT();}
    if (specs["caption_color"]) { this.cap_f_color = specs['caption_color'];} else {this.cap_f_color=this.FCOLOR();}
    //the direction to write such a label
    if (specs["caption_dir"] && (['up', 'down', 'left', 'right'].indexOf(specs["caption_dir"]) >= 0)) { this._caption_dir = specs['caption_dir']; } else { this._caption_dir = 'up'; }
    //hint text
    if (specs["hint"]) {this.hint = specs['hint'];} else {this.hint = "";}
    //reset to last valid entry (or empty) if exit focus and the message is found to be invalid
    if (specs['reset']) {this.resetOnError = specs['reset'];} else {this.resetOnError = false;}

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
    this.cap = new Sprite();
    //placeholder used to generate size of caption from font type/size
    this.cap.bitmap = new Bitmap(0,0);
    this._setCaptionSprite();
    this.addChild(this.text);
    this.addChild(this.cursor);
    
    Keyboard.connectTextbox(this);
    
    this.visible = true;
    this.active = false;
    this._unlock = [];
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
};

Window_Textbox.prototype.setHint = function(text, clear) {
    clear = clear || false;
    this.hint = text;
    if (clear) {
      this._message = "";
      this.text.bitmap.clear();
    }
    this.writeText();
};

Window_Textbox.prototype.unlock = function(keyList) {
  this._unlock = keyList;
};

Window_Textbox.prototype.setSubmitHandler = function(method, obj) {
  obj = obj || this;
  this._submitCallback = method.bind(obj);
}
  
Window_Textbox.prototype.moveto = function(x, y) {
  var delx = x - this.x;
  this.x = x; this.y = y; this.lastx = x; this.lasty = y;
  this.cursor.y = y;
  this.cursor.x += delx;
};
Window_Textbox.prototype.isTouchedInsideFrame = function() {
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
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
    let mes = "";
    let i = this.scroll_index_x;
    let length = this.margins;
    let message = (this.active) ? Keyboard.message : this.getMessage();
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
  
Window_Textbox.prototype.setType = function(type) {
  switch(type) {
    case 'string':
    case 'number':
    case 'object':
    case 'boolean':
      this.type = type;
      this.refresh();
    default:
  }
};

Window_Textbox.prototype.setConstraint = function(method, message) {
  this._validCheck = method;
  this._specialErrText = message;
};

Window_Textbox.prototype.validEntryCheck = function() {
  this.validState = true;
  switch(this.type) {
    case 'string': //all valid
      break; 
    case 'number': if (isNaN(this._message)) {this.validState = false; }
      break;
    case 'object':
      try {
        JSON.parse(this._message);
      } catch (err) {
        this.validState = false;
      } break;
    case 'boolean': 
      if (/^(\s)*(true|false)(\s)*$/i.exec(this._message)) ; 
      else this.validState = false;
      break;
    default:
      this.type = 'string';
  }
  //check if fails due to additional constraints
  var errtext = null;
  if (this.validState && this._validCheck) {
    if (this._validCheck.call(this, this.getMessage())) ;
    else {
      this.validState = false;
      errtext = this._specialErrText;
    }
  }
  //if not valid, write error message
  if (this.validState) {
    if (this.resetOnError) {
        this._last = this._message;
    }
    return;
  }
  this.text.bitmap.fontFace = 'Verdana';
  this.text.bitmap.textColor = this._errColor;
  if (this.resetOnError) {
    this._message = this._last;
    this.refresh();
  }
  this.writeText(true, errtext);
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
  this.text.bitmap.fillRect(left, 0,(right - left), this.LINE_HEIGHT(), this._highlightColor);
};

Window_Textbox.prototype.moveCursorToMouse = function() {
  var i = 0; var length = this.x+this.margins-this.sumWidths(0,this.scroll_index_x);
  var message = this.active ? Keyboard.message : this.getMessage();
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

Window_Textbox.prototype._setCaptionSprite = function() {
    if (this._captionText != "") {
        const margins = 0;
        this._setCaptionFontParams();
        let w = this.cap.bitmap.measureTextWidth(this._captionText);
        let h = this.LINE_HEIGHT();
        this.cap.bitmap = new Bitmap(w, h);
        switch(this._caption_dir) {
          case 'up':
            this.cap.x = (this.width - w)/2; this.cap.y = -(h + margins);
            break;
          case 'down':
            this.cap.x = (this.width - w)/2; this.cap.y = (this.height + margins);
            break;
          case 'left':
            this.cap.x = -(margins + w); this.cap.y = (this.height - h)/2;
            break;
          case 'right':
            this.cap.x = (this.width + margins); this.cap.y = (this.height - h)/2;
            break;
        }
        this.writeCaption();
        this.cap.visible = false;
        this.addChild(this.cap);
    }
}

Window_Textbox.prototype._setCaptionFontParams = function() {
    this.cap.bitmap.fontSize = this.cap_f_size;
    this.cap.bitmap.fontFace = this.cap_f_name;
    this.cap.bitmap.textColor = this.cap_f_color;
}

Window_Textbox.prototype.writeCaption = function() {
  this.cap.bitmap.clear();
  if (this._captionText && this._captionText != "") {
    this._setCaptionFontParams();
    this.cap.bitmap.drawText(this._captionText,0,0,this.cap.bitmap.width, this.cap.bitmap.height);
  }
}
 
Window_Textbox.prototype.writeText = function(error, errtext) {
  error = error || false;
  errtext = errtext || ("Error: Invalid type. Expected: "+this.type);
  var string = this.findAppropriateString();
  if (string == "") {
    this.text.bitmap.textColor = this._hintColor;
    string = this.hint;
  }
  switch(this._err_dir) {
    case 'up':
      if (error) {
        this.text.bitmap.drawTextNoOutline(errtext, 0, this.height/2-10, this.width, 36);
      } else {
        this.text.bitmap.drawText(string, this.margins, this.height, this.width, 36);
      } break;
    case 'down':
      if (error) {
        this.text.bitmap.drawTextNoOutline(errtext, 0, this.height/2+10, this.width, 36);
      } else {
        this.text.bitmap.drawText(string, this.margins, 0, this.width, 36);
      } break;
    case 'left':
      if (error) {
        this.text.bitmap.drawTextNoOutline(errtext, 0, 0, this.width, 36);
      } else {
        this.text.bitmap.drawText(string, this.margins+this.width, 0, this.width, 36);
      } break;
    case 'right':
      if (error) {
        this.text.bitmap.drawTextNoOutline(errtext, this.width, 0, this.width, 36);
      } else {
        this.text.bitmap.drawText(string, this.margins, 0, this.width, 36);
      } break;
  }
}

Window_Textbox.prototype.setCaptionText = function(value) {
  this._captionText = value;
  this._setCaptionSprite();
  this.writeCaption();
}
Window_Textbox.prototype.setCaptionColor = function(value) {
  this.cap_f_color = value;
  this.writeCaption();
}
Window_Textbox.prototype.setCaptionName = function(value) {
  this.cap_f_name = value;
  this.writeCaption();
}
Window_Textbox.prototype.setCaptionSize = function(value) {
  this.cap_f_size = value;
  this.writeCaption();
}
Window_Textbox.prototype.setFontColor = function(value) {
  this.f_color = value;
  this.writeText();
}
Window_Textbox.prototype.setFontName = function(value) {
  this.f_name = value;
  this.writeText();
}
Window_Textbox.prototype.setFontSize = function(value) {
  this.f_size = value;
  this.writeText();
}
Window_Textbox.prototype.setHighlightColor = function(value) {
  this._highlightColor = value;
  this.writeText();
}
Window_Textbox.prototype.setHintColor = function(value) {
  this._hintColor = value;
  this.writeText();
}
Window_Textbox.prototype.setErrorColor = function(value) {
  this._errColor = value;
  this.writeText();
}

Window_Textbox.prototype.close = function() {
  Window_Base.prototype.close.call(this);
  //this.exitFocus(); //Should this assume/do this?
}

Window_Textbox.prototype.show = function() {
  Window_Base.prototype.show.call(this);
  this.visible = true;
}

Window_Textbox.prototype.hide = function() {
  Window_Base.prototype.hide.call(this);
  this.visible = false;
  //this.exitFocus(); //Should this assume/do this?
}

Window_Textbox.prototype.activate = function() {
  Window_Base.prototype.activate.call(this);
  Keyboard.message = this._message;
  Keyboard._cursor_pos = this.restore_cursor;
  this.active = true;
}

Window_Textbox.prototype.deactivate = function() {
  Window_Base.prototype.deactivate.call(this);
  this.exitFocus();
}

Object.defineProperty(Window_Textbox.prototype, 'opacity', {
    get: function() {
        return this._windowSpriteContainer.alpha * 255;
    },
    set: function(value) {
        this._windowSpriteContainer.alpha = value.clamp(0, 255) / 255;
        this.cap.opacity = value;
        this.text.opacity = value;
    },
    configurable: true
});

Window_Textbox.prototype.update = function() {
  Window_Base.prototype.update.call(this);
  //if someone used x or y attributes to move the textbox
  if (this.x != this.lastx || this.y != this.lasty) {
    moveto(this.x, this.y)
  }
  //if not visible, cannot activate/click into it
  if ((TouchInput.isTriggered() || TouchInput.isPressed()) && this.visible) {
    if (this.isTouchedInsideFrame()) {
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
  this.cap.visible = this.visible && this.isOpen();
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
  for (let i = 0; i < this.text_boxes.length; i++) {
    let box = this.text_boxes[i];
    if (box.active) {
      box.validEntryCheck()
      if (box.validState) {
        if (box._submitCallback) {
          (box._submitCallback.call());
        }
      }
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
  for (let box = 0; box < this.text_boxes.length; box++) {
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
  for (let i = 0; i < this.text_boxes.length; i++) {
    if (this.text_boxes[i].active) return this.text_boxes[i];
  }
  return null;
}

Keyboard.refreshTextboxes = function() {
    for (let box = 0; box < this.text_boxes.length; box++) {
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
      //stop highlight if we entered a character
      var textbox = this.window();
      textbox.firstHighlightIndex = this._cursor_pos
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
  let map = {};
  let keys = Object.keys(this._keyMap);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
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
let feed_keypresses_into_keyboard = Input.update;
Input.update = function() {
  feed_keypresses_into_keyboard.call(this);
  Keyboard.update();
  if (Keyboard.active) {
    this.keyboard_lock = true;
    let keys = Object.keys(this.keyMapper);
    for (let i = 0; i < keys.length; i++) {//KeyInput._keyMap) {
      let key = this.keyMapper[keys[i]];//KeyInput._keyMap[key];
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
          let letter;
          if (this.isPressed("Ctrl") || this.isRepeated("Ctrl")|| this.isPressed("Left Ctrl") || this.isRepeated("Left Ctrl")|| this.isPressed("Right Ctrl") || this.isRepeated("Right Ctrl")) {
            //if (this.isTriggered('c')) {
              //Keyboard.copy();
              //break;
            //} else if (this.isTriggered('v')) {
              //Keyboard.paste();
              //break;
            //}
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
              for (let i  = 0; i < 4; i++)
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

//Consolidate key names into ones that work with RPGM; only for their
// pres/trigger calls.
Keyboard.equalKey = function(key) {
    switch(key) {
        case "Arrow Down": return 'down';
        case "Arrow Up": return 'up';
        case "Arrow Right": return 'right';
        case "Arrow Left": return 'left';
        case "Enter":
        case "Z": case "z":
        case "Space": return 'ok';
        case "Shift":
        case "Left Shift":
        case "Right Shift": return 'shift';
        case "Tab": return 'tab';
        case "Left Ctrl":
        case "Right Ctrl":
        case "Left Alt":
        case "Right Alt":
        case "Ctrl":
        case "Alt": return 'control';
        case "X": case "x":
        case "Escape":
        case "Insert": return 'escape';
        case "Page Up":
        case "Q": case "q": return 'pageup';
        case "Page Down":
        case "W": case "w": return 'pagedown';
        case "F9": return 'debug';
    }
    return key;
}

/* 
    TODO
    NEXT TIME:
    I did the opposite - I made it so if we actively look for say, "Arrow Down", we convert that
     into what the game expects. We want to write "isTriggered" functions consistently with the rest
     (what the game expects) - so "down". So I need it to know, when I press Arrow Down, that this
     should satisfy someone asking if "isTriggered('down')". That- is messier... So two ways to do this:

     1) either just, create a manual mapping like above, but in reverse - so create a function that takes
      a key name and a method name, and does a "if key is this, return the OR of all calls of method on these
      related key names"

     2) find a way to get what I want without overwriting the default mappings of """keyname""" ("ok", "down", etc)
      to actual keyboard integer codes with mine. The issue here is, then I might have to change certain other code
      points that check for my names (Shift, Escape, etc), and things like 'x' and 'z' that are "ok" or "escape" - how
      do I do basic textbox-typing checks for the characters x or z? Hm, option one is clunky, but seems better...

*/
Input.buttonMapInput = function(method, keyname) {
    var check = [];
    var result = method.call(this, keyname);
    if (result) return true;
    switch (keyname) {
        case 'tab': check = ['Tab']; break;
        case 'ok': check = ['Enter', 'Space', 'Z', 'z']; break;
        case 'shift': check = ['Shift', 'Right Shift', 'Left Shift']; break;
        case 'control': check = ['Ctrl', 'Left Ctrl', 'Right Ctrl', 'Alt', 'Left Alt', 'Right Alt']; break;
        case 'escape': check = ['Escape', 'Insert', 'X', 'x']; break;
        case 'up': check = ['Arrow Up']; break;
        case 'down': check = ['Arrow Down']; break;
        case 'left': check = ['Arrow Left']; break;
        case 'right': check = ['Arrow Right']; break;
        case 'pageup': check = ['Page Up', 'Q', 'q']; break;
        case 'pagedown': check = ['Page Down', 'W', 'w']; break;
        case 'debug': check = ['F9']; break;
        default: break;
    }
    for (let i = 0; i < check.length; i++) {
        result = result || method.call(this, check[i]);
    }
    return result;
}

let eat_press = Input.isPressed;
Input.isPressed = function(key) {
  //If the scene has no active keyboard, proceed as the base game expects.
  if (!Keyboard.active) {
    //In this case the Input.keyMapper should be normal and not the extended version,
    //  so in theory a standard call to eat_press would be equivalent
    return this.buttonMapInput(eat_press, key);
  } else if (!this.keyboard_lock) {
    //If the scene has an active keyboard, but the Press inquiry is not being called by the keyboard,
    //  we want to call a version that will map our extended keyboard back to the normal game key mapping
    //  But, "eat" button presses that we haven't explicitly allowed ("unlocked")
    if ((Keyboard.window() && Keyboard.window()._unlock.indexOf(key) >= 0)) {
      return this.buttonMapInput(eat_press, key);
    }
    return false;
  } else {
    //If we are calling this from an active keyboard, we don't want it to map things like 'x' and 'z' to escape,
    //  perform Press inquiry raw on each key as it appears
    return eat_press.call(this, key);
  }

};

let eat_trigger = Input.isTriggered;
Input.isTriggered = function(key) {
  //Never override or lock out mouse input; we will always accept/register that
  if (key == KeyInput._keyMap['Mouse Left'] || ((Array.isArray(key)) && (key.indexOf(KeyInput._keyMap['Mouse Left']) >= 0))) {
    return eat_trigger.call(this, key);
  }
  
  //If the scene has no active keyboard, proceed as the base game expects.
  if (!Keyboard.active) {
    //In this case the Input.keyMapper should be normal and not the extended version,
    //  so in theory a standard call to eat_trigger would be equivalent
    return this.buttonMapInput(eat_trigger, key);
  } else if (!this.keyboard_lock) {
    //If the scene has an active keyboard, but the Trigger inquiry is not being called by the keyboard,
    //  we want to call a version that will map our extended keyboard back to the normal game key mapping
    //  But, "eat" button presses that we haven't explicitly allowed ("unlocked")
    if ((Keyboard.window() && Keyboard.window()._unlock.indexOf(key) >= 0)) {
      return this.buttonMapInput(eat_trigger, key);
    }
    return false;
  } else {
    //If we are calling this from an active keyboard, we don't want it to map things like 'x' and 'z' to escape,
    //  perform Trigger inquiry raw on each key as it appears
    return eat_trigger.call(this, key);
  }
};

let eat_repeat = Input.isRepeated;
Input.isRepeated = function(key) {
  //If the scene has no active keyboard, proceed as the base game expects.
  if (!Keyboard.active) { 
    //In this case the Input.keyMapper should be normal and not the extended version,
    //  so in theory a standard call to eat_repeat would be equivalent
    return this.buttonMapInput(eat_repeat, key);
  } else if (!this.keyboard_lock) {
    //If the scene has an active keyboard, but the Repeat inquiry is not being called by the keyboard,
    //  we want to call a version that will map our extended keyboard back to the normal game key mapping
    //  But, "eat" button presses that we haven't explicitly allowed ("unlocked")
    if ((Keyboard.window() && Keyboard.window()._unlock.indexOf(key) >= 0)) {
      return this.buttonMapInput(eat_repeat, key);
    }
    return false;
  } else {
    //If we are calling this from an active keyboard, we don't want it to map things like 'x' and 'z' to escape,
    //  perform Repeat inquiry raw on each key as it appears
    return eat_repeat.call(this, key);
  }
};
