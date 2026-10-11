const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const CDN_PREFIX = 'https://cdn.jsdelivr.net/gh/thepankajzx/Folio-84@main/';

// Metadata for all niches & their items with realistic mediocre creator metrics
const nicheCatalog = {
  'education': {
    name: 'Education',
    count: 8,
    isCarousel: true,
    aspect: 'aspect-video',
    cardWidth: 'w-[280px] sm:w-[340px] md:w-[380px]',
    items: [
      {
        img: 'assets/images/education/edu-my-first-book.webp',
        title: 'My First Book // SSC History',
        badge: 'EDTECH · BOOK LAUNCH',
        badgeClass: 'bg-amber-500/15 text-amber-400',
        ratio: '16:9 4K',
        desc: 'Curiosity-driven spotlight staging with velvet drape reveal and rapid revision hooks.',
        metrics: [
          { label: 'Click-Through Rate', value: '9.4% CTR', note: 'Strong browse CTR' },
          { label: 'Views Generated', value: '142K Views', note: 'First 14 days' },
          { label: 'Subscribers Added', value: '+1.8K Subs', note: 'High conversion' },
          { label: 'Watch Time (AVD)', value: '42.6%', note: '+6.2% retention' }
        ]
      },
      {
        img: 'assets/images/education/edu-big-billion-sale.webp',
        title: 'Big Billion Sale // 5.0 Launch',
        badge: 'COURSE · HIGH CONVERSION',
        badgeClass: 'bg-rose-500/15 text-rose-400',
        ratio: '16:9 4K',
        desc: 'Festive flash sale packaging with 3D gold typography and unboxed study material bundle.',
        metrics: [
          { label: 'Click-Through Rate', value: '11.8% CTR', note: 'Peak flash CTR' },
          { label: 'Views Generated', value: '195K Views', note: 'Offer period' },
          { label: 'Course Enrolments', value: '+34% Lift', note: 'vs previous sale' },
          { label: 'Conversion Rate', value: '6.8%', note: 'Landing page click' }
        ]
      },
      {
        img: 'assets/images/education/edu-alpha-2027-launch.webp',
        title: 'Alpha 2027 // Transformation',
        badge: 'STORYTELLING · VIRAL CTR',
        badgeClass: 'bg-emerald-500/15 text-emerald-400',
        ratio: '16:9 4K',
        desc: 'Split-screen emotional contrast driving massive empathy and click-through curiosity.',
        metrics: [
          { label: 'Click-Through Rate', value: '12.4% CTR', note: 'Viral story hook' },
          { label: 'Views Generated', value: '240K Views', note: 'Organic reach' },
          { label: 'Subscribers Added', value: '+3.1K Subs', note: 'Aspirational reach' },
          { label: 'Viewer Retention', value: '46.1%', note: '+11% over benchmark' }
        ]
      },
      {
        img: 'assets/images/education/edu-mindmap-boat-stream.webp',
        title: 'Boat & Stream // Mindmap',
        badge: 'MATHS · EPISODE 7',
        badgeClass: 'bg-cyan-500/15 text-cyan-400',
        ratio: '16:9 4K',
        desc: 'Visual physics breakdown paired with textbook branding for instant concept mastery.',
        metrics: [
          { label: 'Click-Through Rate', value: '8.2% CTR', note: 'Search & Suggest' },
          { label: 'Views Generated', value: '88K Views', note: 'Evergreen topic' },
          { label: 'Subscribers Added', value: '+920 Subs', note: 'Revision cohort' },
          { label: 'Watch Time', value: '51.3%', note: 'Concept mastery' }
        ]
      },
      {
        img: 'assets/images/education/edu-mindmap-geometry-circle.webp',
        title: 'Geometry Circle // Viren Sir',
        badge: 'GEOMETRY · 30-DAY CRASH',
        badgeClass: 'bg-sky-500/15 text-sky-400',
        ratio: '16:9 4K',
        desc: 'High-retention typographic hierarchy engineered for competitive exam crash courses.',
        metrics: [
          { label: 'Click-Through Rate', value: '8.9% CTR', note: 'Crash course series' },
          { label: 'Views Generated', value: '110K Views', note: '30-day exam sprint' },
          { label: 'Subscribers Added', value: '+1.2K Subs', note: 'Targeted students' },
          { label: 'Watch Time', value: '48.0%', note: 'High completion' }
        ]
      },
      {
        img: 'assets/images/education/edu-mindmap-ratio-proportion.webp',
        title: 'Ratio & Proportion // Mindmap',
        badge: 'ARITHMETIC · EPISODE 10',
        badgeClass: 'bg-lime-500/15 text-lime-400',
        ratio: '16:9 4K',
        desc: 'Clean modular layout combining book endorsement with urgent exam syllabus completion.',
        metrics: [
          { label: 'Click-Through Rate', value: '7.8% CTR', note: 'Steady search CTR' },
          { label: 'Views Generated', value: '76K Views', note: 'Series episode 10' },
          { label: 'Subscribers Added', value: '+840 Subs', note: 'Core audience' },
          { label: 'Watch Time', value: '49.5%', note: 'Consistent engagement' }
        ]
      },
      {
        img: 'assets/images/education/edu-sudarshana-series-launch.webp',
        title: 'Sudarshana Series // Lecture 2',
        badge: 'SPECIAL · 100 CONCEPTS',
        badgeClass: 'bg-yellow-500/15 text-yellow-400',
        ratio: '16:9 4K',
        desc: 'Iconic golden wheel motif symbolizing complete syllabus mastery and high retention.',
        metrics: [
          { label: 'Click-Through Rate', value: '10.4% CTR', note: 'Flagship brand hook' },
          { label: 'Views Generated', value: '165K Views', note: '100 Golden Concepts' },
          { label: 'Subscribers Added', value: '+2.4K Subs', note: 'Series followers' },
          { label: 'Viewer Retention', value: '44.8%', note: '+8% playlist watch' }
        ]
      },
      {
        img: 'assets/images/education/edu-ssc-cgl-notification-out.webp',
        title: 'SSC CGL 2026 // Big Changes',
        badge: 'BREAKING NEWS · URGENCY',
        badgeClass: 'bg-red-500/15 text-red-400',
        ratio: '16:9 4K',
        desc: 'Instant-action alert framing with official document proof and tripartite breakdown badges.',
        metrics: [
          { label: 'Click-Through Rate', value: '13.1% CTR', note: 'Breaking news spike' },
          { label: 'Views Generated', value: '310K Views', note: '48-hour surge' },
          { label: 'Subscribers Added', value: '+4.2K Subs', note: 'New aspirant inflow' },
          { label: 'Share Rate', value: '3.8%', note: 'Telegram & WhatsApp' }
        ]
      }
    ]
  },

  'album-covers': {
    name: 'Album Covers',
    count: 6,
    isCarousel: true,
    aspect: 'aspect-square',
    cardWidth: 'w-[220px] sm:w-[250px] md:w-[270px]',
    items: [
      {
        img: 'assets/images/album-covers/album-fuck-em-all.webp',
        title: 'Fuck \'Em All // Ankit Dhiman',
        badge: 'TRENDING · SPOTIFY #1',
        badgeClass: 'bg-rose-500/15 text-rose-400',
        ratio: '1:1 Master',
        desc: 'High-energy album packaging featuring skull flame typography and explicit parental advisory layout.',
        metrics: [
          { label: 'Spotify Streams', value: '420K Streams', note: 'All-time plays' },
          { label: 'Playlist Adds', value: '68 Playlists', note: 'User & Editorial' },
          { label: 'Save-to-Stream', value: '28.4% Save Rate', note: 'Above hip-hop avg' },
          { label: 'Artist Followers', value: '+6.2K Follows', note: 'Profile conversions' }
        ]
      },
      {
        img: 'assets/images/album-covers/album-rebirth.webp',
        title: 'Rebirth // Ankit Dhiman',
        badge: 'ALBUM · SPOTIFY #1',
        badgeClass: 'bg-red-500/15 text-red-400',
        ratio: '1:1 Master',
        desc: 'Hyper-saturated electric skull visual hierarchy engineered for dark mode streaming platforms.',
        metrics: [
          { label: 'Spotify Streams', value: '310K Streams', note: 'First 60 days' },
          { label: 'Playlist Adds', value: '44 Playlists', note: 'Underground rap' },
          { label: 'Save-to-Stream', value: '24.1% Save Rate', note: 'Solid repeat plays' },
          { label: 'Monthly Listeners', value: '+14.5K Peak', note: 'Release month' }
        ]
      },
      {
        img: 'assets/images/album-covers/album-santaflow.webp',
        title: 'Santaflow // Ankit Dhiman',
        badge: 'VIRAL · SPOTIFY #1',
        badgeClass: 'bg-emerald-500/15 text-emerald-400',
        ratio: '1:1 Master',
        desc: 'Vibrant acid-green calavera portrait composition with distressed grunge typography.',
        metrics: [
          { label: 'Spotify Streams', value: '280K Streams', note: 'Organic catalog' },
          { label: 'Discover Weekly', value: '18% Discovery', note: 'Algorithm pickup' },
          { label: 'Save-to-Stream', value: '22.8% Save Rate', note: 'Targeted listeners' },
          { label: 'Monthly Listeners', value: '+11.2K Growth', note: 'New listeners' }
        ]
      },
      {
        img: 'assets/images/album-covers/album-badass.webp',
        title: 'Badass // Ankit Dhiman',
        badge: 'HIP-HOP · SPOTIFY #1',
        badgeClass: 'bg-red-500/15 text-red-400',
        ratio: '1:1 Master',
        desc: 'Underground drill/trap cover art with bucket hat, balaclava detail and textured distress.',
        metrics: [
          { label: 'Spotify Streams', value: '365K Streams', note: 'Drill category' },
          { label: 'Playlist Adds', value: '52 Playlists', note: 'Gym & Drill mixes' },
          { label: 'Save-to-Stream', value: '26.2% Save Rate', note: 'High replay value' },
          { label: 'Social Audio Uses', value: '1.8K Reels', note: 'Short-form audio' }
        ]
      },
      {
        img: 'assets/images/album-covers/album-habibi-lips.webp',
        title: 'Habibi (Lips) // Ankit Dhiman',
        badge: 'SINGLE · TRENDING',
        badgeClass: 'bg-pink-500/15 text-pink-400',
        ratio: '1:1 Master',
        desc: 'Sensory hyper-realistic lip illustration with gothic cassette nostalgia and media player controls.',
        metrics: [
          { label: 'Spotify Streams', value: '510K Streams', note: 'Trending single' },
          { label: 'Instagram UGC', value: '3.4K Reels', note: 'Viral aesthetic tag' },
          { label: 'Save-to-Stream', value: '31.5% Save Rate', note: 'Top tier engagement' },
          { label: 'Artist Followers', value: '+8.4K Follows', note: 'Cross-platform growth' }
        ]
      },
      {
        img: 'assets/images/album-covers/album-habibi-ghost.webp',
        title: 'Habibi (Ghost) // Ankit Dhiman',
        badge: 'EDITION · STREAMING',
        badgeClass: 'bg-purple-500/15 text-purple-300',
        ratio: '1:1 Master',
        desc: 'Clean vector ghost character paired with atmospheric cloud backdrop and cassette motifs.',
        metrics: [
          { label: 'Spotify Streams', value: '245K Streams', note: 'Special edition' },
          { label: 'Playlist Adds', value: '38 Playlists', note: 'Lo-fi & Chill rap' },
          { label: 'Save-to-Stream', value: '21.4% Save Rate', note: 'Consistent streams' },
          { label: 'Monthly Listeners', value: '+9.1K Growth', note: 'Niche fanbase' }
        ]
      }
    ]
  },

  'fitness': {
    name: 'Fitness & Lifestyle',
    count: 6,
    isCarousel: true,
    aspect: 'aspect-video',
    cardWidth: 'w-[280px] sm:w-[340px] md:w-[380px]',
    items: [
      {
        img: 'assets/images/fitness/fitness-steroids-vs-sarms.webp',
        title: 'Steroids vs SARMs // Raw Truth',
        badge: 'PHYSIQUE · VIRAL DEBATE',
        badgeClass: 'bg-red-500/15 text-red-400',
        ratio: '16:9 4K',
        desc: 'Dramatic biological contrast and high-retention thumbnail packaging for fitness educators.',
        metrics: [
          { label: 'Click-Through Rate', value: '10.8% CTR', note: 'Controversy debate' },
          { label: 'Views Generated', value: '185K Views', note: 'First 21 days' },
          { label: 'Subscribers Added', value: '+2.2K Subs', note: 'High intent viewers' },
          { label: 'Average Watch Time', value: '47.2%', note: '+9.4% retention' }
        ]
      },
      {
        img: 'assets/images/fitness/fitness-hypper-nation-supplements.webp',
        title: 'Hypper Nation Supplements',
        badge: 'BRAND · COMMERCIAL AD',
        badgeClass: 'bg-blue-500/15 text-blue-400',
        ratio: '16:9 4K',
        desc: 'Aggressive athletic lighting, heavy tub packaging showcase, and hardcore physique framing.',
        metrics: [
          { label: 'Meta Ad ROAS', value: '3.4x ROAS', note: 'Direct-to-consumer' },
          { label: 'Click-Through Rate', value: '4.6% Ad CTR', note: 'Paid social benchmark' },
          { label: 'Units Sold', value: '1,200+ Tubs', note: 'Launch campaign' },
          { label: 'Cost Per Acquisition', value: '₹340 CPA', note: '-22% vs baseline' }
        ]
      },
      {
        img: 'assets/images/fitness/fitness-nutrition-108-brand-logo.webp',
        title: 'Nutrition 108 // Brand Identity',
        badge: 'IDENTITY · BRAND MARK',
        badgeClass: 'bg-amber-500/15 text-amber-400',
        ratio: '1:1 Master',
        desc: 'Minimalist bull horn shield emblem with clean geometric typography for elite sports nutrition.',
        metrics: [
          { label: 'Brand Packaging', value: '12 SKUs Designed', note: 'Protein & Pre-workout' },
          { label: 'Retail Distribution', value: '35+ Gym Stores', note: 'Physical retail launch' },
          { label: 'Brand Recognition', value: 'Premium Tier', note: 'Custom emblem identity' },
          { label: 'Consumer Trust', value: '100% Lab Clean', note: 'Authentic hallmark' }
        ]
      },
      {
        img: 'assets/images/fitness/fitness-top-5-gainers-ronnie-kevin.webp',
        title: 'Top 5 Mass Gainers // Ronnie vs Kevin',
        badge: 'BODYBUILDING · TITAN CLASH',
        badgeClass: 'bg-yellow-500/15 text-yellow-400',
        ratio: '16:9 4K',
        desc: 'Mr. Olympia stage presence, thunderous lightning rim effects, and lab-certified rating cards.',
        metrics: [
          { label: 'Click-Through Rate', value: '11.5% CTR', note: 'Titan clash curiosity' },
          { label: 'Views Generated', value: '220K Views', note: 'Organic bodybuilding' },
          { label: 'Subscribers Added', value: '+2.8K Subs', note: 'Core fitness fans' },
          { label: 'Average Watch Time', value: '49.1%', note: 'Rankings watch-through' }
        ]
      },
      {
        img: 'assets/images/fitness/fitness-independence-combo-sale.webp',
        title: 'Freedom From Fat // Independence Sale',
        badge: 'CAMPAIGN · FLASH SALE',
        badgeClass: 'bg-emerald-500/15 text-emerald-400',
        ratio: '16:9 4K',
        desc: 'Tricolor saffron-green energetic gradient typography with unboxed shaker and supplement combo.',
        metrics: [
          { label: 'Festival Ad ROAS', value: '3.8x ROAS', note: 'Seasonal flash deal' },
          { label: 'Campaign Revenue', value: '₹8.4L in 48h', note: 'Combo bundle sales' },
          { label: 'Click-Through Rate', value: '4.9% Ad CTR', note: 'Tricolor visual hook' },
          { label: 'Store Conversion', value: '4.1% CVR', note: 'Checkout completion' }
        ]
      },
      {
        img: 'assets/images/fitness/fitness-top-5-creatine-lab-tested.webp',
        title: 'Top 5 Creatines // Lab Tested',
        badge: 'SUPPLEMENTS · LAB TESTED',
        badgeClass: 'bg-cyan-500/15 text-cyan-400',
        ratio: '16:9 4K',
        desc: 'Green check vs red cross trust badges with gold medal #1 award badge for consumer confidence.',
        metrics: [
          { label: 'Click-Through Rate', value: '9.2% CTR', note: 'Review authority' },
          { label: 'Views Generated', value: '135K Views', note: 'Evergreen search' },
          { label: 'Subscribers Added', value: '+1.5K Subs', note: 'Science-based viewers' },
          { label: 'Average Watch Time', value: '52.4%', note: 'High verification trust' }
        ]
      }
    ]
  },

  'finance': {
    name: 'Trading & Finance',
    count: 3,
    isCarousel: true,
    aspect: 'aspect-video',
    cardWidth: 'w-[280px] sm:w-[340px] md:w-[380px]',
    items: [
      {
        img: 'assets/images/finance/fin-batman-trading-strategy.webp',
        title: 'Batman Trading Strategy // Setup',
        badge: 'TRADING · 94% WIN RATE',
        badgeClass: 'bg-amber-500/15 text-amber-400',
        ratio: '16:9 4K',
        desc: 'Cinematic Batman cowl visual anchor paired with institutional order-flow candlestick charts.',
        metrics: [
          { label: 'Click-Through Rate', value: '11.2% CTR', note: 'Cinematic finance hook' },
          { label: 'Views Generated', value: '175K Views', note: 'Swing traders' },
          { label: 'Community Joins', value: '+640 Traders', note: 'Telegram / Discord' },
          { label: 'Average Watch Time', value: '54.0%', note: 'Chart setup walk-through' }
        ]
      },
      {
        img: 'assets/images/finance/fin-fastest-way-10k-month.webp',
        title: 'Fastest Way To $10,000/Mo',
        badge: 'WEALTH · HIGH CTR',
        badgeClass: 'bg-emerald-500/15 text-emerald-400',
        ratio: '16:9 4K',
        desc: 'Cash stack visual focal point with clean typography and high-curiosity contrast grading.',
        metrics: [
          { label: 'Click-Through Rate', value: '12.4% CTR', note: 'High monetary curiosity' },
          { label: 'Views Generated', value: '290K Views', note: 'Organic algorithm reach' },
          { label: 'Subscribers Added', value: '+3.6K Subs', note: 'Rapid channel growth' },
          { label: 'Average Watch Time', value: '46.5%', note: '+8% vs channel avg' }
        ]
      },
      {
        img: 'assets/images/finance/fin-working-people-trading-strategy.webp',
        title: 'Trading For 9-To-5 Workers',
        badge: 'PASSIVE · SWING SYSTEM',
        badgeClass: 'bg-cyan-500/15 text-cyan-400',
        ratio: '16:9 4K',
        desc: 'Corporate laptop lifestyle contrast with urgent green P&L alert badge for busy professionals.',
        metrics: [
          { label: 'Click-Through Rate', value: '8.7% CTR', note: 'Targeted demographic' },
          { label: 'Views Generated', value: '115K Views', note: '9-to-5 audience' },
          { label: 'Community Joins', value: '+480 Traders', note: 'Working professionals' },
          { label: 'Average Watch Time', value: '50.2%', note: 'High intent viewers' }
        ]
      }
    ]
  },

  'book-covers': {
    name: 'Book Covers',
    count: 2,
    isCarousel: false, // NO CAROUSEL! Centered static display
    aspect: 'aspect-[2/3]',
    cardWidth: 'niche-book-card',
    items: [
      {
        img: 'assets/images/book-covers/book-beginners-guide-investing.webp',
        title: 'Beginner\'s Guide To Investing',
        badge: 'PUBLISHING · BESTSELLER',
        badgeClass: 'bg-emerald-500/15 text-emerald-400',
        ratio: 'Portrait 2:3',
        desc: 'Minimalist emerald bull motif with crisp gold-embossed typography for retail investors.',
        metrics: [
          { label: 'Amazon Category Rank', value: 'Top 25 Bestseller', note: 'Personal Finance' },
          { label: 'Kindle Page Reads', value: '160K+ Pages', note: 'First 90 days' },
          { label: 'Amazon Buy Rate', value: '14.2% CVR', note: 'Cover-to-sale conversion' },
          { label: 'Reader Rating', value: '4.8 / 5.0 Stars', note: '220+ verified reviews' }
        ]
      },
      {
        img: 'assets/images/book-covers/book-dummies-guide-investing.webp',
        title: 'Investing For Dummies // Practical Guide',
        badge: 'FINANCE · PRINT & EBOOK',
        badgeClass: 'bg-amber-500/15 text-amber-400',
        ratio: 'Portrait 2:3',
        desc: 'Modernized bold typographic edition with clear step-by-step wealth creation messaging.',
        metrics: [
          { label: 'Copies Sold', value: '4,800+ Copies', note: 'Print & Kindle editions' },
          { label: 'Kindle Page Reads', value: '125K+ Pages', note: 'Sustained reading' },
          { label: 'Listing Click Rate', value: '8.6% CTR', note: 'Amazon search display' },
          { label: 'Reader Rating', value: '4.7 / 5.0 Stars', note: '180+ verified reviews' }
        ]
      }
    ]
  }
};

