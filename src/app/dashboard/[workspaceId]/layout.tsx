import { onAuthenticateUser } from "@/app/actions/user";
import { 
    getNotifications,
    getUserVideos, 
    getWorksapceFolders, 
    getWorkspaces, 
    verifyAccessToWorkspace 
} from "@/app/actions/workspace";
import { redirect } from "next/navigation";
import React from "react";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'

interface Props {
    params: {workspaceId: string},
    children: React.ReactNode,
}

interface hasAccessType {
    success: boolean;
    status: number;
    message: string;
    data?: { workspace: any } | undefined;
    error?: Error | undefined;
}

export default async function Layout({ params: { workspaceId }, children }: Props) {
    const auth = await onAuthenticateUser();

    if (!(auth.user?.workSpace && auth.user?.workSpace.length)) {
        redirect('/auth/sign-in');
    }

    // Await the result of verifyAccessToWorkspace
    const hasAccess: hasAccessType = await verifyAccessToWorkspace(workspaceId);
    if (!hasAccess.success) {
        redirect(`/daashboard/${auth.user?.workSpace[0].id}`)
    }

    if(!hasAccess.data?.workspace)
            return null;
    
    const query = new QueryClient();
    await query.prefetchQuery({
        queryKey: ["workspace-folders"],
        queryFn:()=>getWorksapceFolders(workspaceId),
    })

    await query.prefetchQuery({
        queryKey: ["user-videos"],
        queryFn: ()=>getUserVideos(workspaceId),
    })

    await query.prefetchQuery({
        queryKey: ["user-workspaces"],
        queryFn: ()=>getWorkspaces(),
    })

    await query.prefetchQuery({
        queryKey: ["user-notification"],
        queryFn: ()=>getNotifications(),
    })
   
    return <div>{children}</div>;
}
