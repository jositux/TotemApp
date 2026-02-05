# 📱 TotemApp - Smart Self-Service Kiosk for Phone Accessories

[![Deployed on Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://totem-app-yourlink.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextjs&logoColor=white)](https://nextjs.org/)
[![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)](https://yarnpkg.com/)

## 📖 About the Project

**TotemApp** is an interactive self-service solution designed for retail kiosks (Totems). It allows customers to easily configure and order customized phone cases and screen protectors for a wide range of smartphone brands.

The app provides a seamless, high-touch visual experience where users can personalize their accessories in real-time before placing an order.

---

## ✨ Key Features

* **Multi-Brand Catalog**: Support for major smartphone brands (Apple, Samsung, Xiaomi, etc.).
* **Real-Time Customization**:
    * **Color Picker**: Choose from a wide palette of colors for the cases.
    * **Custom Image Upload**: Users can upload their own designs/photos to be printed on the case.
    * **Material Selection**: Options for different types of cases and premium screen protectors (tempered glass, privacy, etc.).
* **Intuitive UI for Kiosks**: Large touch-friendly elements designed specifically for physical Totem hardware.
* **Smart Preview**: Visual representation of the final product before adding it to the cart.

---

## ⚙️ Core Workflow

The application operates through a structured state machine to ensure a smooth user journey:

### 1. 📝 PROMPT State (The Configuration)
In this initial phase, the user defines the "soul" of the product:
* **Data Ingestion**: Selecting the phone model and brand.
* **Personalization**: Uploading custom images or selecting URLs for design inspiration. 
* **Validation**: The system ensures images meet quality standards and prevents duplicate entries in the order list.

### 2. 🎬 VIDEO / PREVIEW State (The Visualization)
Once the configuration is set, the system generates a high-fidelity preview:
* Users see a 3D or high-res render of their custom case.
* Final confirmation of details before proceeding to the self-checkout.

---

## 🛠 Tech Stack

* **Framework**: Next.js 16+ (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS & Shadcn UI (for a sleek, modern interface)
* **Icons**: Lucide React
* **Deployment**: Vercel

---

## 🚀 Installation & Local Development

This project uses **Yarn** as the primary package manager.

### Prerequisites
* Node.js 18.x or higher
* Yarn installed (`npm install -g yarn`)

### Steps to Run
1. **Clone the repository**
   ```bash
   git clone [https://github.com/jositux/TotemApp.git](https://github.com/jositux/TotemApp.git)
   cd TotemApp
