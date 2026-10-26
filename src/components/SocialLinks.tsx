import { socials } from "@/lib/campaign";

type SocialName = (typeof socials)[number]["name"];

function SocialIcon({ name }: { name: SocialName }) {
  const common = { "aria-hidden": true, viewBox: "0 0 24 24", className: "h-5 w-5" } as const;
  switch (name) {
    case "Facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M13.5 21v-7.5H16l.5-3h-3V8.6c0-.9.3-1.6 1.6-1.6h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H8v3h2.5V21h3Z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="3.8" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg {...common} fill="currentColor">
          <path d="M4.5 9h3.3v10.5H4.5V9Zm1.7-5.3a1.9 1.9 0 1 1 0 3.9 1.9 1.9 0 0 1 0-3.9ZM10 9h3.2v1.4h.1c.4-.8 1.5-1.7 3.1-1.7 3.4 0 4 2.2 4 5v5.8h-3.3v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7v5.2H10V9Z" />
        </svg>
      );
  }
}

/** Round icon links to the church's social media pages. */
export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex gap-3 ${className}`}>
      {socials.map((s) => (
        <li key={s.name}>
          <a
            href={s.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${s.name} (opens in a new tab)`}
            title={s.name}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-gold hover:text-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <SocialIcon name={s.name} />
          </a>
        </li>
      ))}
    </ul>
  );
}
