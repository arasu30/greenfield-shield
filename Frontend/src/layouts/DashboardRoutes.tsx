import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";

const DashboardRoutes = () => {
    const location = useLocation();

    // Get user from local storage to determine role
    const storedUser = localStorage.getItem('user');
    let role: 'farmer' | 'admin' | 'officer' = 'farmer';

    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            // Handle case sensitivity since backend returns uppercase roles (e.g. 'OFFICER')
            const userRole = user.role?.toLowerCase();
            if (userRole === 'admin' || userRole === 'officer' || userRole === 'farmer') {
                role = userRole;
            }
        } catch (e) {
            console.error("Failed to parse user role in DashboardRoutes", e);
        }
    }

    return (
        <DashboardLayout role={role}>
            <Outlet />
        </DashboardLayout>
    );
};

export default DashboardRoutes;
