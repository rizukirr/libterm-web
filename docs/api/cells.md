---
title: Cells and clusters
description: lt_set_cell, lt_get_cell, lt_set_cell_ex, lt_extend_cell and lt_has_egc.
---

# Cells and clusters

```c
int lt_set_cell(int x, int y, lt_uchar ch, lt_attr fg, lt_attr bg);
int lt_get_cell(int x, int y, struct lt_cell *out);
int lt_set_cell_ex(int x, int y, const lt_uchar *chs, size_t nch, lt_attr fg, lt_attr bg);
int lt_extend_cell(int x, int y, lt_uchar ch);
int lt_has_egc(void);
```

A cell holds one codepoint, or one grapheme cluster, with a foreground and a background. Coordinates are 0-based from the top-left.

## lt_set_cell

```c
int lt_set_cell(int x, int y, lt_uchar ch, lt_attr fg, lt_attr bg);
```

Sets the back-buffer cell at `(x, y)` and marks its row dirty. The change appears on the next `lt_present`. For a multi-codepoint grapheme cluster use `lt_set_cell_ex`.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `x` | `int` | column, 0 at the left |
| `y` | `int` | row, 0 at the top |
| `ch` | `lt_uchar` | the Unicode codepoint to show |
| `fg` | `lt_attr` | foreground colour, attribute flags allowed |
| `bg` | `lt_attr` | background colour |

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the cell is set |
| `LT_ERR_OUT_OF_BOUNDS` | `(x, y)` is outside the buffer |
| `LT_ERR_NOT_INIT` | before `lt_init` |

#### Example

```c
lt_set_cell(5, 3, '@', LT_YELLOW | LT_BOLD, LT_DEFAULT);   /* a bold yellow hero */
lt_set_cell(6, 3, ' ', LT_DEFAULT, LT_RED);               /* a red block */
lt_set_cell(7, 3, 0x2500, LT_CYAN, LT_DEFAULT);           /* a box-drawing line */
```

#### See also

[lt_print](text#lt_print), [lt_get_cell](#lt_get_cell), [Colors and attributes](../guides/colors-and-attributes).

## lt_get_cell

```c
int lt_get_cell(int x, int y, struct lt_cell *out);
```

Copies the back-buffer cell at `(x, y)` into `*out`. This is the buffer your own calls write to, not the frame currently on screen.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `x` | `int` | column |
| `y` | `int` | row |
| `out` | `struct lt_cell *` | receives the cell |

#### Returns

| Value | When |
|---|---|
| `LT_OK` | `*out` holds the cell |
| `LT_ERR_OUT_OF_BOUNDS` | `(x, y)` is outside the buffer |
| `LT_ERR_NOT_INIT` | before `lt_init` |
| `LT_ERR` | `out` is NULL |

#### Example

```c
struct lt_cell c;
if (lt_get_cell(x, y, &c) == LT_OK && c.ch == ' ' && c.bg == LT_DEFAULT)
  /* the cell is empty */;
```

#### See also

[struct lt_cell](constants/types#struct-lt_cell).

## lt_set_cell_ex

```c
int lt_set_cell_ex(int x, int y, const lt_uchar *chs, size_t nch, lt_attr fg, lt_attr bg);
```

Writes a grapheme cluster into one cell: a base codepoint followed by combining or joined codepoints, such as `e` with U+0301 or a ZWJ emoji sequence. The cluster advances the width of its base codepoint. With `nch == 1` the call equals `lt_set_cell`.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `x`, `y` | `int` | the cell |
| `chs` | `const lt_uchar *` | `chs[0]` is the base, `chs[1..nch-1]` the continuations |
| `nch` | `size_t` | number of codepoints in `chs`, at least 1 |
| `fg`, `bg` | `lt_attr` | colours for the cell |

#### Returns

| Value | When |
|---|---|
| `LT_OK` | the cluster is set |
| `LT_ERR_OUT_OF_BOUNDS` | `(x, y)` is outside the buffer |
| `LT_ERR_NOT_INIT` | before `lt_init` |
| `LT_ERR` | `chs` is NULL or `nch` is 0 |
| `LT_ERR_MEM` | the cluster table is exhausted |

#### Example

```c
const lt_uchar e_acute[] = {'e', 0x0301};          /* e + combining acute */
lt_set_cell_ex(0, 0, e_acute, 2, LT_DEFAULT, LT_DEFAULT);

const lt_uchar flag[] = {0x1F1EF, 0x1F1F5};         /* regional indicators J P */
lt_set_cell_ex(2, 0, flag, 2, LT_DEFAULT, LT_DEFAULT);
```

#### See also

[lt_extend_cell](#lt_extend_cell), [Text and Unicode](../guides/text-and-unicode#grapheme-clusters).

## lt_extend_cell

```c
int lt_extend_cell(int x, int y, lt_uchar ch);
```

Appends one combining or joined codepoint to the cluster already in the cell at `(x, y)`, which is a shortcut for growing a cluster one codepoint at a time. The cell's base must already be set.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `x`, `y` | `int` | the cell |
| `ch` | `lt_uchar` | the codepoint to append |

#### Returns

The same codes as `lt_set_cell_ex`.

#### Example

```c
lt_set_cell(0, 0, 'a', LT_DEFAULT, LT_DEFAULT);
lt_extend_cell(0, 0, 0x0308);   /* now a with diaeresis */
```

#### See also

[lt_set_cell_ex](#lt_set_cell_ex).

## lt_has_egc

```c
int lt_has_egc(void);
```

Reports whether libterm was built with grapheme-cluster support. It always is, so the function returns 1. It exists for termbox2 parity with `tb_has_egc`.

#### Parameters

None.

#### Returns

Non-zero, always 1.

#### Example

```c
if (lt_has_egc())
  /* lt_set_cell_ex and lt_extend_cell are available */;
```

#### See also

[Porting from termbox2](../guides/porting-from-termbox2).
