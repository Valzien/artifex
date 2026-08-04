# Artifex

Platform marketplace digital yang mempertemukan client dengan freelancer untuk menjual berbagai layanan digital. Dibangun dengan arsitektur profesional, scalable, dan production-ready.

---

## Tech Stack

### Frontend

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | 19.2 | UI Framework |
| Vite | 8.1 | Build Tool & Dev Server |
| React Router DOM | 7.18 | Client-side Routing |
| Tailwind CSS | 3.4 | Styling |
| shadcn/ui | - | Component Library (pattern) |
| Axios | 1.18 | HTTP Client |
| Zustand | 5.0 | State Management |
| React Hook Form | 7.83 | Form Management |
| Zod | 4.4 | Schema Validation |
| Framer Motion | 12.42 | Animation |
| Lucide React | 1.27 | Icon Library |
| CVA | 0.7 | Component Variants |

### Backend

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Laravel | 13.8 | REST API Framework |
| Sanctum | 4.3 | Authentication (Bearer Token) |
| Eloquent ORM | - | Database |
| MySQL | 8.4 | Database (dev & production) |

---

## Role System

| Role | Deskripsi |
|------|-----------|
| Guest | Pengunjung yang belum login |
| Client | Pengguna yang mencari jasa freelancer |
| Freelancer | Penyedia layanan jasa digital |
| Admin | Pengelola platform |

---

## Fitur

### Guest

- [x] Landing Page
- [x] Explore Services
- [x] Categories
- [x] Freelancer List
- [x] Freelancer Profile
- [ ] Portfolio
- [x] Service Detail
- [x] Search
- [x] Login (real API + form validation)
- [x] Register (real API + role selection)
- [x] Become Freelancer
- [x] FAQ
- [x] About
- [x] Contact

### Client

- [x] Dashboard
- [x] Riwayat Transaksi
- [x] Cari Jasa
- [x] Filter
- [x] Search
- [x] Chat (Chat page)
- [x] Checkout (Checkout page)
- [x] Pembayaran (Midtrans mock)
- [x] Status Pesanan (Orders page)
- [x] Riwayat Pesanan (Orders + OrderDetail)
- [x] Favorite (Favorites page)
- [ ] Follow Freelancer
- [ ] Review
- [x] Edit Profil (Profile page)
- [x] Notifikasi (Notifications page)
- [x] Pengaturan (Settings page)
- [x] Cart (Cart page)
- [x] Product Checkout (ProductCheckout page)

### Freelancer

- [x] Dashboard
- [x] Kelola Profil
- [x] Kelola Portfolio
- [x] Kelola Jasa
- [x] Terima/Tolak Order
- [x] Chat Client
- [ ] Upload Progress
- [ ] Upload File Final
- [x] Analytics
- [x] Pendapatan
- [x] Withdraw
- [x] Review

### Admin

- [x] Dashboard (API ready, frontend in progress)
- [x] Kelola User (API ready, frontend in progress)
- [ ] Kelola Freelancer (frontend)
- [x] Kelola Jasa (API ready, frontend in progress)
- [ ] Kelola Kategori (frontend)
- [x] Kelola Order (API ready, frontend in progress)
- [ ] Kelola Pembayaran (frontend)
- [ ] Kelola Withdraw (frontend)
- [ ] Kelola FAQ (frontend)
- [ ] Laporan (frontend)

---

## Halaman

### Guest

| Halaman | Route | Status |
|---------|-------|--------|
| Home | `/` | ✅ Done |
| Explore Services | `/explore` | ✅ Done |
| Categories | `/categories` | ✅ Done |
| Service Detail | `/service/:id` | ✅ Done |
| Freelancer List | `/freelancers` | ✅ Done |
| Freelancer Detail | `/freelancer/:id` | ✅ Done |
| Portfolio | `/portfolio` | ❌ Not Started |
| Portfolio Detail | `/portfolio/:id` | ❌ Not Started |
| About | `/about` | ✅ Done |
| FAQ | `/faq` | ✅ Done |
| Contact | `/contact` | ✅ Done |
| Login | `/login` | ✅ Done |
| Register | `/register` | ✅ Done |
| Become Freelancer | `/become-freelancer` | ✅ Done |
| Explore Products | `/explore-products` | ✅ Done |
| Product Detail | `/product/:id` | ✅ Done |

### Client

| Halaman | Route | Status |
|---------|-------|--------|
| Dashboard | `/client/dashboard` | ✅ Done |
| Orders | `/client/orders` | ✅ Done |
| Order Detail | `/client/orders/:id` | ✅ Done |
| Riwayat | `/client/riwayat` | ✅ Done |
| Favorites | `/client/favorites` | ✅ Done |
| Profile | `/client/profile` | ✅ Done |
| Chat | `/client/chat` | ✅ Done |
| Notifications | `/client/notifications` | ✅ Done |
| Settings | `/client/settings` | ✅ Done |
| Checkout | `/client/checkout/:serviceId` | ✅ Done |
| Cart | `/client/cart` | ✅ Done |
| Product Checkout | `/client/product-checkout/:productId` | ✅ Done |

### Freelancer

