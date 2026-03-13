// ─── utils ───────────────────────────────────────────────────────────────────
function safeJsonParse(raw, fallback){
  try { return JSON.parse(raw); } catch { return fallback; }
}

function uuidv4(){
  if (window.crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const buf = new Uint8Array(16);
  (window.crypto || window.msCrypto).getRandomValues(buf);
  buf[6] = (buf[6] & 0x0f) | 0x40;
  buf[8] = (buf[8] & 0x3f) | 0x80;
  const hex = [...buf].map(b => b.toString(16).padStart(2,"0")).join("");
  return (
    hex.slice(0,8) + "-" +
    hex.slice(8,12) + "-" +
    hex.slice(12,16) + "-" +
    hex.slice(16,20) + "-" +
    hex.slice(20)
  );
}

function fmtDate(ts){
  const d = new Date(ts);
  return d.toLocaleString(undefined, { year:"numeric", month:"short", day:"2-digit", hour:"2-digit", minute:"2-digit" });
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));
}

function rgbToHex(rgb){
  const m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return "#000000";
  const r = Number(m[1]).toString(16).padStart(2,"0");
  const g = Number(m[2]).toString(16).padStart(2,"0");
  const b = Number(m[3]).toString(16).padStart(2,"0");
  return ("#" + r + g + b).toLowerCase();
}

