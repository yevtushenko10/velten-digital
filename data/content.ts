export type Locale = "ru" | "ua" | "en" | "de";

export type Service = {
  title: string;
  description: string;
};

export type PricingPlan = {
  name: string;
  features: string[];
  price: string;
  badge?: string;
};

export type TranslatedContent = {
  nav: {
    services: string;
    pricing: string;
    faq: string;
    contact: string;
    getStarted: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaTelegram: string;
  };
  sectionLabels: {
    services: string;
    pricing: string;
    process: string;
    faq: string;
    aiSupport: string;
    contact: string;
  };
  services: Service[];
  pricing: {
    plans: PricingPlan[];
    noteSupport: string;
    noteCustom: string;
  };
  processSteps: string[];
  faqItems: { q: string; a: string }[];
  aiSupport: {
    title: string;
    text: string;
    button: string;
    placeholder: string;
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    message: string;
    submit: string;
    telegram: string;
    emailPlaceholder: string;
  };
  footer: {
    rights: string;
  };
};

const servicesCore: Service[] = [
  {
    title: "Websites & Landing Pages",
    description:
      "Modern corporate websites and landing pages designed to convert premium clients."
  },
  {
    title: "AI Chat Support",
    description:
      "AI-powered support for FAQs, lead qualification, and client communication."
  },
  {
    title: "Telegram Bots",
    description:
      "Bots for communication, lead capture, notifications, and user flows."
  },
  {
    title: "Business Automation (n8n)",
    description:
      "Workflow automation for CRM, email, forms, internal processes, and integrations."
  },
  {
    title: "Data Analytics & Dashboards",
    description:
      "KPI tracking, dashboards, reports, and data visibility for smarter decisions."
  }
];

const pricingCore: PricingPlan[] = [
  {
    name: "Starter",
    features: [
      "Website / landing page",
      "Hosting & domain setup",
      "Basic SEO",
      "Google Analytics / Tag Manager setup"
    ],
    price: "10 000 грн / €220"
  },
  {
    name: "Growth",
    badge: "Popular",
    features: [
      "Starter package",
      "AI Chat Support",
      "Telegram Bot or Telegram Bot with AI"
    ],
    price: "15 000 - 20 000 грн / €330 - €440"
  },
  {
    name: "Pro",
    features: [
      "Growth package",
      "n8n automation",
      "Data analysis",
      "Custom AI solutions",
      "Claude Skills / MCP dashboards"
    ],
    price: "from 30 000 грн / from €660"
  }
];

