import { Prisma } from '../../generated/prisma/client';

export const userWithRolesArgs = {
  include: {
    users_roles: {
      include: {
        roles: {
          select: {
            name: true,
          },
        },
      },
    },
    regular_user_profiles: {
      select: {
        newsletter_opt_in: true,
        phone_number: true,
        preferred_genre_id: true,
      },
    },
  },
} satisfies Prisma.usersDefaultArgs;

export type TUserWithRoles = Prisma.usersGetPayload<typeof userWithRolesArgs>;