// ─── i18n ─────────────────────────────────────────────────────────────────────
const i18n = {
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
      empty: 'No saved drawings yet. Open a painting, draw something, then use “Save to My Gallery”.'
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
      empty: 'Zatím tu nic není. Otevři obraz, něco nakresli a použij „Uložit do Moje galerie“.'
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

// ─── paintings ────────────────────────────────────────────────────────────────
const paintings = [
  {
    id: "mona",
    title: { en: "Mona Lisa", cs: "Mona Lisa" },
    artist: { en: "Leonardo da Vinci", cs: "Leonardo da Vinci" },
    signature: "Leonardo",
    year: "1503",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Mona_Lisa.jpg",
    guide: {
      en: {
        p: [
          "Few portraits have shaped the public imagination like the Mona Lisa. Leonardo paints not just a face, but a presence: the soft transitions of light and shadow (sfumato) make the features feel alive, as if they're still forming in front of you.",
          "The landscape behind her bends into a dreamlike geography—roads, rivers, and distant mountains that don't quite align. That subtle mismatch heightens the sense that the sitter belongs to a world that is both real and invented.",
          "Rather than a frozen moment, the portrait behaves like a quiet conversation. The gaze meets you, then slips away; the famous smile seems to change depending on where your eyes rest."
        ],
        fact: "Interesting fact: The painting is small—about 77 × 53 cm—yet it became one of the most visited artworks in the world."
      },
      cs: {
        p: [
          "Jen málokterý portrét ovlivnil lidskou představivost tak jako Mona Lisa. Leonardo nemaluje jen tvář, ale přítomnost: jemné přechody světla a stínu (sfumato) dělají rysy živé, jako by se před vámi stále rodily.",
          "Krajina v pozadí se stáčí do snové geografie—cesty, řeky a vzdálené hory do sebe úplně nezapadají. Právě ta drobná nesourodost posiluje dojem, že sedící patří do světa zároveň skutečného i vymyleného.",
          "Portrét nepůsobí jako zmrazený okamžik, ale jako tichý rozhovor. Pohled se s vámi střetne a pak uklouzne; slavný úsměv se zdá měnit podle toho, kam položíte zrak."
        ],
        fact: "Zajímavost: Obraz je malý—přibližně 77 × 53 cm—přesto se stal jedním z nejnavštěvovanějších děl na světě."
      }
    }
  },
  {
    id: "starry",
    title: { en: "The Starry Night", cs: "Hvězdná noc" },
    artist: { en: "Vincent van Gogh", cs: "Vincent van Gogh" },
    signature: "V. van Gogh",
    year: "1889",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ea/The_Starry_Night.jpg",
    guide: {
      en: {
        p: [
          "The Starry Night turns the night sky into a living current. Van Gogh's brushwork—thick, rhythmic, and directional—makes the air feel like it's moving, as if wind and light are the same substance.",
          "The village below is calm and simplified, anchored by the church spire. Against that stillness, the cypress rises like a dark flame, linking earth to the swirling heavens.",
          "Painted from memory and imagination rather than direct observation, the scene becomes emotional geography: a night that looks the way it feels—restless, luminous, and intensely present."
        ],
        fact: "Interesting fact: Van Gogh painted this while staying at the asylum in Saint-Rémy-de-Provence."
      },
      cs: {
        p: [
          "Hvězdná noc proměňuje noční oblohu v živý proud. Van Goghův štětec—hustý, rytmický a směrový—dává vzduchu pohyb, jako by vítr a světlo byly jednou látkou.",
          "Vesnice dole je klidná a zjednodušená, ukotvená věží kostela. Proti té nehybnosti se cypřiš zvedá jako temný plamen a propojuje zem se vířícími nebesy.",
          "Obraz vznikl z paměti a představivosti spíše než z přímého pozorování. Scéna se tak stává emocionální krajinou: noc vypadá tak, jak se prožívá—neklidná, zářivá a naléhavě přítomná."
        ],
        fact: "Zajímavost: Van Gogh obraz namaloval během pobytu v léčebně v Saint-Rémy-de-Provence."
      }
    }
  },
  {
    id: "scream",
    title: { en: "The Scream", cs: "Výkřik" },
    artist: { en: "Edvard Munch", cs: "Edvard Munch" },
    signature: "E. Munch",
    year: "1893",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f4/The_Scream.jpg",
    guide: {
      en: {
        p: [
          "The Scream is less a portrait than a shockwave. The figure's face becomes a mask, stripped down to pure expression—eyes wide, mouth open, hands pressed to the head as if to contain a sound that is everywhere.",
          "Munch bends the world around the scream: the bridge rails echo in rigid lines while the sky coils in waves of color. Perspective feels unstable, pushing the viewer into the scene's anxiety.",
          "The two distant walkers remain oddly detached, amplifying isolation. It's a modern image of inner turmoil made visible on the outside."
        ],
        fact: "Interesting fact: Munch created multiple versions of The Scream in different media (painting, pastel, and print)."
      },
      cs: {
        p: [
          "Výkřik je spíš rázová vlna než portrét. Postava se mění v masku, zjednodušenou na čistý výraz—rozšířené oči, otevřená ústa, ruce přitisknuté k hlavě, jako by se snažily zadržet zvuk, který je všude.",
          "Munch ohýbá svět kolem výkřiku: zábradlí mostu se rýmuje tvrdými liniemi, zatímco obloha se svíjí v barevných vlnách. Perspektiva je nejistá a vtahuje diváka do úzkosti scény.",
          "Dvě vzdálené postavy působí zvláštně odtažitě, čímž zesilují pocit osamění. Je to moderní obraz vnitřního neklidu, který se otiskl navenek."
        ],
        fact: "Zajímavost: Munch vytvořil několik verzí Výkřiku v různých technikách (malba, pastel i grafika)."
      }
    }
  },
  {
    id: "memory",
    title: { en: "The Persistence of Memory", cs: "Trvalost paměti" },
    artist: { en: "Salvador Dalí", cs: "Salvador Dalí" },
    signature: "Dalí",
    year: "1931",
    image: "https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg",
    guide: {
      en: {
        p: [
          "In The Persistence of Memory, time seems to melt. Dalí paints watches as soft objects that drape and sag, turning a symbol of measurement into something bodily and vulnerable.",
          "The setting is eerily quiet: a coastal plain under a hard, clear light. The contrast between precise realism and impossible objects creates the uncanny, dreamlike tension that defines Surrealism.",
          "At the center lies a strange, sleeping form—often read as a distorted self-portrait—suggesting that time behaves differently inside the mind, especially in dreams."
        ],
        fact: "Interesting fact: Dalí reportedly described the soft watches as inspired by the way Camembert cheese melts."
      },
      cs: {
        p: [
          "V obraze Trvalost paměti se čas doslova rozplývá. Dalí maluje hodinky jako měkké předměty, které se převalují a prověšují—symbol měření se mění v něco tělesného a zranitelného.",
          "Prostor je znepokojivě tichý: pobřežní rovina pod tvrdým, jasným světlem. Kontrast mezi přesným realismem a nemožnými objekty vytváří onu podivnost a snovou tenzi typickou pro surrealismus.",
          "Uprostřed leží podivná spící forma—často vykládaná jako deformovaný autoportrét—která naznačuje, že v mysli, zvlášť ve snu, se čas chová jinak."
        ],
        fact: "Zajímavost: Dalí údajně říkal, že měkké hodinky ho inspirovaly tím, jak se rozpouští sýr Camembert."
      }
    }
  },
  {
    id: "pearl",
    title: { en: "Girl with a Pearl Earring", cs: "Dívka s perlou" },
    artist: { en: "Johannes Vermeer", cs: "Johannes Vermeer" },
    signature: "J. Vermeer",
    year: "1665",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Meisje_met_de_parel.jpg",
    guide: {
      en: {
        p: [
          "Vermeer's Girl with a Pearl Earring feels like an interrupted moment. The sitter turns her head as if someone has just called her name; lips part slightly, and the gaze is direct yet gentle.",
          "The background is nearly featureless, focusing attention on light itself: the soft modeling of the face, the shimmer of the earring, and the crisp highlight on the lower lip.",
          "Rather than a conventional portrait, it's a tronie—a study of expression and costume. The blue-and-yellow turban and the luminous pearl become the painting's quiet drama."
        ],
        fact: "Interesting fact: The \"pearl\" is painted with remarkably few strokes—mainly a highlight and soft shadow—yet it reads as perfectly spherical."
      },
      cs: {
        p: [
          "Vermeerova Dívka s perlou působí jako přerušený okamžik. Sedící otáčí hlavu, jako by ji právě někdo oslovil; rty se nepatrně pootevřou a pohled je přímý, ale jemný.",
          "Pozadí je téměř beztvaré, takže vynikne samotné světlo: měkké modelování tváře, lesk náušnice a ostrý odlesk na spodním rtu.",
          'Nejde o klasický portrét, ale o tzv. tronie—studii výrazu a kostýmu. Modro-žlutý turban a zářivá „perla“ tvoří tichou dramatičnost obrazu.'
        ],
        fact: 'Zajímavost: „Perla“ je namalovaná překvapivě málo tahy—hlavně odleskem a jemným stínem—přesto působí dokonale kulatě.'
      }
    }
  },
  {
    id: "kiss",
    title: { en: "The Kiss", cs: "Polibek" },
    artist: { en: "Gustav Klimt", cs: "Gustav Klimt" },
    signature: "G. Klimt",
    year: "1907",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/74/Gustav_Klimt_016.jpg",
    guide: {
      en: {
        p: [
          "The Kiss is intimacy turned into ornament. Klimt wraps the couple in a field of gold and pattern, blending bodies into a single shimmering form while keeping the faces and hands tenderly human.",
          "The robe's motifs are not random: angular shapes cluster around the man, while soft circles and florals surround the woman. Pattern becomes character, suggesting two distinct presences meeting in one embrace.",
          "Set on a small patch of flowers at the edge of a void, the scene feels suspended in time—a private moment elevated into an icon of love."
        ],
        fact: "Interesting fact: Klimt's \"golden phase\" was influenced by Byzantine mosaics, which he studied in Ravenna."
      },
      cs: {
        p: [
          "Polibek je intimita proměněná v ornament. Klimt zahaluje dvojici do pole zlata a vzorů, kde se těla slévají do jedné třpytivé formy, zatímco tváře a ruce zůstávají něžně lidské.",
          "Motivy na plášti nejsou náhodné: u muže převládají úhlové tvary, u ženy měkké kruhy a květinové vzory. Ornament se stává charakterem—dvě rozdílné přítomnosti se setkávají v jednom objetí.",
          "Na malém ostrůvku květů na okraji prázdna působí scéna jako zastavená v čase—soukromý okamžik povýšený na ikonu lásky."
        ],
        fact: 'Zajímavost: Klimtovu „zlatou fázi“ ovlivnily byzantské mozaiky, které studoval v Ravenně.'
      }
    }
  }
];

// ─── app ──────────────────────────────────────────────────────────────────────
const LS = {
  userId: "user_id",
  username: "username",
  lang: "lang"
};

const state = {
  userId: null,
  username: null,
  lang: "en",
  route: "gallery",
  guidePaintingId: null,
  drawPaintingId: null,
  draw: {
    color: "#f1f1f1",
    size: 8,
    mode: "pen",
    undo: []
  }
};

const els = {
  museumName: document.getElementById("museumName"),
  museumTagline: document.getElementById("museumTagline"),
  navGallery: document.getElementById("navGallery"),
  navMy: document.getElementById("navMy"),
  langToggle: document.getElementById("langToggle"),
  userNickname: document.getElementById("userNickname"),
  heroTitle: document.getElementById("heroTitle"),
  heroSubtitle: document.getElementById("heroSubtitle"),
  tagIdentity: document.getElementById("tagIdentity"),
  tagLocal: document.getElementById("tagLocal"),
  tagMobile: document.getElementById("tagMobile"),

  galleryTitle: document.getElementById("galleryTitle"),
  galleryHint: document.getElementById("galleryHint"),
  galleryGrid: document.getElementById("galleryGrid"),

  myTitle: document.getElementById("myTitle"),
  myHint: document.getElementById("myHint"),
  myGrid: document.getElementById("myGrid"),
  myEmpty: document.getElementById("myEmpty"),

  welcomeBackdrop: document.getElementById("welcomeBackdrop"),
  welcomeTitle: document.getElementById("welcomeTitle"),
  welcomeText: document.getElementById("welcomeText"),
  nickLabel: document.getElementById("nickLabel"),
  nickInput: document.getElementById("nickInput"),
  nickHint: document.getElementById("nickHint"),
  welcomeSave: document.getElementById("welcomeSave"),

  guidePanel: document.getElementById("guidePanel"),
  guideTitle: document.getElementById("guideTitle"),
  guideMeta: document.getElementById("guideMeta"),
  guideBody: document.getElementById("guideBody"),
  guideClose: document.getElementById("guideClose"),

  drawOverlay: document.getElementById("drawOverlay"),
  drawTitle: document.getElementById("drawTitle"),
  drawSubtitle: document.getElementById("drawSubtitle"),
  drawSave: document.getElementById("drawSave"),
  drawDownload: document.getElementById("drawDownload"),
  drawClose: document.getElementById("drawClose"),
  stageBg: document.getElementById("stageBg"),
  stageFrame: document.getElementById("stageFrame"),
  stageSig: document.getElementById("stageSig"),
  canvas: document.getElementById("drawCanvas"),
  colorPalette: document.getElementById("colorPalette"),
  brushSizes: document.getElementById("brushSizes"),
  editTools: document.getElementById("editTools"),
  toolColor: document.getElementById("toolColor"),
  toolBrush: document.getElementById("toolBrush"),
  toolEdit: document.getElementById("toolEdit"),
  toolTip: document.getElementById("toolTip"),

  lightbox: document.getElementById("lightbox"),
  lightboxImg: document.getElementById("lightboxImg"),
  lightboxTitle: document.getElementById("lightboxTitle"),
  lightboxSubtitle: document.getElementById("lightboxSubtitle"),
  lightboxDelete: document.getElementById("lightboxDelete"),
  lightboxClose: document.getElementById("lightboxClose")
};

const pages = [...document.querySelectorAll(".page")];
const navButtons = [...document.querySelectorAll(".navlink")];

function getT(){ return i18n[state.lang]; }

function setLang(next){
  state.lang = next;
  localStorage.setItem(LS.lang, next);
  document.documentElement.lang = next === "cs" ? "cs" : "en";
  renderAll();
}

function getUserGalleryKey(){ return `my_gallery_${state.userId}`; }

function loadMyGallery(){
  const raw = localStorage.getItem(getUserGalleryKey());
  const arr = safeJsonParse(raw || "[]", []);
  return Array.isArray(arr) ? arr : [];
}
function saveMyGallery(arr){
  localStorage.setItem(getUserGalleryKey(), JSON.stringify(arr));
}

function routeFromHash(){
  const h = (location.hash || "#gallery").replace("#", "").trim();
  return (h === "gallery" || h === "my") ? h : "gallery";
}

function setRoute(route){
  state.route = route;
  for (const p of pages) p.classList.toggle("active", p.dataset.page === route);
  for (const b of navButtons){
    const cur = b.dataset.route === route;
    b.setAttribute("aria-current", cur ? "page" : "false");
  }
  if (route === "my") renderMyGallery();
}

function openWelcome(){
  els.welcomeBackdrop.classList.add("show");
  setTimeout(() => els.nickInput.focus(), 50);
}
function closeWelcome(){
  els.welcomeBackdrop.classList.remove("show");
}

function openGuide(paintingId){
  state.guidePaintingId = paintingId;
  renderGuide();
  els.guidePanel.classList.add("show");
}
function closeGuide(){
  els.guidePanel.classList.remove("show");
  state.guidePaintingId = null;
}

let toastEl = null;
let toastTimer = null;
function toast(msg){
  if (!toastEl){
    toastEl = document.createElement("div");
    toastEl.style.position = "fixed";
    toastEl.style.left = "50%";
    toastEl.style.bottom = "18px";
    toastEl.style.transform = "translateX(-50%)";
    toastEl.style.background = "rgba(16,17,22,0.92)";
    toastEl.style.border = "1px solid rgba(255,255,255,0.14)";
    toastEl.style.borderRadius = "999px";
    toastEl.style.padding = "10px 14px";
    toastEl.style.color = "rgba(255,255,255,0.92)";
    toastEl.style.boxShadow = "0 18px 45px rgba(0,0,0,0.55)";
    toastEl.style.backdropFilter = "blur(12px)";
    toastEl.style.zIndex = "200";
    toastEl.style.fontWeight = "650";
    toastEl.style.letterSpacing = "0.1px";
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.style.opacity = "1";
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    if (toastEl) toastEl.style.opacity = "0";
  }, 1600);
}

