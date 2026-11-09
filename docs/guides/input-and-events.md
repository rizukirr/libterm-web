---
title: Input and events
description: The event struct, keys, modifiers, the modern and compat input models, mouse, resize, and running your own event loop.
---

# Input and events

Read events with `lt_poll_event`, which blocks, or `lt_peek_event(ev, timeout_ms)`, which waits at most `timeout_ms`. Both fill a `struct lt_event` and return `LT_OK`. When nothing is available they return `LT_ERR_NO_EVENT`. On a genuine I/O failure they return the real error, `LT_ERR_READ` or `LT_ERR_POLL`. A failure is never reported as "no event".

## The event struct

```c
struct lt_event {
  uint8_t  type;    /* LT_EVENT_KEY, LT_EVENT_RESIZE or LT_EVENT_MOUSE */
  uint8_t  mod;     /* an OR of LT_MOD_* flags */
  uint16_t key;     /* a named key, or a mouse button; 0 for a character */
  lt_uchar ch;      /* the Unicode codepoint of a text key; 0 for a named key */
  int32_t  w, h;    /* the new size, for LT_EVENT_RESIZE */
  int32_t  x, y;    /* cell coordinates, for LT_EVENT_MOUSE */
  uint8_t  action;  /* LT_KEY_PRESS, LT_KEY_REPEAT or LT_KEY_RELEASE */
};
```

Which fields mean something depends on `type`:

| `type` | Meaningful fields |
|---|---|
| `LT_EVENT_KEY` | `key` or `ch` (one is set, the other 0), `mod`, `action` |
| `LT_EVENT_MOUSE` | `key` (the button), `x`, `y`, `mod` |
| `LT_EVENT_RESIZE` | `w`, `h` |

For a key event, a printable character arrives in `ch` with `key == 0`. A named key arrives in `key` with `ch == 0`.

`action` is set on every key event. It is `LT_KEY_PRESS` unless a kitty-capable terminal or the Win32 console reports a repeat or a release. Release events are dropped before you see them unless you OR `LT_INPUT_RELEASE` into the input mode, so code that ignores `action` sees each keystroke once.

## Keys

Named keys arrive in `key`: `LT_KEY_F1` to `LT_KEY_F12`, `LT_KEY_INSERT`, `LT_KEY_DELETE`, `LT_KEY_HOME`, `LT_KEY_END`, `LT_KEY_PGUP`, `LT_KEY_PGDN`, the four `LT_KEY_ARROW_*` keys, `LT_KEY_BACK_TAB` for Shift+Tab, plus `LT_KEY_ENTER`, `LT_KEY_TAB`, `LT_KEY_BACKSPACE`, `LT_KEY_BACKSPACE2`, `LT_KEY_ESC` and `LT_KEY_SPACE`. They resolve the same way whatever encoding the terminal used.

Bare-modifier keys exist only in the modern model, on kitty-capable terminals and on Windows: `LT_KEY_LEFT_SHIFT`, `LT_KEY_RIGHT_SHIFT`, `LT_KEY_LEFT_CTRL`, `LT_KEY_RIGHT_CTRL`, `LT_KEY_LEFT_ALT`, `LT_KEY_RIGHT_ALT`, `LT_KEY_LEFT_SUPER`, `LT_KEY_RIGHT_SUPER`, and `LT_KEY_CAPS_LOCK`. Each arrives with `ch == 0`. Legacy terminals send no bytes for these, so no event can exist.

Ctrl+letter depends on the model. The modern default reports the letter in `ch` with `LT_MOD_CTRL` set, so Ctrl+A gives `ch == 'a'` and `mod == LT_MOD_CTRL`. Compat mode reports termbox2's control byte in `key`: `LT_KEY_CTRL_A` to `LT_KEY_CTRL_Z` plus the symbol variants. Some of those share a value with a named key: `LT_KEY_CTRL_I` is `LT_KEY_TAB`, `LT_KEY_CTRL_M` is `LT_KEY_ENTER`, `LT_KEY_CTRL_LSQ_BRACKET` is `LT_KEY_ESC`, `LT_KEY_CTRL_H` is `LT_KEY_BACKSPACE` and `LT_KEY_CTRL_8` is `LT_KEY_BACKSPACE2`. The full list is in [Events and keys](../api/constants/events-and-keys).

## Modifiers

`mod` is an OR of `LT_MOD_ALT`, `LT_MOD_CTRL`, `LT_MOD_SHIFT`, and for mouse events only, `LT_MOD_MOTION` for a drag.

