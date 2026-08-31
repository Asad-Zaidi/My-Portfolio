const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * The whole site is a single Portfolio document — there is only ever one
 * portfolio owner, so we don't model this as a multi-tenant collection.
 * Shape matches the frontend portfolio sections so the API response can be
 * dropped straight into the React app without any remapping.
 */

const linkSchema = new Schema({ label: String, href: String }, { _id: false });

const metaSchema = new Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    author: { type: String, default: "" },
    themeColor: { type: String, default: "#0a1120" },
    ogImage: { type: String, default: "" },
  },
  { _id: false }
);

const personalSchema = new Schema(
  {
    name: { type: String, default: "" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    initials: { type: String, default: "" },
    title: { type: String, default: "" },
    greeting: { type: String, default: "" },
    tagline: { type: String, default: "" },
    location: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    dob: { type: String, default: "" },
    nationality: { type: String, default: "" },
    availability: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    signature: { type: String, default: "" },
  },
  { _id: false }
);

const statSchema = new Schema(
  {
    id: { type: String, required: true },
    value: { type: String, default: "" },
    label: { type: String, default: "" },
  },
  { _id: false }
);

const heroSchema = new Schema(
  {
    ctaPrimary: { type: linkSchema, default: () => ({}) },
    ctaSecondary: { type: linkSchema, default: () => ({}) },
    codeSnippet: { type: [String], default: [] },
  },
  { _id: false }
);

const aboutSchema = new Schema(
  {
    heading: { type: String, default: "" },
    paragraph: { type: String, default: "" },
    traits: { type: [String], default: [] },
  },
  { _id: false }
);

const personalInfoRowSchema = new Schema(
  {
    icon: { type: String, default: "" },
    label: { type: String, default: "" },
    value: { type: String, default: "" },
    highlight: { type: Boolean, default: false },
  },
  { _id: false }
);

const personalInfoCardSchema = new Schema(
  {
    heading: { type: String, default: "" },
    rows: { type: [personalInfoRowSchema], default: [] },
  },
  { _id: false }
);

const educationSchema = new Schema(
  {
    id: { type: String, required: true },
    date: { type: String, default: "" },
    degree: { type: String, default: "" },
    institution: { type: String, default: "" },
    campus: { type: String, default: "" },
    status: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const experienceSchema = new Schema(
  {
    id: { type: String, required: true },
    role: { type: String, default: "" },
    org: { type: String, default: "" },
    type: { type: String, default: "" },
    date: { type: String, default: "" },
    location: { type: String, default: "" },
    description: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    logoText: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  { _id: false }
);

const skillLanguageSchema = new Schema(
  {
    name: { type: String, required: true },
    percent: { type: Number, default: 0, min: 0, max: 100 },
    icon: { type: String, default: "" },
  },
  { _id: false }
);

const skillToolSchema = new Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: "" },
  },
  { _id: false }
);

const skillsSchema = new Schema(
  {
    languages: { type: [skillLanguageSchema], default: [] },
    tools: { type: [skillToolSchema], default: [] },
  },
  { _id: false }
);

const projectSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    category: { type: String, default: "" },
    featured: { type: Boolean, default: false },
  },
  { _id: false }
);

const certificationSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, default: "" },
    provider: { type: String, default: "" },
    year: { type: String, default: "" },
    image: { type: String, default: "" },
    credentialId: { type: String, default: "" },
    credentialUrl: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const blogSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    category: { type: String, default: "General", trim: true },
    author: { type: String, default: "", trim: true },
    thumbnail: { type: String, default: "", trim: true },
    tags: { type: [String], default: [] },
    date: { type: String, default: "" },
    readTime: { type: String, default: "" },
    excerpt: { type: String, default: "", trim: true },
    content: { type: String, default: "" },
    accent: { type: String, default: "from-blue-500/25 via-cyan-400/15 to-transparent" },
  },
  { _id: false }
);

const badgeSchema = new Schema(
  {
    id: { type: String, required: true },
    embedCode: { type: String, default: "" },
  },
  { _id: false }
);

const hobbySchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, default: "" },
    icon: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const languageSchema = new Schema(
  {
    name: { type: String, required: true },
    level: { type: String, default: "" },
    percent: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false }
);

const contactSchema = new Schema(
  {
    heading: { type: String, default: "" },
    description: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
  },
  { _id: false }
);

const socialSchema = new Schema(
  {
    platform: { type: String, required: true },
    label: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  { _id: false }
);

const resumeSchema = new Schema(
  {
    file: { type: String, default: "" },
    label: { type: String, default: "Download CV" },
  },
  { _id: false }
);

const navItemSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, default: "" },
  },
  { _id: false }
);

const portfolioSchema = new Schema(
  {
    // Fixed key so there is always exactly one portfolio document.
    slug: { type: String, default: "main", unique: true, immutable: true },

    meta: { type: metaSchema, default: () => ({}) },
    personal: { type: personalSchema, default: () => ({}) },
    stats: { type: [statSchema], default: [] },
    hero: { type: heroSchema, default: () => ({}) },
    about: { type: aboutSchema, default: () => ({}) },
    personalInfoCard: { type: personalInfoCardSchema, default: () => ({}) },
    education: { type: [educationSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    skills: { type: skillsSchema, default: () => ({}) },
    certifications: { type: [certificationSchema], default: [] },
    blogs: { type: [blogSchema], default: [] },
    badges: { type: [badgeSchema], default: [] },
    hobbies: { type: [hobbySchema], default: [] },
    languages: { type: [languageSchema], default: [] },
    contact: { type: contactSchema, default: () => ({}) },
    socials: { type: [socialSchema], default: [] },
    resume: { type: resumeSchema, default: () => ({}) },
    nav: { type: [navItemSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.slug;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
