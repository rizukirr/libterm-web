---
title: Events and keys
description: Event types, every LT_KEY_* code, key actions and modifier flags.
---

# Events and keys

## Event types

Values of `lt_event.type`.

| Constant | Value |
|---|---|
| `LT_EVENT_KEY` | 1 |
| `LT_EVENT_RESIZE` | 2 |
| `LT_EVENT_MOUSE` | 3 |

## Named keys

Values of `lt_event.key` for a key event. These are high codes counted down from `0xFFFF`, so they never collide with a character.

| Constant | Value | Key |
|---|---|---|
| `LT_KEY_F1` to `LT_KEY_F12` | `0xFFFF - 0` to `0xFFFF - 11` | function keys |
| `LT_KEY_INSERT` | `0xFFFF - 12` | Insert |
| `LT_KEY_DELETE` | `0xFFFF - 13` | Delete |
| `LT_KEY_HOME` | `0xFFFF - 14` | Home |
| `LT_KEY_END` | `0xFFFF - 15` | End |
| `LT_KEY_PGUP` | `0xFFFF - 16` | Page Up |
| `LT_KEY_PGDN` | `0xFFFF - 17` | Page Down |
| `LT_KEY_ARROW_UP` | `0xFFFF - 18` | Up |
| `LT_KEY_ARROW_DOWN` | `0xFFFF - 19` | Down |
| `LT_KEY_ARROW_LEFT` | `0xFFFF - 20` | Left |
| `LT_KEY_ARROW_RIGHT` | `0xFFFF - 21` | Right |
| `LT_KEY_BACK_TAB` | `0xFFFF - 22` | Shift+Tab, sent as CSI Z |

## Control keys with low codes

These share the value of the control byte the terminal sends, and arrive in `key` with `ch == 0`.

| Constant | Value | Key |
|---|---|---|
| `LT_KEY_ENTER` | `0x0D` | Enter |
| `LT_KEY_ESC` | `0x1B` | Escape |
| `LT_KEY_SPACE` | `0x20` | Space |
| `LT_KEY_BACKSPACE` | `0x08` | Backspace on terminals that send BS |
| `LT_KEY_BACKSPACE2` | `0x7F` | Backspace on terminals that send DEL |
| `LT_KEY_TAB` | `0x09` | Tab |

## Ctrl+key codes

Reported in `key` under `LT_INPUT_COMPAT`. The modern model reports Ctrl+letter as the lowercase letter in `ch` with `LT_MOD_CTRL` instead. Several of these intentionally share a value with a named key above, because the terminal sends the same byte.

| Constant | Value | Shares a value with |
|---|---|---|
| `LT_KEY_CTRL_TILDE`, `LT_KEY_CTRL_2` | `0x00` | each other |
| `LT_KEY_CTRL_A` to `LT_KEY_CTRL_G` | `0x01` to `0x07` | |
| `LT_KEY_CTRL_H` | `0x08` | `LT_KEY_BACKSPACE` |
| `LT_KEY_CTRL_I` | `0x09` | `LT_KEY_TAB` |
| `LT_KEY_CTRL_J`, `LT_KEY_CTRL_K`, `LT_KEY_CTRL_L` | `0x0A` to `0x0C` | |
| `LT_KEY_CTRL_M` | `0x0D` | `LT_KEY_ENTER` |
| `LT_KEY_CTRL_N` to `LT_KEY_CTRL_Z` | `0x0E` to `0x1A` | |
| `LT_KEY_CTRL_LSQ_BRACKET`, `LT_KEY_CTRL_3` | `0x1B` | `LT_KEY_ESC` |
| `LT_KEY_CTRL_4`, `LT_KEY_CTRL_BACKSLASH` | `0x1C` | each other |
| `LT_KEY_CTRL_5`, `LT_KEY_CTRL_RSQ_BRACKET` | `0x1D` | each other |
| `LT_KEY_CTRL_6` | `0x1E` | |
| `LT_KEY_CTRL_7`, `LT_KEY_CTRL_SLASH`, `LT_KEY_CTRL_UNDERSCORE` | `0x1F` | each other |
| `LT_KEY_CTRL_8` | `0x7F` | `LT_KEY_BACKSPACE2` |

