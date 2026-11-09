---
title: "3. The keyboard"
sidebar_label: 3. The keyboard
description: Move a character around the screen with the arrow keys, and learn the game loop.
---

# Tutorial 3: The keyboard

Time to make something move. We put a hero `@` on the screen and walk it around with the arrow keys. This is the heart of every game and menu: read a key, change something, draw again.

## The game loop

So far the loop only waited for `q`. Now it does a full cycle every time:

1. Draw the screen with the hero at its current spot.
2. Show it with `lt_present()`.
3. Wait for a key.
4. Change the hero's position based on the key.
5. Go back to step 1.

This cycle is called the game loop, or the event loop.

## Arrow keys are named keys

When you press a letter, it shows up in `ev.ch`. Arrow keys are not letters, so they arrive in `ev.key` as `LT_KEY_ARROW_UP`, `LT_KEY_ARROW_DOWN`, `LT_KEY_ARROW_LEFT` and `LT_KEY_ARROW_RIGHT`.

## The program

Paste this into `examples/playground.c`:

```c
#include "libterm/libterm.h"

int main(void) {
  if (lt_init() != LT_OK)
    return 1;

  /* Where the hero is. It starts near the top-left. */
  int hero_x = 5;
  int hero_y = 3;

  struct lt_event ev;
  int running = 1;
  while (running) {
    /* 1 and 2: draw the screen, then show it. */
    lt_clear();
    lt_print(1, 0, LT_CYAN, LT_DEFAULT, "Move with the arrow keys. Press q to quit.");
    lt_set_cell(hero_x, hero_y, '@', LT_YELLOW | LT_BOLD, LT_DEFAULT);
    lt_present();

    /* 3: wait for the next event. */
    if (lt_poll_event(&ev) != LT_OK)
      continue;
    if (ev.type != LT_EVENT_KEY)
      continue; /* ignore mouse and resize for now */

    /* 4: change the hero based on the key. */
    if (ev.ch == 'q' || ev.key == LT_KEY_ESC)
      running = 0;
    else if (ev.key == LT_KEY_ARROW_UP)
      hero_y = hero_y - 1;
    else if (ev.key == LT_KEY_ARROW_DOWN)
      hero_y = hero_y + 1;
    else if (ev.key == LT_KEY_ARROW_LEFT)
      hero_x = hero_x - 1;
    else if (ev.key == LT_KEY_ARROW_RIGHT)
      hero_x = hero_x + 1;

    /* Keep the hero on the screen. */
    if (hero_x < 0)
      hero_x = 0;
    if (hero_y < 1)
      hero_y = 1; /* row 0 holds the instructions */
    if (hero_x > lt_width() - 1)
      hero_x = lt_width() - 1;
    if (hero_y > lt_height() - 1)
      hero_y = lt_height() - 1;
  }

  lt_shutdown();
  return 0;
}
```

Build and run it. A yellow `@` walks around with the arrow keys. Try to bump into each edge: the hero stops instead of disappearing. Press `q` to quit.

## What is new

`hero_x` and `hero_y` remember where the hero is between loops. An arrow key adds or subtracts 1.

We draw at the top of the loop so you see the starting screen before pressing anything. Each key wakes `lt_poll_event`, we update the position, and the loop redraws.

`lt_clear()` every frame wipes the screen before redrawing the hero at its new spot. Without it the old `@` would stay and leave a trail.

The four `if` checks keep the hero inside the visible area, using `lt_width() - 1` and `lt_height() - 1`, the last valid column and row. This is called clamping.

There is no blinking cursor because `lt_init` hides it, the same as termbox2. `lt_set_cursor(x, y)` places and shows it, `lt_hide_cursor()` hides it again, and `lt_shutdown` restores it for the shell.

## Try it yourself

1. Leave a trail: delete the `lt_clear();` line. Then add a way to clear it: when `ev.ch == 'c'`, draw one clear frame.
2. Go faster: move the hero by 2 instead of 1.
3. Change the hero to a star with `lt_set_cell(hero_x, hero_y, 0x2605, LT_YELLOW, LT_DEFAULT)`.
4. Add a coin: pick a `coin_x` and `coin_y`, draw a `$`, and print "You got it!" when the hero lands on it.

Next: [Tutorial 4: The mouse](mouse).
