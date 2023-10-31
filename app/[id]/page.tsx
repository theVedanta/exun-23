"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page({ params }: { params: { id: string } }) {
    useEffect(() => {
        localStorage.setItem("workspace", params.id);
        redirect("/");
    }, [params.id]);

    return;
}
