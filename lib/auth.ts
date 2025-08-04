
import { betterAuth } from 'better-auth'
import {admin} from 'better-auth/plugins'
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from '@/lib/prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  emailAndPassword:{
    enabled:true,
    requireEmailVerification:false,
    autoSignIn:false,
  },
  session:{
    expiresIn:60 * 60 * 24
  },
  plugins:[admin(),nextCookies()]
})