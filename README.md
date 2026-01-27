[![Logo Image](https://cdn.vervecustoms.com/logo/neo.png)](https://neodesigns.hosting)

[![Discord](https://img.shields.io/discord/922284031129825280?style=for-the-badge)](https://discord.com/invite/qttGR4Z5Pk)
![Version](https://img.shields.io/github/v/release/neodesigns/panel?style=for-the-badge)
![Contributors](https://img.shields.io/github/contributors-anon/neodesigns/panel?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

<h1 align="center">NeoDesigns</h1>
<h5 align="center">
    <strong>
        A modern, feature-rich game server management panel with integrated billing.
        Built on Jexactyl, enhanced for performance, customization, and user experience.
    </strong>
</h5>

## About NeoDesigns

NeoDesigns is a comprehensive hosting management solution that combines powerful server administration with a complete billing system. Whether you're running a small game server community or a large hosting business, NeoDesigns provides the tools you need to succeed.

### Key Features

**For Server Owners:**
- 🎮 Multi-game support with optimized configurations
- 💳 Integrated billing with Stripe and PayPal
- 🎫 Built-in ticket system for customer support
- 📊 Advanced analytics and resource monitoring
- 🔐 User approval system and access controls
- 🔄 Automated server renewals
- 🎨 Fully customizable branding and themes

**For Users:**
- 🚀 Intuitive, modern interface
- ⚡ Real-time server management
- 📱 Mobile-responsive design
- 🔌 RESTful API access
- 📁 Advanced file manager
- 🖥️ Web-based console
- 📈 Resource usage graphs

## Installation

### Quick Start
```bash
# Download the installation script
curl -sSL https://get.neodesigns.hosting -o install.sh

# Run the installer
bash install.sh
```

### Documentation

For detailed installation instructions, configuration guides, and troubleshooting:
- 📖 [Full Documentation](https://docs.neodesigns.hosting)
- 💬 [Discord Support](https://discord.com/invite/qttGR4Z5Pk)
- 🎥 [Video Tutorials](https://youtube.com/@neodesigns)

### Requirements

- **OS**: Ubuntu 20.04/22.04, Debian 11/12, or CentOS 8+
- **Web Server**: Nginx or Apache
- **PHP**: 8.1 or higher
- **Database**: MySQL 5.7.22+ or MariaDB 10.2+
- **Additional**: Redis, Composer, Node.js 16+

## Why Choose NeoDesigns?

### 💰 Complete Billing Solution
- Native Stripe and PayPal integration
- Flexible pricing plans (hourly, monthly, custom)
- Automated invoicing and payment processing
- Coupon and promotional code system
- Revenue analytics and reporting

### 🎨 Unmatched Customization
- Custom branding (logo, colors, favicon)
- Configurable registration and approval flows
- Resource allocation controls
- Custom email templates
- Multi-language support

### 🛠️ Enhanced Management
- Bulk server operations
- Advanced user permissions
- Node management and monitoring
- Database backups and restoration
- Activity logs and audit trails

### 🚀 Performance Optimized
- Redis caching for faster load times
- Optimized database queries
- CDN-ready static assets
- Background job processing
- Resource-efficient operations

## Sponsors

Support NeoDesigns development and get your brand featured here!

[**Become a Sponsor**](https://github.com/sponsors/neodesigns)

### Current Sponsors

| Company                                       | About                                                                                                                          | Link                                     |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| [**HostEZ**](https://hostez.io)               | Providing North America Valheim, Minecraft and other popular games with low latency, high uptime and maximum availability. EZ! | [Website](https://hostez.io)             |
| [**CXMPUTE**](https://cxmpute.com)            | CXMPUTE provides low-cost VPS and gameserver solutions, starting at $2/month.                                                  | [Website](https://cxmpute.com)           |
| [**ZipCloud**](https://discord.gg/f4rbEmYAXb) | Game & VPS hosting with full DDoS protection and great uptime.                                                                 | [Discord](https://discord.gg/f4rbEmYAXb) |

## Screenshots

### Dashboard
![NeoDesigns Dashboard](https://user-images.githubusercontent.com/72230943/201116518-af5e3291-74f7-433a-b035-6d80e8c7e8f8.png)

### Server Management
![Server Console](https://user-images.githubusercontent.com/72230943/201116580-ae864e7c-aac7-4766-ab9c-c6cb97d0b015.png)

### File Manager
![File Manager](https://user-images.githubusercontent.com/72230943/201116688-b53d721e-c30f-424e-8a53-025f313ec98f.png)

### Store & Billing
![Store Interface](https://user-images.githubusercontent.com/72230943/201116840-92c00c15-5717-4121-83cd-69397f9bacba.png)

### Admin Panel
![Admin Dashboard](https://user-images.githubusercontent.com/72230943/201116914-8b1c8867-c462-4b25-ae47-803b2e4ea39c.png)

### User Management
![User Settings](https://user-images.githubusercontent.com/72230943/201116959-a626e6fc-18a9-4c06-869e-2f13b37b8457.png)

### Ticket System
![Support Tickets](https://user-images.githubusercontent.com/72230943/201117028-3db8aa2e-b14b-4679-9f2c-c5afb208767c.png)

## API Documentation

NeoDesigns provides a comprehensive RESTful API for developers:
```javascript
// Example: Create a server
const response = await fetch('https://panel.example.com/api/client/servers', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'My Game Server',
    egg: 1,
    docker_image: 'quay.io/pterodactyl/core:java',
    startup: 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar server.jar',
    environment: {},
    limits: {
      memory: 2048,
      swap: 0,
      disk: 5120,
      io: 500,
      cpu: 100
    }
  })
});
```

[View Full API Documentation](https://docs.neodesigns.hosting/api)

## Community & Support

- 💬 **Discord**: [Join our community](https://discord.com/invite/qttGR4Z5Pk)
- 🐛 **Issues**: [Report bugs](https://github.com/neodesigns/panel/issues)
- 💡 **Feature Requests**: [Suggest features](https://github.com/neodesigns/panel/discussions)
- 📧 **Email**: support@neodesigns.hosting

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Clone the repository
git clone https://github.com/neodesigns/panel.git
cd panel

# Install dependencies
composer install --no-dev --optimize-autoloader
npm install
npm run build

# Set up environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate --seed
```

## Roadmap

- [ ] Docker container support
- [ ] Advanced monitoring and alerting
- [ ] Mobile app (iOS/Android)
- [ ] Multi-currency support
- [ ] Affiliate system
- [ ] White-label options
- [ ] Kubernetes integration

## Security

If you discover a security vulnerability, please email security@neodesigns.hosting. All security vulnerabilities will be promptly addressed.

## License

NeoDesigns is open-source software licensed under the [MIT License](LICENSE.md).

### Third-Party Licenses

Some JavaScript and CSS libraries used within the panel are licensed under MIT or Apache 2.0 licenses. Please check their respective header files for more information.

## Credits

- Built on [Jexactyl](https://github.com/jexactyl/jexactyl)
- Originally based on [Pterodactyl Panel](https://pterodactyl.io)
- Powered by [Laravel](https://laravel.com)
- UI components from [Tailwind CSS](https://tailwindcss.com)

---

<p align="center">
    <strong>Made with ❤️ by the NeoDesigns Team</strong>
</p>

<p align="center">
    <a href="https://neodesigns.hosting">Website</a> •
    <a href="https://docs.neodesigns.hosting">Docs</a> •
    <a href="https://discord.com/invite/qttGR4Z5Pk">Discord</a> •
    <a href="https://twitter.com/neodesigns">Twitter</a>
</p>