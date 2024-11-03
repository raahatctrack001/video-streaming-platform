import { currentUser } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const verifyAccessToWorkspace = async (workspaceId: string)=>{
    try{
        const user = await currentUser();
        if(!user){
            return {
                success: false,
                status: 403,
                message: "Unauthorized attempt to access workspace",
                data: undefined,
                error:undefined,
            }
        }

        const isUserInWorkspace = await prisma.workSpace.findUnique({
            where: {
                id: workspaceId,
                OR: [
                    {
                        user: {
                            clerkId: user.id,
                        },
                    },
                    {
                        members: {
                            every: {
                                user: {
                                    clerkId: user.id,
                                },
                            },
                        },
                    },
                ],
            },
        });

        if(!isUserInWorkspace){
            return {
                success: false,
                status: 404,
                message: "user doesn't exist in this workspace",
                data: undefined,
                error: undefined,
            }
        }

        return {
            success: true,
            status: 200,
            message: "User allowed to enter the workspaced",
            data: {
                workspace: isUserInWorkspace,
            },
            error: undefined,
        }
    }
    catch(error){
        return {
            success: false,
            status: 500,
            message: "User cannot enter in unauthorized workspace",
            data: {
                workspace: null,
            },
            error: error as Error
        }
    }
}

export const getWorksapceFolders = async (workspaceId: string)=>{
    try {
        const isFolder = await prisma.folder.findMany({
            where: {
                workSpaceId: workspaceId,
            },
            include: {
                _count: {
                    select: {
                        videos: true,
                    },
                },
            },
        })

        if(isFolder && isFolder.length > 0){
            return {
                status: 200,
                message: "folders fetched",
                data: isFolder,
            }
        }
        return {
            status: 404,
            message: "unable to fetch folders",
            data: []
        }
    } catch (error) {
        return {
            status: 500,
            message: "falied to fetch folders",
            data: [],
        }
    }
}

export const getUserVideos = async (workspaceId: string)=>{
    try {
        const user = await currentUser();
        if(!user){
            return {
                status: 404,
                message: "user not found",
                data: undefined,
            }
        }

        const videos = await prisma.video.findMany({
            where: {
                OR: [
                    {workSpaceId: workspaceId},
                    {folderId: workspaceId},
                ],
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                source: true,
                processing: true,
                folder: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc'
            },            
        });

        if(videos && videos.length > 0){
            return {
                status: 200,
                message: "videos fetched",
                data: videos
            }
        }

        return {
            status: 404,
            message: "failed to fetch video",
            data: []
        }

    } catch (error) {
        return {
            status: 404,
            message: "something went wrong",
            error
        }
    }
}

export const getWorkspaces = async ()=>{
    try {
        const user = await currentUser();
        if(!user)   return {success: false, status:404}

        const workspaces = await prisma.user.findUnique({
            where: {
                clerkId: user.id,
            },
            select: {
                subscription: {
                    select: {
                        plan: true,
                    },
                },
                workSpace: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                    },
                },
                members: {
                    select: {
                        workSpace: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                            },
                        },
                    },
                },
            },
        });

        if(workspaces){
            return {
                success: true,
                status: 200,
                data: workspaces,
            }
        }

        return {
            success: false,
            status: 404,
            data: []
        }
    } catch (error) {
        return {
            success: false,
            status: 500,
        }
    }
}


export const getNotifications = async () => {
    try {
      const user = await currentUser()
      if (!user) return { status: 404 }
      const notifications = await prisma.user.findUnique({
        where: {
          clerkId: user.id,
        },
        select: {
          notification: true,
          _count: {
            select: {
              notification: true,
            },
          },
        },
      });
  
      if (notifications && notifications.notification.length > 0)
        return { success: true, status: 200, data: notifications }
      return { success: false, status: 404, data: [] }
    } catch (error) {
      return { success: false, status: 400, data: [] }
    }
  }