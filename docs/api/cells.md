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

## lt_set_cell

Sets the back-buffer cell at `(x, y)` to the codepoint `ch` with foreground `fg` and background `bg`, and marks its row dirty. The change appears on the next `lt_present`. For a multi-codepoint grapheme cluster use `lt_set_cell_ex`.

| Returns | When |
|---|---|
| `LT_ERR_OUT_OF_BOUNDS` | `(x, y)` is outside the buffer |
| `LT_ERR_NOT_INIT` | before `lt_init` |

## lt_get_cell

Copies the back-buffer cell at `(x, y)` into `*out`. This is the buffer your own calls write to, not the frame on screen.

| Returns | When |
|---|---|
| `LT_ERR_OUT_OF_BOUNDS` | `(x, y)` is outside the buffer |
| `LT_ERR_NOT_INIT` | before `lt_init` |
| `LT_ERR` | `out` is NULL |

## lt_set_cell_ex

Writes a grapheme cluster into the cell at `(x, y)`: a base codepoint plus trailing combining or joined codepoints, such as `e` with U+0301, or a ZWJ emoji sequence. `chs[0]` is the base and `chs[1..nch-1]` are the continuations. With `nch == 1` the call equals `lt_set_cell`. The cluster occupies one cell and advances the width of its base codepoint.

| Returns | When |
|---|---|
| `LT_ERR_OUT_OF_BOUNDS` | `(x, y)` is outside the buffer |
| `LT_ERR_NOT_INIT` | before `lt_init` |
| `LT_ERR` | `chs` is NULL or `nch` is 0 |
| `LT_ERR_MEM` | the cluster table is exhausted |

## lt_extend_cell

Appends one combining or joined codepoint to the cluster already in the cell at `(x, y)`, a shortcut for growing a cluster one codepoint at a time. The cell's base must already be set. Same return codes as `lt_set_cell_ex`.

## lt_has_egc

Returns non-zero if libterm was built with grapheme-cluster support. It always is, so the function returns 1. It mirrors termbox2's `tb_has_egc`.

## See also

[Text and Unicode](../guides/text-and-unicode), [`struct lt_cell`](constants/types#struct-lt_cell).
