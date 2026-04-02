-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PAID', 'CANCELLED', 'PENDING');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('REGULAR', 'ADMIN');

-- CreateTable
CREATE TABLE "movie_genres" (
    "genre_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "parent_genre_id" INTEGER,

    CONSTRAINT "movie_genres_pkey" PRIMARY KEY ("genre_id")
);

-- CreateTable
CREATE TABLE "movie_rooms" (
    "movie_room_id" SERIAL NOT NULL,
    "room_number" VARCHAR(50) NOT NULL,
    "cleaning_buffer_minutes" INTEGER DEFAULT 30,

    CONSTRAINT "movie_rooms_pkey" PRIMARY KEY ("movie_room_id")
);

-- CreateTable
CREATE TABLE "movies" (
    "movie_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "poster_image_url" VARCHAR(500),
    "cached_rating" DECIMAL(3,2) DEFAULT 0.00,
    "duration_minutes" INTEGER NOT NULL,
    "last_show_date" DATE,
    "is_recommended" BOOLEAN DEFAULT false,
    "genre_id" INTEGER,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("movie_id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "rate_id" SERIAL NOT NULL,
    "rating" INTEGER,
    "user_id" INTEGER,
    "movie_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("rate_id")
);

-- CreateTable
CREATE TABLE "regular_user_profiles" (
    "user_id" INTEGER NOT NULL,
    "phone_number" VARCHAR(20),
    "newsletter_opt_in" BOOLEAN DEFAULT false,
    "preferred_genre_id" INTEGER,

    CONSTRAINT "regular_user_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "reservation_id" SERIAL NOT NULL,
    "reservation_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "user_id" INTEGER,
    "guest_emial" VARCHAR(255),
    "cancellation_token" TEXT NOT NULL,
    "show_id" INTEGER,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("reservation_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "name" "Roles" NOT NULL DEFAULT 'REGULAR',

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "seat_types" (
    "seat_type_id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "default_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "seat_types_pkey" PRIMARY KEY ("seat_type_id")
);

-- CreateTable
CREATE TABLE "seats" (
    "seat_id" SERIAL NOT NULL,
    "row_label" CHAR(1) NOT NULL,
    "seat_number" INTEGER NOT NULL,
    "movie_room_id" INTEGER NOT NULL,
    "seat_type_id" INTEGER,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("seat_id")
);

-- CreateTable
CREATE TABLE "shows" (
    "show_id" SERIAL NOT NULL,
    "start_timestamp" TIMESTAMP(6) NOT NULL,
    "movie_room_id" INTEGER,
    "movie_id" INTEGER,

    CONSTRAINT "shows_pkey" PRIMARY KEY ("show_id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "ticket_id" SERIAL NOT NULL,
    "sold_price" DECIMAL(10,2) NOT NULL,
    "reservation_id" INTEGER,
    "seat_id" INTEGER,
    "show_id" INTEGER,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "users_roles" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "users_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reservations_cancellation_token_key" ON "reservations"("cancellation_token");

-- CreateIndex
CREATE UNIQUE INDEX "seats_movie_room_id_row_label_seat_number_key" ON "seats"("movie_room_id", "row_label", "seat_number");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_show_id_seat_id_key" ON "tickets"("show_id", "seat_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_parent_genre_id_fkey" FOREIGN KEY ("parent_genre_id") REFERENCES "movie_genres"("genre_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "movie_genres"("genre_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("movie_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "regular_user_profiles" ADD CONSTRAINT "regular_user_profiles_preferred_genre_id_fkey" FOREIGN KEY ("preferred_genre_id") REFERENCES "movie_genres"("genre_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "regular_user_profiles" ADD CONSTRAINT "regular_user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("show_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_movie_room_id_fkey" FOREIGN KEY ("movie_room_id") REFERENCES "movie_rooms"("movie_room_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_seat_type_id_fkey" FOREIGN KEY ("seat_type_id") REFERENCES "seat_types"("seat_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("movie_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_movie_room_id_fkey" FOREIGN KEY ("movie_room_id") REFERENCES "movie_rooms"("movie_room_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("reservation_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("seat_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("show_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
