import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'ru' | 'kz';
  setLanguage: (lang: 'ru' | 'kz') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Enhanced translations object
const translations = {
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.tests': 'Тесты',
    'nav.profile': 'Профиль',
    'nav.admin': 'Админ',
    'nav.logout': 'Выйти',
    'nav.login': 'Войти',
    'nav.register': 'Регистрация',
    
    // Auth
    'auth.login': 'Вход в систему',
    'auth.register': 'Регистрация',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.name': 'Имя',
    'auth.role': 'Роль',
    'auth.student': 'Ученик',
    'auth.teacher': 'Учитель',
    'auth.tutor': 'Репетитор',
    'auth.submit': 'Подтвердить',
    'auth.switchToLogin': 'Уже есть аккаунт? Войти',
    'auth.switchToRegister': 'Нет аккаунта? Зарегистрироваться',
    'auth.insufficientPermissions': 'Недостаточно прав доступа',
    
    // Home
    'home.title': 'Образовательная платформа',
    'home.subtitle': 'Изучайте, тестируйтесь, развивайтесь',
    'home.startTesting': 'Начать тестирование',
    'home.features.title': 'Возможности платформы',
    'home.features.tests': 'Интерактивные тесты',
    'home.features.progress': 'Отслеживание прогресса',
    'home.features.ai': 'ИИ-помощник',
    
    // Tests
    'tests.title': 'Тесты',
    'tests.start': 'Начать тест',
    'tests.question': 'Вопрос',
    'tests.next': 'Далее',
    'tests.submit': 'Отправить',
    'tests.results': 'Результаты',
    'tests.score': 'Результат',
    'tests.correct': 'Правильно',
    'tests.incorrect': 'Неправильно',
    'tests.timeLeft': 'Осталось времени',
    'tests.practiceMode': 'Режим практики',
    'tests.timedMode': 'Тест на время',
    'tests.aiMode': 'ИИ тест',
    'tests.generateAI': 'Создать ИИ тест',
    'tests.showExplanations': 'Показать объяснения',
    'tests.hideExplanations': 'Скрыть объяснения',
    'tests.retakeTest': 'Пройти еще раз',
    'tests.explanation': 'Объяснение',
    
    // Profile
    'profile.title': 'Профиль',
    'profile.statistics': 'Статистика',
    'profile.testsCompleted': 'Тестов завершено',
    'profile.averageScore': 'Средний балл',
    'profile.progress': 'Прогресс',
    'profile.achievements': 'Достижения',
    'profile.rank': 'Уровень',
    'profile.streak': 'Серия побед',
    'profile.studyTime': 'Время обучения',
    'profile.recentTests': 'Последние тесты',
    
    // Admin
    'admin.title': 'Панель администратора',
    'admin.addQuestion': 'Добавить вопрос',
    'admin.questionText': 'Текст вопроса',
    'admin.answers': 'Варианты ответов',
    'admin.correctAnswer': 'Правильный ответ',
    'admin.save': 'Сохранить',
    'admin.questions': 'Вопросы',
    'admin.edit': 'Редактировать',
    'admin.delete': 'Удалить',
    'admin.subject': 'Предмет',
    'admin.difficulty': 'Сложность',
    'admin.totalQuestions': 'Всего вопросов',
    'admin.totalUsers': 'Всего пользователей',
    'admin.totalTests': 'Всего тестов',
    
    // AI Assistant
    'ai.title': 'ИИ Помощник',
    'ai.placeholder': 'Задайте вопрос или опишите, с чем нужна помощь...',
    'ai.quickActions': 'Быстрые действия',
    'ai.explainTopic': 'Объясни тему',
    'ai.testPrep': 'Подготовка к тесту',
    'ai.askQuestion': 'Задать вопрос',
    'ai.studyTips': 'Советы по учебе',
    'ai.typing': 'ИИ печатает...',
    'ai.error': 'Ошибка при обращении к ИИ',
    'ai.features.explain': 'Объяснение сложных тем',
    'ai.features.testPrep': 'Подготовка к тестам',
    'ai.features.questions': 'Ответы на вопросы',
    'ai.features.tips': 'Советы по обучению',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    'common.cancel': 'Отмена',
    'common.confirm': 'Подтвердить',
    'common.language': 'Язык',
    'common.save': 'Сохранить',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.add': 'Добавить',
    'common.search': 'Поиск',
    'common.filter': 'Фильтр',
    'common.sort': 'Сортировка',
    'common.close': 'Закрыть',
    'common.open': 'Открыть',
    'common.show': 'Показать',
    'common.hide': 'Скрыть',
  },
  kz: {
    // Navigation
    'nav.home': 'Басты бет',
    'nav.tests': 'Тесттер',
    'nav.profile': 'Профиль',
    'nav.admin': 'Админ',
    'nav.logout': 'Шығу',
    'nav.login': 'Кіру',
    'nav.register': 'Тіркелу',
    
    // Auth
    'auth.login': 'Жүйеге кіру',
    'auth.register': 'Тіркелу',
    'auth.email': 'Электрондық пошта',
    'auth.password': 'Құпия сөз',
    'auth.name': 'Аты',
    'auth.role': 'Рөлі',
    'auth.student': 'Оқушы',
    'auth.teacher': 'Мұғалім',
    'auth.tutor': 'Тәлімгер',
    'auth.submit': 'Растау',
    'auth.switchToLogin': 'Аккаунт бар ма? Кіру',
    'auth.switchToRegister': 'Аккаунт жоқ па? Тіркелу',
    'auth.insufficientPermissions': 'Қол жетімділік құқығы жеткіліксіз',
    
    // Home
    'home.title': 'Білім беру платформасы',
    'home.subtitle': 'Үйреніңіз, тест тапсырыңыз, дамыңыз',
    'home.startTesting': 'Тестілеуді бастау',
    'home.features.title': 'Платформа мүмкіндіктері',
    'home.features.tests': 'Интерактивті тесттер',
    'home.features.progress': 'Прогресті бақылау',
    'home.features.ai': 'ИИ-көмекші',
    
    // Tests
    'tests.title': 'Тесттер',
    'tests.start': 'Тестті бастау',
    'tests.question': 'Сұрақ',
    'tests.next': 'Келесі',
    'tests.submit': 'Жіберу',
    'tests.results': 'Нәтижелер',
    'tests.score': 'Нәтиже',
    'tests.correct': 'Дұрыс',
    'tests.incorrect': 'Қате',
    'tests.timeLeft': 'Қалған уақыт',
    'tests.practiceMode': 'Практика режимі',
    'tests.timedMode': 'Уақытпен тест',
    'tests.aiMode': 'ИИ тест',
    'tests.generateAI': 'ИИ тест жасау',
    'tests.showExplanations': 'Түсініктемелерді көрсету',
    'tests.hideExplanations': 'Түсініктемелерді жасыру',
    'tests.retakeTest': 'Қайта тапсыру',
    'tests.explanation': 'Түсініктеме',
    
    // Profile
    'profile.title': 'Профиль',
    'profile.statistics': 'Статистика',
    'profile.testsCompleted': 'Аяқталған тесттер',
    'profile.averageScore': 'Орташа ұпай',
    'profile.progress': 'Прогресс',
    'profile.achievements': 'Жетістіктер',
    'profile.rank': 'Деңгей',
    'profile.streak': 'Жеңістер сериясы',
    'profile.studyTime': 'Оқу уақыты',
    'profile.recentTests': 'Соңғы тесттер',
    
    // Admin
    'admin.title': 'Әкімші панелі',
    'admin.addQuestion': 'Сұрақ қосу',
    'admin.questionText': 'Сұрақ мәтіні',
    'admin.answers': 'Жауап нұсқалары',
    'admin.correctAnswer': 'Дұрыс жауап',
    'admin.save': 'Сақтау',
    'admin.questions': 'Сұрақтар',
    'admin.edit': 'Өңдеу',
    'admin.delete': 'Жою',
    'admin.subject': 'Пән',
    'admin.difficulty': 'Қиындық',
    'admin.totalQuestions': 'Барлық сұрақтар',
    'admin.totalUsers': 'Барлық пайдаланушылар',
    'admin.totalTests': 'Барлық тесттер',
    
    // AI Assistant
    'ai.title': 'ИИ Көмекші',
    'ai.placeholder': 'Сұрақ қойыңыз немесе көмек керек екенін айтыңыз...',
    'ai.quickActions': 'Жылдам әрекеттер',
    'ai.explainTopic': 'Тақырыпты түсіндіру',
    'ai.testPrep': 'Тестке дайындық',
    'ai.askQuestion': 'Сұрақ қою',
    'ai.studyTips': 'Оқу кеңестері',
    'ai.typing': 'ИИ жазуда...',
    'ai.error': 'ИИ-ға жүгінуде қате',
    'ai.features.explain': 'Күрделі тақырыптарды түсіндіру',
    'ai.features.testPrep': 'Тесттерге дайындық',
    'ai.features.questions': 'Сұрақтарға жауап',
    'ai.features.tips': 'Оқыту бойынша кеңестер',
    
    // Common
    'common.loading': 'Жүктелуде...',
    'common.error': 'Қате',
    'common.success': 'Сәтті',
    'common.cancel': 'Болдырмау',
    'common.confirm': 'Растау',
    'common.language': 'Тіл',
    'common.save': 'Сақтау',
    'common.delete': 'Жою',
    'common.edit': 'Өңдеу',
    'common.add': 'Қосу',
    'common.search': 'Іздеу',
    'common.filter': 'Сүзгі',
    'common.sort': 'Сұрыптау',
    'common.close': 'Жабу',
    'common.open': 'Ашу',
    'common.show': 'Көрсету',
    'common.hide': 'Жасыру',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ru' | 'kz'>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang as 'ru' | 'kz') || 'ru';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};