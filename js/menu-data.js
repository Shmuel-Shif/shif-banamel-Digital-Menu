/**
 * Menu data — שיף בנמל
 */
const SHIPLANCHA_DESC = 'מגיע עם צ\'יפס';
const PLATE_DESC = 'עיקרית, לחם, מטבלי הבית, 2 תוספות — אורז וסלט';
const SALAD_MEAT_DESC = 'חסה, כרוב לבן, מלפפון, גמבה, חצילים, בצל סגול וירק. מטובל בשמן זית, מלח, לימון וטחינה מלמעלה';
const BURGER_FRIES = ' מגיע עם צ\'יפס';
const DRINKS_DESC = 'מוגש עם קרח';

const MENU_DATA = {
  restaurant: 'שיף בנמל',
  categories: [
    {
      id: 'shiplancha',
      title: 'שיפלנצ\'ה',
      items: [
        {
          name: 'קריספי שניצל בחלה',
          description: SHIPLANCHA_DESC,
          price: 65,
          image: 'assets/images/קריספי שניצל בחלה.webp'
        },
        {
          name: 'חזה עוף מטובלן בחלה',
          description: SHIPLANCHA_DESC,
          price: 65,
          image: 'assets/images/חזה עוף בחלה.webp'
        },
        {
          name: 'פרגית במרינדה בחלה',
          description: SHIPLANCHA_DESC,
          price: 80,
          image: 'assets/images/פרגית מרינדה בחלה.webp'
        },
        {
          name: 'בשר מפורק בחלה',
          description: SHIPLANCHA_DESC,
          price: 80,
          image: 'assets/images/בשר מפורק בחלה.webp'
        },
        {
          name: 'קריספי שניצל בפרנה',
          description: SHIPLANCHA_DESC,
          price: 65,
          image: 'assets/images/קריספי שניצל בפרנה.webp'
        },
        {
          name: 'חזה עוף מטובלן בפרנה',
          description: SHIPLANCHA_DESC,
          price: 65,
          image: 'assets/images/חזה עוף בפרנה.webp'
        },
        {
          name: 'פרגית במרינדה בפרנה',
          description: SHIPLANCHA_DESC,
          price: 80,
          image: 'assets/images/פרגית מרינדה בפרנה.webp'
        },
        {
          name: 'בשר מפורק בפרנה',
          description: SHIPLANCHA_DESC,
          price: 80,
          image: 'assets/images/בשר מפורק בפרנה.webp'
        }
      ]
    },
    {
      id: 'burgers',
      title: 'שיפבורגר',
      items: [
        {
          name: 'שיפבורגר קלאסי',
          description: 'קציצת המבורגר בלחמנייה, מבחר ירקות ורטבים.' + BURGER_FRIES,
          price: 75,
          image: 'assets/images/שיפבורגר.webp'
        },
        {
          name: 'שיפבורגר לאמיצים',
          description: 'קציצת המבורגר פיקנטית בלחמנייה, מבחר ירקות ורטבים.' + BURGER_FRIES,
          price: 78,
          image: 'assets/images/שיפבורגר לאמיצים.webp'
        },
        {
          name: 'שיפבורגר קריספי',
          description: 'קציצת המבורגר בלחמנייה קריספית מטוגנת, מבחר ירקות ורטבים.' + BURGER_FRIES,
          price: 80,
          image: 'assets/images/שיפבורגר קריספי.webp'
        },
        {
          name: 'שיפבורגר דאבל',
          description: 'המבורגר כפול בלחמנייה, מבחר ירקות ורטבים.' + BURGER_FRIES,
          price: 90,
          image: 'assets/images/שיפבורגר דאבל.webp'
        },
        {
          name: 'שיפבורגר זוגי',
          description: '2 שיפבורגר קלאסי + צ\'יפס גדול + 2 שתייה',
          price: 155,
          image: 'assets/images/שיפבורגר זוגי.webp'
        },
        {
          name: 'שיפבורגר משפחתי',
          description: '5 שיפבורגר קלאסי + 2 צ\'יפס גדול + 5 שתייה',
          price: 390,
          image: 'assets/images/שיפבורגר משפחתי.webp'
        }
      ],
      subsections: [
        {
          title: 'תוספות לשיפבורגר',
          items: [
            {
              name: 'תוספת בשר',
              description: '',
              price: 15,
              image: 'assets/images/תוספת בשר מפורק.webp'
            },
            {
              name: 'תוספת שיפצ\'יקון',
              description: '',
              price: 15,
              image: 'assets/images/תוספת שיפצ\'קן.webp'
            },
            {
              name: 'תוספת שניצל',
              description: '',
              price: 13,
              image: 'assets/images/תוספת שניצל.webp'
            },
            {
              name: 'תוספת ביצת עין',
              description: '',
              price: 10,
              image: 'assets/images/תוספת ביצת עין.webp'
            }
          ]
        }
      ]
    },
    {
      id: 'plates',
      title: 'מנות בצלחת',
      items: [
        {
          name: 'קריספי שניצל',
          description: PLATE_DESC,
          price: 80,
          image: 'assets/images/קריספי שניצל בצלחת.webp'
        },
        {
          name: 'חזה עוף מטובלן',
          description: PLATE_DESC,
          price: 80,
          image: 'assets/images/חזה עוף בצלחת.webp'
        },
        {
          name: 'פרגית במרינדה',
          description: PLATE_DESC,
          price: 90,
          image: 'assets/images/פרגית מרינדה בצלחת.webp'
        },
        {
          name: 'בשר מפורק',
          description: PLATE_DESC,
          price: 90,
          image: 'assets/images/בשר מפורק בצלחת.webp'
        }
      ]
    },
    {
      id: 'specials',
      title: 'ספיישלים שיף בנמל',
      items: [
        {
          name: 'שיפצ\'יקן',
          description: 'חזה עוף בטמפרטורה בציפוי פריך ברוטב אסייתי ושומשום מלמעלה',
          price: 60,
          image: 'assets/images/שיפצ_יקן.webp'
        },
        {
          name: 'שיפצ\'יקן בצלחת',
          description: 'חזה עוף בטמפרטורה בציפוי פריך ברוטב אסייתי ושומשום מלמעלה, מוגש עם אורז וסלט',
          price: 80,
          image: 'assets/images/שיפצ_יקן בצלחת.webp'
        },
        {
          name: 'אצבעות נישנוש',
          description: 'אצבעות שניצל מטוגנים, מוגש לצד רוטב הבית',
          price: 38,
          image: 'assets/images/אצבעות נישנוש.webp'
        },
        {
          name: 'כנפיים נישנוש',
          description: 'שמונה חצאי כנפיים ברוטב אסייתי, מוגש עם שומשום מלמעלה',
          price: 40,
          image: 'assets/images/כנפיים נשנוש.webp'
        },
        {
          name: 'ארנצ\'יני בשר',
          description: 'ארבעה כדורים ממולאים בבשר, אורז וירק בציפוי פריך, מוגש על רוטב הבית',
          price: 48,
          image: 'assets/images/ארנצ\'יני בשר.webp'
        },
        {
          name: 'צלחת חומוס',
          description: 'מוגש עם שמן זית, ירק, חצילים וטחינה לצד חמוצים, לחם ומטבלי הבית',
          price: 40,
          image: 'assets/images/צלחת חומוס.webp'
        },
        {
          name: 'לחם הבית',
          description: 'מוגש עם שלושה מטבלי הבית',
          price: 22,
          image: 'assets/images/לחם הבית.webp'
        }
      ]
    },
    {
      id: 'salads',
      title: 'סלטי הבית',
      items: [
        {
          name: 'סלט ירקות',
          description: 'חסה, כרוב לבן, מלפפון, עגבניה. מטובל בשמן זית, לימון ומלח',
          price: 40,
          image: 'assets/images/סלט ירקות.webp'
        },
        {
          name: 'סלט הום פרייז',
          description: 'קוביות תפוח אדמה ברוטב צ\'ילי מתוק, חסה, כרוב סגול, מלפפון, גזר, מטובל ברוטב הבית',
          price: 55,
          image: 'assets/images/סלט הום פרייז.webp'
        },
        {
          name: 'סלט פרגית',
          description: SALAD_MEAT_DESC,
          price: 70,
          image: 'assets/images/סלט פרגית במרינדה.webp'
        },
        {
          name: 'סלט שניצל',
          description: SALAD_MEAT_DESC,
          price: 70,
          image: 'assets/images/סלט קריספי שניצל.webp'
        },
        {
          name: 'סלט חזה עוף',
          description: SALAD_MEAT_DESC,
          price: 70,
          image: 'assets/images/סלט חזה עוף.webp'
        },
        {
          name: 'סלט בשר',
          description: SALAD_MEAT_DESC,
          price: 70,
          image: 'assets/images/סלט בשר מפורק.webp'
        }
      ]
    },
    {
      id: 'sides',
      title: 'לצד המנה',
      items: [
        {
          name: 'הום פרייז',
          description: '',
          price: 40,
          image: 'assets/images/הום פרייז.webp'
        },
        {
          name: 'צ\'יפס תפוח אדמה',
          description: '',
          price: 20,
          image: 'assets/images/צ_יפס תפוח אדמה.webp'
        },
        {
          name: 'טבעות בצל',
          description: '',
          price: 30,
          image: 'assets/images/טבעות בצל.webp'
        },
        {
          name: 'כרובית מטוגנת',
          description: '',
          price: 35,
          image: 'assets/images/כרובית מטוגנת.webp'
        },
        {
          name: 'אורז',
          description: '',
          price: 25,
          image: 'assets/images/אורז.webp'
        }
      ]
    },
    {
      id: 'kids',
      title: 'מנת ילדים',
      items: [
        {
          name: 'שניצל בתוספת צ\'יפס',
          description: '',
          price: 48,
          image: 'assets/images/מנת ילדים.webp'
        }
      ]
    },
    {
      id: 'drinks',
      title: 'שתייה',
      items: [
        {
          name: 'תפוזים',
          description: DRINKS_DESC,
          price: 10,
          image: 'assets/images/תפוזים.webp'
        },
        {
          name: 'תות בננה',
          description: DRINKS_DESC,
          price: 10,
          image: 'assets/images/תות בננה.webp'
        },
        {
          name: 'לימונענע',
          description: DRINKS_DESC,
          price: 10,
          image: 'assets/images/לימונענע.webp'
        },
        {
          name: 'ענבים',
          description: DRINKS_DESC,
          price: 10,
          image: 'assets/images/ענבים.webp'
        }
      ]
    }
  ]
};
