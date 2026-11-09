import React, {useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import * as captures from '@site/src/data/captures';

const BUILD_CMD = 'cmake -B build && cmake --build build';

const HELLO = `#include "libterm/libterm.h"

int main(void) {
  if (lt_init() != LT_OK)
    return 1;

  lt_print(2, 1, LT_GREEN, LT_DEFAULT, "hello, libterm");
  lt_present();

  struct lt_event ev;
  lt_poll_event(&ev);   /* any key */

  return lt_shutdown();
}`;

function Term({name, note, html, cols = 80, caption, className = '', ...rest}) {
  return (
    <figure className={`term ${className}`.trim()} data-kind="product" style={{'--cols': cols}} {...rest}>
      <div className="term__panel" data-slot={name} data-alt={`A screenshot of ${name} running in your terminal`}>
        <div className="term__name" aria-hidden="true">
          <span>{name}</span>
          {note ? <span>{note}</span> : null}
        </div>
        <pre aria-label={`Screen of ${name}`} dangerouslySetInnerHTML={{__html: html}} />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function CopyCommand({cmd}) {
  const [state, setState] = useState('');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setState('Copied');
    } catch {
      setState('Select it');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState(''), 1800);
  };
  return (
    <div className="lp-cmd">
      <code>{cmd}</code>
      <span role="status" aria-live="polite">{state}</span>
      <button type="button" className="key key--small" onClick={copy}>Copy</button>
    </div>
  );
}

const PANELS = [
  {
    id: 'text',
    title: 'Text lands where you put it',
    body: 'lt_print decodes UTF-8 and advances columns the way the terminal does: a CJK glyph takes two cells, a combining mark none, a newline returns to the starting column.',
    capture: 'print',
    name: 'examples/print.c',
    note: 'UTF-8, wide cells',
  },
  {
    id: 'compat',
    title: 'termbox2 code builds unchanged',
    body: 'This editor is written against compat/termbox2.h with tb_ names only. One line after init keeps its Ctrl+letter bindings working.',
    capture: 'editor',
    name: 'examples/editor.c',
    note: 'compat/termbox2.h',
  },
  {
    id: 'colors',
    title: 'Eight names, or sixteen million',
    body: 'Named colours, palettes and 24-bit RGB share one lt_attr. lt_detect_color_depth picks the richest mode the terminal reports.',
    capture: 'truecolor',
    name: 'examples/truecolor.c',
    note: 'truecolor detected',
  },
];

function PinnedRun() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.index));
        });
      },
      {rootMargin: '-40% 0px -40% 0px'},
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className="lp-pinned">
      <div className="lp-pinned__panels">
        {PANELS.map((p, i) => (
          <div key={p.id} className="lp-pinned__panel" data-index={i} ref={(el) => (refs.current[i] = el)}>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
            <Term className="term--inline" name={p.name} note={p.note} html={captures[p.capture]} />
          </div>
        ))}
      </div>
      <div className="lp-pinned__stage">
        {PANELS.map((p, i) => (
          <Term key={p.id} name={p.name} note={p.note} html={captures[p.capture]} hidden={i !== active} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    document.documentElement.classList.add('js');
  }, []);
  return (
    <Layout title="libterm" description="Cross-platform, native, modern terminal UI library. termbox2-compatible API on POSIX and native Windows (Win32 Console API).">
      <main className="lp">
        <section className="lp-hero" aria-labelledby="hero-title">
          <div className="container lp-split">
            <div>
              <h1 id="hero-title">Cross-platform, native, modern terminal UI library</h1>
              <p className="lead">termbox2-compatible API on POSIX and native Windows (Win32 Console API).</p>
              <div className="lp-actions">
                <Link className="key key--primary" to="/docs/tutorials">Start the tutorial</Link>
                <Link className="key" to="/docs/guides/porting-from-termbox2">Port from termbox2</Link>
              </div>
              <CopyCommand cmd={BUILD_CMD} />
              <p className="lp-fact">C11, no dependencies, MIT.</p>
            </div>
            <div className="lp-hero__visual">
              <Term name="examples/kbd.c" note="86 by 28 pty" html={captures.kbd} cols={86} />
              <p className="lp-caption">After Ctrl+F1: the inspector reads F1 with LT_MOD_CTRL.</p>
            </div>
          </div>
        </section>

        <section className="lp-section" aria-labelledby="hello-title">
          <div className="container lp-split lp-split--lead">
            <div className="lp-head">
              <h2 id="hello-title">One header, four calls</h2>
              <p className="lead">Init, draw, present, shutdown.</p>
              <ul className="lp-facts">
                <li><b>lt_print, lt_set_cell</b>write to the back buffer</li>
                <li><b>lt_present</b>emits the changed cells once</li>
                <li><b>lt_poll_event</b>a key, a click or a resize</li>
              </ul>
            </div>
            <figure className="term term--code">
              <div className="term__panel">
                <div className="term__name" aria-hidden="true"><span>hello.c</span><span>13 lines</span></div>
                <pre><code>{HELLO}</code></pre>
              </div>
            </figure>
          </div>
        </section>

        <section className="lp-section" aria-labelledby="examples-title">
          <div className="container">
            <div className="lp-head">
              <h2 id="examples-title">Three examples, caught mid-run</h2>
              <p className="lead">Each picture is the program&rsquo;s own cells, captured on a pseudo terminal.</p>
            </div>
            <PinnedRun />
          </div>
        </section>

        <section className="lp-section" aria-labelledby="platforms-title">
          <div className="container lp-split lp-split--lead lp-split--top">
            <div className="lp-head">
              <h2 id="platforms-title">One event struct, two backends</h2>
              <p className="lead">What each platform does behind the same lt_event.</p>
            </div>
            <table className="lp-table">
              <thead>
                <tr><th scope="col">Area</th><th scope="col">POSIX</th><th scope="col">Windows</th></tr>
              </thead>
              <tbody>
                <tr><td>Terminal</td><td data-col="POSIX"><code>/dev/tty</code>, termios raw mode</td><td data-col="Windows">Win32 console API</td></tr>
                <tr className="is-lead"><td>Keys</td><td data-col="POSIX">kitty protocol when negotiated, else legacy decoding</td><td data-col="Windows"><code>ReadConsoleInputW</code> records</td></tr>
                <tr><td>Modifiers on letters</td><td data-col="POSIX">kitty terminals only</td><td data-col="Windows">every key</td></tr>
                <tr><td>Mouse</td><td data-col="POSIX">SGR 1006 reports</td><td data-col="Windows">console mouse events</td></tr>
                <tr><td>Colour query</td><td data-col="POSIX">OSC 10, 11 and 4 round-trip</td><td data-col="Windows">console colour table, 16 entries</td></tr>
                <tr><td>Own event loop</td><td data-col="POSIX"><code>lt_get_fds</code></td><td data-col="Windows">not available</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="lp-section" aria-labelledby="questions-title">
          <div className="container">
            <h2 id="questions-title">Before you link it</h2>
            <ul className="lp-rows">
              <li>
                <h3>Is it a drop-in for termbox2?</h3>
                <p>Include <code>compat/termbox2.h</code> and keep the tb_ names. The one difference, Ctrl+letter, is covered in the <Link to="/docs/guides/porting-from-termbox2">porting guide</Link>.</p>
              </li>
              <li>
                <h3>Which terminals get the modern input model?</h3>
                <p>kitty, foot, ghostty and recent xterm. Everything else falls back to legacy decoding with no code change.</p>
              </li>
              <li>
                <h3>Is it thread-safe?</h3>
                <p>No. One terminal per process, driven from one thread.</p>
              </li>
              <li>
                <h3>What does it depend on?</h3>
                <p>Only the C library. CMake 3.32 for the SIMD build, or one cc command for the scalar one.</p>
              </li>
            </ul>
          </div>
        </section>

        <section className="lp-band" aria-labelledby="close-title">
          <div className="container lp-split lp-split--even">
            <div>
              <h2 id="close-title">Clone, build, run hello</h2>
              <p className="lead">Then start the first tutorial.</p>
              <div className="lp-actions">
                <Link className="key" to="/docs/tutorials">Start the tutorial</Link>
              </div>
            </div>
            <figure className="term term--code">
              <div className="term__panel">
              <div className="term__name" aria-hidden="true"><span>shell</span><span>POSIX or MinGW</span></div>
              <pre><code>{`git clone https://github.com/rizukirr/libterm.git
cd libterm
cmake -B build
cmake --build build
./build/examples/hello`}</code></pre>
              </div>
            </figure>
          </div>
        </section>
      </main>
    </Layout>
  );
}
