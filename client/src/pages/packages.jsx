import { Helmet } from 'react-helmet-async';
import { PackageView } from 'src/sections/packages/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Packages </title>
      </Helmet>

      <PackageView />
    </>
  );
}