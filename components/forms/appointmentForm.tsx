"use client"

import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form"
import {useForm} from "react-hook-form";
import CustomFormField from "@/components/customFormField";
import SubmitButton from "@/components/submitButton";
import {useState} from "react";
import {getAppointmentSchema} from "@/lib/validation";
import {useRouter} from "next/navigation";
import {FormFieldType} from "@/components/forms/clientForm";
import {Technicians} from "@/constants";
import {SelectItem} from "@/components/ui/select";
import Image from "next/image";
import {createAppointment, updateAppointment} from "@/lib/actions/appointment.actions";
import {Appointment} from "@/types/appwrite.types";


export const AppointmentForm = ({userId, clientId, type, appointment, setIsOpen} : {userId:string; clientId:string; type: "create" | "cancel" | "schedule", appointment?: Appointment, setIsOpen?: (open: boolean) => void}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);

    const AppointmentFormValidation = getAppointmentSchema(type);

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryTechnician: appointment ? appointment.primaryTechnician : "",
            schedule: appointment ? new Date(appointment?.schedule) : new Date(Date.now()),
            reason: appointment ? appointment.reason :"",
            note: appointment?.note || "",
            cancellationReason: appointment?.cancellationReason || "",
        },
    })

    const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
        setIsLoading(true)

        let status;
        switch (type) {
            case 'schedule':
                status = 'scheduled';
                break;
            case "cancel":
                status = 'cancelled';
                break;
            default:
                status = 'pending';
                break;
        }

        try {
            if(type === 'create' && clientId) {
                const appointmentData = {
                    userId,
                    client: clientId,
                    primaryTechnician: values.primaryTechnician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status
                }

                const appointment = await createAppointment(appointmentData)

                console.log(appointment)

                if(appointment){
                    form.reset();
                    router.push(`/clients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
                }
            }else {
                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment?.$id!,
                    appointment: {
                        primaryTechnician: values.primaryTechnician,
                        schedule: new Date(values.schedule),
                        status: status as Status,
                        cancellationReason: values.cancellationReason,
                    },
                    type
                }
                const updatedAppointment = await updateAppointment(appointmentToUpdate)

                if(updatedAppointment){
                    setIsOpen && setIsOpen(false)
                    form.reset()
                }
            }
        }
        catch(error){
            console.log(error)
        }

        setIsLoading(false)
    }

    let buttonLabel;

    switch (type) {
        case "create":
            buttonLabel = "Create Appointment"
            break;

            case "cancel":
                buttonLabel = "Cancel Appointment";
                break;

                case "schedule":
                    buttonLabel = "Schedule Appointment";
                    break;
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                {type === "create" && (
                    <section>
                        <h1 className={"header"}>
                            New Appointment
                        </h1>
                        <p className={"text-dark-700"}>
                            Request a new appointment
                        </p>
                    </section>
                )}

                {type !== "cancel" && (
                    <>
                        <CustomFormField control={form.control} fieldType={FormFieldType.SELECT}
                                         name={"primaryTechnician"}
                                         label={"Technicians"} placeholder={"Select a Technician"}
                                        iconSrc={"/assets/icons/email.svg"} iconAlt={"email"}>
                           {Technicians.map((technician) => (
                               <SelectItem value={technician.name} key={technician.name}>
                                   <div className={"flex cursor-pointer items-center gap-2"}>
                                       <Image src={technician.image} alt={technician.name} width={32} height={32}
                                              className={"rounded-full border border-dark-500"}/>
                                       <p>
                                           {technician.name}
                                       </p>
                                   </div>
                               </SelectItem>
                           ))}

                       </CustomFormField>
                       
                       <CustomFormField control={form.control} fieldType={FormFieldType.DATE_PICKER} name={"schedule"} label={"Expected Appointment Date"} showTimeSelect dateFormat={"dd/MM/yyyy - h:mm aa"}/>
                           <div className={"flex flex-col gap-6 xl:flex-row"}>
                               <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name={"reason"} label={"Reason for Appointment"} placeholder={"Enter Reason For Appointment"}/>

                               <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name={"note"} label={"Notes"} placeholder={"Any additional information"}/>
                           </div>
                   </>
                )}

                {type === "cancel" && (
                    <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name={"cancellationReason"} label={"Reason for Cancellation"} placeholder={"Enter Reason For Cancellation"}/>
                )}

                <SubmitButton className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`} isLoading={isLoading}>
                    {buttonLabel}
                </SubmitButton>
            </form>
        </Form>
    );
}

