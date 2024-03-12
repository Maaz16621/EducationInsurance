/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Panel from "views/examples/Panel.js";
import Profile from "views/examples/UserProfile";
import Tables from "views/examples/Tables.js";
import Settings from "views/examples/Settings.js";
import Kin from "views/examples/Kin.js";
import Children from "views/examples/Childrens.js";
import Claim from "views/examples/Claims.js";
import UserClaims from "./views/examples/UserClaims";

var routes = [
    {
        path: "/index",
        name: "Dashboard",
        icon: "ni ni-tv-2 text-primary",
        component: <Panel />,
        layout: "/admin",
    },
    {
        path: "/tables",
        name: "Tables",
        icon: "ni ni-bullet-list-67 text-red",
        component: <Tables />,
        layout: "/admin",
    },
    {
        path: "/settings",
        name: "Settings",
        icon: "ni ni-settings-gear text-primary",
        component: <Settings />,
        layout: "/admin",
    },
  
    {
        path: "/user-profile",
        name: "User Profile",
        icon: "ni ni-single-02 text-yellow",
        component: <Profile />,
        layout: "/admin",
    },
    {
        path: "/kin",
        name: "Kin Details",
        icon: "fa fa-users text-red",
        component: <Kin />,
        layout: "/admin",
    },
    {
        path: "/children",
        name: "Childrens",
        icon: "fa fa-child text-blue",
        component: <Children />,
        layout: "/admin",
    },
    {
        path: "/claims",
        name: "Claims",
        icon: "fa fa-file-text text-green",
        component: <Claim />,
        layout: "/admin",
    },{
        path: "/userClaims",
        name: "User Claims",
        icon: "fa fa-file-text text-green",
        component: <UserClaims />,
        layout: "/admin",
    },
];

export default routes;