How many keys carry modifiers depends on the terminal. On a kitty-capable terminal or on Windows, Shift, Alt and Ctrl arrive on every key, including Shift+letter, and `ch` holds the layout-translated character the keystroke typed, so Shift+j gives `ch == 'J'` with `LT_MOD_SHIFT`. On a legacy POSIX terminal only CSI-encoded keys (arrows, function keys, navigation keys) carry modifier suffixes. Letters cannot, because the terminal folds Shift into an uppercase character and Ctrl into a control byte before libterm sees anything.

## Input modes

`lt_set_input_mode(mode)` takes an OR of `LT_INPUT_*` flags and returns the resulting mode. `LT_INPUT_CURRENT` queries without changing.

libterm defaults to the modern model. On POSIX, `lt_init` negotiates the [kitty keyboard protocol](https://sw.kovidgoyal.net/kitty/keyboard-protocol/) without blocking. On a capable terminal you then get modifiers on every key, the typed character in `ch`, bare-modifier keys, and `action`. On any other terminal it falls back to legacy decoding, which covers xterm normal and application modes, SS3, rxvt, the Linux console and the vt220 tilde forms with CSI modifier suffixes. On Windows there is nothing to negotiate, because the console supplies the rich form directly. Control bytes are normalised into the rich form on both platforms.

| Flag | Effect |
|---|---|
| no flag, the default | the modern model: kitty negotiated, modifiers on all keys, control bytes normalised, `action` reported |
| `LT_INPUT_COMPAT` | termbox2 semantics: control bytes in `key`, Shift+letter as an uppercase `ch` with no modifier, kitty not negotiated. For drop-in code, see [Porting from termbox2](porting-from-termbox2) |
| `LT_INPUT_MOUSE` | mouse reporting, SGR 1006 on POSIX and console mouse input on Windows. Combine with either model |
| `LT_INPUT_RELEASE` | deliver key-release events. Off by default so that code switching on `key` or `ch` does not handle each keystroke twice |
| `LT_INPUT_ESC`, `LT_INPUT_ALT` | meaningful only inside `LT_INPUT_COMPAT`. `ESC`, the compat default, reports a lone Escape and an Alt-combination as two events. `ALT` folds an Alt-combination into one event with `LT_MOD_ALT`. In the modern model Alt is always a modifier bit |

The ceiling is the wire. On a legacy POSIX terminal, Shift+letter, bare modifiers and key releases are never sent, and libterm cannot recover what the terminal left out.

## Mouse

After `lt_set_input_mode(LT_INPUT_MOUSE)`, clicks, drags and wheel motion arrive as `LT_EVENT_MOUSE`. The button is in `key`: `LT_KEY_MOUSE_LEFT`, `LT_KEY_MOUSE_RIGHT`, `LT_KEY_MOUSE_MIDDLE`, `LT_KEY_MOUSE_RELEASE`, `LT_KEY_MOUSE_WHEEL_UP` or `LT_KEY_MOUSE_WHEEL_DOWN`. `x` and `y` are 0-based cell coordinates. `mod` carries Shift, Alt and Ctrl, plus `LT_MOD_MOTION` during a drag.

```c
lt_set_input_mode(LT_INPUT_MOUSE);

struct lt_event ev;
while (lt_poll_event(&ev) == LT_OK) {
  if (ev.type == LT_EVENT_MOUSE && ev.key == LT_KEY_MOUSE_LEFT)
    lt_printf(0, 0, LT_DEFAULT, LT_DEFAULT, "click at %d,%d   ", ev.x, ev.y);
  else if (ev.type == LT_EVENT_KEY && ev.ch == 'q')
    break;
  lt_present();
}
```

## Resize

A terminal resize arrives as `LT_EVENT_RESIZE` with the new `w` and `h`. libterm has already resized its buffers, so redraw from `lt_width()` and `lt_height()` and present. See [Screen and rendering](screen-and-rendering#resize).

## Your own event loop on POSIX

Instead of blocking in `lt_poll_event`, fetch the file descriptors and wait on them yourself:

```c
int tty, resize;
lt_get_fds(&tty, &resize);
/* add tty and resize to your fd_set, poll set or epoll instance */

/* when either becomes readable: */
struct lt_event ev;
while (lt_peek_event(&ev, 0) == LT_OK) {
  /* handle ev */
}
```

`tty` is the terminal and `resize` is the read end of the SIGWINCH self-pipe. Either pointer may be NULL. On Windows the console handles are not pollable file descriptors, so `lt_get_fds` returns `LT_ERR_UNSUPPORTED_TERM` and you block in `lt_peek_event` instead.

## Reference

[Input](../api/input), [Modes](../api/modes), [Events and keys](../api/constants/events-and-keys), [Platform notes](platforms).
