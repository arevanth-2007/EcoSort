const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting EcoSort database seed...");

  // 1. System Settings
  console.log("⚙️  Configuring System Settings...");
  await prisma.systemSettings.upsert({
    where: { id: "global" },
    update: {
      confidenceThreshold: 0.80,
      plasticRate: 10,
      paperRate: 8,
      cardboardRate: 8,
      glassRate: 6,
      metalRate: 12,
      organicRate: 5,
      ewasteRate: 15,
      maxWeightPerSubmission: 50.0,
      aiProvider: "gemini",
      aiModelId: "gemini-3.1-flash-lite",
    },
    create: {
      id: "global",
      confidenceThreshold: 0.80,
      plasticRate: 10,
      paperRate: 8,
      cardboardRate: 8,
      glassRate: 6,
      metalRate: 12,
      organicRate: 5,
      ewasteRate: 15,
      maxWeightPerSubmission: 50.0,
      aiProvider: "gemini",
      aiModelId: "gemini-3.1-flash-lite",
    },
  });

  // 2. Sample Stores (Indian Regional Centers)
  console.log("🏬 Creating Sample Environmental Stores...");
  const store1 = await prisma.sampleStore.upsert({
    where: { storeCode: "STORE-HYD-01" },
    update: {
      name: "EcoSort Central Hub — HITEC City",
      address: "Plot 22, Cyber Gateway Sector, Madhapur",
      city: "Hyderabad",
      description: "Primary citizen segregation drop-off point and Green Coin reward redemption desk.",
      phone: "+91 40 6712 4001",
      imageUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80",
      isActive: true,
    },
    create: {
      storeCode: "STORE-HYD-01",
      name: "EcoSort Central Hub — HITEC City",
      address: "Plot 22, Cyber Gateway Sector, Madhapur",
      city: "Hyderabad",
      description: "Primary citizen segregation drop-off point and Green Coin reward redemption desk.",
      phone: "+91 40 6712 4001",
      imageUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80",
      isActive: true,
    },
  });

  const store2 = await prisma.sampleStore.upsert({
    where: { storeCode: "STORE-BLR-02" },
    update: {
      name: "EcoSort Sustainability Depot — Indiranagar",
      address: "100 Feet Road, HAL 2nd Stage, Indiranagar",
      city: "Bengaluru",
      description: "Community partner store for organic compost drop, sapling exchange, and upcycled lifestyle goods.",
      phone: "+91 80 4125 7800",
      imageUrl: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=600&auto=format&fit=crop&q=80",
      isActive: true,
    },
    create: {
      storeCode: "STORE-BLR-02",
      name: "EcoSort Sustainability Depot — Indiranagar",
      address: "100 Feet Road, HAL 2nd Stage, Indiranagar",
      city: "Bengaluru",
      description: "Community partner store for organic compost drop, sapling exchange, and upcycled lifestyle goods.",
      phone: "+91 80 4125 7800",
      imageUrl: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=600&auto=format&fit=crop&q=80",
      isActive: true,
    },
  });

  const store3 = await prisma.sampleStore.upsert({
    where: { storeCode: "STORE-PUN-03" },
    update: {
      name: "EcoSort Resource Recovery Center — Kothrud",
      address: "Paud Road, Near Vanaz Corner, Kothrud",
      city: "Pune",
      description: "High-capacity segregation depot and municipal recycling transfer partner.",
      phone: "+91 20 2543 9200",
      imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
      isActive: true,
    },
    create: {
      storeCode: "STORE-PUN-03",
      name: "EcoSort Resource Recovery Center — Kothrud",
      address: "Paud Road, Near Vanaz Corner, Kothrud",
      city: "Pune",
      description: "High-capacity segregation depot and municipal recycling transfer partner.",
      phone: "+91 20 2543 9200",
      imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
      isActive: true,
    },
  });

  // 3. Badges
  console.log("🏅 Creating Achievement Badges...");
  const badgesData = [
    {
      slug: "first-recycling",
      name: "First Recycling",
      description: "Successfully made your first verified waste submission.",
      iconName: "Sparkles",
      category: "Milestone",
    },
    {
      slug: "5-submissions",
      name: "High Five Recycler",
      description: "Completed 5 approved waste segregation submissions.",
      iconName: "Award",
      category: "Activity",
    },
    {
      slug: "10kg-recycled",
      name: "10kg Champion",
      description: "Recycled over 10 kg of verified segregated waste.",
      iconName: "Trophy",
      category: "Weight",
    },
    {
      slug: "plastic-saver",
      name: "Plastic Warrior",
      description: "Diverted more than 5 kg of single-use plastic from landfills.",
      iconName: "ShieldCheck",
      category: "Category",
    },
    {
      slug: "reward-redeemer",
      name: "Reward Collector",
      description: "Redeemed your first sustainable reward from the marketplace.",
      iconName: "Gift",
      category: "Redemption",
    },
    {
      slug: "green-champion",
      name: "Green Champion",
      description: "Ascended to Eco Level 3 through consistent civic recycling.",
      iconName: "Medal",
      category: "Level",
    },
  ];

  const badges = {};
  for (const b of badgesData) {
    badges[b.slug] = await prisma.badge.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
  }

  // 4. Rewards
  console.log("🎁 Creating Marketplace Rewards...");
  const reward1 = await prisma.reward.upsert({
    where: { rewardCode: "REW-BAG-001" },
    update: {
      sampleStoreId: store1.id,
    },
    create: {
      rewardCode: "REW-BAG-001",
      title: "Eco-Friendly Jute Shopping Bag",
      description: "Heavy-duty 100% biodegradable natural jute tote bag with reinforced handles.",
      category: "Eco-Product",
      coinCost: 60,
      stock: 45,
      imageUrl: "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=600&auto=format&fit=crop&q=80",
      isActive: true,
      sampleStoreId: store1.id,
      expiryDate: new Date("2027-12-31"),
    },
  });

  const reward2 = await prisma.reward.upsert({
    where: { rewardCode: "REW-BOTTLE-002" },
    update: {
      sampleStoreId: store1.id,
    },
    create: {
      rewardCode: "REW-BOTTLE-002",
      title: "Stainless Steel Insulated Flask (750ml)",
      description: "Double-wall vacuum insulated reusable water bottle keeping drinks cold for 24h.",
      category: "Eco-Product",
      coinCost: 120,
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
      isActive: true,
      sampleStoreId: store1.id,
      expiryDate: new Date("2027-12-31"),
    },
  });

  const reward3 = await prisma.reward.upsert({
    where: { rewardCode: "REW-SAPLING-003" },
    update: {
      sampleStoreId: store2.id,
    },
    create: {
      rewardCode: "REW-SAPLING-003",
      title: "Native Neem Tree Sapling",
      description: "Potted native sapling ready for household or community planting.",
      category: "Sapling",
      coinCost: 40,
      stock: 100,
      imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format&fit=crop&q=80",
      isActive: true,
      sampleStoreId: store2.id,
      expiryDate: new Date("2027-12-31"),
    },
  });

  const reward4 = await prisma.reward.upsert({
    where: { rewardCode: "REW-SEED-004" },
    update: {
      sampleStoreId: store2.id,
    },
    create: {
      rewardCode: "REW-SEED-004",
      title: "Plantable Seed Stationery Set",
      description: "Pack of 5 recycled paper pencils embedded with herb seeds (Basil, Marigold, Tomato).",
      category: "Eco-Product",
      coinCost: 35,
      stock: 60,
      imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80",
      isActive: true,
      sampleStoreId: store2.id,
      expiryDate: new Date("2027-12-31"),
    },
  });

  const reward5 = await prisma.reward.upsert({
    where: { rewardCode: "REW-VOUCH-005" },
    update: {
      sampleStoreId: store1.id,
    },
    create: {
      rewardCode: "REW-VOUCH-005",
      title: "Organic Market 20% Discount Voucher",
      description: "Digital voucher redeemable for fresh organic produce at partner farm stands.",
      category: "Voucher",
      coinCost: 50,
      stock: 75,
      imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80",
      isActive: true,
      sampleStoreId: store1.id,
      expiryDate: new Date("2027-12-31"),
    },
  });

  const reward6 = await prisma.reward.upsert({
    where: { rewardCode: "REW-TREE-006" },
    update: {},
    create: {
      rewardCode: "REW-TREE-006",
      title: "Plant a Real Tree in Community Forest",
      description: "EcoSort partners plant a geo-tagged fruit tree in your honor with coordinates.",
      category: "Digital",
      coinCost: 250,
      stock: 50,
      imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80",
      isActive: true,
      expiryDate: new Date("2027-12-31"),
    },
  });

  // 5. Challenges
  console.log("🎯 Creating Eco Challenges...");
  const chal1 = await prisma.challenge.upsert({
    where: { id: "chal-plastic-weekly" },
    update: {},
    create: {
      id: "chal-plastic-weekly",
      title: "Weekly Plastic Pioneer",
      description: "Recycle at least 2.5 kg of segregated plastic waste this week.",
      targetType: "RECYCLE_WEIGHT",
      targetCategory: "PLASTIC",
      targetValue: 2.5,
      coinReward: 40,
      startDate: new Date(Date.now() - 3 * 86400000),
      endDate: new Date(Date.now() + 11 * 86400000),
      isActive: true,
    },
  });

  const chal2 = await prisma.challenge.upsert({
    where: { id: "chal-submissions-triple" },
    update: {},
    create: {
      id: "chal-submissions-triple",
      title: "Triple Sorter Milestone",
      description: "Submit 3 distinct approved waste items for verification.",
      targetType: "SUBMISSION_COUNT",
      targetValue: 3.0,
      coinReward: 30,
      startDate: new Date(Date.now() - 5 * 86400000),
      endDate: new Date(Date.now() + 9 * 86400000),
      isActive: true,
    },
  });

  const chal3 = await prisma.challenge.upsert({
    where: { id: "chal-paper-drive" },
    update: {},
    create: {
      id: "chal-paper-drive",
      title: "City Paper & Cardboard Drive",
      description: "Recycle 4.0 kg of clean paper or cardboard boxes.",
      targetType: "RECYCLE_WEIGHT",
      targetCategory: "PAPER",
      targetValue: 4.0,
      coinReward: 50,
      startDate: new Date(Date.now() - 2 * 86400000),
      endDate: new Date(Date.now() + 14 * 86400000),
      isActive: true,
    },
  });

  // 6. Admin Account
  console.log("👑 Creating Admin Account...");
  const adminPasswordHash = await bcrypt.hash("AdminPass123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ecosort.com" },
    update: {
      name: "EcoSort Platform Administrator",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      status: "ACTIVE",
      address: "EcoSort Technology Park, HITEC City, Hyderabad, Telangana - 500081",
      mobile: "+91 80080 12000",
    },
    create: {
      name: "EcoSort Platform Administrator",
      email: "admin@ecosort.com",
      mobile: "+91 80080 12000",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      status: "ACTIVE",
      address: "EcoSort Technology Park, HITEC City, Hyderabad, Telangana - 500081",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      adminEmail: admin.email,
      action: "SYSTEM_INITIALIZED",
      details: "Initial EcoSort database setup completed with production rules and catalogs.",
      ipAddress: "127.0.0.1",
    },
  });

  // 7. Standard Citizen Account
  console.log("👥 Creating Primary Citizen Account...");
  const citizenPasswordHash = await bcrypt.hash("CitizenPass123!", 10);

  const citizen = await prisma.user.upsert({
    where: { email: "citizen@ecosort.com" },
    update: {
      name: "Aarav Sharma",
      passwordHash: citizenPasswordHash,
      role: "CITIZEN",
      status: "ACTIVE",
      address: "Flat 402, Green Meadows, Madhapur, Hyderabad, Telangana - 500081",
      mobile: "+91 98490 23456",
    },
    create: {
      name: "Aarav Sharma",
      email: "citizen@ecosort.com",
      mobile: "+91 98490 23456",
      passwordHash: citizenPasswordHash,
      role: "CITIZEN",
      status: "ACTIVE",
      address: "Flat 402, Green Meadows, Madhapur, Hyderabad, Telangana - 500081",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    },
  });

  await prisma.citizenProfile.upsert({
    where: { userId: citizen.id },
    update: {
      ecoLevel: 2,
      ecoTitle: "Eco Explorer",
      totalApprovedWeightKg: 12.5,
      approvedSubmissionsCount: 4,
      city: "Hyderabad",
    },
    create: {
      userId: citizen.id,
      ecoLevel: 2,
      ecoTitle: "Eco Explorer",
      totalApprovedWeightKg: 12.5,
      approvedSubmissionsCount: 4,
      city: "Hyderabad",
    },
  });

  const citizenWallet = await prisma.wallet.upsert({
    where: { userId: citizen.id },
    update: {
      balance: 150,
      totalEarned: 210,
      totalSpent: 60,
    },
    create: {
      userId: citizen.id,
      balance: 150,
      totalEarned: 210,
      totalSpent: 60,
    },
  });

  // 8. Seed Submissions: Approved Historical & Active PENDING for Analyzer Verification
  console.log("📦 Creating Submissions (Historical & Active Pending Queue)...");

  // A. Active PENDING Submissions for Admin Analyzer Demonstration
  const pendingSubmissions = [
    {
      code: "ECO-SUB-00101",
      userCat: "PLASTIC",
      weight: 2.4,
      img: "https://images.unsplash.com/photo-1526951521990-620dc14c214b?w=600&auto=format&fit=crop&q=80", // Plastic bottles
      hash: "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
      createdAt: new Date(Date.now() - 2 * 3600000), // 2 hours ago
    },
    {
      code: "ECO-SUB-00102",
      userCat: "CARDBOARD",
      weight: 3.5,
      img: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80", // Cardboard shipping boxes
      hash: "b2c3d4e5f6a10718293a4b5c6d7e8f90123456789abcdef0123456789abcdef1",
      createdAt: new Date(Date.now() - 5 * 3600000), // 5 hours ago
    },
    {
      code: "ECO-SUB-00103",
      userCat: "GLASS",
      weight: 1.8,
      img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80", // Glass jars & bottles
      hash: "c3d4e5f6a1b20718293a4b5c6d7e8f90123456789abcdef0123456789abcdef2",
      createdAt: new Date(Date.now() - 9 * 3600000), // 9 hours ago
    },
    {
      code: "ECO-SUB-00104",
      userCat: "PAPER",
      weight: 1.5,
      img: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80", // Clean sorted paper
      hash: "d4e5f6a1b2c30718293a4b5c6d7e8f90123456789abcdef0123456789abcdef3",
      createdAt: new Date(Date.now() - 12 * 3600000), // 12 hours ago
    },
    {
      code: "ECO-SUB-00105",
      userCat: "ORGANIC",
      weight: 3.2,
      img: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=600&auto=format&fit=crop&q=80", // Compostable fruit & vegetable scraps
      hash: "e5f6a1b2c3d40718293a4b5c6d7e8f90123456789abcdef0123456789abcdef4",
      createdAt: new Date(Date.now() - 16 * 3600000), // 16 hours ago
    },
  ];

  for (const s of pendingSubmissions) {
    await prisma.wasteSubmission.upsert({
      where: { submissionCode: s.code },
      update: {
        status: "PENDING",
        verificationMethod: "NONE",
        userSelectedCategory: s.userCat,
        imageUrl: s.img,
        weightKg: s.weight,
      },
      create: {
        submissionCode: s.code,
        userId: citizen.id,
        userSelectedCategory: s.userCat,
        imageUrl: s.img,
        imageHash: s.hash,
        weightKg: s.weight,
        coinsAwarded: 0,
        status: "PENDING",
        verificationMethod: "NONE",
        createdAt: s.createdAt,
      },
    });
  }

  // B. Historical Approved Submissions
  const approvedSubmissions = [
    {
      code: "ECO-SUB-00001",
      userCat: "PLASTIC",
      aiCat: "PLASTIC",
      conf: 0.94,
      weight: 2.2,
      coins: 22,
      img: "https://images.unsplash.com/photo-1526951521990-620dc14c214b?w=600&auto=format&fit=crop&q=80", // Plastic bottles
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      createdAt: new Date(Date.now() - 10 * 86400000),
    },
    {
      code: "ECO-SUB-00002",
      userCat: "CARDBOARD",
      aiCat: "CARDBOARD",
      conf: 0.91,
      weight: 3.5,
      coins: 28,
      img: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80", // Cardboard boxes
      hash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      createdAt: new Date(Date.now() - 7 * 86400000),
    },
    {
      code: "ECO-SUB-00003",
      userCat: "METAL",
      aiCat: "METAL",
      conf: 0.89,
      weight: 2.8,
      coins: 33,
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80", // Aluminum cans
      hash: "c2c5ff296f8a48b3096057209ff8cf8402ffb9c4501a4e1d51cd1a0c4f82875b",
      createdAt: new Date(Date.now() - 5 * 86400000),
    },
    {
      code: "ECO-SUB-00004",
      userCat: "ORGANIC",
      aiCat: "ORGANIC",
      conf: 0.93,
      weight: 4.0,
      coins: 20,
      img: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=600&auto=format&fit=crop&q=80", // Compostable organic matter
      hash: "11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
      createdAt: new Date(Date.now() - 2 * 86400000),
    },
    {
      code: "ECO-SUB-00005",
      userCat: "E_WASTE",
      aiCat: "E_WASTE",
      conf: 0.95,
      weight: 1.2,
      coins: 18,
      img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80", // Electronics & cables
      hash: "99887766554433221100aabbccddeeff99887766554433221100aabbccddeeff",
      createdAt: new Date(Date.now() - 1 * 86400000),
    },
  ];

  for (const s of approvedSubmissions) {
    await prisma.wasteSubmission.upsert({
      where: { submissionCode: s.code },
      update: {
        status: "APPROVED",
        verificationMethod: "AI_ASSISTED",
        coinsAwarded: s.coins,
        imageUrl: s.img,
        userSelectedCategory: s.userCat,
      },
      create: {
        submissionCode: s.code,
        userId: citizen.id,
        userSelectedCategory: s.userCat,
        aiPredictedCategory: s.aiCat,
        aiConfidence: s.conf,
        aiModelUsed: "gemini-3.1-flash-lite",
        imageUrl: s.img,
        imageHash: s.hash,
        weightKg: s.weight,
        coinsAwarded: s.coins,
        status: "APPROVED",
        verificationMethod: "AI_ASSISTED",
        reviewedById: admin.id,
        reviewedAt: s.createdAt,
        createdAt: s.createdAt,
      },
    });
  }

  // Seed Citizen's Transactions
  const txns = [
    { code: "ECO-TXN-00001", type: "WASTE_REWARD", amount: 22, bal: 22, desc: "Recycled 2.2 kg Plastic (ECO-SUB-00001)", ref: "ECO-SUB-00001", dt: 10 },
    { code: "ECO-TXN-00002", type: "WASTE_REWARD", amount: 28, bal: 50, desc: "Recycled 3.5 kg Cardboard (ECO-SUB-00002)", ref: "ECO-SUB-00002", dt: 7 },
    { code: "ECO-TXN-00003", type: "WASTE_REWARD", amount: 33, bal: 83, desc: "Recycled 2.8 kg Metal (ECO-SUB-00003)", ref: "ECO-SUB-00003", dt: 5 },
    { code: "ECO-TXN-00004", type: "REWARD_REDEMPTION", amount: -60, bal: 23, desc: "Redeemed Eco-Friendly Jute Bag", ref: "ECO-RED-00001", dt: 4 },
    { code: "ECO-TXN-00005", type: "WASTE_REWARD", amount: 20, bal: 43, desc: "Recycled 4.0 kg Organic (ECO-SUB-00004)", ref: "ECO-SUB-00004", dt: 2 },
    { code: "ECO-TXN-00006", type: "CHALLENGE_BONUS", amount: 30, bal: 73, desc: "Completed Triple Sorter Challenge", ref: "chal-submissions-triple", dt: 1 },
  ];

  for (const t of txns) {
    await prisma.walletTransaction.upsert({
      where: { transactionCode: t.code },
      update: {},
      create: {
        transactionCode: t.code,
        walletId: citizenWallet.id,
        type: t.type,
        amount: t.amount,
        balanceAfter: t.bal,
        description: t.desc,
        referenceId: t.ref,
        createdAt: new Date(Date.now() - t.dt * 86400000),
      },
    });
  }

  // Seed Citizen's Redemption
  await prisma.redemption.upsert({
    where: { redemptionCode: "ECO-RED-00001" },
    update: {},
    create: {
      redemptionCode: "ECO-RED-00001",
      userId: citizen.id,
      rewardId: reward1.id,
      coinCost: 60,
      status: "REDEEMED",
      qrSecret: "qr-sec-ecosort-red-00001-xyz",
      redeemedAt: new Date(Date.now() - 4 * 86400000),
      adminNotes: "Collected at EcoSort Central Hub (HITEC City, Hyderabad) counter #1 by Aarav Sharma.",
    },
  });

  // Citizen's Badges
  await prisma.citizenBadge.upsert({
    where: { userId_badgeId: { userId: citizen.id, badgeId: badges["first-recycling"].id } },
    update: {},
    create: { userId: citizen.id, badgeId: badges["first-recycling"].id },
  });
  await prisma.citizenBadge.upsert({
    where: { userId_badgeId: { userId: citizen.id, badgeId: badges["10kg-recycled"].id } },
    update: {},
    create: { userId: citizen.id, badgeId: badges["10kg-recycled"].id },
  });

  // Citizen's Challenge Progress
  await prisma.citizenChallengeProgress.upsert({
    where: { userId_challengeId: { userId: citizen.id, challengeId: chal1.id } },
    update: {},
    create: {
      userId: citizen.id,
      challengeId: chal1.id,
      currentValue: 1.8,
      isCompleted: false,
      isClaimed: false,
    },
  });

  // Citizen's Notifications
  const notifications = [
    { title: "Submission Approved! (+20 GC)", msg: "Your 4.0 kg Organic waste submission (ECO-SUB-00004) was verified.", type: "SUBMISSION_APPROVED", dt: 2 },
    { title: "Eco Level Up! 🌟", msg: "Congratulations! You have been promoted to Level 2: Eco Explorer.", type: "BADGE_UNLOCKED", dt: 5 },
    { title: "Reward Redeemed", msg: "Your Eco-Friendly Jute Bag redemption (ECO-RED-00001) was completed.", type: "REWARD_REDEEMED", dt: 4 },
  ];

  for (const n of notifications) {
    await prisma.notification.create({
      data: {
        userId: citizen.id,
        title: n.title,
        message: n.msg,
        type: n.type,
        isRead: false,
        createdAt: new Date(Date.now() - n.dt * 86400000),
      },
    });
  }

  // Other Citizens for Leaderboard (Diverse Indian Cities)
  const otherCitizens = [
    {
      name: "Karthik Venkatraman",
      email: "karthik.v@ecosort.in",
      mobile: "+91 98801 84729",
      address: "Prestige Shantiniketan, Whitefield, Bengaluru, Karnataka - 560066",
      city: "Bengaluru",
      weight: 45.2,
      subs: 12,
      coins: 520,
      level: 4,
      title: "Eco Hero",
    },
    {
      name: "Ananya Deshmukh",
      email: "ananya.d@ecosort.in",
      mobile: "+91 98203 71940",
      address: "Sea Breeze Towers, Worli, Mumbai, Maharashtra - 400030",
      city: "Mumbai",
      weight: 28.4,
      subs: 8,
      coins: 310,
      level: 3,
      title: "Green Champion",
    },
    {
      name: "Rajeshwari Reddy",
      email: "rajeshwari.r@ecosort.in",
      mobile: "+91 94401 55231",
      address: "MVP Colony, Beach Road, Visakhapatnam, Andhra Pradesh - 530017",
      city: "Visakhapatnam",
      weight: 18.0,
      subs: 5,
      coins: 195,
      level: 2,
      title: "Eco Explorer",
    },
    {
      name: "Gurpreet Singh",
      email: "gurpreet.s@ecosort.in",
      mobile: "+91 98720 44810",
      address: "Model Town, Ludhiana, Punjab - 141002",
      city: "Ludhiana",
      weight: 22.6,
      subs: 6,
      coins: 240,
      level: 3,
      title: "Green Champion",
    },
    {
      name: "Pooja Chundawat",
      email: "pooja.c@ecosort.in",
      mobile: "+91 94140 88219",
      address: "Malviya Nagar, Jaipur, Rajasthan - 302017",
      city: "Jaipur",
      weight: 14.8,
      subs: 4,
      coins: 160,
      level: 2,
      title: "Eco Explorer",
    },
  ];

  for (const oc of otherCitizens) {
    const user = await prisma.user.upsert({
      where: { email: oc.email },
      update: {
        name: oc.name,
        address: oc.address,
        mobile: oc.mobile,
      },
      create: {
        name: oc.name,
        email: oc.email,
        mobile: oc.mobile,
        passwordHash: citizenPasswordHash,
        role: "CITIZEN",
        status: "ACTIVE",
        address: oc.address,
      },
    });

    await prisma.citizenProfile.upsert({
      where: { userId: user.id },
      update: {
        city: oc.city,
      },
      create: {
        userId: user.id,
        ecoLevel: oc.level,
        ecoTitle: oc.title,
        totalApprovedWeightKg: oc.weight,
        approvedSubmissionsCount: oc.subs,
        city: oc.city,
      },
    });

    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        balance: oc.coins,
        totalEarned: oc.coins,
        totalSpent: 0,
      },
    });
  }

  console.log("✅ EcoSort seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
