import { useState } from 'react';
import Icon from '@/components/ui/icon';

const STEPS = [
  {
    id: 1,
    title: 'Установите KDE Connect на Windows',
    description: 'Скачайте и установите приложение с Microsoft Store или с официального сайта.',
    icon: 'Monitor',
    color: 'bg-blue-500',
    actions: [
      {
        label: 'Открыть Microsoft Store',
        url: 'ms-windows-store://pdp/?productid=9N93MRMSXBF0',
        primary: true,
        icon: 'ExternalLink',
      },
      {
        label: 'Скачать напрямую',
        url: 'https://kdeconnect.kde.org/download.html',
        primary: false,
        icon: 'Download',
      },
    ],
    note: 'Если Microsoft Store не открывается — используйте прямую ссылку на сайт KDE.',
  },
  {
    id: 2,
    title: 'Установите KDE Connect на Android',
    description: 'Найдите приложение в Google Play Store на своём телефоне.',
    icon: 'Smartphone',
    color: 'bg-green-500',
    actions: [
      {
        label: 'Google Play Store',
        url: 'https://play.google.com/store/apps/details?id=org.kde.kdeconnect_tp',
        primary: true,
        icon: 'ExternalLink',
      },
    ],
    note: 'Приложение бесплатное, весит около 15 МБ.',
  },
  {
    id: 3,
    title: 'Подключите оба устройства к одной Wi-Fi сети',
    description: 'Убедитесь, что телефон и компьютер подключены к одному роутеру.',
    icon: 'Wifi',
    color: 'bg-purple-500',
    actions: [],
    note: 'Мобильный интернет (4G/5G) не подойдёт — нужна одна локальная Wi-Fi сеть.',
  },
  {
    id: 4,
    title: 'Найдите устройство и подтвердите сопряжение',
    description: 'Откройте KDE Connect на ПК и на телефоне. Нажмите «Найти устройства» — ваш телефон появится в списке. Нажмите «Запросить сопряжение» и подтвердите запрос на телефоне.',
    icon: 'Link',
    color: 'bg-orange-500',
    actions: [],
    note: 'Если устройство не появляется — скорее всего мешает брандмауэр. Смотрите подсказку ниже.',
  },
  {
    id: 5,
    title: 'Готово! Включите нужные функции',
    description: 'После сопряжения откройте настройки устройства в KDE Connect и включите нужные плагины: файлы, уведомления, буфер обмена, управление.',
    icon: 'CheckCircle',
    color: 'bg-emerald-500',
    actions: [],
    note: null,
  },
];

const FEATURES = [
  { icon: 'FolderOpen', label: 'Передача файлов', desc: 'Отправляйте фото, видео и любые файлы между ПК и телефоном без кабеля' },
  { icon: 'MonitorSmartphone', label: 'Управление телефоном', desc: 'Управляйте телефоном с клавиатуры и мышки ПК' },
  { icon: 'Bell', label: 'Уведомления', desc: 'Все уведомления с телефона появляются на экране компьютера' },
  { icon: 'Clipboard', label: 'Буфер обмена', desc: 'Скопировали текст на телефоне — он уже на ПК, и наоборот' },
  { icon: 'Phone', label: 'Голосовые вызовы', desc: 'ПК показывает входящие звонки и может приглушить музыку' },
];

const FIREWALL_STEPS = [
  'Откройте «Пуск» → «Безопасность Windows»',
  'Перейдите в «Брандмауэр и защита сети»',
  'Нажмите «Разрешить работу приложения через брандмауэр»',
  'Найдите KDE Connect и поставьте галочки «Частная» и «Общедоступная»',
  'Нажмите «ОК» и перезапустите KDE Connect',
];

export default function Index() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showFirewall, setShowFirewall] = useState(false);

  const toggleStep = (id: number) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const progress = Math.round((completedSteps.length / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-purple-500/10 border-b border-border">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Icon name="Wifi" size={15} />
            Android + Windows 11 · через Wi-Fi · бесплатно
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Подключи телефон<br />к компьютеру
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Пошаговая инструкция по настройке{' '}
            <span className="text-foreground font-semibold">KDE Connect</span> — передача файлов, уведомления, управление и звонки через Wi-Fi
          </p>

          {/* Progress */}
          <div className="max-w-sm mx-auto">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Прогресс установки</span>
              <span className="font-medium">{completedSteps.length} из {STEPS.length}</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {progress === 100 && (
              <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center gap-1.5">
                <Icon name="CheckCircle" size={15} />
                Готово! Устройства подключены
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Features grid */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <Icon name="Sparkles" size={20} className="text-primary" />
            Что будет работать после подключения
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon name={f.icon} size={18} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{f.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <Icon name="ListChecks" size={20} className="text-primary" />
            Пошаговая инструкция
          </h2>
          <div className="space-y-3">
            {STEPS.map((step, idx) => {
              const done = completedSteps.includes(step.id);
              return (
                <div
                  key={step.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    done
                      ? 'border-emerald-400/40 bg-emerald-500/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-start gap-4 p-5">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleStep(step.id)}
                      title={done ? 'Отметить как невыполненное' : 'Отметить как выполненное'}
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all font-bold text-sm border-2 mt-0.5 ${
                        done
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                      }`}
                    >
                      {done ? <Icon name="Check" size={16} /> : idx + 1}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-6 h-6 rounded-lg ${step.color} flex items-center justify-center shrink-0`}>
                          <Icon name={step.icon} size={13} className="text-white" />
                        </div>
                        <h3 className={`font-semibold text-base leading-snug ${done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {step.title}
                        </h3>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {step.description}
                      </p>

                      {step.actions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {step.actions.map((a) => (
                            <a
                              key={a.label}
                              href={a.url}
                              target="_blank"
                              rel="noreferrer"
                              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:brightness-110 active:scale-95 ${
                                a.primary
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-secondary text-secondary-foreground border border-border'
                              }`}
                            >
                              <Icon name={a.icon} size={14} />
                              {a.label}
                            </a>
                          ))}
                        </div>
                      )}

                      {step.note && (
                        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/60 rounded-xl px-3 py-2.5">
                          <Icon name="Info" size={13} className="shrink-0 mt-0.5 text-primary" />
                          {step.note}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Firewall accordion */}
        <div className="rounded-2xl border border-orange-400/30 bg-orange-500/5 overflow-hidden">
          <button
            onClick={() => setShowFirewall((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-orange-500/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0">
                <Icon name="ShieldAlert" size={18} className="text-orange-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Телефон не виден в списке?</div>
                <div className="text-xs text-muted-foreground">Разрешите KDE Connect в брандмауэре Windows</div>
              </div>
            </div>
            <Icon
              name="ChevronDown"
              size={18}
              className={`text-muted-foreground transition-transform duration-300 shrink-0 ${showFirewall ? 'rotate-180' : ''}`}
            />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFirewall ? 'max-h-80' : 'max-h-0'}`}>
            <div className="px-5 pb-5 pt-4 border-t border-orange-400/20 space-y-3">
              {FIREWALL_STEPS.map((s, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="w-5 h-5 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-6">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            <Icon name="Heart" size={13} className="text-red-400" />
            KDE Connect — бесплатное приложение с открытым исходным кодом
          </p>
        </div>

      </div>
    </div>
  );
}
