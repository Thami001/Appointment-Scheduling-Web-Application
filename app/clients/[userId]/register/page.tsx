import React from 'react';
import Image from "next/image";
import RegisterForm from "@/components/forms/registerForm";
import {getClient, getUser} from "@/lib/actions/client.actions";
import {redirect} from "next/navigation";

const Register = async({params: {userId}} : SearchParamProps) => {
    const user = await getUser(userId)
    const client = await getClient(userId)

    if(client){
        redirect(`/clients/${userId}/new-appointment`)
    }

    return (
        <div className={"flex h-screen max-h-screen"}>
            <section className={"remove-scrollbar container"}>
                <div className={"sub-container max-w-[860px] flex-1 flex-col py-10"}>
                    <Image src={"/assets/icons/logo-full.svg"} alt={"patient"} width={1000} height={1000}
                           className={"mb-12 h-10 w-fit"}/>
                    <RegisterForm user={user}/>
                    <p className={"copyright py-12"}>
                        Developed and owned by RecSolar
                    </p>
                </div>
            </section>
            <Image src={"/assets/images/register-img.png"} alt={"onboarding"} height={1000} width={1000}
                   className={"side-img max-w-[390px]"}/>
        </div>
    );
};

export default Register;