| Halaman | Route | Status |
|---------|-------|--------|
| Dashboard | `/freelancer/dashboard` | ✅ Done |
| My Services | `/freelancer/services` | ✅ Done |
| Portfolio | `/freelancer/portfolio` | ✅ Done |
| Orders | `/freelancer/orders` | ✅ Done |
| Chat | `/freelancer/chat` | ✅ Done |
| Earnings | `/freelancer/earnings` | ✅ Done |
| Withdraw | `/freelancer/withdraw` | ✅ Done |
| Reviews | `/freelancer/reviews` | ✅ Done |
| Analytics | `/freelancer/analytics` | ✅ Done |
| Settings | `/freelancer/settings` | ✅ Done |
| Products | `/freelancer/products` | ✅ Done |

### Admin

| Halaman | Route | Status |
|---------|-------|--------|
| Dashboard | `/admin/dashboard` | ✅ Done |
| User Management | `/admin/users` | ✅ Done |
| Service Management | `/admin/services` | ✅ Done |
| Order Management | `/admin/orders` | ✅ Done |
| Analytics | `/admin/analytics` | ✅ Done |
| Freelancer Management | `/admin/freelancers` | ❌ Not Started |
| Category Management | `/admin/categories` | ❌ Not Started |
| Transaction Management | `/admin/transactions` | ❌ Not Started |
| Withdraw Management | `/admin/withdrawals` | ❌ Not Started |
| FAQ Management | `/admin/faqs` | ❌ Not Started |
| Reports | `/admin/reports` | ❌ Not Started |

---

## Reusable Components

### UI Primitives

| Component | File | Status |
|-----------|------|--------|
| Button | `components/ui/Button.jsx` | ✅ Done |
| Badge | `components/ui/Badge.jsx` | ✅ Done |
| Card | `components/ui/Card.jsx` | ✅ Done |
| Input | `components/ui/Input.jsx` | ✅ Done |
| Textarea | `components/ui/Textarea.jsx` | ✅ Done |
| Avatar | `components/ui/Avatar.jsx` | ❌ Not Started |
| Pagination | `components/shared/Pagination.jsx` | ✅ Done |
| Dropdown | `components/shared/Dropdown.jsx` | ✅ Done |
| Dialog | `components/shared/Dialog.jsx` | ✅ Done |
| Toast | `components/shared/Toast.jsx` | ✅ Done |
| Skeleton | `components/ui/Skeleton.jsx` | ✅ Done |
| Loader | `components/ui/Loader.jsx` | ❌ Not Started |

### Shared Components

| Component | File | Status |
|-----------|------|--------|
| Navbar | `components/shared/Navbar.jsx` | ✅ Done |
| Sidebar | `components/shared/DashboardSidebar.jsx` | ✅ Done |
| Topbar | `components/shared/DashboardTopbar.jsx` | ✅ Done |
| ProtectedRoute | `components/shared/ProtectedRoute.jsx` | ✅ Done |
| Footer | `components/shared/Footer.jsx` | ✅ Done |
| ServiceCard | `components/shared/ServiceCard.jsx` | ✅ Done |
| FreelancerCard | `components/shared/FreelancerCard.jsx` | ✅ Done |
| CategoryCard | `components/shared/CategoryCard.jsx` | ✅ Done |
| StatCard | `components/shared/StatCard.jsx` | ✅ Done |
| EmptyState | `components/shared/EmptyState.jsx` | ✅ Done |
| StarRating | `components/shared/StarRating.jsx` | ✅ Done |
| TransactionRow | `components/shared/TransactionRow.jsx` | ✅ Done |
| ReviewCard | `components/shared/ReviewCard.jsx` | ✅ Done |
| TabBar | `components/shared/TabBar.jsx` | ✅ Done |
| SearchInput | `components/shared/SearchInput.jsx` | ✅ Done |
| Pagination | `components/shared/Pagination.jsx` | ✅ Done |
| Dropdown | `components/shared/Dropdown.jsx` | ✅ Done |
| Dialog | `components/shared/Dialog.jsx` | ✅ Done |
| Toast | `components/shared/Toast.jsx` | ✅ Done |

---

## Project Structure

