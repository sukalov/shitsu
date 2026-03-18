import { useState, useEffect, useRef } from "react";
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

export function AboutPage() {
  const [_scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(
          1,
          (window.innerHeight - rect.top) / (window.innerHeight + rect.height),
        ),
      );
      setScrollY(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="min-h-screen pt-24 pb-20 bg-white relative overflow-hidden"
    >
      <SEO page="about" />

      <div className="max-w-[800px] mx-auto px-6 lg:px-8 relative z-20">
        <div className="relative w-full mb-4">
          <img
            src="/about-background.png"
            alt="Обо мне"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <HeaderImage
              src="./headers/about.webp"
              alt="О СЕБЕ"
              className="w-full max-w-[400px] lg:max-w-[600px] h-14 lg:h-24 object-contain"
            />
          </div>
        </div>

        <div className="space-y-1 text-black font-medium text-sm md:text-[15px] leading-[1.6]">
          <p className="indent-6">
            Привет! Я художница SHITSU.
          </p>
          <p className="indent-6">
            Еще с детства мне было проще передавать свои чувства через холст,
            нежели простыми словами. Я впервые взяла в руки кисть будучи еще
            маленьким и ничего не понимающим в этом мире человеком. Сейчас я уже
            совсем не ребенок, а в жизни так до конца и не разобралась. Но мое
            творчество помогает мне каждый день понимать что-то большее и
            показывать это окружающим меня людям.
          </p>

          <p className="indent-6">
            В этом, отчасти, и есть моя цель. Создавать картины, которые помогают людям
            видеть эту жизнь и наслаждаться ей. Я не гонюсь за модой, за свежими видениями и
            инновациями. Просто хочу чтобы мои работы передавали красоту, глазами
            смотрящего. Изображая те вещи, которые хочу отразить в своей памяти и подарить
            наблюдателям те же чувства.
          </p>

          <p className="indent-6">
            Так же, как в подростковом возрасте, загораются глаза при виде своей
            первой любви, мои глаза загорелись при изучении Японии. Я вижу
            невероятные краски в этой стране и ее культуре, что очень часто
            отражается в моих работах, как дополнение к передачи ощущений.
          </p>

          <p className="indent-6">
            Я приглашаю своих сторонников, видящих яркими цветами эту жизнь,
            даже в ее темные моменты, присоединиться к моему творчеству. Ведь я
            влюблена в него и хочу разделить его с вами.
          </p>

          <p className="indent-6">
            Я никогда не останавливаюсь в развитии своего мастерства, так что
            скучно точно не будет. Но будут чувства, эмоции, которые нам всем
            иногда бывает так тяжело выразить словами.
          </p>
        </div>

        <div className="mt-16 text-center relative z-20">
          <div className="flex justify-center gap-4">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICONS[social.id];
              if (!Icon) return null;
              return (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3 relative z-30"
                >
                  <div className="w-16 h-16 border border-neutral-300 flex items-center justify-center group-hover:border-neutral-900 transition-colors bg-white">
                    <Icon className="w-6 h-6 text-black" weight="light" />
                  </div>
                  <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-neutral-500">
                    {social.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

