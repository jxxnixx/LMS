import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const envRaw = fs.readFileSync(path.join(ROOT, '.env'), 'utf-8');
const API_KEY = envRaw.match(/VITE_OPENAI_API_KEY=(.+)/)?.[1]?.trim();
if (!API_KEY) { console.error('.env에서 VITE_OPENAI_API_KEY를 찾을 수 없습니다.'); process.exit(1); }

const COVERS_DIR = path.join(ROOT, 'public', 'covers');
if (!fs.existsSync(COVERS_DIR)) fs.mkdirSync(COVERS_DIR, { recursive: true });

// ── 장르 그룹 분류 ──────────────────────────────────────────────────
function getGroup(code) {
  const p = code.slice(0, 2);
  if (p === 'NV') return 'novel';
  if (p === 'LT') return 'literary';
  if (p === 'HU') return 'humanities';
  if (p === 'SS') return 'business';
  if (p === 'SC') return 'tech';
  if (p === 'ED') return 'textbook';
  if (p === 'EX') return 'exam';
  if (p === 'SD') return 'selfhelp';
  if (p === 'AR') return 'lifestyle';
  if (p === 'KD') return 'children';
  if (p === 'HE') return 'health';
  return 'novel';
}

// ── 장르 그룹별 전체 표지 스타일 ────────────────────────────────────
const GROUP_STYLE = {
  novel: {
    cover: `Full-bleed CINEMATIC ILLUSTRATION — painterly, atmospheric, dramatic depth.
Color: Rich, dark, saturated (deep navy, forest, burgundy, or warm amber depending on subgenre).
Typography: Large decorative Korean calligraphy/serif in GOLD or CREAM color, ornamental rectangular frame around title.
Layout: Text overlay on upper portion of illustration. Author in smaller font below title with ◈ decorators.`,
    panel: `Aged KRAFT PAPER texture (warm tan/brown tone). Distinct from illustration above.`,
  },
  literary: {
    cover: `MINIMALIST design — large white or very pale cream background, lots of breathing room.
ONE delicate central element: a watercolor sketch, ink illustration, or single poetic object (flower, branch, window).
Color: Muted, soft palette — dusty rose, sage green, pale blue, or warm ivory.
Typography: Elegant thin Korean serif, centered, generous line spacing. Title in medium-large delicate font — NOT bold. Like 교보문고 bestselling essay collection.
Layout: Object in center or lower third, title above or below with wide margins. Very literary and refined.`,
    panel: `Clean WHITE or very pale cream background. Minimal decoration. Just text.`,
  },
  humanities: {
    cover: `EDITORIAL bold design — like a prestigious Korean non-fiction bestseller.
Strong geometric composition: bold color block (navy, burgundy, or forest green) taking 40% of cover, contrasting cream/white section.
OR: Simple powerful symbolic image (not complex scene) — a compass, globe, architectural detail.
Color: Two-tone strong contrast (deep navy + gold, burgundy + cream, charcoal + orange).
Typography: Bold modern Korean sans-serif or strong serif. Title is the visual focal point — very large.
Layout: Clean grid-based. Title dominates. Simple graphic element. Very 민음사 non-fiction quality.`,
    panel: `Cream or off-white background. Clean academic look.`,
  },
  business: {
    cover: `BOLD BUSINESS BOOK design — like Korean bestsellers '부의 추월차선', '원칙', '타이탄의 도구들'.
Strong saturated background (deep navy, vivid red, bold orange, or forest green — full cover).
Simple bold graphic: upward arrow, city silhouette, abstract growth symbol, or single powerful icon.
Color: ONE dominant bold color as full background with white/gold typography.
Typography: VERY LARGE bold Korean sans-serif for title — takes up 50%+ of cover. Author small below.
Layout: Minimal. Title text IS the design. Maximum impact, minimum elements.`,
    panel: `Same bold background color as cover upper section continues, OR contrasting light strip.`,
  },
  tech: {
    cover: `TECH/SCI book design — dark background with luminous technical details.
Dark navy or charcoal background. Glowing circuit patterns, code streams, data visualization, or tech schematic as illustration.
Color: Dark (#0a0a1a to #1a2040) background with electric BLUE, CYAN, or ORANGE accent glows.
Typography: Clean modern Korean sans-serif, white or electric-blue title text. Very crisp.
Layout: Technical diagram or visualization fills background. Title overlaid cleanly. Very '한빛미디어', 'O'Reilly Korean edition' quality.`,
    panel: `Dark (#12172a) background continuing from cover. Tech grid lines pattern.`,
  },
  textbook: {
    cover: `TEXTBOOK/REFERENCE design — clean, organized, educational.
Bold COLOR HEADER BAND (30% of top): solid bright blue, green, or subject-appropriate color.
Clean white or light gray body.
Simple relevant icon or diagram in center.
Color: Subject color (blue for math/science, green for language, orange for social studies) + clean white.
Typography: Clear readable Korean font. Subject name in header band in white. Title clearly below. Very organized hierarchy.
Layout: Header band → title area → simple graphic → clean organized body. Like Korean 참고서.`,
    panel: `Clean white background. Organized table-of-contents style or chapter preview.`,
  },
  exam: {
    cover: `EXAM PREP book design — bold, urgent, achievement-focused. Like '에듀윌', '해커스', '공단기'.
BOLD RED or DEEP BLUE as dominant color (full cover or large header band).
"합격" / "완성" / "기출" type energy in the design.
Large confident title typography. Possibly a ribbon or seal graphic.
Color: Red (#c0392b) or Navy (#1a3a5c) dominant, gold/white accent.
Typography: Bold, confident, slightly aggressive Korean font. Urgency in the design.
Layout: Strong header, clear title hierarchy, possibly test-paper/grid texture elements.`,
    panel: `Bold color matching upper cover. Or contrasting white band with red accents.`,
  },
  selfhelp: {
    cover: `SELF-HELP / MOTIVATIONAL book design — like '미라클 모닝', '아침의 루틴', '원씽'.
BRIGHT energetic background: bold orange, warm yellow, vibrant coral, or energetic teal.
Human silhouette reaching upward, mountain summit, sunrise, or powerful symbolic gesture.
Color: Bright warm colors (orange #e67e22, yellow #f1c40f, coral #e74c3c) — full cover, VIBRANT.
Typography: VERY BOLD Korean sans-serif. Large impactful title. White or dark text with maximum contrast.
Layout: Person/symbol in scene, large title text overlay. Very '미국 self-help book' translated to Korean style.`,
    panel: `Matching bright color from cover, or contrasting cream with warm accent color.`,
  },
  lifestyle: {
    cover: `LIFESTYLE / HOBBY book design — like a beautiful magazine cover. Warm, inviting, aesthetic.
Photography-quality illustration: warm natural lighting, beautiful composition of relevant subject matter.
Color: Warm naturals — terracotta, sage green, warm beige, golden hour tones. NOT dark.
Typography: Elegant serif mixed with thin sans-serif. Warm cream or white title. Refined layout.
Layout: Beautiful full-bleed photography-style image. Tasteful text overlay. Very 'lifestyle magazine' quality — Kinfolk aesthetic.`,
    panel: `Warm cream/linen texture. Warm and inviting.`,
  },
  children: {
    cover: `CHILDREN'S BOOK design — bright, joyful, illustrated characters.
For KD-01/02: Colorful cartoon-style illustration, friendly round characters, bright primary colors.
For KD-03 (teen): More sophisticated — could be illustrated or photographic style, still colorful but cooler tones.
For KD-04: Comic/manga panel style elements, dynamic action.
Color: Bright, saturated primary colors (red, blue, yellow, green) — very HIGH SATURATION and CONTRAST. Joyful.
Typography: Round, playful Korean font for younger books. Slightly more grown-up for teen books.
Layout: Large expressive character or scene fills cover. Title in big playful font. Very '비룡소', '시공주니어' quality.`,
    panel: `Bright matching color from cover. Playful and fun.`,
  },
  health: {
    cover: `HEALTH / WELLNESS book design — clean, natural, trustworthy. Like Korean 건강 베스트셀러.
Clean, airy design. Natural imagery: fresh vegetables, outdoor activity, clean body, nature.
Color: Fresh GREEN (#27ae60), clean WHITE, calm BLUE (#2980b9), or warm SAGE — NOT dark.
Typography: Clean modern Korean serif or sans-serif. Trustworthy, clear, readable. No decorative flourishes.
Layout: Clean photography-style composition. Possibly split layout (image top, info bottom). Very trustworthy medical/wellness aesthetic.`,
    panel: `Clean white or very light green/blue background. Medical/wellness trustworthy feel.`,
  },
};