```
src/
├── assets/                    # Static assets
│   ├── hero.png
│   └── icons/
│
├── components/
│   ├── ui/                    # Reusable UI primitives
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Skeleton.jsx
│   │   └── Textarea.jsx
│   │
│   └── shared/                # Shared application components
│       ├── Navbar.jsx
│       ├── Footer.jsx
│       ├── DashboardSidebar.jsx
│       ├── DashboardTopbar.jsx
│       ├── ProtectedRoute.jsx
│       ├── ServiceCard.jsx
│       ├── FreelancerCard.jsx
│       ├── CategoryCard.jsx
│       ├── StatCard.jsx
│       ├── EmptyState.jsx
│       ├── StarRating.jsx
│       ├── TransactionRow.jsx
│       ├── ReviewCard.jsx
│       ├── TabBar.jsx
│       ├── SearchInput.jsx
│       ├── Pagination.jsx
│       ├── Dropdown.jsx
│       ├── Dialog.jsx
│       └── Toast.jsx
│
├── constants/                 # Application constants
│   ├── menuItems.js
│   └── orderStatus.js
│
├── contexts/                  # React contexts
│
├── hooks/                     # Custom hooks
│
├── layouts/                   # Layout wrappers
│   ├── GuestLayout.jsx
│   ├── ClientLayout.jsx
│   ├── FreelancerLayout.jsx
│   └── AdminLayout.jsx
│
├── lib/                       # Utility functions
│   ├── axios.js               # Axios instance (Sanctum token, 401 handler)
│   └── utils.js
│
├── pages/                     # Page components
│   ├── NotFound.jsx
│   ├── guest/
│   │   ├── Home.jsx
│   │   ├── ExploreServices.jsx
│   │   ├── Categories.jsx
│   │   ├── ServiceDetail.jsx
│   │   ├── FreelancerList.jsx
│   │   ├── FreelancerDetail.jsx
│   │   ├── About.jsx
│   │   ├── FAQ.jsx
│   │   ├── Contact.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── BecomeFreelancer.jsx
│   ├── client/
│   │   ├── Dashboard.jsx
│   │   ├── Orders.jsx
│   │   ├── OrderDetail.jsx
│   │   ├── Riwayat.jsx
│   │   ├── Profile.jsx
│   │   ├── Favorites.jsx
│   │   ├── Settings.jsx
│   │   ├── Notifications.jsx
│   │   ├── Chat.jsx
│   │   └── Checkout.jsx
│   ├── freelancer/
│   │   ├── Dashboard.jsx
│   │   ├── MyServices.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Orders.jsx
│   │   ├── FChat.jsx
│   │   ├── Earnings.jsx
│   │   ├── Withdraw.jsx
│   │   ├── Reviews.jsx
│   │   ├── Analytics.jsx
│   │   └── FSettings.jsx
│   └── admin/
│       └── (TBD — API ready, frontend in progress)
│
├── routes/                    # Route definitions
│   ├── index.jsx
│   ├── guestRoutes.jsx
│   ├── clientRoutes.jsx
│   ├── freelancerRoutes.jsx
│   └── adminRoutes.jsx
│
├── services/                  # API service layer
│   └── api/
│       ├── categories.js      # GET /api/categories
│       ├── services.js        # GET /api/services
│       ├── freelancers.js     # GET /api/freelancers
│       ├── faq.js             # GET /api/faq
│       ├── dashboard.js       # GET /api/client/dashboard
│       ├── orders.js          # GET /api/client/orders
│       ├── profile.js         # GET/PUT /api/client/profile
│       ├── favorites.js       # GET/POST /api/client/favorites
│       ├── notifications.js   # GET/PUT /api/client/notifications
│       ├── chat.js            # GET/POST /api/client/chat
│       ├── checkout.js        # GET/POST /api/client/checkout
│       ├── clientTransactions.js
│       ├── freelancerDashboard.js
│       ├── freelancerServices.js
│       ├── freelancerPortfolio.js
│       ├── freelancerOrders.js
│       ├── freelancerEarnings.js
│       ├── freelancerReviews.js
│       ├── freelancerAnalytics.js
│       └── freelancerChat.js
│
├── store/                     # Zustand stores
│   └── useAuthStore.js
│
├── App.jsx                    # Root component
├── main.jsx                   # Entry point
└── index.css                  # Global styles
```

---

## Design System

### Warna

| Token | Hex | Deskripsi |
|-------|-----|-----------|
| Primary | `#EBCFD0` | Bone - Warna utama (CTA, link, badge) |
| Secondary | `#C25E7E` | Velvet Rose - Warna sekunder |
| Accent | `#E8B4C0` | Soft Rose - Warna aksen |
| Background | `#1A1919` | Carbon Black - Background page |
| Surface | `#2A1D24` | Dark Rose - Background card/surface |
| Border | `#44303A` | Muted Rose - Border color |
| Ink | `#EBCFD0` | Bone - Text color |

### Background Gradient (VelvetFade)

Body memakai gradient diagonal velvet yang tersusun dari 3 zona warna:

```
Carbon Black #1A1919 → Amaranth #6E1E3B → Bone #EBCFD0
```

Definisi di `src/index.css` (token warna disimpan sebagai HSL variables, dipetakan lewat `tailwind.config.js`).

### Glass Effect

Search bar (hero Home & `SearchInput`) memakai efek glassmorphism:
`bg-white/10` + `backdrop-blur-xl` + border putih tipis.

### Font

- **Family:** Inter
- **Weights:** 400, 500, 600, 700

### Icon

- **Library:** Lucide React
- **Style:** Outline, 24px default

### Design Principles

- Minimalis & Premium
- Banyak whitespace
- Rounded corners (`0.75rem` default)
- Soft shadow (`box-shadow: soft`)
- Smooth animation (Framer Motion)
- Clean typography
- Responsive (mobile-first)
- Accessible

---

## Service Layer & Backend Integration

### Arsitektur Data Flow

```
Page Component → Service Layer → Axios → Laravel API
     ↓                ↓              ↓
   useState      Promise (async)  api.get/post
   setLoading    → getServices()  → /api/services
   setServices   → getFreelancers() → /api/freelancers
```

**Status:** Mock data removed. All 30 service files now use real Laravel API via Axios.

### Struktur Service Layer

