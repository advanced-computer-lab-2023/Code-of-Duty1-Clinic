import { Helmet } from 'react-helmet-async';

import { MyPackageView } from 'src/sections/myPackage';

// ----------------------------------------------------------------------

export default function ViewPackagePage() {
  return (
    <>
      <Helmet>
        <title> User </title>
      </Helmet>

      <MyPackageView />
    </>
  );
}
