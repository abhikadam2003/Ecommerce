# E-Shop Frontend

A modern, responsive e-commerce frontend built with React, TypeScript, and Tailwind CSS.

## Features

- 🛍️ **Product Browsing**: Search, filter, and paginate products
- 🛒 **Shopping Cart**: Add, update, and remove items
- ❤️ **Wishlist**: Save favorite products
- 👤 **User Authentication**: Login, register, and user dashboard
- 🔐 **Role-based Access**: Separate interfaces for users and admins
- 📱 **Responsive Design**: Mobile-first approach
- 💰 **Indian Currency**: All prices displayed in ₹ (Rupees)
- 🎨 **Modern UI**: Beautiful gradients, animations, and hover effects

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack Query** for data fetching
- **React Hook Form** with Yup validation
- **Lucide React** for icons
- **React Hot Toast** for notifications

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Cart)
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # CSS and styling files
```

## Key Features

### Authentication
- User registration and login
- JWT token management
- Protected routes
- Role-based access control

### Product Management
- Product listing with search and filters
- Product detail pages
- Category filtering
- Pagination
- Stock management

### Shopping Experience
- Add to cart functionality
- Wishlist management
- Order placement
- Order history
- Responsive cart interface

### Admin Panel
- Product CRUD operations
- Category management
- Order management
- User role management

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api` with the following endpoints:

- **Auth**: `/auth/*` - Authentication endpoints
- **Products**: `/products/*` - Product management
- **Categories**: `/categories/*` - Category management
- **Cart**: `/cart/*` - Shopping cart operations
- **Orders**: `/orders/*` - Order management

## Styling

The app uses Tailwind CSS with custom configurations:

- **Primary Colors**: Blue gradient theme
- **Accent Colors**: Purple accent colors
- **Modern Shadows**: Soft shadows and glow effects
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach

## Currency

All prices are displayed in Indian Rupees (₹) using the `formatPrice` utility function.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.