```
src/services/api/
├── categories.js              # GET /api/categories
├── services.js                # GET /api/services
├── products.js                # GET /api/products
├── freelancers.js             # GET /api/freelancers
├── faq.js                     # GET /api/faq
├── cart.js                    # GET/POST/DELETE /api/client/cart
├── dashboard.js               # GET /api/client/dashboard
├── orders.js                  # GET /api/client/orders
├── profile.js                 # GET/PUT /api/client/profile
├── clientSettings.js          # PUT /api/client/settings
├── favorites.js               # GET/POST /api/client/favorites
├── notifications.js           # GET/PUT /api/client/notifications
├── chat.js                    # GET/POST /api/client/chat
├── checkout.js                # GET/POST /api/client/checkout
├── clientTransactions.js      # GET /api/client/transactions
├── freelancerDashboard.js     # GET /api/freelancer/dashboard
├── freelancerServices.js      # CRUD /api/freelancer/services
├── freelancerProducts.js      # CRUD /api/freelancer/products
├── freelancerPortfolio.js     # CRUD /api/freelancer/portfolio
├── freelancerOrders.js        # GET/PUT /api/freelancer/orders
├── freelancerEarnings.js      # GET /api/freelancer/earnings
├── freelancerReviews.js       # GET /api/freelancer/reviews
├── freelancerAnalytics.js     # GET /api/freelancer/analytics
├── freelancerChat.js          # GET/POST /api/freelancer/chat
├── freelancerSettings.js      # PUT /api/freelancer/settings
├── adminDashboard.js          # GET /api/admin/dashboard
├── adminUsers.js              # CRUD /api/admin/users
├── adminServices.js           # GET/PUT /api/admin/services
├── adminOrders.js             # GET/PUT /api/admin/orders
└── adminAnalytics.js          # GET /api/admin/analytics
```

### API Methods (Signatures)

Semua function return `Promise` supaya kompatibel dengan async/await.

#### `services.js`

```js
// Get all services with optional filters
getServices({ category?, search?, sort? }) → Promise<Service[]>

// Get single service by ID
getServiceById(id) → Promise<Service | null>

// Get full service detail (with packages, description, freelancer info)
getServiceDetail(id) → Promise<ServiceDetail | null>
```

#### `freelancers.js`

```js
// Get all freelancers with optional filters
getFreelancers({ specialty?, search? }) → Promise<Freelancer[]>

// Get full freelancer profile (with services, portfolio, reviews)
getFreelancerById(id) → Promise<FreelancerDetail | null>
```

#### `orders.js`

```js
// Get all orders with optional status filter
getOrders({ status? }) → Promise<Order[]>

// Get single order by ID
getOrderById(id) → Promise<Order | null>
```

#### `dashboard.js`

```js
// Get dashboard data (stats, recent orders, recommendations)
getDashboard() → Promise<Dashboard>
```

#### `favorites.js`

```js
// Get all favorited services
getFavorites() → Promise<Service[]>

// Toggle favorite status for a service
toggleFavorite(serviceId) → Promise<{ isFavorite: boolean }>
```

#### `profile.js`

```js
// Get client profile
getProfile() → Promise<Profile>

// Update client profile
updateProfile(fields) → Promise<Profile>
```

#### `notifications.js`

```js
// Get all notifications
getNotifications() → Promise<Notification[]>

// Mark single notification as read
markAsRead(id) → Promise<void>

// Mark all notifications as read
markAllAsRead() → Promise<void>
```

#### `chat.js`

```js
// Get all conversations
getConversations() → Promise<Conversation[]>

// Get messages for a conversation
getMessages(conversationId) → Promise<Message[]>

// Send a message
sendMessage(conversationId, content) → Promise<Message>
```

#### `checkout.js`

```js
// Get available payment methods
getPaymentMethods() → Promise<PaymentMethod[]>

// Create a new order and get payment redirect
createOrder({ serviceId, packageType, paymentMethod }) → Promise<{ orderId, redirectUrl }>
```

#### `clientTransactions.js`

```js
// Get all client transactions
getClientTransactions() → Promise<ClientTransactions>
```

#### `freelancerDashboard.js`

```js
// Get freelancer dashboard data
getFreelancerDashboard() → Promise<FreelancerDashboard>
```

#### `freelancerServices.js`

```js
// Get all freelancer services
getFreelancerServices() → Promise<FreelancerService[]>

// Add a new service
addFreelancerService(service) → Promise<FreelancerService>

// Update service fields
updateFreelancerService(id, fields) → Promise<FreelancerService | null>

// Delete a service
deleteFreelancerService(id) → Promise<void>
```

#### `freelancerPortfolio.js`

```js
// Get portfolio items
getPortfolioItems() → Promise<PortfolioItem[]>

// Add a portfolio item
addPortfolioItem(item) → Promise<PortfolioItem>

// Delete a portfolio item
deletePortfolioItem(id) → Promise<void>
```

#### `freelancerOrders.js`

```js
// Get freelancer orders with optional status filter
getFreelancerOrders({ status? }) → Promise<FreelancerOrder[]>

// Get order by ID
getFreelancerOrderById(id) → Promise<FreelancerOrder | null>

// Update order status (accept/reject/complete)
updateOrderStatus(id, status) → Promise<FreelancerOrder | null>
```

#### `freelancerEarnings.js`

```js
// Get earnings data
getFreelancerEarnings() → Promise<Earnings>

// Request a withdrawal
requestWithdraw(amount) → Promise<{ success: boolean }>
```

#### `freelancerReviews.js`

```js
// Get all reviews from clients
getFreelancerReviews() → Promise<Review[]>
```

#### `freelancerAnalytics.js`

```js
// Get analytics data
getFreelancerAnalytics() → Promise<Analytics>
```

#### `categories.js`

```js
// Get all categories
getCategories() → Promise<Category[]>

// Get single category by slug
getCategoryBySlug(slug) → Promise<Category | null>
```

#### `faq.js`

