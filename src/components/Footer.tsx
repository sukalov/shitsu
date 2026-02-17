import { Link } from "react-router";
import { InstagramLogo, TiktokLogo, TelegramLogo } from "@phosphor-icons/react";

const socialLinks = [
  {
    icon: InstagramLogo,
    href: "https://instagram.com/shitsu_kira",
    label: "Instagram",
  },
  {
    icon: TiktokLogo,
    href: "https://www.tiktok.com/@_shitsu",
    label: "TikTok",
  },
  {
    icon: TelegramLogo,
    href: "https://t.me/kira_kirschtein",
    label: "Telegram",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="py-12 flex flex-col md:flex-row md:items-start justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link to="/" className="group">
              <img
                src="/logo.png"
                alt="SHITSU"
                className="h-7 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <img
              src="/headers/name.png"
              alt=""
              className="h-5 w-auto object-contain opacity-70 mx-auto"
            />
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-6">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-300 font-medium">
                Коллекция
              </span>
              <div className="flex flex-col gap-2">
                <Link
                  to="/originals"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Оригиналы
                </Link>
                <Link
                  to="/merch"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Мерч
                </Link>
                <Link
                  to="/archive"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Архив
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-300 font-medium">
                Информация
              </span>
              <div className="flex flex-col gap-2">
                <Link
                  to="/about"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  О себе
                </Link>
                <Link
                  to="/contacts"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Контакты
                </Link>
                <Link
                  to="/delivery"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Доставка
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 border border-neutral-200 flex items-center justify-center text-neutral-400 hover:border-neutral-900 hover:text-neutral-900 hover:bg-neutral-50 transition-all duration-300"
              >
                <Icon className="w-4 h-4" weight="light" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://mkeverything.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors tracking-wide"
            >
              разработка сайта mkeverything
            </a>
            <span className="text-neutral-300">|</span>
            <a
              href="/admin"
              className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors tracking-wide"
            >
              админ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
