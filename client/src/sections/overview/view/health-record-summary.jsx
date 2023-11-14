import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function HealthRecordSummary({ name, medicalRecord, sx, ...other }) {
  return (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 3,
        py: 5,
        borderRadius: 2,
        ...sx,
      }}
      {...other}
    >
      <Stack spacing={0.5}>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {medicalRecord}
        </Typography>
      </Stack>
    </Card>
  );
}

HealthRecordSummary.propTypes = {
  name: PropTypes.string.isRequired,
  medicalRecord: PropTypes.string.isRequired,
  sx: PropTypes.object,
};
