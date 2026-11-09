---
title: Introduction
slug: /
description: What libterm is, how it draws, and how this documentation is organised.
---

# libterm

libterm is a small C11 terminal UI library with a [termbox2](https://github.com/termbox/termbox2)-compatible API. The same code drives POSIX terminals and the native Win32 console, with no POSIX shims and no `#ifdef` in your program.

## The model

You never print straight to the terminal. You draw into an off-screen cell buffer, then call `lt_present()`. libterm compares that buffer with the last frame it displayed and emits only the cells that changed, inside a synchronized-update bracket so the terminal swaps frames atomically. There is no flicker because there is nothing half-drawn to see.

Every program has the same three beats:

1. `lt_init()` puts the terminal in raw mode and switches to the alternate screen.
2. Draw with `lt_set_cell` or `lt_print`, show the frame with `lt_present`, and read events with `lt_poll_event`, in a loop.
3. `lt_shutdown()` restores the terminal exactly as it was.

Modern terminal features are negotiated for you. On a kitty-capable terminal you get modifiers on every key and press, repeat and release actions. In a truecolor terminal you get 24-bit colour. Where a feature is missing, libterm falls back to legacy behaviour without a code change.

## Conventions

- Every identifier starts with `lt_` (functions and types) or `LT_` (macros and constants).
- Functions return `LT_OK`, which is 0, on success and a negative `LT_ERR_*` code on failure. `lt_strerror` describes any code and `lt_last_errno` holds the `errno` behind a failed system call. See [Errors and return codes](./guides/errors.md).
- Coordinates are 0-based `(x, y)` from the top-left corner. `x` grows to the right and `y` grows downward.
- libterm manages one terminal per process. Its state is process-global and not thread-safe, so drive it from one thread.

## Where to go

| If you want to | Read |
|---|---|
| Build it and link it into a project | [Install](./getting-started/install.md) |
| Learn by writing small programs | [Tutorials](./tutorials/index.md) |
| Understand one area in depth | the guides, starting with [Screen and rendering](./guides/screen-and-rendering.md) |
| Move existing termbox2 code over | [Porting from termbox2](./guides/porting-from-termbox2.md) |
| Look up a function or constant | the [API reference](./api/index.md) |
| See what ships in `examples/` | [Examples](./examples.md) |

The reference covers every public symbol in `include/libterm/libterm.h`. Per-symbol parity with termbox2 is tracked in the repository's [ROADMAP.md](https://github.com/rizukirr/libterm/blob/main/ROADMAP.md).
