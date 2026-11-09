---
title: Types
description: lt_uchar, lt_attr, struct lt_cell, struct lt_event and the LT_API linkage macro.
---

# Types

## lt_uchar

```c
typedef uint32_t lt_uchar;
```

A Unicode codepoint. Used for the character in a cell and in `lt_event.ch`.

## lt_attr

```c
typedef uint32_t lt_attr;
```

A foreground or background value. Bits 0 to 23 hold the colour, bits 24 to 30 the attribute flags (read from the foreground only), and bit 31 the `LT_HI_BLACK` sentinel. See [Colours and attributes](colors-and-attributes).

## struct lt_cell

```c
struct lt_cell {
  lt_uchar ch;
  lt_attr  fg;
  lt_attr  bg;
  uint32_t _reserved;
};
```

One cell of the back buffer, as copied out by `lt_get_cell`. `ch` is the base codepoint, `fg` and `bg` its attributes.

`_reserved` pads the cell to 16 bytes, which keeps cells aligned for the SIMD scan, and holds the grapheme-cluster id: 0 means the cell is just `ch`, and a nonzero value indexes an internal table of the trailing combining or joined codepoints set by `lt_set_cell_ex` and `lt_extend_cell`. Treat it as opaque and never set it directly.

## struct lt_event

```c
struct lt_event {
  uint8_t  type;
  uint8_t  mod;
  uint16_t key;
  lt_uchar ch;
  int32_t  w;
  int32_t  h;
  int32_t  x;
  int32_t  y;
  uint8_t  action;
};
```

| Field | Meaning |
|---|---|
| `type` | `LT_EVENT_KEY`, `LT_EVENT_RESIZE` or `LT_EVENT_MOUSE` |
| `mod` | an OR of `LT_MOD_ALT`, `LT_MOD_CTRL`, `LT_MOD_SHIFT`, and for mouse events `LT_MOD_MOTION` |
| `key` | a named key code for a key event, or the button for a mouse event. 0 when the key is a character |
| `ch` | the Unicode codepoint of a text key. 0 for a named key |
| `w`, `h` | the new terminal size, for a resize event |
| `x`, `y` | 0-based cell coordinates, for a mouse event |
| `action` | `LT_KEY_PRESS`, `LT_KEY_REPEAT` or `LT_KEY_RELEASE`. `LT_KEY_PRESS` unless a kitty-capable terminal or the Win32 console reports otherwise. Releases are delivered only with `LT_INPUT_RELEASE` |

See [Input and events](../../guides/input-and-events) for which fields each event type fills.

## LT_API

The linkage macro on every public function. It expands to `__declspec(dllexport)` or `__declspec(dllimport)` on Windows shared builds depending on `LIBTERM_BUILDING`, to `__attribute__((visibility("default")))` on GCC and Clang shared builds, and to nothing otherwise. The CMake targets set `LIBTERM_SHARED` and `LIBTERM_BUILDING` for you. A manual static build needs no defines.