export const content: Record<Locale, TranslatedContent> = {
  en: {
    nav: {
      services: "Services",
      pricing: "Pricing",
      faq: "FAQ",
      contact: "Contact",
      getStarted: "Get Started"
    },
    hero: {
      title: "Velten Digital - AI & Automation Agency",
      subtitle:
        "We build websites, AI assistants and automation systems that grow your business.",
      ctaPrimary: "Get Started",
      ctaTelegram: "Talk in Telegram"
    },
    sectionLabels: {
      services: "Services",
      pricing: "Pricing",
      process: "How It Works",
      faq: "FAQ",
      aiSupport: "AI Support",
      contact: "Contact"
    },
    services: servicesCore,
    pricing: {
      plans: pricingCore,
      noteSupport: "Support and maintenance are charged separately.",
      noteCustom: "Advanced automation and analytics are calculated individually."
    },
    processSteps: [
      "You describe your business",
      "We design your digital solution",
      "We build and launch it",
      "We support and optimize it"
    ],
    faqItems: [
      {
        q: "What is included in the Starter package?",
        a: "A conversion-focused website with hosting/domain setup, basic SEO, and analytics setup."
      },
      {
        q: "Can AI be added later?",
        a: "Yes. We can add AI assistants, workflows, and automations as your business scales."
      },
      { q: "Do you build Telegram bots?", a: "Yes, from simple lead bots to AI-powered communication bots." },
      {
        q: "Do you provide ongoing support?",
        a: "Yes. We offer flexible maintenance and optimization retainers after launch."
      },
      {
        q: "Can you automate my business processes?",
        a: "Yes. We build n8n-based automation for CRM, forms, email, and internal operations."
      },
      {
        q: "Can you build multilingual websites?",
        a: "Yes. We structure projects for clean multi-language experiences."
      },
      {
        q: "Can AI support be integrated into the website?",
        a: "Yes. We integrate AI chat support widgets and custom assistant experiences."
      }
    ],
    aiSupport: {
      title: "Ask our AI assistant",
      text: "Get instant answers about services, pricing, and automation opportunities.",
      button: "Open AI Support",
      placeholder: "Future embedded AI chat widget"
    },
    contact: {
      title: "Let's build your digital growth system",
      subtitle: "Tell us about your business goals and we will craft the right solution.",
      name: "Name",
      email: "Email",
      message: "Message",
      submit: "Send Message",
      telegram: "Talk in Telegram",
      emailPlaceholder: "business@veltendigital.com"
    },
    footer: {
      rights: "All rights reserved."
    }
  },
  ru: {
    nav: {
      services: "Услуги",
      pricing: "Тарифы",
      faq: "FAQ",
      contact: "Контакты",
      getStarted: "Начать"
    },
    hero: {
      title: "Velten Digital - AI и автоматизация для бизнеса",
      subtitle:
        "Мы создаем сайты, AI-ассистентов и системы автоматизации, которые развивают ваш бизнес.",
      ctaPrimary: "Начать",
      ctaTelegram: "Написать в Telegram"
    },
    sectionLabels: {
      services: "Услуги",
      pricing: "Тарифы",
      process: "Как мы работаем",
      faq: "FAQ",
      aiSupport: "AI поддержка",
      contact: "Контакты"
    },
    services: servicesCore.map((item) => item),
    pricing: {
      plans: pricingCore.map((item) => item),
      noteSupport: "Поддержка и обслуживание оплачиваются отдельно.",
      noteCustom: "Сложная автоматизация и аналитика рассчитываются индивидуально."
    },
    processSteps: [
      "Вы описываете ваш бизнес",
      "Мы проектируем цифровое решение",
      "Мы создаем и запускаем",
      "Мы поддерживаем и оптимизируем"
    ],
    faqItems: [
      { q: "Что входит в пакет Starter?", a: "Сайт, настройка хостинга и домена, базовое SEO и аналитика." },
      { q: "Можно ли добавить AI позже?", a: "Да, мы подключим AI-инструменты на любом этапе." },
      { q: "Вы делаете Telegram-ботов?", a: "Да, от простых до AI-ботов для коммуникации и лидов." },
      { q: "Есть ли дальнейшая поддержка?", a: "Да, мы предлагаем сопровождение и улучшения после запуска." },
      {
        q: "Можно автоматизировать бизнес-процессы?",
        a: "Да, мы автоматизируем CRM, формы, email и внутренние процессы через n8n."
      },
      { q: "Вы делаете мультиязычные сайты?", a: "Да, мы закладываем структуру для нескольких языков." },
      {
        q: "Можно интегрировать AI-поддержку на сайт?",
        a: "Да, интегрируем AI-чат и ассистентов под ваши задачи."
      }
    ],
    aiSupport: {
      title: "Спросите нашего AI-ассистента",
      text: "Получите быстрые ответы по услугам, цене и возможностям автоматизации.",
      button: "Открыть AI поддержку",
      placeholder: "Место для будущего AI-чата"
    },
    contact: {
      title: "Построим вашу систему цифрового роста",
      subtitle: "Опишите цели бизнеса, и мы предложим решение под вас.",
      name: "Имя",
      email: "Email",
      message: "Сообщение",
      submit: "Отправить",
      telegram: "Написать в Telegram",
      emailPlaceholder: "business@veltendigital.com"
    },
    footer: {
      rights: "Все права защищены."
    }
  },
  ua: {
    nav: {
      services: "Послуги",
      pricing: "Ціни",
      faq: "FAQ",
      contact: "Контакти",
      getStarted: "Почати"
    },
    hero: {
      title: "Velten Digital - AI та автоматизація для бізнесу",
      subtitle:
        "Ми створюємо сайти, AI-асистентів і системи автоматизації, що розвивають ваш бізнес.",
      ctaPrimary: "Почати",
      ctaTelegram: "Написати в Telegram"
    },
    sectionLabels: {
      services: "Послуги",
      pricing: "Ціни",
      process: "Як це працює",
      faq: "FAQ",
      aiSupport: "AI підтримка",
      contact: "Контакти"
    },
    services: servicesCore.map((item) => item),
    pricing: {
      plans: pricingCore.map((item) => item),
      noteSupport: "Підтримка та супровід оплачуються окремо.",
      noteCustom: "Складна автоматизація та аналітика розраховуються індивідуально."
    },
    processSteps: [
      "Ви описуєте свій бізнес",
      "Ми проєктуємо цифрове рішення",
      "Ми створюємо та запускаємо",
      "Ми підтримуємо та оптимізуємо"
    ],
    faqItems: [
      { q: "Що входить у пакет Starter?", a: "Сайт, налаштування хостингу й домену, базове SEO та аналітика." },
      { q: "Чи можна додати AI пізніше?", a: "Так, ми можемо інтегрувати AI на будь-якому етапі." },
      { q: "Ви створюєте Telegram-ботів?", a: "Так, від базових до AI-ботів для комунікації та лідів." },
      { q: "Чи надаєте подальшу підтримку?", a: "Так, пропонуємо супровід і розвиток після запуску." },
      {
        q: "Чи можете автоматизувати бізнес-процеси?",
        a: "Так, автоматизуємо CRM, форми, email та внутрішні процеси через n8n."
      },
      { q: "Чи створюєте мультимовні сайти?", a: "Так, закладаємо чисту структуру для кількох мов." },
      {
        q: "Чи можна інтегрувати AI-підтримку на сайт?",
        a: "Так, інтегруємо AI-чат і кастомні асистенти."
      }
    ],
    aiSupport: {
      title: "Запитайте нашого AI-асистента",
      text: "Отримайте миттєві відповіді щодо послуг, цін і можливостей автоматизації.",
      button: "Відкрити AI підтримку",
      placeholder: "Майбутній віджет AI-чату"
    },
    contact: {
      title: "Побудуємо вашу систему цифрового зростання",
      subtitle: "Розкажіть про цілі бізнесу, і ми запропонуємо правильне рішення.",
      name: "Ім'я",
      email: "Email",
      message: "Повідомлення",
      submit: "Надіслати",
      telegram: "Написати в Telegram",
      emailPlaceholder: "business@veltendigital.com"
    },
    footer: {
      rights: "Усі права захищено."
    }
  },
  de: {
    nav: {
      services: "Leistungen",
      pricing: "Preise",
      faq: "FAQ",
      contact: "Kontakt",
      getStarted: "Starten"
    },
    hero: {
      title: "Velten Digital - KI- und Automatisierungsagentur",
      subtitle:
        "Wir entwickeln Websites, KI-Assistenten und Automatisierungssysteme, die Ihr Unternehmen wachsen lassen.",
      ctaPrimary: "Starten",
      ctaTelegram: "In Telegram sprechen"
    },
    sectionLabels: {
      services: "Leistungen",
      pricing: "Preise",
      process: "So funktioniert es",
      faq: "FAQ",
      aiSupport: "KI Support",
      contact: "Kontakt"
    },
    services: servicesCore.map((item) => item),
    pricing: {
      plans: pricingCore.map((item) => item),
      noteSupport: "Support und Wartung werden separat berechnet.",
      noteCustom: "Erweiterte Automatisierung und Analytics werden individuell kalkuliert."
    },
    processSteps: [
      "Sie beschreiben Ihr Unternehmen",
      "Wir entwerfen Ihre digitale Loesung",
      "Wir bauen und launchen",
      "Wir betreuen und optimieren"
    ],
    faqItems: [
      {
        q: "Was ist im Starter-Paket enthalten?",
        a: "Eine conversionstarke Website inklusive Hosting/Domain, Basis-SEO und Analytics-Setup."
      },
      { q: "Kann KI spaeter hinzugefuegt werden?", a: "Ja, KI-Funktionen lassen sich jederzeit nachruesten." },
      { q: "Erstellen Sie Telegram-Bots?", a: "Ja, von einfachen Bots bis zu KI-gestuetzten Workflows." },
      { q: "Bieten Sie laufenden Support an?", a: "Ja, inklusive Wartung und kontinuierlicher Optimierung." },
      {
        q: "Koennen Sie meine Prozesse automatisieren?",
        a: "Ja, mit n8n-Automationen fuer CRM, E-Mail, Formulare und interne Prozesse."
      },
      { q: "Bauen Sie mehrsprachige Websites?", a: "Ja, wir erstellen saubere mehrsprachige Strukturen." },
      {
        q: "Kann KI-Support in die Website integriert werden?",
        a: "Ja, wir integrieren KI-Chat-Widgets und Assistant-Erlebnisse."
      }
    ],
    aiSupport: {
      title: "Fragen Sie unseren KI-Assistenten",
      text: "Erhalten Sie schnelle Antworten zu Leistungen, Preisen und Automatisierungspotenzialen.",
      button: "KI Support oeffnen",
      placeholder: "Platzhalter fuer spaeteres KI-Chat-Widget"
    },
    contact: {
      title: "Lassen Sie uns Ihr Wachstumssystem bauen",
      subtitle: "Beschreiben Sie Ihre Ziele, wir liefern die passende Loesung.",
      name: "Name",
      email: "E-Mail",
      message: "Nachricht",
      submit: "Nachricht senden",
      telegram: "In Telegram sprechen",
      emailPlaceholder: "business@veltendigital.com"
    },
    footer: {
      rights: "Alle Rechte vorbehalten."
    }
  }
};
