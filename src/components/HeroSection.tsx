import { socialLinks } from "@/data/links";
import { profile } from "@/data/profile";

export function HeroSection() {
  const heroLinks = socialLinks.filter((link) =>
    ["Github", "LinkedIn", "E-Mail", "Discord"].includes(link.name),
  );

  return (
    <header
      id="top"
      className="relative mx-auto flex min-h-dvh w-full max-w-[1440px] scroll-mt-12 flex-col justify-center overflow-hidden px-5 pt-12 pb-10 sm:px-7 sm:pt-14 sm:pb-12 lg:pt-16 lg:pb-14"
    >
      <span id="home" className="absolute top-0" aria-hidden="true" />
      <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5 text-xs tracking-[0.12em] text-[var(--muted)] uppercase [text-wrap:balance] sm:tracking-[0.18em]">
        <span
          className="h-1.5 w-1.5 animate-[availability-pulse_2s_ease-in-out_3] bg-[var(--accent)]"
          aria-hidden="true"
        />
        <p className="m-0">{profile.availability}</p>
        <p className="col-start-2 m-0">
          Currently:{" "}
          <span className="text-[var(--fg)]">{profile.currentRole}</span>
        </p>
      </div>

      <h1
        className="relative mt-4 sm:mt-6 text-8xl md:text-[10rem] leading-[0.84] font-extrabold tracking-[-0.055em] uppercase "
        aria-label={profile.name}
      >
        <span className="block" data-cell="" data-cell-reveal="">
          Amitoj
        </span>
        <span
          className="block"
          data-cell=""
          data-cell-outline=""
          data-cell-reveal=""
        >
          Singh
        </span>
      </h1>

      <div className="relative mt-6 grid grid-cols-1 gap-4 border-t border-[var(--line)] pt-4 sm:mt-8 sm:grid-cols-2 sm:gap-7 sm:pt-6 lg:mt-12 lg:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] lg:gap-8 lg:pt-7">
        <p className="col-auto m-0 max-w-[46ch] text-sm leading-[1.7] font-light text-[var(--fg)] [text-wrap:pretty] sm:col-span-full sm:text-base lg:col-span-2">
          {profile.description}
        </p>

        <div className="grid grid-cols-2 content-start gap-4 sm:grid-cols-1 sm:gap-5">
          {profile.stats.map((stat) => (
            <div className="grid justify-items-start" key={stat.label}>
              <strong
                className="text-5xl lg:text-6xl leading-none font-extrabold tracking-[-0.03em]"
                data-cell=""
              >
                {stat.value}
              </strong>
              <span className="mt-1 text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div
          className="flex flex-row flex-wrap items-start gap-x-5 gap-y-2 text-xs tracking-[0.12em] text-[var(--muted)] uppercase sm:flex-col sm:flex-nowrap"
          aria-label="Featured contact links"
        >
          {heroLinks.map((link) => (
            <a
              className="transition-colors duration-150 hover:text-[#f2f2f6] hover:font-bold"
              key={link.name}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel={link.url.startsWith("http") ? "noreferrer" : undefined}
            >
              {link.name === "E-Mail" ? "Email" : link.name} <span>↗</span>
            </a>
          ))}
        </div>
      </div>

      <a
        className="group absolute bottom-2.5 left-1/2 z-[2] grid h-8 w-8 -translate-x-1/2 place-items-center sm:bottom-5"
        href="#experience"
        aria-label="Scroll to experience"
      >
        <span
          className="grid h-4 w-7 grid-cols-[repeat(5,4px)] grid-rows-[repeat(3,4px)] gap-0.5"
          aria-hidden="true"
        >
          <i className="col-start-1 row-start-1 animate-[scroll-cue-pulse_1.5s_ease-in-out_3] bg-[var(--accent)] opacity-[0.18] group-hover:animate-none group-hover:bg-white group-hover:opacity-100 group-hover:shadow-[0_0_12px_#fff,0_0_20px_var(--accent)] group-focus-visible:animate-none group-focus-visible:bg-white group-focus-visible:opacity-100 group-focus-visible:shadow-[0_0_12px_#fff,0_0_20px_var(--accent)] motion-reduce:opacity-[0.72]" />
          <i className="col-start-5 row-start-1 animate-[scroll-cue-pulse_1.5s_ease-in-out_3] bg-[var(--accent)] opacity-[0.18] group-hover:animate-none group-hover:bg-white group-hover:opacity-100 group-hover:shadow-[0_0_12px_#fff,0_0_20px_var(--accent)] group-focus-visible:animate-none group-focus-visible:bg-white group-focus-visible:opacity-100 group-focus-visible:shadow-[0_0_12px_#fff,0_0_20px_var(--accent)] motion-reduce:opacity-[0.72]" />
          <i className="col-start-2 row-start-2 animate-[scroll-cue-pulse_1.5s_ease-in-out_3] bg-[var(--accent)] opacity-[0.18] [animation-delay:140ms] group-hover:animate-none group-hover:bg-white group-hover:opacity-100 group-hover:shadow-[0_0_12px_#fff,0_0_20px_var(--accent)] group-focus-visible:animate-none group-focus-visible:bg-white group-focus-visible:opacity-100 group-focus-visible:shadow-[0_0_12px_#fff,0_0_20px_var(--accent)] motion-reduce:opacity-[0.72]" />
          <i className="col-start-4 row-start-2 animate-[scroll-cue-pulse_1.5s_ease-in-out_3] bg-[var(--accent)] opacity-[0.18] [animation-delay:140ms] group-hover:animate-none group-hover:bg-white group-hover:opacity-100 group-hover:shadow-[0_0_12px_#fff,0_0_20px_var(--accent)] group-focus-visible:animate-none group-focus-visible:bg-white group-focus-visible:opacity-100 group-focus-visible:shadow-[0_0_12px_#fff,0_0_20px_var(--accent)] motion-reduce:opacity-[0.72]" />
          <i className="col-start-3 row-start-3 animate-[scroll-cue-pulse_1.5s_ease-in-out_3] bg-[var(--accent)] opacity-[0.18] [animation-delay:280ms] group-hover:animate-none group-hover:bg-white group-hover:opacity-100 group-hover:shadow-[0_0_12px_#fff,0_0_20px_var(--accent)] group-focus-visible:animate-none group-focus-visible:bg-white group-focus-visible:opacity-100 group-focus-visible:shadow-[0_0_12px_#fff,0_0_20px_var(--accent)] motion-reduce:opacity-[0.72]" />
        </span>
      </a>
    </header>
  );
}
