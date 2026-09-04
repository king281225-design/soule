// Detects a table token from the QR code URL, e.g. menu.html?t=12
// and persists it for the rest of the browsing session so the customer
// doesn't lose their table context navigating between pages.
//
// IMPORTANT: for production, prefer an opaque/unguessable token per table
// (e.g. ?t=8f2a1c) over a raw sequential number, so table sessions can't be
// guessed or spoofed. This starter uses plain numbers for readability —
// swap in random tokens when you generate the real QR codes.

const TableSession = (function () {
  const STORAGE_KEY = "menu.tableToken";

  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("t");
  const token = fromUrl || sessionStorage.getItem(STORAGE_KEY);

  if (fromUrl) {
    sessionStorage.setItem(STORAGE_KEY, fromUrl);
  }

  return {
    token: token || null,
    label: token ? "Table " + token : null,
  };
})();
