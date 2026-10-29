# Saraphtha — Portfolio

A one-page portfolio where the sky turns from sunset to outer space as you scroll, and the kite follows you all the way up.

## What's in the folder

| File | What it does |
| --- | --- |
| `index.html` | The main page: the scene, the menu and the five sections |
| `style.css` | All the colours, fonts, layout and animations (project pages use it too) |
| `script.js` | The scroll magic, clickable clouds and the menu underline |
| `projects/project-one.html` | Template for a project page — copy it for each project |
| `images/` | Put your project images and photo here |

## How to preview

Open the folder in VS Code, right-click `index.html` → **Open with Live Server**.

## Filling in your content

Search each file for `[` — every placeholder is in square brackets.

1. **index.html**
   - Page description (top of the file, in `<head>`)
   - Your one-line intro under "Hi, I'm Saraphtha."
   - Project titles and images in the Work section
   - Your photo and bio in About
   - Your three steps in Process
   - Email and links in Contact

2. **Adding a project image**: save it in `images/`, then replace the placeholder
   `<span class="work-card__image" ...></span>` with
   `<img src="images/your-image.jpg" alt="Describe the image">`.
   
3. **Adding project pages**: copy `projects/project-one.html`, rename it (e.g. `project-two.html`),
   fill it in, and point the matching card in the Work section to it.

## Easy customisations

- **Colours**: the variables at the top of `style.css` (`--coral`, `--cream`, …).
- **Sky colours**: the `SKY` list near the top of `script.js`.
- **How fast things change**: the numbers in `ease(…)` in `script.js`. For example,
  `ease(0.25, 0.5, progress)` for the stars means they fade in between 25% and 50% of the way down the page.
- **Clouds**: move them by changing `left` and `top` on each cloud button in `index.html`.

## Accessibility built in

- Visitors with "Reduce motion" turned on in their system settings see no animations.
- The clouds are real buttons and everything works with the keyboard (Tab / Enter).
- The drawings are hidden from screen readers so they only hear your content.
- Remember to give every image you add a short `alt` description.

## Publishing

Push the folder to GitHub, then import the repository on Netlify (no build settings needed).
