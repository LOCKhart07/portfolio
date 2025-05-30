## 🌟 Jenslee Dsouza's Netflix Inspired Portfolio 🌟 - [Visit](https://portfolio.lockhart.in/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/58584fb9-48fb-4155-b000-bb3c76f7a443/deploy-status)](https://app.netlify.com/sites/portfolio-jenslee/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Welcome to my personal portfolio project! 🚀 This website showcases my work, skills, and experiences in web development. It's designed to be lightweight, customizable, and professional while maintaining an approachable style.

![Screenshot from 2024-12-08 19-19-06](https://github.com/user-attachments/assets/f8220485-16ec-48cf-8cb2-7853540c5724)
 
---

## ✨ Features

- 🌍 **Dynamic Content**: Powered by [DatoCMS](https://www.datocms.com) for easy content management
- ⚡ **Fast & Responsive**: Built with modern web technologies for seamless performance
- 🎨 **Customizable**: Modular and easy to adapt to your own needs
- 📈 **Professional Yet Personal**: Highlights projects, skills, and achievements
- 🔒 **Privacy-Focused**: GDPR-compliant analytics with user consent management
- ♿ **Accessibility**: Follows WCAG guidelines with semantic HTML and ARIA attributes
- 📊 **Analytics**: Google Analytics 4 integration with privacy-first approach

---

## 🛠️ Tech Stack

This portfolio is built with love and:

- ⚛️ **React** (Frontend)
- 🌐 **Netlify** (Hosting and CDN)
- 🛡️ **DatoCMS** (Content Management)
- 📊 **Google Analytics 4** (Privacy-focused analytics)
- 🎵 **Spotify API** (Music Integration)

---

## 🔒 Privacy Features

The portfolio includes several privacy-focused features:

- **Consent Management**: Users can opt-in/out of analytics
- **GDPR Compliance**: Analytics are disabled by default
- **Data Minimization**: Only essential data is collected
- **Transparent Controls**: Clear consent banner with easy opt-out
- **Local Storage**: User preferences are remembered

---

## ⚡ Performance Optimizations

Recent performance improvements include:

- **Optimized Icon Loading**: Efficient icon management system
- **Lazy Loading**: Images and components load on demand
- **Memoization**: Prevents unnecessary re-renders
- **Accessibility**: Semantic HTML and keyboard navigation
- **Event Tracking**: Efficient user interaction monitoring

---

## 📚 Getting Started

Want to set this up locally? Follow these steps:

1. **Clone the Repository**: Copy the repository to your local system.

2. **Install Dependencies**: Use a package manager to install the required dependencies.
```bash
nvm install 18
nvm use 18
```

After upgrading Node.js, clear your node_modules and reinstall:
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

3. **Set Up DatoCMS**:
   - Create a [DatoCMS account](https://www.datocms.com/)
   - Create a new project
   - Set up the following models:
     - `ProfileBanner`: headline (text), backgroundImage (image), resumeLink (file), linkedinLink (text), profileSummary (text)
     - `WorkPermit`: visaStatus (text), expiryDate (date), summary (text), additionalInfo (text)
     - `Timeline`: timelineType (enum: work/education), name (text), title (text), techStack (text), summaryPoints (text), dateRange (text)
     - `Project`: title (text), description (text), techUsed (text), image (image), link (text)
     - `Award`: title (text), issuer (text), date (date), description (text), image (image), link (text), category (enum: professional/education/other)
     - `Certification`: title (text), issuer (text), issuedDate (text), link (text), iconName (text)
     - `ContactMe`: profilePicture (image), name (text), title (text), summary (text), companyUniversity (text), linkedinLink (text), email (text), phoneNumber (text)
     - `Skill`: name (text), category (text), description (text), icon (text)
   - Generate an API token in Settings > API tokens
   - Copy the API token for the next step

4. **Configure Environment Variables**: Create a `.env` file and set up the necessary API keys and configurations:
```env
REACT_APP_GA_TRACKING_ID=your_ga4_id
REACT_APP_DATOCMS_API_TOKEN=your_datocms_token
REACT_APP_SPOTIFY_STATS_API_KEY=your_spotify_api_key
```

5. **Run the Project**: Start the development server.
```bash
npm start
```

6. **Visit the Local Server**: Open your browser and navigate to `http://localhost:3000`.

7. **Deploy to Netlify**:
   - Create a Netlify account and connect your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Set up environment variables in Netlify dashboard
   - Configure custom domain if needed

---

## 🤝 Contribution Guidelines

Contributions are welcome and appreciated! 🥳 To contribute:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Commit your changes with a descriptive message.
4. Push your changes to your branch.
5. Open a Pull Request. 🎉

---

## 🐛 Issues and Feature Requests

Found a bug? Have a feature in mind? 🤔 Feel free to raise an issue or suggest a feature!

1. Go to the **Issues** tab in the repository.
2. Click **New Issue**.
3. Provide a clear description of the bug or feature request.
4. If applicable, include screenshots or steps to reproduce the issue.

Your feedback is valuable and helps make this project better for everyone. Thank you for contributing!

---
## 🌟 Acknowledgments

- This project is forked from [Sumanth Samala's Netflix Portfolio](https://github.com/SamalaSumanth0262/netflix_portfolio).
- Thanks to [DatoCMS](https://www.datocms.com) for powering the dynamic content.
- Inspired by countless developers in the open-source community. 💻
- Special shoutout to all contributors—you rock! 🤘

---

## 📧 Contact Me

- 💼 [Portfolio Website](https://portfolio.lockhart.in)
- 📧 [dsouzajenslee@gmail.com](mailto:dsouzajenslee@example.com)
- 🔗 [LinkedIn](https://www.linkedin.com/in/jensleedsouza/)

---

## 📜 License

This project is licensed under the MIT License. Feel free to use it, modify it, and share it! 🌈

---
