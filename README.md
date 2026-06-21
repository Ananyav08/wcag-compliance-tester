# WCAG 2.2 Accessibility Heuristic Tester

WCAG 2.2 Accessibility Heuristic Tester is a developer utility built to simplify accessibility validation. It provides real-time analysis of tap target sizes, color contrast ratios, and generates shareable audit reports to help teams build more inclusive and standards-compliant user interfaces.

## Live Demo

🔗 https://wcag-compliance-tester.vercel.app/

---

## Features

### 1. Interactive Tap Target Validator (WCAG 2.5.5)

* Input element width, height, and padding
* Real-time touch target visualization
* Automatic PASS / FAIL validation
* Tests against the WCAG 2.2 recommended minimum target size of 44×44 pixels

### 2. Contrast Ratio Calculator (WCAG 1.4.3)

* Select foreground and background colors
* Calculate contrast ratio instantly
* Live preview of text appearance
* Accessibility validation for:

  * WCAG AA Normal Text (4.5:1)
  * WCAG AA Large Text (3:1)
  * WCAG AAA Normal Text (7:1)

### 3. Markdown Accessibility Report Generator

* Generates structured markdown reports
* One-click copy to clipboard
* Suitable for GitHub Pull Requests, accessibility audits, and compliance documentation

---

## Tech Stack

* React (Vite)
* Tailwind CSS
* Lucide React
* JavaScript

### AI-Assisted Development

* Claude 4.6 was used for UI planning, accessibility heuristics, and development assistance.

---

## Local Setup

### Clone the Repository

```bash
git clone https://github.com/Ananyav08/wcag-compliance-tester.git
cd wcag-compliance-tester
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Production Build

```bash
npm run build
```

Deploy using Vercel:

```bash
npx vercel --prod
```

---

## Developer Information

Name: Ananya Vishwakarma

Email: [anvishwakarma52@gmail.com](mailto:anvishwakarma52@gmail.com)

---

## Built for Digital Heroes

This project was developed as part of the Digital Heroes Custom Software Developer Trial Task.

Website: https://digitalheroesco.com
