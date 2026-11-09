---
title: API reference
slug: /api
description: Every public function, macro, constant and type in libterm/libterm.h, grouped by area.
---

# API reference

The single public header is `libterm/libterm.h`. This reference covers every symbol it declares. Functions return `int` unless noted: `LT_OK` on success and a negative `LT_ERR_*` code on failure.

Every function entry has the same parts: the signature, what it does, a parameters table, the return values, a short example, and links to the guide that covers it.

## Functions

| Area | Functions |
|---|---|
| [Lifecycle](./lifecycle.md) | `lt_init`, `lt_init_fd`, `lt_init_file`, `lt_shutdown` |
| [Screen](./screen.md) | `lt_width`, `lt_height`, `lt_clear`, `lt_set_clear_attrs`, `lt_present`, `lt_invalidate` |
| [Cells and clusters](./cells.md) | `lt_set_cell`, `lt_get_cell`, `lt_set_cell_ex`, `lt_extend_cell`, `lt_has_egc` |
| [Text](./text.md) | `lt_print`, `lt_print_ex`, `lt_printf`, `lt_printf_ex` |
| [Raw output](./raw-output.md) | `lt_send`, `lt_sendf` |
| [Input](./input.md) | `lt_poll_event`, `lt_peek_event`, `lt_get_fds` |
| [Modes](./modes.md) | `lt_set_input_mode`, `lt_set_output_mode`, `lt_detect_color_depth` |
| [Colour query](./color-query.md) | `lt_query_color`, `lt_is_dark_background` |
| [UTF-8 and width](./unicode.md) | `lt_utf8_char_length`, `lt_utf8_char_to_unicode`, `lt_utf8_unicode_to_char`, `lt_wcwidth`, `lt_iswprint`, `lt_attr_width` |
| [Cursor](./cursor.md) | `lt_set_cursor`, `lt_hide_cursor`, `lt_show_cursor` |
| [Miscellaneous](./misc.md) | `lt_strerror`, `lt_version`, `lt_last_errno` |

## Constants and types

| Page | Covers |
|---|---|
| [Types](./constants/types.md) | `lt_uchar`, `lt_attr`, `struct lt_cell`, `struct lt_event`, `LT_API` |
| [Return codes](./constants/return-codes.md) | `LT_OK` and every `LT_ERR_*` |
| [Events and keys](./constants/events-and-keys.md) | `LT_EVENT_*`, every `LT_KEY_*`, `LT_MOD_*` |
| [Colours and attributes](./constants/colors-and-attributes.md) | `LT_DEFAULT` to `LT_WHITE`, `LT_BOLD` and the other flags, `LT_HI_BLACK`, `LT_RGB`, `LT_HEX`, `LT_COLOR_DEFAULT_FG`, `LT_COLOR_DEFAULT_BG` |
| [Modes](./constants/modes.md) | `LT_INPUT_*` and `LT_OUTPUT_*` |
| [Version](./constants/version.md) | `LT_VERSION_MAJOR`, `LT_VERSION_MINOR`, `LT_VERSION_PATCH` |

## Conventions

- Coordinates are 0-based `(x, y)` from the top-left. `x` is the column and `y` the row.
- Nothing reaches the terminal until `lt_present`, except `lt_send`, `lt_sendf` and the cursor calls.
- Before `lt_init`, every function that needs a terminal returns `LT_ERR_NOT_INIT`. `lt_detect_color_depth`, the UTF-8 helpers, `lt_wcwidth`, `lt_iswprint`, `lt_attr_width`, `lt_strerror`, `lt_version` and `lt_last_errno` work at any time.
- The library is not thread-safe. One terminal per process, driven from one thread.
