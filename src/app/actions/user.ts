"use server";
import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const onAuthenticateUser = async () => {
    try {
        const user = await currentUser();
        if(!user){
            return {
                success: false,
                status: 403,
                message: "User doesn't exist"
            }
        }

        const userExists = await prisma.user.findUnique({
            where: {
                clerkId: user.id,
            },
            include: {
                workSpace: {
                    where: {
                        user: {
                            clerkId: user.id,
                        }
                    }
                }
            }
        });

        if(userExists){
            return {
                success: true,
                status: 200,
                message: "user found!",
                user: userExists,
            }
        }

        const newUser = await prisma.user.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.imageUrl,
                studio: {
                    create: {}, //takes all the default values
                },
                subscription: {
                    create: {},
                },
                workSpace: {
                    create: {
                        name: `${user.firstName}'s Workspace`,
                        type: "PERSONAL",
                    },
                },
            },
            include: {
                workSpace: {
                    where: {
                        user: {
                            clerkId: user.id,
                        },
                    },
                },
                subscription: {
                    select: {
                        plan: true,
                    },
                },
            },
        });
        if(newUser){
            return {
                success: true,
                status: 201,
                message: "user created successfully",
                user: newUser
            }
        }
        return {
            success: false,
            status: 500, 
            message: "failed to authenticate user"
        }
    } catch (error) {
        return {
            success: false,
            status: 400,
            message: "Failed to authenticate user",
            error: error,
        }
    }
}