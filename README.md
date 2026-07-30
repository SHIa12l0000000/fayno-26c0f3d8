# Family Chronicle

# **FAYNO – Complete Website Development Prompt (MVP v1.0)**

## Project Overview

Build a **production-quality**, **modern**, and **minimal** web application called **FAYNO**.

FAYNO is a platform where people can preserve their family's history by storing names, relationships, photos, and short memories for future generations.

The website should focus on **simplicity**, **trust**, and **ease of use**.

This is the **first MVP**, so do **not** build advanced genealogy software. Keep everything focused on the core idea.

---

# ⚠️ Very Important Design Instructions

The website **must NOT look AI-generated**.

It should look like it was designed and developed by an experienced product designer and frontend engineer.

Avoid flashy UI.

Avoid unnecessary animations.

Avoid colorful gradients.

Avoid glassmorphism.

Avoid futuristic effects.

Avoid oversized illustrations.

Avoid decorative elements.

Everything should feel calm, clean, professional, and trustworthy.

The design philosophy should resemble products like Google, GitHub, Notion, Stripe Dashboard, Dropbox, and Linear.

Do **not** copy their UI.

Only follow their clean design principles.

The website should feel like a real startup product.

---

# Brand

## Website Name

**FAYNO**

## Main Tagline

**Every Family Has a Story. Preserve Yours.**

## Brand Mission

Helping families preserve memories, relationships, and stories for future generations.

---

# Theme

Primary Color

Green (#22C55E)

Background

White

Cards

White

Borders

Light Gray

Text

Dark Gray / Almost Black

Icons

Minimal outline icons

Rounded Corners

10–12px

Shadows

Very subtle

Spacing

Large whitespace

Responsive

Desktop

Tablet

Mobile

---

# Typography

Use

Inter

or

Geist

Keep typography simple.

No decorative fonts.

---

# Navigation

Sticky top navigation.

Left

FAYNO logo

Center

Home

Search

My Family

Right

Login

Sign Up

After login

Profile Avatar

---

# Landing Page

## Hero Section

Large headline

> Every Family Has a Story. Preserve Yours.

Subtitle

Save your family's names, photos, and memories in one secure place so future generations never forget their roots.

Buttons

Primary

Get Started

Secondary

Search Families

Right side

A simple illustration of a family tree or connected family cards.

Nothing cartoonish.

---

## Features Section

Three simple cards.

### Build Your Family

Create your digital family record in minutes.

---

### Save Memories

Upload photos and write memories.

---

### Privacy First

Choose exactly what others can see.

---

## Why FAYNO?

Short paragraph.

Explain that many families lose names, stories, and photographs over time.

FAYNO helps preserve those memories.

---

# Authentication

Google Login

Email Login

Register

Forgot Password

Email Verification

Keep forms minimal.

---

# Username System

Every user chooses a unique username.

Example

@shivambedi

@bedifamily

@rajput

Each username creates a public profile.

Example

fayno.com/@shivambedi

If unavailable

Suggest alternatives automatically.

---

# Dashboard

Welcome Message

Example

Welcome back, Shivam 👋

Statistics

Family Members

Buttons

Add Member

My Family

Search

Profile

---

# Add Family Member

Simple form.

Fields

Photo

Full Name

Relation

Father Name

Mother Name

Birth Year

Death Year (Optional)

Village

City

Occupation

About

Privacy

Public

Family Only

Private

Save Button

Cancel Button

---

# My Family

Display all members.

Each member card shows

Photo

Name

Relation

Birth Year

Village

Buttons

View

Edit

Delete

Grid layout.

---

# Member Details

Large profile image.

Information

Name

Relation

Birth Year

Death Year

Village

City

Occupation

Father Name

Mother Name

About

Privacy Badge

Edit Button (Owner Only)

---

# Search

Search by

Name

Username

Village

Family Name

Display only public information.

No private data.

---

# Public Profile

Visible

Photo

Name

Birth Year

Death Year

Village

Occupation

Public Story

Public Photos

Never show

Phone

Email

Address

Private Notes

Private Photos

Documents

Passwords

---

# Privacy

Every member has

🌍 Public

👨‍👩‍👧 Family Only

🔒 Private

Owner controls visibility.

---

# Profile

Profile Picture

Name

Username

Email

Edit Profile

Change Password

Logout

---

# Footer

Left

FAYNO

Center

About

Privacy Policy

Terms

Contact

Bottom Text

**Connecting Generations. Preserving Legacies.**

*"Your family's story deserves to live on."*

© 2026 FAYNO. All rights reserved.

---

# Database

## Users

* id
* username
* full_name
* email
* password
* profile_photo
* created_at

---

## Family Members

* id
* user_id
* photo
* full_name
* relation
* father_name
* mother_name
* birth_year
* death_year
* village
* city
* occupation
* about
* privacy
* created_at

---

# Tech Stack

Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

Backend

* Firebase Authentication
* Firestore
* Firebase Storage

Deployment

* Vercel

---

# UI Rules

Use consistent spacing.

Forms should be short.

Buttons should be obvious.

Navigation should be easy.

Cards should have thin borders.

Hover effects should be subtle.

Animation duration

150–200ms.

Do not animate every element.

Loading states must exist.

Empty states must exist.

Error messages should be clear.

Success messages should be simple.

---

# Performance

Fast loading.

Optimized images.

Responsive images.

Accessible colors.

Keyboard accessible.

SEO friendly.

Production-ready folder structure.

Reusable React components.

Clean code.

No placeholder pages.

No lorem ipsum.

No fake testimonials.

No fake download numbers.

No unnecessary marketing sections.

Everything should feel authentic.

---

# Future Features (Don't Build Yet)

* Interactive family tree
* Invite relatives
* Family collaboration
* Voice memories
* Video memories
* AI photo restoration
* Timeline
* Family documents
* QR code sharing
* Historical records
* Multi-language support
* Verification badges

---

# Final Goal

Build **FAYNO** as a clean, trustworthy, production-ready MVP that solves one simple problem well:

**Help people preserve their family history in a secure, simple, and beautiful way.**

The final result should feel like a real startup product built by humans—not an AI-generated template. It should be simple enough that anyone, including older family members, can use it comfortably, while leaving room to grow into a larger platform over time.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://family-story-keeper-51.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9ea65f41-c355-40aa-859d-41cf60ea9e69).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
