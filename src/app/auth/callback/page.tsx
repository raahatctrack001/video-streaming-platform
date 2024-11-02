import { onAuthenticateUser } from "@/app/actions/user";
import { AuthProps } from "@/app/dashboard/page";
import { redirect } from "next/navigation";

export default async function authCallback(){
    const auth: AuthProps = await onAuthenticateUser();
    if(auth.success){
        return redirect(`/dashboard/${auth.user.firstName}-${auth.user.lastName}`);
    }
    else{
        return redirect('/auth/sign-in');
    }
}