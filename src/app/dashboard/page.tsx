import { redirect } from 'next/navigation'
import { onAuthenticateUser } from "../actions/user"

export interface AuthProps{
    success: boolean,
    status: number,
    message: string,
    user?: any,
    error?: any,
}

export default async function Dashboard(){
    const auth: AuthProps = await onAuthenticateUser();
    console.log("auth console", auth)
    if(auth.success){
        return redirect(`/dashboard/${auth.user?.workspace[0]?.id}`);
    }
    else{
        return redirect('/auth/sign-in')
    }
}