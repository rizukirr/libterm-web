---
title: Porting from termbox2
description: The drop-in compat header, what it supports, and the one behaviour difference every port hits, Ctrl+letter keys.
---

# Porting from termbox2

libterm is termbox2 with every symbol renamed, `tb_` to `lt_` and `TB_` to `LT_`. Existing termbox2 code can move over in two ways:

1. The compat header. Change one `#include` and keep your `tb_` and `TB_` code. The fastest path, covered here.
2. A full rename to the `lt_` and `LT_` names. Best long term, and what the rest of this site documents.

This page covers the compat header and the one behaviour difference you will hit in practice: Ctrl+letter keys.

## The drop-in compat header

`compat/termbox2.h` in the libterm repository maps the supported termbox2 API onto libterm. It is a single self-contained header. Put it on your include path and your existing include resolves to it:

```c
#include "termbox2.h"   /* now libterm's compat/termbox2.h */
```

```sh
cc myapp.c -I path/to/libterm/compat -lterm -o myapp
```

It includes `libterm/libterm.h`, so it works against the normally installed library. `tb_init`, `tb_present`, `tb_poll_event`, `tb_set_cell`, `TB_KEY_ENTER`, `struct tb_event`, `uintattr_t` and the rest compile and link unchanged.

### Supported

- Every termbox2 function that has a libterm equivalent: lifecycle, rendering, the print and send helpers, input, output modes, the UTF-8 helpers, introspection.
- Every `TB_KEY_*` and every other `TB_*` constant: keys, modifiers, events, input and output modes, colours, attributes, return codes.
- `struct tb_cell`, `struct tb_event` and `uintattr_t`, aliased to libterm's types. `tb_cell` is libterm's fixed 16-byte cell. termbox2's per-cell `ech`, `nech` and `cech` grapheme pointers are not present. Use `tb_set_cell_ex` and `tb_extend_cell` for clusters.

### Adapted

`tb_get_cell` in libterm copies a cell into a struct rather than returning a live buffer pointer. The compat wrapper returns a pointer to an internal snapshot, valid until the next `tb_get_cell` call, and reads the back buffer only. Asking for the front buffer returns `LT_ERR`.

### Unsupported

These have no libterm equivalent. Using one is a compile error whose message names the replacement.

| termbox2 | Use instead |
|---|---|
| `tb_init_rwfd` | `lt_init_fd` or `lt_init_file`. libterm is single-fd by design |
| `tb_has_truecolor` | `lt_detect_color_depth` |
| `tb_cell_buffer` | `tb_get_cell`. There is no raw back-buffer pointer |
| `tb_set_func` | nothing. A custom parser hook, deprecated upstream |
| `tb_key_i` | nothing. There is no terminfo capability table |

## The one gotcha: Ctrl+letter

After switching to the compat header, `Ctrl-S`, `Ctrl-Q` and `Ctrl-A` may appear to do nothing.

libterm defaults to a modern keyboard model. In it, Ctrl+letter is reported as the letter in `ev.ch` plus `LT_MOD_CTRL`, with `ev.key == 0`:

```
press Ctrl-S   ->   ev.key = 0,  ev.ch = 's',  ev.mod = LT_MOD_CTRL
```

termbox2 code checks the control byte in `ev.key`:

```c
if (ev.key == TB_KEY_CTRL_S) save();   /* never true under the modern model */
```

`TB_KEY_CTRL_S` is `0x13` but `ev.key` is 0, so the branch never fires and the `'s'` falls through to the text-insert path. This is not terminal flow control. libterm's raw mode disables `IXON`, so `Ctrl-S` and `Ctrl-Q` do reach your program.

### Fix A: keep termbox2 semantics, one line

Ask for the control-byte model right after init:

```c
tb_init();
tb_set_input_mode(LT_INPUT_COMPAT);   /* Ctrl+letter -> ev.key = the control byte */
```

Now `ev.key == TB_KEY_CTRL_S` works as it did under termbox2 and nothing else changes. This is the fastest, most faithful port.

`LT_INPUT_COMPAT` restores termbox2's other legacy behaviours as well: a lone Escape and an Alt-combination as two events (tunable with `LT_INPUT_ESC` and `LT_INPUT_ALT`), Shift+letter as a bare uppercase `ch`, and no kitty negotiation.

### Fix B: adopt the modern model

Leave the default and change your Ctrl+letter checks to read `ch` and `mod`:

```c
struct tb_event ev;
tb_poll_event(&ev);

if (ev.type == TB_EVENT_KEY) {
  if ((ev.mod & TB_MOD_CTRL) && ev.ch == 's') { save(); }
  else if ((ev.mod & TB_MOD_CTRL) && ev.ch == 'q') { quit(); }
  /* arrows, Enter, Backspace, Esc are unchanged: still named keys in ev.key */
  else if (ev.key == TB_KEY_ARROW_UP) { /* ... */ }
  else if (ev.key == TB_KEY_ENTER)    { /* ... */ }
  else if (ev.ch != 0)                { insert((char)ev.ch); }
}
```

`TB_MOD_CTRL` has the same value as `LT_MOD_CTRL`, and Ctrl+letter always reports the lowercase letter. Only Ctrl+letter and Shift+letter handling changes. Named keys arrive in `ev.key` in both models, so those branches stay.

On a kitty-capable terminal or on Windows the modern model is strictly more capable: `Ctrl-I` stays distinct from Tab, `Ctrl-M` from Enter and `Ctrl-H` from Backspace, modifiers arrive on every key including Shift+letter, and bare modifiers, key release and key repeat become available through `ev.action`. On a legacy POSIX terminal those are not on the wire in either model.

### Which to pick

| | Fix A, `LT_INPUT_COMPAT` | Fix B, modern model |
|---|---|---|
| Change to your code | one line | rewrite the Ctrl+letter checks |
| Keeps `ev.key == TB_KEY_CTRL_*` | yes | no, use `ev.ch` and `ev.mod` |
| `Ctrl-I` distinct from Tab | no | yes, on capable terminals |
| Modifiers on all keys, release and repeat | no | yes, on capable terminals |
| Best for | a quick, faithful drop-in | code you will keep growing |

## A worked example

`examples/editor.c` is a small text editor written entirely against the compat header. It uses Fix A, a single `tb_set_input_mode(LT_INPUT_COMPAT)` after `tb_init`, so its `Ctrl-S` and `Ctrl-Q` bindings work. It is the most complete reference for a real drop-in.

## See also

[Input and events](input-and-events) for the two models in full, and the repository's [ROADMAP.md](https://github.com/rizukirr/libterm/blob/main/ROADMAP.md) for per-symbol parity.