// ── 장르별 핵심 장면 묘사 ─────────────────────────────────────────────
const GENRE_SCENE = {
  'NV-01': (t, c) => `Romantic scene inspired by "${t}": ${c.slice(0,50)}. Visual: two figures in warm rain-soaked café, hands almost touching across wooden table, fogged windows, scattered petals, golden light`,
  'NV-02': (t, c) => `Fantasy scene inspired by "${t}": ${c.slice(0,50)}. Visual: enchanted ivy-covered bookshop at night, starry sky with shooting stars, warm lantern glow on cobblestones, magical floating books with glowing spines`,
  'NV-03': (t, c) => `Thriller scene inspired by "${t}": ${c.slice(0,50)}. Visual: rain-slicked dark alley, flickering streetlamp, scattered cipher diary pages, magnifying glass revealing clues, deep noir shadows`,
  'NV-04': (t, c) => `Sci-fi scene inspired by "${t}": ${c.slice(0,50)}. Visual: memory data as glowing particles, holographic brain scan, futuristic city at purple dusk, binary rain cascading`,
  'NV-05': (t, c) => `Horror scene inspired by "${t}": ${c.slice(0,50)}. Visual: gothic mansion on storm cliff, one crimson-lit window, gnarled ancient oak, ravens silhouetted against lightning`,
  'NV-06': (t, c) => `Historical scene inspired by "${t}": ${c.slice(0,50)}. Visual: joseon-era rooftop cityscape at night, hanbok silhouette, lantern-lit alley, aged letter and espionage tools, ink-wash atmosphere`,
  'NV-07': (t, c) => `Literary scene inspired by "${t}": ${c.slice(0,50)}. Visual: lone figure on silver river bank at dusk, wildflowers, overgrown village path, deeply melancholic beauty`,
  'LT-01': (t, c) => `Single delicate watercolor illustration: an open poetry book on mossy stone, birch forest, golden light shafts through leaves, scattered petals — minimal, airy, poetic`,
  'LT-02': (t, c) => `Single intimate illustration: corner desk with steaming coffee mug, rain-streaked window, handwritten journal open, dried flower pressed between pages, warm single lamp glow`,
  'LT-03': (t, c) => `Single travel illustration: worn leather travel journal open to a hand-drawn map, vintage stamps, small compass, pressed tickets, wanderlust feeling`,
  'LT-04': (t, c) => `Single delicate illustration: aged diary lying open, pressed flower inside, afternoon light through lace curtains, fountain pen resting on page`,
  'HU-01': (t, c) => `Bold symbolic image: single candle flame casting dramatic shadows on ancient philosophical scrolls, golden ratio spiral pattern, marble texture — powerful and minimal`,
  'HU-02': (t, c) => `Bold symbolic image: layered antique maps overlapping, old compass, magnifying glass, warm amber archival light — authoritative and rich`,
  'HU-03': (t, c) => `Bold symbolic image: two silhouette heads facing each other with neural constellation lines connecting them — deep indigo blue and gold, surreal but clean`,
  'HU-04': (t, c) => `Bold symbolic image: single lotus floating on perfectly still dark water, golden light ray from above, profound stillness and spirituality`,
  'HU-05': (t, c) => `Bold symbolic image: letters from world writing systems (Korean, Arabic, Chinese, Latin) floating as golden particles forming a globe shape`,
  'SS-01': (t, c) => `Simple bold icon on strong background: minimalist rising graph/arrow, city silhouette, coins and currency symbols — powerful and direct`,
  'SS-02': (t, c) => `Simple bold icon: single rocket or arrow pointing up, or chess piece (king), on solid bold background — entrepreneurial energy`,
  'SS-03': (t, c) => `Simple bold icon: balance scales, or civic building silhouette, or crowd silhouette — authoritative and democratic`,
  'SS-04': (t, c) => `Simple bold icon: balance scales of justice, open law book, marble column detail — dignified and authoritative`,
  'SC-01': (t, c) => `Dark tech background: cascading luminous code lines, holographic circuit board patterns, glowing blue/cyan keyboard — very clean and technical`,
  'SC-02': (t, c) => `Dark tech background: AI neural network visualization as light constellation, humanoid silhouette made of data particles, electric blue and chrome`,
  'SC-03': (t, c) => `Dark cosmic background: golden ratio spiral and fractal geometry, mathematical equations written in light, cosmic mathematical beauty`,
  'SC-04': (t, c) => `Dark cosmic background: atom structure exploding into subparticles, nebula backdrop, scale from quantum to galactic — spectacular and vivid`,
  'SC-05': (t, c) => `Dark industrial background: intricate mechanical gears, electric vehicle internals in amber light, engineering blueprint overlay patterns`,
  'ED-01': (t, c) => `Bright educational image: colorful alphabet blocks, cheerful cartoon animal characters studying together, rainbow stationery, very bright and encouraging`,
  'ED-02': (t, c) => `Clean educational image: open textbook with glowing mathematical formulas, precise compass and ruler on graph paper, focused academic energy`,
  'ED-03': (t, c) => `Dramatic study image: student silhouette at desk with single lamp in dark room, towering stack of books, determined focus, late-night energy`,
  'ED-04': (t, c) => `Bright language image: globe surrounded by speech bubbles in multiple scripts, friendly world map, diverse language symbols`,
  'EX-01': (t, c) => `Confident achievement image: sunrise over government building, official seal or stamp, exam papers with "합격" stamp, ambitious morning light`,
  'EX-02': (t, c) => `Tech achievement image: holographic certification badge, computer screen with code, IT achievement visual, confident and professional`,
  'EX-03': (t, c) => `Language achievement image: score report glowing like trophy, headphones and microphone, international flags, test achievement moment`,
  'EX-04': (t, c) => `Professional image: architectural scale model on blueprint, real estate documents, professional expertise visual`,
  'EX-05': (t, c) => `Financial image: gold coins stacked, ascending stock chart, investment portfolio, Wall Street-inspired Korean finance visual`,
  'SD-01': (t, c) => `Motivational scene: lone figure silhouette on mountaintop reaching toward first light at pre-dawn, symbolic of new beginning and ambition`,
  'SD-02': (t, c) => `Leadership scene: team of silhouettes climbing illuminated path together, leader at front with gesture forward, summit light ahead`,
  'SD-03': (t, c) => `Productivity scene: elegant hourglass with golden sand flowing, overlapping clock and calendar, bright morning light — mastery of time`,
  'SD-04': (t, c) => `Communication scene: two warm hands reaching toward each other across a glowing bridge, threads of golden light connecting them`,
  'AR-01': (t, c) => `Warm lifestyle image: sunlit art studio, colorful brushstrokes on canvas, scattered paints and palette, warm creative atmosphere`,
  'AR-02': (t, c) => `Warm lifestyle image: grand piano in soft spotlight, floating musical notes, velvet concert hall atmosphere, beautiful and dramatic`,
  'AR-03': (t, c) => `Beautiful food image: overhead flat-lay of fresh colorful ingredients on rustic wood, steam rising from dish, golden kitchen light, culinary artistry`,
  'AR-04': (t, c) => `Travel lifestyle image: vintage world map with worn passport, tickets, compass, postcards, wanderlust and adventure — warm earthy tones`,
  'AR-05': (t, c) => `Athletic lifestyle image: runner on misty mountain trail at dawn, breath vapor in cold air, golden sun breaking through pines, pure athletic spirit`,
  'KD-01': (t, c) => `Joyful children's illustration: small round child character riding giant smiling cloud through candy-colored sky, rainbow colors, pure happiness`,
  'KD-02': (t, c) => `Magical children's illustration: young wizard child opening glowing spell book in enchanted forest, friendly firefly creatures, wonder and magic`,
  'KD-03': (t, c) => `Teen illustration: two teenagers on rooftop at summer sunset, school uniforms, city panorama below, bittersweet coming-of-age mood`,
  'KD-04': (t, c) => `Dynamic manga-style illustration: Korean historical figures in bold action poses, speed lines, dynamic composition, educational fun`,
  'HE-01': (t, c) => `Fresh wellness image: lush vegetable garden at morning with dew drops, colorful produce, clean sunlight through fresh air, vitality and health`,
  'HE-02': (t, c) => `Clean medical image: soft glowing human body silhouette in gentle blue light, clean clinical aesthetic, calm and trustworthy`,
  'HE-03': (t, c) => `Dynamic fitness image: athlete mid-sprint on scenic trail, motion blur, golden morning light explosion, raw triumphant energy`,
  'HE-04': (t, c) => `Serene wellness image: figure meditating on cliff above clouds at sunrise, perfect stillness, mental clarity, peaceful morning light`,
};

