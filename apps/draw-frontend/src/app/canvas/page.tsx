"use client";

import {Canvas} from "../components/canvas";
import { useAuth } from "../hooks/useAuth";

export default function Page() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <div>Please log in to access the dashboard.</div>;
    }
    return (
        <div>
            <Canvas />
        </div>
    );
}