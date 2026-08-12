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
    <section id="contact" className="contact-section">
      <div className="page-container">
        <SectionHeading number="03">
          <span>{contactLead}</span>{" "}
          <span className="contact-heading__line">{contactLastWord}</span>
        </SectionHeading>
      </div>

      <div className="portrait-stage">
        <div className="portrait-stage__canvas" data-portrait="" />

        <div className="portrait-stage__overlay">
          <div className="contact-panel" data-reveal="">
            <p className="contact-panel__label">Whereabouts</p>
            <dl>
              <div>
                <dt>Based in</dt>
                <dd>
                  {profile.location.place}
                  <br />
                  {profile.location.timezone}
                </dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{profile.availability}</dd>
              </div>
            </dl>
            <div className="contact-panel__inline-links">
              {secondaryLinks.map(
                (link) =>
                  link && (
                    <a key={link.name} href={link.url} target="_blank" rel="noreferrer">
                      {link.name} <span>↗</span>
                    </a>
                  ),
              )}
            </div>
          </div>

          <div className="contact-panel contact-panel--direct" data-reveal="">
            <p className="contact-panel__label">Direct lines</p>
            <div className="direct-links">
              {directLinks.map(
                (link) =>
                  link && (
                    <a
                      className={link.name === "E-Mail" ? "direct-links__primary" : ""}
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

      <footer className="page-container site-footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
      </footer>
    </section>
  );
}
