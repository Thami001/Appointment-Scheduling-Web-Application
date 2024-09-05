import Image from "next/image";

import {getClient} from "@/lib/actions/client.actions";
import {AppointmentForm} from "@/components/forms/appointmentForm";

const Appointment = async({params: {userId} }: SearchParamProps) => {
    const client = await getClient(userId)

    return (
        <div className={"flex h-screen max-h-screen"}>
            <section className={"remove-scrollbar container my-auto"}>
                <div className={"sub-container max-w-[860px] flex-1 justify-between"}>
                    <Image src={"/assets/icons/Logo-full.svg"} alt={"patient"} width={1000} height={1000}
                           className={"mb-12 h-10 w-fit"}/>
                    <AppointmentForm type={"create"} userId={userId} clientId={client?.$id}/>
                    <p className={"copyright mt-10 py-12"}>
                        Developed and owned by RecSolar
                    </p>
                </div>
            </section>
            <Image src={"/assets/images/appointment-img.png"} alt={"appointment"} height={1000} width={1000}
                   className={"side-img max-w-[390px] bg-bottom"}/>
        </div>
    );
}

export default Appointment;