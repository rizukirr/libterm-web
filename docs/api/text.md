---
title: Text
description: lt_print, lt_print_ex, lt_printf and lt_printf_ex.
---

# Text

```c
int lt_print(int x, int y, lt_attr fg, lt_attr bg, const char *str);
int lt_print_ex(int x, int y, lt_attr fg, lt_attr bg, size_t *out_w, const char *str);
int lt_printf(int x, int y, lt_attr fg, lt_attr bg, const char *fmt, ...);
int lt_printf_ex(int x, int y, lt_attr fg, lt_attr bg, size_t *out_w, const char *fmt, ...);
```

## lt_print

Writes a UTF-8 string into the back buffer starting at `(x, y)`, each cell in `fg` and `bg`.

- Column advance follows `lt_wcwidth`. A wide East Asian or emoji codepoint advances two columns and occupies its starting cell. A zero-width combining mark is skipped. A non-printable codepoint shows U+FFFD and advances one.
- A `\n` moves to column `x` of the next row.
- Malformed UTF-8 becomes U+FFFD.
- Cells outside the buffer are clipped silently. Only a starting `(x, y)` out of bounds returns `LT_ERR_OUT_OF_BOUNDS`.

Returns `LT_ERR_NOT_INIT` before `lt_init`.

## lt_print_ex

As `lt_print`. If `out_w` is not NULL it receives the number of columns advanced on the widest line written.

## lt_printf

A `printf`-style wrapper over `lt_print`. Formats into an internal fixed buffer, truncating if the result would exceed it, then prints the result.

## lt_printf_ex

As `lt_printf`. If `out_w` is not NULL it receives the number of columns advanced on the widest line written.

## See also

[Text and Unicode](../guides/text-and-unicode).