// ── 하단 패널 6종 (book.id % 6 으로 순환) ─────────────────────────
const PANEL_TYPES = [
  // 0 — 인용구 스타일
  (book, group) => `
BOTTOM PANEL — REVIEW QUOTE STYLE:
- Opening large decorative quotation mark graphic
- Main quote (2 lines, bold Korean serif): a compelling 20-character emotional statement about the book's theme
- Attribution line: "— ○○일보 문화부 기자" or "— 독자 리뷰 중에서"
- Thin decorative horizontal divider line
- Publisher: "한국출판사" small at bottom right`,

  // 1 — 수상/추천 배지 스타일
  (book, group) => {
    const badges = {
      novel:    ['이달의\n소설상', '독자들의\n강력 추천', '서점 직원\nBEST PICK'],
      literary: ['문학계\n주목작', '에세이\n올해의 책', '서점 직원\n추천도서'],
      humanities:['지식인 선정\n올해의 책', '교보문고\n인문 1위', '독자 평점\n★★★★★'],
      business: ['CEO 필독서', '비즈니스\n베스트셀러', '경영인이\n선택한 책'],
      tech:     ['개발자\n필독서', '기술 도서\n이달의 1위', 'IT 전문가\n강력 추천'],
      textbook: ['현직 교사\n강력 추천', '학생 만족도\n1위', '학교 교재\n채택 도서'],
      exam:     ['합격자\n선택 교재', '기출 분석\n완벽 반영', '강사 추천\n1위 교재'],
      selfhelp: ['독자 평점\n9.8/10', '100만 부\n돌파 기념판', '유튜버들이\n추천한 책'],
      lifestyle:['라이프스타일\n베스트', '취미 도서\n이달의 추천', '독자들의\n사랑을 받는 책'],
      children: ['어린이\n독후감 대회 추천', '학교 도서관\n추천 도서', '부모가\n먼저 읽은 책'],
      health:   ['의사가\n추천하는 책', '건강 도서\n베스트셀러', '독자 만족도\n★★★★★'],
    };
    const set = badges[group] ?? badges.novel;
    return `
BOTTOM PANEL — AWARD BADGES STYLE:
- Three circular or ribbon-shaped badge/medallion graphics side by side
  Left badge: "${set[0]}" (wreath border, gold/warm tones)
  Center badge: "${set[1]}" (slightly larger, most prominent)
  Right badge: "${set[2]}" (wreath border)
- Each badge has ornate border and text inside
- Publisher: "한국출판사" small text at very bottom`;
  },

  // 2 — 판매 통계/베스트셀러 강조
  (book, group) => `
BOTTOM PANEL — BESTSELLER STATS STYLE:
- Large bold text: "출간 즉시 베스트셀러" or "종합 베스트 1위"
- Bold number statistics: "독자 리뷰 ★ 4.9" and "누적 판매 3만 부"
- Clean horizontal divider
- Smaller text: "이 책을 읽은 독자들이 추천하는 이유"
- Publisher: "한국출판사" at bottom`,

  // 3 — 홍보 카피 + 소개
  (book, group) => {
    const copies = {
      novel:    `"한 번 펼치면 내려놓을 수 없는\n바로 그 이야기"`,
      literary: `"읽고 나서 오래도록\n마음에 남는 글들"`,
      humanities:`"이 책 한 권으로\n세상을 보는 눈이 달라진다"`,
      business: `"성공한 사람들이\n반드시 거쳐간 단 한 권"`,
      tech:     `"미래를 먼저 읽고 싶다면\n이 책부터 시작하라"`,
      textbook: `"개념을 잡으면\n문제가 보인다"`,
      exam:     `"합격의 시작은\n기출문제 분석이다"`,
      selfhelp: `"지금 당장 실천할 수 있는\n단 하나의 방법"`,
      lifestyle:`"삶에 취미가 더해지면\n전혀 다른 하루가 시작된다"`,
      children: `"아이의 상상력에\n날개를 달아주는 이야기"`,
      health:   `"건강한 내일은\n오늘의 작은 선택에서 시작된다"`,
    };
    const copy = copies[group] ?? copies.novel;
    return `
BOTTOM PANEL — MARKETING COPY STYLE:
- Large impactful Korean serif quote (2 lines):
  ${copy}
- Smaller text below: 2-line book description or emotional tagline
- Small decorative element (5-pointed star cluster, or ornate divider with tiny icons related to genre)
- Publisher: "한국출판사" at bottom`;
  },

  // 4 — 저자 소개/약력
  (book, group) => {
    const creds = {
      novel:    '등단 후 문학 3개 상 수상한 소설가',
      literary: '시인, 에세이스트 — 여러 문학상 수상',
      humanities:'인문학 연구자, 대학교 강사',
      business: 'MBA 출신 경영 컨설턴트, 스타트업 창업자',
      tech:     '소프트웨어 엔지니어, 기술 저술가',
      textbook: '현직 교사, 교육청 인정 우수 강사',
      exam:     '10년 경력 합격 전문 강사',
      selfhelp: '라이프 코치, 심리상담사',
      lifestyle:'라이프스타일 에디터, 취미 전문 작가',
      children: '어린이 문학 작가, 그림책 일러스트레이터',
      health:   '내과 전문의, 건강 칼럼니스트',
    };
    const cred = creds[group] ?? creds.novel;
    return `
BOTTOM PANEL — AUTHOR BIO STYLE:
- "저자 소개" small header text
- Author name "${book.author}" in larger elegant font
- One credential line: "${cred}"
- Short 2-line author description about their background and why they wrote this book
- Thin decorative separator
- Publisher: "한국출판사" at bottom`;
  },

  // 5 — 본문 발췌
  (book, group) => `
BOTTOM PANEL — EXCERPT BLURB STYLE:
- Decorative large italic quotation mark
- 3-4 lines of body text styled like a book excerpt (smaller serif font):
  An evocative passage describing the essence of "${book.title}" — poetic and compelling
- Page number reference: "— p.127 —" in small text
- Thin ornate horizontal rule divider
- Publisher: "한국출판사" | Small decorative publisher logo placeholder`,
];

