import React from 'react';
import Panel from "views/examples/Panel.js";
import Profile from "views/examples/UserProfile";
import Tables from "views/examples/Tables.js";
import Settings from "views/examples/Settings.js";
import Kin from "views/examples/Kin.js";
import Children from "views/examples/Childrens.js";
import Claim from "views/examples/Claims.js";
import UserClaims from "./views/examples/UserClaims";
import Customers from "./views/examples/Customers";
import Staff from "./views/examples/Staff";

// Function to generate routes based on user's role
const generateRoutes = (role) => {
    switch (role) {
        case "user":
            return [
                {
                    path: "/index",
                    name: "Dashboard",
                    icon: "ni ni-tv-2 text-primary",
                    component: <Panel />,
                    layout: "/userpanel",
                },
                {
                    path: "/user-profile",
                    name: "User Profile",
                    icon: "ni ni-single-02 text-yellow",
                    component: <Profile />,
                    layout: "/userpanel",
                },
                {
                    path: "/children",
                    name: "Childrens",
                    icon: "fa fa-child text-blue",
                    component: <Children />,
                    layout: "/userpanel",
                },
                {
                    path: "/claims",
                    name: "Claims",
                    icon: "fa fa-file-text text-green",
                    component: <Claim />,
                    layout: "/userpanel",
                },

            ];
        case "staff":
            return [
                {
                    path: "/index",
                    name: "Dashboard",
                    icon: "ni ni-tv-2 text-primary",
                    component: <Panel />,
                    layout: "/userpanel",
                },
                {
                    path: "/userClaims",
                    name: "User Claims",
                    icon: "fa fa-file-text text-green",
                    component: <UserClaims />,
                    layout: "/userpanel",
                },
                {
                    path: "/user-profile",
                    name: "User Profile",
                    icon: "ni ni-single-02 text-yellow",
                    component: <Profile />,
                    layout: "/userpanel",
                },

            ];
        case "manager":
            return [
                {
                    path: "/index",
                    name: "Dashboard",
                    icon: "ni ni-tv-2 text-primary",
                    component: <Panel />,
                    layout: "/userpanel",
                },
                {
                    path: "/employees",
                    name: "Employees",
                    icon: "fa fa-user-secret text-blue",
                    component: <Staff />,
                    layout: "/userpanel",
                },
                {
                    path: "/user-profile",
                    name: "User Profile",
                    icon: "ni ni-single-02 text-yellow",
                    component: <Profile />,
                    layout: "/userpanel",
                },
                {
                    path: "/userClaims",
                    name: "User Claims",
                    icon: "fa fa-file-text text-green",
                    component: <UserClaims />,
                    layout: "/userpanel",
                },
            ];
        case "admin":
            return [
                {
                    path: "/index",
                    name: "Dashboard",
                    icon: "ni ni-tv-2 text-primary",
                    component: <Panel />,
                    layout: "/userpanel",
                },
                {
                    path: "/employees",
                    name: "Employees",
                    icon: "fa fa-user-secret text-blue",
                    component: <Staff />,
                    layout: "/userpanel",
                },
                {
                    path: "/userClaims",
                    name: "User Claims",
                    icon: "fa fa-file-text text-green",
                    component: <UserClaims />,
                    layout: "/userpanel",
                },
                {
                    path: "/user-profile",
                    name: "User Profile",
                    icon: "ni ni-single-02 text-yellow",
                    component: <Profile />,
                    layout: "/userpanel",
                },
            ];
        default:
            return [];
    }
};

const getRoleFromSession = () => {
    const role = sessionStorage.getItem('role');
    return role ? role : "user"; // Default to user if role is not found in session
};

// Get the user's role from session storage
const userRole = getRoleFromSession();

// Generate routes based on the user's role
const routes = generateRoutes(userRole);

export default routes;
