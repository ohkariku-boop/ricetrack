/** Typical plate components + logging tips. Components = definitional items only. */

export type DishGuide = {
  components: string[];
  tip: string;
};

type FoodLike = {
  name: string;
  cuisine?: string | null;
  category?: string | null;
  portion?: string | null;
};

function n(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "");
}

type Rule = {
  test: (name: string) => boolean;
  components: string[];
  tip: string;
};

/**
 * Rules are ordered specific → general.
 * List only what is standard on one serving of that named dish.
 * Use "Optional:" for common add-ons that are not always present.
 */
const RULES: Rule[] = [
  // —— SEA rice & noodles ——
  {
    test: (s) => s.includes("nasi lemak"),
    components: [
      "Coconut rice",
      "Sambal",
      "Ikan bilis",
      "Roasted peanuts",
      "Cucumber",
      "Optional: egg, fried chicken, or rendang",
    ],
    tip: "Core plate is rice + sambal + bilis + peanuts + cucumber. Log protein only if it is on your plate.",
  },
  {
    test: (s) => s.includes("nasi kerabu"),
    components: [
      "Herb or butterfly-pea rice",
      "Sambal or budu",
      "Protein (fish, chicken, or salted egg)",
      "Ulam (raw herbs/vegetables)",
      "Optional: keropok",
    ],
    tip: "Rice and protein dominate. Ulam is light; keropok and heavy sambal add more.",
  },
  {
    test: (s) => s.includes("hainanese chicken rice") || (s.includes("chicken rice") && !s.includes("fried")),
    components: [
      "Chicken (poached or roasted)",
      "Chicken-stock rice",
      "Cucumber",
      "Chilli sauce",
      "Ginger sauce",
    ],
    tip: "Rice is cooked with chicken fat and stock. Skin-on is higher fat than white meat only.",
  },
  {
    test: (s) => s.includes("nasi goreng") || (s.includes("fried rice") && !s.includes("kimchi")),
    components: [
      "Wok-fried rice",
      "Egg",
      "Protein (chicken, prawn, or meat)",
      "Sweet soy or seasoning",
    ],
    tip: "Oil and sweet soy add more than visible vegetables. Hawker servings are often large.",
  },
  {
    test: (s) => s.includes("bak kut teh"),
    components: [
      "Pork ribs",
      "Pepper or herbal broth",
      "Optional: tofu, mushrooms, youtiao",
      "Optional: rice on the side",
    ],
    tip: "Log rice and youtiao only if eaten. Broth you finish counts.",
  },
  {
    test: (s) => s.includes("laksa"),
    components: [
      "Noodles",
      "Broth (coconut curry or asam)",
      "Protein (prawn, chicken, or fishcake)",
      "Bean sprouts",
      "Optional: tofu puff (curry laksa)",
    ],
    tip: "Curry (coconut) laksa is much denser than asam laksa. Include broth you drink.",
  },
  {
    test: (s) =>
      s.includes("char kway") ||
      s.includes("char kuey") ||
      s.includes("char kuay") ||
      s.includes("chow fun"),
    components: [
      "Flat rice noodles",
      "Dark soy and seasoning",
      "Bean sprouts",
      "Egg or Chinese sausage (common)",
      "Optional: prawn or fishcake",
    ],
    tip: "Very oil-heavy. Match the plate size you ate, not a small reference photo.",
  },
  {
    test: (s) => s.includes("hokkien mee") || s.includes("hokkien mee"),
    components: [
      "Yellow noodles and rice vermicelli",
      "Prawn and pork or squid",
      "Stock-based gravy",
      "Bean sprouts",
      "Optional: lard or crispy pork bits",
    ],
    tip: "Gravy and fried aromatics drive calories. SG and MY styles differ slightly in richness.",
  },
  {
    test: (s) => s.includes("mee rebus"),
    components: [
      "Yellow noodles",
      "Sweet-spicy thickened gravy",
      "Tofu",
      "Egg",
      "Bean sprouts and green chilli",
    ],
    tip: "Gravy is starch-thickened and sweet. Full bowl including gravy is the serving.",
  },
  {
    test: (s) => s.includes("mee goreng") || s.includes("maggi goreng"),
    components: [
      "Yellow noodles or instant noodles",
      "Tomato-chilli seasoning",
      "Tofu and bean sprouts",
      "Optional: egg, potato, or seafood",
    ],
    tip: "Oil and sweet-savoury sauce dominate. Instant-noodle versions are denser.",
  },
  {
    test: (s) => s.includes("roti prata") || s.includes("roti canai"),
    components: [
      "Flaky flatbread (prata/canai)",
      "Dhal or curry dip",
    ],
    tip: "Empty prata is mostly refined carb and fat. Egg or cheese prata is denser; log the dip used.",
  },
  {
    test: (s) => s.includes("satay"),
    components: [
      "Grilled meat skewers",
      "Peanut sauce",
      "Optional: ketupat or cucumber and onion",
    ],
    tip: "Count skewers. Peanut sauce is calorie-dense — log how much you used.",
  },
  {
    test: (s) => s.includes("rendang"),
    components: [
      "Slow-cooked beef or chicken",
      "Coconut and spice paste",
      "Optional: rice (usually separate)",
    ],
    tip: "Rich coconut dish. If rice came with it, log rice separately unless the entry is a set meal.",
  },
  {
    test: (s) => s.includes("gado gado") || s.includes("gado-gado"),
    components: [
      "Blanched vegetables",
      "Tofu and/or tempeh",
      "Peanut sauce",
      "Optional: egg, lontong, keropok",
    ],
    tip: "Peanut sauce is the main calorie source. Lontong and fried tofu raise the total.",
  },
  {
    test: (s) => s.includes("soto ayam") || (s.includes("soto") && s.includes("ayam")),
    components: [
      "Chicken broth",
      "Shredded chicken",
      "Rice or glass noodles",
      "Bean sprouts and herbs",
      "Optional: egg, fried potato, sambal",
    ],
    tip: "Clear soup is lighter than coconut dishes. Fried toppings change the total.",
  },

  // —— Chinese ——
  {
    test: (s) => s.includes("mapo tofu") || s.includes("mapo doufu") || s.includes("麻婆"),
    components: [
      "Soft tofu",
      "Minced meat (usually pork or beef)",
      "Doubanjiang chilli bean sauce",
      "Optional: rice on the side",
    ],
    tip: "Sauce is oily and salty. Log rice separately if not in the listed portion.",
  },
  {
    test: (s) => s.includes("kung pao") || s.includes("gong bao") || s.includes("宫保"),
    components: [
      "Diced chicken (or other protein)",
      "Dried chilli and Sichuan pepper",
      "Peanuts",
      "Stir-fry sauce",
    ],
    tip: "Peanuts and oil add fat. Restaurant versions are often sweeter and oilier than home-style.",
  },
  {
    test: (s) => s.includes("xiao long bao") || s.includes("soup dumpling"),
    components: [
      "Thin wrapper",
      "Pork (or crab) filling",
      "Gelatin broth that melts when steamed",
    ],
    tip: "Log by piece count. Broth inside is part of each dumpling.",
  },
  {
    test: (s) =>
      s.includes("dumpling") ||
      s.includes("jiaozi") ||
      s.includes("gyoza") ||
      s.includes("wonton") ||
      s.includes("wanton"),
    components: [
      "Wrapper",
      "Meat or vegetable filling",
      "Optional: dipping sauce",
    ],
    tip: "Steamed is lighter than pan-fried or deep-fried. Count pieces; sauce is extra if heavy.",
  },
  {
    test: (s) => s.includes("char siu") || s.includes("char siew") || s.includes("叉烧"),
    components: [
      "Barbecue-roasted pork",
      "Sweet soy-hoisin glaze",
      "Optional: rice if served as rice plate",
    ],
    tip: "Glaze is sugary. Char siu rice includes a full rice portion — do not double-count rice.",
  },
  {
    test: (s) => s.includes("peking duck") || (s.includes("peking") && s.includes("duck")),
    components: [
      "Crispy duck skin and meat",
      "Thin pancakes",
      "Scallion and cucumber",
      "Sweet bean or hoisin sauce",
    ],
    tip: "Skin is the densest part. Log by pieces of pancake wrapped, not the whole bird.",
  },
  {
    test: (s) => s.includes("congee") || s.includes("porridge") || s.includes("jook") || s.includes("bubur"),
    components: [
      "Rice porridge base",
      "Optional: protein toppings",
      "Optional: youtiao or egg",
    ],
    tip: "Plain congee is light. Fried dough and fatty toppings change it a lot.",
  },
  {
    test: (s) => s.includes("dan dan") || s.includes("dandan"),
    components: [
      "Wheat noodles",
      "Minced pork",
      "Chilli oil and sesame paste sauce",
      "Optional: preserved vegetables",
    ],
    tip: "Sauce is oil- and sesame-heavy. Dry-style still carries most calories in the dressing.",
  },

  // —— Japanese ——
  {
    test: (s) => s.includes("ramen"),
    components: [
      "Wheat noodles",
      "Broth (shoyu, miso, or tonkotsu)",
      "Toppings (chashu, egg, nori, spring onion)",
    ],
    tip: "Leaving broth cuts calories sharply. Tonkotsu is the richest style. Extra noodles add a lot.",
  },
  {
    test: (s) => s.includes("sushi") && !s.includes("soup"),
    components: [
      "Seasoned sushi rice",
      "Fish or filling",
      "Optional: nori, mayo, or tempura bits",
    ],
    tip: "Count pieces. Mayo and tempura rolls are denser than nigiri or simple maki.",
  },
  {
    test: (s) => s.includes("sashimi"),
    components: ["Sliced raw fish", "Optional: soy sauce, wasabi, garnish"],
    tip: "Almost pure protein and fat from fish. Sauce is negligible unless used heavily.",
  },
  {
    test: (s) => s.includes("katsudon") || s.includes("katsu don"),
    components: [
      "Rice bowl",
      "Breaded fried cutlet",
      "Egg and onions in sweet-savory sauce",
    ],
    tip: "Fried cutlet plus rice is dense. Tonkatsu alone without rice is lighter than katsudon.",
  },
  {
    test: (s) => s.includes("tonkatsu"),
    components: [
      "Breaded deep-fried pork cutlet",
      "Shredded cabbage",
      "Tonkatsu sauce",
      "Optional: rice if served as a set",
    ],
    tip: "Frying oil is the main driver. Sets with rice and miso are full meals.",
  },
  {
    test: (s) => s.includes("tempura"),
    components: [
      "Batter-fried seafood or vegetables",
      "Dipping sauce (tentsuyu)",
      "Optional: rice or udon if a set",
    ],
    tip: "Batter holds oil. Vegetable tempura is usually lighter than prawn or mixed sets.",
  },
  {
    test: (s) => s.includes("okonomiyaki"),
    components: [
      "Cabbage-based savory pancake batter",
      "Protein (pork, seafood, or none)",
      "Okonomiyaki sauce and mayo",
      "Optional: bonito flakes, nori",
    ],
    tip: "Sauce and mayo add sugar and fat on top of the fried base.",
  },
  {
    test: (s) => s.includes("onigiri") || s.includes("rice ball"),
    components: ["Rice ball", "Filling (ume, salmon, tuna mayo, etc.)", "Optional: nori wrap"],
    tip: "Plain ume is light; tuna mayo and fried fillings are denser. Usually one piece per log line.",
  },

  // —— Korean ——
  {
    test: (s) => s.includes("bibimbap"),
    components: [
      "Rice",
      "Assorted seasoned vegetables",
      "Egg",
      "Gochujang",
      "Optional: beef or tofu, sesame oil",
    ],
    tip: "Gochujang and sesame oil matter. Dolsot (stone pot) versions often use more oil.",
  },
  {
    test: (s) => s.includes("kimchi fried rice") || s.includes("kimchi bokkeumbap"),
    components: [
      "Rice stir-fried with kimchi",
      "Gochujang or kimchi juice",
      "Optional: egg, spam, or pork",
    ],
    tip: "Oil and processed meat (spam) raise calories fast. Egg on top is common.",
  },
  {
    test: (s) => s.includes("tteokbokki") || s.includes("topokki"),
    components: [
      "Rice cakes",
      "Gochujang-based sauce",
      "Optional: fishcake, egg, ramyeon noodles",
    ],
    tip: "Sauce is sweet-spicy and sticky. Adding ramyeon or cheese changes the dish a lot.",
  },
  {
    test: (s) => s.includes("bulgogi"),
    components: [
      "Thin-sliced marinated beef",
      "Sweet-savory soy marinade",
      "Optional: rice, lettuce wraps",
    ],
    tip: "Marinade is sugary. Log rice separately unless the entry is a full set.",
  },
  {
    test: (s) => s.includes("samgyeopsal"),
    components: [
      "Grilled pork belly slices",
      "Lettuce or perilla wraps",
      "Ssamjang or salted sesame oil dip",
      "Optional: garlic, grilled sides",
    ],
    tip: "Fatty cuts dominate. Log by approximate grams or pieces, not by ‘one meal’ guess.",
  },
  {
    test: (s) => s.includes("jjigae") || s.includes("chigae"),
    components: [
      "Brothy stew base",
      "Tofu, kimchi, or soft tofu (by type)",
      "Protein (pork, seafood, or none)",
      "Optional: rice on the side",
    ],
    tip: "Shared pot: log your portion of solids and broth. Rice is usually separate.",
  },

  // —— Thai ——
  {
    test: (s) => s.includes("pad thai"),
    components: [
      "Rice stick noodles",
      "Tamarind-palm sugar-fish sauce",
      "Egg",
      "Bean sprouts and garlic chives",
      "Peanuts",
      "Optional: tofu, prawn, or chicken",
    ],
    tip: "Street portions vary. Peanuts and oil push fat up; sauce is sweet-savory.",
  },
  {
    test: (s) =>
      s.includes("pad kra pao") ||
      s.includes("pad kraprao") ||
      s.includes("pad gaprao") ||
      s.includes("holy basil"),
    components: [
      "Minced meat stir-fried with holy basil",
      "Chilli and garlic",
      "Fish sauce seasoning",
      "Optional: fried egg and rice (common set)",
    ],
    tip: "Often served on rice with a fried egg — add those if on your plate and not in the entry.",
  },
  {
    test: (s) =>
      s.includes("green curry") ||
      s.includes("red curry") ||
      s.includes("massaman") ||
      s.includes("panang"),
    components: [
      "Coconut milk curry",
      "Protein (chicken, beef, or tofu)",
      "Thai curry paste",
      "Optional: rice",
    ],
    tip: "Coconut milk is the main calorie driver. Log rice separately if not included.",
  },
  {
    test: (s) => s.includes("tom yum") || s.includes("tom yam"),
    components: [
      "Hot-and-sour broth",
      "Prawn, chicken, or mixed seafood",
      "Lemongrass, galangal, kaffir lime, chilli",
      "Optional: mushrooms, evaporated milk (creamier style)",
    ],
    tip: "Clear tom yum is relatively light. ‘Nam khon’ (with milk) is richer.",
  },
  {
    test: (s) => s.includes("som tum") || s.includes("som tam") || s.includes("papaya salad"),
    components: [
      "Shredded green papaya",
      "Lime, fish sauce, chilli, palm sugar dressing",
      "Tomato and long bean",
      "Optional: peanuts, dried shrimp, salted crab",
    ],
    tip: "Dressing is intense but portion is usually modest. Peanuts and crab add sodium and fat.",
  },
  {
    test: (s) => s.includes("mango sticky rice"),
    components: [
      "Coconut sticky rice",
      "Ripe mango",
      "Coconut cream drizzle",
      "Optional: toasted mung bean",
    ],
    tip: "Dessert: coconut cream and sticky rice are the calorie core, not the mango alone.",
  },

  // —— Vietnamese ——
  {
    test: (s) => s.includes("pho") || s.startsWith("pho ") || s.includes("phở"),
    components: [
      "Rice noodles",
      "Clear beef or chicken broth",
      "Sliced meat or meatballs",
      "Herbs and bean sprouts",
      "Optional: hoisin and sriracha",
    ],
    tip: "Broth is lighter than coconut soups. Sauces add sugar if used heavily.",
  },
  {
    test: (s) => s.includes("banh mi") || s.includes("banh mì"),
    components: [
      "Vietnamese baguette",
      "Protein (pork, chicken, or tofu)",
      "Pickled carrot and daikon",
      "Coriander and chilli",
      "Optional: mayo or liver pate",
    ],
    tip: "Pate and mayo are the hidden calories. Roll size varies by shop.",
  },
  {
    test: (s) => s.includes("bun cha"),
    components: [
      "Rice noodles",
      "Grilled pork",
      "Sweet-salty dipping broth",
      "Herbs and salad vegetables",
    ],
    tip: "Fatty grilled pork and the dip drive calories. Include dip you actually use.",
  },
  {
    test: (s) => s.includes("com tam") || s.includes("broken rice"),
    components: [
      "Broken rice",
      "Grilled pork chop or shredded pork",
      "Optional: fried egg, pork skin, pickles",
      "Fish sauce dip",
    ],
    tip: "Rice plus fatty grilled pork is a full plate. Add egg only if present.",
  },

  // —— Indian ——
  {
    test: (s) => s.includes("biryani"),
    components: [
      "Layered spiced rice",
      "Marinated meat or vegetables",
      "Ghee or oil",
      "Optional: raita or salan",
    ],
    tip: "Restaurant plates are large. Side gravy still counts if you pour it on.",
  },
  {
    test: (s) => s.includes("butter chicken") || s.includes("murgh makhani"),
    components: [
      "Chicken in tomato-butter-cream gravy",
      "Butter and cream",
    ],
    tip: "Log naan or rice separately. Ghee-brushed naan adds a lot.",
  },
  {
    test: (s) => s.includes("masala dosa"),
    components: [
      "Fermented rice-lentil crepe",
      "Spiced potato filling",
      "Sambar",
      "Coconut chutney",
    ],
    tip: "Heavier than plain dosa. Ghee roast versions add more fat.",
  },
  {
    test: (s) => s.includes("dosa") && !s.includes("masala"),
    components: [
      "Fermented rice-lentil crepe",
      "Sambar",
      "Coconut chutney",
    ],
    tip: "Plain dosa is lighter than masala. Include chutney and sambar if used.",
  },
  {
    test: (s) => s.includes("idli"),
    components: ["Steamed rice-lentil cakes", "Sambar", "Coconut chutney"],
    tip: "Idli is relatively light; generous sambar and chutney still add up.",
  },
  {
    test: (s) => s.includes("thali"),
    components: [
      "Rice or bread",
      "Several vegetable or dal dishes",
      "Yogurt or raita",
      "Optional: pickle, papad, sweet",
    ],
    tip: "A thali is a set. Use the library total as a start, or split major items when editing.",
  },
  {
    test: (s) => s.includes("samosa"),
    components: [
      "Fried pastry shell",
      "Potato or meat filling",
      "Optional: chutney",
    ],
    tip: "Log by piece. Chutney is light unless large amounts of sweet tamarind sauce.",
  },
  {
    test: (s) => s.includes("curry") || s.includes("masala") || s.includes("korma") || s.includes("tikka"),
    components: [
      "Protein or vegetables in gravy",
      "Spice paste and oil or ghee",
      "Optional: rice or bread (usually separate)",
    ],
    tip: "Gravy carries most of the fat. Cream- or coconut-based curries are denser than tomato-based.",
  },

  // —— Filipino / others ——
  {
    test: (s) => s.includes("adobo"),
    components: [
      "Chicken or pork braised in soy and vinegar",
      "Garlic",
      "Optional: rice",
    ],
    tip: "Sauce is salty and can be oily. Rice is almost always separate in the Philippines.",
  },
  {
    test: (s) => s.includes("sinigang"),
    components: [
      "Sour tamarind (or similar) broth",
      "Pork, beef, or seafood",
      "Vegetables (kangkong, tomato, radish)",
      "Optional: rice",
    ],
    tip: "Broth is relatively light. Fatty pork cuts and rice drive the meal total.",
  },
  {
    test: (s) => s.includes("kottu"),
    components: [
      "Chopped roti",
      "Egg and vegetables",
      "Meat or cheese (by style)",
      "Curry or gravy mixed through",
    ],
    tip: "Roti and oil make it dense. Cheese or large meat portions raise calories fast.",
  },

  // —— Generic Western (only if name matches) ——
  {
    test: (s) => s.includes("burger"),
    components: ["Bun", "Patty", "Optional: cheese, sauce, vegetables"],
    tip: "Add fries and drinks separately. Double patty and cheese change the total a lot.",
  },
  {
    test: (s) => s.includes("pizza"),
    components: ["Crust", "Tomato sauce", "Cheese", "Toppings as ordered"],
    tip: "Log by slice. Thick crust and extra cheese are denser than thin base.",
  },
  {
    test: (s) => s.includes("pasta") || s.includes("spaghetti") || s.includes("carbonara") || s.includes("bolognese"),
    components: ["Pasta", "Sauce", "Optional: cheese, meat, oil"],
    tip: "Cream and cheese sauces are denser than tomato. Restaurant bowls are often large.",
  },
];

