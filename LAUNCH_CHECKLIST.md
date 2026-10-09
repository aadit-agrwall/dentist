# Replace before publishing the clinic demo

1. Clinic name in `src/config/site.js`; approved logo, favicon, touch icon, and sharing images.
2. Dentist profile in `src/components/sections/Results.jsx`: name, portrait, verified qualifications, registration, and introduction.
3. Dentist-reviewed treatments and FAQ in `src/config/content.js`. List only services actually provided.
4. Fictional patient stories and avatars: replace with verified reviews and photographs with consent, or remove.
5. Demo phone, email, WhatsApp, and hours in `site.js`; verified clinic address and Google Maps embed. Add the address to structured data only when confirmed.
6. `site.formEndpoint` for appointment enquiries. Test delivery, failures, spam protection, consent handling, and staff follow-up. Email drafts need the visitor to send them; preferred slots require clinic confirmation.
7. Verified social profiles if applicable. The footer currently links phone, email, and WhatsApp.
8. `site.url` with the production HTTPS domain. Change `site.demo` after reviewing all information, then run `npm run build` for SEO assets.
9. Clinic privacy notice and consent wording before collecting real patient information.

# Verification

The clinic conversion passes production compilation and local geometry/appointment tests. Final preview inspection was blocked by browser security policy. Previous agency layout checks do not validate this conversion.

Before launch, check 360, 768, 1024, 1440, and 1920px layouts; keyboard and screen readers; WebGL-disabled and reduced-motion behavior; native Chrome, Firefox, and real iOS Safari; email and endpoint delivery; touch safe areas, sticky controls, and production SEO.

Lighthouse 90+ and 60fps are targets, not measured claims. Profile the final site on a mid-range phone.