function escapeJs(str) {
  return str.replace(/'/g, "\\'");
}

// Generate pure image card HTML
function renderCard(catKey, item, index, isDuplicate = false) {
  const cat = nicheCatalog[catKey];
  const isBookCover = (catKey === 'book-covers');
  const isSelected = (catKey === 'education' && index === 0);
  const selectedClass = isSelected ? 'card-selected' : '';

  if (isBookCover) {
    return `
    <div class="niche-card niche-card-${catKey}-${index} niche-book-card group relative shrink-0 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 hover:border-[#FF4E00] transition-all cursor-pointer bg-slate-950 shadow-xl ${selectedClass}"
         data-niche="${catKey}"
         data-index="${index}"
         onclick="openNicheItemModal('${catKey}', ${index})">
        <img src="${CDN_PREFIX + item.img}" alt="${escapeJs(item.title)}" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5 pointer-events-none">
            <span class="text-[9.5px] font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-white/15">Tap to Inspect</span>
            <span class="text-[9.5px] font-mono text-[#FF4E00] font-bold bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">${item.ratio}</span>
        </div>
    </div>
    `;
  }

  const aspectClass = item.aspect || cat.aspect;
  const widthClass = cat.cardWidth;

  return `
    <div class="niche-card niche-card-${catKey}-${index} group relative ${widthClass} ${aspectClass} shrink-0 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 hover:border-[#FF4E00] transition-all cursor-pointer bg-slate-950 ${selectedClass}"
         data-niche="${catKey}"
         data-index="${index}"
         onclick="openNicheItemModal('${catKey}', ${index})">
        <img src="${CDN_PREFIX + item.img}" alt="${escapeJs(item.title)}" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 pointer-events-none">
            <span class="text-[10px] font-mono font-bold text-white bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/15">Tap to Inspect</span>
            <span class="text-[10px] font-mono text-[#FF4E00] font-bold bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">${item.ratio}</span>
        </div>
    </div>
  `;
}

// Render the 5 Niche Display Containers
function renderNicheContainers() {
  let html = '';

  for (const [key, cat] of Object.entries(nicheCatalog)) {
    const isDefault = (key === 'education');
    const hiddenClass = isDefault ? '' : 'hidden';

    if (cat.isCarousel) {
      // Duplicated cards for seamless infinite horizontal loop
      const cardsHtml = cat.items.map((it, idx) => renderCard(key, it, idx, false)).join('\n');
      const dupeHtml = cat.items.map((it, idx) => renderCard(key, it, idx, true)).join('\n');

      html += `
        <!-- Niche Showcase: ${cat.name} (${cat.count} works - Moving Carousel) -->
        <div id="niche-display-${key}" class="niche-display-container ${hiddenClass}">
            <div class="relative w-full overflow-hidden rounded-2xl py-3 group/track border border-black/5 dark:border-white/5 bg-black/[0.015] dark:bg-[#07070A]/50">
                <div id="reel-${key}" class="niche-reel-container w-full overflow-x-hidden no-scrollbar px-3 sm:px-4" style="scroll-behavior: smooth;">
                    <div class="flex gap-3.5 sm:gap-4 w-max py-1 items-center">
${cardsHtml}
${dupeHtml}
                    </div>
                </div>
            </div>
        </div>
      `;
    } else {
      // STATIC CLEAN DISPLAY (NO Carousel) for Book Covers
      const cardsHtml = cat.items.map((it, idx) => renderCard(key, it, idx, false)).join('\n');

      html += `
        <!-- Niche Showcase: ${cat.name} (${cat.count} works - Static Pure View, No Carousel) -->
        <div id="niche-display-${key}" class="niche-display-container ${hiddenClass} py-3">
            <div class="rounded-3xl p-6 sm:p-10 border border-black/5 dark:border-white/5 bg-black/[0.015] dark:bg-[#07070A]/50 flex flex-wrap justify-center items-center gap-6 sm:gap-10">
${cardsHtml}
            </div>
        </div>
      `;
    }
  }

  return html;
}

// Generate the complete #design section HTML
function buildDesignSectionHtml() {
  const initialItem = nicheCatalog['education'].items[0];

  return `
        <!-- =========================================================================
             SECTION: CREATIVE DIRECTION & VISUAL CAMPAIGNS (SINGLE-NICHE CAROUSELS & DETAIL INSPECTOR)
             ========================================================================= -->
        <section id="design" class="py-16 md:py-24 relative overflow-hidden">
            <!-- Radiant subtle ambient background glow -->
            <div class="absolute top-1/2 right-1/4 w-[500px] h-[350px] bg-[#FF4E00]/5 rounded-full blur-[170px] pointer-events-none"></div>

            <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl lg:max-w-[1400px] relative z-10 space-y-8 sm:space-y-10">
                
                <!-- Header & Positioning -->
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-black/5 dark:border-white/10">
                    <div class="space-y-3 max-w-2xl">
                        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF4E00]/10 border border-[#FF4E00]/30 text-xs font-semibold tracking-wider text-[#FF4E00] uppercase font-mono">
                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                            <span>02 // Creative Direction &amp; Visual Campaigns</span>
                        </div>

                        <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-[#F5F2ED] tracking-tight leading-[1.1]">
                            DESIGN &amp; CAMPAIGNS,<br />
                            <span class="text-[#FF4E00]">ACCELERATED BY AI.</span>
                        </h2>

                        <p class="text-xs sm:text-sm md:text-base text-slate-600 dark:text-[#F5F2ED]/70 leading-relaxed font-normal">
                            High-conversion creator packaging, paid social ad suites, and viral visual identities designed for peak CTR and viewer retention.
                        </p>
                    </div>

                    <!-- Direct Instagram Creative Portfolio Link -->
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                        <a href="https://instagram.com/thepankaj.z" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-95 shadow-md shadow-pink-500/20 transition-all hover:scale-105 active:scale-95">
                            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                            <span>@thepankaj.z ↗</span>
                        </a>
                    </div>
                </div>

                <!-- SELECT CREATIVE NICHE & CONTROLS (Directly Below Header) -->
                <div class="space-y-4">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div class="flex items-center gap-2">
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4E00]/10 text-[#FF4E00] text-[11px] font-mono font-bold tracking-wider uppercase border border-[#FF4E00]/20">
                                <span class="w-1.5 h-1.5 rounded-full bg-[#FF4E00] animate-pulse"></span>
                                Select Creative Niche
                            </span>
                            <span id="niche-status-hint" class="text-[11px] font-mono text-slate-500 dark:text-white/40 hidden sm:inline">· Tap any artwork to inspect CTR &amp; performance lift</span>
                        </div>
                        
                        <!-- Navigation Arrows for Carousels -->
                        <div id="niche-nav-arrows" class="flex items-center gap-1.5">
                            <button onclick="scrollActiveReel(-1)" aria-label="Slide Left" class="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-[#FF4E00] hover:text-white flex items-center justify-center transition-all cursor-pointer">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                            </button>
                            <button onclick="scrollActiveReel(1)" aria-label="Slide Right" class="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-[#FF4E00] hover:text-white flex items-center justify-center transition-all cursor-pointer">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                            </button>
                        </div>
                    </div>

                    <!-- Niche Selector Pills -->
                    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        <button id="pill-education" onclick="switchNiche('education', this)" class="niche-tab-btn active px-4 py-2 rounded-full text-xs font-mono font-bold tracking-tight bg-[#FF4E00] text-white shadow-md shadow-[#FF4E00]/25 transition-all cursor-pointer">
                            Education (8)
                        </button>
                        <button id="pill-album-covers" onclick="switchNiche('album-covers', this)" class="niche-tab-btn px-4 py-2 rounded-full text-xs font-mono font-semibold tracking-tight theme-pressed text-slate-700 dark:text-[#F5F2ED]/70 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer">
                            Album Covers (6)
                        </button>
                        <button id="pill-fitness" onclick="switchNiche('fitness', this)" class="niche-tab-btn px-4 py-2 rounded-full text-xs font-mono font-semibold tracking-tight theme-pressed text-slate-700 dark:text-[#F5F2ED]/70 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer">
                            Fitness &amp; Lifestyle (6)
                        </button>
                        <button id="pill-finance" onclick="switchNiche('finance', this)" class="niche-tab-btn px-4 py-2 rounded-full text-xs font-mono font-semibold tracking-tight theme-pressed text-slate-700 dark:text-[#F5F2ED]/70 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer">
                            Trading &amp; Finance (3)
                        </button>
                        <button id="pill-book-covers" onclick="switchNiche('book-covers', this)" class="niche-tab-btn px-4 py-2 rounded-full text-xs font-mono font-semibold tracking-tight theme-pressed text-slate-700 dark:text-[#F5F2ED]/70 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer">
                            Book Covers (2)
                        </button>
                    </div>
                </div>

                <!-- ACTIVE NICHE CAROUSEL / DISPLAY WRAPPER -->
                <div id="niche-display-wrapper" class="relative w-full">
${renderNicheContainers()}
                </div>

                <!-- DYNAMIC DETAILS INSPECTOR PANEL (In-Page Overview) -->
                <div id="niche-detail-panel" class="rounded-3xl theme-card border border-black/10 dark:border-white/10 p-5 sm:p-7 relative overflow-hidden transition-all duration-300 shadow-xl bg-white dark:bg-[#0E0E12]/95 space-y-4">
                    <!-- Subtle Ambient Corner Flare -->
                    <div class="absolute -top-12 -right-12 w-48 h-48 bg-[#FF4E00]/10 rounded-full blur-3xl pointer-events-none"></div>

                    <!-- Top Meta Info -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/10 pb-3 relative z-10">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span id="detail-category-badge" class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#FF4E00]/15 text-[#FF4E00] border border-[#FF4E00]/25">
                                EDUCATION // EDTECH
                            </span>
                            <span id="detail-item-badge" class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${initialItem.badgeClass}">
                                ${initialItem.badge}
                            </span>
                        </div>
                        <div class="flex items-center gap-2.5">
                            <span id="detail-ratio-badge" class="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[11px] font-mono text-slate-500 dark:text-white/60">
                                ${initialItem.ratio}
                            </span>
                            <span class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                ACTIVE INSPECTION
                            </span>
                        </div>
                    </div>

                    <!-- Title & Narrative Breakdown -->
                    <div class="space-y-2 relative z-10">
                        <h3 id="detail-title" class="text-lg sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                            ${initialItem.title}
                        </h3>
                        <p id="detail-desc" class="text-xs sm:text-sm text-slate-600 dark:text-[#F5F2ED]/75 leading-relaxed max-w-4xl">
                            ${initialItem.desc}
                        </p>
                    </div>

                    <!-- Bottom Action Strip -->
                    <div class="pt-3 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                        <button id="detail-lightbox-btn" onclick="openActiveItemLightbox()" class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#FF4E00] hover:bg-[#FF6B2B] shadow-md shadow-[#FF4E00]/25 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                            <span>Inspect Performance &amp; HD Preview</span>
                        </button>
                        <span class="text-[11px] font-mono text-slate-500 dark:text-white/40 flex items-center gap-1.5">
                            <svg class="w-3.5 h-3.5 text-[#FF4E00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                            Tap any thumbnail directly to view analytics &amp; HD full screen
                        </span>
                    </div>
                </div>

                <!-- Bottom Contextual Action Strip -->
                <div class="rounded-2xl theme-card border border-black/10 dark:border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="space-y-0.5 text-center sm:text-left">
                        <span class="text-xs font-bold text-slate-900 dark:text-white">Need high-CTR creator packaging or paid campaign assets?</span>
                        <p class="text-[11px] text-slate-500 dark:text-[#F5F2ED]/60">Sprints delivered in 48-72 hours with layered source files.</p>
                    </div>
                    <a href="https://wa.me/917018168156?text=Hi%20Pankaj,%20I'd%20like%20to%20discuss%20a%20visual%20campaign%20or%20creator%20packaging" target="_blank" class="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#FF4E00] hover:bg-[#FF6B2B] shadow-md shadow-[#FF4E00]/25 transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2">
                        <span>Book A Visual Sprint</span>
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </a>
                </div>

            </div>
        </section>
  `;
}

// Generate the Split-Screen Lightbox Modal (Left: Image, Right: Details & Realistic Performance Lift)
function buildLightboxModalHtml() {
  return `
<!-- =========================================================================
     GLOBAL HD VISUAL LIGHTBOX MODAL (Split View: Left Image, Right Analytics)
     ========================================================================= -->
<div id="folio-lightbox" class="fixed inset-0 z-[1000000] bg-black/90 backdrop-blur-xl opacity-0 pointer-events-none transition-all duration-300 flex items-center justify-center p-3 sm:p-5 md:p-8" onclick="closeLightbox(event)">
    
    <div class="relative w-full max-w-6xl max-h-[92vh] rounded-3xl bg-[#0E0E12] border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row" onclick="event.stopPropagation()">
        
        <!-- Close Button (Top Right) -->
        <button onclick="closeLightbox()" class="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF4E00] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg" title="Close (Esc)">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <!-- LEFT SIDE: Artwork Image Display -->
        <div class="relative md:w-3/5 lg:w-[62%] bg-black/95 flex items-center justify-center p-4 sm:p-6 overflow-hidden min-h-[260px] md:min-h-[520px]">
            <!-- Prev/Next Navigation Controls -->
            <button onclick="navigateLightbox(-1)" aria-label="Previous Artwork" class="absolute left-3 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-[#FF4E00] text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button onclick="navigateLightbox(1)" aria-label="Next Artwork" class="absolute right-3 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-[#FF4E00] text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <!-- Image with high-def render -->
            <img id="lightbox-img" src="" alt="Portfolio Showcase" class="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl block mx-auto transition-transform duration-300" />
        </div>

        <!-- RIGHT SIDE: Performance Analytics & Strategy Breakdown -->
        <div class="md:w-2/5 lg:w-[38%] p-5 sm:p-6 md:p-7 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[92vh] border-t md:border-t-0 md:border-l border-white/10 space-y-5 bg-[#0E0E12]">
            
            <div class="space-y-4">
                <!-- Badges -->
                <div class="flex items-center justify-between gap-2 pr-8">
                    <span id="lightbox-cat-badge" class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#FF4E00]/15 text-[#FF4E00] border border-[#FF4E00]/25">
                        EDUCATION // THUMBNAIL
                    </span>
                    <span id="lightbox-ratio-badge" class="px-2.5 py-0.5 rounded text-[10px] font-mono text-white/50 bg-white/5 border border-white/10">
                        16:9 4K
                    </span>
                </div>

                <!-- Title & Badge Subtitle -->
                <div>
                    <h3 id="lightbox-title" class="text-lg sm:text-xl font-bold font-display text-white tracking-tight">
                        Artwork Title
                    </h3>
                    <p id="lightbox-item-badge" class="text-xs font-mono text-amber-400 font-semibold mt-1">
                        EDTECH · BOOK LAUNCH
                    </p>
                </div>

                <!-- PERFORMANCE & IMPACT METRICS GRID -->
                <div class="space-y-2 pt-1">
                    <div class="flex items-center justify-between text-[11px] font-mono text-white/40 uppercase tracking-wider">
                        <span>Campaign Lift &amp; Results</span>
                        <span class="text-emerald-400 flex items-center gap-1 font-semibold text-[10.5px]">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Verified Impact
                        </span>
                    </div>
                    
                    <!-- 4 Metric Cards -->
                    <div id="lightbox-metrics-grid" class="grid grid-cols-2 gap-2 font-mono">
                        <!-- Populated dynamically via JS -->
                    </div>
                </div>

                <!-- Design Strategy Narrative -->
                <div class="space-y-1.5 pt-1">
                    <span class="text-[10px] font-mono uppercase tracking-wider text-white/40 block">Creative Direction &amp; Hooks</span>
                    <p id="lightbox-desc" class="text-xs sm:text-sm text-white/70 leading-relaxed">
                        Curiosity-driven spotlight staging...
                    </p>
                </div>
            </div>

            <!-- Bottom Sprint Link -->
            <div class="pt-4 border-t border-white/10 space-y-2.5">
                <a id="lightbox-whatsapp-btn" href="https://wa.me/917018168156" target="_blank" class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#FF4E00] hover:bg-[#FF6B2B] shadow-md shadow-[#FF4E00]/25 transition-all">
                    <span>Book Similar Creative Sprint</span>
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </a>
                <div class="flex items-center justify-between text-[10.5px] font-mono text-white/40">
                    <span>Use &larr; &rarr; keys to browse</span>
                    <span id="lightbox-counter">1 of 8</span>
                </div>
            </div>

        </div>

    </div>
</div>
  `;
}

// Client-side JavaScript Controller to embed into <script>
const clientScript = `// =========================================================================
  // NICHE-SPECIFIC CAROUSEL & DYNAMIC DETAIL INSPECTOR CONTROLLER
  // =========================================================================
  const nicheCatalogData = ${JSON.stringify(nicheCatalog)};
  const CDN_BASE = '${CDN_PREFIX}';

  let currentActiveNiche = 'education';
  let currentActiveIndex = 0;
  let reelPaused = false;
  let reelResumeTimer = null;

  function switchNiche(nicheKey, btnEl) {
    if (!nicheCatalogData[nicheKey]) return;
    currentActiveNiche = nicheKey;

    // 1. Update Niche Selector Pill Styles
    document.querySelectorAll('.niche-tab-btn').forEach(btn => {
      btn.classList.remove('active', 'bg-[#FF4E00]', 'text-white', 'shadow-md', 'shadow-[#FF4E00]/25');
      btn.classList.add('theme-pressed', 'text-slate-700', 'dark:text-[#F5F2ED]/70');
    });
    if (btnEl) {
      btnEl.classList.add('active', 'bg-[#FF4E00]', 'text-white', 'shadow-md', 'shadow-[#FF4E00]/25');
      btnEl.classList.remove('theme-pressed', 'text-slate-700', 'dark:text-[#F5F2ED]/70');
    }

    // 2. Toggle Niche Display Containers
    document.querySelectorAll('.niche-display-container').forEach(el => {
      el.classList.add('hidden');
    });
    const targetDisplay = document.getElementById('niche-display-' + nicheKey);
    if (targetDisplay) {
      targetDisplay.classList.remove('hidden');
    }

    // 3. Arrow navigation visibility (only for carousels)
    const arrowNav = document.getElementById('niche-nav-arrows');
    const hintEl = document.getElementById('niche-status-hint');
    const isCarousel = nicheCatalogData[nicheKey].isCarousel;

    if (arrowNav) {
      arrowNav.style.display = isCarousel ? 'flex' : 'none';
    }
    if (hintEl) {
      hintEl.textContent = isCarousel 
        ? '· Tap any artwork to inspect CTR & performance lift' 
        : '· Curated book jacket showcase · Tap to inspect';
    }

    // 4. Select the first item of this niche by default
    selectWorkItem(nicheKey, 0);
  }

  function selectWorkItem(nicheKey, itemIndex) {
    const niche = nicheCatalogData[nicheKey];
    if (!niche || !niche.items[itemIndex]) return;

    currentActiveNiche = nicheKey;
    currentActiveIndex = itemIndex;
    const item = niche.items[itemIndex];

    // 1. Highlight all instances of this card (handles duplicates in carousel)
    document.querySelectorAll('.niche-card').forEach(c => {
      c.classList.remove('card-selected');
    });
    document.querySelectorAll('.niche-card-' + nicheKey + '-' + itemIndex).forEach(c => {
      c.classList.add('card-selected');
    });

    // 2. Update Detail Inspector Panel Content on page
    const catBadge = document.getElementById('detail-category-badge');
    const itemBadge = document.getElementById('detail-item-badge');
    const ratioBadge = document.getElementById('detail-ratio-badge');
    const titleEl = document.getElementById('detail-title');
    const descEl = document.getElementById('detail-desc');

    if (catBadge) catBadge.textContent = niche.name.toUpperCase();
    if (itemBadge) {
      itemBadge.textContent = item.badge;
      itemBadge.className = 'px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ' + item.badgeClass;
    }
    if (ratioBadge) ratioBadge.textContent = item.ratio;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.desc;
  }

  // Open the split-screen modal when a thumbnail is tapped
  function openNicheItemModal(nicheKey, itemIndex) {
    selectWorkItem(nicheKey, itemIndex);
    renderLightboxContent(nicheKey, itemIndex);

    const modal = document.getElementById('folio-lightbox');
    if (modal) {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.add('opacity-100', 'pointer-events-auto');
      document.body.style.overflow = 'hidden';
    }
  }

  function renderLightboxContent(nicheKey, itemIndex) {
    const niche = nicheCatalogData[nicheKey];
    if (!niche || !niche.items[itemIndex]) return;
    const item = niche.items[itemIndex];

    const img = document.getElementById('lightbox-img');
    const catBadge = document.getElementById('lightbox-cat-badge');
    const ratioBadge = document.getElementById('lightbox-ratio-badge');
    const titleEl = document.getElementById('lightbox-title');
    const itemBadge = document.getElementById('lightbox-item-badge');
    const descEl = document.getElementById('lightbox-desc');
    const metricsGrid = document.getElementById('lightbox-metrics-grid');
    const counterEl = document.getElementById('lightbox-counter');
    const waBtn = document.getElementById('lightbox-whatsapp-btn');

    if (img) img.src = CDN_BASE + item.img;
    if (catBadge) catBadge.textContent = niche.name.toUpperCase();
    if (ratioBadge) ratioBadge.textContent = item.ratio;
    if (titleEl) titleEl.textContent = item.title;
    if (itemBadge) itemBadge.textContent = item.badge;
    if (descEl) descEl.textContent = item.desc;
    if (counterEl) counterEl.textContent = (itemIndex + 1) + ' of ' + niche.items.length;

    if (waBtn) {
      waBtn.href = 'https://wa.me/917018168156?text=' + encodeURIComponent("Hi Pankaj, I'm interested in creative direction & packaging for: " + item.title);
    }

    if (metricsGrid && item.metrics) {
      metricsGrid.innerHTML = item.metrics.map(m => \`
        <div class="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 space-y-0.5">
            <span class="text-[9.5px] font-mono text-white/40 uppercase block truncate">\${m.label}</span>
            <span class="text-xs sm:text-sm font-bold font-mono text-emerald-400 block">\${m.value}</span>
            <span class="text-[9px] font-mono text-white/50 block truncate">\${m.note}</span>
        </div>
      \`).join('');
    }
  }

  function openActiveItemLightbox() {
    openNicheItemModal(currentActiveNiche, currentActiveIndex);
  }

  function navigateLightbox(direction) {
    const niche = nicheCatalogData[currentActiveNiche];
    if (!niche) return;
    const total = niche.items.length;
    currentActiveIndex = (currentActiveIndex + direction + total) % total;
    selectWorkItem(currentActiveNiche, currentActiveIndex);
    renderLightboxContent(currentActiveNiche, currentActiveIndex);
  }

  function closeLightbox(e) {
    const modal = document.getElementById('folio-lightbox');
    if (!modal) return;
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('folio-lightbox');
    if (!modal || modal.classList.contains('pointer-events-none')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  function scrollActiveReel(direction) {
    const reel = document.getElementById('reel-' + currentActiveNiche);
    if (!reel) return;

    reelPaused = true;
    clearTimeout(reelResumeTimer);

    const step = window.innerWidth < 640 ? 280 : 360;
    const halfWidth = reel.scrollWidth / 2;

    if (direction < 0 && reel.scrollLeft <= 20 && halfWidth > 0) {
      reel.scrollLeft = halfWidth;
    }

    reel.scrollBy({ left: direction * step, behavior: 'smooth' });

    reelResumeTimer = setTimeout(() => {
      reelResumeTimer = null;
      if (halfWidth > 0 && reel.scrollLeft >= halfWidth) {
        reel.scrollLeft = reel.scrollLeft - halfWidth;
      }
      reelPaused = false;
    }, 3500);
  }

  // Auto-scrolling engine for active reel
  function initNicheReelScroller() {
    // Bind pause/resume events on all reel containers
    document.querySelectorAll('.niche-reel-container').forEach(container => {
      container.addEventListener('mouseenter', () => { reelPaused = true; });
      container.addEventListener('mouseleave', () => {
        if (!reelResumeTimer) reelPaused = false;
      });
      container.addEventListener('touchstart', () => { reelPaused = true; }, { passive: true });
      container.addEventListener('touchend', () => {
        if (!reelResumeTimer) reelPaused = false;
      }, { passive: true });
    });

    function loopScroll() {
      if (!reelPaused) {
        const activeReel = document.getElementById('reel-' + currentActiveNiche);
        if (activeReel) {
          activeReel.scrollLeft += 0.85;
          const halfWidth = activeReel.scrollWidth / 2;
          if (halfWidth > 0 && activeReel.scrollLeft >= halfWidth) {
            activeReel.scrollLeft = 0;
          }
        }
      }
      requestAnimationFrame(loopScroll);
    }
    requestAnimationFrame(loopScroll);
  }

  // Initialize scroller and default niche on boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initNicheReelScroller();
      const defaultPill = document.getElementById('pill-education');
      if (defaultPill) switchNiche('education', defaultPill);
    });
  } else {
    initNicheReelScroller();
    const defaultPill = document.getElementById('pill-education');
    if (defaultPill) switchNiche('education', defaultPill);
  }`;

// 1. Replace #design in index.html
const designSectionStart = '<section id="design"';
const designStartIndex = html.indexOf(designSectionStart);
if (designStartIndex === -1) {
  console.error("Could not find <section id=\"design\" in index.html!");
  process.exit(1);
}

const publishingStart = '<section id="publishing"';
const publishingIndex = html.indexOf(publishingStart);
if (publishingIndex === -1) {
  console.error("Could not find <section id=\"publishing\" in index.html!");
  process.exit(1);
}

const newDesignHtml = buildDesignSectionHtml();
html = html.substring(0, designStartIndex) + newDesignHtml.trim() + '\n\n        ' + html.substring(publishingIndex);

// 2. Replace #folio-lightbox modal in index.html
const lightboxModalStart = '<!-- =========================================================================\n     GLOBAL HD VISUAL LIGHTBOX MODAL';
let modalStartIndex = html.indexOf(lightboxModalStart);
if (modalStartIndex === -1) {
  modalStartIndex = html.indexOf('<div id="folio-lightbox"');
}

const scriptTagStart = '<script>\n  // =========================================================================\n  // NICHE-SPECIFIC CAROUSEL';
let scriptTagIndex = html.indexOf(scriptTagStart);
if (scriptTagIndex === -1) {
  scriptTagIndex = html.indexOf('<script>\n// =========================================================================\n  // NICHE-SPECIFIC CAROUSEL');
}
if (scriptTagIndex === -1) {
  scriptTagIndex = html.indexOf('<script>');
}

if (modalStartIndex !== -1 && scriptTagIndex !== -1 && modalStartIndex < scriptTagIndex) {
  const newModalHtml = buildLightboxModalHtml().trim();
  html = html.substring(0, modalStartIndex) + newModalHtml + '\n\n\n' + html.substring(scriptTagIndex);
} else {
  console.warn("Could not find standard modal start/end index, will replace via direct tag boundaries");
}

// 3. Replace the script controller block
const scriptStartIndex = html.indexOf('// =========================================================================\n  // NICHE-SPECIFIC CAROUSEL');
const scriptEndIndex = html.indexOf('</script>\n\n</body>');

if (scriptStartIndex !== -1 && scriptEndIndex !== -1) {
  html = html.substring(0, scriptStartIndex) + clientScript.trim() + '\n' + html.substring(scriptEndIndex);
} else {
  // Try finding via lightbox controller if present
  const oldScriptStart = html.indexOf('// =========================================================================\n  // NICHE-SPECIFIC CAROUSEL');
  const oldScriptEnd = html.indexOf('// HD Lightbox Controller');
  if (oldScriptStart !== -1 && oldScriptEnd !== -1) {
    const endScriptTag = html.indexOf('</script>', oldScriptEnd);
    html = html.substring(0, oldScriptStart) + clientScript.trim() + '\n' + html.substring(endScriptTag);
  }
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log("SUCCESS: Rebuilt #design section, Split-Screen Lightbox Modal & Controller in index.html!");

// Recompile tailwind
console.log("Recompiling tailwind.min.css...");
execSync('node node_modules/tailwindcss/lib/cli.js -i assets/css/input.css -o assets/css/tailwind.min.css --minify', { stdio: 'inherit' });
console.log("ALL COMPLETE!");
