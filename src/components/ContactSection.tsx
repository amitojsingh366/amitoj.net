import { socialLinks } from "@/data/links";
import { profile } from "@/data/profile";
import { SectionHeading } from "./SectionHeading";

const byName = (name: string) => socialLinks.find((link) => link.name === name);

export function ContactSection() {
  const contactWords = profile.contactHeading.split(" ");
  const contactLastWord = contactWords.pop();
  const contactLead = contactWords.join(" ");
  const secondaryLinks = ["Twitter", "Paypal", "Ko-Fi"]
    .map(byName)
    .filter(Boolean);
  const directLinks = ["E-Mail", "Github", "LinkedIn", "Discord"]
    .map(byName)
    .filter(Boolean);

  return (
    <section id="contact" className="scroll-mt-[76px] pt-[88px] pb-12 max-sm:pt-[68px]">
      <div className="mx-auto w-full max-w-[1440px] px-7 max-sm:px-5 max-sm:[&>div]:items-start max-sm:[&>div>span:first-child]:pt-[3px]">
        <SectionHeading
          number="03"
          headingClassName="text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span>{contactLead}</span>{" "}
          <span className="max-sm:block">{contactLastWord}</span>
        </SectionHeading>
      </div>

      <div className="relative mt-10">
        <div
          className="relative aspect-[320/299] w-full"
          data-portrait=""
        />

        <div className="pointer-events-none absolute inset-0 mx-auto flex w-full max-w-[1440px] items-start justify-between gap-8 px-7 pt-[12%] max-sm:relative max-sm:mt-[-10%] max-sm:grid max-sm:grid-cols-1 max-sm:px-5 max-sm:pt-0">
          <div
            className="pointer-events-auto w-[min(30%,290px)] min-w-0 max-sm:w-full max-sm:border-t max-sm:border-[var(--line)] max-sm:py-6"
            data-reveal=""
          >
            <p className="mt-0 mb-6 text-xs tracking-[0.2em] text-[var(--accent)] uppercase">
              Whereabouts
            </p>
            <dl className="m-0 grid gap-6">
              <div>
                <dt className="text-xs tracking-[0.18em] text-[var(--muted)] uppercase">
                  Based in
                </dt>
                <dd className="mt-[7px] mb-0 text-sm leading-[1.6] font-light text-[#c9c9d2]">
                  {profile.location.place}
                  <br />
                  {profile.location.timezone}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.18em] text-[var(--muted)] uppercase">
                  Status
                </dt>
                <dd className="mt-[7px] mb-0 text-sm leading-[1.6] font-light text-[#c9c9d2]">
                  {profile.availability}
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5 text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
              {secondaryLinks.map(
                (link) =>
                  link && (
                    <a
                      className="transition-colors duration-150 hover:text-[#f2f2f6] hover:font-bold"
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.name} <span>↗</span>
                    </a>
                  ),
              )}
            </div>
          </div>

          <div
            className="pointer-events-auto w-[min(30%,290px)] min-w-0 max-sm:w-full max-sm:border-t max-sm:border-[var(--line)] max-sm:py-6"
            data-reveal=""
          >
            <p className="mt-0 mb-6 text-xs tracking-[0.2em] text-[var(--accent)] uppercase">
              Direct lines
            </p>
            <div className="flex flex-col gap-2">
              {directLinks.map(
                (link) =>
                  link && (
                    <a
                      className={`flex items-center justify-between gap-4 border px-[18px] py-[15px] text-xs tracking-[0.16em] uppercase transition-colors duration-150 hover:border-[var(--accent)] hover:text-[#f2f2f6] hover:font-bold ${
                        link.name === "E-Mail"
                          ? "border-[var(--accent)] font-semibold text-[var(--accent)]"
                          : "border-[var(--line)] text-[var(--muted)]"
                      }`}
                      key={link.name}
                      href={link.url}
                      target={link.url.startsWith("http") ? "_blank" : undefined}
                      rel={link.url.startsWith("http") ? "noreferrer" : undefined}
                    >
                      <span>{link.name}</span>
                      <span>↗</span>
                    </a>
                  ),
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="mx-auto mt-8 flex w-full max-w-[1440px] justify-between gap-4 border-t border-[var(--line)] px-7 pt-[22px] text-xs tracking-[0.16em] text-[var(--muted)] uppercase max-sm:px-5">
        <span>© {new Date().getFullYear()} {profile.name}</span>
      </footer>
    </section>
  );
}
