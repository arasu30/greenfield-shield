import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";

const DashboardRoutes = () => {
    const location = useLocation();

    // Determine the role for the layout based on the path if needed, 
    // or just default to farmer. For now, we'll keep it flexible.
    // The role prop in DashboardLayout can be enhanced later if needed.

    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
};

export default DashboardRoutes;
