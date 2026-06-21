import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const ZIP_URL = 'https://functions.poehali.dev/f06f9a3e-2953-4f70-9281-005e8f7cb7c5';

const TARGET_DATE = new Date(2026, 2, 1);

const formatLong = (d: Date) =>
  d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

const formatTime = (d: Date) =>
  d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const Index = () => {
  const [applied, setApplied] = useState(false);
  const [autostart, setAutostart] = useState(true);
  const [now, setNow] = useState(new Date());
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const displayDate = applied ? TARGET_DATE : now;

  const downloadZip = async () => {
    setDownloading(true);
    try {
      const res = await fetch(ZIP_URL);
      const { filename, data } = await res.json();
      const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'DateFix.zip';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Ambient Fluent background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-24 w-[32rem] h-[32rem] rounded-full bg-accent/40 blur-[130px]" />
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Acrylic card */}
        <div className="rounded-[1.75rem] border border-border/70 bg-card/70 backdrop-blur-2xl shadow-[0_24px_70px_-20px_rgba(0,0,0,0.35)] overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Icon name="CalendarClock" size={16} className="text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground/90">DateFix</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Icon name="Minus" size={15} />
              <Icon name="Square" size={12} />
              <Icon name="X" size={15} />
            </div>
          </div>

          <div className="px-8 pt-9 pb-8 text-center">
            <h1 className="font-display text-[1.7rem] leading-tight font-600 text-foreground">
              Системная дата
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Установит дату Windows на 1 марта 2026
            </p>

            {/* Date display */}
            <div className="mt-7 mb-8 animate-fade-in">
              <div className="text-5xl font-display font-700 tabular-nums tracking-tight text-foreground">
                {formatTime(displayDate)}
              </div>
              <div
                className={`mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  applied
                    ? 'bg-primary/15 text-primary'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <Icon name="Calendar" size={14} />
                {formatLong(displayDate)}
              </div>
            </div>

            {/* Main button */}
            <button
              onClick={() => setApplied((v) => !v)}
              className={`group w-full h-14 rounded-2xl font-display font-600 text-base text-primary-foreground bg-primary transition-all duration-300 hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2.5 ${
                applied ? '' : 'animate-glow-pulse'
              }`}
            >
              {applied ? (
                <>
                  <Icon name="Check" size={20} className="animate-check-pop" />
                  Дата установлена
                </>
              ) : (
                <>
                  <Icon name="Power" size={19} />
                  Установить дату
                </>
              )}
            </button>

            {/* Autostart toggle */}
            <button
              onClick={() => setAutostart((v) => !v)}
              className="mt-5 w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-secondary/60 hover:bg-secondary transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-card flex items-center justify-center shrink-0">
                  <Icon name="Rocket" size={18} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Автозагрузка</div>
                  <div className="text-xs text-muted-foreground">Запуск при включении ПК</div>
                </div>
              </div>
              <span
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                  autostart ? 'bg-primary' : 'bg-muted-foreground/40'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    autostart ? 'left-6' : 'left-1'
                  }`}
                />
              </span>
            </button>

            {/* Download installer */}
            <button
              onClick={downloadZip}
              disabled={downloading}
              className="mt-3 w-full h-12 rounded-2xl font-display font-600 text-sm text-foreground bg-secondary/60 hover:bg-secondary border border-border/60 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 disabled:opacity-60"
            >
              {downloading ? (
                <>
                  <Icon name="Loader" size={17} className="animate-spin" />
                  Готовим архив…
                </>
              ) : (
                <>
                  <Icon name="Download" size={17} className="text-primary" />
                  Скачать установщик (.zip)
                </>
              )}
            </button>

            <p className="mt-6 text-xs text-muted-foreground/80 flex items-center justify-center gap-1.5">
              <Icon name="ShieldCheck" size={13} />
              Адаптируется к теме Windows 11
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;