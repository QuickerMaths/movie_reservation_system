import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../src/prisma/prisma.service';
import { Prisma, ReservationStatus } from '../generated/prisma/client';

const prisma = new PrismaService();

// Tune these to generate more/less data.
const MOVIE_COUNT = 60; // grid paginates at 12/page  -> ~5 pages
const RECOMMENDED_RATIO = 0.55; // recommended paginates at 8/page
const REGULAR_USER_COUNT = 12;
const PRIMARY_USER_RESERVATIONS = 16; // reservations list paginates at 5/page -> ~4 pages
const ROWS = ['A', 'B', 'C', 'D', 'E'];
const SEATS_PER_ROW = 8;

const CURATED_TITLES = [
  'The Matrix',
  'Inception',
  'Interstellar',
  'Blade Runner 2049',
  'The Dark Knight',
  'Dune',
  'Arrival',
  'Gladiator',
  'The Prestige',
  'Whiplash',
  'Parasite',
  'La La Land',
  'Mad Max: Fury Road',
  'The Grand Budapest Hotel',
  'No Country for Old Men',
];

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function resetDatabase() {
  // Delete children before parents to respect foreign keys.
  await prisma.tickets.deleteMany();
  await prisma.ratings.deleteMany();
  await prisma.reservations.deleteMany();
  await prisma.shows.deleteMany();
  await prisma.seats.deleteMany();
  await prisma.movie_rooms.deleteMany();
  await prisma.movies.deleteMany();
  await prisma.regular_user_profiles.deleteMany();
  await prisma.users_roles.deleteMany();
  await prisma.users.deleteMany();
  await prisma.seat_types.deleteMany();
  await prisma.roles.deleteMany();
  await prisma.movie_genres.deleteMany();
  console.log('🧹 Existing data cleared');
}

