---
title: Text and Unicode
description: Printing strings, how columns advance for wide and zero-width characters, grapheme clusters, and the UTF-8 helpers.
---

# Text and Unicode

A cell holds one codepoint, or one grapheme cluster. Strings go through `lt_print`, which decodes UTF-8 and advances columns the way a terminal does.

## Printing strings

```c
lt_print(2, 1, LT_WHITE, LT_DEFAULT, "héllo, 世界");
lt_printf(2, 2, LT_WHITE, LT_DEFAULT, "score: %d", score);
```

`lt_print(x, y, fg, bg, str)` writes a UTF-8 string into the back buffer from `(x, y)`, every cell in `fg` and `bg`. The rules:

- Column advance follows `lt_wcwidth`. A wide East Asian or emoji codepoint advances two columns and occupies its starting cell. A zero-width combining mark is skipped. A non-printable codepoint shows U+FFFD and advances one.
- A `\n` moves to column `x` of the next row, so a multi-line string stays aligned under its first character.
- Malformed UTF-8 becomes U+FFFD.
- Cells past the edge of the buffer are clipped silently. Only a starting `(x, y)` that is out of bounds returns `LT_ERR_OUT_OF_BOUNDS`.

`lt_printf` formats like `printf` into an internal fixed buffer, truncating if the result would exceed it, then prints the result.

`lt_print_ex` and `lt_printf_ex` take an extra `size_t *out_w` and report the number of columns advanced on the widest line written. That is how you measure a string to centre it or right-align it:

```c
size_t w;
lt_print_ex(0, 0, LT_DEFAULT, LT_DEFAULT, &w, title);
int x = (lt_width() - (int)w) / 2;
```

## Character width

`lt_wcwidth(ch)` returns the number of columns a codepoint occupies: 0 for combining marks and other zero-width characters, 2 for wide East Asian and emoji characters, 1 for the rest, and -1 for control characters and other non-printables. It follows Markus Kuhn's reference ranges and does not depend on the locale, so it gives the same answer on every platform.

`lt_iswprint(ch)` is non-zero when `lt_wcwidth(ch) >= 0`.

## Grapheme clusters

Some characters are several codepoints: `e` followed by a combining acute accent, a flag made of two regional indicators, or a family emoji joined with zero-width joiners. `lt_print` handles these for you. To place one directly in a cell, use `lt_set_cell_ex`:

```c
lt_uchar e_acute[] = {'e', 0x0301};
lt_set_cell_ex(0, 0, e_acute, 2, LT_DEFAULT, LT_DEFAULT);
```

`chs[0]` is the base codepoint and `chs[1..nch-1]` are the continuations. The cluster occupies one cell and advances the width of its base. With `nch == 1` the call is the same as `lt_set_cell`.

`lt_extend_cell(x, y, ch)` appends one codepoint to the cluster already in a cell, which is handy when you build a cluster one codepoint at a time. The cell's base must already be set.

The continuations live in an internal table indexed by the cell's `_reserved` field. Treat that field as opaque. If the table is exhausted, both calls return `LT_ERR_MEM`.

`lt_has_egc()` returns non-zero when the library was built with grapheme support. It always is, so the call exists for termbox2 parity.

## UTF-8 helpers

These are the decoder and encoder libterm uses, exported for your own text handling.

| Function | Does |
|---|---|
| `lt_utf8_char_length(c)` | the number of bytes, 1 to 4, in the sequence the lead byte `c` begins, or 0 if `c` is not a valid lead byte. It inspects only that byte. |
| `lt_utf8_char_to_unicode(&cp, s)` | decodes the sequence at `s`, which must be NUL-terminated. Returns bytes consumed, 0 on a malformed sequence, or `-i` if the i-th continuation byte is NUL, meaning the input was cut short. |
| `lt_utf8_unicode_to_char(out, cp)` | encodes `cp` into `out` and NUL-terminates it. `out` needs at least 5 bytes. Returns bytes written without the NUL, or 0 for an unencodable codepoint. |

`lt_attr_width()` returns the byte width of `lt_attr`, which is always 4. It mirrors termbox2's `tb_attr_width`.

## Reference

[Text](../api/text), [Cells and clusters](../api/cells), [UTF-8 and width](../api/unicode).
