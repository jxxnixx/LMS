const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations';
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// ── 장르별 시각 장면 ──────────────────────────────────────────────
const GENRE_VISUAL = {
  'NV-01': (t, c) => `romantic scene: ${c.slice(0,60)}. Specific visual: two figures across a rain-fogged café window, hands almost touching, scattered rose petals on wooden table, warm golden bokeh`,
  'NV-02': (t, c) => `fantasy scene: ${c.slice(0,60)}. Specific visual: enchanted ivy-covered bookshop at night, starry sky with shooting stars, lantern light on cobblestones, magical floating books`,
  'NV-03': (t, c) => `thriller scene: ${c.slice(0,60)}. Specific visual: rain-slicked dark alley, single streetlamp, coded diary pages with red markings, magnifying glass over clues, noir shadows`,
  'NV-04': (t, c) => `sci-fi scene: ${c.slice(0,60)}. Specific visual: memory data as glowing particles, futuristic city at dusk, holographic brain scan, binary rain`,
  'NV-05': (t, c) => `horror scene: ${c.slice(0,60)}. Specific visual: gothic mansion on stormy cliff, crimson-lit window, ancient twisted oak, ravens in moonlight`,
  'NV-06': (t, c) => `historical scene: ${c.slice(0,60)}. Specific visual: joseon-era rooftop cityscape, hanbok silhouette, lantern-lit night, aged spy tools, ink-wash atmosphere`,
  'NV-07': (t, c) => `literary scene: ${c.slice(0,60)}. Specific visual: lone figure on riverbank at dusk, overgrown village path, wildflowers, silver water reflections`,
  'LT-01': (t, c) => `poetry scene: ${c.slice(0,60)}. Visual: open book on mossy stone, sunlight through birch forest, golden dust motes, scattered petals`,
  'LT-02': (t, c) => `essay scene: ${c.slice(0,60)}. Visual: corner desk, steaming coffee, rain on window, handwritten journal, dried flowers, warm lamp glow`,
  'LT-03': (t, c) => `travel scene: ${c.slice(0,60)}. Visual: cobblestone European square at sunset, solo backpacker with worn map, golden hour light`,
  'LT-04': (t, c) => `diary scene: ${c.slice(0,60)}. Visual: aged leather diary with pressed flower, afternoon light through linen curtains, tea cup, pen on page`,
  'HU-01': (t, c) => `philosophy scene: ${c.slice(0,60)}. Visual: ancient Greek hall, candle illuminating scrolls and hourglass, golden ratio patterns, dramatic chiaroscuro`,
  'HU-02': (t, c) => `history scene: ${c.slice(0,60)}. Visual: layered maps and documents, compass, faded photographs, warm archival amber light`,
  'HU-03': (t, c) => `psychology scene: ${c.slice(0,60)}. Visual: two silhouetted heads, neural constellations between them, deep indigo and gold`,
  'HU-04': (t, c) => `spirituality scene: ${c.slice(0,60)}. Visual: golden light through temple canopy, incense smoke, lotus on still water`,
  'HU-05': (t, c) => `linguistics scene: ${c.slice(0,60)}. Visual: world scripts floating as luminous particles over twilight map, glowing language threads`,
  'SS-01': (t, c) => `economics scene: ${c.slice(0,60)}. Visual: aerial city financial district at night, glowing graph lines, coins flowing like water`,
  'SS-02': (t, c) => `business scene: ${c.slice(0,60)}. Visual: glass-walled startup office at golden hour, ascending arrow in light, team silhouettes`,
  'SS-03': (t, c) => `politics scene: ${c.slice(0,60)}. Visual: grand civic square, diverse silhouettes, light through dramatic clouds, monumental architecture`,
  'SS-04': (t, c) => `law scene: ${c.slice(0,60)}. Visual: marble courthouse, scales of justice glowing, open law volumes, majestic atmosphere`,
  'SC-01': (t, c) => `coding scene: ${c.slice(0,60)}. Visual: cascading luminous code, holographic circuit diagram, keyboard in cyan glow`,
  'SC-02': (t, c) => `AI scene: ${c.slice(0,60)}. Visual: humanoid AI built of light and data, neural network constellation, chrome and electric blue`,
  'SC-03': (t, c) => `math scene: ${c.slice(0,60)}. Visual: golden ratio spirals and fractal geometry in cosmic void, equations like constellations`,
  'SC-04': (t, c) => `science scene: ${c.slice(0,60)}. Visual: atom splitting into colorful particles against nebula, quantum to galactic scale`,
  'SC-05': (t, c) => `engineering scene: ${c.slice(0,60)}. Visual: intricate gears and EV internals in amber light, blueprint overlays, precision`,
  'ED-01': (t, c) => `elementary scene: ${c.slice(0,60)}. Visual: bright classroom, cheerful animal characters with pencils, rainbow alphabet blocks`,
  'ED-02': (t, c) => `middle school scene: ${c.slice(0,60)}. Visual: textbook radiating golden light, compass on graph paper, focused academic energy`,
  'ED-03': (t, c) => `high school scene: ${c.slice(0,60)}. Visual: student at lamp-lit desk, towering study books, determined late-night atmosphere`,
  'ED-04': (t, c) => `language scene: ${c.slice(0,60)}. Visual: globe with floating speech bubbles in many scripts, multilingual warmth`,
  'EX-01': (t, c) => `civil service scene: ${c.slice(0,60)}. Visual: sunrise over government building, exam papers with success stamp, determined ambition`,
  'EX-02': (t, c) => `IT cert scene: ${c.slice(0,60)}. Visual: holographic badge over keyboard, binary code rain, tech achievement atmosphere`,
  'EX-03': (t, c) => `language exam scene: ${c.slice(0,60)}. Visual: score sheet glowing like trophy, microphone, international achievement`,
  'EX-04': (t, c) => `professional cert scene: ${c.slice(0,60)}. Visual: architectural model on blueprint, real estate expertise and professionalism`,
  'EX-05': (t, c) => `finance cert scene: ${c.slice(0,60)}. Visual: ascending gold stock chart, elegant investment portfolio composition`,
  'SD-01': (t, c) => `motivation scene: ${c.slice(0,60)}. Visual: lone figure on mountaintop at pre-dawn, first light on horizon, new beginning`,
  'SD-02': (t, c) => `leadership scene: ${c.slice(0,60)}. Visual: team climbing illuminated peak, leader gesturing forward, summit light`,
  'SD-03': (t, c) => `productivity scene: ${c.slice(0,60)}. Visual: elegant hourglass with golden sand, overlapping calendar and clock`,
  'SD-04': (t, c) => `communication scene: ${c.slice(0,60)}. Visual: two hands reaching across bridge of warm light, golden connection threads`,
  'AR-01': (t, c) => `art scene: ${c.slice(0,60)}. Visual: sunlit studio, vivid brushstrokes mid-air, rich color palette, creative energy`,
  'AR-02': (t, c) => `music scene: ${c.slice(0,60)}. Visual: grand piano on spotlit stage, floating notes, velvet curtains, cinematic drama`,
  'AR-03': (t, c) => `cooking scene: ${c.slice(0,60)}. Visual: overhead flat-lay of beautiful ingredients, steam rising, golden kitchen light`,
  'AR-04': (t, c) => `travel scene: ${c.slice(0,60)}. Visual: vintage map with worn passport, compass, wanderlust and adventure`,
  'AR-05': (t, c) => `sports scene: ${c.slice(0,60)}. Visual: runner on misty mountain trail at dawn, breath vapor, golden sun through pines`,
  'KD-01': (t, c) => `children scene: ${c.slice(0,60)}. Visual: child riding giant cloud through candy-colored sky, whimsical joy`,
  'KD-02': (t, c) => `fairy tale scene: ${c.slice(0,60)}. Visual: young wizard opening glowing spell book in enchanted forest, fireflies and wonder`,
  'KD-03': (t, c) => `teen scene: ${c.slice(0,60)}. Visual: teenagers on rooftop at summer sunset, school uniforms, city panorama, bittersweet`,
  'KD-04': (t, c) => `educational manga scene: ${c.slice(0,60)}. Visual: dynamic comic-style historical figures, bold colors, educational energy`,
  'HE-01': (t, c) => `health scene: ${c.slice(0,60)}. Visual: lush garden with morning dew, colorful vegetables, sunlight through clean air`,
  'HE-02': (t, c) => `medical scene: ${c.slice(0,60)}. Visual: glowing human body silhouette in soft blue light, calm trustworthy medical aesthetic`,
  'HE-03': (t, c) => `fitness scene: ${c.slice(0,60)}. Visual: athlete mid-sprint in golden morning light, motion blur, raw triumphant energy`,
  'HE-04': (t, c) => `mental health scene: ${c.slice(0,60)}. Visual: serene figure meditating above clouds at sunrise, stillness and inner peace`,
};

