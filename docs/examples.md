---
title: Examples
description: The programs in examples/, what each demonstrates, and how to run them.
---

# Examples

The `examples/` directory builds into `build/examples/`. Each program is small and self-contained, and each is the best reference for one part of the API.

| Example | Demonstrates |
|---|---|
| [`hello`](https://github.com/rizukirr/libterm/blob/main/examples/hello.c) | the minimal init, draw, event loop, shutdown cycle |
| [`print`](https://github.com/rizukirr/libterm/blob/main/examples/print.c) | `lt_print` and `lt_printf`, UTF-8, wide CJK characters, multi-line text |
| [`colors`](https://github.com/rizukirr/libterm/blob/main/examples/colors.c) | the eight named colours as foreground and background, and the attribute flags |
| [`truecolor`](https://github.com/rizukirr/libterm/blob/main/examples/truecolor.c) | 24-bit gradients, `LT_RGB`, the `LT_HI_BLACK` sentinel, colour-depth detection |
| [`theme`](https://github.com/rizukirr/libterm/blob/main/examples/theme.c) | `lt_query_color` and `lt_is_dark_background` choosing a light or dark panel, with the assume-dark fallback |
| [`resize`](https://github.com/rizukirr/libterm/blob/main/examples/resize.c) | a layout derived from `lt_width` and `lt_height`, redrawn on every `LT_EVENT_RESIZE` |
| [`keyboard`](https://github.com/rizukirr/libterm/blob/main/examples/keyboard.c) | termbox2's on-screen keyboard demo, ported by renaming `tb_` to `lt_` plus `LT_INPUT_COMPAT` |
| [`kbd`](https://github.com/rizukirr/libterm/blob/main/examples/kbd.c) | an on-screen keyboard and a live event inspector: keys, modifiers, `ev.action`, bare modifiers, and an indicator for the input model in use |
| [`mouse`](https://github.com/rizukirr/libterm/blob/main/examples/mouse.c) | SGR mouse events: buttons, position, drag |
| [`editor`](https://github.com/rizukirr/libterm/blob/main/examples/editor.c) | a small text editor written against `compat/termbox2.h`: open a file, edit, save as, `Ctrl-S` and `Ctrl-Q` |

## Running them

```sh
cmake -B build && cmake --build build
./build/examples/hello
./build/examples/kbd
./build/examples/editor examples/hello.c
```

Most quit on `q` or `Esc`. `kbd` quits on `Ctrl+C`, `keyboard` on `Ctrl+X` then `Ctrl+Q`, and `editor` on `Ctrl+Q`. The `mouse` demo prints event details to stderr while it runs, so redirect them to a file if you want to read them:

```sh
./build/examples/mouse 2> events.log
```

## Adding your own

Create `examples/playground.c`, add `libterm_add_example(playground)` to `examples/CMakeLists.txt`, and run `cmake --build build`. The [tutorials](tutorials/) use this recipe for every program.
