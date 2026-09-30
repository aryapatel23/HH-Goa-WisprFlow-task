import { PrismaClient, Role, MealSlot, ComplaintCategory, Sentiment, UrgencyLevel } from "@prisma/client";

const prisma = new PrismaClient();

const INDIAN_STUDENT_NAMES = [
  "Aarav Sharma", "Ananya Iyer", "Rohan Verma", "Priya Patel", "Siddharth Rao",
  "Tanvi Deshmukh", "Vikram Singh", "Neha Gupta", "Kabir Mehta", "Sneha Reddy",
  "Aditya Kulkarni", "Ishita Joshi", "Arjun Nair", "Kavya Menon", "Dhruv Bansal",
  "Pooja Hegde", "Rahul Chauhan", "Riya Sen", "Ayush Saxena", "Meera Pillai",
  "Karan Malhotra", "Diya Bhatt", "Devansh Tiwari", "Saanvi Agarwal", "Manish Pandey",
  "Swati Roy", "Harsh Vardhan", "Shreya Das", "Pranav Chawla", "Nandini Mishra",
  "Rakesh Yadav", "Avani Shah", "Nikhil Kapoor", "Anushka Dubey", "Gaurav Soni",
  "Pallavi Nambiar", "Abhishek Jena", "Bhavna Jain", "Yash Singhal", "Tarun Kaushik",
  "Komal Sethi", "Varun Bhatia", "Simran Gill", "Aakash Choudhary", "Divya Thakur",
  "Suresh Patil", "Shruti Mathur", "Mohit Aggarwal", "Isha Narang", "Deepak Rawat"
];

const HOSTEL_BLOCKS = ["Block A", "Block B", "Block C", "Block D"];

