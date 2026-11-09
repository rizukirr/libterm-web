---
title: Colour query
description: lt_query_color and lt_is_dark_background read back the colours the terminal is using.
---

# Colour query

```c
int lt_query_color(int what, uint32_t *rgb, int timeout_ms);
int lt_is_dark_background(int timeout_ms);
```

`lt_detect_color_depth` says how many colours a terminal supports. These two say which colours it is actually using. Both need `lt_init` first. The `theme` example shows the full pattern.

## lt_query_color

```c
int lt_query_color(int what, uint32_t *rgb, int timeout_ms);
```

Queries the terminal's real colour for `what`. On POSIX this is a round-trip: libterm emits OSC 10, 11 or 4 and reads the reply off the tty, waiting at most `timeout_ms`. Key bytes that arrive during the wait are kept and delivered by the next event read. On Windows the answer comes at once from the console colour table, with no escape sequence and the timeout ignored.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `what` | `int` | `LT_COLOR_DEFAULT_FG`, `LT_COLOR_DEFAULT_BG`, or a palette index 0 to 255 |
| `rgb` | `uint32_t *` | receives a packed `0x00RRGGBB`, the same packing as a truecolor `lt_attr` |
| `timeout_ms` | `int` | how long to wait for the reply. Negative selects the 1000 ms default. Ignored on Windows |

#### Returns

| Value | When |
|---|---|
| `LT_OK` | `*rgb` holds the colour |
| `LT_ERR_NO_EVENT` | no usable reply arrived in time, as on older terminals and some multiplexers. tmux answers OSC 10 and 11 with its own colours |
| `LT_ERR_UNSUPPORTED_TERM` | Windows, palette index above 15 |
| `LT_ERR_OUT_OF_BOUNDS` | `what` outside -2 to 255 |
| `LT_ERR_NOT_INIT` | before `lt_init` |
| `LT_ERR` | `rgb` is NULL |

#### Example

```c
uint32_t bg;
if (lt_query_color(LT_COLOR_DEFAULT_BG, &bg, 500) == LT_OK) {
  lt_set_output_mode(LT_OUTPUT_TRUECOLOR);
  lt_set_cell(0, 0, 'x', LT_DEFAULT, LT_HEX(bg));   /* paint with the terminal's own background */
}
```

#### See also

[lt_is_dark_background](#lt_is_dark_background), [LT_HEX](constants/colors-and-attributes#lt_hex), [Colors and attributes](../guides/colors-and-attributes#querying-the-terminals-colours).

## lt_is_dark_background

```c
int lt_is_dark_background(int timeout_ms);
```

Queries the default background and reports whether it is dark, by thresholding its ITU-R BT.709 relative luminance at 50 percent.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `timeout_ms` | `int` | as `lt_query_color` |

#### Returns

| Value | When |
|---|---|
| 1 | the background is dark |
| 0 | the background is light |
| a negative `LT_ERR_*` | passed through from `lt_query_color`. Treat it as "unknown" |

#### Example

```c
int dark = lt_is_dark_background(500);
if (dark < 0)
  dark = 1;                                 /* no answer, assume dark */
lt_attr panel = dark ? LT_RGB(30, 30, 38) : LT_RGB(235, 235, 240);
```

#### See also

[lt_query_color](#lt_query_color), the `theme` example in [Examples](../examples).
