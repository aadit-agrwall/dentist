// Preserve a logo click until the lazy hero has mounted and entered view.
let pending=false;
export function requestLogoShine(){pending=true;window.dispatchEvent(new Event('clinical-logo-shine'));}
export function consumeLogoShine(){const requested=pending;pending=false;return requested;}
