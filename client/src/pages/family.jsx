import { Helmet } from 'react-helmet-async';

import { FamilyView } from 'src/sections/family/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Add Family Member </title>
      </Helmet>

      <FamilyView />
    </>
  );
}
