"""Run a libterm example in a pty (kbd needs at least 85 by 27 cells), emulate it with pyte, dump the screen as
HTML spans (true colours, bold/underline/reverse) and as a JSON cell grid."""
import fcntl, html, json, os, pty, select, struct, sys, termios, time, signal
import pyte

NAMED = {  # an xterm-like palette, every colour readable as text on the graphite panel (4.5:1 or better)
    'black': '#8b93a7',
    'red': '#f07a72',
    'green': '#4fc47f',
    'brown': '#e6c04f',
    'yellow': '#e6c04f',
    'blue': '#7aa2ff',
    'magenta': '#d38bee',
    'cyan': '#5ccbd8',
    'white': '#e6e9f0',
    'brightblack': '#9aa2b5',
    'brightred': '#f58d86',
    'brightgreen': '#63d28f',
    'brightyellow': '#eccb63',
    'brightblue': '#8fb1ff',
    'brightmagenta': '#dc9ff2',
    'brightcyan': '#74d6e1',
    'brightwhite': '#f4f6fa',
}

def colour(c, default):
    if c == 'default':
        return default
    if c in NAMED:
        return NAMED[c]
    if len(c) == 6:
        return '#' + c
    return default

def run(cmd, cols, rows, keys, settle=0.6, after=0.4):
    pid, fd = pty.fork()
    if pid == 0:
        os.environ.update(TERM='xterm-256color', COLORTERM='truecolor', LANG='C.UTF-8')
        os.execvp(cmd[0], cmd)
    fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack('HHHH', rows, cols, 0, 0))
    os.kill(pid, signal.SIGWINCH)
    screen = pyte.Screen(cols, rows)
    stream = pyte.ByteStream(screen)
    def pump(duration):
        end = time.time() + duration
        while time.time() < end:
            r, _, _ = select.select([fd], [], [], 0.05)
            if r:
                try:
                    data = os.read(fd, 65536)
                except OSError:
                    return
                if not data:
                    return
                stream.feed(data)
    pump(settle)
    for k in keys:
        os.write(fd, k.encode() if isinstance(k, str) else k)
        pump(after)
    snap = [[(ch.data, ch.fg, ch.bg, ch.bold, ch.underscore, ch.reverse, ch.italics)
             for ch in (screen.buffer[y][x] for x in range(cols))] for y in range(rows)]
    for k in (b'q', b'\x1b', b'\x11', b'\x03'):
        try:
            os.write(fd, k)
        except OSError:
            break
        pump(0.15)
    try:
        os.kill(pid, signal.SIGKILL)
    except ProcessLookupError:
        pass
    os.waitpid(pid, 0)
    return snap

def to_html(snap, fg_default, bg_default):
    out = []
    for row in snap:
        line, run_, style = [], [], None
        def flush():
            if run_:
                txt = html.escape(''.join(run_))
                line.append(f'<span style="{style}">{txt}</span>' if style else txt)
        for data, fg, bg, bold, ul, rev, it in row:
            f, b = colour(fg, fg_default), colour(bg, bg_default)
            if rev:
                f, b = b, f
            s = []
            if f != fg_default: s.append(f'color:{f}')
            if b != bg_default: s.append(f'background:{b}')
            if bold: s.append('font-weight:500')
            if ul: s.append('text-decoration:underline')
            if it: s.append('font-style:italic')
            st = ';'.join(s)
            if st != style:
                flush(); run_, style = [], st
            run_.append(data if data else ' ')
        flush()
        out.append(''.join(line).rstrip() if not any(c[2] != 'default' for c in row) else ''.join(line))
    return '\n'.join(out)

if __name__ == '__main__':
    spec = json.loads(sys.argv[1])
    snap = run(spec['cmd'], spec['cols'], spec['rows'], spec.get('keys', []),
               spec.get('settle', 0.6), spec.get('after', 0.4))
    h = to_html(snap, spec.get('fg', '#e9ecf2'), spec.get('bg', '#1b1e26'))
    open(spec['out'], 'w').write(h)
    nonblank = sum(1 for r in snap for c in r if c[0].strip())
    print(f"{spec['out']}: {nonblank} glyphs")
