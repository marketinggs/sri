# Next.js Admin UI Base

This project is a minimal Next.js app configured with Tailwind CSS and [shadcn/ui](https://ui.shadcn.com/) components. IBM Plex Sans is bundled locally using `@fontsource/ibm-plex-sans` and loaded with `next/font`.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

You can build the project using:

```bash
npm run build
```

## Project Structure

- `app/` – Next.js app router pages and layout
- `components/` – reusable UI components
- `lib/` – shared utilities

The default page displays a simple "Hello World" heading.

## Notes

This repository provides the base for an internal admin tool that will integrate with Mailmodo APIs in the future.
