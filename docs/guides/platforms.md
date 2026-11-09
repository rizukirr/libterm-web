---
title: Platform notes
description: What differs between the POSIX and Windows backends, and which calls are platform-specific.
---

# Platform notes

One API, two backends. Shared code in `src/shared/` has no platform `#ifdef`. Everything platform-specific sits behind an internal interface in `src/platform/posix/` and `src/platform/windows/`. This page lists what you can observe from the outside.

## Side by side

| Area | POSIX | Windows |
|---|---|---|
| Terminal | opens `/dev/tty`, termios raw mode, alternate screen | the active console, raw console modes, alternate screen |
| Init from an fd or a path | `lt_init_fd`, `lt_init_file` | both return `LT_ERR_INIT_OPEN` |
| Key input | kitty keyboard protocol when the terminal negotiates it, legacy escape decoding otherwise | `ReadConsoleInputW` records, no escape sequences |
| Modifiers on letters | kitty-capable terminals only | every key, from the console's control-key state |
| Bare modifiers, Caps Lock, `action` | kitty-capable terminals | always |
| Ctrl+letter under the modern model | exact on kitty terminals, collapsed to control bytes elsewhere | exact in conhost, best effort under ConPTY and Windows Terminal |
| Mouse | SGR 1006 reports after `LT_INPUT_MOUSE` | console mouse input after `LT_INPUT_MOUSE` |
| Resize | `SIGWINCH` through a self-pipe | console buffer events |
| Colour query | OSC 10, 11 and 4 round-trip bounded by a timeout | the console colour table, immediate, 16 entries |
| Own event loop | `lt_get_fds` | `LT_ERR_UNSUPPORTED_TERM` |

## The Windows input model

libterm reads the console directly. There is no protocol to negotiate and no escape sequence to parse, and the result is the same `lt_event` surface as a kitty-capable POSIX terminal:

- `LT_MOD_CTRL`, `LT_MOD_ALT` and `LT_MOD_SHIFT` arrive on every key.
- Bare-modifier keys and `LT_KEY_CAPS_LOCK` are reported when a modifier or lock is pressed alone.
- `ev.action` reports press, repeat and release. Releases need `LT_INPUT_RELEASE`, as on POSIX.
- `LT_KEY_BACK_TAB` for Shift+Tab, mouse and resize events as on POSIX.

Ctrl+letter is reconstructed from the console virtual key, so Ctrl+I gives `ch == 'i'` with `LT_MOD_CTRL`, distinct from Tab, when the console reports the letter key. The classic console does. ConPTY and Windows Terminal collapse Ctrl+I to Tab and Ctrl+J to Enter at the virtual-key level, before libterm sees them, and there the letter cannot be recovered. That is the same limitation a legacy POSIX terminal has. `LT_INPUT_COMPAT` keeps termbox2's control-byte form everywhere.

## Terminals that speak the kitty protocol

kitty, foot, ghostty and recent xterm negotiate the protocol. On those, Shift+letter carries `LT_MOD_SHIFT`, a bare modifier arrives as its own key code, and `action` distinguishes press, repeat and release. Other terminals, and anything behind an ssh session that does not forward the negotiation, fall back to legacy decoding without a code change. The `kbd` example shows which model is in effect.

## Colour queries under multiplexers

tmux answers OSC 10 and 11 itself, so `lt_query_color` describes tmux's colours rather than the outer terminal's. A terminal that never answers yields `LT_ERR_NO_EVENT` after the timeout. Treat both as "unknown" and pick a default theme.

## Building for Windows

The Windows backend is validated with MinGW, cross-compiled from POSIX and tested natively in CI. See [Build options](../getting-started/build-options#windows). MSVC is not validated yet.