function renderStaticText(){
  const t = getT();

  els.museumName.textContent = t.museumName;
  els.museumTagline.textContent = t.museumTagline;
  els.navGallery.textContent = t.nav.gallery;
  els.navMy.textContent = t.nav.my;

  els.langToggle.textContent = state.lang === "cs" ? "🇬🇧" : "🇨🇿";
  els.langToggle.title = state.lang === "cs" ? "English" : "Čeština";

  els.userNickname.textContent = state.username || "—";

  els.heroTitle.textContent = t.heroTitle(state.username || (state.lang === "cs" ? "návštěvníku" : "visitor"));
  els.heroSubtitle.textContent = t.heroSubtitle;
  els.tagIdentity.textContent = t.tags.identity(state.userId);
  els.tagLocal.textContent = t.tags.local;
  els.tagMobile.textContent = t.tags.mobile;

  els.galleryTitle.textContent = t.gallery.title;
  els.galleryHint.textContent = t.gallery.hint;

  els.myTitle.textContent = t.my.title;
  els.myHint.textContent = t.my.hint;
  els.myEmpty.textContent = t.my.empty;

  els.welcomeTitle.textContent = t.welcome.title;
  els.welcomeText.textContent = t.welcome.text;
  els.nickLabel.textContent = t.welcome.label;
  els.nickHint.textContent = t.welcome.hint;
  els.welcomeSave.textContent = t.welcome.save;

  els.guideClose.title = t.guide.close;

  els.drawSave.textContent = t.draw.save;
  els.drawDownload.textContent = t.draw.download;
  els.drawClose.textContent = t.draw.close;

  els.toolColor.textContent = t.draw.tools.color;
  els.toolBrush.textContent = t.draw.tools.brush;
  els.toolEdit.textContent = t.draw.tools.edit;
  els.toolTip.textContent = t.draw.tools.tip;

  els.lightboxDelete.textContent = t.lightbox.del;
  els.lightboxClose.textContent = t.lightbox.close;
}