async function main() {
  console.log("🌱 Starting realistic MassMatter Indian Hostel database seeding...");

  // 1. Clean existing records in correct relation order
  await prisma.rating.deleteMany();
  await prisma.skip.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.user.deleteMany();
  await prisma.weeklyReport.deleteMany();

  console.log("🧹 Cleared old data.");

  // 2. Demo Accounts: Student, Manager, and Admin
  const demoStudent = await prisma.user.create({
    data: {
      email: "student@massmatter.com",
      name: "Aarav Sharma (Demo Student)",
      role: Role.student,
      hostelBlock: "Block B",
      roomNumber: "B-204",
      streak: {
        create: {
          currentStreak: 5,
          longestStreak: 12,
          lastSkipDate: new Date(),
          lastPlateDate: new Date(),
        },
      },
    },
  });

  const demoManager = await prisma.user.create({
    data: {
      email: "manage@massmatter.com",
      name: "Rameshwar Prasad (Mess Manager)",
      role: Role.manager,
      hostelBlock: "Admin Quarters",
      roomNumber: "M-01",
    },
  });

  const demoAdmin = await prisma.user.create({
    data: {
      email: "admin@massmatter.com",
      name: "Prof. S. K. Kulkarni (Chief Admin)",
      role: Role.admin,
      hostelBlock: "Admin Building",
      roomNumber: "W-101",
    },
  });
  console.log("✅ Created 3 Dedicated Demo Accounts (student@massmatter.com, manage@massmatter.com, admin@massmatter.com).");

  // 4. Create 50 Fake Students with Streaks
  const createdStudents = [];
  for (let i = 0; i < INDIAN_STUDENT_NAMES.length; i++) {
    const name = INDIAN_STUDENT_NAMES[i];
    const username = name.toLowerCase().replace(/\s+/g, ".");
    const block = HOSTEL_BLOCKS[i % HOSTEL_BLOCKS.length];
    const room = `${(Math.floor(i / 10) + 1) * 100 + ((i % 10) + 1)}`;
    const streakDays = (i * 3 + 2) % 15;

    const student = await prisma.user.create({
      data: {
        email: `${username}@student.raiuniversity.edu`,
        name,
        role: Role.student,
        hostelBlock: block,
        roomNumber: room,
        streak: {
          create: {
            currentStreak: streakDays,
            longestStreak: Math.max(streakDays, streakDays + 3),
            lastSkipDate: new Date(),
            lastPlateDate: new Date(),
          },
        },
      },
    });
    createdStudents.push(student);
  }
  console.log(`✅ Created ${createdStudents.length} student profiles with Waste-Free streaks.`);

  // 5. Create a Full Week of Meals & Dishes (Mon to Sun)
  // Let's base it around current week: Monday to Sunday
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon
  const mondayOffset = (dayOfWeek + 6) % 7; // days since Monday
  const mondayDate = new Date(today);
  mondayDate.setDate(today.getDate() - mondayOffset);
  mondayDate.setHours(0, 0, 0, 0);

  const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const createdMeals = [];
  const allCreatedDishes = [];

  for (let d = 0; d < 7; d++) {
    const mealDate = new Date(mondayDate);
    mealDate.setDate(mondayDate.getDate() + d);

    // Meal Slots per day: breakfast, lunch, snacks, dinner
    const slotsConfig: {
      slot: MealSlot;
      startTime: string;
      endTime: string;
      cutoffHour: number;
      dishes: { name: string; category: string }[];
    }[] = [
      {
        slot: MealSlot.breakfast,
        startTime: "07:30",
        endTime: "09:30",
        cutoffHour: 6,
        dishes: d % 2 === 0
          ? [
              { name: "Poha with Roasted Peanuts", category: "Breakfast" },
              { name: "Masala Chai (Tea)", category: "Beverage" },
              { name: "Bread, Butter & Mixed Jam", category: "Sides" },
              { name: "Fresh Banana", category: "Fruit" },
            ]
          : [
              { name: "Aloo Paratha with Curd & Pickle", category: "Breakfast" },
              { name: "Special Cutting Chai (Tea)", category: "Beverage" },
              { name: "Boiled Eggs / Sprouts", category: "Protein" },
            ],
      },
      {
        slot: MealSlot.lunch,
        startTime: "12:30",
        endTime: "14:30",
        cutoffHour: 10,
        dishes: [
          { name: "Steamed Basmati Rice", category: "Main" },
          { name: "Dal Tadka with Jeera Hing", category: "Dal" },
          { name: d % 3 === 0 ? "Aloo Gobi Matar Sabji" : d % 3 === 1 ? "Bhindi Masala" : "Rajma Masala", category: "Sabji" },
          { name: "Fresh Phulka Roti", category: "Breads" },
          { name: "Boondi Raita / Curd", category: "Sides" },
          { name: "Cucumber Onion Salad", category: "Salad" },
        ],
      },
      {
        slot: MealSlot.snacks,
        startTime: "17:00",
        endTime: "18:00",
        cutoffHour: 15,
        dishes: [
          { name: "Adrak Elaichi Chai (Tea)", category: "Beverage" },
          { name: d % 2 === 0 ? "Aloo Samosa with Mint Chutney" : "Mix Veg Pakoda", category: "Snacks" },
        ],
      },
      {
        slot: MealSlot.dinner,
        startTime: "20:00",
        endTime: "22:00",
        cutoffHour: 18,
        dishes: [
          { name: d % 2 === 0 ? "Paneer Sabji (Paneer Butter Masala)" : "Kadai Paneer Sabji", category: "Special Sabji" },
          { name: "Dal Fry / Yellow Dal", category: "Dal" },
          { name: "Jeera Rice", category: "Rice" },
          { name: "Desi Ghee Phulka Roti", category: "Breads" },
          { name: "Moong Dal Khichdi (Light Meal)", category: "Comfort Food" },
          { name: d % 2 === 0 ? "Hot Gulab Jamun" : "Rice Kheer", category: "Dessert" },
        ],
      },
    ];

    for (const conf of slotsConfig) {
      const cutoff = new Date(mealDate);
      cutoff.setHours(conf.cutoffHour, 0, 0, 0);

      const meal = await prisma.meal.create({
        data: {
          date: mealDate,
          slot: conf.slot,
          startTime: conf.startTime,
          endTime: conf.endTime,
          cutoffTime: cutoff,
          dishes: {
            create: conf.dishes,
          },
        },
        include: { dishes: true },
      });

      createdMeals.push(meal);
      allCreatedDishes.push(...meal.dishes);
    }
  }

  console.log(`✅ Created full week schedule: ${createdMeals.length} meals and ${allCreatedDishes.length} dishes.`);

  // 6. Seed Sample Ratings from Students
  console.log("⭐️ Generating realistic student meal ratings...");
  const reactions = ["Bahut badiya!", "Paneer was great", "Roti was hard", "Too oily", "Loved the dal", "Good taste", "Avg", "Amazing tea"];

  let ratingCount = 0;
  for (const meal of createdMeals) {
    // Pick 15-30 students per meal to rate
    const numRaters = 15 + Math.floor(Math.random() * 15);
    const shuffledStudents = [...createdStudents].sort(() => 0.5 - Math.random()).slice(0, numRaters);

    for (const student of shuffledStudents) {
      // Rate the meal or a specific dish
      const randomDish = meal.dishes[Math.floor(Math.random() * meal.dishes.length)];
      let star = 3;

      if (randomDish.name.includes("Paneer") || randomDish.name.includes("Gulab Jamun") || randomDish.name.includes("Chai")) {
        star = Math.random() > 0.25 ? 5 : 4; // High ratings for favorites
      } else if (randomDish.name.includes("Phulka Roti") || randomDish.name.includes("Bhindi")) {
        star = Math.random() > 0.4 ? 3 : 2; // Mixed ratings
      } else {
        star = Math.floor(Math.random() * 3) + 3; // 3 to 5
      }

      await prisma.rating.create({
        data: {
          star,
          reaction: reactions[Math.floor(Math.random() * reactions.length)],
          userId: student.id,
          mealId: meal.id,
          dishId: randomDish.id,
        },
      });
      ratingCount++;
    }
  }
  console.log(`✅ Seeded ${ratingCount} realistic ratings.`);

  // 7. Seed Skips (Especially for Dinners and Lunches)
  console.log("🍽️ Generating meal skips...");
  const skipReasons = [
    "Eating out with friends",
    "Attending robotics workshop",
    "Feeling feverish / taking light outside fruits",
    "Late lab session",
    "Going home for the weekend",
    "Fasting today"
  ];

  let skipCount = 0;
  for (const meal of createdMeals) {
    if (meal.slot === MealSlot.dinner || meal.slot === MealSlot.lunch) {
      // 5 to 14 students skip per meal
      const numSkips = 5 + Math.floor(Math.random() * 10);
      const skippingStudents = [...createdStudents].sort(() => 0.5 - Math.random()).slice(0, numSkips);

      for (const student of skippingStudents) {
        try {
          await prisma.skip.create({
            data: {
              userId: student.id,
              mealId: meal.id,
              reason: skipReasons[Math.floor(Math.random() * skipReasons.length)],
            },
          });
          skipCount++;
        } catch {
          // ignore duplicate in same meal
        }
      }
    }
  }
  console.log(`✅ Seeded ${skipCount} advance meal skips for accurate headcount forecasting.`);

  // 8. Seed Anonymous Complaints (Hindi and English) - NO userId
  console.log("🗣️ Seeding anonymous complaints in Hindi & English (with linkDetail)...");
  const complaintsData: {
    text: string;
    language: string;
    category: ComplaintCategory;
    sentiment: Sentiment;
    urgency: UrgencyLevel;
    linkDetail: string;
    dishKeyword?: string;
  }[] = [
    {
      text: "aaj ka paneer bahut oily tha, aur roti kacchi thi",
      language: "hinglish",
      category: ComplaintCategory.TASTE,
      sentiment: Sentiment.NEGATIVE,
      urgency: UrgencyLevel.MEDIUM,
      linkDetail: "Mess Counter 1 - Dinner Service",
      dishKeyword: "Paneer",
    },
    {
      text: "dal me bilkul namak nahi hai aur thandi serve ki gayi hai",
      language: "hindi",
      category: ComplaintCategory.TASTE,
      sentiment: Sentiment.NEGATIVE,
      urgency: UrgencyLevel.LOW,
      linkDetail: "Lunch Dal Dispenser",
      dishKeyword: "Dal",
    },
    {
      text: "subah ka poha bilkul dry tha aur peanuts jale hue the",
      language: "hinglish",
      category: ComplaintCategory.TASTE,
      sentiment: Sentiment.NEGATIVE,
      urgency: UrgencyLevel.LOW,
      linkDetail: "Breakfast Counter",
      dishKeyword: "Poha",
    },
    {
      text: "dinner ke time rice aur dal tadka 9:15 baje hi khatam ho gaya tha",
      language: "hindi",
      category: ComplaintCategory.QUANTITY,
      sentiment: Sentiment.NEGATIVE,
      urgency: UrgencyLevel.HIGH,
      linkDetail: "Late Dinner Shift",
      dishKeyword: "Rice",
    },
    {
      text: "water dispenser ke paas paani phaila hua hai aur bohot gandi smell aa rahi hai",
      language: "hindi",
      category: ComplaintCategory.HYGIENE,
      sentiment: Sentiment.NEGATIVE,
      urgency: UrgencyLevel.CRITICAL,
      linkDetail: "Water Cooler Area, Block B Side",
    },
    {
      text: "The plates in the rack were greasy and had residue on them. Please ensure hotter wash water.",
      language: "en",
      category: ComplaintCategory.HYGIENE,
      sentiment: Sentiment.NEGATIVE,
      urgency: UrgencyLevel.HIGH,
      linkDetail: "Main Plate Collection Rack",
    },
    {
      text: "Paneer sabji was very good today, but phulkas were burnt around the edges.",
      language: "en",
      category: ComplaintCategory.TASTE,
      sentiment: Sentiment.NEGATIVE,
      urgency: UrgencyLevel.MEDIUM,
      linkDetail: "Roti Tandoor Counter",
      dishKeyword: "Phulka",
    },
    {
      text: "Evening tea is too sweet these days. Please keep unsweetened black tea option or less sugar.",
      language: "en",
      category: ComplaintCategory.TASTE,
      sentiment: Sentiment.NEUTRAL,
      urgency: UrgencyLevel.LOW,
      linkDetail: "Snack Tea Urn",
      dishKeyword: "Tea",
    },
    {
      text: "Great improvement in moong dal khichdi taste on Saturday! Light and healthy.",
      language: "en",
      category: ComplaintCategory.TASTE,
      sentiment: Sentiment.POSITIVE,
      urgency: UrgencyLevel.LOW,
      linkDetail: "Saturday Dinner",
      dishKeyword: "Khichdi",
    },
    {
      text: "Counter staff refused to give a clean bowl when requested politely.",
      language: "en",
      category: ComplaintCategory.SERVICE,
      sentiment: Sentiment.NEGATIVE,
      urgency: UrgencyLevel.MEDIUM,
      linkDetail: "Counter 2 Staff",
    },
  ];

  for (const c of complaintsData) {
    let linkedDishId: string | null = null;
    let linkedMealId: string | null = null;

    if (c.dishKeyword) {
      const match = allCreatedDishes.find((d) => d.name.toLowerCase().includes(c.dishKeyword!.toLowerCase()));
      if (match) {
        linkedDishId = match.id;
        linkedMealId = match.mealId;
      }
    }

    await prisma.complaint.create({
      data: {
        text: c.text,
        language: c.language,
        category: c.category,
        sentiment: c.sentiment,
        urgency: c.urgency,
        linkDetail: c.linkDetail,
        dishId: linkedDishId,
        mealId: linkedMealId,
      },
    });
  }
  console.log(`✅ Seeded ${complaintsData.length} anonymous complaints with language & link detail.`);

  // 9. Create AI Weekly Summary Report
  const report = await prisma.weeklyReport.create({
    data: {
      weekStart: mondayDate,
      content: `### Executive Hostel Mess Summary (Rai University Pilot)
- **Total Meals Served**: 3,420
- **Total Skips Logged On-Time**: 248 (Saved ~75 kg food waste)
- **Top Rated Dish**: Paneer Sabji (4.7★ average) and Hot Gulab Jamun (4.9★)
- **Key Pain Point**: Phulka Roti consistency and Friday evening headcount drops.

#### Recommended Actions:
1. Adjust Wednesday and Friday dinner rice preparation by -18% to match student skip trends.
2. Standardize oil quantity for Paneer Sabji preparations.
3. Replace grease filters at plate washing stations.`,
      metricsJson: {
        totalRatings: ratingCount,
        totalSkips: skipCount,
        averageSatisfaction: 4.1,
        wasteReductionPercent: 22.4,
        foodSavedKg: 84.5,
      },
    },
  });
  console.log("✅ Seeded AI Weekly Report:", report.id);

  console.log("\n🎉 Full seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
