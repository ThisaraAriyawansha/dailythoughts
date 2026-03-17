# DailyThoughts

A minimal open blogging platform where anyone can share their thoughts — no account required. Built with a clean, distraction-free design.

---

## How It Works

1. **Anyone can write a post** — visit `/add`, fill in a title, date, optional cover image, and description, then publish.
2. **Images are uploaded to Cloudinary** — when a cover image is selected, it's uploaded instantly via the `/api/upload` endpoint and the returned URL is stored with the post.
3. **Posts are stored in MongoDB** — each published post is saved to a MongoDB collection and displayed on the homepage in reverse chronological order.
4. **Search** — the homepage includes a live client-side search that filters posts by title or description.
5. **Admin panel** — accessible at `/admin`, protected by a session cookie. The admin can view all posts and delete any of them.

### Pages

| Route | Description |
|---|---|
| `/` | Homepage — lists all posts with search |
| `/add` | Public post creation form with live preview |
| `/blog/[id]` | Individual post view |
| `/admin` | Admin dashboard — manage and delete posts |
| `/admin/login` | Admin login page |

### API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/blogs` | `GET` | List all blogs |
| `/api/blogs` | `POST` | Create a new blog post |
| `/api/blogs/[id]` | `DELETE` | Delete a post by ID |
| `/api/upload` | `POST` | Upload a cover image to Cloudinary |
| `/api/admin/login` | `POST` | Admin login (sets session cookie) |
| `/api/admin/logout` | `POST` | Admin logout (clears session cookie) |
| `/api/admin/check` | `GET` | Check if admin session is valid |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org) | React framework (Pages Router, SSR, API routes) |
| [React 19](https://react.dev) | UI library |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first styling |
| [MongoDB](https://www.mongodb.com) | Database for storing blog posts |
| [Cloudinary](https://cloudinary.com) | Cloud image storage and delivery |
| [Formidable](https://github.com/node-formidable/formidable) | Multipart form / file upload parsing |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB connection string
- A Cloudinary account

### Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_PASSWORD=your_admin_password
```

### Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Deployment

The easiest way to deploy is via [Vercel](https://vercel.com). Connect your repository and add the environment variables in the Vercel dashboard.
