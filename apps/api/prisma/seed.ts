import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter, errorFormat: 'pretty' });

async function main() {
  console.log('🌱 Starting database seed...');

  // ==========================================
  // 1. DICTIONARIES (Strict Constraints)
  // ==========================================

  // ROLES: Constraint check (name IN ('ADMIN', 'REGULAR'))
  const adminRole = await prisma.roles.upsert({
    where: { role_id: 1 },
    update: {},
    create: { name: 'ADMIN' },
  });

  const regularRole = await prisma.roles.upsert({
    where: { role_id: 2 },
    update: {},
    create: { name: 'REGULAR' },
  });

  // SEAT TYPES: Constraint check (name IN ('STANDARD', 'VIP'))
  const standardSeat = await prisma.seat_types.upsert({
    where: { seat_type_id: 1 },
    update: {},
    create: { name: 'STANDARD', default_price: 10.0 },
  });

  const vipSeat = await prisma.seat_types.upsert({
    where: { seat_type_id: 2 },
    update: {},
    create: { name: 'VIP', default_price: 25.0 },
  });

  // GENRES
  const actionGenre = await prisma.movie_genres.create({
    data: { name: 'Action' },
  });
  const dramaGenre = await prisma.movie_genres.create({
    data: { name: 'Drama' },
  });
  const sciFiGenre = await prisma.movie_genres.create({
    data: { name: 'Sci-Fi', parent_genre_id: actionGenre.genre_id },
  });

  console.log('✅ Dictionaries seeded');

  // ==========================================
  // 2. INFRASTRUCTURE (Rooms & Seats)
  // ==========================================

  // Create a Room
  const room1 = await prisma.movie_rooms.create({
    data: {
      room_number: 'Room A',
      cleaning_buffer_minutes: 30,
    },
  });

  // Create Seats for Room A (5 rows, 8 seats per row)
  // Constraint: UNIQUE (movie_room_id, row_label, seat_number)
  const rows = ['A', 'B', 'C', 'D', 'E'];
  for (const rowLabel of rows) {
    for (let i = 1; i <= 8; i++) {
      await prisma.seats.create({
        data: {
          row_label: rowLabel,
          seat_number: i,
          movie_room_id: room1.movie_room_id,
          // Make the last row VIP
          seat_type_id: rowLabel === 'E' ? vipSeat.seat_type_id : standardSeat.seat_type_id,
        },
      });
    }
  }
  console.log('✅ Rooms and Seats seeded');

  // ==========================================
  // 3. USERS
  // ==========================================

  const passwordHash = 'dummy_hash_value'; // In real app, use bcrypt

  // Admin User
  await prisma.users.create({
    data: {
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@cinema.com',
      password_hash: passwordHash,
      users_roles: {
        create: { role_id: adminRole.role_id },
      },
    },
  });

  // Regular User
  const regularUser = await prisma.users.create({
    data: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password_hash: passwordHash,
      users_roles: {
        create: { role_id: regularRole.role_id },
      },
      regular_user_profiles: {
        create: {
          phone_number: faker.phone.number(),
          newsletter_opt_in: true,
          preferred_genre_id: sciFiGenre.genre_id,
        },
      },
    },
  });
  console.log('✅ Users seeded');

  // ==========================================
  // 4. MOVIES & SHOWS
  // ==========================================

  const movie = await prisma.movies.create({
    data: {
      title: 'Inception',
      description:
        'A thief who steals corporate secrets through the use of dream-sharing technology...',
      duration_minutes: 148,
      poster_image_url: 'https://placehold.co/600x400',
      genre_id: sciFiGenre.genre_id,
      is_recommended: true,
      cached_rating: 4.5,
    },
  });

  // Create a Show
  const show = await prisma.shows.create({
    data: {
      movie_id: movie.movie_id,
      movie_room_id: room1.movie_room_id,
      start_timestamp: new Date(new Date().setHours(20, 0, 0, 0)), // Tonight at 8 PM
    },
  });

  // ==========================================
  // 5. TRANSACTIONS (Reservations & Ratings)
  // ==========================================

  // Rating
  // Constraint: rating CHECK (rating >= 1 AND rating <= 5)
  await prisma.ratings.create({
    data: {
      rating: 5,
      user_id: regularUser.user_id,
      movie_id: movie.movie_id,
    },
  });

  // Reservation
  // Constraint: status CHECK (status IN ('PENDING', 'PAID', 'CANCELLED'))
  const reservation = await prisma.reservations.create({
    data: {
      user_id: regularUser.user_id,
      show_id: show.show_id,
      status: 'PAID',
    },
  });

  // Ticket (Book seat A-1 for this reservation)
  // We need to fetch the exact seat ID first
  const seatToBook = await prisma.seats.findFirstOrThrow({
    where: {
      movie_room_id: room1.movie_room_id,
      row_label: 'A',
      seat_number: 1,
    },
  });

  await prisma.tickets.create({
    data: {
      reservation_id: reservation.reservation_id,
      seat_id: seatToBook.seat_id,
      sold_price: 12.5,
    },
  });

  console.log('✅ Transactions seeded');
  console.log('🌱 Seed finished successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
