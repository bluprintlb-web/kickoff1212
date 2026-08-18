import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { protectedProcedure, router } from "@/server/trpc";

// JWT sessions are stateless: a session cookie can still look valid for a
// brief window right after the account behind it is deleted (deleteAccount
// deletes the User row, then signs the browser out — those two steps aren't
// atomic). Any cart upsert in that window violates Cart_userId_fkey against
// a User row that no longer exists. Surfacing that as a clean "your session
// is gone" error (instead of a raw 500) is what the caller should do with it
// anyway, since the user is about to be signed out regardless.
function staleSessionOrRethrow(err: unknown): never {
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2003"
  ) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Your session has expired. Please log in again.",
    });
  }
  throw err;
}

export const cartRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.cart.upsert({
        where: { userId: ctx.session.user.id },
        create: { userId: ctx.session.user.id },
        update: {},
        include: {
          items: {
            include: {
              variant: { include: { product: { omit: { costPrice: true } } } },
            },
          },
        },
      });
    } catch (err) {
      staleSessionOrRethrow(err);
    }
  }),

  addItem: protectedProcedure
    .input(
      z.object({
        variantId: z.string(),
        quantity: z.number().int().positive().default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const cart = await ctx.prisma.cart
        .upsert({
          where: { userId: ctx.session.user.id },
          create: { userId: ctx.session.user.id },
          update: {},
        })
        .catch(staleSessionOrRethrow);

      return ctx.prisma.cartItem.upsert({
        where: {
          cartId_variantId: { cartId: cart.id, variantId: input.variantId },
        },
        create: {
          cartId: cart.id,
          variantId: input.variantId,
          quantity: input.quantity,
        },
        update: { quantity: { increment: input.quantity } },
      });
    }),

  updateItem: protectedProcedure
    .input(z.object({ variantId: z.string(), quantity: z.number().int().min(0) }))
    .mutation(async ({ ctx, input }) => {
      const cart = await ctx.prisma.cart.findUnique({
        where: { userId: ctx.session.user.id },
      });
      if (!cart) return null;

      if (input.quantity === 0) {
        return ctx.prisma.cartItem.deleteMany({
          where: { cartId: cart.id, variantId: input.variantId },
        });
      }

      return ctx.prisma.cartItem.update({
        where: {
          cartId_variantId: { cartId: cart.id, variantId: input.variantId },
        },
        data: { quantity: input.quantity },
      });
    }),
});
