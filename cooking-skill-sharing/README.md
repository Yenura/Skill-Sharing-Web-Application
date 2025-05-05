# Cooking Skill-Sharing Platform

A modern web application for sharing recipes, joining cooking communities, and tracking your culinary journey.

## Features

- **Recipe Sharing**: Share your recipes with detailed instructions, ingredients, and photos
- **Community Building**: Join cooking communities based on cuisines, dietary preferences, and more
- **Search & Filter**: Find recipes using advanced filters for cooking methods, difficulty, and dietary restrictions
- **User Profiles**: Showcase your cooking journey, achievements, and favorite recipes
- **Social Interaction**: Like, comment, and follow other users and their recipes

## Tech Stack

- **Frontend**: Next.js 13 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Form Handling**: React Hook Form
- **State Management**: React Query
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cooking-skill-sharing.git
   cd cooking-skill-sharing
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
cooking-skill-sharing/
├── src/
│   ├── app/                 # Next.js 13 app directory
│   │   ├── page.tsx        # Home page
│   │   ├── profile/        # Profile page
│   │   ├── search/         # Search page
│   │   └── upload/         # Recipe upload page
│   ├── components/         # React components
│   │   ├── Navigation/     # Navigation components
│   │   ├── Recipe/         # Recipe-related components
│   │   ├── Profile/        # Profile-related components
│   │   ├── Search/         # Search-related components
│   │   └── Home/           # Home page components
│   └── styles/             # Global styles
├── public/                 # Static files
└── package.json           # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.dev/)
- [Heroicons](https://heroicons.com/)
- [React Hook Form](https://react-hook-form.com/)
- [React Query](https://react-query.tanstack.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Hot Toast](https://react-hot-toast.com/)
