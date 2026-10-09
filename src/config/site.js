export const site = Object.freeze({
  url: import.meta.env?.VITE_SITE_URL || '', // Set the final HTTPS domain; never publish a placeholder canonical.
  schemaPhone: '+91-6206730774',
  name: 'Pearl Dental',
  demo: true, // Presentation demo. Confirm every clinic detail before publishing.
  phone: '+91 6206730774',
  phoneHref: 'tel:+916206730774',
  whatsapp: 'https://wa.me/916206730774?text=Hi%2C%20I%20would%20like%20to%20request%20a%20dental%20appointment',
  email: 'divineronny20@gmail.com',
  emailHref: 'mailto:divineronny20@gmail.com',
  schemaHours: 'Mo-Sa 09:30-19:00',
  hours: 'Mon–Sat, 9:30 AM – 7:00 PM',
  countryCode: '+91',
  mapEmbedUrl: '', // Add a Google Maps embed URL when your clinic location is confirmed.
  formEndpoint: '', // Set to https://formspree.io/f/YOUR_FORM_ID when ready.
});
