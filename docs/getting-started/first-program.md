---
title: Your first program
description: A twenty-line libterm program, and what each line does.
---

# Your first program

```c title="hello.c"
#include "libterm/libterm.h"

int main(void) {
  if (lt_init() != LT_OK)
    return 1;

  lt_print(2, 1, LT_GREEN, LT_DEFAULT, "hello, libterm, press q to quit");
  lt_present();

  struct lt_event ev;
  while (lt_poll_event(&ev) == LT_OK) {
    if (ev.type == LT_EVENT_KEY && (ev.ch == 'q' || ev.key == LT_KEY_ESC))
      break;
  }

  lt_shutdown();
  return 0;
}
```

Build it against an installed libterm:

```sh
cc hello.c $(pkg-config --cflags --libs libterm) -o hello
./hello
```

Or add it to the `examples/` folder of a libterm checkout, register it in `examples/CMakeLists.txt` with `libterm_add_example(hello2)`, and run `cmake --build build`.

## What each line does

`lt_init()` opens the controlling terminal, switches it to raw mode and the alternate screen, and allocates the cell buffers at the current size. It returns `LT_OK` on success. If it fails there is no terminal to draw on, so the program exits.

`lt_print(x, y, fg, bg, text)` writes a UTF-8 string into the back buffer starting at column 2, row 1. `LT_GREEN` is the foreground and `LT_DEFAULT` keeps the terminal's own background. Nothing is visible yet.

`lt_present()` compares the back buffer with the last frame and sends only what changed. This is the one call that touches the screen.

`lt_poll_event(&ev)` blocks until something happens and fills in the event. For a key event, a printable character arrives in `ev.ch` and a named key such as Escape arrives in `ev.key`. One of the two is set, the other is 0.

`lt_shutdown()` leaves the alternate screen, restores the saved terminal settings and frees the buffers. Call it on every exit path, including errors, so a crash does not leave the user's shell in raw mode.

## Next

The [tutorials](../tutorials/) build on this program step by step. [Screen and rendering](../guides/screen-and-rendering) explains the buffer model in full.
