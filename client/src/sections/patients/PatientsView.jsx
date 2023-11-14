import {SubscriptionCard} from './components/more_components'

import React from 'react';
import axios from 'axios';
import { makeStyles } from '@mui/styles';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountCircle, LocalHospital, Description, EventNote, People, CreditCard } from '@mui/icons-material';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  activeTab: {
    backgroundColor: theme.palette.action.selected,
  },
}));

const PatientsView = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState('doctors');
  const [Packages, setPackages] = useState([]);


  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/payment/prices');
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'doctors':
        return <div>Doctors Content</div>;
      case 'prescriptions':
        return <div>Prescriptions Content</div>;
      case 'appointments':
        return <div>Appointments Content</div>;
      case 'familyMembers':
        return <div>Family Members Content</div>;
      case 'subscriptions':
        return (
        <div>
          <Typography variant="h4" gutterBottom>
            Subscriptions
          </Typography>
          <div style={{ display: 'flex', gap: '16px' }}>
            {Packages.map((Package) => (
              <SubscriptionCard
                Package = {Package}
              />
            ))}
          </div>
        </div>
      );
      default:
        return null;
    }
  };
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Patient Page
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button 
            onClick ={()=>handleTabClick('doctors')} 
            className={activeTab === 'doctors' ? classes.activeTab: ''}>
              <ListItemIcon>
                <LocalHospital />
              </ListItemIcon>
              <ListItemText primary="Doctors" />
            </ListItem>
            <ListItem button
             onClick ={()=>handleTabClick('prescriptions')} 
             className={activeTab === 'prescriptions' ? classes.activeTab: ''}>
              <ListItemIcon>
                <Description />
              </ListItemIcon>
              <ListItemText primary="Prescriptions" />
            </ListItem>
            <ListItem button
            onClick ={()=>handleTabClick('Appointments')} 
            className={activeTab === 'Appointments' ? classes.activeTab: ''}>
              <ListItemIcon>
                <EventNote />
              </ListItemIcon>
              <ListItemText primary="Appointments" />
            </ListItem>
            <ListItem button
            onClick ={()=>handleTabClick('Family Members')} 
            className={activeTab === 'Family Members' ? classes.activeTab: ''}>
              <ListItemIcon>
                <People />
              </ListItemIcon>
              <ListItemText primary="Family Members" />
            </ListItem>
            <ListItem button
            onClick ={()=>handleTabClick('Subscriptions')} 
            className={activeTab === 'Subscriptions' ? classes.activeTab: ''}>
              <ListItemIcon>
                <CreditCard />
              </ListItemIcon>
              <ListItemText primary="Subscriptions" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {renderContent()}
      </main>
    </div>
  );
};

export default PatientsView;