// ── 장르 그룹별 하단 홍보문구 ─────────────────────────────────────
const BOTTOM_HOOKS = {
  NV: ['"한 번 펼치면 멈출 수 없는 이야기"', '"올해 가장 많이 울게 만든 소설"', '"읽는 내내 심장이 뛰었다"'],
  LT: ['"밑줄 긋고 싶은 문장이 가득한 책"', '"오래도록 곁에 두고 싶은 글들"', '"마음의 언어를 찾아준 책"'],
  HU: ['"읽고 나면 세상이 다르게 보인다"', '"생각의 깊이를 바꾸는 책"', '"지식인들이 손에서 놓지 못한 책"'],
  SS: ['"시대를 읽는 눈이 생겼다"', '"당신의 경제적 사고를 바꿀 책"', '"CEO들이 추천한 이유가 있다"'],
  SC: ['"미래를 먼저 보는 책"', '"이 시대 필독서"', '"전문가들이 극찬한 과학 교양서"'],
  ED: ['"개념이 완성되면 문제가 풀린다"', '"수험생 합격의 비결"', '"현직 교사가 추천하는 단 한 권"'],
  EX: ['"합격자들이 선택한 바로 그 교재"', '"이 책으로 시작해서 이 책으로 끝낸다"', '"기출 분석의 끝판왕"'],
  SD: ['"읽고 나서 당장 실천하게 되는 책"', '"5년 후의 나를 바꾸는 오늘의 선택"', '"100만 독자가 증명한 변화"'],
  AR: ['"삶에 즐거움을 더하는 책"', '"처음 시작하는 사람을 위한 완벽한 안내서"', '"취미가 특기가 되는 순간"'],
  KD: ['"아이와 함께 읽고 싶은 책"', '"상상력이 날개를 다는 이야기"', '"어른도 빠져드는 어린이 책"'],
  HE: ['"건강한 삶을 시작하는 첫 번째 책"', '"의사들이 가족에게 선물하는 책"', '"몸과 마음이 함께 건강해지는 방법"'],
};

