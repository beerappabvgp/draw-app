"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        } else {
            router.push("/signin");
        }
    }, [router]);

    return { isAuthenticated };
};
