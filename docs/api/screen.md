---
title: Screen
description: lt_width, lt_height, lt_clear, lt_set_clear_attrs, lt_present and lt_invalidate.
---

# Screen

```c
int lt_width(void);
int lt_height(void);
int lt_clear(void);
int lt_set_clear_attrs(lt_attr fg, lt_attr bg);
int lt_present(void);
int lt_invalidate(void);
```

## lt_width, lt_height

The back buffer's width and height in cells. They track the terminal size and are updated before each `LT_EVENT_RESIZE` is delivered. Both return 0 before `lt_init`.

## lt_clear

Resets every back-buffer cell to a blank in the current clear attributes and marks all rows dirty, so the next `lt_present` paints a cleared screen. Emits nothing by itself.

Returns `LT_ERR_NOT_INIT` before init.

## lt_set_clear_attrs

Sets the foreground and background used to fill cleared cells, by `lt_clear` and when the buffer grows on a resize. The default is the terminal's own colours, 0 and 0.

Returns `LT_ERR_NOT_INIT` before init.

## lt_present

Renders the back buffer: compares it with the last presented frame and emits only the changed cells, as cursor moves, SGR sequences and glyphs, inside a DEC 2026 synchronized-update bracket. A frame with no changes writes nothing. Call it once after a batch of drawing calls.

Returns `LT_ERR_NOT_INIT` before init, or a write or move error code.

## lt_invalidate

Forces the next `lt_present` to repaint every cell, bypassing the diff. Use it after `lt_send`, `lt_sendf` or any other out-of-band write has made the terminal differ from libterm's model of it.

Returns `LT_ERR_NOT_INIT` before init.

## See also

[Screen and rendering](../guides/screen-and-rendering).
