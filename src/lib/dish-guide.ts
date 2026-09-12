/** Lightweight dish guides for library detail — components + logging tips (not full recipes). */

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
  return s.toLowerCase();
}

/** Curated patterns for high-frequency Asian dishes */
const RULES: { test: (name: string) => boolean; components: string[]; tip: string }[] = [
  {
    test: (s) => s.includes("nasi lemak"),
    components: ["Coconut rice", "Sambal", "Fried egg or omelette", "Ikan bilis (anchovies)", "Peanuts", "Cucumber", "Optional: fried chicken or rendang"],
    tip: "Log coconut rice and sambal; add chicken or egg if on the plate. Shared plates: take your portion only.",
  },
  {
    test: (s) => s.includes("nasi goreng") || s.includes("fried rice"),
    components: ["Rice", "Egg", "Protein (chicken, prawn, or meat)", "Oil / seasoning", "Optional greens or pickles"],
    tip: "Oil adds more calories than it looks. Large hawker plates are often 1.5 servings.",
  },
  {
    test: (s) => s.includes("laksa"),
    components: ["Noodles", "Coconut or sour broth", "Tofu puff or fish cake", "Prawn or chicken", "Bean sprouts", "Egg (optional)"],
    tip: "Coconut laksa is denser than asam laksa. Count the full bowl including broth you drink.",
  },
  {
    test: (s) => s.includes("char kway") || s.includes("char kuey") || s.includes("chow fun"),
    components: ["Flat rice noodles", "Soy sauce / dark soy", "Egg", "Bean sprouts", "Chinese sausage or prawn", "Lard or oil"],
    tip: "Very oil-forward. Prefer the plate you actually ate, not a small reference photo.",
  },
  {
    test: (s) => s.includes("ramen"),
    components: ["Noodles", "Broth", "Chashu or protein", "Egg", "Toppings (nori, spring onion)"],
    tip: "Leaving broth cuts calories a lot. Extra noodles or extra chashu should be added.",
  },
  {
    test: (s) => s.includes("pho") || s.includes("phở"),
    components: ["Rice noodles", "Clear broth", "Beef or chicken", "Herbs", "Bean sprouts", "Optional sauce"],
    tip: "Broth is lighter than coconut soups. Sauces (hoisin, sriracha) add sugar and sodium.",
  },
  {
    test: (s) => s.includes("bibimbap"),
    components: ["Rice", "Assorted vegetables", "Egg", "Gochujang", "Beef or tofu", "Sesame oil"],
    tip: "Gochujang and sesame oil matter. Stone-pot (dolsot) versions can use more oil.",
  },
  {
    test: (s) => s.includes("sushi") || s.includes("sashimi"),
    components: ["Rice (sushi)", "Fish or filling", "Nori", "Optional mayo / sauce"],
    tip: "Count pieces. Rolls with mayo or tempura are far denser than nigiri or sashimi.",
  },
  {
    test: (s) => s.includes("dim sum") || s.includes("siu mai") || s.includes("har gow") || s.includes("xiao long bao") || s.includes("dumpling"),
    components: ["Wrapper", "Filling (meat or shrimp)", "Oil from steaming/frying", "Dipping sauce"],
    tip: "Log by piece count. Fried dumplings and XLB broth add more than steamed lean fillings.",
  },
  {
    test: (s) => s.includes("biryani"),
    components: ["Spiced rice", "Meat or vegetables", "Ghee or oil", "Raita or gravy (optional)"],
    tip: "Restaurant biryani is often a large plate. Gravy on the side still counts if used.",
  },
  {
    test: (s) => s.includes("dosa") || s.includes("idli") || s.includes("uttapam"),
    components: ["Fermented batter", "Potato filling (masala dosa)", "Sambar", "Chutney"],
    tip: "Plain dosa is lighter; masala and ghee roast change macros a lot. Include chutney if used.",
  },
  {
    test: (s) => s.includes("curry") || s.includes("masala") || s.includes("rendang") || s.includes("korma"),
    components: ["Protein or vegetables", "Curry sauce / coconut milk", "Oil or ghee", "Usually with rice or bread"],
    tip: "Sauce is where calories hide. Log rice or roti separately if not already in the portion.",
  },
  {
    test: (s) => s.includes("pad thai") || s.includes("pad see") || s.includes("drunken noodle"),
    components: ["Rice noodles", "Sauce (tamarind / soy)", "Egg", "Protein", "Peanuts / oil"],
    tip: "Street-style portions vary widely. Peanuts and oil push fat up quickly.",
  },
  {
    test: (s) => s.includes("burger") || s.includes("pizza") || s.includes("pasta"),
    components: ["Main base (bun, crust, pasta)", "Protein or cheese", "Sauce", "Sides if any"],
    tip: "Default portion is one serving as listed. Add sides (fries, drinks) separately.",
  },
  {
    test: (s) => s.includes("congee") || s.includes("porridge") || s.includes("jook"),
    components: ["Rice porridge", "Protein toppings", "Youtiao or egg (optional)", "Spring onion / soy"],
    tip: "Plain congee is light; fried dough and fatty toppings change the total.",
  },
  {
    test: (s) => s.includes("satay"),
    components: ["Grilled meat skewers", "Peanut sauce", "Cucumber and onion", "Ketupat or rice (optional)"],
    tip: "Count skewers. Peanut sauce is calorie-dense — log how much you actually used.",
  },
];