```js
// Get all FAQ grouped by category
getFaq() → Promise<FaqSection[]>
```

### Data Models (Shape Data)

Saat integrasi backend, pastikan response API mengikuti shape data ini:

#### Service

```js
{
  id: Number,
  title: String,
  category: String,           // nama kategori
  freelancer: {
    id: Number,
    name: String,
    rating: Number,
    reviews: Number
  },
  price: Number,              // dalam Rupiah
  image: String | null,
  tags: String[],
  deliveryDays: Number
}
```

#### ServiceDetail (extends Service)

```js
{
  ...Service,
  description: String,        // deskripsi lengkap (whitespace-pre-line)
  packages: [
    {
      name: String,           // "Basic" | "Standard" | "Premium"
      price: Number,
      description: String,
      deliveryDays: Number,
      popular: Boolean,       // optional
      features: String[]
    }
  ],
  freelancer: {
    id: Number,
    name: String,
    avatar: String | null,
    rating: Number,
    reviews: Number,
    completedOrders: Number,
    responseTime: String,
    location: String,
    memberSince: String,
    bio: String
  },
  images: (String | null)[]   // max 4
}
```

#### Freelancer

```js
{
  id: Number,
  name: String,
  specialty: String,
  rating: Number,
  reviews: Number,
  completedOrders: Number,
  location: String,
  bio: String,
  skills: String[],
  isOnline: Boolean
}
```

#### FreelancerDetail (extends Freelancer)

```js
{
  ...Freelancer,
  languages: String[],
  responseTime: String,
  lastDelivery: String,
  memberSince: String,
  repeatClients: Number,      // persentase
  services: [
    {
      id: Number,
      title: String,
      price: Number,
      rating: Number,
      reviews: Number,
      category: String
    }
  ],
  portfolio: [
    {
      id: Number,
      title: String,
      image: String | null
    }
  ],
  reviews: [
    {
      id: Number,
      user: String,
      service: String,
      rating: Number,
      date: String,
      comment: String
    }
  ]
}
```

#### Order

```js
{
  id: String,                   // "ORD-1001"
  serviceName: String,
  freelancer: {
    id: Number,
    name: String,
    avatar: String              // initial letter
  },
  category: String,
  price: Number,                // dalam Rupiah
  status: "pending" | "in_progress" | "completed" | "cancelled",
  createdAt: String,            // ISO date
  deadline: String              // ISO date
}
```

#### Dashboard

```js
{
  stats: {
    totalOrders: Number,
    activeOrders: Number,
    completedOrders: Number
  },
  recentOrders: Order[],        // 3 terbaru
  recommendations: Service[]    // 2 rekomendasi
}
```

#### Profile

```js
{
  name: String,
  email: String,
  phone: String,
  location: String,
  bio: String,
  skills: String[],
  memberSince: String,          // ISO date
  avatar: String | null,
  stats: {
    totalOrders: Number,
    activeOrders: Number,
    completedOrders: Number
  }
}
```

#### Category

```js
{
  name: String,               // "Graphic Design"
  slug: String,               // "graphic-design"
  description: String,
  icon: String,               // emoji
  serviceCount: Number
}
```

#### FaqSection

```js
{
  category: String,           // "Umum" | "Untuk Klien" | "Untuk Freelancer"
  items: [
    {
      question: String,
      answer: String
    }
  ]
}
```

#### Notification

```js
{
  id: Number,
  type: "order_update" | "payment" | "message" | "system",
  title: String,
  message: String,
  read: Boolean,
  createdAt: String,          // ISO datetime
  link: String                // route path
}
```

#### Conversation

```js
{
  id: String,                 // "conv-1"
  freelancer: {
    id: Number,
    name: String,
    avatar: String,
    isOnline: Boolean
  },
  lastMessage: String,
  unread: Number,
  updatedAt: String,          // ISO datetime
  orderId: String
}
```

#### Message

```js
{
  id: String,
  sender: "client" | "freelancer",
  content: String,
  createdAt: String           // ISO datetime
}
```

#### FreelancerDashboard

```js
{
  stats: {
    totalOrders: Number,
    activeOrders: Number,
    completedOrders: Number,
    rating: Number,
    reviewCount: Number
  },
  recentOrders: FreelancerOrder[],
  topServices: [{ name, orders, revenue }]
}
```

#### FreelancerService

```js
{
  id: Number,
  title: String,
  category: String,
  price: Number,
  status: "active" | "draft",
  orders: Number,
  rating: Number,
  reviews: Number,
  deliveryDays: Number,
  createdAt: String
}
```

#### PortfolioItem

```js
{
  id: String,
  title: String,
  description: String,
  category: String,
  image: String | null,
  createdAt: String
}
```

#### FreelancerOrder

```js
{
  id: String,
  clientName: String,
  clientAvatar: String,
  serviceName: String,
  package: String,
  price: Number,
  status: "pending" | "in_progress" | "completed" | "cancelled",
  createdAt: String,
  deadline: String,
  message: String
}
```

#### Earnings

```js
{
  stats: {
    totalEarned: Number,
    pending: Number,
    available: Number,
    withdrawn: Number
  },
  transactions: Transaction[]
}

Transaction: {
  id: String,
  description: String,
  amount: Number,
  type: "income" | "withdrawal",
  status: "pending" | "completed",
  date: String
}
```

#### Review

