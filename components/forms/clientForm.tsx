"use client"

import { z } from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form
} from "@/components/ui/form"
import {useForm} from "react-hook-form";
import CustomFormField from "@/components/customFormField";
import SubmitButton from "@/components/submitButton";
import {useState} from "react";
import {UserFormValidation} from "@/lib/validation";
import {useRouter} from "next/navigation";
import {CreateUser} from "@/lib/actions/client.actions";

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',

}


const ClientForm = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
        setIsLoading(true)

        try {
            const user = {
                name: values.name,
                email: values.email,
                phone: values.phone,
            }

            const newUser = await CreateUser(user)

            if(user){
                router.push(`/clients/${newUser.$id}/register`)
            }
        }
        catch(error){
            console.log(error)
        }

        setIsLoading(false)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section>
                    <h1 className={"header"}>
                        Hello There
                    </h1>
                    <p className={"text-dark-700"}>
                        Schedule your first appointment
                    </p>
                </section>
                <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name={"name"} label={"Enter your name here"} placeholder={"Full Name"} iconSrc={"/assets/icons/user.svg"} iconAlt={"user"} />
                <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name={"email"} label={"Enter your email here"} placeholder={"johndoe@gmail.com"} iconSrc={"/assets/icons/email.svg"} iconAlt={"email"} />
                <CustomFormField control={form.control} fieldType={FormFieldType.PHONE_INPUT} name={"phone"} label={"Enter your phone number here"} placeholder={"011 123 4567"} />
                <SubmitButton isLoading={isLoading}>
                    Get Started
                </SubmitButton>
            </form>
        </Form>
    );
}

export default ClientForm
