<div align="center">
  <img src="logo.png" alt="KitMint Logo" width="120" height="120" />

# KitMint

**Turn an idea into a brand in 60 seconds.**

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://kitmint.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-black?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](LICENSE)

### 🚀 Describe your startup. Get brand names, colors, copy, and a launch kit.

</div>

***

## ✨ Features

KitMint leverages AI to provide a comprehensive brand identity and launch strategy instantly.

- **🤖 AI-Powered Generation**: Instantly generate brand names, taglines, and marketing copy using Groq SDK.
- **🎨 Dynamic Color Palettes**: Get professional color schemes tailored to your startup's industry and tone.
- **🔡 Typography Pairings**: Handpicked font recommendations that match your brand's personality.
- **📝 Marketing Copy**: Ready-to-use copy for your landing page, including hero headlines and CTAs.
- **🐦 Social Media Strategy**: Automated Twitter/X thread generation to kickstart your launch.
- **🚀 Product Hunt Kit**: Optimized taglines and descriptions for your Product Hunt debut.
- **📊 Interactive Dashboard**: Manage all your generated kits, track views, and toggle privacy settings.
- **🌐 Community Gallery**: Discover and get inspired by brand kits created by the community.
- **📱 Fully Responsive**: Optimized for seamless use across mobile, tablet, and desktop devices.
- **💀 Skeleton Loading**: Smooth skeleton UI during kit generation, preventing layout shift and improving UX.

***

## 💎 Free vs. Pro

| Feature             | 🆓 Free Plan |            💎 Pro Plan           |
| :------------------ | :----------: | :------------------------------: |
| Monthly Generations |    3 Kits    |           **Unlimited**          |
| Community Gallery   |       ✅      |                 ✅                |
| Custom Dashboard    |       ✅      |                 ✅                |
| AI Logic            |   Standard   |        **Premium Models**        |
| Block Refresh       |       ❌      | **✅ Individual Section Refresh** |
| Early Access        |       ❌      |        **✅ New Features**        |

***

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **AI Engine**: [Groq SDK](https://groq.com)
- **Database**: [MongoDB](https://www.mongodb.com) with [Mongoose](https://mongoosejs.com)
- **Authentication**: [NextAuth.js](https://next-auth.js.org)
- **Components**: [Radix UI](https://www.radix-ui.com) & [Lucide Icons](https://lucide.dev)
- **Form Handling**: Client-side & Server-side validation with custom hooks

***

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB instance (local or Atlas)
- Groq API Key
- Google OAuth credentials (for social login)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/user-synax/kitmint
   cd kitmint
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```
3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GROQ_API_KEY=your_groq_api_key
   ADMIN_EMAIL=your_admin_email
   NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email
   ```
4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

Open <http://localhost:3000> with your browser to see the result.

***

## 📖 Usage

1. **Generate**: Enter a one-sentence description of your startup idea.
2. **Review**: Browse the generated brand names, colors, fonts, and marketing copy.
3. **Refine**: (Pro) Refresh individual blocks to get alternative suggestions.
4. **Publish**: Save the kit to your dashboard and optionally publish it to the community gallery.
5. **Launch**: Copy the generated social media threads and PH copy to launch your brand.

***

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

***

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

***

<div align="center">
  Built with ❤️ by the Ayush
</div>