// ── 프롬프트 빌더 ─────────────────────────────────────────────────────
function buildPrompt(book) {
  const group = getGroup(book.genreCode);
  const style = GROUP_STYLE[group] ?? GROUP_STYLE.novel;
  const sceneFn = GENRE_SCENE[book.genreCode];
  const scene = sceneFn
    ? sceneFn(book.title, book.content)
    : `scene related to "${book.title}": ${book.content.slice(0, 60)}`;
  const panelFn = PANEL_TYPES[book.id % PANEL_TYPES.length];
  const panel = typeof panelFn === 'function' ? panelFn(book, group) : panelFn;

  return `Create a PROFESSIONAL KOREAN BOOK COVER in portrait format (2:3 ratio).
This MUST match the visual genre conventions of real Korean published books.

━━━ BOOK INFO ━━━
Title: "${book.title}"
Author: "${book.author}"
Summary: ${book.content}

━━━ COVER STYLE (strictly follow this genre's visual language) ━━━
${style.cover}

━━━ MAIN VISUAL CONTENT (upper 65%) ━━━
${scene}

━━━ TITLE TEXT TREATMENT ━━━
Display title "${book.title}" prominently on cover in style matching the genre above.
Display author "${book.author}" smaller, below or near title.

━━━ BOTTOM PANEL (lower 35%) ━━━
Background: ${style.panel}
${panel}

━━━ CRITICAL RULES ━━━
- This must look EXACTLY like a book from that genre that you would see in a Korean bookstore
- DO NOT make everything look like a dark literary novel — respect the genre visual language
- Color and composition must match the GROUP STYLE specified above
- Professional print quality, sharp and detailed`;
}

