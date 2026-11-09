---
title: Tutorials
description: Five short programs that teach drawing, layout, keyboard and mouse input with libterm.
---

# Tutorials

These five tutorials teach you to write programs that draw on the screen and react to the keyboard and mouse. Each one gives you a complete program to copy, build and run, then explains why it works. If you can edit a file and run a command, you can do all of them.

| # | Tutorial | You build |
|---|---|---|
| 1 | [Your first screen](./first-screen.md) | a colourful greeting |
| 2 | [Drawing and layout](./drawing-and-layout.md) | a titled box that stays centred when the window resizes |
| 3 | [The keyboard](./keyboard.md) | a hero `@` you move with the arrow keys |
| 4 | [The mouse](./mouse.md) | a paint program: click and drag to draw |
| 5 | [Put it together](./put-it-together.md) | a paint app with a colour toolbar and a status bar |

Do them in order. Each uses what the one before taught.

## The big idea

Think of the terminal as graph paper: a grid of cells, each holding one character and two colours.

- Columns are counted to the right with `x`, starting at 0.
- Rows are counted downward with `y`, starting at 0.
- The top-left cell is `(0, 0)`. One cell to the right is `(1, 0)`. One cell down is `(0, 1)`.

```
   x    0   1   2   3   4
 y    ┌───┬───┬───┬───┬───┐
  0   │ H │ i │   │   │   │
      ├───┼───┼───┼───┼───┤
  1   │   │   │   │   │   │
      └───┴───┴───┴───┴───┘
```

Here `H` is at `(0, 0)` and `i` is at `(1, 0)`.

You never print straight to the screen. You draw into an invisible copy called the back buffer, then call `lt_present()` to show it all at once. Nothing is ever half drawn, so nothing flickers.

Every program has the same three beats:

1. `lt_init()` wakes up the screen.
2. Draw, call `lt_present()`, and read events, in a loop.
3. `lt_shutdown()` puts the screen back exactly how it was.

Always do step 3, even when something goes wrong. Otherwise the user's terminal is left in raw mode.

## How to build and run the programs

Build libterm once, from the libterm folder:

```sh
cmake -B build
cmake --build build
```

For each tutorial you put a file in `examples/`, tell the build about it, and run it:

1. Create `examples/playground.c` and paste the tutorial's code into it.
2. Add one line to `examples/CMakeLists.txt`, next to the others:

   ```cmake
   libterm_add_example(playground)
   ```

3. Build again:

   ```sh
   cmake --build build
   ```

4. Run it:

   ```sh
   ./build/examples/playground          # macOS and Linux
   .\build\examples\playground.exe      # Windows
   ```

You can reuse the same `playground.c` for every tutorial. Replace what is inside and build again. You only add it to `CMakeLists.txt` once.

:::note My terminal looks frozen
libterm switches to a full-screen mode while the program runs. That is normal. Every program here quits on `q` or `Esc`, and your normal terminal comes back. If you ever get stuck, press `Ctrl+C`.
:::

Start with [Tutorial 1: Your first screen](./first-screen.md).
