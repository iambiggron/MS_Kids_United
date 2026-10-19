# Soccer Kit Studio

Browser-based 3D soccer kit visualizer. React, TypeScript, Three.js, React Three Fiber and Vite.

## Run locally

Install Node.js 20+ and Git, then:

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically http://localhost:5173).

## GitHub setup

Create an empty GitHub repository named `soccer-kit-studio` (do not initialize it with files). In this directory:

```bash
git init
git add .
git commit -m "Initial soccer kit studio prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/soccer-kit-studio.git
git push -u origin main
```

On another computer: `git clone <repo-url>`, `cd soccer-kit-studio`, `npm install`, `npm run dev`.

## Bluehost deployment

Run `npm run build`. Upload the **contents** of `dist/` into the domain/subdomain document root (often `public_html/` or a subdirectory) via Bluehost File Manager or SFTP. Configure the domain to point to that directory. For subdirectory hosting, adjust Vite `base` configuration before building.

## Prototype limitations

- Garments are intentionally simple placeholder shapes, not realistic production-ready models.
- Uploaded graphics are placed on flat front panels, **not** full-garment UV texture wraps.
- Files are kept in browser memory; there is no server upload, user account, or persistent project storage.
- Back view rotates the kit but does not yet support separate back artwork.

## Next steps

Replace placeholders with properly UV-unwrapped GLB garment models, establish printable texture templates for front/back/sleeves/shorts/socks, add local project persistence, and support high-resolution image export.
