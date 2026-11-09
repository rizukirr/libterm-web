---
title: Screen and rendering
description: The back buffer, how lt_present diffs frames, clearing, invalidation, resize and the cursor.
---

# Screen and rendering

libterm keeps two grids of cells: the back buffer you draw into, and the front buffer that records what the terminal currently shows. `lt_present` compares them and writes only the difference.

## The back buffer

`lt_init` allocates the buffers at the terminal's current size. `lt_width()` and `lt_height()` report that size in cells, and both return 0 before init.

Every drawing call writes to the back buffer and marks the row dirty. Nothing reaches the terminal until you present.

| Call | Writes |
|---|---|
| `lt_set_cell(x, y, ch, fg, bg)` | one cell |
| `lt_set_cell_ex` and `lt_extend_cell` | one cell holding a grapheme cluster, see [Text and Unicode](text-and-unicode) |
| `lt_print` and `lt_printf` | a UTF-8 string from `(x, y)` onward |
| `lt_clear()` | every cell, reset to a blank in the clear attributes |

`lt_get_cell(x, y, &cell)` copies a back-buffer cell out, so you can read what you drew. Off-buffer coordinates return `LT_ERR_OUT_OF_BOUNDS` from all of these.

## Presenting a frame

```c
lt_clear();
draw_everything();
lt_present();
```

`lt_present` walks the dirty rows, compares each cell with the front buffer, and emits cursor moves, SGR changes and glyphs for the cells that differ. The whole update is wrapped in a DEC 2026 synchronized-update bracket, so a terminal that supports it swaps the frame atomically. A frame with no changes writes nothing at all.

The cell comparison is vectorised. The build compiles every SIMD backend the architecture supports and picks one at startup, see [Build options](../getting-started/build-options). You do not see any of this from the API.

Calling `lt_present` once per frame, after a batch of drawing calls, is the intended rhythm. Calling it after every cell works but sends many small writes.

## Clearing

`lt_clear()` resets every back-buffer cell to a blank. It does not touch the terminal by itself. The next `lt_present` paints the cleared screen.

The blank cell takes the clear attributes, which default to the terminal's own foreground and background. `lt_set_clear_attrs(fg, bg)` changes them. The same attributes fill new cells when the buffer grows on a resize.

A program that redraws everything each frame calls `lt_clear` first. A program that only adds to the screen, like a paint tool, does not.

## When the terminal and libterm disagree

`lt_send` and `lt_sendf` write raw bytes straight to the terminal, bypassing the buffers. They exist for escape sequences libterm does not model, such as setting the window title. After one of them the terminal may no longer match libterm's front buffer. Call `lt_invalidate()` so the next `lt_present` repaints every cell instead of diffing.

A resize also forces a full repaint on the next present. You do not need `lt_invalidate` for that.

## Resize

When the terminal changes size, libterm resizes both buffers and delivers an `LT_EVENT_RESIZE` with the new `w` and `h`. By the time you receive it, `lt_width()` and `lt_height()` already report the new size. Redraw from them and present:

```c
if (ev.type == LT_EVENT_RESIZE) {
  lt_clear();
  draw_everything();   /* lay out from lt_width() and lt_height() */
  lt_present();
}
```

On POSIX the resize comes from `SIGWINCH` through a self-pipe, so it arrives as an ordinary event in `lt_poll_event`. On Windows it comes from a console buffer event. The `resize` example shows a layout that recentres on every resize.

## The cursor

The hardware cursor starts hidden after `lt_init`, the same as termbox2.

- `lt_set_cursor(x, y)` moves it and shows it. `lt_present` keeps it parked there across frames. A negative coordinate returns `LT_ERR_OUT_OF_BOUNDS`.
- `lt_hide_cursor()` hides it again. Calling it when already hidden emits nothing.
- `lt_show_cursor()` shows it at its current position. termbox2 has no equivalent, so ported code usually calls `lt_set_cursor` instead.

`lt_shutdown` always restores cursor visibility for the shell.

## Reference

[Screen](../api/screen), [Cells and clusters](../api/cells), [Cursor](../api/cursor), [Raw output](../api/raw-output).