function renderGallery(){
  const t = getT();
  els.galleryGrid.innerHTML = "";
  for (const p of paintings){
    const card = document.createElement("article");
    card.className = "card";

    const thumb = document.createElement("div");
    thumb.className = "thumb";
    const img = document.createElement("img");
    img.loading = "lazy";
    img.decoding = "async";
    img.src = p.image;
    img.alt = t.aria.paintingImage(p.title[state.lang]);
    thumb.appendChild(img);
    const sig = document.createElement("div");
    sig.className = "sig";
    sig.textContent = p.signature || p.artist.en;
    thumb.appendChild(sig);

    const body = document.createElement("div");
    body.className = "card-body";

    const tr = document.createElement("div");
    tr.className = "title-row";
    const titleWrap = document.createElement("div");
    const h = document.createElement("h4");
    h.className = "p-title";
    h.textContent = p.title[state.lang];
    const meta = document.createElement("p");
    meta.className = "p-meta";
    meta.textContent = `${p.artist[state.lang]} · ${p.year}`;
    titleWrap.appendChild(h);
    titleWrap.appendChild(meta);
    tr.appendChild(titleWrap);
    body.appendChild(tr);

    const actions = document.createElement("div");
    actions.className = "actions";

    const guideBtn = document.createElement("button");
    guideBtn.className = "btn icon-btn";
    guideBtn.type = "button";
    guideBtn.title = t.cards.guide;
    guideBtn.setAttribute("aria-label", t.cards.guide);
    guideBtn.textContent = "🎧";
    guideBtn.addEventListener("click", () => openGuide(p.id));

    const drawBtn = document.createElement("button");
    drawBtn.className = "btn primary";
    drawBtn.type = "button";
    drawBtn.innerHTML = `✏️ <span>${escapeHtml(t.cards.draw)}</span>`;
    drawBtn.addEventListener("click", () => openDraw(p.id));

    actions.appendChild(guideBtn);
    actions.appendChild(drawBtn);
    body.appendChild(actions);

    card.appendChild(thumb);
    card.appendChild(body);
    els.galleryGrid.appendChild(card);
  }
}

