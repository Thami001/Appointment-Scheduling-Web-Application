import Image from "next/image";

import Link from "next/link";
import ClientForm from "@/components/forms/clientForm";
import PasskeyModel from "@/components/passkeyModel";



export default function Home({searchParams} : SearchParamProps) {
    const isAdmin = searchParams.admin === 'true';

  return (
      <div className={"flex h-screen max-h-screen"}>
          {isAdmin && <PasskeyModel/>}
        <section className={"remove-scrollbar container my-auto"}>
            <div className={"sub-container max-w-[496px]"}>
                <Image src={"/assets/icons/Logo-full.svg"} alt={"patient"} width={1000} height={1000} className={"mb-12 h-10 w-fit"} />
                <ClientForm/>
                <div className={"text-14-regular mt-20 flex justify-between"}>
                    <p className={"justify-items-end text-dark-600 xl:text-left"}>
                        Developed and owned by RecSolar
                    </p>
                    <Link href={"/?admin=true"} className={"text-green-500"}>
                        Admin
                    </Link>
                </div>
            </div>
        </section>
          <Image src={"/assets/images/onboarding-img.png"} alt={"onboarding"} height={1000} width={1000} className={"side-img max-w-[50%]"} />
      </div>
  );
}
