import { useState, useEffect, useRef } from "react";
import { InstagramLogo, TiktokLogo, TelegramLogo } from "@phosphor-icons/react";
import { HeaderImage } from "@/components/HeaderImage";
import { SEO } from "@/components/SEO";

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
    href: "https://t.me/shitsu_art",
    label: "Telegram",
  },
];

export function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionTop = rect.top;
        const windowHeight = window.innerHeight;
        const progress = Math.max(
          0,
          Math.min(
            1,
            (windowHeight - sectionTop) / (windowHeight + rect.height),
          ),
        );
        setScrollY(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stickerProgress = Math.min(1, Math.max(0, (scrollY - 0.2) * 1.5));
  const stickerY = 100 - stickerProgress * 100;
  const stickerRotate = -15 + stickerProgress * 15;
  const stickerScale = 0.8 + stickerProgress * 0.2;

  return (
    <div
      ref={sectionRef}
      className="min-h-screen pt-32 pb-20 relative overflow-hidden"
    >
      <SEO page="about" />
      <div
        className="fixed right-[5%] bottom-0 z-10 pointer-events-none"
        style={{
          transform: `translateY(${stickerY}%) rotate(${stickerRotate}deg) scale(${stickerScale})`,
          transition: "none",
          width: "clamp(380px, 50vw, 600px)",
          opacity: stickerProgress > 0 ? 1 : 0,
        }}
      >
        <img
          src="./artist.png"
          alt="Художница Кира (SHITSU) — Москва, Россия"
          className="w-full h-auto drop-shadow-2xl"
          style={{
            filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.25))",
          }}
        />
      </div>

      <div className="max-w-[900px] mx-auto px-6 lg:px-12 relative z-0">
        <HeaderImage
          src="./headers/about.png"
          alt="Обо мне"
          className="h-14 lg:h-20 w-auto object-contain mb-12 mx-auto"
        />
        <h1 className="hidden text-3xl lg:text-4xl tracking-[0.15em] uppercase mb-12">
          Обо мне
        </h1>

        <div className="space-y-6 text-neutral-600 leading-relaxed text-lg text-justify">
          <p className="text-neutral-900">
            <span className="float-left mr-3 text-4xl leading-none font-light">
              Е
            </span>
            ще с детства мне было проще передавать свои чувства через холст,
            нежели простыми словами. Я впервые взяла в руки кисть будучи еще
            маленьким и ничего не понимающим в этом мире человеком. Сейчас я уже
            совсем не ребенок, а в жизни так до конца и не разобралась. Но мое
            творчество помогает мне каждый день понимать что-то большее и
            показывать это окружающим меня людям.
          </p>

          <p className="indent-8">
            Я не гонюсь за модой, за свежими видениями и инновациями. Просто
            хочу чтобы мои работы передавали красоту, глазами смотрящего.
            Изображая те вещи, которые хочу отразить в своей памяти и подарить
            наблюдателям те же чувства.
          </p>

          <p className="indent-8">
            Так же, как в подростковом возрасте, загораются глаза при виде своей
            первой любви, мои глаза загорелись при изучении Японии. Я вижу
            невероятные краски в этой стране и ее культуре, что очень часто
            отражается в моих работах.
          </p>

          <p className="indent-8">
            Я приглашаю своих сторонников, видящих яркими цветами эту жизнь,
            даже в ее темные моменты, присоединиться к моему творчеству. Ведь я
            влюблена в него и хочу разделить его с вами.
          </p>
          <p>
            Я никогда не останавливаюсь в развитии своего мастерства,
            так что скучно точно не будет. Но будут чувства, эмоции, которые нам всем иногда
            бывает так тяжело выразить словами.
          </p>
        </div>

        <div className="mt-16 text-center">
          <div className="flex justify-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 border border-neutral-300 flex items-center justify-center group-hover:border-neutral-900 transition-colors">
                  <Icon className="w-6 h-6" weight="light" />
                </div>
                <span className="text-xs tracking-[0.2em] uppercase text-neutral-500">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
