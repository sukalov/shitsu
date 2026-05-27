import { MapPin, Envelope } from "@phosphor-icons/react";
import { InstagramLogo, TiktokLogo, TelegramLogo } from "@phosphor-icons/react";
import type { IconWeight } from "@phosphor-icons/react";
import { HeaderImage } from "@/components/HeaderImage";
import { SEO } from "@/components/SEO";
import { SOCIAL_LINKS } from "@/lib/types";
import type { ComponentType } from "react";

const SOCIAL_ICONS: Record<
  string,
  ComponentType<{ className?: string; weight?: IconWeight }>
> = {
  instagram: InstagramLogo,
  tiktok: TiktokLogo,
  telegram: TelegramLogo,
};

export function ContactsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <SEO page="contacts" />
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-20">
          <HeaderImage
            src="/headers/contacts.webp"
            alt="Контакты"
            className="w-full h-14 lg:h-20 object-contain mx-auto mb-6"
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
            <Envelope
              className="w-8 h-8 text-neutral-400 mb-6"
              weight="light"
            />
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-2">
              Email
            </p>
            <p className="text-xl">shitsu2319@gmail.com</p>
          </a>

          {SOCIAL_LINKS.map((social) => {
            const Icon = SOCIAL_ICONS[social.id];
            if (!Icon) return null;
            return (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 bg-neutral-50 hover:bg-neutral-100 transition-colors"
              >
                <Icon
                  className="w-8 h-8 text-neutral-400 mb-6"
                  weight="light"
                />
                <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-2">
                  {social.label}
                </p>
                <p className="text-xl">{social.handle}</p>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