function renderGuide(){
  const p = paintings.find(x => x.id === state.guidePaintingId);
  if (!p) return;
  const title = p.title[state.lang];
  const artist = p.artist[state.lang];
  els.guideTitle.textContent = title;
  els.guideMeta.textContent = `${artist} · ${p.year}`;

  const content = p.guide[state.lang];
  const parts = [];
  for (const para of content.p){
    parts.push(`<p>${escapeHtml(para)}</p>`);
  }
  parts.push(`<div class="fact"><b>${escapeHtml(state.lang === "cs" ? "Zajímavost:" : "Interesting fact:")}</b> ${escapeHtml(content.fact.replace(/^Interesting fact:\s*/,"").replace(/^Zajímavost:\s*/,""))}</div>`);
  els.guideBody.innerHTML = parts.join("");
}

function renderMyGallery(){
  const items = loadMyGallery().slice().sort((a,b) => b.savedAt - a.savedAt);
  els.myGrid.innerHTML = "";
  els.myEmpty.style.display = items.length ? "none" : "block";
  if (!items.length) return;

  for (const item of items){
    const p = paintings.find(x => x.id === item.paintingId);
    const paintingName = p ? p.title[state.lang] : item.paintingTitle || "—";

    const card = document.createElement("article");
    card.className = "saved-card";

    const th = document.createElement("div");
    th.className = "saved-thumb";
    const img = document.createElement("img");
    img.loading = "lazy";
    img.decoding = "async";
    img.src = item.imageDataUrl;
    img.alt = paintingName;
    th.appendChild(img);

    const body = document.createElement("div");
    body.className = "saved-body";
    const title = document.createElement("p");
    title.className = "saved-title";
    title.textContent = paintingName;
    const sub = document.createElement("p");
    sub.className = "saved-sub";
    sub.textContent = (state.lang === "cs" ? "Uloženo: " : "Saved: ") + fmtDate(item.savedAt);

    const actions = document.createElement("div");
    actions.className = "actions";

    const viewBtn = document.createElement("button");
    viewBtn.type = "button";
    viewBtn.className = "btn";
    viewBtn.textContent = state.lang === "cs" ? "Zobrazit" : "View";
    viewBtn.addEventListener("click", () => openLightbox(item.id));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn danger";
    delBtn.textContent = state.lang === "cs" ? "Smazat" : "Delete";
    delBtn.addEventListener("click", () => deleteSaved(item.id));

    actions.appendChild(viewBtn);
    actions.appendChild(delBtn);

    body.appendChild(title);
    body.appendChild(sub);
    body.appendChild(actions);

    card.appendChild(th);
    card.appendChild(body);
    els.myGrid.appendChild(card);
  }
}

