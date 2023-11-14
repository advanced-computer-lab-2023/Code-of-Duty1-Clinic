import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import AddSlots from '../AddSlots';
import ScheduleFollowUp from '../ScheduleApp';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SwitchComponent = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Add Slots" />
          <Tab label="Schedule Follow-Up" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <AddSlots />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ScheduleFollowUp />
      </TabPanel>
    </Box>
  );
};

export default SwitchComponent;
