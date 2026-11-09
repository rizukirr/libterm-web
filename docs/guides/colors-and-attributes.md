---
title: Colors and attributes
description: The lt_attr bit layout, output modes, named colours, truecolor, the HI_BLACK sentinel, text attributes, and querying the terminal's real colours.
---

# Colors and attributes

Each cell has a foreground and a background, both of type `lt_attr`, a 32-bit unsigned integer. The bits carry a colour and, in the foreground, the text attributes.

```
 bit 31      bits 30 to 24       bits 23 to 0
 HI_BLACK    attribute flags     colour value
             (foreground only)   (named, palette index, or 24-bit RGB)
```

- Bits 0 to 23 hold the colour. How they are read depends on the output mode.
- Bits 24 to 30 hold the seven attribute flags. They are read from the foreground only. Attribute bits in the background are ignored.
- Bit 31 is the `LT_HI_BLACK` sentinel, explained below.

## Output modes

The output mode decides how the colour bits are interpreted. Set it with `lt_set_output_mode`:

| Mode | Colour bits mean |
|---|---|
| `LT_OUTPUT_NORMAL` | a named colour, `LT_BLACK` to `LT_WHITE` (1 to 8) |
| `LT_OUTPUT_256` | an 8-bit palette index, 0 to 255 |
| `LT_OUTPUT_216` | an index into the 6 by 6 by 6 colour cube |
| `LT_OUTPUT_GRAYSCALE` | an index into the 24-step grey ramp |
| `LT_OUTPUT_TRUECOLOR` | 24-bit RGB, packed with `LT_RGB` or `LT_HEX` |

Changing the mode reinterprets every cell's colour bits and forces the next present to re-emit all colours. `LT_OUTPUT_CURRENT` queries the mode without changing it. The call returns the resulting mode.

`lt_detect_color_depth()` inspects `$COLORTERM` and `$TERM` and returns the best mode the terminal appears to support: `LT_OUTPUT_TRUECOLOR`, `LT_OUTPUT_256` or `LT_OUTPUT_NORMAL`. It is stateless, so you can call it before `lt_init`. The usual opening is:

```c
lt_set_output_mode(lt_detect_color_depth());
```

## Named colours

`LT_DEFAULT`, `LT_BLACK`, `LT_RED`, `LT_GREEN`, `LT_YELLOW`, `LT_BLUE`, `LT_MAGENTA`, `LT_CYAN`, `LT_WHITE`.

`LT_DEFAULT` is 0. In every mode, colour bits of 0 mean the terminal's own default foreground or background.

## Truecolor

In `LT_OUTPUT_TRUECOLOR`, pack RGB into the colour bits:

```c
lt_attr orange = LT_RGB(255, 128, 0);
lt_set_cell(0, 0, 'X', orange, LT_RGB(20, 20, 20));
```

`LT_HEX` packs a colour you already hold as `0xRRGGBB`. `LT_HEX(0xFF8000)` packs the same bits as `LT_RGB(255, 128, 0)`. It masks off the high byte, so a value with stray high bits cannot set an attribute flag or the sentinel by accident.

## The HI_BLACK sentinel

Colour bits of 0 mean "terminal default", so real black needs a marker. OR in `LT_HI_BLACK`:

```c
lt_attr term_default = 0;
lt_attr real_black   = LT_HI_BLACK;
lt_attr black_rgb    = LT_RGB(0, 0, 0) | LT_HI_BLACK;
```

The sentinel selects palette index 0 in palette modes and RGB 0,0,0 in truecolor. It mirrors termbox2's `TB_HI_BLACK`.

## Attributes

OR these into the foreground:

| Flag | Effect |
|---|---|
| `LT_BOLD` | bold |
| `LT_DIM` | faint |
| `LT_ITALIC` | italic |
| `LT_UNDERLINE` | underline |
| `LT_BLINK` | blink |
| `LT_REVERSE` | swap foreground and background |
| `LT_STRIKE` | strikethrough |

```c
lt_set_cell(0, 0, 'A', LT_RED | LT_BOLD | LT_UNDERLINE, LT_DEFAULT);
lt_print(2, 1, LT_CYAN | LT_ITALIC, LT_DEFAULT, "italic cyan");
```

Terminal support for individual attributes varies, blink and strike most of all. libterm emits the SGR codes regardless.

## Querying the terminal's colours

`lt_detect_color_depth` tells you how many colours the terminal supports. These two tell you which colours it is actually using:

```c
uint32_t rgb;
int rc   = lt_query_color(LT_COLOR_DEFAULT_BG, &rgb, 500);  /* 0x00RRGGBB */
int dark = lt_is_dark_background(500);                      /* 1, 0, or an error */
```

`lt_query_color(what, &rgb, timeout_ms)` asks for the default foreground (`LT_COLOR_DEFAULT_FG`), the default background (`LT_COLOR_DEFAULT_BG`) or a palette index 0 to 255. On success `rgb` holds a packed `0x00RRGGBB`, the same packing as a truecolor `lt_attr`, so `LT_HEX(rgb)` feeds it straight back into a cell. A negative `timeout_ms` selects the 1000 ms default.

`lt_is_dark_background(timeout_ms)` queries the default background and thresholds its ITU-R BT.709 relative luminance at 50 percent. It returns 1 for dark, 0 for light, or a negative `LT_ERR_*` passed through from the query.

How it works differs by platform. On POSIX it is a real round-trip: libterm emits OSC 10, 11 or 4, reads the reply off the tty, and accepts both the `rgb:` and URxvt `rgba:` forms. Key bytes typed during the wait are kept and delivered by the next `lt_poll_event` or `lt_peek_event`. On Windows the answer comes at once from the console colour table, with no escape sequence and the timeout ignored. That table has 16 entries, so palette indexes above 15 return `LT_ERR_UNSUPPORTED_TERM`.

Treat an error as "unknown" and fall back to a default theme:

```c
int dark = lt_is_dark_background(500);
if (dark < 0)
  dark = 1;   /* the terminal did not answer, assume dark */
```

Two caveats. Under tmux the reply describes tmux's own colours, because tmux answers OSC 10 and 11 itself. A terminal that never answers yields `LT_ERR_NO_EVENT` after the timeout. Both functions require `lt_init` first. The `theme` example shows the full pattern.

## Reference

[Modes](../api/modes), [Colour query](../api/color-query), [Colour and attribute constants](../api/constants/colors-and-attributes).
