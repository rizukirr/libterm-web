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

All of these are stateless and work before `lt_init`.

## lt_utf8_char_length

Returns the number of bytes, 1 to 4, in the UTF-8 sequence that the lead byte `c` begins, or 0 if `c` is not a valid lead byte, that is a continuation byte or one of 0xF8 to 0xFF. It inspects only that one byte and does not validate the trailing bytes.

## lt_utf8_char_to_unicode

Decodes the UTF-8 sequence at `c` into `*out`. `c` must be NUL-terminated. Returns the number of bytes consumed, 1 to 4, on success. Returns 0 on a NULL or empty argument or a malformed sequence. Returns `-i` if the i-th continuation byte is NUL before the sequence completes, which means the input was truncated.

## lt_utf8_unicode_to_char

Encodes the codepoint `c` as UTF-8 into `out` and NUL-terminates it. `out` must hold at least 5 bytes: up to 4 encoded bytes plus the terminator. Returns the number of bytes written, excluding the NUL, or 0 for an unencodable codepoint, in which case `out[0]` is set to NUL.

## lt_wcwidth

Returns the number of terminal columns a codepoint occupies: 0 for combining marks and other zero-width characters, 2 for wide East Asian and emoji characters, 1 for the rest. Returns -1 for control characters and other non-printable codepoints, mirroring POSIX `wcwidth`. It follows Markus Kuhn's reference ranges and is not locale-dependent.

## lt_iswprint

Returns non-zero if the codepoint is printable, that is if `lt_wcwidth(ch) >= 0`.

## lt_attr_width

Returns the byte width of the `lt_attr` type used for foreground and background. It is always 4, because `lt_attr` is `uint32_t`. It mirrors termbox2's `tb_attr_width`. libterm has no compile-time attribute-width option, so the value is constant.

## See also

[Text and Unicode](../guides/text-and-unicode).