async function generateImage(book, quality) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: 'gpt-image-1', prompt: buildPrompt(book), n: 1, size: '1024x1536', quality }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message ?? '실패'); }
  const data = await res.json();
  return data.data[0].b64_json;
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const quality = (args.find(a => a.startsWith('--quality='))?.split('=')[1]) ?? 'medium';

  if (!['low', 'medium', 'high'].includes(quality)) {
    console.error('품질은 low / medium / high 중 하나여야 합니다.'); process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(path.join(ROOT, 'db.json'), 'utf-8'));
  const targets = force ? db.books : db.books.filter(b => !b.coverImageUrl);

  console.log(`\n📚 ${force ? '전체(재생성)' : '미생성'} ${targets.length}권 | 품질: ${quality}\n`);
  if (targets.length === 0) { console.log('✅ 모든 도서에 표지가 있습니다. 재생성: --force'); return; }

  for (let i = 0; i < targets.length; i++) {
    const book = targets[i];
    const group = getGroup(book.genreCode);
    process.stdout.write(`[${i + 1}/${targets.length}] "${book.title}" (${group}) ... `);
    try {
      const b64 = await generateImage(book, quality);
      const filename = `${book.id}.png`;
      fs.writeFileSync(path.join(COVERS_DIR, filename), Buffer.from(b64, 'base64'));
      const idx = db.books.findIndex(b => b.id === book.id);
      db.books[idx].coverImageUrl = `/covers/${filename}`;
      fs.writeFileSync(path.join(ROOT, 'db.json'), JSON.stringify(db, null, 2));
      console.log('✓');
    } catch (err) {
      console.log(`✗ ${err.message}`);
    }
    if (i < targets.length - 1) {
      process.stdout.write('  ⏱ 5초 대기...\r');
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  console.log('\n✅ 완료!');
}

main();
