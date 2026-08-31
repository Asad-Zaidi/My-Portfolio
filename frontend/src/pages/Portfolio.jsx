import { useEffect, useState } from "react";
import { fetchPortfolio } from "../api/api";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import Certifications from "../components/Certifications";
import Badges from "../components/Badges";
import Hobbies from "../components/Hobbies";
import Languages from "../components/Languages";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { Spokes } from "../components/Spokes";

function setMetaTag(selector, attr, value) {
  if (!value) return;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, attrName, attrValue] = selector.match(/\[(.+)="(.+)"\]/) || [];
    if (attrName && attrValue) el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export default function Portfolio() {
  // All content lives in MongoDB and is served by the backend at
  // GET /api/portfolio.
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchPortfolio()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const { meta, personal, stats, hero, about, personalInfoCard, education, experience, skills, certifications, badges, hobbies, languages, contact, socials, resume, nav } =
    data || {};

  // SEO: keep <head> in sync with the fetched content rather than hardcoding it in index.html
  useEffect(() => {
    if (!meta) return;
    if (meta.title) document.title = meta.title;
    setMetaTag('meta[name="description"]', "content", meta.description);
    setMetaTag('meta[name="author"]', "content", meta.author);
    setMetaTag('meta[property="og:title"]', "content", meta.title);
    setMetaTag('meta[property="og:description"]', "content", meta.description);
    if (meta.ogImage) setMetaTag('meta[property="og:image"]', "content", meta.ogImage);
    setMetaTag('meta[name="theme-color"]', "content", meta.themeColor);
  }, [meta]);

  if (error && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-slate-500 dark:bg-navy-950 dark:text-slate-400">
        Unable to load portfolio data. Please try again later.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-navy-950 text-accent">
        <Spokes className="h-9 w-9" />
      </div>
    );
  }

  return (
    <div className="px-8 bg-white dark:bg-navy-950 text-slate-800 dark:text-slate-200 overflow-x-hidden md:px-32">
      <Navbar personal={personal} nav={nav} resume={resume} />

      <main>
        <Hero personal={personal} stats={stats} hero={hero} socials={socials} />
        <About personal={personal} about={about} personalInfoCard={personalInfoCard} />
        <Education items={education} />

        <section className="-mx-6 bg-white dark:bg-navy-950 py-16 md:mx-0 md:py-24">
          <div className="container grid gap-12 lg:grid-cols-5 items-start">
            <div className="lg:col-span-3">
              <Experience items={experience} />
            </div>
            <div className="lg:col-span-2">
              <Skills languages={skills?.languages} tools={skills?.tools} />
            </div>
          </div>
        </section>

        <Certifications items={certifications} />
        <Badges items={badges} />
        <section className="-mx-8 bg-slate-50 px-8 py-8 dark:bg-navy-900 md:-mx-32 md:px-32 md:py-16">
          <div className="container grid gap-12 lg:grid-cols-2 lg:items-start">
            <Hobbies items={hobbies} embedded />
            <Languages items={languages} embedded />
          </div>
        </section>
        <Contact contact={contact} resume={resume} />
      </main>

      <Footer personal={personal} nav={nav} socials={socials} />
    </div>
  );
}
