---
title: Modes
description: The LT_INPUT_* flags for lt_set_input_mode and the LT_OUTPUT_* values for lt_set_output_mode.
---

# Modes

## Input mode flags

Combine with OR and pass to `lt_set_input_mode`.

| Constant | Value | Effect |
|---|---|---|
| `LT_INPUT_CURRENT` | 0 | query the current mode without changing it |
| `LT_INPUT_ESC` | 1 | inside compat mode, report a lone Escape and an Alt-combination as two events. The compat default |
| `LT_INPUT_ALT` | 2 | inside compat mode, fold an Alt-combination into one event with `LT_MOD_ALT` |
| `LT_INPUT_MOUSE` | 4 | enable mouse reporting. SGR 1006 on POSIX, console mouse input on Windows |
| `LT_INPUT_COMPAT` | 8 | termbox2 semantics: control bytes in `key`, Shift+letter as an uppercase `ch` with no modifier, no kitty negotiation |
| `LT_INPUT_RELEASE` | 16 | deliver key-release events, `action == LT_KEY_RELEASE`. Off by default so code that switches on `key` or `ch` sees each keystroke once |

Without any flag libterm uses the modern model. `LT_INPUT_ESC` and `LT_INPUT_ALT` have no effect outside `LT_INPUT_COMPAT`, because in the modern model Alt is always a modifier bit.

## Output modes

Pass one to `lt_set_output_mode`. `lt_detect_color_depth` returns one of `LT_OUTPUT_TRUECOLOR`, `LT_OUTPUT_256` or `LT_OUTPUT_NORMAL`.

| Constant | Value | Colour bits are |
|---|---|---|
| `LT_OUTPUT_CURRENT` | 0 | query the current mode without changing it |
| `LT_OUTPUT_NORMAL` | 1 | a named colour, `LT_BLACK` to `LT_WHITE` |
| `LT_OUTPUT_256` | 2 | an 8-bit palette index, 0 to 255 |
| `LT_OUTPUT_216` | 3 | an index into the 6 by 6 by 6 colour cube |
| `LT_OUTPUT_GRAYSCALE` | 4 | an index into the 24-step grey ramp |
| `LT_OUTPUT_TRUECOLOR` | 5 | 24-bit RGB, packed with `LT_RGB` or `LT_HEX` |

See [Modes](../modes) for the functions and [Input and events](../../guides/input-and-events#input-modes) for the models in full.
