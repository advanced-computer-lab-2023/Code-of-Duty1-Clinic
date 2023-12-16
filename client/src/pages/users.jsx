import UsersView from "src/sections/admin/view/users-view";

import { Helmet } from 'react-helmet-async';
export default function UsersPage() {
    return (
        <>
            <Helmet>
                <title> Users </title>
            </Helmet>

            <UsersView />
        </>
    );
}