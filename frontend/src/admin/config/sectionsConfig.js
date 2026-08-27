// Single source of truth describing every editable section of the
// Portfolio document. Each entry drives a generic editor (ObjectSectionEditor
// or ArraySectionEditor) so we don't need one hand-written page per section.
//
// Field `type` values understood by FieldInput: text, email, url, textarea,
// richtext, color, number, boolean, image.
// Extra field shapes handled directly by ObjectSectionEditor: linkGroup
// ({ label, href }), stringList (array of plain strings), itemList (nested
// array of objects — its own `fields` array of the same shape as here).

export const sectionsConfig = {
  meta: {
    kind: "object",
    label: "General & SEO",
    description: "Site title, description and branding used in the browser tab and social previews.",
    fields: [
      { key: "title", label: "Site Title", type: "text" },
      { key: "description", label: "Meta Description", type: "textarea" },
      { key: "author", label: "Author", type: "text" },
      { key: "themeColor", label: "Theme Color", type: "color" },
      { key: "ogImage", label: "Social Share Image (OG Image)", type: "image" },
    ],
  },

  personal: {
    kind: "object",
    label: "Personal Info",
    description: "Who you are — shown in the hero, navbar and about section.",
    fields: [
      { key: "name", label: "Full Display Name", type: "text" },
      { key: "firstName", label: "First Name", type: "text" },
      { key: "lastName", label: "Last Name", type: "text" },
      { key: "initials", label: "Initials", type: "text" },
      { key: "title", label: "Professional Title", type: "text" },
      { key: "greeting", label: "Greeting", type: "text" },
      { key: "tagline", label: "Tagline", type: "textarea" },
      { key: "location", label: "Location", type: "text" },
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "dob", label: "Date of Birth", type: "text" },
      { key: "nationality", label: "Nationality", type: "text" },
      { key: "availability", label: "Availability", type: "text" },
      { key: "profileImage", label: "Profile Image", type: "image" },
      { key: "heroImage", label: "Hero Image", type: "image" },
      { key: "signature", label: "Signature", type: "text" },
    ],
  },

  hero: {
    kind: "object",
    label: "Hero Section",
    description: "The landing banner: call-to-action buttons and the animated code snippet.",
    fields: [
      { key: "ctaPrimary", label: "Primary Button", type: "linkGroup" },
      { key: "ctaSecondary", label: "Secondary Button", type: "linkGroup" },
      { key: "codeSnippet", label: "Code Snippet (one line per row)", type: "stringList" },
    ],
  },

  about: {
    kind: "object",
    label: "About",
    description: "The About Me section heading, paragraph and trait chips.",
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "paragraph", label: "Paragraph", type: "textarea" },
      { key: "traits", label: "Traits", type: "stringList" },
    ],
  },

  personalInfoCard: {
    kind: "object",
    label: "Personal Info Card",
    description: "The info table shown next to About (name, DOB, location, etc).",
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      {
        key: "rows",
        label: "Rows",
        type: "itemList",
        itemLabel: "row",
        fields: [
          { key: "icon", label: "Icon (lucide name)", type: "text" },
          { key: "label", label: "Label", type: "text" },
          { key: "value", label: "Value", type: "text" },
          { key: "highlight", label: "Highlight", type: "boolean" },
        ],
      },
    ],
  },

  skills: {
    kind: "object",
    label: "Skills",
    description: "Programming languages with proficiency bars, and the tools/tech logo grid.",
    fields: [
      {
        key: "languages",
        label: "Languages",
        type: "itemList",
        itemLabel: "language",
        fields: [
          { key: "name", label: "Name", type: "text" },
          { key: "percent", label: "Proficiency %", type: "number", min: 0, max: 100 },
        ],
      },
      {
        key: "tools",
        label: "Tools",
        type: "itemList",
        itemLabel: "tool",
        fields: [
          { key: "name", label: "Name", type: "text" },
          { key: "icon", label: "Icon key", type: "text" },
        ],
      },
    ],
  },

  contact: {
    kind: "object",
    label: "Contact Section",
    description: "Heading and contact details shown in the Contact section.",
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "location", label: "Location", type: "text" },
    ],
  },

  resume: {
    kind: "object",
    label: "Résumé",
    description: "The downloadable CV file and button label.",
    fields: [
      { key: "file", label: "Résumé File", type: "image" },
      { key: "label", label: "Button Label", type: "text" },
    ],
  },

  stats: {
    kind: "array",
    label: "Stats",
    description: "The counter row (years of experience, projects completed, etc).",
    itemLabel: "stat",
    needsId: true,
    fields: [
      { key: "value", label: "Value", type: "text" },
      { key: "label", label: "Label", type: "text" },
    ],
  },

  education: {
    kind: "array",
    label: "Education",
    description: "Your academic timeline.",
    itemLabel: "education entry",
    needsId: true,
    fields: [
      { key: "date", label: "Date Range", type: "text" },
      { key: "degree", label: "Degree", type: "text" },
      { key: "institution", label: "Institution", type: "text" },
      { key: "campus", label: "Campus", type: "text" },
      { key: "status", label: "Status", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },

  experience: {
    kind: "array",
    label: "Experience",
    description: "Work history and freelance/project experience.",
    itemLabel: "experience entry",
    needsId: true,
    fields: [
      { key: "role", label: "Role", type: "text" },
      { key: "org", label: "Organization", type: "text" },
      { key: "type", label: "Type", type: "text" },
      { key: "date", label: "Date Range", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "technologies", label: "Technologies", type: "stringList" },
      { key: "logoText", label: "Logo Text", type: "text" },
      { key: "link", label: "Link", type: "url" },
    ],
  },

  certifications: {
    kind: "array",
    label: "Certifications",
    description: "Courses and certificates you've completed.",
    itemLabel: "certification",
    needsId: true,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "provider", label: "Provider", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "image", label: "Certificate Image", type: "image" },
      { key: "credentialId", label: "Credential ID", type: "text" },
      { key: "credentialUrl", label: "Credential URL", type: "url" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },

  badges: {
    kind: "array",
    label: "Badges",
    description: "Paste an embed code from your badge provider. The embedded badge supplies its own content.",
    itemLabel: "badge",
    needsId: true,
    fields: [
      {
        key: "embedCode",
        label: "Badge Embed Code",
        type: "textarea",
        placeholder: "Paste the complete badge embed code here",
      },
    ],
  },

  hobbies: {
    kind: "array",
    label: "Hobbies",
    description: "Interests outside of work.",
    itemLabel: "hobby",
    needsId: true,
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "icon", label: "Icon (lucide name)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },

  languages: {
    kind: "array",
    label: "Spoken Languages",
    description: "Languages you speak, with a fluency bar.",
    itemLabel: "language",
    needsId: false,
    fields: [
      { key: "name", label: "Language", type: "text" },
      { key: "level", label: "Level", type: "text" },
      { key: "percent", label: "Fluency %", type: "number", min: 0, max: 100 },
    ],
  },

  socials: {
    kind: "array",
    label: "Social Links",
    description: "Links shown in the navbar footer and hero section.",
    itemLabel: "social link",
    needsId: false,
    fields: [
      { key: "platform", label: "Platform key", type: "text" },
      { key: "label", label: "Label", type: "text" },
      { key: "url", label: "URL", type: "url" },
    ],
  },

  nav: {
    kind: "array",
    label: "Navigation Menu",
    description: "The top navbar links, in order.",
    itemLabel: "nav link",
    needsId: false,
    fields: [
      { key: "label", label: "Label", type: "text" },
      { key: "href", label: "Anchor (e.g. #about)", type: "text" },
    ],
  },
};

export const sectionOrder = [
  "meta",
  "personal",
  "hero",
  "about",
  "personalInfoCard",
  "skills",
  "education",
  "experience",
  "certifications",
  "badges",
  "hobbies",
  "languages",
  "stats",
  "contact",
  "resume",
  "socials",
  "nav",
];
