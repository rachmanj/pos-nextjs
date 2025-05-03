# POS Next.js with Shadcn UI

A modern Point of Sale (POS) system built with Next.js and Shadcn UI.

## Features

- Modern UI with Shadcn UI components
- Authentication with NextAuth.js
- Database with Prisma
- TypeScript support
- Responsive design
- Dark mode support

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- PostgreSQL database

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pos-next-shadcn.git
cd pos-next-shadcn
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your database and authentication settings.

4. Set up the database:

```bash
npx prisma migrate dev
```

5. Run the development server:

```bash
npm run dev
```

## Building for Production

1. Build the application:

```bash
npm run build
```

2. Copy the standalone build to a production directory (Windows):

```bash
xcopy /E /I .next\standalone build
```

3. Start the production server:

```bash
cd build
node server.js
```

## Docker Deployment

1. Build the Docker image:

```bash
docker build -t pos-next-shadcn .
```

2. Run the container:

```bash
docker run -p 3000:3000 pos-next-shadcn
```

## Project Structure

```
pos-next-shadcn/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── auth/
│   │   └── dashboard/
│   ├── components/
│   └── lib/
├── prisma/
│   └── schema.prisma
├── public/
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
