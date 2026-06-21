# WCAG 2.2 Target Size & Contrast Heuristic Tester

A highly polished, production-ready developer utility designed to test user interfaces for **WCAG 2.2 accessibility compliance**. Built as part of a technical trial task, this single-page React application provides instantaneous feedback for core digital accessibility metrics, ensuring products are inclusive and ready for modern web standards.

🚀 **Live Deployment:** [View the Live Tool on Vercel](https://wcag-compliance-tester.vercel.app)

---

## 🎨 Key Features

The application incorporates three real-time micro-utilities housed within a unified, modern dark-themed user interface:

1. **Utility 01: Interactive Tap Target Validator (WCAG 2.5.5)**
   * Dynamically tracks target clickability sizes based on custom inputs for Element Width, Height, and Padding.
   * Renders a real-time visual bounding box preview of the total touch area.
   * Evaluates metrics automatically to output an immediate **PASS / FAIL** alert against the strict $44 \times 44\text{px}$ standard.

2. **Utility 02: Contrast Ratio Calculator (WCAG 1.4.3)**
   * Evaluates the relative luminance contrast between custom foreground text and background colors via text or color-picker fields.
   * Dynamically visualizes a real-time sample component displaying standard body text.
   * Provides absolute validation states across **WCAG AA Normal Text (4.5:1 min)**, **WCAG AA Large Text (3:1 min)**, and **WCAG AAA Normal Text (7:1 min)** guidelines.

3. **Utility 03: Markdown Audit Exporter**
   * Automatically synchronizes and compiles active testing states into a cleanly formatted markdown table.
   * Built with a one-click **"Copy Markdown to Clipboard"** workflow, tailored for immediate integration into GitHub Pull Request descriptions, developer logs, or compliance issues.

---

## 💻 Tech Stack

* **Frontend Framework:** React (Vite-powered for optimized, ultra-fast builds)
* **Styling:** Tailwind CSS (Custom dark-mode aesthetic with accessible color palettes)
* **Icons:** Lucide React

---

## 🛠️ How to Run Locally

Follow these quick steps to get the environment running on your machine:

1. **Clone the Repository:**
```bash
   git clone [https://github.com/Ananyav08/wcag-compliance-tester.git](https://github.com/Ananyav08/wcag-compliance-tester.git)
   cd wcag-compliance-tester
