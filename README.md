# Meridian Defence — Website

Static site (HTML/CSS/JS). No build step. Works on GitHub Pages as-is.

## Files
```
index.html     main page
privacy.html   privacy & cookie policy
styles.css     all styling
script.js      animations, sound, cookie banner, support button
assets/        hero.jpg, facility.jpg, orbit.jpg, earth.jpg, favicon.svg
```

## Deploy to GitHub Pages (meridian-defence.github.io)

1. Go to https://github.com/meridian-defence/meridian-defence.github.io
2. Delete the old files: open each old file → trash icon → Commit changes
   (or: Code tab → select all old files locally and delete via GitHub Desktop).
3. Click **Add file → Upload files**.
4. Unzip `meridian-defence.zip` on your computer, then drag **the contents**
   (index.html, privacy.html, styles.css, script.js, README.md and the `assets` folder)
   into the upload box. `index.html` must sit at the top level, not inside a subfolder.
5. Click **Commit changes**.
6. Go to **Settings → Pages**. Under *Build and deployment* set Source = **Deploy from a branch**,
   Branch = **main**, folder = **/ (root)** → Save.
7. Wait 1–2 minutes, then visit https://meridian-defence.github.io (hard refresh: Ctrl/Cmd + Shift + R).

## Connect Botpress support chat

1. In Botpress Studio open your bot → **Webchat → Deploy / Embed**.
2. Copy the two `<script>` tags it gives you.
3. In `index.html`, paste them where the comment says
   `BOTPRESS: paste your two Botpress <script> tags below` (just above `script.js`).
4. Optional: in Botpress Webchat settings, turn off / hide the default floating bubble so only
   the site's elegant **Support** button shows. The button calls `window.botpress.open()`.
5. Commit. Done.

## Editing tips
- Text: edit `index.html` directly.
- Colours/fonts: top of `styles.css` (`:root`).
- Platform tab content (Halcyon / Orbit / Terra): the `platforms` list in `script.js`.
- Sound: generated in-browser (no audio files). Visitors can mute with the speaker icon.
- The contact form is a demo. To receive emails, sign up at formspree.io and set
  `<form action="https://formspree.io/f/XXXX" method="POST">`, then remove the submit handler in `script.js`.