function getHook(genreCode) {
  const prefix = genreCode.slice(0, 2);
  const set = BOTTOM_HOOKS[prefix] ?? BOTTOM_HOOKS.NV;
  return set[Math.floor(Math.random() * set.length)];
}

function buildPrompt(book) {
  const visualFn = GENRE_VISUAL[book.genreCode];
  const visualDesc = visualFn
    ? visualFn(book.title, book.content)
    : `atmospheric scene related to "${book.title}": ${book.content.slice(0, 80)}`;
  const hook = getHook(book.genreCode);

  return `Design a PROFESSIONAL KOREAN BOOK COVER in portrait format (2:3 ratio) that looks exactly like a real bestselling book sold in Korean bookstores (민음사/창비/문학동네 quality).

BOOK INFO:
• Title: "${book.title}"
• Author: "${book.author}"
• Story summary: ${book.content}

━━━ UPPER 65% — FULL-BLEED ILLUSTRATION ━━━
${visualDesc}

Make the scene HIGHLY SPECIFIC to this book's title and content. Include:
- Atmospheric, cinematic lighting with dramatic depth
- Specific story-relevant details and props from the content
- Rich color palette appropriate to the mood

TEXT LAYERED ON ILLUSTRATION:
• Upper area: thin decorative gold frame border → inside, the title "${book.title}" in large elegant Korean serif/calligraphy font, warm cream or gold color
• Below title frame: "— ${book.author} 지음 —" in smaller refined font with decorative dashes
• Optional: a short rotated vertical text on one side with a poetic phrase

━━━ LOWER 35% — PUBLISHER PANEL ━━━
Distinct background: aged kraft paper / warm linen texture (tan/cream tone)

Layout top-to-bottom:
① Large impactful hook quote in bold Korean serif:
   ${hook}
② One or two lines of smaller body text: evocative description of the book's emotional theme
③ A decorative visual element — choose ONE that fits the genre:
   • Ornate divider with small thematic icons (flowers, stars, compasses, etc.)
   • A short 3–5 line excerpt-style blurb in quotation marks
   • Two or three reviewer blurb badges (circular or rectangular, elegant)
④ Bottom strip: publisher "한국출판사" | ISBN area | small logo

━━━ MANDATORY DESIGN RULES ━━━
• Color: rich, saturated, cinematically graded — NOT flat or muted
• Typography: elegant, readable Korean fonts — gold/cream on dark illustration, dark on light panel
• The cover must feel PREMIUM and VISUALLY COMPELLING from a distance
• Sharp clean line between illustration and bottom panel`;
}

export async function generateCoverImage(book, quality = 'medium') {
  const prompt = buildPrompt(book);

  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      n: 1,
      size: '1024x1536',
      quality,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? '이미지 생성 실패');
  }

  const data = await res.json();
  return `data:image/png;base64,${data.data[0].b64_json}`;
}
