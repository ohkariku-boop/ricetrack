/** Dish guides: typical plate components + logging tips. Keep components tight and accurate. */

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
  return s.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "");
}

type Rule = {
  /** More specific rules should appear earlier in RULES */
  test: (name: string) => boolean;
  components: string[];
  tip: string;
};

/**
 * Components = what is usually on a standard serving of that named dish.
 * Optional add-ons only when they are very common variants, marked clearly.
 */
const RULES: Rule[] = [
  // —— Malay / Singaporean / Indonesian staples ——
  {
    test: (s) => s.includes("nasi lemak"),
    components: [
      "Coconut rice",
      "Sambal",
      "Ikan bilis (dried anchovies)",
      "Roasted peanuts",
      "Cucumber slices",
      "Often: boiled or fried egg",
      "Often: fried chicken, rendang, or fish",
    ],
    tip: "Base set is rice + sambal + bilis + peanuts + cucumber. Log egg and protein only if on your plate.",
  },
  {
    test: (s) => s.includes("nasi kerabu"),
    components: [
      "Blue or herb rice",
      "Sambal or budu",
      "Salted egg or protein",
      "Crackers / keropok",
      "Raw vegetables (ulam)",
    ],
    tip: "Count rice and any fried protein. Ulam is light; keropok and sambal add more.",
  },
  {
    test: (s) => s.includes("nasi goreng") || (s.includes("fried rice") && !s.includes("kimchi")),
    components: [
      "Cooked rice (wok-fried)",
      "Egg",
      "Protein (chicken, prawn, or meat)",
      "Seasoning (kecap manis / soy / garlic)",
      "Cooking oil",
    ],
    tip: "Oil and sweet soy drive calories. Hawker plates are often larger than one listed serving.",
  },
  {
    test: (s) => s.includes("hainanese chicken rice") || s.includes("chicken rice"),
    components: [
      "Poached or roasted chicken",
      "Fragrant rice cooked in chicken stock",
      "Cucumber",
      "Chilli sauce",
      "Ginger sauce",
      "Dark soy (optional)",
    ],
    tip: "Rice is cooked with chicken fat/stock. Skin-on chicken is higher fat than white meat only.",
  },
  {
    test: (s) => s.includes("bak kut teh"),
    components: [
      "Pork ribs",
      "Herbal or pepper broth",
      "Tofu or mushrooms (common)",
      "Fried dough (youtiao) if served",
      "Rice on the side if eaten",
    ],
    tip: "Log rice separately if you had a bowl. Broth you drink counts; youtiao is dense.",
  },
  {
    test: (s) => s.includes("laksa"),
    components: [
      "Rice noodles or egg noodles",
      "Broth (coconut curry or tamarind/asam)",
      "Protein (prawn, chicken, or fish)",
      "Tofu puffs or fish cake (curry laksa)",
      "Bean sprouts",
      "Fresh herbs / laksa leaf",
    ],
    tip: "Curry (coconut) laksa is much denser than asam laksa. Include broth you finish.",
  },
  {
    test: (s) =>
      s.includes("char kway") ||
      s.includes("char kuey") ||
      s.includes("char kuay") ||
      s.includes("chow fun"),
    components: [
      "Flat rice noodles",
      "Dark soy sauce",
      "Bean sprouts",
      "Egg",
      "Chinese sausage or prawns/cockles",
      "Lard or oil",
      "Chives",
    ],
    tip: "Classic Penang/SG style is very oily. Prefer your actual plate size over a small photo portion.",
  },
  {
    test: (s) => s.includes("roti prata") || s.includes("roti canai"),
    components: [
      "Flaky flatbread (prata/canai)",
      "Dal or curry dip",
      "Ghee or oil in the bread",
    ],
    tip: "Empty prata is still calorie-dense from fat. Egg prata and cheese prata add more. Log curry used.",
  },
  {
    test: (s) => s.includes("mee rebus"),
    components: [
      "Yellow egg noodles",
      "Sweet-spicy thickened gravy",
      "Bean sprouts",
      "Boiled egg",
      "Tofu or potato (common)",
      "Fried shallots / lime",
    ],
    tip: "Gravy is starch- and sugar-forward. Finish less gravy to cut calories.",
  },
  {
    test: (s) => s.includes("mee goreng") || s.includes("maggi goreng"),
    components: [
      "Yellow noodles or instant noodles",
      "Tomato/chilli wok sauce",
      "Egg",
      "Potato or tofu (common)",
      "Cooking oil",
    ],
    tip: "Wok oil and sweet sauce add up. Instant-noodle versions are denser.",
  },
  {
    test: (s) => s.includes("satay"),
    components: [
      "Grilled meat skewers",
      "Peanut sauce",
      "Cucumber and onion",
      "Ketupat or rice cakes (if served)",
    ],
    tip: "Count skewers. Peanut sauce is dense — log the amount you actually used.",
  },
  {
    test: (s) => s.includes("rendang"),
    components: [
      "Slow-cooked beef (or chicken)",
      "Coconut milk",
      "Spice paste",
      "Usually eaten with rice (log rice separately if not included)",
    ],
    tip: "Rendang is concentrated and fatty. Small portions still pack calories. Rice is usually extra.",
  },
  {
    test: (s) => s.includes("gado gado") || s.includes("gado-gado"),
    components: [
      "Blanched vegetables",
      "Tofu and/or tempeh",
      "Egg (common)",
      "Lontong or rice cake (common)",
      "Peanut sauce",
      "Krupuk (optional)",
    ],
    tip: "Peanut sauce is the main calorie driver. Krupuk and lontong change the total a lot.",
  },
  {
    test: (s) => s.includes("soto ayam") || (s.includes("soto") && s.includes("ayam")),
    components: [
      "Chicken broth",
      "Shredded chicken",
      "Rice or glass noodles",
      "Bean sprouts",
      "Fried potato cakes or emping (common)",
      "Lime and sambal",
    ],
    tip: "Clear broth is lighter than coconut soups. Fried toppings and rice drive most calories.",
  },

  // —— Chinese ——
  {
    test: (s) => s.includes("mapo tofu") || s.includes("mapo doufu") || s.includes("麻婆"),
    components: [
      "Soft tofu",
      "Minced pork or beef",
      "Doubanjiang (chilli bean paste)",
      "Sichuan peppercorn",
      "Oil / chilli oil",
      "Usually with rice (log rice if separate)",
    ],
    tip: "Restaurant versions are oil-heavy. Rice is almost always separate.",
  },
  {
    test: (s) => s.includes("kung pao") || s.includes("gong bao") || s.includes("宫保"),
    components: [
      "Diced chicken (or other protein)",
      "Dried chillies",
      "Peanuts",
      "Stir-fry sauce",
      "Oil",
      "Usually with rice",
    ],
    tip: "Peanuts and oil raise fat. Log rice separately unless the entry is a set meal.",
  },
  {
    test: (s) => s.includes("xiao long bao") || s.includes("xgb") || s.includes("soup dumpling"),
    components: [
      "Thin wrapper",
      "Pork (or crab) filling",
      "Gelatinized broth inside",
      "Vinegar-ginger dip (light)",
    ],
    tip: "Log by piece count. Broth inside is part of the dumpling — do not ignore it.",
  },
  {
    test: (s) => s.includes("dumpling") || s.includes("jiaozi") || s.includes("gyoza") || s.includes("wanton") || s.includes("wonton"),
    components: [
      "Wheat wrapper",
      "Meat or vegetable filling",
      "Cooking fat (if pan-fried or deep-fried)",
      "Dipping sauce",
    ],
    tip: "Steamed is lighter than pan-fried or deep-fried. Count pieces; sauce is extra.",
  },
  {
    test: (s) => s.includes("char siu") || s.includes("char siew") || s.includes("叉烧"),
    components: [
      "Barbecue pork",
      "Sweet soy / maltose glaze",
      "Often with rice or noodles (log carb if separate)",
    ],
    tip: "Glaze is sugary. Fatty cuts are higher calorie than lean slices.",
  },
  {
    test: (s) => s.includes("congee") || s.includes("porridge") || s.includes("jook") || s.includes("bubur"),
    components: [
      "Rice cooked to a porridge",
      "Protein toppings (century egg, pork, fish)",
      "Spring onion / ginger",
      "Youtiao if served",
    ],
    tip: "Plain congee is light. Youtiao and fatty toppings change the total fast.",
  },
  {
    test: (s) => s.includes("peking duck") || s.includes("peking") && s.includes("duck"),
    components: [
      "Crispy duck skin and meat",
      "Thin pancakes",
      "Sweet bean or hoisin sauce",
      "Cucumber and spring onion",
    ],
    tip: "Skin is the calorie-dense part. Count pancakes and sauce.",
  },

  // —— Japanese ——
  {
    test: (s) => s.includes("ramen"),
    components: [
      "Wheat noodles",
      "Broth (tonkotsu, shoyu, miso, or shio)",
      "Topping protein (chashu, chicken, or egg)",
      "Aromatics (spring onion, nori, menma)",
    ],
    tip: "Tonkotsu is the richest broth. Leaving broth lowers calories a lot. Extra noodles cost more.",
  },
  {
    test: (s) => s.includes("sushi") && !s.includes("soup"),
    components: [
      "Seasoned sushi rice",
      "Fish or filling",
      "Nori (for rolls)",
      "Wasabi and soy (light)",
    ],
    tip: "Count pieces. Mayo, tempura, and creamy rolls are much denser than nigiri or sashimi.",
  },
  {
    test: (s) => s.includes("sashimi"),
    components: ["Sliced raw fish", "Soy sauce and wasabi (light)", "Garnish"],
    tip: "Almost pure protein/fat from fish. Soy is negligible unless used heavily.",
  },
  {
    test: (s) => s.includes("tonkatsu") || s.includes("katsu don") || s.includes("katsudon"),
    components: [
      "Breaded deep-fried pork cutlet",
      "Rice (for donburi)",
      "Egg and sauce (katsudon)",
      "Shredded cabbage (side)",
    ],
    tip: "Frying oil is the main driver. Donburi includes rice and sweet sauce.",
  },
  {
    test: (s) => s.includes("okonomiyaki"),
    components: [
      "Savoury cabbage batter",
      "Protein (pork, seafood, or cheese)",
      "Okonomiyaki sauce",
      "Mayonnaise",
      "Katsuobushi / nori",
    ],
    tip: "Sauce and mayo add sugar and fat. Size varies widely by restaurant.",
  },
  {
    test: (s) => s.includes("tempura"),
    components: [
      "Battered deep-fried seafood or vegetables",
      "Dipping broth (tentsuyu)",
      "Often with rice or noodles (log if separate)",
    ],
    tip: "Batter holds oil. Vegetable tempura is still fried — not a free side.",
  },

  // —— Korean ——
  {
    test: (s) => s.includes("bibimbap"),
    components: [
      "Rice",
      "Seasoned vegetables (namul)",
      "Egg",
      "Beef or tofu",
      "Gochujang",
      "Sesame oil",
    ],
    tip: "Gochujang and sesame oil matter. Dolsot (stone pot) versions may use more oil.",
  },
  {
    test: (s) => s.includes("kimchi fried rice") || s.includes("kimchi bokkeumbap"),
    components: [
      "Rice",
      "Kimchi",
      "Cooking oil",
      "Often: spam, pork, or egg",
      "Sesame oil / gochujang",
    ],
    tip: "Oil and processed meat drive calories. Egg on top is extra if not in the listing.",
  },
  {
    test: (s) => s.includes("tteokbokki") || s.includes("topokki"),
    components: [
      "Rice cakes",
      "Gochujang-based sauce",
      "Fish cake",
      "Often: egg, ramen noodles, or cheese",
    ],
    tip: "Sauce is sweet-spicy and sticky. Cheese or ramen add-ons change the total a lot.",
  },
  {
    test: (s) => s.includes("bulgogi"),
    components: [
      "Thinly sliced marinated beef",
      "Soy-sugar-garlic marinade",
      "Usually with rice and banchan (log rice if separate)",
    ],
    tip: "Marinade adds sugar. Fatty cuts and extra oil on the grill raise calories.",
  },
  {
    test: (s) => s.includes("samgyeopsal"),
    components: [
      "Grilled pork belly",
      "Lettuce or perilla wraps",
      "Ssamjang",
      "Garlic and sides",
      "Often rice",
    ],
    tip: "Log by weight or number of slices if you can. Fat rendered off still started on the plate.",
  },

  // —— Thai ——
  {
    test: (s) => s.includes("pad thai"),
    components: [
      "Rice noodles",
      "Tamarind-based sauce",
      "Egg",
      "Tofu and/or shrimp",
      "Bean sprouts",
      "Peanuts",
      "Cooking oil",
    ],
    tip: "Street portions vary. Peanuts and oil push fat and calories up.",
  },
  {
    test: (s) => s.includes("pad kra pao") || s.includes("pad kraprao") || s.includes("basil chicken") || s.includes("holy basil"),
    components: [
      "Minced or sliced protein",
      "Thai basil",
      "Chilli and garlic",
      "Sauce",
      "Fried egg (very common)",
      "Rice",
    ],
    tip: "Almost always a rice plate with a fried egg. Log egg if present.",
  },
  {
    test: (s) => s.includes("green curry") || s.includes("red curry") || s.includes("massaman") || s.includes("panang"),
    components: [
      "Coconut milk curry",
      "Protein (chicken, beef, or tofu)",
      "Vegetables or potato",
      "Rice (usually separate)",
    ],
    tip: "Coconut milk is the main calorie source. Log rice separately unless listed as a set.",
  },
  {
    test: (s) => s.includes("tom yum") || s.includes("tom yam"),
    components: [
      "Hot-and-sour broth",
      "Prawns or chicken",
      "Lemongrass, galangal, kaffir lime",
      "Mushrooms",
      "Sometimes evaporated milk (creamier versions)",
    ],
    tip: "Clear tom yum is relatively light. “Nam khon” (milky) versions are denser.",
  },
  {
    test: (s) => s.includes("som tum") || s.includes("som tam") || s.includes("papaya salad"),
    components: [
      "Shredded green papaya",
      "Lime, chilli, fish sauce",
      "Tomato and long bean",
      "Peanuts",
      "Dried shrimp (common)",
    ],
    tip: "Usually light. Peanuts and sticky rice on the side change the meal total.",
  },
  {
    test: (s) => s.includes("mango sticky rice"),
    components: [
      "Sweet sticky rice",
      "Coconut milk",
      "Ripe mango",
      "Salted coconut cream (topping)",
    ],
    tip: "Dessert is coconut- and sugar-dense. Portion size varies a lot by shop.",
  },

  // —— Vietnamese ——
  {
    test: (s) => s.includes("pho") || s.includes("pho "),
    components: [
      "Rice noodles",
      "Clear beef or chicken broth",
      "Sliced beef or chicken",
      "Herbs (Thai basil, cilantro)",
      "Bean sprouts",
      "Lime and chilli",
      "Hoisin / sriracha if used",
    ],
    tip: "Clear broth is moderate. Sauces add sugar. Extra rare beef or tendon adds protein/fat.",
  },
  {
    test: (s) => s.includes("banh mi") || s.includes("banh mì"),
    components: [
      "Vietnamese baguette",
      "Protein (pork, chicken, or tofu)",
      "Pickled carrot and daikon",
      "Cilantro and chilli",
      "Mayo or liver pate (common)",
    ],
    tip: "Pate and mayo are the hidden calories. Bread size varies by shop.",
  },
  {
    test: (s) => s.includes("bun cha") || s.includes("bun thit"),
    components: [
      "Rice noodles",
      "Grilled pork",
      "Dipping broth / fish sauce dip",
      "Herbs and vegetables",
    ],
    tip: "Grilled fatty pork and sweet-salty dip drive calories. Include the dip you use.",
  },
  {
    test: (s) => s.includes("com tam") || s.includes("broken rice"),
    components: [
      "Broken rice",
      "Grilled pork chop or shredded pork",
      "Egg (fried or steamed)",
      "Pickles and fish sauce",
      "Often: pork skin or shredded pork",
    ],
    tip: "Rice plus fatty grilled pork is a full plate. Egg is usually included.",
  },

  // —— Indian / Sri Lankan ——
  {
    test: (s) => s.includes("biryani"),
    components: [
      "Layered spiced rice",
      "Marinated meat or vegetables",
      "Ghee or oil",
      "Fried onions",
      "Raita or salan if served",
    ],
    tip: "Restaurant plates are large. Gravy/raita on the side still counts if you use them.",
  },
  {
    test: (s) => s.includes("butter chicken") || s.includes("murgh makhani"),
    components: [
      "Chicken in tomato-butter-cream gravy",
      "Butter and cream",
      "Usually with naan or rice (log separately)",
    ],
    tip: "Gravy is rich. Naan brushed with ghee adds a lot. Log bread/rice separately.",
  },
  {
    test: (s) => s.includes("dosa"),
    components: [
      "Fermented rice-lentil crepe",
      "Potato masala (if masala dosa)",
      "Sambar",
      "Coconut chutney",
    ],
    tip: "Plain dosa is lighter than masala. Ghee roast and paper roast change fat a lot.",
  },
  {
    test: (s) => s.includes("idli"),
    components: [
      "Steamed rice-lentil cakes",
      "Sambar",
      "Coconut chutney",
    ],
    tip: "Idli itself is relatively light; sambar and chutney still add up if generous.",
  },
  {
    test: (s) => s.includes("thali"),
    components: [
      "Rice or bread",
      "Several vegetable or dal dishes",
      "Yogurt or raita",
      "Pickle and papad (common)",
      "Sweet (sometimes)",
    ],
    tip: "A thali is multiple items. Prefer logging the set as listed, or split major items if editing.",
  },
  {
    test: (s) => s.includes("kottu"),
    components: [
      "Chopped roti",
      "Egg and/or meat",
      "Vegetables",
      "Curry gravy mixed in",
      "Cooking oil",
    ],
    tip: "Roti plus oil plus gravy is dense. Meat kottu is higher protein and calories.",
  },

  // —— Filipino ——
  {
    test: (s) => s.includes("adobo"),
    components: [
      "Chicken or pork braised in vinegar and soy",
      "Garlic and bay leaf",
      "Rendered fat from the meat",
      "Almost always with rice (log rice if separate)",
    ],
    tip: "Sauce is salty-savoury. Skin-on chicken and fatty pork raise calories. Rice is usually extra.",
  },
  {
    test: (s) => s.includes("sinigang"),
    components: [
      "Sour tamarind (or similar) broth",
      "Pork, beef, or seafood",
      "Vegetables (kangkong, tomato, radish)",
      "Rice on the side",
    ],
    tip: "Broth is relatively light. Fatty cuts of pork and rice drive the meal.",
  },
  {
    test: (s) => s.includes("lechon"),
    components: [
      "Roast pork with crispy skin",
      "Sauce (liver sauce common for lechon)",
      "Rice if served as a meal",
    ],
    tip: "Skin is very calorie-dense. Log by serving size carefully.",
  },

  // —— Generic patterns (after specifics) ——
  {
    test: (s) => s.includes("curry") || s.includes("masala") || s.includes("korma"),
    components: [
      "Protein or vegetables in gravy",
      "Spice base",
      "Oil, ghee, or coconut milk",
      "Usually rice or bread on the side",
    ],
    tip: "Gravy carries most of the fat. Log rice/roti separately unless the entry is a set meal.",
  },
  {
    test: (s) => s.includes("noodle") || s.includes("mee ") || s.includes("mie ") || s.includes("pasta"),
    components: [
      "Noodles",
      "Sauce or broth",
      "Protein if included",
      "Vegetables",
      "Oil if stir-fried",
    ],
    tip: "Stir-fried noodles are oilier than soup noodles. Check if the portion includes protein.",
  },
  {
    test: (s) => s.includes("burger"),
    components: [
      "Bun",
      "Patty",
      "Sauces and cheese if present",
      "Vegetables on the burger",
    ],
    tip: "Add fries and drinks separately. Double patties and cheese change the total fast.",
  },
  {
    test: (s) => s.includes("pizza"),
    components: [
      "Dough crust",
      "Tomato sauce",
      "Cheese",
      "Toppings",
    ],
    tip: "Log by slice or listed portion. Thick crust and extra cheese raise calories.",
  },
];

