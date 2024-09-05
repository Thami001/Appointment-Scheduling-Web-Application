"use client"

import React, {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {AppointmentForm} from "@/components/forms/appointmentForm";
import {Appointment} from "@/types/appwrite.types";

const AppointmentModal = ({type, clientId, userId, appointment} : { type: 'schedule' | 'cancel', clientId: string, userId: string, appointment?: Appointment }) => {
    const [open, setIsOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={"ghost"} className={`capitalize ${type === 'schedule' && 'text-green-500'}`}>
                    {type}
                </Button>
            </DialogTrigger>
            <DialogContent className={"shad-dialog sm:max-w-md"}>
                <DialogHeader className={"mb-4 space-y-3"}>
                    <DialogTitle className={"capitalize"}>{type} Appointment</DialogTitle>
                    <DialogDescription>
                        Please fill in the following details to {type} appointment
                    </DialogDescription>
                </DialogHeader>
                <AppointmentForm userId={userId} clientId={clientId} type={type} appointment={appointment} setIsOpen={setIsOpen} />
            </DialogContent>
        </Dialog>
    );
};

export default AppointmentModal;