// LIGHTBOX
let lightboxItemId = null;
function openLightbox(itemId){
  const items = loadMyGallery();
  const item = items.find(x => x.id === itemId);
  if (!item) return;
  lightboxItemId = itemId;
  const p = paintings.find(x => x.id === item.paintingId);
  const paintingName = p ? p.title[state.lang] : item.paintingTitle || "—";
  els.lightboxTitle.textContent = paintingName;
  els.lightboxSubtitle.textContent = (state.lang === "cs" ? "Uloženo: " : "Saved: ") + fmtDate(item.savedAt);
  els.lightboxImg.src = item.imageDataUrl;
  els.lightboxImg.alt = paintingName;
  els.lightbox.classList.add("show");
}
function closeLightbox(){
  els.lightbox.classList.remove("show");
  lightboxItemId = null;
}
function deleteSaved(itemId){
  const items = loadMyGallery();
  const next = items.filter(x => x.id !== itemId);
  saveMyGallery(next);
  if (lightboxItemId === itemId) closeLightbox();
  renderMyGallery();
}

// DRAWING
const ctx = els.canvas.getContext("2d", { alpha: true });
let drawing = false;
let last = null;
let bgImg = new Image();
bgImg.crossOrigin = "anonymous";

const palette = ["#f1f1f1", "#0b0c10", "#d8b26e", "#86b9ff", "#ff6b6b", "#3ddc97", "#b58cff", "#ffd166", "#06d6a0", "#ef476f"];

function buildPalette(){
  els.colorPalette.innerHTML = "";
  for (const col of palette){
    const b = document.createElement("button");
    b.type = "button";
    b.className = "swatch";
    b.style.background = col;
    b.title = col;
    b.setAttribute("aria-label", col);
    b.addEventListener("click", () => {
      state.draw.color = col;
      state.draw.mode = "pen";
      syncToolUI();
    });
    els.colorPalette.appendChild(b);
  }
}

function buildBrushSizes(){
  const t = getT();
  els.brushSizes.innerHTML = "";
  const opts = [
    { id: "s", label: t.draw.brushSizes.s, size: 5 },
    { id: "m", label: t.draw.brushSizes.m, size: 9 },
    { id: "l", label: t.draw.brushSizes.l, size: 15 }
  ];
  for (const o of opts){
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = o.label;
    b.dataset.size = String(o.size);
    b.addEventListener("click", () => {
      state.draw.size = o.size;
      syncToolUI();
    });
    els.brushSizes.appendChild(b);
  }
}

function buildEditTools(){
  const t = getT();
  els.editTools.innerHTML = "";
  const tools = [
    { key: "pen", label: t.draw.editButtons.pen, onClick: () => { state.draw.mode = "pen"; syncToolUI(); } },
    { key: "eraser", label: t.draw.editButtons.eraser, onClick: () => { state.draw.mode = "eraser"; syncToolUI(); } },
    { key: "undo", label: t.draw.editButtons.undo, onClick: () => undoStroke() },
    { key: "clear", label: t.draw.editButtons.clear, onClick: () => clearCanvas(true) }
  ];
  for (const tool of tools){
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = tool.label;
    b.dataset.tool = tool.key;
    b.addEventListener("click", tool.onClick);
    els.editTools.appendChild(b);
  }
}

function syncToolUI(){
  const sw = [...els.colorPalette.querySelectorAll(".swatch")];
  for (const s of sw){
    const isSel = (state.draw.mode === "pen") && (rgbToHex(getComputedStyle(s).backgroundColor) === state.draw.color.toLowerCase());
    s.classList.toggle("selected", isSel);
  }
  const bs = [...els.brushSizes.querySelectorAll("button")];
  for (const b of bs){
    b.classList.toggle("selected", Number(b.dataset.size) === state.draw.size);
  }
  const ed = [...els.editTools.querySelectorAll("button")];
  for (const b of ed){
    const tool = b.dataset.tool;
    const sel = (tool === "pen" && state.draw.mode === "pen") || (tool === "eraser" && state.draw.mode === "eraser");
    b.classList.toggle("selected", sel);
  }
}

