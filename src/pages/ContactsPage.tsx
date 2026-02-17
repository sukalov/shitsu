import { MapPin } from "@phosphor-icons/react";
import { InstagramLogo, TiktokLogo, TelegramLogo } from "@phosphor-icons/react";
import { HeaderImage } from "@/components/HeaderImage";

export function ContactsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-20">
          <HeaderImage
            src="./headers/contacts.png"
            alt="Контакты"
            className="h-14 lg:h-20 w-auto object-contain mx-auto mb-6"
          />
          <h1 className="hidden text-3xl lg:text-4xl tracking-[0.15em] uppercase">
            Контакты
          </h1>
          <p className="inline-flex items-center gap-2 text-sm text-neutral-400">
            <MapPin className="w-4 h-4" weight="light" />
            Москва, Россия
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <a
            href="mailto:shitsu2319@gmail.com"
            className="group p-8 bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <InstagramLogo
              className="w-8 h-8 text-neutral-400 mb-6"
              weight="light"
              style={{ display: "none" }}
            />
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-2">
              Email
            </p>
            <p className="text-xl">shitsu2319@gmail.com</p>
          </a>

          <a
            href="https://instagram.com/shitsu_kira"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <InstagramLogo
              className="w-8 h-8 text-neutral-400 mb-6"
              weight="light"
            />
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-2">
              Instagram
            </p>
            <p className="text-xl">@shitsu_kira</p>
          </a>

          <a
            href="https://www.tiktok.com/@_shitsu"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <TiktokLogo
              className="w-8 h-8 text-neutral-400 mb-6"
              weight="light"
            />
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-2">
              TikTok
            </p>
            <p className="text-xl">@_shitsu</p>
          </a>

          <a
            href="https://t.me/kira_kirschtein"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <TelegramLogo
              className="w-8 h-8 text-neutral-400 mb-6"
              weight="light"
            />
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-2">
              Telegram
            </p>
            <p className="text-xl">@kira_kirschtein</p>
          </a>
        </div>
      </div>
    </div>
  );
}
