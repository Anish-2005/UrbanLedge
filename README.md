# 🌆 UrbanLedge - Online Property Tax Management System

<div align="center">

![UrbanLedge Banner](https://img.shields.io/badge/UrbanLedge-Property%20Tax%20Management-blue?style=for-the-badge&logo=building&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=flat-square&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat-square&logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Anish-2005/UrbanLedge/pulls)
[![GitHub stars](https://img.shields.io/github/stars/Anish-2005/UrbanLedge?style=social)](https://github.com/Anish-2005/UrbanLedge)

*Transforming property tax management with modern technology and seamless user experience*

[🚀 Live Demo](#) • [📖 Documentation](#) • [🛠️ API Reference](#)

---

</div>

## ✨ Overview

UrbanLedge is a comprehensive **Online Property Tax Management System** that revolutionizes how municipalities and property owners interact with property taxation. Built with cutting-edge technologies, it provides a seamless, secure, and efficient platform for property assessment, tax calculation, payment processing, and administrative management.

### 🎯 Key Features

<div align="center">

| 🏢 **Property Management** | 💰 **Tax Assessment** | 💳 **Payment Processing** | 👥 **User Management** |
|:-------------------------:|:--------------------:|:------------------------:|:----------------------:|
| Complete property database | Automated tax calculation | Multiple payment methods | Role-based access control |
| Digital property records | Exemption handling | Payment history | User authentication |
| Ward-based organization | Assessment tracking | Receipt generation | Admin dashboard |

</div>

### 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js 15.5.6]
        B[Tailwind CSS]
        C[Framer Motion]
        D[Lucide React]
    end

    subgraph "Authentication Layer"
        E[Firebase Auth]
        F[JWT Tokens]
    end

    subgraph "API Layer"
        G[Next.js API Routes]
        H[RESTful Endpoints]
        I[Server Actions]
    end

    subgraph "Database Layer"
        J[(PostgreSQL)]
        K[User Accounts]
        L[Properties]
        M[Assessments]
        N[Payments]
        O[Audit Logs]
    end

    A --> E
    E --> G
    G --> J
    B --> A
    C --> A
    D --> A
    H --> G
    I --> G
    K --> J
    L --> J
    M --> J
    N --> J
    O --> J

    style A fill:#e1f5fe
    style J fill:#f3e5f5
    style G fill:#e8f5e8
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17 or later
- **PostgreSQL** 15 or later
- **npm** or **yarn** package manager
- **Firebase** account (for authentication)

### ⚡ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anish-2005/UrbanLedge.git
   cd UrbanLedge
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Configure your `.env.local`:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/urbanledge"

   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

   # Optional: SSL and other configs
   PG_SSL_REJECT_UNAUTHORIZED=true
   ```

4. **Database Setup**
   ```bash
   # Apply schema
   npm run apply-schema

   # Load sample data (optional)
   npm run apply-sample-data
   ```

5. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Google Authentication in Authentication → Sign-in method
   - Add your domain to authorized domains

6. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see the application!

## 📊 Database Schema

```mermaid
erDiagram
    user_account ||--o{ user_role : has
    role ||--o{ user_role : assigned
    user_account ||--o{ owner : "may own"
    owner ||--|| property : owns
    ward ||--o{ property : contains
    property_type ||--o{ property : categorizes
    property_type ||--o{ tax_slab : defines
    property ||--|| assessment : assessed
    exemption ||--o{ assessment : applies
    assessment ||--|| payment : paid
    payment ||--|| receipt : generates
    user_account ||--o{ audit_log : creates

    user_account {
        int user_id PK
        varchar username UK
        varchar password_hash
        varchar full_name
        varchar email UK
        varchar phone
        enum status "ACTIVE|INACTIVE|SUSPENDED"
        timestamp created_at
    }

    role {
        int role_id PK
        varchar name UK
        varchar description
    }

    ward {
        int ward_id PK
        varchar name
        text area_description
    }

    property_type {
        int ptype_id PK
        varchar name UK
        varchar description
    }

    property {
        int property_id PK
        int owner_id FK
        int ward_id FK
        int ptype_id FK
        text address
        decimal land_area
        decimal built_area
        varchar usage
        timestamp created_at
    }

    tax_slab {
        int slab_id PK
        int ptype_id FK
        decimal min_area
        decimal max_area
        decimal base_rate_per_sq_m
        date effective_from
        date effective_to
        boolean active
        timestamp created_at
    }

    exemption {
        int exemp_id PK
        varchar name
        decimal percentage
        date valid_from
        date valid_to
        boolean active
    }

    assessment {
        int assess_id PK
        int property_id FK
        varchar financial_year
        decimal assessed_value
        decimal base_tax
        decimal exemption_pct
        decimal penalty
        decimal total_due
        varchar status "DUE|PAID|PARTIAL|WRITTEN_OFF"
        timestamp created_at
    }

    payment {
        int payment_id PK
        int assess_id FK
        decimal paid_amount
        timestamp paid_on
        varchar payment_method
        varchar transaction_ref
        varchar payment_status "INITIATED|SUCCESS|FAILED"
    }

    receipt {
        int receipt_id PK
        int payment_id FK,UK
        varchar receipt_no UK
        timestamp generated_on
    }

    audit_log {
        int log_id PK
        int user_id FK
        varchar action
        varchar table_name
        varchar record_id
        text description
        timestamp created_at
    }
```

## 🎨 UI/UX Features

### 🖥️ Admin Dashboard

<div align="center">

![Admin Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Admin+Dashboard+Preview)

*Comprehensive admin panel with real-time analytics, user management, and system configuration*

</div>

### 🏠 Property Management

<div align="center">

![Property Management](https://via.placeholder.com/800x400/059669/FFFFFF?text=Property+Management+Interface)

*Intuitive property registration and management with digital documentation*

</div>

### 💰 Tax Assessment

<div align="center">

![Tax Assessment](https://via.placeholder.com/800x400/DC2626/FFFFFF?text=Tax+Assessment+System)

*Automated tax calculation with exemption handling and assessment tracking*

</div>

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.6 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend
- **Runtime**: Node.js 18+
- **Database**: PostgreSQL 15
- **ORM**: Direct SQL queries with pg library
- **Authentication**: Firebase Auth + JWT
- **API**: Next.js API Routes

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint, TypeScript
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
UrbanLedge/
├── 📁 docs/
│   └── project_report.md
├── 📁 public/
│   ├── favicon.ico
│   └── images/
├── 📁 scripts/
│   ├── apply_sample_data.js
│   ├── apply_schema.js
│   └── check_db_connection.js
├── 📁 sql/
│   ├── sample_data.sql
│   ├── schema.sql
│   └── stored_procs.sql
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 admin/
│   │   ├── 📁 api/
│   │   ├── 📁 assessments/
│   │   ├── 📁 demo/
│   │   ├── 📁 payments/
│   │   ├── 📁 properties/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── 📁 components/
│   ├── 📁 contexts/
│   └── 📁 lib/
├── 📄 .env.example
├── 📄 .gitignore
├── 📄 next.config.ts
├── 📄 package.json
├── 📄 tailwind.config.js
└── 📄 tsconfig.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Properties
- `GET /api/properties` - List all properties
- `POST /api/properties` - Create new property
- `GET /api/properties/[id]` - Get property details
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property

### Assessments
- `GET /api/assessments` - List assessments
- `POST /api/assessments` - Create assessment
- `GET /api/assessments/[id]` - Get assessment details
- `PUT /api/assessments/[id]` - Update assessment

### Payments
- `GET /api/payments` - List payments
- `POST /api/payments` - Process payment
- `GET /api/payments/[id]/receipt` - Generate receipt

### Admin
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/reports` - System reports

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login and deploy
   vercel login
   vercel --prod
   ```

2. **Environment Variables**
   Set the following in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_FIREBASE_*` variables

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: Inspired by modern design systems
- **Database**: PostgreSQL community
- **Framework**: Next.js team

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Anish-2005/UrbanLedge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Anish-2005/UrbanLedge/discussions)
- **Email**: support@urbanledge.com

---

<div align="center">

**Made with ❤️ by the UrbanLedge Team**

[⭐ Star us on GitHub](https://github.com/Anish-2005/UrbanLedge) • [🐛 Report a Bug](https://github.com/Anish-2005/UrbanLedge/issues) • [💡 Request a Feature](https://github.com/Anish-2005/UrbanLedge/issues)

</div>