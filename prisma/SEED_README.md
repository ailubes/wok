# Database Seed Script

This directory contains the seed script for populating the AgroLaw Vote database with test data for development.

## Running the Seed Script

```bash
npm run seed
```

## What Gets Seeded

### Users (4 total)

#### Admin User
- **Email**: `admin@agrolaw.gov.ua`
- **Password**: `admin123`
- **Full Name**: Олександр Адміністратор
- **Organization**: Міністерство аграрної політики
- **Role**: ADMIN

#### Member Users (2)
1. **Email**: `member1@agrolaw.gov.ua`
   - **Password**: `member123`
   - **Full Name**: Марія Іванова
   - **Organization**: Асоціація фермерів України
   - **Role**: MEMBER

2. **Email**: `member2@agrolaw.gov.ua`
   - **Password**: `member123`
   - **Full Name**: Петро Петренко
   - **Organization**: Спілка рибалок
   - **Role**: MEMBER

#### Observer User
- **Email**: `observer@agrolaw.gov.ua`
- **Password**: `observer123`
- **Full Name**: Наталія Спостерігач
- **Organization**: Незалежний експерт
- **Role**: OBSERVER

### Bill (1 total)
- **Title**: Про рибне господарство та промисловий вилов
- **Registration Number**: 8119
- **Status**: ACTIVE
- **Description**: Законопроєкт про внесення змін до Закону України "Про рибне господарство, промисловий вилов водних біоресурсів та охорону водних біоресурсів"

### Articles (5 total)

1. **Стаття 1** - Визначення термінів (IN_DISCUSSION)
2. **Стаття 24-1** - Ліцензування промислового вилову (NOT_PROCESSED)
3. **Стаття 15** - Охорона водних біоресурсів (APPROVED)
4. **Стаття 32** - Відповідальність за порушення законодавства (REJECTED)
5. **Стаття 7** - Державне управління у сфері рибного господарства (NOT_PROCESSED)

### Proposals (2 total)
- 1 proposal in VOTING status (on Article 1)
- 1 proposal in DRAFT status (on Article 1)

### Votes (3 total)
- 2 APPROVE votes
- 1 ABSTAIN vote

### Comments (3 total)
- 2 top-level comments
- 1 threaded reply

## Features

- **Idempotent**: Can be run multiple times safely - clears existing data first
- **Realistic Data**: Ukrainian legal text and realistic scenarios
- **Complete Coverage**: Tests all models and relationships in the schema
- **Bcrypt Passwords**: All passwords are properly hashed with bcrypt
- **Different Statuses**: Articles and proposals in various states for testing

## Notes

- The script clears ALL existing data before seeding (development only!)
- All passwords are hashed using bcrypt with 10 salt rounds
- Voting deadline for the active proposal is set to 7 days from seed time
- Comments include threaded replies to test nested comment functionality

## File Location

`/mnt/c/www/lawdoc/prisma/seed.ts`