function cuisineFallback(cuisine: string): DishGuide {
  const c = cuisine || "other";
  const map: Record<string, DishGuide> = {
    chinese: {
      components: ["Starch (rice or noodles)", "Protein or tofu", "Vegetables", "Sauce / oil"],
      tip: "Wok oil and sauces are easy to undercount. Prefer the listed portion size.",
    },
    japanese: {
      components: ["Rice or noodles", "Protein", "Broth or sauce", "Pickles / sides"],
      tip: "Broth, mayo, and fried items drive most of the variance.",
    },
    korean: {
      components: ["Rice", "Banchan sides", "Main protein or stew", "Gochujang or sesame oil"],
      tip: "Shared banchan: log only what you ate. Stews include the liquid you finish.",
    },
    thai: {
      components: ["Rice or noodles", "Protein", "Curry or stir-fry sauce", "Herbs"],
      tip: "Coconut curries are denser than clear soups. Log rice if not already included.",
    },
    vietnamese: {
      components: ["Noodles or rice", "Broth or grilled protein", "Herbs and vegetables", "Sauce"],
      tip: "Clear broths are lighter; dipping sauces still add sugar and salt.",
    },
    indian: {
      components: ["Curry or dry dish", "Rice or bread", "Ghee or oil", "Chutney or raita"],
      tip: "Bread and rice are often separate. Creamy gravies hide fat.",
    },
    malay: {
      components: ["Rice or noodles", "Sambal or gravy", "Protein", "Vegetables or pickles"],
      tip: "Sambal and coconut-based gravies matter. Shared dishes: take your share only.",
    },
    indonesian: {
      components: ["Rice", "Protein (grill, fry, or stew)", "Sambal", "Kerupuk or sides (optional)"],
      tip: "Fried sides and peanut sauces add up. Default is one plated serving.",
    },
    singaporean: {
      components: ["Hawker carb (rice/noodles)", "Protein", "Sauce", "Side vegetables"],
      tip: "Hawker portions vary. Use the listed portion, then adjust if your plate was larger.",
    },
    filipino: {
      components: ["Rice", "Main ulam (meat or fish)", "Sauce", "Optional sides"],
      tip: "Almost always with rice — add rice if the entry is the ulam only.",
    },
    western: {
      components: ["Main item", "Sauce or dressing", "Side if included"],
      tip: "Check the portion field. Add drinks and desserts separately.",
    },
  };
  return (
    map[c] || {
      components: ["Main dish as plated", "Sauces and oils on the plate", "Sides you actually ate"],
      tip: "Use the listed portion as a start, then edit if your serving differed.",
    }
  );
}

export function getDishGuide(food: FoodLike): DishGuide {
  const name = n(food.name || "");
  for (const rule of RULES) {
    if (rule.test(name)) return { components: rule.components, tip: rule.tip };
  }
  return cuisineFallback((food.cuisine || "").toLowerCase());
}
