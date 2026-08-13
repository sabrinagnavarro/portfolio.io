# Sabrina Navarro — Portfolio (GitHub Pages)

Plain HTML/CSS/JS — no build step, no framework. This is your Google Sites portfolio
rebuilt for GitHub Pages, with all the text, videos, and images from the old site
carried over.

## What's included

```
index.html                                        Home — bio, photo, experience, links
writing-preceptorship/
  presentation.html                                Writing Preceptor Presentation (PDF embed pending)
  quills-and-nibs.html                              Five reflective essays, clickable accordion
  writing-resources.html                            Write Bytes & How-To handouts (images)
relevant-coursework/
  marvel-independent-study.html                     "The Monstrous" (Google Slides embed)
  sitcoms-in-macon.html                              Archival research (PDF embed pending)
  digital-humanities/
    overview.html                                    Course intro + reflection
    course-collage.html                               Ten annotated slides
    mercer-writers-project.html                       Reg Murphy story (Google Doc embed)
    digital-cartography-project.html                  Acropolis Museum strategy (files pending)
    i-am-not-a-robot-project.html                      Open letter, essay, annotations (images)
    real-time-writing.html                             Two full essays + Substack link
  films-video-assignments/
    short-films.html                                   3 real YouTube embeds
css/style.css                                      All styling — controlled by variables at the top
js/main.js                                          Dropdown, mobile menu, and essay accordion behavior
assets/pdfs/                                       Empty — for your real PDFs (see below)
assets/img/                                         Empty — for any images you want to self-host
```

## 1. Publish it on GitHub Pages

1. Create a new GitHub repo (public, or private on a paid plan).
2. Upload everything in this folder to the repo root.
3. **Settings → Pages → Source → Deploy from a branch → `main` / root.** Save.
4. GitHub gives you a URL like `https://yourusername.github.io/repo-name/` within a
   minute or two.

## 2. What still needs your attention

A few things from the old site are files that lived directly in Google Drive/Sites
rather than linked pages, so they need to come from you directly:

- **Writing Preceptor Presentation.pdf** (`writing-preceptorship/presentation.html`)
- **Sitcoms in Macon presentation PDF** (`relevant-coursework/sitcoms-in-macon.html`)
- **Digital Cartography Project files** — `Informational_Packet.pdf` and the Classical
  Mythology presentation (`relevant-coursework/digital-humanities/digital-cartography-project.html`)

Once you have each file, drop it in `assets/pdfs/` and embed it with the pattern in
section 5 below.

Everything else — all the essay text, the three short films, the Marvel Independent
Study Google Slides, the Mercer Writers' Project Google Doc, and every handout/slide
image — is already live and pulled from your real content.

## 3. About the hotlinked images

The handout and slide-collage images (`writing-resources.html`, `course-collage.html`,
`i-am-not-a-robot-project.html`) and the homepage photo currently point at Google's
`lh3.googleusercontent.com` CDN — the same URLs the old Google Sites page used. They
work right now because that page is still public, but that's not a permanent
guarantee. For a site meant to last, download those images and save them into
`assets/img/`, then update each `src` to the local path, e.g.:

```html
<img src="../../assets/img/write-bytes-1.png" alt="...">
```

## 4. Google Slides / Docs embeds

Two pages embed a live Google file directly:

- `relevant-coursework/marvel-independent-study.html` — Google Slides, via
  `docs.google.com/presentation/d/FILE_ID/embed`
- `relevant-coursework/digital-humanities/mercer-writers-project.html` — Google Doc,
  via `docs.google.com/document/d/FILE_ID/preview`

These will keep working as long as the file's sharing setting stays "Anyone with the
link can view." If you'd rather not depend on Google staying reachable, export each as
a PDF and use the `.pdf-embed` pattern instead (see below).

## 5. The PDF embed pattern

```html
<div class="pdf-embed">
  <iframe src="../assets/pdfs/your-file.pdf" title="..."></iframe>
  <div class="pdf-embed__fallback">
    <span>your-file.pdf</span>
    <a href="../assets/pdfs/your-file.pdf" target="_blank">Open PDF →</a>
  </div>
</div>
```

There's always a visible link under the embed, not just the iframe — many mobile
browsers won't render a PDF inside an iframe at all, so the fallback link keeps the
file reachable everywhere.

## 6. Adding your own YouTube videos

Grab the ID from the video's URL — `youtube.com/watch?v=`**`kNyjhwlScvs`** — and put it
in the `src`:

```html
<div class="video-embed">
  <iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" ...></iframe>
</div>
```

The wrapper keeps it responsive automatically.

## 7. Adding a new page

1. Copy the closest existing page (e.g. `relevant-coursework/sitcoms-in-macon.html`
   for a single-project page) and edit its content.
2. Add a link to it inside the `.nav-dropdown` list — **in every HTML file**, since
   this template has no templating engine. There are 13 files total with a nav.
   It's a `Ctrl+F` for `nav-dropdown` and a one-line paste in each.
3. Watch the relative path depth: pages at the site root use `css/style.css`; pages
   one folder deep use `../css/style.css`; pages two folders deep (inside
   `digital-humanities/` or `films-video-assignments/`) use `../../css/style.css`.
   The same pattern applies to links back to other pages.

   (If keeping 13 navs in sync gets tedious as the site grows, GitHub Pages' built-in
   Jekyll support lets you write the nav once in an `_includes/nav.html` file. Ask your
   assistant to convert this template to Jekyll includes if you want that.)

## 8. Design notes

- **Accent color** is orange, set once via `--accent` at the top of `css/style.css` —
  change that one variable to retheme the whole site.
- The nav bar, subheadings (`h3`), and the dateline all use the accent color;
  interactive elements (nav links, footer icons, etc.) shift to accent on hover/focus
  as an interaction cue.
- The nav bar font matches the subheading font (`--font-display`, the same Fraunces
  serif used for `h1`–`h3`).
- The Quills and Nibs essays are a click-to-expand accordion (`.essay-list` /
  `.essay-item`) instead of five long sections shown at once — see `js/main.js` for
  the toggle behavior.
- The footer holds the "Let's Connect" links (email + LinkedIn, each with an inline
  SVG icon) on every page.

## 9. Mobile behavior

- The nav collapses to a hamburger menu under 720px width; dropdowns become inline
  accordions instead of floating panels — including the "Digital Humanities" and
  "Films & Video Assignments" sub-groups inside Relevant Projects.
- PDF viewer height shrinks on small screens; the "Open PDF" fallback link is always
  present regardless of screen size.
- Everything below the header is a single centered column with no fixed widths, so
  text reflows naturally at any width — this is what was breaking on the old site.

## 10. Local preview before you publish

Open `index.html` directly in a browser — no server needed. For live-reload while
editing, with Python installed:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.
