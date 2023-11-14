import { Helmet } from 'react-helmet-async';

import { AddFamilyView } from 'src/sections/addFamily/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Add Family Member </title>
      </Helmet>

      <AddFamilyView />
    </>
  );
}