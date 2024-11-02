import { redirect } from 'next/navigation'
import { onAuthenticateUser } from "../actions/user"

export interface AuthProps{
    success: Boolean,
    status: Number,
    message: String,
    user?: any,
    error?: any,
}

export default async function Dashboard(){
    const auth: AuthProps = await onAuthenticateUser();
    if(auth.success){
        return redirect(`/dashboard/${auth.user?.firstName}-${auth.user?.lastName}`)
    }
    else{
        return redirect('/auth/sign-in')
    }
}