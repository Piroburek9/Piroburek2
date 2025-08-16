// Simple data service for the educational platform
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'tutor';
  tests_completed?: number;
  average_score?: number;
  study_streak?: number;
  total_study_time?: number;
}

export interface Test {
  id: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit?: number;
  questions: Question[];
  created_by?: string;
  created_at?: string;
}

export interface Question {
  id: string;
  question: string;
  type:
    | 'multiple_choice'
    | 'multi_select'
    | 'numeric'
    | 'matching'
    | 'true_false'
    | 'text'
    | 'image'
    | 'latex';
  options?: string[]; // for multiple_choice/multi_select
  correct_answer: number | string | number[] | Record<string, string>;
  // Provide camelCase alias for UI components that expect it
  correctAnswer?: number;
  // Optional metadata used by UI
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | string;
  lang?: 'ru' | 'kz';
  explanation?: string;
  imageUrl?: string; // for image questions
}

export interface TestResult {
  id: string;
  user_id: string;
  test_id: string;
  answers: any[];
  score: number;
  time_spent: number;
  completed_at: string;
}

export interface UserStats {
  testsCompleted: number;
  averageScore: number;
  totalQuestions: number;
  correctAnswers: number;
  studyTime: number;
  streak: number;
  rank: string;
  achievements: string[];
  recentTests: Array<{
    subject: string;
    score: number;
    total: number;
    percentage: number;
    completedAt: string;
  }>;
}

// Mock data storage
class MockDataService {
  private users: Map<string, User> = new Map();
  private tests: Map<string, Test> = new Map();
  private customQuestionsBySubject: Record<string, Question[]> = {};
  private results: Map<string, TestResult> = new Map();
  private currentUser: User | null = null;
  private authToken: string | null = null;

  constructor() {
    this.initializeMockData();
    // Try to load auth token from localStorage
    this.authToken = localStorage.getItem('auth_token');
    // Seed imported history if not present
    import('./seeds/historyKZSeed')
      .then(mod => {
        this.customQuestionsBySubject['history_kz'] = [
          ...(this.customQuestionsBySubject['history_kz'] || []),
          ...mod.historyKZSeed
        ];
      })
      .catch(() => {});
    import('./seeds/historyKZSeed_kz')
      .then(mod => {
        this.customQuestionsBySubject['history_kz'] = [
          ...(this.customQuestionsBySubject['history_kz'] || []),
          ...mod.historyKZSeedKZ
        ];
      })
      .catch(() => {});
    import('./seeds/mathLiteracySeed')
      .then(mod => {
        this.customQuestionsBySubject['math_literacy'] = [
          ...(this.customQuestionsBySubject['math_literacy'] || []),
          ...mod.mathLiteracySeed
        ];
      })
      .catch(() => {});
    import('./seeds/mathLiteracySeed_kz')
      .then(mod => {
        this.customQuestionsBySubject['math_literacy'] = [
          ...(this.customQuestionsBySubject['math_literacy'] || []),
          ...mod.mathLiteracySeedKZ
        ];
      })
      .catch(() => {});
  }

  private initializeMockData() {
    // Sample tests
    const sampleTests: Test[] = [
      {
        id: 'test-1',
        title: 'Математика - Алгебра',
        subject: 'mathematics',
        difficulty: 'medium',
        time_limit: 1800, // 30 minutes
        questions: [
          {
            id: 'q1',
            question: 'Решите уравнение: 2x + 5 = 13',
            type: 'multiple_choice',
            options: ['x = 4', 'x = 3', 'x = 5', 'x = 6'],
            correct_answer: 0,
            explanation: '2x + 5 = 13, значит 2x = 8, откуда x = 4'
          },
          {
            id: 'q2',
            question: 'Найдите значение выражения: (3 + 2) × 4',
            type: 'multiple_choice',
            options: ['20', '18', '14', '16'],
            correct_answer: 0,
            explanation: 'Сначала вычисляем в скобках: 3 + 2 = 5, затем 5 × 4 = 20'
          },
          {
            id: 'q3',
            question: 'Что больше: 0.5 или 1/3?',
            type: 'multiple_choice',
            options: ['0.5', '1/3', 'Равны', 'Невозможно определить'],
            correct_answer: 0,
            explanation: '0.5 = 1/2 = 3/6, а 1/3 = 2/6. Значит 0.5 > 1/3'
          }
        ]
      },
      {
        id: 'test-2',
        title: 'История России - 19 век',
        subject: 'history',
        difficulty: 'easy',
        time_limit: 1200, // 20 minutes
        questions: [
          {
            id: 'q1',
            question: 'В каком году была отменена крепостное право в России?',
            type: 'multiple_choice',
            options: ['1861', '1860', '1862', '1859'],
            correct_answer: 0,
            explanation: 'Крепостное право было отменено Александром II в 1861 году'
          },
          {
            id: 'q2',
            question: 'Кто был императором России в начале 19 века?',
            type: 'multiple_choice',
            options: ['Александр I', 'Николай I', 'Александр II', 'Павел I'],
            correct_answer: 0,
            explanation: 'Александр I правил с 1801 по 1825 год'
          }
        ]
      },
      {
        id: 'test-3',
        title: 'Физика - Механика',
        subject: 'physics',
        difficulty: 'hard',
        time_limit: 2400, // 40 minutes
        questions: [
          {
            id: 'q1',
            question: 'Второй закон Ньютона формулируется как:',
            type: 'multiple_choice',
            options: ['F = ma', 'F = mv', 'F = mg', 'F = ma²'],
            correct_answer: 0,
            explanation: 'Второй закон Ньютона: сила равна произведению массы на ускорение'
          },
          {
            id: 'q2',
            question: 'Единица измерения силы в СИ:',
            type: 'multiple_choice',
            options: ['Ньютон', 'Джоуль', 'Ватт', 'Паскаль'],
            correct_answer: 0,
            explanation: 'Сила измеряется в ньютонах (Н) в системе СИ'
          }
        ]
      }
    ];

    sampleTests.forEach(test => this.tests.set(test.id, test));
  }

