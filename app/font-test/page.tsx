export default function FontTest() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Font Test - Перевірка Шрифтів</h1>

        {/* Display Font - Cormorant Garamond */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            Display Font: Cormorant Garamond
          </h2>
          <div className="space-y-2">
            <h1 className="font-display text-5xl font-bold text-slate-900">
              Законопроєкт про аграрну реформу
            </h1>
            <h2 className="font-display text-4xl font-semibold text-slate-800">
              Закон України про землю
            </h2>
            <h3 className="font-display text-3xl font-medium text-slate-700">
              Стаття 1. Загальні положення
            </h3>
            <p className="font-display text-xl text-slate-600">
              Український алфавіт: А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я
            </p>
          </div>
        </div>

        {/* Body Font - IBM Plex Serif */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            Body Font: IBM Plex Serif
          </h2>
          <div className="space-y-2">
            <p className="font-body text-lg text-slate-900">
              <strong>Жирний текст:</strong> Цей закон регулює земельні відносини в Україні та визначає правові основи використання земельних ресурсів.
            </p>
            <p className="font-body text-base text-slate-800 font-medium">
              <strong>Середній:</strong> Платформа AgroLaw Vote надає можливість громадянам брати участь у процесі створення законів.
            </p>
            <p className="font-body text-base text-slate-700">
              <strong>Звичайний:</strong> Кожен громадянин має право подавати пропозиції, коментувати законопроєкти та голосувати за зміни.
            </p>
            <p className="font-body text-sm text-slate-600">
              Український алфавіт: а б в г ґ д е є ж з и і ї й к л м н о п р с т у ф х ц ч ш щ ь ю я
            </p>
          </div>
        </div>

        {/* Mono Font - JetBrains Mono */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            Mono Font: JetBrains Mono
          </h2>
          <div className="space-y-2">
            <code className="font-mono text-base text-slate-900 block bg-slate-100 p-4 rounded">
              const законопроект = &quot;Про аграрну реформу&quot;;
            </code>
            <code className="font-mono text-sm text-slate-800 block bg-slate-100 p-4 rounded">
              ID: BILL-2024-001-UA | Статус: На розгляді
            </code>
            <code className="font-mono text-xs text-slate-700 block bg-slate-100 p-4 rounded">
              Timestamp: 2024-12-05T15:18:00Z | Автор: система
            </code>
          </div>
        </div>

        {/* Font Weight Tests */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            Font Weight Test - Тест Жирності
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Cormorant Garamond:</h3>
              <p className="font-display text-xl font-normal">400 Normal: Законопроєкт</p>
              <p className="font-display text-xl font-medium">500 Medium: Законопроєкт</p>
              <p className="font-display text-xl font-semibold">600 Semibold: Законопроєкт</p>
              <p className="font-display text-xl font-bold">700 Bold: Законопроєкт</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">IBM Plex Serif:</h3>
              <p className="font-body text-base font-normal">400 Normal: Законопроєкт</p>
              <p className="font-body text-base font-medium">500 Medium: Законопроєкт</p>
              <p className="font-body text-base font-semibold">600 Semibold: Законопроєкт</p>
            </div>
          </div>
        </div>

        {/* Usage Guide */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            Usage Guide - Керівництво з використання
          </h2>
          <div className="space-y-2 text-sm text-slate-700">
            <p><code className="bg-slate-100 px-2 py-1 rounded">font-display</code> - Use for: H1, H2, H3, bill titles, article headlines</p>
            <p><code className="bg-slate-100 px-2 py-1 rounded">font-body</code> - Use for: Body text, paragraphs, legal text, article content (default)</p>
            <p><code className="bg-slate-100 px-2 py-1 rounded">font-mono</code> - Use for: Code, IDs, technical data, timestamps</p>
          </div>
        </div>
      </div>
    </div>
  );
}
