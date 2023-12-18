import { Helmet } from 'react-helmet-async';
import { PackageAdmin } from 'src/sections/packageAdmin/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Manage Packages </title>
      </Helmet>

      <PackageAdmin />
    </>
  );
}