  // Helper method to check if backend is available
  private async isBackendAvailable(): Promise<boolean> {
    try {
      const response = await fetch('/api/health', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<User> {
    try {
      // Try backend first
      if (await this.isBackendAvailable()) {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const data = await response.json();
          this.currentUser = data.user as User;
          this.authToken = data.token;
          localStorage.setItem('auth_token', this.authToken!);
          return data.user as User;
        }
      }
    } catch (error) {
      console.log('Backend login failed, using local auth');
    }

    // Fallback to local auth
    // Demo credentials
    if (email === 'demo@example.com' && password === 'password123') {
      const user: User = {
        id: 'demo-user',
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'student',
        tests_completed: 3,
        average_score: 85,
        study_streak: 5,
        total_study_time: 180 // minutes
      };
      this.currentUser = user;
      this.users.set(user.id, user);
      return user;
    }

    // Allow any email for demo purposes
    const user: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      role: 'student',
      tests_completed: 0,
      average_score: 0,
      study_streak: 0,
      total_study_time: 0
    };
    this.currentUser = user;
    this.users.set(user.id, user);
    return user;
  }

  async register(email: string, password: string, name: string, role: string): Promise<User> {
    try {
      // Try backend first
      if (await this.isBackendAvailable()) {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, role })
        });