```js
{
  id: String,
  clientName: String,
  clientAvatar: String,
  serviceName: String,
  rating: Number,              // 1-5
  comment: String,
  date: String
}
```

#### Analytics

```js
{
  ordersByMonth: [{ month, count }],
  earningsByMonth: [{ month, amount }],
  topCategories: [{ name, percentage }],
  conversionRate: Number,
  averageRating: Number,
  repeatClientRate: Number
}
```

#### ClientTransactions

```js
{
  stats: {
    totalSpent: Number,
    totalOrders: Number,
    pending: Number
  },
  transactions: Transaction[]
}

Transaction: {
  id: String,
  orderId: String,
  description: String,
  amount: Number,
  type: "payment" | "refund",
  status: "pending" | "completed",
  date: String
}
```

### Cara Integrasi Backend (DONE ✅)

#### Step 1: Axios Instance — `src/lib/axios.js` ✅

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Request interceptor — attach Sanctum token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — redirect on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### Step 2: Environment Variables — `.env` ✅

```env
VITE_API_URL=http://localhost:8000/api
```

#### Step 3: Service Files — Mock → API ✅

All 19 service files now use `import api from "@/lib/axios"` and make real HTTP requests. The `mock/` folder has been removed.

### Hal yang Perlu Disesuaikan dengan Backend

| Aspek | Status | Detail |
|-------|--------|--------|
| Base URL | ✅ Done | `VITE_API_URL` env variable |
| Auth Token | ✅ Done | Sanctum Bearer token via localStorage |
| Response Shape | ✅ Done | `data.data` unwrapping, camelCase keys, nested objects |
| CSRF Protection | ✅ Done | Disabled `statefulApi()` for cross-origin Bearer auth |
| Error Handling | ✅ Done | Axios interceptor + page-level try/catch |
| Loading State | ✅ Done | Sudah ada di semua page |
| Filtering | ✅ Done | Server-side via query params |
| Search | ✅ Done | Server-side via query params |
| Sorting | ✅ Done | Server-side via query params |
| Pagination | 🔜 | Belum ditambahkan |

### Pagination (Future)

Saat backend ready, tambahkan support pagination:

```js
// Service layer
export async function getServices({ page = 1, perPage = 12, ...filters } = {}) {
  const { data } = await api.get("/services", {
    params: { page, per_page: perPage, ...filters },
  });
  return {
    data: data.data,
    meta: {
      current_page: data.meta.current_page,
      last_page: data.meta.last_page,
      per_page: data.meta.per_page,
      total: data.meta.total,
    },
  };
}
```

---

## Development Roadmap

### Phase 1: Foundation ✅

- [x] Project setup (Vite + React)
- [x] Tailwind CSS configuration
- [x] Custom design system (colors, fonts, shadows)
- [x] Basic folder structure
- [x] Reusable UI components (Button, Badge, Card, Input, Textarea)
- [x] Layout system (Guest, Client, Freelancer)
- [x] Routing setup (React Router v7)
- [x] Role-based route protection
- [x] Basic navigation (Navbar, Sidebar)
- [x] Landing page (Home)
- [x] Login page

### Phase 2: Guest Pages ✅

- [x] Footer component
- [x] Explore Services page
- [x] Categories page
- [x] Service Detail page
- [x] Freelancer List page
- [x] Freelancer Detail page
- [ ] Portfolio page
- [ ] Portfolio Detail page
- [x] About page
- [x] FAQ page
- [x] Contact page
- [x] Register page (React Hook Form + Zod)
- [x] Become Freelancer page
- [x] Search functionality

### Phase 2.5: Service Layer Refactor ✅

- [x] Centralized service layer (`services/api/`)
- [x] Service layer functions (async, Promise-based)
- [x] Refactored all guest pages to use service layer
- [x] Added loading states (skeleton/placeholder)
- [x] API method signatures documented
- [x] Data models documented
- [x] Mock data removed, replaced with real Laravel API (Phase 7)

### Phase 3: Reusable Components ✅

- [x] Avatar component (via initials pattern)
- [x] Skeleton loader (already done in Phase 1)
- [x] SearchBar component (SearchInput)
- [x] ServiceCard component
- [x] FreelancerCard component
- [x] CategoryCard component
- [x] StatCard component
- [x] EmptyState component
- [x] StarRating component
- [x] TransactionRow component
- [x] ReviewCard component
- [x] TabBar component
- [x] Pagination component
- [x] Dropdown component
- [x] Dialog/Modal component
- [x] Toast notification

### Phase 4: Client Dashboard ✅

- [x] Dashboard page
- [x] Orders page
- [x] Order Detail page
- [x] Riwayat page
- [x] Chat page
- [x] Notifications page
- [x] Favorites page
- [x] Profile page
- [x] Settings page
- [x] Checkout page

### Phase 5: Freelancer Dashboard ✅

- [x] Dashboard page
- [x] My Services page
- [x] Portfolio management
- [x] Orders page
- [x] Chat page
- [x] Earnings page
- [x] Withdraw page
- [x] Reviews page
- [x] Analytics page
- [x] Settings page

### Phase 6: Backend API ✅

