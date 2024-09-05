import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {getAppointments} from "@/lib/actions/appointment.actions";
import {Technicians} from "@/constants";
import {formatDateTime} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {getUser} from "@/lib/actions/client.actions";


const Success = async ({params: {userId}, searchParams}: SearchParamProps) => {
    const user = await getUser(userId)
    const appointmentId = (searchParams?.appointmentId as string) || '';
    const appointment = await getAppointments(appointmentId);
    const technician = Technicians.find((tech) => tech.name === appointment.primaryTechnician)




    return (
        <div className={"flex h-screen max-h-screen px-[5%]"}>
            <div className={"success-img"}>
                <Link href={'/'}>
                    <Image src={"/assets/icon/logo-full.svg"} alt={"logo"} width={1000} height={1000} className={"h-10 w-fit"} />
                </Link>

                <section>
                    <Image src={"/assets/gifs/success.gif"} alt={"success"} width={1000} height={1000}/>
                    <h2 className={"header mb-6 max-w-[600px] text-center"}>
                        Your <span className={"text-green-500"}>Appointment Request</span> has been successfully
                        submitted
                    </h2>
                    <p>
                        We will be in touch shortly to confirm
                    </p>
                </section>

                <section className={"request-details"}>
                    <p>
                        Requested Appointment Details:
                    </p>
                    <div className={"flex items-center gap-3"}>
                        <Image src={technician?.image!} alt={"Technician"} width={100} height={100} className={"size-6"}/>
                        <p className={"whitespace-nowrap"}>
                            {technician?.name}
                        </p>
                    </div>
                    <div className={"flex gap-2"}>
                        <Image src={"/assets/icons/calender.svg"} alt={"Calender"} height={24} width={24}/>
                        <p>
                            {formatDateTime(appointment.schedule).dateTime}
                        </p>
                    </div>
                </section>

                <Button variant={"outline"} className={"shad-primary-btn"} asChild>
                    <Link href={`/patients/${userId}/new-appointment`}>
                        New Appointment
                    </Link>
                </Button>

                <p className={"copyright"}>
                    Developed and owned by RecSolar
                </p>
            </div>
        </div>
    );
};

export default Success;