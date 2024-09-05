"use client"

import { ColumnDef } from "@tanstack/react-table"
import StatusBadge from "@/components/statusBadge";
import {formatDateTime} from "@/lib/utils";
import {Technicians} from "@/constants";
import Image from "next/image";
import AppointmentModal from "@/components/appointmentModal";
import {Appointment} from "@/types/appwrite.types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Appointment>[] = [
    {
        header: 'ID',
        cell:({row}) => <p className={"text-14-medium"}>{row.index + 1}</p>
    },
    {
        accessorKey: 'client',
        header: 'Client',
        cell: ({row}) => <p className={"text-14-medium"}>{row.original.client.name}</p>
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => (
            <div className={"min-w-[115px]"}>
                <StatusBadge status={row.original.status} />
            </div>
        )
    },
    {
        accessorKey: "schedule",
        header: "Appointment",
        cell: ({row}) => (
            <p className={"text-14-regular min-w-[100px]"}>
                {formatDateTime(row.original.schedule).dateTime}
            </p>
        )
    },
    {
        accessorKey: "primaryTechnician",
        header: () => 'Technician',
        cell: ({ row }) => {
            const technician = Technicians.find((tech) => tech.name === row.original.primaryTechnician)

            return (
                <div className={"flex items-center gap-3"}>
                    <Image src={technician?.image!} alt={technician?.name!} width={100} height={100} className={"size-8"}/>
                    <p className={"whitespace-nowrap"}>
                        {technician?.name}
                    </p>
                </div>
            )
        },
    },
    {
        id: "actions",
        header: () => <div className={"pl-4"} >Actions</div>,
        cell: ({ row: {original: data} }) => {
            return (
            <div className={"flex gap-1"}>
                <AppointmentModal type={'schedule'} clientId={data.client.$id} userId={data.userId} appointment={data}/>
                <AppointmentModal type={'cancel'} clientId={data.client.$id} userId={data.userId} appointment={data}/>
            </div>
            )
        },
    }
]