function openDraw(paintingId){
  const p = paintings.find(x => x.id === paintingId);
  if (!p) return;
  state.drawPaintingId = paintingId;
  state.draw.undo = [];
  state.draw.mode = "pen";
  state.draw.color = palette[0];
  state.draw.size = 9;

  els.drawTitle.textContent = p.title[state.lang];
  els.drawSubtitle.textContent = getT().draw.subtitle(p.artist[state.lang], p.year);
  els.stageSig.textContent = p.signature || p.artist.en;

  els.stageBg.style.backgroundImage = `url("${p.image}")`;
  els.drawOverlay.classList.add("show");

  bgImg = new Image();
  bgImg.crossOrigin = "anonymous";
  bgImg.src = p.image;
  bgImg.onload = () => {};
  bgImg.onerror = () => {};

  resizeCanvasToFrame(true);
  buildBrushSizes();
  buildEditTools();
  syncToolUI();
}

function closeDraw(){
  els.drawOverlay.classList.remove("show");
  state.drawPaintingId = null;
  drawing = false;
  last = null;
}

function getCanvasPoint(evt){
  const rect = els.canvas.getBoundingClientRect();
  let clientX, clientY;
  if (evt.touches && evt.touches[0]){
    clientX = evt.touches[0].clientX;
    clientY = evt.touches[0].clientY;
  } else {
    clientX = evt.clientX;
    clientY = evt.clientY;
  }
  const x = (clientX - rect.left) * (els.canvas.width / rect.width);
  const y = (clientY - rect.top) * (els.canvas.height / rect.height);
  return { x, y };
}

function pushUndo(){
  try{
    const url = els.canvas.toDataURL("image/png");
    state.draw.undo.push(url);
    if (state.draw.undo.length > 5) state.draw.undo.shift();
  } catch { /* ignore */ }
}

function undoStroke(){
  const t = getT();
  const prev = state.draw.undo.pop();
  if (!prev){
    toast(t.draw.toastUndoEmpty);
    return;
  }
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0,0,els.canvas.width, els.canvas.height);
    ctx.drawImage(img, 0, 0, els.canvas.width, els.canvas.height);
  };
  img.src = prev;
}

function clearCanvas(withToast){
  ctx.clearRect(0,0,els.canvas.width, els.canvas.height);
  state.draw.undo = [];
  if (withToast) toast(getT().draw.toastCleared);
}

function startStroke(evt){
  if (!state.drawPaintingId) return;
  if (evt.touches && evt.touches.length > 1) return;
  evt.preventDefault();
  drawing = true;
  pushUndo();
  last = getCanvasPoint(evt);
}

function moveStroke(evt){
  if (!drawing) return;
  if (evt.touches && evt.touches.length > 1) return;
  evt.preventDefault();
  const pt = getCanvasPoint(evt);
  drawLine(last, pt);
  last = pt;
}

function endStroke(){
  drawing = false;
  last = null;
}

function drawLine(a, b){
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = state.draw.size;
  if (state.draw.mode === "eraser"){
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = state.draw.color;
  }
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.restore();
}

function resizeCanvasToFrame(clear){
  const rect = els.stageFrame.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.floor(rect.width * dpr));
  const h = Math.max(1, Math.floor(rect.height * dpr));

  let snapshot = null;
  if (!clear){
    try{ snapshot = els.canvas.toDataURL("image/png"); } catch { snapshot = null; }
  }

  els.canvas.width = w;
  els.canvas.height = h;
  ctx.setTransform(1,0,0,1,0,0);

  if (clear){
    ctx.clearRect(0,0,w,h);
    state.draw.undo = [];
  } else if (snapshot){
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0,0,w,h);
      ctx.drawImage(img, 0, 0, w, h);
    };
    img.src = snapshot;
  }
}

async function exportCompositePng(){
  const p = paintings.find(x => x.id === state.drawPaintingId);
  if (!p) return null;
  const w = els.canvas.width;
  const h = els.canvas.height;
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const octx = out.getContext("2d");

  if (bgImg && bgImg.naturalWidth){
    const iw = bgImg.naturalWidth;
    const ih = bgImg.naturalHeight;
    const scale = Math.max(w / iw, h / ih);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (iw - sw) / 2;
    const sy = (ih - sh) / 2;
    octx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, w, h);
  } else {
    octx.fillStyle = "#111218";
    octx.fillRect(0,0,w,h);
  }

  octx.drawImage(els.canvas, 0, 0, w, h);
  try{
    return out.toDataURL("image/png");
  } catch {
    return null;
  }
}

