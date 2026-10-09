# Pearl Dental presentation demo

A patient-facing dental clinic website built with React 18, Vite, JavaScript, Tailwind, Framer Motion, GSAP, and procedural Three.js scenes. The cream, forest, and lime design includes animated tooth and molecules, treatments, a visit timeline, care philosophy, a dentist profile placeholder, fictional patient stories, FAQ, and an appointment request form.

## Run locally

- `npm install`
- `npm run dev` — http://127.0.0.1:5173/
- `npm run build` then `npm run preview` — http://127.0.0.1:4173/
- `node --test tests/*.test.js` — geometry and appointment checks

The hidden `/styleguide` demonstrates reusable components. Clinic details live in `src/config/site.js`; treatments, patient stories, navigation, and FAQ live in `src/config/content.js`.

## Appointment requests

The form asks for patient contact details, treatment, preferred date/time, an optional message, and consent. With the default empty `formEndpoint`, it prepares an email draft for the visitor to send. A configured JSON-compatible endpoint enables submission with loading, retry, and receipt states. Requests require clinic confirmation of availability.

## Presentation placeholders

Pearl Dental is a demo name. The dentist profile, contact details, opening hours, map, and fictional reviews must be replaced with verified information before publishing. `site.demo` keeps the page marked noindex. Review LAUNCH_CHECKLIST.md before using a real domain.

## Motion and verification

Motion follows the device preference, with a navbar toggle. Touch devices simplify effects. Three.js scenes pause off-screen, cap DPR, and fall back to SVG when WebGL is unavailable. Visible focus states, accessible controls, and a skip link are included.

The clinic conversion passes production compilation and unit tests. Updated browser inspection was blocked by browser security policy. Native browsers, real iOS, Lighthouse, and phone frame-rate checks remain required.

## GitHub Pages

`.github/workflows/pages.yml` builds and publishes the site on pushes to `main`. Enable **Settings → Pages → Source → GitHub Actions** in the repository. The workflow supplies the repository base path and public URL; local development stays at `/`. Font, icon, bundle, and sharing-image paths work in a repository subfolder. The presentation demo remains noindex and uses the email-draft appointment fallback.
