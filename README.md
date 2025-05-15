Employee-Clearance-For-Wolkite-University/
│
├── app/                          # Frontend application (Next.js)
│   ├── admin/                   # Admin panel pages
│   │   ├── accountreq/         # Account request handling
│   │   └── clearance/          # Clearance request handling
│   ├── auth/                   # Authentication pages
│   ├── staff/                  # Staff dashboard and features
│   └── api/                    # API route handlers
│
├── components/                 # Reusable UI components
├── context/                    # Global state management (e.g., AuthContext)
├── hooks/                      # Custom React hooks
├── models/                     # Mongoose schema definitions
├── public/                     # Static assets (images, icons, etc.)
├── socket/                     # Socket.io configuration (if real-time is used)
├── utils/                      # Utility functions (DB connection, helpers)
├── validations/                # Input validation logic
├── styles/                     # Global and page-specific styles (if any)
├── .env.local                  # Environment variables (local only)
├── README.md                   # Project documentation
└── package.json                # Project metadata and dependencies