- [x] Laravel 13 + Sanctum setup
- [x] 22 database migrations (all pass)
- [x] 17 Eloquent models with relationships
- [x] Auth (Register/Login/Logout + role middleware)
- [x] Public API (Auth, Categories, Services, Products, Freelancers, FAQ) — 12 endpoints
- [x] Client API (Dashboard, Profile, Settings, Orders, Favorites, Notifications, Transactions, Chat, Checkout, Cart, Product Checkout) — 27 endpoints
- [x] Freelancer API (Dashboard, Services CRUD, Products CRUD, Portfolio CRUD, Orders, Earnings, Reviews, Analytics, Chat, Settings) — 31 endpoints
- [x] Admin API (Dashboard, Users CRUD, Services, Orders, Analytics) — 11 endpoints
- [x] Database seeders (11 seeders with realistic mock data)
- [x] **~83 total API routes** registered and tested

### Phase 7: Backend Integration ✅

- [x] Axios instance setup (`src/lib/axios.js`)
- [x] Vite proxy configuration (`/api` → `localhost:8000`)
- [x] Environment variables (`.env` with `VITE_API_URL`)
- [x] Auth store rewritten (login/register/logout/fetchUser with Sanctum API)
- [x] Login page rewritten (real API + form validation + error handling)
- [x] Register page rewritten (real API + role selection)
- [x] Navbar updated (user state, dashboard link, logout)
- [x] Guest API integration — 4 service files (categories, services, freelancers, faq)
- [x] Client API integration — 8 service files (dashboard, orders, profile, favorites, notifications, chat, checkout, transactions)
- [x] Freelancer API integration — 8 service files (dashboard, services, portfolio, orders, earnings, reviews, analytics, chat)
- [x] MySQL database configuration (Laragon MySQL 8.4)
- [x] CSRF fix — disabled `statefulApi()` middleware for cross-origin Bearer token auth
- [x] Backend response shaping — all controllers return camelCase JSON with nested objects
- [ ] Real-time chat (Laravel Reverb)
- [ ] Payment integration (Midtrans)

### Phase 8: Polish & Optimization 🔜

- [x] Dark theme (velvet: Carbon Black + Amaranth + Bone) sebagai default
- [ ] Advanced animations
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Mobile responsiveness fine-tuning

---

## Backend API (57 Routes)

### Setup

```bash
cd artifex-backend
cp .env.example .env
php artisan key:generate
# Buat database 'artifex' di MySQL, lalu:
php artisan migrate:fresh --seed
php artisan serve
```

### Database Tables (22 migrations)

| Table | Description |
|-------|-------------|
| users | Admin, client, freelancer accounts |
| categories | 9 service categories |
| services | Service listings with status |
| service_packages | Basic/Standard/Premium packages |
| portfolios | Freelancer portfolio items |
| orders | Order tracking with status |
| favorites | User service favorites |
| transactions | Payment/withdrawal records |
| reviews | Order reviews with ratings |
| notifications | User notifications |
| conversations | Chat conversations |
| messages | Chat messages |
| withdrawals | Freelancer withdrawal requests |
| faqs | FAQ articles by category |
| products | Product listings |
| cart_items | Shopping cart items |
| product_orders | Product order tracking |

### Seed Data (11 seeders)

| Seeder | Records |
|--------|---------|
| CategorySeeder | 9 categories |
| UserSeeder | 1 admin + 6 freelancers + 1 client |
| ServiceSeeder | 9 services with packages |
| ProductSeeder | Product listings |
| OrderSeeder | 4 orders |
| ReviewSeeder | 5 reviews |
| TransactionSeeder | 10 transactions |
| FavoriteSeeder | 3 favorites |
| NotificationSeeder | 4 notifications |
| FaqSeeder | 9 FAQs |

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@artifex.id | password |
| Client | rizky@artifex.id | password |
| Freelancer | rina@artifex.id | password |

### API Endpoints

#### Auth (4 routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout (auth) |
| GET | `/api/auth/user` | Get current user (auth) |

#### Public (12 routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/categories` | List categories |
| GET | `/api/categories/{slug}` | Category by slug |
| GET | `/api/services` | List services (filter: category, search, sort) |
| GET | `/api/services/{id}` | Service list-item |
| GET | `/api/services/{id}/detail` | Service full detail |
| GET | `/api/products` | List products |
| GET | `/api/products/{id}` | Product detail |
| GET | `/api/freelancers` | List freelancers (filter: specialty, search) |
| GET | `/api/freelancers/{id}` | Freelancer profile |
| GET | `/api/faq` | FAQ grouped by category |

#### Client (27 routes, auth + role:client)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/client/dashboard` | Stats + recent orders + recommendations |
| GET | `/api/client/profile` | Get profile |
| PUT | `/api/client/profile` | Update profile |
| PUT | `/api/client/settings` | Update password |
| GET | `/api/client/orders` | List orders (filter: status) |
| GET | `/api/client/orders/{id}` | Order detail |
| GET | `/api/client/favorites` | List favorites |
| POST | `/api/client/favorites/{id}` | Toggle favorite |
| GET | `/api/client/notifications` | List notifications |
| PUT | `/api/client/notifications/{id}/read` | Mark read |
| PUT | `/api/client/notifications/read-all` | Mark all read |
| GET | `/api/client/transactions` | Transactions + stats |
| GET | `/api/client/chat/conversations` | Chat list |
| GET | `/api/client/chat/{id}/messages` | Chat messages |
| POST | `/api/client/chat/{id}/messages` | Send message |
| GET | `/api/client/checkout/payment-methods` | Payment methods |
| POST | `/api/client/checkout` | Create order |
| GET | `/api/client/cart` | List cart items |
| POST | `/api/client/cart` | Add to cart |
| PUT | `/api/client/cart/{id}` | Update cart item |
| DELETE | `/api/client/cart/{id}` | Remove cart item |
| GET | `/api/client/checkout/{productId}/payment-methods` | Product payment methods |
| POST | `/api/client/checkout/product` | Create product order |

