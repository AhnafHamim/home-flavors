# Home Flavors - Modern Food Ordering Platform 🍽️

A full-stack food ordering platform built with Next.js 14, featuring real-time payment processing with Square, automated WhatsApp notifications via Twilio, and MongoDB integration.

## 🚀 Features

- **Modern Tech Stack**
  - Next.js 14 with App Router
  - TypeScript for type safety
  - MongoDB for data persistence
  - Tailwind CSS for styling

- **Payment Integration**
  - Square Payment SDK integration
  - Secure payment processing
  - Sandbox testing environment

- **Automated Notifications**
  - WhatsApp integration via Twilio
  - Instant order notifications



## 🛠️ Technical Architecture

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Payment**: Square Payment SDK
- **Notifications**: Twilio WhatsApp API
- **Database**: MongoDB

## 📸 Photos

### Menu
![Homepage Screenshot](https://github.com/user-attachments/assets/21cd750c-2a7e-404f-918f-a1d3c81ed922)

### Cart
![Menu Page Screenshot](https://github.com/user-attachments/assets/0324d358-0591-45dd-9900-528f14dec5e5)

### Checkout
![Cart Screenshot](https://github.com/user-attachments/assets/273a1a0c-e480-4729-9615-d6350ea01d19)

## 💻 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/home-flavors.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
# MongoDB
MONGODB_URI=your_mongodb_uri
MONGODB_DB=your_database_name

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=your_twilio_number
OWNER_WHATSAPP_NUMBER=your_number

# Square
SQUARE_ACCESS_TOKEN=your_access_token
NEXT_PUBLIC_SQUARE_APP_ID=your_app_id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your_location_id
```

4. Run the development server:
```bash
npm run dev
```

## 🔒 Security Features

- Environment variable protection
- Square sandbox testing
- Secure payment processing
- Type-safe implementations


## 🔄 Development Workflow

1. Start MongoDB locally
2. Run development server
3. Use Square sandbox for payment testing
4. Monitor Twilio notifications

## 🧪 Testing

```bash
# Run tests
npm test

# Run Square sandbox tests
npm run test:square

# Test Twilio notifications
npm run test:notifications
```

## 📚 API Documentation

- `/api/menu`: Menu management
- `/api/payment`: Payment processing
- `/api/orders`: Order management
- `/api/notifications`: WhatsApp notifications

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Square for payment processing
- Twilio for WhatsApp integration
- MongoDB for database solutions
- Next.js team for the amazing framework

---

Built with ❤️ using Next.js, Square, Twilio, and MongoDB