async function main() {
  console.log('🌱 Starting database seed...');

  await resetDatabase();

  // ==========================================
  // 1. DICTIONARIES
  // ==========================================
  const adminRole = await prisma.roles.create({ data: { name: 'ADMIN' } });
  const regularRole = await prisma.roles.create({ data: { name: 'REGULAR' } });

  const standardSeat = await prisma.seat_types.create({
    data: { name: 'STANDARD', default_price: 10.0 },
  });
  const vipSeat = await prisma.seat_types.create({
    data: { name: 'VIP', default_price: 25.0 },
  });

  const genreNames = [
    'Action',
    'Drama',
    'Sci-Fi',
    'Comedy',
    'Horror',
    'Thriller',
    'Romance',
    'Animation',
  ];
  const genres = [];
  for (const name of genreNames) {
    genres.push(await prisma.movie_genres.create({ data: { name } }));
  }
  console.log(`✅ Dictionaries seeded (${genres.length} genres)`);

  // ==========================================
  // 2. INFRASTRUCTURE (Rooms & Seats)
  // ==========================================
  const rooms = [];
  for (const label of ['Room A', 'Room B', 'Room C']) {
    rooms.push(
      await prisma.movie_rooms.create({
        data: { room_number: label, cleaning_buffer_minutes: 30 },
      }),
    );
  }

  const seatData: Prisma.seatsCreateManyInput[] = [];
  for (const room of rooms) {
    for (const rowLabel of ROWS) {
      for (let i = 1; i <= SEATS_PER_ROW; i++) {
        seatData.push({
          row_label: rowLabel,
          seat_number: i,
          movie_room_id: room.movie_room_id,
          // Last row is VIP.
          seat_type_id: rowLabel === 'E' ? vipSeat.seat_type_id : standardSeat.seat_type_id,
        });
      }
    }
  }
  await prisma.seats.createMany({ data: seatData });
  console.log(`✅ ${rooms.length} rooms and ${seatData.length} seats seeded`);

  // ==========================================
  // 3. USERS
  // ==========================================
  const passwordHash = await bcrypt.hash('Password123!', 10);

  await prisma.users.create({
    data: {
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@cinema.com',
      password_hash: passwordHash,
      users_roles: { create: { role_id: adminRole.role_id } },
    },
  });

  // Primary regular user with a known login and many reservations to test pagination.
  const primaryUser = await prisma.users.create({
    data: {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'user@cinema.com',
      password_hash: passwordHash,
      users_roles: { create: { role_id: regularRole.role_id } },
      regular_user_profiles: {
        create: {
          phone_number: `+1${faker.string.numeric(9)}`,
          newsletter_opt_in: true,
          preferred_genre_id: faker.helpers.arrayElement(genres).genre_id,
        },
      },
    },
  });

  for (let i = 0; i < REGULAR_USER_COUNT; i++) {
    await prisma.users.create({
      data: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: `user${i + 1}@cinema.com`,
        password_hash: passwordHash,
        users_roles: { create: { role_id: regularRole.role_id } },
        regular_user_profiles: {
          create: {
            phone_number: `+1${faker.string.numeric(9)}`,
            newsletter_opt_in: faker.datatype.boolean(),
            preferred_genre_id: faker.helpers.arrayElement(genres).genre_id,
          },
        },
      },
    });
  }
  console.log(`✅ ${REGULAR_USER_COUNT + 2} users seeded (admin@cinema.com / user@cinema.com)`);

  // ==========================================
  // 4. MOVIES
  // ==========================================
  const today = startOfDay(new Date());
  const movieIds: number[] = [];

  for (let i = 0; i < MOVIE_COUNT; i++) {
    const title =
      i < CURATED_TITLES.length
        ? CURATED_TITLES[i]
        : `${faker.commerce.productAdjective()} ${faker.commerce.product()}`;

    const movie = await prisma.movies.create({
      data: {
        title,
        description: faker.lorem.paragraph(),
        duration_minutes: faker.number.int({ min: 85, max: 190 }),
        poster_image_url: `https://picsum.photos/seed/movie-${i}/600/400`,
        genre_id: faker.helpers.arrayElement(genres).genre_id,
        is_recommended: faker.datatype.boolean(RECOMMENDED_RATIO),
        cached_rating: faker.number.float({ min: 3, max: 9.9, fractionDigits: 2 }),
        // Must be in the future so it passes the active-movie filter in the grid.
        last_show_date: addDays(today, faker.number.int({ min: 3, max: 90 })),
      },
    });
    movieIds.push(movie.movie_id);
  }
  console.log(`✅ ${movieIds.length} movies seeded`);

  // ==========================================
  // 5. SHOWS (today -> +6 days, several times per movie)
  // ==========================================
  const showTimes = [12, 15, 18, 21]; // hours of day
  const showData: Prisma.showsCreateManyInput[] = [];

  for (const movieId of movieIds) {
    // 2 random days within the next week, 2 random times each.
    const days = faker.helpers.arrayElements([0, 1, 2, 3, 4, 5, 6], 2);
    for (const day of days) {
      const times = faker.helpers.arrayElements(showTimes, 2);
      for (const hour of times) {
        const start = addDays(today, day);
        start.setHours(hour, 0, 0, 0);
        showData.push({
          movie_id: movieId,
          movie_room_id: faker.helpers.arrayElement(rooms).movie_room_id,
          start_timestamp: start,
        });
      }
    }
  }
  await prisma.shows.createMany({ data: showData });
  const shows = await prisma.shows.findMany({ select: { show_id: true } });
  console.log(`✅ ${shows.length} shows seeded`);

  // ==========================================
  // 6. RESERVATIONS + TICKETS for the primary user
  // ==========================================
  const statuses: ReservationStatus[] = [
    ReservationStatus.PAID,
    ReservationStatus.PENDING,
    ReservationStatus.CANCELLED,
  ];
  const anySeat = await prisma.seats.findFirstOrThrow();

  for (let i = 0; i < PRIMARY_USER_RESERVATIONS; i++) {
    const show = faker.helpers.arrayElement(shows);
    const status = faker.helpers.arrayElement(statuses);

    const reservation = await prisma.reservations.create({
      data: {
        user_id: primaryUser.user_id,
        show_id: show.show_id,
        status,
        // Spread reservation_date over the past ~40 days so sorting is meaningful.
        reservation_date: faker.date.recent({ days: 40 }),
        seats_snapshot: [
          {
            seat_id: anySeat.seat_id,
            row: anySeat.row_label,
            number: anySeat.seat_number,
            type: 'STANDARD',
            price: 12.5,
          },
        ],
      },
    });

    if (status !== ReservationStatus.CANCELLED) {
      await prisma.tickets.create({
        data: {
          reservation_id: reservation.reservation_id,
          seat_id: anySeat.seat_id,
          show_id: show.show_id,
          sold_price: 12.5,
        },
      });
    }
  }
  console.log(`✅ ${PRIMARY_USER_RESERVATIONS} reservations seeded for user@cinema.com`);

  // ==========================================
  // 7. RATINGS
  // ==========================================
  for (let i = 0; i < 30; i++) {
    await prisma.ratings.create({
      data: {
        rating: faker.number.int({ min: 1, max: 5 }),
        user_id: primaryUser.user_id,
        movie_id: faker.helpers.arrayElement(movieIds),
      },
    });
  }
  console.log('✅ Ratings seeded');

  console.log('\n🌱 Seed finished successfully');
  console.log('   Login:  admin@cinema.com / Password123!  (admin)');
  console.log('   Login:  user@cinema.com  / Password123!  (has reservations)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