#### Freelancer (31 routes, auth + role:freelancer)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/freelancer/dashboard` | Stats + recent orders + top services |
| GET | `/api/freelancer/services` | List my services |
| POST | `/api/freelancer/services` | Create service |
| GET | `/api/freelancer/services/{id}` | Service detail |
| PUT | `/api/freelancer/services/{id}` | Update service |
| DELETE | `/api/freelancer/services/{id}` | Delete service |
| GET | `/api/freelancer/products` | List my products |
| POST | `/api/freelancer/products` | Create product |
| GET | `/api/freelancer/products/{id}` | Product detail |
| PUT | `/api/freelancer/products/{id}` | Update product |
| DELETE | `/api/freelancer/products/{id}` | Delete product |
| GET | `/api/freelancer/portfolio` | List portfolio |
| POST | `/api/freelancer/portfolio` | Create portfolio |
| PUT | `/api/freelancer/portfolio/{id}` | Update portfolio |
| DELETE | `/api/freelancer/portfolio/{id}` | Delete portfolio |
| GET | `/api/freelancer/orders` | List orders (filter: status) |
| GET | `/api/freelancer/orders/{id}` | Order detail |
| PUT | `/api/freelancer/orders/{id}/status` | Update order status |
| GET | `/api/freelancer/earnings` | Earnings data |
| GET | `/api/freelancer/reviews` | List reviews |
| GET | `/api/freelancer/analytics` | Analytics data |
| GET | `/api/freelancer/chat/conversations` | Chat list |
| GET | `/api/freelancer/chat/{id}/messages` | Chat messages |
| POST | `/api/freelancer/chat/{id}/messages` | Send message |
| PUT | `/api/freelancer/settings` | Update password |

#### Admin (11 routes, auth + role:admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Platform stats + recent orders |
| GET | `/api/admin/users` | List users (filter: role) |
| GET | `/api/admin/users/{id}` | User detail |
| PUT | `/api/admin/users/{id}` | Update user |
| DELETE | `/api/admin/users/{id}` | Delete user |
| GET | `/api/admin/services` | List all services (filter: status) |
| PUT | `/api/admin/services/{id}/status` | Approve/reject service |
| GET | `/api/admin/orders` | List all orders (filter: status) |
| GET | `/api/admin/orders/{id}` | Order detail |
| PUT | `/api/admin/orders/{id}/status` | Update order status |
| GET | `/api/admin/analytics` | Platform analytics |

---

## Cara Menjalankan

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 9+ or yarn 1.22+ or pnpm 8+
- PHP 8.2+
- Composer
- MySQL 8+ (or Laragon/XAMPP with MySQL)

### Frontend

```bash
cd artifex-frontend
npm install
npm run dev
```

### Backend

```bash
cd artifex-backend
composer install
cp .env.example .env
php artisan key:generate
# Pastikan MySQL running dan database 'artifex' sudah dibuat
php artisan migrate:fresh --seed
php artisan serve
```

### Available Scripts

| Command | Fungsi |
|---------|--------|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

### Backend Project Structure

```
artifex-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── ServiceController.php
│   │   │   ├── ProductController.php
│   │   │   ├── FreelancerController.php
│   │   │   ├── FaqController.php
│   │   │   ├── Client/           # 11 controllers
│   │   │   ├── Freelancer/       # 10 controllers
│   │   │   └── Admin/            # 5 controllers
│   │   └── Middleware/
│   │       └── RoleMiddleware.php
│   └── Models/                   # 17 models
│       ├── User.php
│       ├── Category.php
│       ├── Service.php
│       ├── ServicePackage.php
│       ├── Product.php
│       ├── Portfolio.php
│       ├── CartItem.php
│       ├── Order.php
│       ├── ProductOrder.php
│       ├── Favorite.php
│       ├── Transaction.php
│       ├── Review.php
│       ├── Notification.php
│       ├── Conversation.php
│       ├── Message.php
│       ├── Withdrawal.php
│       └── Faq.php
├── config/
│   └── sanctum.php               # Published config
├── database/
│   ├── migrations/               # 22 migration files
│   └── seeders/                  # 11 seeders
├── routes/
│   └── api.php                   # ~83 API routes
└── .env                          # MySQL config (Laragon)
```

---

## Coding Standards

### Principles

- **Clean Architecture** - Pemisahan Concerns yang Jelas
- **Reusable Component** - DRY (Don't Repeat Yourself)
- **SOLID Principle** - Single Responsibility, Open/Closed, dll.
- **KISS** - Keep It Simple, Stupid
- **Responsive** - Mobile-first approach
- **Accessibility** - WCAG compliance
- **SEO Friendly** - Semantic HTML
- **Performance** - Lazy Loading & Code Splitting

### Code Style

- Functional components with hooks
- CSS Utility-first (Tailwind)
- Component variants with CVA
- Path aliases (`@/` -> `src/`)
- ES Modules
- Prettier formatting
- ESLint rules

---

## Referensi

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Framer Motion Documentation](https://www.framer.com/motion)

---

## License

Private - Artifex Project
