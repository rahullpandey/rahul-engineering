"use client";

export default function GmailLink({ to, subject = "", body = "", className = "", children }) {
  const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const handleClick = (event) => {
    event.preventDefault();
    if (typeof navigator === "undefined") {
      window.location.href = mailto;
      return;
    }

    const ua = navigator.userAgent.toLowerCase();
    let gmailUrl = null;

    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
      gmailUrl = `googlegmail://co?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    } else if (ua.includes("android")) {
      gmailUrl = `intent://compose?to=${encodeURIComponent(
        to
      )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        body
      )}#Intent;scheme=mailto;package=com.google.android.gm;end`;
    }

    if (gmailUrl) {
      window.location.href = gmailUrl;
      setTimeout(() => {
        window.location.href = mailto;
      }, 600);
    } else {
      window.location.href = mailto;
    }
  };

  return (
    <a className={className} href={mailto} onClick={handleClick}>
      {children}
    </a>
  );
}
