---
title: Colours and attributes
description: Named colours, attribute flags, LT_HI_BLACK, LT_RGB, LT_HEX and the colour query selectors.
---

# Colours and attributes

All of these are `lt_attr` values or produce one. See [Colors and attributes](../../guides/colors-and-attributes) for the bit layout.

## Named colours

Meaningful in `LT_OUTPUT_NORMAL`. `LT_DEFAULT` means the terminal's own colour in every mode.

| Constant | Value |
|---|---|
| `LT_DEFAULT` | `0x0000` |
| `LT_BLACK` | `0x0001` |
| `LT_RED` | `0x0002` |
| `LT_GREEN` | `0x0003` |
| `LT_YELLOW` | `0x0004` |
| `LT_BLUE` | `0x0005` |
| `LT_MAGENTA` | `0x0006` |
| `LT_CYAN` | `0x0007` |
| `LT_WHITE` | `0x0008` |

## Attribute flags

OR these into the foreground. Attribute bits in the background are ignored.

| Constant | Value | Effect |
|---|---|---|
| `LT_BOLD` | `0x01000000` | bold |
| `LT_UNDERLINE` | `0x02000000` | underline |
| `LT_REVERSE` | `0x04000000` | swap foreground and background |
| `LT_ITALIC` | `0x08000000` | italic |
| `LT_BLINK` | `0x10000000` | blink |
| `LT_DIM` | `0x20000000` | faint |
| `LT_STRIKE` | `0x40000000` | strikethrough |

## LT_HI_BLACK

```c
#define LT_HI_BLACK 0x80000000u
```

Bit 31. Colour bits of 0 mean "terminal default". OR in `LT_HI_BLACK` to select real black instead: palette index 0 in palette modes, RGB 0,0,0 in truecolor. Mirrors termbox2's `TB_HI_BLACK`.

## LT_RGB

```c
#define LT_RGB(r, g, b)
```

Packs 24-bit RGB, each channel 0 to 255, into bits 0 to 23 for `LT_OUTPUT_TRUECOLOR`. Each argument is masked to 8 bits.

## LT_HEX

```c
#define LT_HEX(rgb)
```

Packs a `0xRRGGBB` value into bits 0 to 23 for `LT_OUTPUT_TRUECOLOR`. The high byte is masked off, so attribute flags and the sentinel can never be set by accident. `LT_HEX(0xRRGGBB)` packs the same bits as `LT_RGB(0xRR, 0xGG, 0xBB)`, and the `0x00RRGGBB` value written by `lt_query_color` feeds straight into it.

## Colour query selectors

Arguments to `lt_query_color`, alongside plain palette indexes 0 to 255.

| Constant | Value | Selects |
|---|---|---|
| `LT_COLOR_DEFAULT_FG` | -1 | the terminal's default foreground |
| `LT_COLOR_DEFAULT_BG` | -2 | the terminal's default background |
