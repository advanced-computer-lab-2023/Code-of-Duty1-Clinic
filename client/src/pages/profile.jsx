import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import ProfileView from 'src/sections/profile/view/profileView';


// ----------------------------------------------------------------------

export default function ProfilePage() {
    const { id } = useParams();
    return (
        <>
            <Helmet>
                <title> Profile </title>
            </Helmet>

            <ProfileView userID={id} />
        </>
    );
}
