---
title: Modes
description: lt_set_input_mode, lt_set_output_mode and lt_detect_color_depth.
---

# Modes

```c
int lt_set_input_mode(int mode);
int lt_set_output_mode(int mode);
int lt_detect_color_depth(void);
```

## lt_set_input_mode

Selects how input is reported. `mode` is an OR of the `LT_INPUT_*` flags listed in [Modes](constants/modes#input-mode-flags). Returns the resulting mode. `LT_INPUT_CURRENT` queries without changing and returns the current mode.

The default, with no flag, is the modern model: the kitty keyboard protocol is negotiated on POSIX, modifiers arrive on every key the terminal reports them for, control bytes are normalised to a letter plus `LT_MOD_CTRL`, and `ev.action` reports press and repeat.

- `LT_INPUT_COMPAT` restores termbox2 semantics: control bytes in `key`, Shift+letter as an uppercase `ch`, no kitty negotiation. Inside compat, `LT_INPUT_ESC` (the default) reports a lone Escape and an Alt-combination as two events, and `LT_INPUT_ALT` folds an Alt-combination into one event with `LT_MOD_ALT`.
- `LT_INPUT_MOUSE` enables mouse reporting. On POSIX this emits the SGR 1006 enable handshake, and clearing the flag emits the disable.
- `LT_INPUT_RELEASE` delivers key-release events, which are suppressed by default.

## lt_set_output_mode

Selects how cell colours are encoded. `mode` is one of the `LT_OUTPUT_*` values listed in [Modes](constants/modes#output-modes). The mode reinterprets the colour bits of every cell, so changing it forces the next `lt_present` to re-emit colours from scratch. Returns the resulting mode. `LT_OUTPUT_CURRENT` queries without changing.

## lt_detect_color_depth

Inspects `$COLORTERM` and `$TERM` and returns the best output mode the terminal appears to support: `LT_OUTPUT_TRUECOLOR`, `LT_OUTPUT_256` or `LT_OUTPUT_NORMAL`. It is stateless and safe to call before `lt_init`, which makes it the natural argument to `lt_set_output_mode` at startup.

## See also

[Input and events](../guides/input-and-events#input-modes), [Colors and attributes](../guides/colors-and-attributes#output-modes).
