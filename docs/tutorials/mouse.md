---
title: "4. The mouse"
sidebar_label: 4. The mouse
description: Turn on mouse reporting and build a tiny paint program.
---

# Tutorial 4: The mouse

Let us build a tiny paint program. You click and drag to draw coloured blocks, press `c` to clear and `q` to quit. Mouse support is a few extra lines.

## Turn the mouse on

The mouse is off by default. Switch it on once, right after `lt_init()`:

```c
lt_set_input_mode(LT_INPUT_MOUSE);
```

Clicks, drags and the scroll wheel now arrive as events with `ev.type == LT_EVENT_MOUSE`.

## What a mouse event tells you

- `ev.key` says which button or wheel: `LT_KEY_MOUSE_LEFT`, `LT_KEY_MOUSE_RIGHT`, `LT_KEY_MOUSE_MIDDLE`, `LT_KEY_MOUSE_WHEEL_UP`, `LT_KEY_MOUSE_WHEEL_DOWN`, and `LT_KEY_MOUSE_RELEASE` when you let go.
- `ev.x` and `ev.y` say where the pointer is, in the same cell coordinates you draw to.
- Dragging with the left button held sends a stream of `LT_KEY_MOUSE_LEFT` events. If we paint on every one, a drag draws a continuous line for free.

## The program

Paste this into `examples/playground.c`:

```c
#include "libterm/libterm.h"

/* The instructions line at the top. We redraw it after clearing. */
static void draw_header(void) {
  lt_print(0, 0, LT_CYAN, LT_DEFAULT,
           "Click and drag to paint.   c = clear   q = quit");
}

int main(void) {
  if (lt_init() != LT_OK)
    return 1;

  lt_set_input_mode(LT_INPUT_MOUSE); /* turn the mouse on */

  lt_clear();
  draw_header();
  lt_present();

  struct lt_event ev;
  while (lt_poll_event(&ev) == LT_OK) {
    if (ev.type == LT_EVENT_KEY) {
      if (ev.ch == 'q' || ev.key == LT_KEY_ESC)
        break;
      if (ev.ch == 'c') { /* clear the canvas */
        lt_clear();
        draw_header();
        lt_present();
      }
    } else if (ev.type == LT_EVENT_MOUSE) {
      /* Left button down, a click or a drag, paints a green block. */
      if (ev.key == LT_KEY_MOUSE_LEFT) {
        if (ev.y > 0) { /* leave the instructions row alone */
          lt_set_cell(ev.x, ev.y, ' ', LT_DEFAULT, LT_GREEN);
          lt_present();
        }
      }
    }
  }

  lt_shutdown();
  return 0;
}
```

Build and run it. Click and drag anywhere below the instructions and you are painting green. Press `c` to wipe it clean and `q` to quit.

## What is new

`lt_set_input_mode(LT_INPUT_MOUSE)` turns mouse reporting on. Without it, clicks do nothing.

We do not call `lt_clear()` every frame. A paint program keeps what you drew, so we clear only at the start and on `c`. Each new block is added and `lt_present()` shows it.

`ev.x` and `ev.y` are grid cells. They line up with `lt_set_cell`, so painting where the mouse is takes one call.

A drag is many left-button events. Our single `if` paints a continuous stroke without any extra work.

`if (ev.y > 0)` stops us painting over the instructions row.

On Windows the mouse works the same way. `LT_INPUT_MOUSE` enables console mouse input there, so nothing changes in your code.

## Try it yourself

1. Right-click to erase: on `LT_KEY_MOUSE_RIGHT`, paint with an `LT_DEFAULT` background.
2. Two colours: green with the left button and red with the middle button.
3. Show the position: add `lt_printf(0, lt_height() - 1, LT_DEFAULT, LT_DEFAULT, "x=%d y=%d   ", ev.x, ev.y);` as a status line.
4. A bigger brush: paint a 2 by 2 square around `(ev.x, ev.y)`.

Next: [Tutorial 5: Put it together](put-it-together).
