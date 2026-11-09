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

All four write a UTF-8 string into the back buffer from `(x, y)`. The rules they share:

- Column advance follows `lt_wcwidth`. A wide East Asian or emoji codepoint advances two columns and occupies its starting cell. A zero-width combining mark is skipped. A non-printable codepoint shows U+FFFD and advances one.
- A `\n` moves to column `x` of the next row.
- Malformed UTF-8 becomes U+FFFD.
- Cells outside the buffer are clipped silently. Only a starting `(x, y)` out of bounds is an error.

## lt_print

```c
int lt_print(int x, int y, lt_attr fg, lt_attr bg, const char *str);
```

Writes `str` starting at `(x, y)`, every cell in `fg` and `bg`.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `x`, `y` | `int` | the starting cell |
| `fg`, `bg` | `lt_attr` | colours for every cell written |
| `str` | `const char *` | a NUL-terminated UTF-8 string |

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the string is in the buffer |
| `LT_ERR_OUT_OF_BOUNDS` | the starting `(x, y)` is outside the buffer |
| `LT_ERR_NOT_INIT` | before `lt_init` |

#### Example

```c
lt_print(2, 1, LT_GREEN, LT_DEFAULT, "hello, libterm");
lt_print(2, 3, LT_WHITE, LT_DEFAULT, "two lines\nunder each other");
lt_print(2, 6, LT_DEFAULT, LT_DEFAULT, "wide: 你好");   /* each CJK glyph takes two columns */
```

#### See also

[lt_printf](#lt_printf), [lt_set_cell](cells#lt_set_cell), [Text and Unicode](../guides/text-and-unicode).

## lt_print_ex

```c
int lt_print_ex(int x, int y, lt_attr fg, lt_attr bg, size_t *out_w, const char *str);
```

As `lt_print`, and reports how wide the text was.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `x`, `y`, `fg`, `bg`, `str` | | as `lt_print` |
| `out_w` | `size_t *` | receives the number of columns advanced on the widest line written. May be NULL |

#### Returns

As `lt_print`.

#### Example

```c
size_t w;
lt_print_ex(0, 0, LT_DEFAULT, LT_DEFAULT, &w, title);
int x = (lt_width() - (int)w) / 2;                 /* centre it on the next frame */
```

#### See also

[lt_print](#lt_print), [lt_wcwidth](unicode#lt_wcwidth).

## lt_printf

```c
int lt_printf(int x, int y, lt_attr fg, lt_attr bg, const char *fmt, ...);
```

A `printf`-style wrapper over `lt_print`. The text is formatted into an internal fixed buffer, truncated if it would exceed it, and then printed.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `x`, `y`, `fg`, `bg` | | as `lt_print` |
| `fmt`, `...` | `const char *` | a `printf` format and its arguments |

#### Returns

As `lt_print`.

#### Example

```c
lt_printf(1, lt_height() - 1, LT_WHITE, LT_BLUE, "pointer: %d,%d   score: %d", px, py, score);
```

#### See also

[lt_print](#lt_print), [Tutorial 5](../tutorials/put-it-together).

## lt_printf_ex

```c
int lt_printf_ex(int x, int y, lt_attr fg, lt_attr bg, size_t *out_w, const char *fmt, ...);
```

As `lt_printf`, and reports how wide the text was through `out_w`, which may be NULL.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `x`, `y`, `fg`, `bg`, `fmt`, `...` | | as `lt_printf` |
| `out_w` | `size_t *` | receives the number of columns advanced on the widest line written |

#### Returns

As `lt_print`.

#### Example

```c
size_t w;
lt_printf_ex(0, 0, LT_DEFAULT, LT_DEFAULT, &w, "%d items", count);
lt_print((int)w + 1, 0, LT_DEFAULT, LT_DEFAULT, "selected");   /* continue after it */
```

#### See also

[lt_print_ex](#lt_print_ex).
