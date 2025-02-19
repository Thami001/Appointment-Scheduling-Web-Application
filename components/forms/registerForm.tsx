"use client"

import {useRouter} from "next/navigation";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {ClientFormValidation, UserFormValidation} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {CreateUser, registerClient} from "@/lib/actions/client.actions";
import {Form, FormControl} from "@/components/ui/form";
import CustomFormField from "@/components/customFormField";
import SubmitButton from "@/components/submitButton";
import {FormFieldType} from "@/components/forms/clientForm";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {ClientFormDefaultValues, GenderOptions, IdentificationTypes, Technicians} from "@/constants";
import {Label} from "@/components/ui/label";
import {SelectItem} from "@/components/ui/select";
import Image from "next/image";
import {FileUploader} from "@/components/fileUploader";


const RegisterForm = ({user} : {user: User}) => {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof ClientFormValidation>>({
        resolver: zodResolver(ClientFormValidation),
        defaultValues: {
            ...ClientFormDefaultValues,
            name: "",
            email: "",
            phone: "",
        },
    })

    async function onSubmit(values: z.infer<typeof ClientFormValidation>) {
        setIsLoading(true)

        let formData

        if(values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]], {
                type: values.identificationDocument[0].type,
            })

            formData = new FormData();
            formData.append('blobFile', blobFile);
            formData.append('fileName', values.identificationDocument[0].name)
        }

        try {
            const clientData  = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData,
            }

            // @ts-ignore
            const client = await registerClient(clientData)

            if(client){
                router.push(`/clients/${client.$id}/new-appointment`)
            }

        }
        catch(error){
            console.log(error)
        }

        setIsLoading(false)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
                <section className={"space-y-4"}>
                    <h1 className={"header"}>
                        Welcome
                    </h1>
                    <p className={"text-dark-700"}>
                        Let us know more about yourself
                    </p>
                </section>
                <section className={"space-y-6"}>
                    <div className={"mb-9 space-y-1"}>
                        <h2 className={"sub-header"}>
                            Personal Information
                        </h2>
                    </div>
                </section>
                <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name={"name"}
                                 label={"Enter your full name here"} placeholder={"Full Name"}
                                 iconSrc={"/assets/icons/user.svg"} iconAlt={"user"}/>
                <div className={"flex flex-col gap-6 xl:flex-row"}>
                    <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name={"email"}
                                     label={"Enter your email here"} placeholder={"johndoe@gmail.com"}
                                     iconSrc={"/assets/icons/email.svg"} iconAlt={"email"}/>
                    <CustomFormField control={form.control} fieldType={FormFieldType.PHONE_INPUT} name={"phone"}
                                     label={"Enter your phone number here"} placeholder={"011 123 4567"}/>
                </div>
                <div className={"flex flex-col gap-6 xl:flex-row"}>
                    <CustomFormField control={form.control} fieldType={FormFieldType.DATE_PICKER} name={"birthDate"}
                                     label={"Date of Birth"}
                                     iconSrc={"/assets/icons/email.svg"} iconAlt={"email"}/>
                    <CustomFormField control={form.control} fieldType={FormFieldType.SKELETON} name={"gender"}
                                     label={"Gender"} renderSkeleton={(field) => (
                        <FormControl>
                            <RadioGroup className={"flex h-11 gap-6 xl:justify-between"} onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                {GenderOptions.map((option) => (
                                    <div key={option} className={"radio-group"}>
                                        <RadioGroupItem value={option} id={option}/>
                                        <Label htmlFor={option} className={"cursor-pointer"}>
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </FormControl>
                    )}/>
                </div>

                <div className={"flex flex-col gap-6 xl:flex-row"}>
                    <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name={"address"}
                                     label={"Enter your Address here"} placeholder={"2nd Avenue"}
                    />
                    <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name={"occupation"}
                                     label={"Enter your occupation here"} placeholder={"Chef"}
                    />
                </div>

                <div className={"flex flex-col gap-6 xl:flex-row"}>
                    <CustomFormField control={form.control} fieldType={FormFieldType.INPUT}
                                     name={"emergencyContactName"}
                                     label={"Emergency Contact Name"} placeholder={"In case you are unavailable"}
                                     iconSrc={"/assets/icons/email.svg"} iconAlt={"email"}/>
                    <CustomFormField control={form.control} fieldType={FormFieldType.PHONE_INPUT}
                                     name={"emergencyContactNumber"}
                                     label={"Emergency contact number"} placeholder={"012 345 6789"}/>
                </div>

                <section className={"space-y-6"}>
                    <div className={"mb-9 space-y-1"}>
                        <h2 className={"sub-header"}>
                            Home Information
                        </h2>
                    </div>
                </section>

                <CustomFormField control={form.control} fieldType={FormFieldType.SELECT} name={"primaryTechnician"}
                                 label={"primaryTechnicians"} placeholder={"Select a Technician"}
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

                <div className={"flex flex-col gap-6 xl:flex-row"}>
                    <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name={"insuranceProvider"}
                                     label={"Insurance Provider"} placeholder={"Discovery"}/>

                    <CustomFormField control={form.control} fieldType={FormFieldType.INPUT}
                                     name={"insurancePolicyNumber"} label={"Insurance Provider Number"}
                                     placeholder={"ABC123456789"}/>

                    <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name={"referral"}
                                     label={"Referral"} placeholder={"How did you hear about us"}/>
                </div>

                <section className={"space-y-6"}>
                    <div className={"mb-9 space-y-1"}>
                        <h2 className={"sub-header"}>
                            Identification and Verification
                        </h2>
                    </div>
                </section>

                <CustomFormField control={form.control} fieldType={FormFieldType.SELECT} name={"identificationType"}
                                 label={"Identification Type"} placeholder={"Select an Identification Type"}
                                 iconSrc={"/assets/icons/email.svg"} iconAlt={"email"}>
                    {IdentificationTypes.map((type) => (
                        <SelectItem value={type} key={type}>
                            {type}
                        </SelectItem>
                    ))}
                </CustomFormField>

                <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name={"identificationNumber"}
                                 label={"Identification Number"} placeholder={"0123456789"}/>

                <CustomFormField control={form.control} fieldType={FormFieldType.SKELETON}
                                 name={"IdentificationDocument"}
                                 label={"Scanned Copy of Identification Document"} renderSkeleton={(field) => (
                    <FormControl>
                        <FileUploader files={field.value} onChange={field.onChange}/>
                    </FormControl>
                )}/>

                <section className={"space-y-6"}>
                    <div className={"mb-9 space-y-1"}>
                        <h2 className={"sub-header"}>
                            Consent and Privacy
                        </h2>
                    </div>
                </section>

                <CustomFormField control={form.control} fieldType={FormFieldType.CHECKBOX} name={"appointmentConsent"} label={"I consent to having this appointment being booked"}/>

                <CustomFormField control={form.control} fieldType={FormFieldType.CHECKBOX} name={"disclosureConsent"} label={"I consent to disclosure of this information"}/>

                <CustomFormField control={form.control} fieldType={FormFieldType.CHECKBOX} name={"privacyConsent"} label={"I consent to the privacy policy"}/>


                <SubmitButton isLoading={isLoading}>
                    Get Started
                </SubmitButton>
            </form>
        </Form>
    );
}

export default RegisterForm
