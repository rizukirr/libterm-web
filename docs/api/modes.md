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

The flag values are listed in [Modes](constants/modes).

## lt_set_input_mode

```c
int lt_set_input_mode(int mode);
```

Selects how input is reported. Without any flag libterm uses the modern model: the kitty keyboard protocol is negotiated on POSIX, modifiers arrive on every key the terminal reports them for, control bytes are normalised to a letter plus `LT_MOD_CTRL`, and `ev.action` reports press and repeat.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `mode` | `int` | an OR of `LT_INPUT_*` flags, or `LT_INPUT_CURRENT` to query. `LT_INPUT_COMPAT` restores termbox2 semantics, `LT_INPUT_MOUSE` enables mouse reporting, `LT_INPUT_RELEASE` delivers key releases, `LT_INPUT_ESC` and `LT_INPUT_ALT` tune Alt handling inside compat mode |

#### Returns

The resulting mode. For `LT_INPUT_CURRENT`, the current mode unchanged.

#### Example

```c
lt_set_input_mode(LT_INPUT_MOUSE);                      /* modern model plus the mouse */
lt_set_input_mode(LT_INPUT_COMPAT | LT_INPUT_MOUSE);    /* termbox2 control bytes plus the mouse */
int mode = lt_set_input_mode(LT_INPUT_CURRENT);
if (mode & LT_INPUT_MOUSE)
  /* mouse reporting is on */;
```

#### See also

[Input and events](../guides/input-and-events#input-modes), [Porting from termbox2](../guides/porting-from-termbox2).

## lt_set_output_mode

```c
int lt_set_output_mode(int mode);
```

Selects how cell colours are encoded. The mode reinterprets the colour bits of every cell, so changing it forces the next `lt_present` to re-emit colours from scratch.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `mode` | `int` | one of `LT_OUTPUT_NORMAL`, `LT_OUTPUT_256`, `LT_OUTPUT_216`, `LT_OUTPUT_GRAYSCALE`, `LT_OUTPUT_TRUECOLOR`, or `LT_OUTPUT_CURRENT` to query |

#### Returns

The resulting mode. For `LT_OUTPUT_CURRENT`, the current mode unchanged.

#### Example

```c
lt_set_output_mode(LT_OUTPUT_TRUECOLOR);
lt_set_cell(0, 0, ' ', LT_DEFAULT, LT_RGB(255, 128, 0));
```

#### See also

[lt_detect_color_depth](#lt_detect_color_depth), [Colors and attributes](../guides/colors-and-attributes#output-modes).

## lt_detect_color_depth

```c
int lt_detect_color_depth(void);
```

Inspects `$COLORTERM` and `$TERM` and returns the best output mode the terminal appears to support. It is stateless and safe to call before `lt_init`.

#### Parameters

None.

#### Returns

`LT_OUTPUT_TRUECOLOR`, `LT_OUTPUT_256` or `LT_OUTPUT_NORMAL`.

#### Example

```c
lt_init();
lt_set_output_mode(lt_detect_color_depth());   /* the richest colours this terminal has */
```

#### See also

[lt_set_output_mode](#lt_set_output_mode), [Tutorial 5](../tutorials/put-it-together#millions-of-colours).
