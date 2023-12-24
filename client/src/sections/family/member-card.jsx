import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';

export default function MemberCard({ member }) {
  const isRegistered = member.nationalID ? false : true;

  return (
    <Card type="section">
      <Stack direction={'row'} spacing={3} m={4} alignItems="center" justifyContent="center">
        <Stack spacing={1}>
          <Typography variant="h5" color={'Highlight'} noWrap>
            Name: {member.name}
          </Typography>
          <Typography variant="subtitle1" mb={1} noWrap>
            {isRegistered ? `UserID: ${member.userID}` : `Natioanl ID: ${member.nationalID}`}
          </Typography>
          <Typography variant="subtitle1" fontSize={18} fontFamily={'Segoe UI'}>
            Relation: {member.relation}
          </Typography>
          <Typography variant="subtitle1" noWrap>
            Gender: {member.gender}
          </Typography>
          <Typography variant="subtitle1" noWrap>
            {isRegistered ? `Phone: ${member.phone}` : `Age: ${member.age}`}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
