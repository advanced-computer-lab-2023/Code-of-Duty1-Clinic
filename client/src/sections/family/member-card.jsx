import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

import { axiosInstance } from '../../utils/axiosInstance';

export default function MemberCard({ member }) {
  return (
    <Card type="section">
      <Stack direction={'row'} spacing={3} m={4}>
        <Stack spacing={0} alignItems="center" justifyContent="center">
          <Typography variant="h5" color={'Highlight'} noWrap>
            Dr. {doctor.name}
          </Typography>
          <Typography variant="subtitle1" noWrap>
            Specialty: {doctor.specialty}
          </Typography>
          <Typography variant="subtitle1" noWrap>
            Education: {doctor.educationBackground}
          </Typography>
          <Typography variant="subtitle1" mb={1} noWrap>
            Hospital: {doctor.hospital}
          </Typography>
          <Typography variant="subtitle1" fontSize={18} fontFamily={'Segoe UI'}>
            Hourly Rate: {doctor.hourRate}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
