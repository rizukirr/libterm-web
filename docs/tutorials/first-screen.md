---
title: "1. Your first screen"
sidebar_label: 1. Your first screen
description: Put coloured text and coloured squares on the screen, and learn the three beats of every libterm program.
---

# Tutorial 1: Your first screen

Let us put coloured text and a few coloured squares on the screen. By the end you will know the three beats every libterm program follows.

If you have not yet, read [the big idea](./#the-big-idea) and [the build recipe](./#how-to-build-and-run-the-programs) on the tutorials page.

## The program

Paste this into `examples/playground.c`:

```c
#include "libterm/libterm.h"

int main(void) {
  /* Beat 1: wake up the screen. If it fails, stop. */
  if (lt_init() != LT_OK)
    return 1;

  /* Beat 2a: draw. The numbers 2 and 1 are the column (x) and row (y).
     LT_GREEN is the letter colour, LT_DEFAULT is the background. */
  lt_print(2, 1, LT_GREEN, LT_DEFAULT, "Hi! This is my first screen.");
  lt_print(2, 2, LT_YELLOW, LT_DEFAULT, "Press q to quit.");

  /* A row of coloured squares. A space with a coloured background
     looks like a solid block. */
  lt_set_cell(2, 4, ' ', LT_DEFAULT, LT_RED);
  lt_set_cell(3, 4, ' ', LT_DEFAULT, LT_GREEN);
  lt_set_cell(4, 4, ' ', LT_DEFAULT, LT_BLUE);
  lt_set_cell(5, 4, ' ', LT_DEFAULT, LT_YELLOW);
  lt_set_cell(6, 4, ' ', LT_DEFAULT, LT_MAGENTA);

  /* Beat 2b: show everything we drew, all at once. */
  lt_present();

  /* Beat 2c: wait for the user to press q or Esc. */
  struct lt_event ev;
  while (lt_poll_event(&ev) == LT_OK) {
    if (ev.type == LT_EVENT_KEY && (ev.ch == 'q' || ev.key == LT_KEY_ESC))
      break;
  }

  /* Beat 3: put the screen back the way it was. */
  lt_shutdown();
  return 0;
}
```

Build and run it:

```sh
cmake --build build
./build/examples/playground
```

You should see a green greeting, a yellow "Press q to quit", and a row of five coloured squares below it. Press `q` and your normal terminal comes back.

## What just happened

`#include "libterm/libterm.h"` gives you every libterm function and name.

`lt_init()` wakes up the screen and clears it. It returns `LT_OK`, which is 0, when it works. We check it and quit if it failed.

`lt_print(x, y, fg, bg, "text")` writes text starting at column `x`, row `y`. `fg` is the foreground, the colour of the letters, and `bg` is the background. Counting starts at 0 and `y` grows downward.

`lt_set_cell(x, y, ch, fg, bg)` sets one cell. `ch` is the character. We used a space and gave it a coloured background, which paints a solid block. You could put a letter there instead.

`lt_present()` is the "show it now" call. Until you call it, everything you drew is invisible. libterm works out exactly what changed and updates only that, so there is no flicker.

The `while` loop calls `lt_poll_event(&ev)`, which waits until something happens (a key, a click, a resize) and fills in `ev`. `ev.type` says what kind of event it is. For a key, `ev.ch` is the character you typed and `ev.key` is a named key such as `LT_KEY_ESC`. On `q` or Escape we leave the loop.

`lt_shutdown()` cleans up and gives you your terminal back. Always call it.

## The colours you can use

These names work everywhere: `LT_DEFAULT` (the terminal's normal colour), `LT_BLACK`, `LT_RED`, `LT_GREEN`, `LT_YELLOW`, `LT_BLUE`, `LT_MAGENTA`, `LT_CYAN`, `LT_WHITE`.

Millions of colours, such as `LT_RGB(255, 128, 0)` for orange, need one extra setup step. [Tutorial 5](put-it-together#millions-of-colours) covers it.

## Try it yourself

1. Change the greeting to your own name.
2. Move the text down a few rows by changing the `y` numbers.
3. Add a second row of squares below the first.
4. Make a square that is a letter on a coloured background: `lt_set_cell(10, 4, 'A', LT_WHITE, LT_BLUE)`.

Next: [Tutorial 2: Drawing and layout](drawing-and-layout), where we draw boxes and centre them.
