---
title: UTF-8 and width
description: lt_utf8_char_length, lt_utf8_char_to_unicode, lt_utf8_unicode_to_char, lt_wcwidth, lt_iswprint and lt_attr_width.
---

# UTF-8 and width

```c
int lt_utf8_char_length(char c);
int lt_utf8_char_to_unicode(uint32_t *out, const char *c);
int lt_utf8_unicode_to_char(char *out, uint32_t c);
int lt_wcwidth(uint32_t ch);
int lt_iswprint(uint32_t ch);
int lt_attr_width(void);
```

These are the decoder, encoder and width tables libterm uses internally, exported for your own text handling. All of them are stateless and work before `lt_init`.

## lt_utf8_char_length

```c
int lt_utf8_char_length(char c);
```

Tells how long the UTF-8 sequence that begins with the lead byte `c` is. It inspects only that one byte and does not validate the bytes that follow.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `c` | `char` | the first byte of a sequence |

#### Returns

1 to 4 for a valid lead byte. 0 if `c` is a continuation byte or one of 0xF8 to 0xFF.

#### Example

```c
const char *p = text;
while (*p) {
  int n = lt_utf8_char_length(*p);
  if (n == 0) { p++; continue; }         /* skip a stray continuation byte */
  /* p[0..n-1] is one character */
  p += n;
}
```

#### See also

[lt_utf8_char_to_unicode](#lt_utf8_char_to_unicode).

## lt_utf8_char_to_unicode

```c
int lt_utf8_char_to_unicode(uint32_t *out, const char *c);
```

Decodes one UTF-8 sequence into a codepoint.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `out` | `uint32_t *` | receives the codepoint |
| `c` | `const char *` | the start of the sequence. Must be NUL-terminated |

#### Returns

| Value | When |
|---|---|
| 1 to 4 | success, the number of bytes consumed |
| 0 | `c` is NULL or empty, or the sequence is malformed |
| `-i` | the i-th continuation byte is NUL, so the input was cut short |

#### Example

```c
uint32_t cp;
int n = lt_utf8_char_to_unicode(&cp, "€uro");
/* n == 3, cp == 0x20AC */
```

#### See also

[lt_utf8_unicode_to_char](#lt_utf8_unicode_to_char), [lt_print](text#lt_print).

## lt_utf8_unicode_to_char

```c
int lt_utf8_unicode_to_char(char *out, uint32_t c);
```

Encodes a codepoint as UTF-8 and NUL-terminates the result.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `out` | `char *` | a buffer of at least 5 bytes, up to 4 encoded bytes plus the terminator |
| `c` | `uint32_t` | the codepoint |

#### Returns

The number of bytes written, excluding the NUL. 0 for an unencodable codepoint, in which case `out[0]` is set to NUL.

#### Example

```c
char buf[5];
int n = lt_utf8_unicode_to_char(buf, 0x2588);   /* the full block */
fwrite(buf, 1, (size_t)n, stdout);
```

#### See also

[lt_utf8_char_to_unicode](#lt_utf8_char_to_unicode).

## lt_wcwidth

```c
int lt_wcwidth(uint32_t ch);
```

The number of terminal columns a codepoint occupies. It follows Markus Kuhn's reference ranges and does not depend on the locale, so it gives the same answer on every platform.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `ch` | `uint32_t` | the codepoint |

#### Returns

| Value | When |
|---|---|
| 0 | a combining mark or another zero-width character |
| 1 | an ordinary character |
| 2 | a wide East Asian or emoji character |
| -1 | a control character or another non-printable codepoint |

#### Example

```c
int cols = 0;
for (const char *p = s; *p;) {
  uint32_t cp;
  int n = lt_utf8_char_to_unicode(&cp, p);
  if (n <= 0) break;
  int w = lt_wcwidth(cp);
  cols += w > 0 ? w : 0;
  p += n;
}
```

#### See also

[lt_iswprint](#lt_iswprint), [lt_print_ex](text#lt_print_ex), [Text and Unicode](../guides/text-and-unicode#character-width).

## lt_iswprint

```c
int lt_iswprint(uint32_t ch);
```

Reports whether a codepoint is printable, that is whether `lt_wcwidth(ch) >= 0`.

#### Parameters

| Name | Type | Meaning |
|---|---|---|
| `ch` | `uint32_t` | the codepoint |

#### Returns

Non-zero if printable, 0 otherwise.

#### Example

```c
lt_set_cell(x, y, lt_iswprint(cp) ? cp : '?', fg, bg);
```

#### See also

[lt_wcwidth](#lt_wcwidth).

## lt_attr_width

```c
int lt_attr_width(void);
```

The byte width of the `lt_attr` type used for foreground and background. It mirrors termbox2's `tb_attr_width`. libterm has no compile-time attribute-width option, so the value is constant.

#### Parameters

None.

#### Returns

4, always, because `lt_attr` is `uint32_t`.

#### Example

```c
assert(lt_attr_width() == sizeof(lt_attr));
```

#### See also

[lt_attr](constants/types#lt_attr), [Porting from termbox2](../guides/porting-from-termbox2).