function cuisineFallback(cuisine: string): DishGuide {
  const c = (cuisine || "").toLowerCase();
  const map: Record<string, DishGuide> = {
    chinese: {
      components: [
        "Main protein or tofu",
        "Vegetables",
        "Sauce and cooking oil",
        "Rice or noodles if part of the serving",
      ],
      tip: "Wok oil and sauces are easy to undercount. Prefer the listed portion size.",
    },
    japanese: {
      components: [
        "Rice or noodles if included",
        "Main protein",
        "Broth or sauce",
        "Light sides (pickles, salad)",
      ],
      tip: "Broth, mayo, and fried items drive most of the variance.",
    },
    korean: {
      components: [
        "Rice if included",
        "Main protein or stew",
        "Banchan you actually ate",
        "Gochujang or sesame oil if used",
      ],
      tip: "Shared banchan: log only what you ate. Stew broth you finish counts.",
    },
    thai: {
      components: [
        "Rice or noodles if included",
        "Protein",
        "Curry, stir-fry sauce, or broth",
        "Fresh herbs",
      ],
      tip: "Coconut curries are denser than clear soups. Log rice if it came on the side.",
    },
    vietnamese: {
      components: [
        "Noodles or rice if included",
        "Protein",
        "Broth or dipping sauce",
        "Herbs and vegetables",
      ],
      tip: "Clear broths are lighter; hoisin and mayo still add sugar and fat.",
    },
    indian: {
      components: [
        "Curry or dry dish",
        "Rice or bread if included",
        "Ghee or oil in the dish",
        "Chutney or raita if used",
      ],
      tip: "Bread and rice are often separate. Creamy gravies hide fat.",
    },
    malay: {
      components: [
        "Rice or noodles if included",
        "Sambal or gravy",
        "Protein",
        "Vegetables or pickles",
      ],
      tip: "Sambal and coconut gravies matter. Shared dishes: log your share only.",
    },
    indonesian: {
      components: [
        "Rice if included",
        "Main protein",
        "Sambal if used",
        "Fried sides only if on your plate",
      ],
      tip: "Peanut sauces and fried sides add up quickly.",
    },
    singaporean: {
      components: [
        "Rice or noodles if included",
        "Protein",
        "Sauce",
        "Side vegetables if present",
      ],
      tip: "Hawker portions vary. Adjust if your plate was clearly larger than the listed portion.",
    },
    filipino: {
      components: [
        "Main ulam (meat or fish dish)",
        "Sauce from the dish",
        "Rice if this entry is a full meal",
      ],
      tip: "If the entry is ulam only, add rice as a separate item.",
    },
    taiwanese: {
      components: [
        "Rice or noodles if included",
        "Braised or fried protein",
        "Sauce or broth",
        "Pickles if present",
      ],
      tip: "Braised pork rice and beef noodle broths are richer than they look.",
    },
    western: {
      components: [
        "Main item as listed",
        "Sauce or dressing if included",
        "Sides only if part of the serving",
      ],
      tip: "Add drinks and desserts separately.",
    },
  };
  return (
    map[c] || {
      components: [
        "Main item as plated",
        "Sauces and oils on the plate",
        "Sides you actually ate",
      ],
      tip: "Start from the listed portion, then edit if your serving differed.",
    }
  );
}

export function getDishGuide(food: FoodLike): DishGuide {
  const name = n(food.name || "");
  for (const rule of RULES) {
    if (rule.test(name)) {
      return {
        components: rule.components,
        tip: rule.tip,
      };
    }
  }
  return cuisineFallback((food.cuisine || "").toLowerCase());
}
