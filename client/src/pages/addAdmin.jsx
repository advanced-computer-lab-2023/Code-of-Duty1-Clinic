import { Helmet } from 'react-helmet-async';

import AddAdminView from 'src/sections/admin/view/add-admin-view';

// ----------------------------------------------------------------------

export default function AddAdminPage() {
    return (
        <>
            <Helmet>
                <title> Add  Admin </title>
            </Helmet>

            <AddAdminView />
        </>
    );
}