The individual letter constants are `LT_KEY_CTRL_A`, `LT_KEY_CTRL_B`, `LT_KEY_CTRL_C`, `LT_KEY_CTRL_D`, `LT_KEY_CTRL_E`, `LT_KEY_CTRL_F`, `LT_KEY_CTRL_G`, `LT_KEY_CTRL_H`, `LT_KEY_CTRL_I`, `LT_KEY_CTRL_J`, `LT_KEY_CTRL_K`, `LT_KEY_CTRL_L`, `LT_KEY_CTRL_M`, `LT_KEY_CTRL_N`, `LT_KEY_CTRL_O`, `LT_KEY_CTRL_P`, `LT_KEY_CTRL_Q`, `LT_KEY_CTRL_R`, `LT_KEY_CTRL_S`, `LT_KEY_CTRL_T`, `LT_KEY_CTRL_U`, `LT_KEY_CTRL_V`, `LT_KEY_CTRL_W`, `LT_KEY_CTRL_X`, `LT_KEY_CTRL_Y` and `LT_KEY_CTRL_Z`, and the function keys are `LT_KEY_F1`, `LT_KEY_F2`, `LT_KEY_F3`, `LT_KEY_F4`, `LT_KEY_F5`, `LT_KEY_F6`, `LT_KEY_F7`, `LT_KEY_F8`, `LT_KEY_F9`, `LT_KEY_F10`, `LT_KEY_F11` and `LT_KEY_F12`.

## Bare-modifier keys

Modern model only. Emitted when a modifier is pressed on its own, on kitty-capable terminals and on Windows, with `ch == 0`. Legacy terminals send no bytes for these.

| Constant | Value |
|---|---|
| `LT_KEY_LEFT_SHIFT` | `0xFFFF - 29` |
| `LT_KEY_RIGHT_SHIFT` | `0xFFFF - 30` |
| `LT_KEY_LEFT_CTRL` | `0xFFFF - 31` |
| `LT_KEY_RIGHT_CTRL` | `0xFFFF - 32` |
| `LT_KEY_LEFT_ALT` | `0xFFFF - 33` |
| `LT_KEY_RIGHT_ALT` | `0xFFFF - 34` |
| `LT_KEY_LEFT_SUPER` | `0xFFFF - 35` |
| `LT_KEY_RIGHT_SUPER` | `0xFFFF - 36` |
| `LT_KEY_CAPS_LOCK` | `0xFFFF - 37` |

## Mouse buttons

Values of `lt_event.key` when `type == LT_EVENT_MOUSE`. They mirror termbox2's `TB_KEY_MOUSE_*`.

| Constant | Value |
|---|---|
| `LT_KEY_MOUSE_LEFT` | `0xFFFF - 23` |
| `LT_KEY_MOUSE_RIGHT` | `0xFFFF - 24` |
| `LT_KEY_MOUSE_MIDDLE` | `0xFFFF - 25` |
| `LT_KEY_MOUSE_RELEASE` | `0xFFFF - 26` |
| `LT_KEY_MOUSE_WHEEL_UP` | `0xFFFF - 27` |
| `LT_KEY_MOUSE_WHEEL_DOWN` | `0xFFFF - 28` |

## Key actions

Values of `lt_event.action`. Legacy decoding and compat mode always report `LT_KEY_PRESS`. Repeat and release come from terminals speaking the kitty keyboard protocol and from the Win32 console. Release events are suppressed unless `LT_INPUT_RELEASE` is set.

| Constant | Value |
|---|---|
| `LT_KEY_PRESS` | 1 |
| `LT_KEY_REPEAT` | 2 |
| `LT_KEY_RELEASE` | 3 |

## Modifiers

Flags in `lt_event.mod`.

| Constant | Value | Meaning |
|---|---|---|
| `LT_MOD_ALT` | `0x01` | Alt held |
| `LT_MOD_CTRL` | `0x02` | Ctrl held |
| `LT_MOD_SHIFT` | `0x04` | Shift held |
| `LT_MOD_MOTION` | `0x08` | the mouse moved with a button held, mouse events only |

See [Input and events](../../guides/input-and-events).