async function saveToMyGallery(){
  const t = getT();
  const p = paintings.find(x => x.id === state.drawPaintingId);
  if (!p) return;
  const imageDataUrl = await exportCompositePng();
  if (!imageDataUrl) return;
  const items = loadMyGallery();
  items.push({
    id: uuidv4(),
    userId: state.userId,
    paintingId: p.id,
    paintingTitle: p.title.en,
    savedAt: Date.now(),
    imageDataUrl
  });
  saveMyGallery(items);
  toast(t.draw.toastSaved);
}

async function downloadPng(){
  const p = paintings.find(x => x.id === state.drawPaintingId);
  if (!p) return;
  const dataUrl = await exportCompositePng();
  if (!dataUrl) return;
  const a = document.createElement("a");
  const safe = (p.title.en || "drawing").replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g,"").toLowerCase();
  a.download = `museum-drawing-${safe}.png`;
  a.href = dataUrl;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function renderAll(){
  renderStaticText();
  renderGallery();
  if (els.guidePanel.classList.contains("show")) renderGuide();
  if (state.route === "my") renderMyGallery();
  if (state.drawPaintingId){
    const p = paintings.find(x => x.id === state.drawPaintingId);
    if (p){
      els.drawTitle.textContent = p.title[state.lang];
      els.drawSubtitle.textContent = getT().draw.subtitle(p.artist[state.lang], p.year);
      els.stageSig.textContent = p.signature || p.artist.en;
    }
    buildBrushSizes();
    buildEditTools();
    syncToolUI();
  }
}

function initIdentity(){
  let uid = localStorage.getItem(LS.userId);
  if (!uid){
    uid = uuidv4();
    localStorage.setItem(LS.userId, uid);
  }
  state.userId = uid;

  const lang = localStorage.getItem(LS.lang);
  state.lang = (lang === "cs" || lang === "en") ? lang : "en";
  document.documentElement.lang = state.lang === "cs" ? "cs" : "en";

  const uname = localStorage.getItem(LS.username);
  state.username = uname && uname.trim() ? uname.trim() : null;
}

// ─── events ───────────────────────────────────────────────────────────────────
els.langToggle.addEventListener("click", () => setLang(state.lang === "cs" ? "en" : "cs"));

for (const b of navButtons){
  b.addEventListener("click", () => {
    const route = b.dataset.route;
    location.hash = "#" + route;
  });
}

window.addEventListener("hashchange", () => {
  const r = routeFromHash();
  setRoute(r);
});

els.guideClose.addEventListener("click", closeGuide);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape"){
    if (els.drawOverlay.classList.contains("show")) closeDraw();
    else if (els.lightbox.classList.contains("show")) closeLightbox();
    else if (els.guidePanel.classList.contains("show")) closeGuide();
  }
});

els.welcomeBackdrop.addEventListener("click", (e) => {
  if (e.target === els.welcomeBackdrop) {}
});
els.welcomeSave.addEventListener("click", () => {
  const val = (els.nickInput.value || "").trim().slice(0,24);
  if (!val){
    els.nickInput.focus();
    els.nickInput.style.boxShadow = "var(--ring)";
    setTimeout(() => els.nickInput.style.boxShadow = "", 800);
    return;
  }
  state.username = val;
  localStorage.setItem(LS.username, val);
  closeWelcome();
  renderAll();
});
els.nickInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter"){
    e.preventDefault();
    els.welcomeSave.click();
  }
});

els.drawClose.addEventListener("click", closeDraw);
els.drawSave.addEventListener("click", async () => { await saveToMyGallery(); });
els.drawDownload.addEventListener("click", async () => { await downloadPng(); });

els.canvas.addEventListener("pointerdown", (e) => {
  els.canvas.setPointerCapture(e.pointerId);
  startStroke(e);
});
els.canvas.addEventListener("pointermove", moveStroke);
els.canvas.addEventListener("pointerup", endStroke);
els.canvas.addEventListener("pointercancel", endStroke);

els.canvas.addEventListener("touchstart", startStroke, { passive: false });
els.canvas.addEventListener("touchmove", moveStroke, { passive: false });
els.canvas.addEventListener("touchend", endStroke);

window.addEventListener("resize", () => {
  if (els.drawOverlay.classList.contains("show")){
    resizeCanvasToFrame(false);
  }
});

els.lightboxClose.addEventListener("click", closeLightbox);
els.lightbox.addEventListener("click", (e) => {
  if (e.target === els.lightbox) closeLightbox();
});
els.lightboxDelete.addEventListener("click", () => {
  if (!lightboxItemId) return;
  deleteSaved(lightboxItemId);
});

// ─── init ─────────────────────────────────────────────────────────────────────
initIdentity();
buildPalette();
renderAll();
setRoute(routeFromHash());

if (!state.username){
  openWelcome();
}
