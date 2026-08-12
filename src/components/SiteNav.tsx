import { profile } from "@/data/profile";

const navigation = [
  { number: "01", label: "Work", href: "#projects" },
  { number: "02", label: "History", href: "#experience" },
  { number: "03", label: "Contact", href: "#contact" },
];

export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <a className="site-nav__mark" href="#top" aria-label="Back to top">
        {profile.initials}
      </a>
      <div className="site-nav__links">
        {navigation.map((item) => (
          <a key={item.href} href={item.href}>
            <span>{item.number}</span> {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
