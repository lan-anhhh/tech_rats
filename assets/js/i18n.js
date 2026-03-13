export const i18n = {
  en: {
    museumName: "World Paintings Museum",
    museumTagline: "A quiet place for loud masterpieces.",
    nav: { gallery: "Gallery", my: "My Gallery" },
    heroTitle: (name) => `Welcome, ${name}.`,
    heroSubtitle: "Explore six iconic paintings, open a text guide, then draw directly on top—save your versions in My Gallery to revisit them anytime.",
    tags: {
      identity: (uid) => `User ID: ${uid.slice(0, 8)}…`,
      local: "No backend — everything is saved locally",
      mobile: "Mobile-friendly canvas editor"
    },
    gallery: { title: "Painting Gallery", hint: "Tap 🎧 for the guide, ✏️ to draw." },
    my: {
      title: "My Gallery",
      hint: "Saved drawings are stored only on this device (localStorage).",
      empty: "No saved drawings yet. Open a painting, draw something, then use “Save to My Gallery”."
    },
    cards: { guide: "Info guide", draw: "Draw" },
    welcome: {
      title: "Welcome to the museum",
      text: "Before we begin, choose a nickname. It will appear in the navbar and on your saved drawings.",
      label: "Nickname",
      hint: "Up to 24 characters. You can change it later by clearing localStorage.",
      save: "Continue"
    },
    guide: { close: "Close" },
    draw: {
      subtitle: (artist, year) => `${artist} · ${year}`,
      save: "Save to My Gallery",
      download: "Download as PNG",
      close: "Close",
      tools: {
        color: "Colors",
        brush: "Brush",
        edit: "Edit",
        tip: "Tip: two fingers to pan the page; draw with one finger/stylus."
      },
      brushSizes: { s: "Small", m: "Medium", l: "Large" },
      editButtons: { pen: "Pen", eraser: "Eraser", undo: "Undo", clear: "Clear" },
      toastSaved: "Saved to My Gallery.",
      toastUndoEmpty: "Nothing to undo.",
      toastCleared: "Canvas cleared."
    },
    lightbox: { close: "Close", del: "Delete" },
    aria: { paintingImage: (t) => `Painting: ${t}` }
  },
  cs: {
    museumName: "Muzeum slavných obrazů",
    museumTagline: "Tiché místo pro hlasitá mistrovská díla.",
    nav: { gallery: "Galerie", my: "Moje galerie" },
    heroTitle: (name) => `Vítej, ${name}.`,
    heroSubtitle: "Prohlédni si šest ikonických obrazů, otevři textového průvodce a pak kresli přímo přes dílo—své verze si ulož do Moje galerie a kdykoli se k nim vrať.",
    tags: {
      identity: (uid) => `ID uživatele: ${uid.slice(0, 8)}…`,
      local: "Bez backendu — vše se ukládá lokálně",
      mobile: "Kreslení je přizpůsobené mobilu"
    },
    gallery: { title: "Galerie obrazů", hint: "Klepni na 🎧 pro průvodce, ✏️ pro kreslení." },
    my: {
      title: "Moje galerie",
      hint: "Uložené kresby jsou jen v tomto zařízení (localStorage).",
      empty: "Zatím tu nic není. Otevři obraz, něco nakresli a použij „Uložit do Moje galerie“."
    },
    cards: { guide: "Textový průvodce", draw: "Kreslit" },
    welcome: {
      title: "Vítej v muzeu",
      text: "Než začneme, vyber si přezdívku. Uvidíš ji v horní liště i u svých uložených kreseb.",
      label: "Přezdívka",
      hint: "Maximálně 24 znaků. Změníš ji vymazáním localStorage.",
      save: "Pokračovat"
    },
    guide: { close: "Zavřít" },
    draw: {
      subtitle: (artist, year) => `${artist} · ${year}`,
      save: "Uložit do Moje galerie",
      download: "Stáhnout jako PNG",
      close: "Zavřít",
      tools: {
        color: "Barvy",
        brush: "Štětec",
        edit: "Úpravy",
        tip: "Tip: dvěma prsty posouvej stránku; kresli jedním prstem nebo stylusem."
      },
      brushSizes: { s: "Malý", m: "Střední", l: "Velký" },
      editButtons: { pen: "Pero", eraser: "Guma", undo: "Zpět", clear: "Smazat" },
      toastSaved: "Uloženo do Moje galerie.",
      toastUndoEmpty: "Není co vrátit.",
      toastCleared: "Plátno smazáno."
    },
    lightbox: { close: "Zavřít", del: "Smazat" },
    aria: { paintingImage: (t) => `Obraz: ${t}` }
  }
};