        if (response.ok) {
          const data = await response.json();
          this.currentUser = data.user as User;
          return data.user as User;
        }
      }
    } catch (error) {
      console.log('Backend registration failed, using local auth');
    }

    // Fallback to local registration
    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      role: role as 'student' | 'teacher' | 'tutor',
      tests_completed: 0,
      average_score: 0,
      study_streak: 0,
      total_study_time: 0
    };
    this.currentUser = user;
    this.users.set(user.id, user);
    return user;
  }

  async logout(): Promise<void> {
    try {
      if (this.authToken && await this.isBackendAvailable()) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          }
        });
      }
    } catch (error) {
      console.log('Backend logout failed');
    }

    this.currentUser = null;
    this.authToken = null;
    localStorage.removeItem('auth_token');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Test methods
  async getTests(): Promise<Test[]> {
    try {
      if (await this.isBackendAvailable()) {
        const response = await fetch('/api/tests');
        if (response.ok) {
          return await response.json();
        }
      }
    } catch (error) {
      console.log('Backend tests failed, using local data');
    }

    return Array.from(this.tests.values());
  }

  async getTest(id: string): Promise<Test | undefined> {
    return this.tests.get(id);
  }

  async createTest(testData: Omit<Test, 'id' | 'created_at'>): Promise<Test> {
    const test: Test = {
      ...testData,
      id: `test-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.tests.set(test.id, test);
    return test;
  }

  // Question management methods
  async getQuestions(): Promise<Question[]> {
    try {
      if (await this.isBackendAvailable()) {
        const response = await fetch('/api/questions');
        if (response.ok) {
          return await response.json();
        }
      }
    } catch (error) {
      console.log('Backend questions failed, using local data');
    }

    // Return questions from all tests + custom imported
    const allQuestions: Question[] = [];
    this.tests.forEach(test => {
      test.questions.forEach(question => {
        allQuestions.push({
          ...question,
          subject: test.subject,
          difficulty: test.difficulty,
          explanation: question.explanation,
          // normalize for UI components
          correctAnswer: typeof question.correct_answer === 'number' ? (question.correct_answer as number) : 0,
        });
      });
    });
    // Append custom questions grouped by ENT subject keys
    Object.entries(this.customQuestionsBySubject).forEach(([subject, list]) => {
      list.forEach(q => {
        allQuestions.push({
          ...q,
          subject,
          correctAnswer: typeof q.correct_answer === 'number' ? (q.correct_answer as number) : 0,
        });
      });
    });
    return allQuestions;
  }

  async generateQuiz(subject: string, difficulty: string, count: number): Promise<{ questions: Question[]; isDemo: boolean }> {
    try {
      if (await this.isBackendAvailable()) {
        const response = await fetch('/api/ai/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify({ subject, difficulty, count })
        });

        if (response.ok) {
          const data = await response.json();
          return { questions: data.questions, isDemo: false };
        }
      }
    } catch (error) {
      console.error('AI quiz generation error:', error);
    }

    // Fallback to demo quiz generation
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate generation time

    const demoQuestions: Question[] = [
      {
        id: 'ai-q1',
        question: `Вопрос по теме "${subject}" (сложность: ${difficulty})`,
        type: 'multiple_choice',
        options: ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
        correct_answer: 0,
        explanation: 'Это демонстрационный вопрос, сгенерированный ИИ.'
      },
      {
        id: 'ai-q2',
        question: `Ещё один вопрос по "${subject}"`,
        type: 'multiple_choice',
        options: ['Ответ A', 'Ответ B', 'Ответ C', 'Ответ D'],
        correct_answer: 1,
        explanation: 'Демо-объяснение для второго вопроса.'
      }
    ];

    return { questions: demoQuestions.slice(0, count), isDemo: true };
  }

  /**
   * Generate an ENT-style quiz according to the current ENT template
   * for the math/physics tracks. Falls back to a local rule-based generator.
   */
  async generateENTQuiz(
    track: 'math' | 'physics',
    opts?: { maxPerSection?: number }
  ): Promise<{ questions: Question[]; isDemo: boolean }> {
    try {
      if (await this.isBackendAvailable()) {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (this.authToken) headers['Authorization'] = `Bearer ${this.authToken}`;
        const response = await fetch('/api/ai/generate-ent-quiz', {
          method: 'POST',
          headers,
          body: JSON.stringify({ track })
        });
        if (response.ok) {
          const data = await response.json();
          // Ensure camelCase alias exists for UI
          const normalized = (data.questions || []).map((q: any) => ({
            ...q,
            correctAnswer: typeof q.correct_answer === 'number' ? q.correct_answer : 0,
          }));
          return { questions: normalized, isDemo: false };
        }
      }
    } catch (error) {
      console.warn('ENT generator API failed, using local generator');
    }

    // Local rule-based generator aligned with ENT sections
    const { loadEntTemplate } = await import('./entTemplates');
    const template = loadEntTemplate();
    const sectionList = template.tracks[track].sections;
    const maxPerSection = Math.max(1, opts?.maxPerSection ?? Number.POSITIVE_INFINITY);

    const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffle = <T,>(arr: T[]): T[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    const makeMC = (
      prompt: string,
      options: string[],
      correctIdx: number,
      expl?: string,
      subject?: string
    ): Question => ({
      id: `ent-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      question: prompt,
      type: 'multiple_choice',
      options,
      correct_answer: correctIdx,
      correctAnswer: correctIdx,
      explanation: expl,
      subject,
      difficulty: 'medium',
    });

    const genHistoryKZ = (count: number): Question[] => {
      const bank = [
        makeMC(
          'Когда была принята первая Конституция Республики Казахстан?',
          ['1991', '1993', '1995', '1998'],
          1,
          'Первая Конституция независимого Казахстана была принята в 1993 году.',
          'history_kz'
        ),
        makeMC(
          'Столицей Казахстана с 1997 года является:',
          ['Алматы', 'Астана (Нур-Султан)', 'Шымкент', 'Караганда'],
          1,
          'Столица была перенесена из Алматы в Акмолу (ныне Астана) в 1997 году.',
          'history_kz'
        ),
        makeMC(
          'Кто является автором гимна Республики Казахстан (слова, 2006)?',
          ['Н. Назарбаев и Ж. Нажмеденов', 'А. Байтұрсынұлы', 'М. Әуезов', 'А. Кунаев'],
          0,
          'Слова современного гимна написали Н. Назарбаев и Ж. Нажмеденов.',
          'history_kz'
        ),
      ];
      const out: Question[] = [];
      while (out.length < count) out.push(bank[out.length % bank.length]);
      return out;
    };

    const genMathLiteracy = (count: number): Question[] => {
      const makePercentProblem = () => {
        const price = randomInt(2000, 10000);
        const discount = [5, 10, 15, 20][randomInt(0, 3)];
        const correct = Math.round(price * (1 - discount / 100));
        const distractors = [
          correct + randomInt(50, 250),
          correct - randomInt(50, 250),
          Math.round(price * (discount / 100)),
        ];
        const options = shuffle([correct, ...distractors]).map(String);
        const correctIdx = options.indexOf(String(correct));
        return makeMC(
          `Товар стоит ${price} тг. Скидка ${discount}%. Какова новая цена?`,
          options,
          correctIdx,
          `Новая цена = ${price} × (1 − ${discount}/100) = ${correct} тг`,
          'math_literacy'
        );
      };
      const makeRatioProblem = () => {
        const a = randomInt(2, 9);
        const b = randomInt(2, 9);
        const total = randomInt(20, 60);
        const sum = a + b;
        const partA = Math.round((a / sum) * total);
        const options = shuffle([
          partA,
          partA + 1,
          Math.max(0, partA - 1),
          partA + 2,
        ]).map(String);
        const idx = options.indexOf(String(partA));
        return makeMC(
          `В классе соотношение мальчиков и девочек ${a}:${b}. Всего ${total} учеников. Сколько мальчиков?`,
          options,
          idx,
          `Доля мальчиков = ${a}/(${a}+${b}) · ${total} = ${partA}.`,
          'math_literacy'
        );
      };
      const generators = [makePercentProblem, makeRatioProblem];
      return Array.from({ length: count }, () => generators[randomInt(0, generators.length - 1)]());
    };

    const genMathProfile = (count: number): Question[] => {
      const makeLinearEq = () => {
        const m = randomInt(2, 7);
        const b = randomInt(-9, 9);
        const rhs = randomInt(-10, 20);
        // m·x + b = rhs → x = (rhs - b)/m
        const x = (rhs - b) / m;
        const correct = Number.isInteger(x) ? x : +(x.toFixed(2));
        const distractors = [correct + 1, correct - 1, correct + 2].map(v => String(v));
        const options = shuffle([String(correct), ...distractors]);
        const correctIdx = options.indexOf(String(correct));
        return makeMC(
          `Решите уравнение: ${m}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)} = ${rhs}`,
          options,
          correctIdx,
          `x = (${rhs} − ${b}) / ${m} = ${correct}`,
          'math_profile'
        );
      };
      const makeQuadraticRoots = () => {
        const r1 = randomInt(-5, 5);
        const r2 = randomInt(-5, 5);
        const a = 1;
        const b = -(r1 + r2);
        const c = r1 * r2;
        const prompt = `Найдите корни уравнения: x^2 ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)} = 0`;
        const correct = `{${Math.min(r1, r2)}; ${Math.max(r1, r2)}}`;
        const opts = shuffle([
          correct,
          `{${r1}; ${r1}}`,
          `{${r2}; ${r2}}`,
          '{0; 0}',
        ]);
        const idx = opts.indexOf(correct);
        return makeMC(prompt, opts, idx, 'Коэффициенты соответствуют (x − r1)(x − r2) = 0.', 'math_profile');
      };
      const makeDerivativeConcept = () =>
        makeMC(
          'Производная функции в точке — это:',
          [
            'Предел отношения приращений функции и аргумента',
            'Средняя скорость изменения функции',
            'Интеграл функции',
            'Значение функции в точке'
          ],
          0,
          'Определение производной через предел отношения приращений.',
          'math_profile'
        );
      // Multi-select generators (6 вариантов, 1-3 правильных)
      const makeMultiSelectBasics = () => {
        const correctCount = randomInt(1, 3);
        const base = ['верно A', 'верно B', 'верно C', 'неверно D', 'неверно E', 'неверно F'];
        const options = [...base];
        const correctIdxs: number[] = [];
        while (correctIdxs.length < correctCount) {
          const idx = randomInt(0, 2); // among first three as correct
          if (!correctIdxs.includes(idx)) correctIdxs.push(idx);
        }
        return {
          id: `ent-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          question: 'Выберите все верные утверждения (демо)',
          type: 'multi_select' as const,
          options,
          correct_answer: correctIdxs,
          correctAnswer: 0,
          explanation: '1–3 верных утверждений среди первых трёх пунктов.',
          subject: 'math_profile',
          difficulty: 'hard'
        } as Question;
      };
      const singleGenerators = [makeLinearEq, makeQuadraticRoots, makeDerivativeConcept];
      const multiGenerators = [makeMultiSelectBasics];
      const singlesNeeded = Math.min(30, count);
      const multisNeeded = Math.max(0, count - singlesNeeded);
      const singles = Array.from({ length: singlesNeeded }, () => singleGenerators[randomInt(0, singleGenerators.length - 1)]());
      const multis = Array.from({ length: multisNeeded }, () => multiGenerators[randomInt(0, multiGenerators.length - 1)]());
      return [...singles, ...multis];
    };

    const genPhysicsProfile = (count: number): Question[] => {
      const makeNewton2 = () =>
        makeMC(
          'Второй закон Ньютона формулируется как:',
          ['F = ma', 'F = mv', 'F = mg', 'F = ma²'],
          0,
          'Сила равна произведению массы на ускорение.',
          'physics_profile'
        );
      const makeUnit = () =>
        makeMC(
          'Единица измерения энергии в СИ:',
          ['Джоуль', 'Ньютон', 'Ватт', 'Паскаль'],
          0,
          'Энергия измеряется в Джоулях (J).',
          'physics_profile'
        );
      const makeKinematics = () => {
        const v = randomInt(5, 20);
        const t = randomInt(2, 10);
        const s = v * t;
        const opts = shuffle([s, s + randomInt(1, 5), Math.max(0, s - randomInt(1, 5)), s + 2]).map(String);
        const idx = opts.indexOf(String(s));
        return makeMC(
          `Тело движется равномерно со скоростью ${v} м/с в течение ${t} с. Какой путь пройден?`,
          opts,
          idx,
          `s = v·t = ${v}·${t} = ${s} м`,
          'physics_profile'
        );
      };
      const makeMultiSelectPhys = () => {
        const options = ['Вакуум проводит ток', 'Закон Ома: I = U/R', 'Единица мощности — Вт', 'Энергия в Н', 'Сопротивление в Ом', 'W = U·I'];
        const correctIdxs = [1, 2, 4]; // 1-3 правильных
        return {
          id: `ent-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          question: 'Выберите все верные утверждения (демо, физика)',
          type: 'multi_select' as const,
          options,
          correct_answer: correctIdxs,
          correctAnswer: 0,
          explanation: 'Выберите корректные утверждения из списка.',
          subject: 'physics_profile',
          difficulty: 'hard'
        } as Question;
      };
      const singleGenerators = [makeNewton2, makeUnit, makeKinematics];
      const multiGenerators = [makeMultiSelectPhys];
      const singlesNeeded = Math.min(30, count);
      const multisNeeded = Math.max(0, count - singlesNeeded);
      const singles = Array.from({ length: singlesNeeded }, () => singleGenerators[randomInt(0, singleGenerators.length - 1)]());
      const multis = Array.from({ length: multisNeeded }, () => multiGenerators[randomInt(0, multiGenerators.length - 1)]());
      return [...singles, ...multis];
    };

    const questions: Question[] = [];
    for (const section of sectionList) {
      const count = Math.min(section.numQuestions, maxPerSection);
      if (section.key === 'history_kz') {
        const custom = (this.customQuestionsBySubject['history_kz'] || []).slice(0, count);
        questions.push(...(custom.length ? custom : genHistoryKZ(count)));
      } else if (section.key === 'math_literacy') {
        const custom = (this.customQuestionsBySubject['math_literacy'] || []).slice(0, count);
        questions.push(...(custom.length ? custom : genMathLiteracy(count)));
      } else if (section.key === 'math_profile') {
        const custom = (this.customQuestionsBySubject['math_profile'] || []).slice(0, count);
        questions.push(...(custom.length ? custom : genMathProfile(count)));
      } else if (section.key === 'physics_profile') {
        const custom = (this.customQuestionsBySubject['physics_profile'] || []).slice(0, count);
        questions.push(...(custom.length ? custom : genPhysicsProfile(count)));
      }
    }

    return { questions, isDemo: true };
  }

  /**
   * Import custom questions mapped to an ENT subject key (e.g. 'history_kz').
   * Existing items for the key are appended.
   */
  async importENTQuestions(subjectKey: 'history_kz' | 'math_literacy' | 'math_profile' | 'physics_profile', questions: Question[]): Promise<number> {
    if (!this.customQuestionsBySubject[subjectKey]) this.customQuestionsBySubject[subjectKey] = [];
    const normalized = questions.map(q => ({
      ...q,
      correctAnswer: typeof q.correct_answer === 'number' ? (q.correct_answer as number) : 0,
      subject: subjectKey,
    }));
    this.customQuestionsBySubject[subjectKey].push(...normalized);
    return this.customQuestionsBySubject[subjectKey].length;
  }

  async submitTest(testData: {
    answers: any[];
    score: number;
    total: number;
    timeSpent: number;
    subject: string;
    difficulty: string;
  }): Promise<void> {
    try {
      if (await this.isBackendAvailable()) {
        const response = await fetch('/api/tests/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}`
          },
          body: JSON.stringify(testData)
        });

        if (response.ok) {
          return;
        }
      }
    } catch (error) {
      console.log('Backend submit failed, storing locally');
    }

    // Store locally as fallback
    if (this.currentUser) {
      const result: TestResult = {
        id: `result-${Date.now()}`,
        user_id: this.currentUser.id,
        test_id: `test-${testData.subject}`,
        answers: testData.answers,
        score: (testData.score / testData.total) * 100,
        time_spent: testData.timeSpent,
        completed_at: new Date().toISOString()
      };
      
      this.results.set(result.id, result);
      
      // Update user stats
      const user = this.users.get(this.currentUser.id);
      if (user) {
        user.tests_completed = (user.tests_completed || 0) + 1;
        user.average_score = user.tests_completed > 1 
          ? Math.round(((user.average_score || 0) * (user.tests_completed - 1) + (testData.score / testData.total) * 100) / user.tests_completed)
          : Math.round((testData.score / testData.total) * 100);
        user.total_study_time = (user.total_study_time || 0) + Math.round(testData.timeSpent / 60);
        this.users.set(user.id, user);
        this.currentUser = user;
      }
    }
  }

  // Results methods
  async submitTestResult(testId: string, answers: any[], score: number, timeSpent: number): Promise<TestResult> {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    const result: TestResult = {
      id: `result-${Date.now()}`,
      user_id: this.currentUser.id,
      test_id: testId,
      answers,
      score,
      time_spent: timeSpent,
      completed_at: new Date().toISOString()
    };

    this.results.set(result.id, result);

    // Update user stats
    const user = this.users.get(this.currentUser.id);
    if (user) {
      user.tests_completed = (user.tests_completed || 0) + 1;
      user.average_score = user.tests_completed > 1 
        ? Math.round(((user.average_score || 0) * (user.tests_completed - 1) + score) / user.tests_completed)
        : score;
      user.total_study_time = (user.total_study_time || 0) + Math.round(timeSpent / 60);
      this.users.set(user.id, user);
      this.currentUser = user;
    }

    return result;
  }

  async getResults(userId?: string): Promise<TestResult[]> {
    const targetUserId = userId || this.currentUser?.id;
    if (!targetUserId) return [];

    return Array.from(this.results.values())
      .filter(result => result.user_id === targetUserId);
  }

  // User stats method
  async getUserStats(): Promise<UserStats> {
    const user = this.currentUser;
    const results = await this.getResults();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Calculate stats from results
    const testsCompleted = results.length;
    const averageScore = testsCompleted > 0 
      ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / testsCompleted)
      : 0;
    
    // Calculate total questions and correct answers
    let totalQuestions = 0;
    let correctAnswers = 0;
    
    results.forEach(result => {
      if (result.answers && Array.isArray(result.answers)) {
        totalQuestions += result.answers.length;
        correctAnswers += result.answers.filter(answer => answer.correct).length;
      }
    });

    // Calculate study time
    const studyTime = results.reduce((sum, result) => sum + result.time_spent, 0);

    // Calculate streak (consecutive successful tests >= 60%)
    let streak = 0;
    const sortedResults = results
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
    
    for (const result of sortedResults) {
      if (result.score >= 60) {
        streak++;
      } else {
        break;
      }
    }

    // Determine rank based on average score
    let rank = 'Начинающий';
    if (averageScore >= 90) rank = 'Эксперт';
    else if (averageScore >= 80) rank = 'Продвинутый';
    else if (averageScore >= 70) rank = 'Средний';
    else if (averageScore >= 60) rank = 'Развивающийся';

    // Generate achievements
    const achievements: string[] = [];
    if (testsCompleted >= 1) achievements.push('Первый тест');
    if (testsCompleted >= 5) achievements.push('Активный ученик');
    if (testsCompleted >= 10) achievements.push('Настойчивый');
    if (streak >= 3) achievements.push('Серия побед');
    if (averageScore >= 90) achievements.push('Отличник');
    if (studyTime >= 3600) achievements.push('Час изучения');

    // Recent tests
    const recentTests = sortedResults.slice(0, 5).map(result => ({
      subject: result.test_id.replace('test-', ''),
      score: Math.round((result.score / 100) * 10), // Assuming score is percentage
      total: 10, // Mock total questions
      percentage: Math.round(result.score),
      completedAt: result.completed_at
    }));

    return {
      testsCompleted,
      averageScore,
      totalQuestions,
      correctAnswers,
      studyTime,
      streak,
      rank,
      achievements,
      recentTests
    };
  }

  // Analytics
  async getAnalytics(userId?: string) {
    const results = await this.getResults(userId);
    const user = this.currentUser;

    if (!results.length) {
      return {
        totalTests: 0,
        averageScore: 0,
        recentActivity: [],
        progressTrend: [],
        studyStreak: user?.study_streak || 0,
        totalStudyTime: user?.total_study_time || 0
      };
    }

    const totalTests = results.length;
    const averageScore = Math.round(results.reduce((sum, result) => sum + result.score, 0) / totalTests);

    // Recent activity (last 10 results)
    const recentActivity = results
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
      .slice(0, 10);

    // Progress trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentResults = results.filter(result => 
      new Date(result.completed_at) >= thirtyDaysAgo
    );

    const progressTrend = recentResults.map(result => ({
      date: result.completed_at.split('T')[0],
      score: result.score
    }));

    return {
      totalTests,
      averageScore,
      recentActivity,
      progressTrend,
      studyStreak: user?.study_streak || 0,
      totalStudyTime: user?.total_study_time || 0
    };
  }

  // AI Chat methods
  async sendAIMessage(
    message: string,
    context?: string,
    language?: 'ru' | 'kz'
  ): Promise<{ response: string; isDemo: boolean }> {
    try {
      // Try backend API first
      if (await this.isBackendAvailable()) {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (this.authToken) headers['Authorization'] = `Bearer ${this.authToken}`;
        const deepseekKey = localStorage.getItem('deepseek_api_key');
        if (deepseekKey) headers['x-deepseek-api-key'] = deepseekKey;
        const geminiKey = localStorage.getItem('gemini_api_key');
        if (geminiKey) headers['x-gemini-api-key'] = geminiKey;

        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers,
          body: JSON.stringify({ message, context, language })
        });

        if (response.ok) {
          const data = await response.json();
          return { response: data.response, isDemo: false };
        }
        // If DeepSeek returns payment required, gracefully fall back to local demo
        if (response.status === 402) {
          return await this._generateLocalAIResponse(message, context, language);
        }
      }
    } catch (error) {
      console.error('AI chat error:', error);
    }

    // Fallback to local AI responses
    return this._generateLocalAIResponse(message, context, language);
  }

  // Alias for backwards compatibility
  async chatWithAI(
    message: string,
    context?: string,
    language?: 'ru' | 'kz'
  ): Promise<{ response: string; isDemo: boolean }> {
    return this.sendAIMessage(message, context, language);
  }

  // Private method for local AI responses
  private async _generateLocalAIResponse(
    message: string,
    context?: string,
    language?: 'ru' | 'kz'
  ): Promise<{ response: string; isDemo: boolean }> {
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lang: 'ru' | 'kz' = language || this._detectLanguageFromText(message);
    const responsesRu = [
      'Отличный вопрос! Для лучшего понимания этой темы рекомендую разбить её на части и изучать постепенно.',
      'Я вижу, что вы изучаете сложную тему. Давайте разберём её по шагам. Что именно вызывает затруднения?',
      'Это интересная область! Попробуйте найти практические примеры — они помогут лучше усвоить материал.',
      'Хороший подход к обучению! Не забывайте делать перерывы и повторять изученное через определённые интервалы.',
      'Для закрепления материала рекомендую пройти дополнительные тесты по этой теме.',
      'Помните: постоянная практика — ключ к успеху. Попробуйте решать задачи каждый день.',
      'Если у вас есть вопросы по конкретной теме, я готов помочь с объяснениями.',
      'Отличная работа! Продолжайте в том же духе. Какую тему изучаем дальше?'
    ];
    const responsesKz = [
      'Тамаша сұрақ! Тақырыпты бөліктерге бөліп, біртіндеп оқуды ұсынамын.',
      'Күрделі тақырыпты оқып жатырсыз екен. Қадамдап талдайық. Нақты қай жерде қиындық бар?',
      'Өте қызық тақырып! Тәжірибелік мысалдармен байланыстыру материалды жақсы меңгеруге көмектеседі.',
      'Оқу тәсіліңіз жақсы! Үзіліс жасап, қайталауды ұмытпаңыз.',
      'Материалды бекіту үшін осы тақырып бойынша қосымша тесттерді орындаңыз.',
      'Үздіксіз тәжірибе — табыстың кілті. Күн сайын тапсырмалар шешуге тырысыңыз.',
      'Егер нақты тақырып бойынша сұрақтар болса, түсіндіруге дайынмын.',
      'Жұмысыңыз жақсы! Сол қалпында жалғастыра беріңіз. Келесі тақырып қандай?'
    ];

    // Simple keyword matching for more relevant responses
    const lowerMessage = message.toLowerCase();
    let response = '';

    // If we got an analysis context, generate a structured analysis in the target language
    const analysisPrefix = 'ANALYZE_TEST_RESULTS:';
    if (context && context.includes(analysisPrefix)) {
      try {
        const json = context.substring(context.indexOf(analysisPrefix) + analysisPrefix.length).trim();
        const data = JSON.parse(json);
        const header = lang === 'kz' ? 'Тест нәтижелерінің талдауы' : 'Анализ результатов теста';
        const strongLabel = lang === 'kz' ? 'Күшті жақтары' : 'Сильные стороны';
        const weakLabel = lang === 'kz' ? 'Әлсіз жақтары' : 'Слабые стороны';
        const homeworkLabel = lang === 'kz' ? 'Үй жұмысы' : 'Домашнее задание';
        const topicsLabel = lang === 'kz' ? 'Ұсынылатын тақырыптар' : 'Рекомендуемые темы';
        const scoreLine = lang === 'kz'
          ? `Ұпай: ${data.percentage}% (${data.correct}/${data.total})`
          : `Баллы: ${data.percentage}% (${data.correct}/${data.total})`;
        const timeLine = data.timeSpent
          ? (lang === 'kz' ? `Уақыт: ${Math.round(data.timeSpent / 60)} мин` : `Время: ${Math.round(data.timeSpent / 60)} мин`)
          : '';
        const bullets = (arr: string[]) => arr.map(i => `- ${i}`).join('\n');
        response = `${header}\n${scoreLine}${timeLine ? `\n${timeLine}` : ''}\n\n${strongLabel}:\n${bullets(data.strengths || [])}\n\n${weakLabel}:\n${bullets(data.weaknesses || [])}\n\n${homeworkLabel}:\n${bullets(data.homework || [])}\n\n${topicsLabel}:\n${bullets(data.topics || [])}`;
        return { response, isDemo: true };
      } catch {}
    }

    if (lowerMessage.includes('математика') || lowerMessage.includes('алгебра')) {
      response = lang === 'kz'
        ? 'Математика тұрақты тәжірибені талап етеді. Қарапайым мысалдардан бастап күн сайын есеп шығарыңыз.'
        : 'Математика требует постоянной практики. Рекомендую решать задачи каждый день, начиная с простых примеров.';
    } else if (lowerMessage.includes('физика') || lowerMessage.includes('физика')) {
      response = lang === 'kz'
        ? 'Физика — табиғат заңдарын түсіну. Теорияны өмірдегі мысалдармен байланыстырып көріңіз.'
        : 'Физика — это понимание законов природы. Попробуйте связать теорию с практическими примерами из жизни.';
    } else if (lowerMessage.includes('история') || lowerMessage.includes('тарих')) {
      response = lang === 'kz'
        ? 'Тарих қазіргі уақытты түсінуге көмектеседі. Даталар мен оқиғаларды жақсы есте сақтау үшін уақыт сызықтарын жасаңыз.'
        : 'История помогает понять настоящее. Создайте временные линии для лучшего запоминания дат и событий.';
    } else if (
      lowerMessage.includes('как') || lowerMessage.includes('помощь') || lowerMessage.includes('совет') ||
      lowerMessage.includes('қалай') || lowerMessage.includes('көмек') || lowerMessage.includes('кеңес')
    ) {
      response = lang === 'kz'
        ? 'Көмек беруге әрқашан дайынмын! Нақты мәселені сипаттаңыз, бірге шешім табамыз.'
        : 'Я всегда готов помочь! Опишите конкретную проблему, и мы найдём решение вместе.';
    } else if (context && this.currentUser) {
      const base = lang === 'kz'
        ? `${this.currentUser.name}, прогрессіңізге қарағанда (${this.currentUser.tests_completed || 0} тест, орташа ұпай ${this.currentUser.average_score || 0}%), жақсы алға жылжып жатырсыз!`
        : `${this.currentUser.name}, судя по вашему прогрессу (${this.currentUser.tests_completed || 0} тестов, средний балл ${this.currentUser.average_score || 0}%), вы хорошо продвигаетесь в обучении!`;
      const pool = lang === 'kz' ? responsesKz : responsesRu;
      response = `${base} ${pool[Math.floor(Math.random() * pool.length)]}`;
    } else {
      const pool = lang === 'kz' ? responsesKz : responsesRu;
      response = pool[Math.floor(Math.random() * pool.length)];
    }

    return { response, isDemo: true };
  }

  private _detectLanguageFromText(text: string): 'ru' | 'kz' {
    const kzChars = /[әғқңөұүһі]/i;
    const kzWords = /(сәлем|қалай|ия|жоқ|үй|тапсырма|талдау)/i;
    if (kzChars.test(text) || kzWords.test(text)) return 'kz';
    return 'ru';
  }
}

// Export singleton instance
export const dataService = new MockDataService();