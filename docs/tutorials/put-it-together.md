---
title: "5. Put it together"
sidebar_label: 5. Put it together
description: Combine keyboard, mouse, layout and colour into a paint app with a toolbar and a status bar, and switch on truecolor.
---

# Tutorial 5: Put it together

Let us combine everything into one small app: a paint program with a colour toolbar and a status bar. You pick a colour with the number keys and paint with the mouse. Along the way you meet `lt_printf`, millions of colours, and `lt_detect_color_depth`.

## The layout

The screen splits into three parts:

```
row 0      Colors (press 1-7):                                 title
row 1      1 ▓▓  2 ▓▓  3 ▓▓ ...                                the toolbar
rows 2..   the canvas, paint here
last row   left-drag = paint  c = clear  q = quit  pointer: 12,5   status bar
```

## The program

Paste this into `examples/playground.c`:

```c
#include "libterm/libterm.h"

/* Our seven paint colours. */
static const lt_attr palette[] = {LT_RED,     LT_GREEN, LT_BLUE,  LT_YELLOW,
                                  LT_MAGENTA, LT_CYAN,  LT_WHITE};
#define NCOLORS 7

static int cur = 1; /* index of the chosen colour, start on green */

/* Draw the title and the colour swatches across the top two rows. */
static void draw_toolbar(void) {
  for (int x = 0; x < lt_width(); x++) { /* wipe the two toolbar rows */
    lt_set_cell(x, 0, ' ', LT_DEFAULT, LT_DEFAULT);
    lt_set_cell(x, 1, ' ', LT_DEFAULT, LT_DEFAULT);
  }
  lt_print(1, 0, LT_WHITE | LT_BOLD, LT_DEFAULT, "Colors (press 1-7):");

  for (int i = 0; i < NCOLORS; i++) {
    int x = 1 + i * 5;
    lt_attr num = (i == cur) ? (LT_WHITE | LT_BOLD) : LT_WHITE;
    lt_printf(x, 1, num, LT_DEFAULT, "%d", i + 1);
    lt_set_cell(x + 1, 1, ' ', LT_DEFAULT, palette[i]); /* a 2-cell swatch */
    lt_set_cell(x + 2, 1, ' ', LT_DEFAULT, palette[i]);
    if (i == cur)
      lt_print(x + 3, 1, LT_WHITE | LT_BOLD, LT_DEFAULT, "<");
  }
}

/* Draw the status bar along the bottom row. */
static void draw_status(int px, int py) {
  int row = lt_height() - 1;
  for (int x = 0; x < lt_width(); x++)
    lt_set_cell(x, row, ' ', LT_WHITE, LT_BLUE); /* a blue bar */
  lt_printf(1, row, LT_WHITE, LT_BLUE,
            "left-drag = paint   c = clear   q = quit   pointer: %d,%d", px, py);
}

int main(void) {
  if (lt_init() != LT_OK)
    return 1;

  lt_set_output_mode(lt_detect_color_depth()); /* the best colours this terminal has */
  lt_set_input_mode(LT_INPUT_MOUSE);

  int px = 0, py = 0; /* last pointer position, for the status bar */

  lt_clear();
  draw_toolbar();
  draw_status(px, py);
  lt_present();

  struct lt_event ev;
  while (lt_poll_event(&ev) == LT_OK) {
    if (ev.type == LT_EVENT_KEY) {
      if (ev.ch == 'q' || ev.key == LT_KEY_ESC)
        break;
      if (ev.ch >= '1' && ev.ch <= '0' + NCOLORS) { /* pick a colour */
        cur = ev.ch - '1';
        draw_toolbar();
        lt_present();
      } else if (ev.ch == 'c') { /* clear the canvas */
        lt_clear();
        draw_toolbar();
        draw_status(px, py);
        lt_present();
      }
    } else if (ev.type == LT_EVENT_MOUSE) {
      px = ev.x;
      py = ev.y;
      /* paint only inside the canvas, below the toolbar and above the status bar */
      if (ev.key == LT_KEY_MOUSE_LEFT && ev.y >= 2 && ev.y <= lt_height() - 2)
        lt_set_cell(ev.x, ev.y, ' ', LT_DEFAULT, palette[cur]);
      draw_status(px, py);
      lt_present();
    } else if (ev.type == LT_EVENT_RESIZE) {
      lt_clear();
      draw_toolbar();
      draw_status(px, py);
      lt_present();
    }
  }

  lt_shutdown();
  return 0;
}
```

Build and run it. A colour toolbar sits at the top and a blue status bar at the bottom. Press `1` to `7` to choose a colour, then click and drag in the middle to paint. The status bar follows your pointer. Press `c` to clear and `q` to quit.

## What is new

One loop handles keys, mouse and resize, each in its own branch. That is the shape of almost every real terminal app.

`palette[]` holds the colours. `ev.ch >= '1' && ev.ch <= '7'` turns the typed digit into an index with `cur = ev.ch - '1'`, so `'1'` becomes 0.

`lt_printf` works like `printf` but draws into cells at `(x, y)` with colours. It is made for status lines and scores.

The status bar fills a whole row with blue cells, then prints white text on top. Filling a row with a background colour is a classic UI trick.

The canvas is rows 2 to `height - 2`. The paint check keeps the brush out of the toolbar and the status bar.

## Millions of colours

The named colours are eight. For 24-bit colour, do two things.

First, ask for the richest mode the terminal supports. The program above already does this:

```c
lt_set_output_mode(lt_detect_color_depth());
```

Second, make a colour with `LT_RGB(red, green, blue)`, each part 0 to 255:

```c
lt_attr orange = LT_RGB(255, 128, 0);
lt_attr sky    = LT_RGB(135, 206, 235);
lt_set_cell(10, 5, ' ', LT_DEFAULT, orange);
```

A gradient across the screen:

```c
for (int x = 0; x < lt_width(); x++) {
  int r = (x * 255) / lt_width();
  lt_set_cell(x, 6, ' ', LT_DEFAULT, LT_RGB(r, 64, 255 - r));
}
lt_present();
```

If a terminal does not support truecolor, `lt_detect_color_depth()` returns the next best mode and your program still works.

## The tools you now know

| Tool | What it is for |
|---|---|
| `lt_init`, `lt_shutdown` | wake up and restore the screen |
| `lt_set_cell` | draw one cell |
| `lt_print`, `lt_printf` | draw text |
| `lt_clear`, `lt_present` | wipe the back buffer, show the frame |
| `lt_width`, `lt_height` | the screen size, for layout |
| `lt_poll_event` | wait for a key, a click or a resize |
| `ev.key`, `ev.ch`, `ev.mod`, `ev.action` | what happened |
| `lt_set_input_mode(LT_INPUT_MOUSE)` | turn on the mouse |
| `lt_set_cursor`, `lt_hide_cursor` | place and show the cursor, hide it |
| `lt_set_output_mode`, `lt_detect_color_depth`, `LT_RGB` | truecolor |
| `LT_BOLD`, `LT_UNDERLINE`, `LT_REVERSE` and the rest | text styles, combined with a colour using `\|` |

## Where to go next

- The [guides](../guides/screen-and-rendering) explain each area in depth.
- The [API reference](../api/) lists every function and constant.
- The `kbd` example in [Examples](../examples) is an on-screen keyboard and a live event inspector, a good next thing to read.

Ideas to keep going: an eraser on right-click, a bigger brush, saving your art to a file, or turning Tutorial 3's hero into a game that collects coins.
