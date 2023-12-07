import { Helmet } from 'react-helmet-async';

import { ReportView } from 'src/sections/report/view';
// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Products </title>
      </Helmet>

      <ReportView />
    </>
  );
}
