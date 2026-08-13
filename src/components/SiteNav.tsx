import { profile } from "@/data/profile";

const navigation = [
  { number: "01", label: "Work", href: "#projects" },
  { number: "02", label: "History", href: "#experience" },
  { number: "03", label: "Contact", href: "#contact" },
];

export function SiteNav() {
  return (
    <nav
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between gap-5 border-b border-[var(--line)] bg-[rgba(8,8,10,0.72)] px-7 py-4 text-xs tracking-[0.14em] uppercase backdrop-blur-[12px] max-sm:gap-3 max-sm:px-4 max-sm:py-3.5"
      aria-label="Primary navigation"
    >
      <a
        className="font-extrabold tracking-[0.06em] transition-colors duration-150 hover:text-[var(--accent)]"
        href="#top"
        aria-label="Back to top"
      >
        {profile.initials}
      </a>
      <div className="flex gap-[22px] text-[var(--muted)] max-sm:gap-3">
        {navigation.map((item) => (
          <a
            className="transition-colors duration-150 hover:text-[var(--accent)] hover:font-bold"
            key={item.href}
            href={item.href}
          >
            <span>{item.number}</span> {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
