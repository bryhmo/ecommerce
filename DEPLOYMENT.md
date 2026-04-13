# Ecommerce Platform - Deployment Guide

## Frontend Deployment (Next.js on Vercel)

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository

### Deployment Steps

1. **Connect GitHub Repository**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select the `apps/web` directory as the root

2. **Configure Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```

3. **Deploy**
   - Vercel will automatically build and deploy on every push to main branch

### Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records

## Backend Deployment (NestJS on Heroku)

### Prerequisites
- Heroku account (https://heroku.com)
- Heroku CLI installed

### Deployment Steps

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Configure PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set DB_HOST=your-postgres-host
   heroku config:set DB_PORT=5432
   heroku config:set DB_USER=your-db-user
   heroku config:set DB_PASSWORD=your-db-password
   heroku config:set DB_NAME=your-db-name
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set PAYSTACK_SECRET_KEY=your-paystack-key
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASSWORD=your-app-password
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Run Migrations**
   ```bash
   heroku run yarn workspace @ecommerce/api typeorm migration:run
   ```

## Backend Deployment (NestJS on AWS)

### Using EC2 + RDS

1. **Setup EC2 Instance**
   - Launch Ubuntu 20.04 LTS instance
   - Install Node.js and PostgreSQL client

2. **Setup RDS PostgreSQL**
   - Create PostgreSQL instance in RDS
   - Configure security groups
   - Create database and user

3. **Deploy Application**
   ```bash
   # SSH into EC2
   ssh -i your-key.pem ec2-user@your-ec2-ip
   
   # Clone repository
   git clone your-repo-url
   cd fullstackEC
   
   # Install dependencies
   yarn install
   
   # Build backend
   yarn workspace @ecommerce/api build
   
   # Create .env file with RDS credentials
   # Start application
   yarn workspace @ecommerce/api start
   ```

4. **Setup PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start apps/api/dist/main.js --name "ecommerce-api"
   pm2 save
   pm2 startup
   ```

### Using AWS Elastic Beanstalk

1. **Deploy**
   ```bash
   eb init -p node.js-20 ecommerce-api
   eb create ecommerce-env
   eb deploy
   ```

2. **Configure Environment**
   ```bash
   eb setenv DB_HOST=your-rds-endpoint
   eb setenv DB_PASSWORD=your-password
   # ... set other variables
   ```

## Alternative: AWS App Runner

1. **Create ECR Repository**
   ```bash
   aws ecr create-repository --repository-name ecommerce-api
   ```

2. **Build and Push Docker Image**
   ```bash
   docker build -f apps/api/Dockerfile -t ecommerce-api .
   docker tag ecommerce-api:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ecommerce-api:latest
   docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ecommerce-api:latest
   ```

3. **Create App Runner Service**
   - Go to AWS App Runner console
   - Create new service
   - Select ECR image
   - Configure environment variables
   - Deploy

## Setup Custom Domain

### Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration

### Backend (Heroku)
```bash
heroku domains:add api.yourdomain.com
# Add DNS CNAME record pointing to herokuapp.com
```

## SSL/TLS Certificate

- Vercel: Automatic HTTPS with Let's Encrypt
- Heroku: Automatic HTTPS with Let's Encrypt
- AWS: Use AWS Certificate Manager

## Monitoring & Logging

### Vercel
- Built-in analytics dashboard
- Error tracking with Sentry

### Heroku
```bash
# View logs
heroku logs --tail

# Monitor metrics
heroku metrics --tail
```

### AWS
- CloudWatch for monitoring
- CloudWatch Logs for application logs

## Database Backups

### Heroku PostgreSQL
```bash
heroku pg:backups:capture
heroku pg:backups
```

### AWS RDS
- Automated snapshots (configured in RDS console)
- Manual backups available

## Health Checks

### Frontend
- Vercel automatically does health checks

### Backend
- API health check: `GET /health`
- Configure health check path in deployment settings

## CI/CD Pipeline

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: heroku/deploy-github-actions@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: your-app-name
          heroku_email: your-email@example.com
```

## Post-Deployment Checklist

- [ ] Frontend accessible at custom domain
- [ ] API health check responds
- [ ] Database migrations completed
- [ ] Paystack webhook configured
- [ ] Email service configured
- [ ] SSL certificates installed
- [ ] CORS properly configured
- [ ] Environment variables verified
- [ ] Database backups enabled
- [ ] Monitoring/logging configured
- [ ] Documentation updated

## Troubleshooting

### API not responding
```bash
heroku logs --tail
# Check for errors and database connection issues
```

### Database connection error
- Verify security group rules
- Check credentials
- Ensure database is running

### Build failures
- Check logs on Vercel/Heroku
- Verify dependencies in package.json
- Check for TypeScript errors

## Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Heroku Docs](https://devcenter.heroku.com/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
