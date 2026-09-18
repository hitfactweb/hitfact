import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding HITFACT production database with verified stories, active polls, and quizzes...");

  // 1. Ensure Super Admin Account
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@hitfact.com" },
    update: {
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
    create: {
      id: "usr_admin",
      email: "admin@hitfact.com",
      name: "Chief Editor (Admin)",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      profile: {
        create: {
          username: "admin",
          displayName: "Editorial Board",
          bio: "HITFACT Editorial Administration and Forensic Fact-Checking Desk.",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        },
      },
    },
  });

  // 2. Setup Standard Core Desks / Categories
  const categoryDefs = [
    { name: "Politics", slug: "politics", description: "Governance, legislation, electoral policy, and public accountability.", color: "#ED1C24", sortOrder: 1 },
    { name: "Media", slug: "media", description: "Press freedom, algorithm transparency, and media narratives.", color: "#3B82F6", sortOrder: 2 },
    { name: "Reality Check", slug: "reality-check", description: "Direct debunking, viral claims, and statistical reality.", color: "#10B981", sortOrder: 3 },
    { name: "Economy", slug: "economy", description: "Inflation, fiscal analysis, taxation, and labor data.", color: "#F59E0B", sortOrder: 4 },
    { name: "Science & AI", slug: "science-ai", description: "Emerging technology, artificial intelligence, and scientific data.", color: "#8B5CF6", sortOrder: 5 },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoryDefs) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories[cat.slug] = record;
  }

  // 3. Seed Fact Checks (if none exist)
  const existingPosts = await prisma.post.count();
  if (existingPosts === 0) {
    console.log("Creating verified fact-check and investigative stories...");

    // Post 1: Fact Check - FALSE
    await prisma.post.create({
      data: {
        slug: "viral-claim-evm-malfunction-kerala-bypoll-debunked",
        type: "FACT_CHECK",
        title: "Viral Video Claiming EVM Malfunction in By-Election is Doctored",
        caption: "A 45-second video circulating on WhatsApp and X claiming electronic voting machines registered all votes to one party has been forensically debunked.",
        mediaUrls: JSON.stringify([
          "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&auto=format&fit=crop&q=80"
        ]),
        status: "PUBLISHED",
        authorId: superAdmin.id,
        categoryId: categories["politics"]?.id,
        publishedAt: new Date(Date.now() - 2 * 3600 * 1000),
        views: 1420,
        factCheck: {
          create: {
            claim: "Electronic voting machines recorded every button press as a vote for a single candidate during mock polling.",
            claimant: "Anonymous WhatsApp & X posts",
            claimDate: "September 2026",
            claimSource: "Circulating social media clips",
            context: "Shared ahead of regional council by-elections with alarmist captions in regional languages.",
            evidence: "Official mock-poll records and unedited security camera footage verified by the Returning Officer confirm zero discrepancies. The viral video was spliced from an unrelated 2019 demonstration.",
            analysis: "Audio synchronization analysis revealed inserted audio tracks over genuine mock-poll visuals.",
            verdict: "FALSE",
            sourcesJson: JSON.stringify([
              "State Election Commission Official Press Briefing",
              "HITFACT Forensic Video Frame Analysis",
              "Independent Poll Observers Certified Log"
            ]),
            reviewedBy: "Chief Editorial Board",
            reviewedAt: new Date(),
          },
        },
      },
    });

    // Post 2: Fact Check - MISLEADING
    await prisma.post.create({
      data: {
        slug: "leaked-audio-welfare-pension-cuts-is-synthetic-deepfake",
        type: "FACT_CHECK",
        title: "Alleged Leaked Audio of Minister Ordering Welfare Cuts is an AI Voice Clone",
        caption: "Spectrogram analysis reveals synthetic vocal tremors and background phase noise characteristic of diffusion-based voice cloning models.",
        mediaUrls: JSON.stringify([
          "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80"
        ]),
        status: "PUBLISHED",
        authorId: superAdmin.id,
        categoryId: categories["reality-check"]?.id,
        publishedAt: new Date(Date.now() - 5 * 3600 * 1000),
        views: 2890,
        factCheck: {
          create: {
            claim: "Government secretly issued directives to terminate senior citizen welfare pensions starting next quarter.",
            claimant: "Viral Telegram Channels",
            claimDate: "September 2026",
            claimSource: "Leaked MP3 audio recording",
            context: "Circulated extensively across community groups creating widespread public anxiety among elderly citizens.",
            evidence: "The Ministry of Social Welfare has officially presented budget allocations confirming fully funded welfare disbursements. Acoustic spectral analysis demonstrates unnatural robotic cadence and harmonic decay.",
            analysis: "Spectrogram analysis confirms synthetic vocal generation using a commercial text-to-speech voice clone.",
            verdict: "MISLEADING",
            sourcesJson: JSON.stringify([
              "Ministry of Social Welfare Budget Allocation Whitepaper",
              "National Cyber Forensic Laboratory Acoustic Report"
            ]),
            reviewedBy: "Lead Fact-Checker",
            reviewedAt: new Date(),
          },
        },
      },
    });

    // Post 3: Fact Check - TRUE
    await prisma.post.create({
      data: {
        slug: "cyber-consortium-audit-confirms-42-percent-rise-in-botnets",
        type: "FACT_CHECK",
        title: "Audit Confirms 42% Spike in Coordinated Disinformation Networks",
        caption: "Comprehensive forensic data confirms thousands of coordinated sockpuppet profiles amplifying polarized narratives ahead of state elections.",
        mediaUrls: JSON.stringify([
          "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80"
        ]),
        status: "PUBLISHED",
        authorId: superAdmin.id,
        categoryId: categories["media"]?.id,
        publishedAt: new Date(Date.now() - 12 * 3600 * 1000),
        views: 3410,
        factCheck: {
          create: {
            claim: "Over 40% more automated bot accounts are active in political hashtags compared to the previous electoral cycle.",
            claimant: "Cyber Forensic Consortium",
            claimDate: "August-September 2026",
            claimSource: "Q3 Digital Integrity Benchmark",
            context: "Published in collaboration with academic computational sociology researchers.",
            evidence: "Cross-platform telemetry analyzing 1.4 million interactions identified cluster behavioral patterns consistent with bot-orchestrated amplification.",
            analysis: "Graph network analysis confirmed cluster synchronization within milliseconds of original narrative posts.",
            verdict: "TRUE",
            sourcesJson: JSON.stringify([
              "Cyber Forensic Consortium Bi-Annual Report",
              "Digital Democracy Observatory Dataset"
            ]),
            reviewedBy: "Technology & Ethics Desk",
            reviewedAt: new Date(),
          },
        },
      },
    });

    // Post 4: Investigative Article
    await prisma.post.create({
      data: {
        slug: "inside-the-dark-web-botnets-shaping-regional-narratives",
        type: "ARTICLE",
        title: "Inside the Shadow Agencies Weaponizing Regional Social Feeds",
        caption: "An eight-week undercover investigation into commercial PR agencies offering covert computational propaganda packages for electoral candidates.",
        mediaUrls: JSON.stringify([
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80"
        ]),
        status: "PUBLISHED",
        authorId: superAdmin.id,
        categoryId: categories["politics"]?.id,
        publishedAt: new Date(Date.now() - 24 * 3600 * 1000),
        views: 4520,
        article: {
          create: {
            summary: "For as little as 50,000 rupees, shadow digital marketing operations promise to make any narrative trend across regional WhatsApp clusters within 90 minutes. Here is how they operate.",
            body: `In a nondescript office suite in an industrial technology park, twenty young operators manage over 400 virtual Android emulators simultaneously. Each screen is linked to disposable SIM cards, posting synchronized talking points, reaction emojis, and meme collages across hundreds of local neighborhood groups.

Our investigation gained access to internal rate cards, contracts, and training protocols of three commercial digital amplification agencies. What we uncovered is a mature, industrial-scale disinformation ecosystem that operates entirely outside election spending regulations.

### The Micro-Targeting Playbook
Unlike national advertising campaigns that require regulatory clearance and public disclaimers, dark PR operations rely on encrypted messaging apps where oversight is virtually nonexistent. By categorizing voters by hyper-local grievances—such as road maintenance delays or water supply disputes—operators inject polarizing spin designed to provoke emotional outrage rather than reasoned debate.

### Algorithmic Exploitation
By generating rapid clusters of engagement within the first four minutes of a post, these networks fool platform recommendation algorithms into classifying partisan attacks as 'trending breaking news,' ensuring organic users see and propagate the material voluntarily.

HITFACT will continue tracking the financial trails behind these shadow operations to preserve digital democracy and transparency.`,
            readingTime: 6,
          },
        },
      },
    });

    // Post 5: Investigative Article - Economy & Misinformation
    await prisma.post.create({
      data: {
        slug: "the-economics-of-viral-outrage-clickbait-arbitrage",
        type: "ARTICLE",
        title: "The Economics of Outrage: Who Profits from Fake News?",
        caption: "Tracking the programmatic ad dollars and click-arbitrage syndicates turning sensationalist lies into reliable monthly dividends.",
        mediaUrls: JSON.stringify([
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80"
        ]),
        status: "PUBLISHED",
        authorId: superAdmin.id,
        categoryId: categories["economy"]?.id,
        publishedAt: new Date(Date.now() - 36 * 3600 * 1000),
        views: 1980,
        article: {
          create: {
            summary: "Behind every sensational fake story is an advertising network delivering automated programmatic revenue. We trace the financial pipeline supporting online misinformation.",
            body: `Misinformation is often understood as a political problem, but fundamentally it is an economic industry. A single sensationalist blog post fabricated with an emotional headline can generate thousands of dollars in programmatic advertising revenue within 48 hours.

Through automated ad exchanges, mainstream brands unwittingly fund hyper-partisan disinformation portals because algorithms optimize for raw attention regardless of factual accuracy.

Until digital advertising platforms enforce strict provenance checks and demonetize verified bad-faith actors, the economic incentive to produce outrage will continue to outweigh the journalistic incentive to report the truth.`,
            readingTime: 4,
          },
        },
      },
    });
  }

  // 4. Seed Active Civic Polls (if none exist)
  const existingPolls = await prisma.poll.count();
  if (existingPolls === 0) {
    console.log("Creating active civic polls...");

    await prisma.poll.create({
      data: {
        question: "Should digital platforms be legally required to label AI-generated and deepfake media?",
        description: "National civic debate on democratic election integrity, synthetic media disclosure, and voter protections.",
        allowMultiple: false,
        requireLogin: false,
        options: {
          create: [
            { label: "Yes – mandatory forensic watermarks and clear warning badges on all AI content", sortOrder: 0 },
            { label: "Only for political candidates and election-related campaign materials", sortOrder: 1 },
            { label: "No – platforms should follow voluntary industry standards without government mandates", sortOrder: 2 },
          ],
        },
      },
    });

    await prisma.poll.create({
      data: {
        question: "How confident are you in distinguishing synthetic AI voice clones from genuine phone recordings?",
        description: "Assessment of reader awareness regarding emerging audio spoofing and voice cloning technology.",
        allowMultiple: false,
        requireLogin: false,
        options: {
          create: [
            { label: "Very Confident – I verify audio sources through independent fact-checkers", sortOrder: 0 },
            { label: "Somewhat Confident – but subtle manipulation is getting harder to detect", sortOrder: 1 },
            { label: "Not Confident – deepfake voice technology sounds completely indistinguishable", sortOrder: 2 },
          ],
        },
      },
    });
  }

  // 5. Seed Media Literacy Quizzes (if none exist)
  const existingQuizzes = await prisma.quiz.count();
  if (existingQuizzes === 0) {
    console.log("Creating media literacy verification quiz...");

    await prisma.quiz.create({
      data: {
        title: "Forensic Media Literacy: Spotting Digital Manipulation",
        description: "Test your skills in detecting cropped video framing, synthetic AI portraits, and viral disinformation tactics.",
        slug: "forensic-media-literacy-challenge",
        timeLimit: 300,
        passMark: 70,
        published: true,
        questions: {
          create: [
            {
              question: "You encounter a sensational video clip on social media showing a leader making an extreme statement. What should your FIRST verification step be?",
              explanation: "Sensational clips are frequently weaponized by removing crucial preceding or subsequent sentences. Always verify the uncut source recording.",
              sortOrder: 0,
              options: {
                create: [
                  { label: "Search for the complete, uncut press briefing to inspect the full surrounding context", isCorrect: true },
                  { label: "Forward it to WhatsApp groups to ask friends if they think it is authentic", isCorrect: false },
                  { label: "Accept it as true if the post has over 100,000 likes and comments", isCorrect: false },
                  { label: "Look for angry reactions in the comments section", isCorrect: false },
                ],
              },
            },
            {
              question: "Which of the following is a primary forensic telltale artifact of an AI-generated portrait?",
              explanation: "Current generative diffusion algorithms often produce inconsistencies in microscopic details like asymmetrical earrings, pupil reflections, and dental alignment.",
              sortOrder: 1,
              options: {
                create: [
                  { label: "Asymmetrical jewelry, warped background geometry, and mismatched eye reflections", isCorrect: true },
                  { label: "The image is saved in high definition 4K resolution", isCorrect: false },
                  { label: "The subject in the photo is wearing a professional suit", isCorrect: false },
                  { label: "The photo was taken in outdoor natural sunlight", isCorrect: false },
                ],
              },
            },
            {
              question: "What is 'astroturfing' in the context of digital political discourse?",
              explanation: "Astroturfing mimics genuine grassroots public opinion using botnets, automated accounts, or paid PR networks.",
              sortOrder: 2,
              options: {
                create: [
                  { label: "Artificially manufacturing fake grassroots support using coordinated bot networks and proxy accounts", isCorrect: true },
                  { label: "Designing agricultural landscape graphics for state news channels", isCorrect: false },
                  { label: "Running official paid billboard campaigns across public highways", isCorrect: false },
                  { label: "Writing satirical political comedy scripts for television", isCorrect: false },
                ],
              },
            },
          ],
        },
      },
    });
  }

  console.log("Seeding complete! Database is populated with verified stories, polls, and quizzes.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
