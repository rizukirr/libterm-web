---
title: "2. Drawing and layout"
sidebar_label: 2. Drawing and layout
description: Draw a box with line characters and keep it centred when the terminal is resized.
---

# Tutorial 2: Drawing and layout

In Tutorial 1 we put things at fixed spots. Now we draw a box, place it in the middle of the screen, and keep it centred when the window changes size. Deciding where things go is what layout means.

## Two new helpers

- `lt_width()` returns how many columns wide the screen is.
- `lt_height()` returns how many rows tall it is.

To centre something, use simple arithmetic. If the screen is `width` wide and the box is `boxw` wide, the left edge of the box goes at:

```
x = (width - boxw) / 2
```

Half the leftover space goes on each side. The same idea gives the vertical position from `lt_height()`.

## Line-drawing characters

A terminal has special characters that connect into neat boxes. We refer to each by its Unicode codepoint, written in hex:

| Piece | Looks like | Codepoint |
|---|---|---|
| top-left corner | `╭` | `0x256D` |
| top-right corner | `╮` | `0x256E` |
| bottom-left corner | `╰` | `0x2570` |
| bottom-right corner | `╯` | `0x256F` |
| horizontal line | `─` | `0x2500` |
| vertical line | `│` | `0x2502` |

`lt_set_cell` takes a codepoint, so these numbers go straight in.

## The program

Paste this into `examples/playground.c`:

```c
#include "libterm/libterm.h"
#include <string.h> /* strlen */

#define BOX_TL 0x256D
#define BOX_TR 0x256E
#define BOX_BL 0x2570
#define BOX_BR 0x256F
#define BOX_H 0x2500
#define BOX_V 0x2502

/* Draw an empty box: top-left corner at (x, y), w columns wide, h rows tall. */
static void draw_box(int x, int y, int w, int h, lt_attr color) {
  lt_set_cell(x, y, BOX_TL, color, LT_DEFAULT);
  lt_set_cell(x + w - 1, y, BOX_TR, color, LT_DEFAULT);
  lt_set_cell(x, y + h - 1, BOX_BL, color, LT_DEFAULT);
  lt_set_cell(x + w - 1, y + h - 1, BOX_BR, color, LT_DEFAULT);

  for (int i = 1; i < w - 1; i++) {
    lt_set_cell(x + i, y, BOX_H, color, LT_DEFAULT);
    lt_set_cell(x + i, y + h - 1, BOX_H, color, LT_DEFAULT);
  }
  for (int j = 1; j < h - 1; j++) {
    lt_set_cell(x, y + j, BOX_V, color, LT_DEFAULT);
    lt_set_cell(x + w - 1, y + j, BOX_V, color, LT_DEFAULT);
  }
}

/* Draw the whole screen. Called again whenever the window resizes. */
static void draw_everything(void) {
  lt_clear(); /* wipe the back buffer so old content does not linger */

  int width = lt_width();
  int height = lt_height();

  int boxw = 34;
  int boxh = 7;
  int bx = (width - boxw) / 2;
  int by = (height - boxh) / 2;
  if (bx < 0)
    bx = 0;
  if (by < 0)
    by = 0;

  draw_box(bx, by, boxw, boxh, LT_CYAN);

  /* A title, centred along the top edge of the box. */
  const char *title = " My First Box ";
  int tx = bx + (boxw - (int)strlen(title)) / 2;
  lt_print(tx, by, LT_YELLOW | LT_BOLD, LT_DEFAULT, title);

  lt_print(bx + 2, by + 2, LT_WHITE, LT_DEFAULT, "I stay in the middle of");
  lt_print(bx + 2, by + 3, LT_WHITE, LT_DEFAULT, "the screen when you resize!");
  lt_print(bx + 2, by + 5, LT_GREEN, LT_DEFAULT, "Press q to quit.");

  lt_present();
}

int main(void) {
  if (lt_init() != LT_OK)
    return 1;

  draw_everything();

  struct lt_event ev;
  while (lt_poll_event(&ev) == LT_OK) {
    if (ev.type == LT_EVENT_KEY && (ev.ch == 'q' || ev.key == LT_KEY_ESC))
      break;
    if (ev.type == LT_EVENT_RESIZE)
      draw_everything(); /* the window changed size, draw again */
  }

  lt_shutdown();
  return 0;
}
```

Build and run it. You should see a cyan box with a yellow title in the centre. Now drag the corner of your terminal window to resize it. The box jumps back to the middle.

## What is new

`draw_box` is a helper we wrote. It draws the four corners, then loops to fill the top and bottom edges and the left and right edges. The loops start at 1 and stop at `w - 1` or `h - 1` so they do not overwrite the corners.

Centring uses `(width - boxw) / 2`. The guard `if (bx < 0) bx = 0;` handles a window smaller than the box, so we never draw at a negative position.

The title sits on the top border. We draw the box first, then print the title over the top edge. The spaces around `" My First Box "` make it look like a label tucked into the line.

`LT_YELLOW | LT_BOLD` combines a colour with an attribute using `|`. Attributes go on the foreground. The full list is `LT_BOLD`, `LT_DIM`, `LT_ITALIC`, `LT_UNDERLINE`, `LT_BLINK`, `LT_REVERSE` and `LT_STRIKE`.

`lt_clear()` wipes the back buffer before we redraw. Without it, the old box would still be there when the new one moves.

When the window size changes, libterm sends an `LT_EVENT_RESIZE`. By the time you receive it, `lt_width()` and `lt_height()` already report the new size, so you redraw. That is the whole trick to layouts that adapt.

## Try it yourself

1. Make the box bigger or smaller by changing `boxw` and `boxh`.
2. Change the colour to `LT_MAGENTA` and the corners to square ones: `0x250C`, `0x2510`, `0x2514`, `0x2518`.
3. Draw two boxes side by side.
4. Put the box in the top-right corner: `bx = width - boxw - 1;` and `by = 1;`.

Next: [Tutorial 3: The keyboard](keyboard), where things start to move.
