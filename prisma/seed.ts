import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data (for development)
  console.log('🗑️  Clearing existing data...')
  await prisma.comment.deleteMany()
  await prisma.vote.deleteMany()
  await prisma.proposal.deleteMany()
  await prisma.article.deleteMany()
  await prisma.bill.deleteMany()
  await prisma.user.deleteMany()

  // ============================================================================
  // CREATE USERS
  // ============================================================================
  console.log('👥 Creating users...')

  const adminPassword = await bcrypt.hash('admin123', 10)
  const memberPassword = await bcrypt.hash('member123', 10)
  const observerPassword = await bcrypt.hash('observer123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@agrolaw.gov.ua',
      passwordHash: adminPassword,
      fullName: 'Олександр Адміністратор',
      organization: 'Міністерство аграрної політики',
      role: 'ADMIN',
    },
  })
  console.log('  ✓ Admin user created:', admin.email)

  const member1 = await prisma.user.create({
    data: {
      email: 'member1@agrolaw.gov.ua',
      passwordHash: memberPassword,
      fullName: 'Марія Іванова',
      organization: 'Асоціація фермерів України',
      role: 'MEMBER',
    },
  })
  console.log('  ✓ Member user created:', member1.email)

  const member2 = await prisma.user.create({
    data: {
      email: 'member2@agrolaw.gov.ua',
      passwordHash: memberPassword,
      fullName: 'Петро Петренко',
      organization: 'Спілка рибалок',
      role: 'MEMBER',
    },
  })
  console.log('  ✓ Member user created:', member2.email)

  const observer = await prisma.user.create({
    data: {
      email: 'observer@agrolaw.gov.ua',
      passwordHash: observerPassword,
      fullName: 'Наталія Спостерігач',
      organization: 'Незалежний експерт',
      role: 'OBSERVER',
    },
  })
  console.log('  ✓ Observer user created:', observer.email)

  // ============================================================================
  // CREATE BILL
  // ============================================================================
  console.log('📜 Creating bill...')

  const bill = await prisma.bill.create({
    data: {
      title: 'Про рибне господарство та промисловий вилов',
      registrationNumber: '8119',
      description:
        'Законопроєкт про внесення змін до Закону України "Про рибне господарство, промисловий вилов водних біоресурсів та охорону водних біоресурсів"',
      status: 'ACTIVE',
    },
  })
  console.log('  ✓ Bill created:', bill.title)

  // ============================================================================
  // CREATE ARTICLES
  // ============================================================================
  console.log('📄 Creating articles...')

  const article1 = await prisma.article.create({
    data: {
      billId: bill.id,
      articleNumber: 'Стаття 1',
      title: 'Визначення термінів',
      currentLawText:
        'Аквакультура - господарська діяльність, спрямована на розведення та вирощування водних біоресурсів у контрольованих умовах.',
      draftBillText:
        'Аквакультура - штучне розведення та вирощування водних біоресурсів у спеціально створених або пристосованих водних об\'єктах з метою отримання продукції аквакультури.',
      tags: ['аквакультура', 'визначення'],
      orderIndex: 1,
      status: 'IN_DISCUSSION',
    },
  })
  console.log('  ✓ Article created:', article1.articleNumber)

  const article2 = await prisma.article.create({
    data: {
      billId: bill.id,
      articleNumber: 'Стаття 24-1',
      title: 'Ліцензування промислового вилову',
      currentLawText:
        'Промисловий вилов водних біоресурсів здійснюється на підставі дозволів, що видаються відповідно до законодавства України.',
      draftBillText:
        'Промисловий вилов водних біоресурсів здійснюється на підставі спеціального дозволу (ліцензії), що видається центральним органом виконавчої влади, що реалізує державну політику у сфері рибного господарства, строком на 5 років.',
      tags: ['ліцензування', 'промисел'],
      orderIndex: 2,
      status: 'NOT_PROCESSED',
    },
  })
  console.log('  ✓ Article created:', article2.articleNumber)

  const article3 = await prisma.article.create({
    data: {
      billId: bill.id,
      articleNumber: 'Стаття 15',
      title: 'Охорона водних біоресурсів',
      currentLawText:
        'Охорона водних біоресурсів здійснюється шляхом встановлення заборон, обмежень та інших заходів, спрямованих на збереження їх популяції.',
      draftBillText:
        'Охорона водних біоресурсів здійснюється шляхом:\n1) встановлення заборон та обмежень на вилов;\n2) визначення квот вилову;\n3) створення заповідних зон;\n4) штучного відтворення популяцій;\n5) моніторингу стану водних біоресурсів.',
      tags: ['охорона', 'екологія'],
      orderIndex: 3,
      status: 'APPROVED',
    },
  })
  console.log('  ✓ Article created:', article3.articleNumber)

  const article4 = await prisma.article.create({
    data: {
      billId: bill.id,
      articleNumber: 'Стаття 32',
      title: 'Відповідальність за порушення законодавства',
      currentLawText:
        'За порушення законодавства про рибне господарство особи несуть адміністративну або кримінальну відповідальність.',
      draftBillText:
        'За порушення законодавства про рибне господарство особи несуть адміністративну, кримінальну або цивільно-правову відповідальність згідно із законодавством України.',
      tags: ['відповідальність', 'санкції'],
      orderIndex: 4,
      status: 'REJECTED',
    },
  })
  console.log('  ✓ Article created:', article4.articleNumber)

  const article5 = await prisma.article.create({
    data: {
      billId: bill.id,
      articleNumber: 'Стаття 7',
      title: 'Державне управління у сфері рибного господарства',
      currentLawText:
        'Державне управління у сфері рибного господарства здійснюють Кабінет Міністрів України та центральний орган виконавчої влади.',
      draftBillText:
        'Державне управління у сфері рибного господарства здійснюють:\n1) Верховна Рада України;\n2) Кабінет Міністрів України;\n3) центральний орган виконавчої влади, що забезпечує формування державної політики у сфері рибного господарства;\n4) місцеві органи виконавчої влади та органи місцевого самоврядування.',
      tags: ['управління', 'державна політика'],
      orderIndex: 5,
      status: 'NOT_PROCESSED',
    },
  })
  console.log('  ✓ Article created:', article5.articleNumber)

  // ============================================================================
  // CREATE PROPOSALS
  // ============================================================================
  console.log('💡 Creating proposals...')

  // Proposal 1: In VOTING status
  const proposal1 = await prisma.proposal.create({
    data: {
      articleId: article1.id,
      authorId: member1.id,
      proposedText:
        'Аквакультура - контрольоване розведення, вирощування та утримання водних біоресурсів (риби, молюсків, ракоподібних, водних рослин та інших водних організмів) у штучних або природних водних об\'єктах з метою отримання харчової продукції, відтворення популяцій або в наукових цілях.',
      justification:
        'Запропоноване визначення є більш повним та охоплює всі види діяльності у сфері аквакультури, включаючи не лише рибництво, але й вирощування інших водних організмів. Також додано згадку про наукові цілі, що відповідає міжнародній практиці.',
      status: 'VOTING',
      votingEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  })
  console.log('  ✓ Proposal created (VOTING):', proposal1.id)

  // Proposal 2: In DRAFT status
  const proposal2 = await prisma.proposal.create({
    data: {
      articleId: article1.id,
      authorId: member2.id,
      proposedText:
        'Аквакультура - господарська діяльність з розведення, вирощування та утримання водних біоресурсів у керованих умовах водного середовища.',
      justification:
        'Коротше формулювання, яке залишає основний зміст, але є більш лаконічним. Термін "керовані умови" точніше відображає суть аквакультури.',
      status: 'DRAFT',
    },
  })
  console.log('  ✓ Proposal created (DRAFT):', proposal2.id)

  // ============================================================================
  // CREATE VOTES (for proposal1)
  // ============================================================================
  console.log('🗳️  Creating votes...')

  await prisma.vote.create({
    data: {
      proposalId: proposal1.id,
      userId: member1.id,
      value: 'APPROVE',
    },
  })
  console.log('  ✓ Vote created: APPROVE by', member1.fullName)

  await prisma.vote.create({
    data: {
      proposalId: proposal1.id,
      userId: member2.id,
      value: 'APPROVE',
    },
  })
  console.log('  ✓ Vote created: APPROVE by', member2.fullName)

  await prisma.vote.create({
    data: {
      proposalId: proposal1.id,
      userId: admin.id,
      value: 'ABSTAIN',
    },
  })
  console.log('  ✓ Vote created: ABSTAIN by', admin.fullName)

  // ============================================================================
  // CREATE COMMENTS
  // ============================================================================
  console.log('💬 Creating comments...')

  const comment1 = await prisma.comment.create({
    data: {
      articleId: article1.id,
      userId: member2.id,
      text: 'Вважаю, що визначення потребує уточнення щодо типів водних об\'єктів, які можуть використовуватися для аквакультури. Необхідно чітко розмежувати природні та штучні водойми.',
    },
  })
  console.log('  ✓ Comment created by', member2.fullName)

  // Reply to comment1
  await prisma.comment.create({
    data: {
      articleId: article1.id,
      userId: member1.id,
      text: 'Погоджуюсь. Я додала це уточнення у свою пропозицію. Будь ласка, перегляньте та проголосуйте.',
      parentId: comment1.id,
    },
  })
  console.log('  ✓ Reply created by', member1.fullName)

  await prisma.comment.create({
    data: {
      articleId: article1.id,
      userId: observer.id,
      text: 'З точки зору міжнародного досвіду, варто також включити згадку про екологічні стандарти ведення аквакультури. Це стає все більш важливим у контексті сталого розвитку.',
    },
  })
  console.log('  ✓ Comment created by', observer.fullName)

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('\n✅ Database seeded successfully!')
  console.log('\n📊 Summary:')
  console.log('  Users: 4')
  console.log('    - 1 Admin')
  console.log('    - 2 Members')
  console.log('    - 1 Observer')
  console.log('  Bills: 1')
  console.log('  Articles: 5')
  console.log('  Proposals: 2')
  console.log('  Votes: 3')
  console.log('  Comments: 3 (1 with reply)')
  console.log('\n🔑 Test Credentials:')
  console.log('  Admin:')
  console.log('    Email: admin@agrolaw.gov.ua')
  console.log('    Password: admin123')
  console.log('  Member 1:')
  console.log('    Email: member1@agrolaw.gov.ua')
  console.log('    Password: member123')
  console.log('  Member 2:')
  console.log('    Email: member2@agrolaw.gov.ua')
  console.log('    Password: member123')
  console.log('  Observer:')
  console.log('    Email: observer@agrolaw.gov.ua')
  console.log('    Password: observer123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
