# Shishir Kandel - Portfolio Website

A professional portfolio website built with React, Node.js, and PostgreSQL featuring an admin dashboard for content management.

## Features

- **Modern Portfolio Design**: Clean, responsive design showcasing projects and skills
- **Admin Dashboard**: Complete content management system
- **Career Roadmap**: Interactive career path guidance
- **Contact Management**: Contact form with admin review system
- **Password Reset**: Secure OTP-based password recovery
- **Dark/Light Theme**: Toggle between themes
- **Responsive Design**: Works perfectly on all devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Email**: SendGrid for transactional emails
- **Authentication**: Secure session-based auth

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- SendGrid API key (for email functionality)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio-website.git
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Fill in your database URL and SendGrid API key.

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

## Deployment

This project is configured for easy deployment on Vercel with PostgreSQL.

### Environment Variables Required:
- `DATABASE_URL`: PostgreSQL connection string
- `SENDGRID_API_KEY`: SendGrid API key for emails

## Admin Access

- **Email**: shishirxkandel@gmail.com
- **Default Password**: password (change after first login)

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and schemas
└── package.json     # Dependencies and scripts
```

## Contributing

Feel free to fork this project and customize it for your own portfolio!

## License

MIT License - feel free to use this for your own portfolio.