function cuisineFallback(cuisine: string): DishGuide {
  const c = (cuisine || "").toLowerCase();
  const map: Record<string, DishGuide> = {
    chinese: {
      components: ["Main dish as plated", "Sauce and oil from cooking", "Optional: rice or noodles if served together"],
      tip: "Wok oil is easy to undercount. Prefer the listed portion, then adjust.",
    },
    japanese: {
      components: ["Main item", "Rice or noodles if included", "Broth or sauce if part of the dish"],
      tip: "Broth, mayo, and fried items drive most variance.",
    },
    korean: {
      components: ["Main dish", "Rice if included", "Optional: banchan you actually ate"],
      tip: "Shared banchan: log only your share. Stew includes broth you finish.",
    },
    thai: {
      components: ["Main dish", "Rice or noodles if included", "Curry or stir-fry sauce on the plate"],
      tip: "Coconut curries are denser than clear soups.",
    },
    vietnamese: {
      components: ["Noodles or rice if included", "Protein", "Broth or dip if used", "Herbs"],
      tip: "Clear broths are lighter; dips and mayo still add up.",
    },
    indian: {
      components: ["Curry or dry dish", "Optional: rice or bread if part of this entry"],
      tip: "Bread and rice are often separate. Creamy gravies hide fat.",
    },
    malay: {
      components: ["Rice or noodles if included", "Protein", "Sambal or gravy if on the plate"],
      tip: "Sambal and coconut gravies matter. Shared dishes: log your share only.",
    },
    indonesian: {
      components: ["Main protein or vegetable dish", "Optional: rice", "Optional: sambal"],
      tip: "Peanut sauces and fried sides add up quickly.",
    },
    singaporean: {
      components: ["Rice or noodles if included", "Protein", "Sauce on the plate"],
      tip: "Hawker portions vary. Adjust if your plate was clearly larger.",
    },
    filipino: {
      components: ["Ulam (main dish)", "Optional: rice if this entry is a full meal"],
      tip: "If the entry is ulam only, add rice as a separate item.",
    },
    taiwanese: {
      components: ["Rice or noodles if included", "Protein", "Sauce or broth if part of the dish"],
      tip: "Braised pork rice and beef noodle broths are richer than they look.",
    },
    western: {
      components: ["Main item as listed", "Sauce or dressing if included"],
      tip: "Add drinks and desserts separately.",
    },
  };
  return (
    map[c] || {
      components: ["Main item as plated", "Sauces and sides you actually ate"],
      tip: "Start from the listed portion, then edit if your serving differed.",
    }
  );
}

export function getDishGuide(food: FoodLike): DishGuide {
  const name = n(food.name || "");
  for (const rule of RULES) {
    if (rule.test(name)) {
      return { components: rule.components, tip: rule.tip };
    }
  }
  return cuisineFallback((food.cuisine || "").toLowerCase());
}
