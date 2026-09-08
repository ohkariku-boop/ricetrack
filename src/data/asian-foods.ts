/** Seed library of common Asian dishes with reference nutrition (per typical serving).
 * Values are approximate averages for home/restaurant portions — always editable in-app.
 */
export type LibraryFood = {
  id: string;
  name: string;
  name_original?: string;
  cuisine: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  tags?: string[];
};

export const ASIAN_FOODS: LibraryFood[] = [
  // Chinese
  { id: "cn-mapo-tofu", name: "Mapo Tofu", name_original: "麻婆豆腐", cuisine: "chinese", category: "main", calories: 320, protein: 18, carbs: 12, fat: 22, portion: "1 bowl (250g)", tags: ["spicy", "tofu"] },
  { id: "cn-kung-pao-chicken", name: "Kung Pao Chicken", name_original: "宫保鸡丁", cuisine: "chinese", category: "main", calories: 380, protein: 28, carbs: 18, fat: 22, portion: "1 plate (220g)", tags: ["spicy", "chicken"] },
  { id: "cn-sweet-sour-pork", name: "Sweet and Sour Pork", name_original: "糖醋里脊", cuisine: "chinese", category: "main", calories: 420, protein: 22, carbs: 35, fat: 20, portion: "1 plate (200g)" },
  { id: "cn-fried-rice", name: "Yangzhou Fried Rice", name_original: "扬州炒饭", cuisine: "chinese", category: "rice", calories: 520, protein: 16, carbs: 68, fat: 18, portion: "1 plate (350g)" },
  { id: "cn-wonton-soup", name: "Wonton Soup", name_original: "云吞汤", cuisine: "chinese", category: "soup", calories: 280, protein: 14, carbs: 32, fat: 10, portion: "1 bowl (400ml)" },
  { id: "cn-dumplings-boiled", name: "Boiled Dumplings", name_original: "水饺", cuisine: "chinese", category: "dimsum", calories: 360, protein: 16, carbs: 42, fat: 14, portion: "8 pieces" },
  { id: "cn-dumplings-panfried", name: "Pan-fried Dumplings", name_original: "锅贴", cuisine: "chinese", category: "dimsum", calories: 420, protein: 16, carbs: 40, fat: 20, portion: "8 pieces" },
  { id: "cn-xiaolongbao", name: "Xiaolongbao", name_original: "小笼包", cuisine: "chinese", category: "dimsum", calories: 300, protein: 14, carbs: 28, fat: 14, portion: "6 pieces" },
  { id: "cn-char-siu", name: "Char Siu (BBQ Pork)", name_original: "叉烧", cuisine: "chinese", category: "main", calories: 340, protein: 26, carbs: 12, fat: 20, portion: "150g" },
  { id: "cn-peking-duck", name: "Peking Duck (with pancakes)", name_original: "北京烤鸭", cuisine: "chinese", category: "main", calories: 480, protein: 28, carbs: 30, fat: 26, portion: "3 pancakes + duck" },
  { id: "cn-hotpot-broth", name: "Hotpot broth (spicy, per bowl)", name_original: "火锅汤底", cuisine: "chinese", category: "soup", calories: 180, protein: 4, carbs: 8, fat: 14, portion: "1 serving broth" },
  { id: "cn-congee", name: "Plain Congee", name_original: "白粥", cuisine: "chinese", category: "rice", calories: 150, protein: 3, carbs: 32, fat: 1, portion: "1 bowl (300g)" },
  { id: "cn-egg-fried-rice", name: "Egg Fried Rice", name_original: "蛋炒饭", cuisine: "chinese", category: "rice", calories: 450, protein: 12, carbs: 60, fat: 16, portion: "1 plate (300g)" },
  { id: "cn-chow-mein", name: "Chicken Chow Mein", name_original: "炒面", cuisine: "chinese", category: "noodles", calories: 480, protein: 22, carbs: 55, fat: 18, portion: "1 plate (350g)" },
  { id: "cn-spring-rolls", name: "Spring Rolls (fried)", name_original: "春卷", cuisine: "chinese", category: "snack", calories: 280, protein: 6, carbs: 28, fat: 16, portion: "3 pieces" },

  // Japanese
  { id: "jp-salmon-nigiri", name: "Salmon Nigiri", name_original: "サーモン握り", cuisine: "japanese", category: "sushi", calories: 60, protein: 5, carbs: 8, fat: 1.5, portion: "1 piece" },
  { id: "jp-tuna-nigiri", name: "Tuna Nigiri", name_original: "まぐろ握り", cuisine: "japanese", category: "sushi", calories: 50, protein: 6, carbs: 8, fat: 0.5, portion: "1 piece" },
  { id: "jp-california-roll", name: "California Roll", name_original: "カリフォルニアロール", cuisine: "japanese", category: "sushi", calories: 250, protein: 9, carbs: 28, fat: 10, portion: "6 pieces" },
  { id: "jp-ramen-tonkotsu", name: "Tonkotsu Ramen", name_original: "豚骨ラーメン", cuisine: "japanese", category: "noodles", calories: 650, protein: 28, carbs: 70, fat: 28, portion: "1 bowl" },
  { id: "jp-ramen-shoyu", name: "Shoyu Ramen", name_original: "醤油ラーメン", cuisine: "japanese", category: "noodles", calories: 520, protein: 24, carbs: 65, fat: 16, portion: "1 bowl" },
  { id: "jp-udon", name: "Kitsune Udon", name_original: "きつねうどん", cuisine: "japanese", category: "noodles", calories: 480, protein: 14, carbs: 78, fat: 10, portion: "1 bowl" },
  { id: "jp-chicken-katsu", name: "Chicken Katsu", name_original: "チキンカツ", cuisine: "japanese", category: "main", calories: 450, protein: 32, carbs: 28, fat: 22, portion: "1 cutlet + sauce" },
  { id: "jp-tonkatsu", name: "Tonkatsu", name_original: "とんかつ", cuisine: "japanese", category: "main", calories: 520, protein: 30, carbs: 26, fat: 30, portion: "1 cutlet" },
  { id: "jp-miso-soup", name: "Miso Soup", name_original: "味噌汁", cuisine: "japanese", category: "soup", calories: 40, protein: 3, carbs: 4, fat: 1, portion: "1 bowl" },
  { id: "jp-onigiri-salmon", name: "Salmon Onigiri", name_original: "鮭おにぎり", cuisine: "japanese", category: "rice", calories: 200, protein: 6, carbs: 36, fat: 3, portion: "1 piece" },
  { id: "jp-bento-typical", name: "Typical Japanese Bento", name_original: "弁当", cuisine: "japanese", category: "main", calories: 650, protein: 28, carbs: 80, fat: 20, portion: "1 box" },
  { id: "jp-tempura-assorted", name: "Assorted Tempura", name_original: "天ぷら盛り合わせ", cuisine: "japanese", category: "main", calories: 380, protein: 12, carbs: 30, fat: 22, portion: "5–6 pieces" },
  { id: "jp-gyudon", name: "Gyudon (Beef Bowl)", name_original: "牛丼", cuisine: "japanese", category: "rice", calories: 700, protein: 28, carbs: 90, fat: 22, portion: "1 regular bowl" },
  { id: "jp-okonomiyaki", name: "Okonomiyaki", name_original: "お好み焼き", cuisine: "japanese", category: "main", calories: 480, protein: 18, carbs: 45, fat: 24, portion: "1 pancake" },
  { id: "jp-takoyaki", name: "Takoyaki", name_original: "たこ焼き", cuisine: "japanese", category: "snack", calories: 320, protein: 12, carbs: 35, fat: 14, portion: "6 pieces" },

  // Korean
  { id: "kr-bibimbap", name: "Bibimbap", name_original: "비빔밥", cuisine: "korean", category: "rice", calories: 550, protein: 22, carbs: 70, fat: 18, portion: "1 bowl" },
  { id: "kr-kimchi-jjigae", name: "Kimchi Jjigae", name_original: "김치찌개", cuisine: "korean", category: "soup", calories: 320, protein: 18, carbs: 14, fat: 20, portion: "1 serving" },
  { id: "kr-bulgogi", name: "Bulgogi", name_original: "불고기", cuisine: "korean", category: "main", calories: 380, protein: 32, carbs: 12, fat: 22, portion: "150g meat" },
  { id: "kr-samgyeopsal", name: "Samgyeopsal (pork belly)", name_original: "삼겹살", cuisine: "korean", category: "main", calories: 450, protein: 22, carbs: 0, fat: 40, portion: "100g cooked" },
  { id: "kr-tteokbokki", name: "Tteokbokki", name_original: "떡볶이", cuisine: "korean", category: "snack", calories: 400, protein: 8, carbs: 70, fat: 8, portion: "1 serving" },
  { id: "kr-kimbap", name: "Kimbap", name_original: "김밥", cuisine: "korean", category: "rice", calories: 450, protein: 14, carbs: 65, fat: 12, portion: "1 roll (cut)" },
  { id: "kr-japchae", name: "Japchae", name_original: "잡채", cuisine: "korean", category: "noodles", calories: 380, protein: 10, carbs: 55, fat: 12, portion: "1 plate" },
  { id: "kr-fried-chicken", name: "Korean Fried Chicken", name_original: "치킨", cuisine: "korean", category: "main", calories: 520, protein: 28, carbs: 25, fat: 32, portion: "4–5 pieces" },
  { id: "kr-doenjang-jjigae", name: "Doenjang Jjigae", name_original: "된장찌개", cuisine: "korean", category: "soup", calories: 180, protein: 12, carbs: 10, fat: 10, portion: "1 serving" },
  { id: "kr-kimchi", name: "Kimchi", name_original: "김치", cuisine: "korean", category: "side", calories: 30, protein: 1, carbs: 5, fat: 0, portion: "50g" },

  // Thai
  { id: "th-pad-thai", name: "Pad Thai", name_original: "ผัดไทย", cuisine: "thai", category: "noodles", calories: 550, protein: 20, carbs: 65, fat: 22, portion: "1 plate" },
  { id: "th-green-curry", name: "Green Curry with Chicken", name_original: "แกงเขียวหวานไก่", cuisine: "thai", category: "main", calories: 420, protein: 24, carbs: 12, fat: 30, portion: "1 bowl (with coconut milk)" },
  { id: "th-tom-yum", name: "Tom Yum Goong", name_original: "ต้มยำกุ้ง", cuisine: "thai", category: "soup", calories: 180, protein: 16, carbs: 8, fat: 8, portion: "1 bowl" },
  { id: "th-mango-sticky-rice", name: "Mango Sticky Rice", name_original: "ข้าวเหนียวมะม่วง", cuisine: "thai", category: "dessert", calories: 380, protein: 5, carbs: 65, fat: 12, portion: "1 serving" },
  { id: "th-som-tam", name: "Som Tam (Papaya Salad)", name_original: "ส้มตำ", cuisine: "thai", category: "salad", calories: 120, protein: 4, carbs: 18, fat: 4, portion: "1 plate" },
  { id: "th-basil-chicken", name: "Pad Krapow Gai", name_original: "ผัดกระเพราไก่", cuisine: "thai", category: "main", calories: 450, protein: 28, carbs: 8, fat: 32, portion: "1 plate (with egg often +150)" },
  { id: "th-massaman", name: "Massaman Curry", name_original: "มัสมั่น", cuisine: "thai", category: "main", calories: 480, protein: 22, carbs: 25, fat: 32, portion: "1 bowl" },
  { id: "th-jasmine-rice", name: "Jasmine Rice", name_original: "ข้าวหอมมะลิ", cuisine: "thai", category: "rice", calories: 200, protein: 4, carbs: 45, fat: 0, portion: "1 cup cooked (150g)" },

  // Vietnamese
  { id: "vn-pho-bo", name: "Pho Bo (Beef)", name_original: "Phở bò", cuisine: "vietnamese", category: "noodles", calories: 450, protein: 28, carbs: 55, fat: 12, portion: "1 bowl" },
  { id: "vn-banh-mi", name: "Banh Mi", name_original: "Bánh mì", cuisine: "vietnamese", category: "sandwich", calories: 420, protein: 18, carbs: 48, fat: 16, portion: "1 sandwich" },
  { id: "vn-goi-cuon", name: "Goi Cuon (Fresh Spring Rolls)", name_original: "Gỏi cuốn", cuisine: "vietnamese", category: "snack", calories: 150, protein: 8, carbs: 20, fat: 4, portion: "2 rolls + sauce" },
  { id: "vn-bun-cha", name: "Bun Cha", name_original: "Bún chả", cuisine: "vietnamese", category: "noodles", calories: 520, protein: 26, carbs: 55, fat: 20, portion: "1 serving" },
  { id: "vn-com-tam", name: "Com Tam (Broken Rice)", name_original: "Cơm tấm", cuisine: "vietnamese", category: "rice", calories: 650, protein: 30, carbs: 70, fat: 24, portion: "1 plate with pork" },

  // Indian
  { id: "in-butter-chicken", name: "Butter Chicken", name_original: "मक्खन मुर्ग़", cuisine: "indian", category: "main", calories: 490, protein: 32, carbs: 12, fat: 34, portion: "1 serving (200g)" },
  { id: "in-chicken-biryani", name: "Chicken Biryani", name_original: "बिरयानी", cuisine: "indian", category: "rice", calories: 550, protein: 28, carbs: 60, fat: 20, portion: "1 plate" },
  { id: "in-dal-tadka", name: "Dal Tadka", name_original: "दाल तड़का", cuisine: "indian", category: "main", calories: 220, protein: 12, carbs: 28, fat: 8, portion: "1 bowl" },
  { id: "in-naan", name: "Butter Naan", name_original: "नान", cuisine: "indian", category: "bread", calories: 280, protein: 8, carbs: 42, fat: 8, portion: "1 piece" },
  { id: "in-samosa", name: "Samosa", name_original: "समोसा", cuisine: "indian", category: "snack", calories: 250, protein: 5, carbs: 28, fat: 14, portion: "1 piece" },
  { id: "in-paneer-tikka", name: "Paneer Tikka", name_original: "पनीर टिक्का", cuisine: "indian", category: "main", calories: 340, protein: 18, carbs: 10, fat: 24, portion: "1 serving" },
  { id: "in-masala-dosa", name: "Masala Dosa", name_original: "मसाला डोसा", cuisine: "indian", category: "main", calories: 350, protein: 8, carbs: 50, fat: 12, portion: "1 dosa + filling" },
  { id: "in-chole", name: "Chole (Chickpea Curry)", name_original: "छोले", cuisine: "indian", category: "main", calories: 280, protein: 12, carbs: 35, fat: 10, portion: "1 bowl" },

  // Malay / Indonesian / Singapore
  { id: "my-nasi-lemak", name: "Nasi Lemak", name_original: "Nasi Lemak", cuisine: "malay", category: "rice", calories: 600, protein: 18, carbs: 70, fat: 26, portion: "1 plate with sambal + egg + anchovies" },
  { id: "my-laksa", name: "Laksa", name_original: "Laksa", cuisine: "malay", category: "noodles", calories: 550, protein: 22, carbs: 50, fat: 28, portion: "1 bowl" },
  { id: "my-roti-canai", name: "Roti Canai", name_original: "Roti Canai", cuisine: "malay", category: "bread", calories: 300, protein: 6, carbs: 40, fat: 12, portion: "1 piece + dhal" },
  { id: "my-satay", name: "Chicken Satay", name_original: "Satay", cuisine: "malay", category: "main", calories: 280, protein: 24, carbs: 8, fat: 16, portion: "5 sticks + peanut sauce" },
  { id: "id-nasi-goreng", name: "Nasi Goreng", name_original: "Nasi Goreng", cuisine: "indonesian", category: "rice", calories: 520, protein: 16, carbs: 65, fat: 20, portion: "1 plate" },
  { id: "id-rendang", name: "Beef Rendang", name_original: "Rendang", cuisine: "indonesian", category: "main", calories: 420, protein: 28, carbs: 8, fat: 30, portion: "150g" },
  { id: "id-gado-gado", name: "Gado-Gado", name_original: "Gado-Gado", cuisine: "indonesian", category: "salad", calories: 380, protein: 14, carbs: 30, fat: 22, portion: "1 plate with peanut sauce" },
  { id: "id-soto-ayam", name: "Soto Ayam", name_original: "Soto Ayam", cuisine: "indonesian", category: "soup", calories: 320, protein: 22, carbs: 25, fat: 12, portion: "1 bowl" },
  { id: "sg-chicken-rice", name: "Hainanese Chicken Rice", name_original: "海南鸡饭", cuisine: "singaporean", category: "rice", calories: 550, protein: 32, carbs: 55, fat: 18, portion: "1 plate" },
  { id: "sg-chili-crab", name: "Chili Crab (portion)", name_original: "辣椒螃蟹", cuisine: "singaporean", category: "main", calories: 400, protein: 28, carbs: 15, fat: 24, portion: "1 serving with sauce" },

  // Filipino
  { id: "ph-adobo", name: "Chicken Adobo", name_original: "Adobo", cuisine: "filipino", category: "main", calories: 380, protein: 32, carbs: 8, fat: 22, portion: "1 serving" },
  { id: "ph-sinigang", name: "Sinigang na Baboy", name_original: "Sinigang", cuisine: "filipino", category: "soup", calories: 280, protein: 22, carbs: 12, fat: 14, portion: "1 bowl" },
  { id: "ph-lechon-kawali", name: "Lechon Kawali", name_original: "Lechon Kawali", cuisine: "filipino", category: "main", calories: 480, protein: 24, carbs: 5, fat: 40, portion: "150g" },
  { id: "ph-pancit", name: "Pancit Canton", name_original: "Pancit", cuisine: "filipino", category: "noodles", calories: 420, protein: 14, carbs: 55, fat: 14, portion: "1 plate" },
  { id: "ph-halo-halo", name: "Halo-Halo", name_original: "Halo-halo", cuisine: "filipino", category: "dessert", calories: 350, protein: 6, carbs: 60, fat: 10, portion: "1 serving" },

  // Staples
  { id: "st-white-rice", name: "Steamed White Rice", cuisine: "other_asian", category: "rice", calories: 200, protein: 4, carbs: 45, fat: 0, portion: "1 bowl (150g cooked)" },
  { id: "st-brown-rice", name: "Brown Rice", cuisine: "other_asian", category: "rice", calories: 215, protein: 5, carbs: 45, fat: 1.5, portion: "1 bowl (150g)" },
  { id: "st-tofu-firm", name: "Firm Tofu (steamed)", cuisine: "other_asian", category: "protein", calories: 140, protein: 16, carbs: 3, fat: 8, portion: "150g" },
  { id: "st-edamame", name: "Edamame", cuisine: "japanese", category: "side", calories: 120, protein: 11, carbs: 9, fat: 5, portion: "100g" },
];

export const CUISINE_LABELS: Record<string, string> = {
  chinese: "Chinese",
  japanese: "Japanese",
  korean: "Korean",
  thai: "Thai",
  vietnamese: "Vietnamese",
  indian: "Indian",
  malay: "Malay",
  indonesian: "Indonesian",
  singaporean: "Singaporean",
  filipino: "Filipino",
  other_asian: "Other Asian",
};
